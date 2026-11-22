// Recovers JSX source modules from the Vinext SSR page bundle.
// Usage: node decompile.mjs <page-bundle.js> <out-dir>
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse } from "@babel/parser";
import traverseMod from "@babel/traverse";
import generateMod from "@babel/generator";
import * as t from "@babel/types";
import * as prettier from "prettier";

const traverse = traverseMod.default ?? traverseMod;
const generate = generateMod.default ?? generateMod;

const [, , bundlePath, outDir] = process.argv;
const src = readFileSync(bundlePath, "utf8");

// ---- split into regions -------------------------------------------------
const lines = src.split("\n");
const regions = [];
let cur = null;
for (const line of lines) {
  const m = line.match(/^\/\/#region (.*)$/);
  if (m) { cur = { name: m[1], lines: [] }; continue; }
  if (line.startsWith("//#endregion")) { regions.push(cur); cur = null; continue; }
  if (cur) cur.lines.push(line);
}
const appRegions = regions.filter((r) => r.name.startsWith("app/"));
const lucideCode = regions.filter((r) => r.name.includes("lucide-react")).map((r) => r.lines.join("\n")).join("\n");
// icon variable name -> lucide export name (PascalCase of the kebab id, which is the variable name itself)
const iconNames = new Set([...lucideCode.matchAll(/^var ([A-Z][A-Za-z0-9]*) = createLucideIcon\(/gm)].map((m) => m[1]));

// ---- JSX reconstruction -------------------------------------------------
const isRuntimeCall = (callee, names) =>
  t.isSequenceExpression(callee) && callee.expressions.length === 2 &&
  t.isNumericLiteral(callee.expressions[0], { value: 0 }) &&
  t.isMemberExpression(callee.expressions[1]) &&
  t.isIdentifier(callee.expressions[1].object, { name: "import_jsx_runtime" }) &&
  names.includes(callee.expressions[1].property.name);

const isFragmentRef = (n) => t.isMemberExpression(n) && t.isIdentifier(n.object, { name: "import_jsx_runtime" }) && t.isIdentifier(n.property, { name: "Fragment" });

function toJsxName(node) {
  if (t.isStringLiteral(node)) return t.jsxIdentifier(node.value);
  if (t.isIdentifier(node)) return t.jsxIdentifier(node.name);
  if (t.isMemberExpression(node) && !node.computed) return t.jsxMemberExpression(toJsxName(node.object), t.jsxIdentifier(node.property.name));
  return null;
}

const safeText = (s) => s.length > 0 && !/[{}<>]/.test(s) && s.trim() === s && !s.includes("\n");

function toChild(node) {
  if (t.isJSXElement(node) || t.isJSXFragment(node)) return node;
  if (t.isStringLiteral(node) && safeText(node.value)) return t.jsxText(node.value);
  return t.jsxExpressionContainer(node);
}

function attrValue(v) {
  if (t.isStringLiteral(v) && !/["\\\n]/.test(v.value)) return t.stringLiteral(v.value);
  if (t.isBooleanLiteral(v, { value: true })) return null; // shorthand
  return t.jsxExpressionContainer(v);
}

function buildJsx(call) {
  const [type, props, key] = call.arguments;
  const fragment = isFragmentRef(type);
  const name = fragment ? null : toJsxName(type);
  if (!fragment && !name) return null;
  const attrs = [];
  let children = [];
  if (props && !t.isObjectExpression(props)) return null;
  for (const p of props?.properties ?? []) {
    if (t.isSpreadElement(p)) { attrs.push(t.jsxSpreadAttribute(p.argument)); continue; }
    if (!t.isObjectProperty(p) || p.computed) return null;
    const k = t.isIdentifier(p.key) ? p.key.name : t.isStringLiteral(p.key) ? p.key.value : null;
    if (k == null) return null;
    if (k === "children") {
      const v = p.value;
      children = t.isArrayExpression(v) && call.callee.expressions[1].property.name === "jsxs"
        ? v.elements.map(toChild)
        : [toChild(v)];
      continue;
    }
    attrs.push(t.jsxAttribute(t.jsxIdentifier(k), attrValue(p.value)));
  }
  if (key) attrs.unshift(t.jsxAttribute(t.jsxIdentifier("key"), attrValue(key)));
  if (fragment) {
    if (attrs.length) { // keyed fragment -> <Fragment key>
      return t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier("Fragment"), attrs), t.jsxClosingElement(t.jsxIdentifier("Fragment")), children);
    }
    return t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), children);
  }
  const selfClosing = children.length === 0;
  return t.jsxElement(
    t.jsxOpeningElement(name, attrs, selfClosing),
    selfClosing ? null : t.jsxClosingElement(t.cloneNode(name)),
    children,
    selfClosing,
  );
}

// ---- per-region conversion ----------------------------------------------
const modules = [];
for (const r of appRegions) {
  const code = r.lines.join("\n");
  const ast = parse(code, { sourceType: "module", plugins: ["jsx"] });
  const reactNames = new Set();
  let usesFragmentEl = false;
  traverse(ast, {
    // drop the runtime bindings the bundler inserted
    VariableDeclarator(path) {
      const init = path.node.init;
      if (t.isIdentifier(path.node.id) && ["import_jsx_runtime", "import_react"].includes(path.node.id.name)) {
        const decl = path.parentPath;
        if (decl.node.declarations.length === 1) decl.remove(); else path.remove();
      }
    },
    CallExpression: {
      exit(path) {
        if (isRuntimeCall(path.node.callee, ["jsx", "jsxs"])) {
          const el = buildJsx(path.node);
          if (el) {
            if (t.isJSXElement(el) && t.isJSXIdentifier(el.openingElement.name, { name: "Fragment" })) usesFragmentEl = true;
            path.replaceWith(el);
          }
        } else if (t.isSequenceExpression(path.node.callee) && path.node.callee.expressions.length === 2 &&
          t.isMemberExpression(path.node.callee.expressions[1]) &&
          t.isIdentifier(path.node.callee.expressions[1].object, { name: "import_react" })) {
          const n = path.node.callee.expressions[1].property.name;
          reactNames.add(n);
          path.node.callee = t.identifier(n);
        }
      },
    },
    MemberExpression(path) {
      if (t.isIdentifier(path.node.object, { name: "import_react" }) && !path.node.computed) {
        reactNames.add(path.node.property.name);
        path.replaceWith(t.identifier(path.node.property.name));
      }
    },
  });
  if (usesFragmentEl) reactNames.add("Fragment");
  // (0, fn)(...) -> fn(...)
  traverse(ast, {
    CallExpression(path) {
      const c = path.node.callee;
      if (t.isSequenceExpression(c) && c.expressions.length === 2 && t.isNumericLiteral(c.expressions[0], { value: 0 }) &&
        (t.isIdentifier(c.expressions[1]) || t.isMemberExpression(c.expressions[1]))) path.node.callee = c.expressions[1];
    },
  });
  // var -> const/let based on whether the binding is ever reassigned
  traverse(ast, {
    VariableDeclaration(path) {
      if (path.node.kind !== "var") return;
      const constant = path.node.declarations.every((d) => t.isIdentifier(d.id) && path.scope.getBinding(d.id.name)?.constant && d.init);
      path.node.kind = constant ? "const" : "let";
    },
  });
  // remove all comments (only bundler /* @__PURE__ */ markers remain in app code)
  traverse(ast, { enter(p) { t.removeComments(p.node); } });
  t.removeComments(ast.program);
  // lucide icon definitions the bundler inlined into app regions -> import from lucide-react
  ast.program.body = ast.program.body.filter((st) => {
    if (t.isVariableDeclaration(st) && st.declarations.length === 1 && t.isCallExpression(st.declarations[0].init) &&
      t.isIdentifier(st.declarations[0].init.callee, { name: "createLucideIcon" })) {
      iconNames.add(st.declarations[0].id.name);
      return false;
    }
    return true;
  });
  modules.push({ name: r.name, ast, reactNames });
}

// ---- cross-module imports/exports ---------------------------------------
const declaredIn = new Map();
for (const m of modules) {
  m.decls = new Set();
  for (const s of m.ast.program.body) {
    if (t.isFunctionDeclaration(s) && s.id) m.decls.add(s.id.name);
    if (t.isVariableDeclaration(s)) for (const d of s.declarations) if (t.isIdentifier(d.id)) m.decls.add(d.id.name);
    if (t.isClassDeclaration(s) && s.id) m.decls.add(s.id.name);
  }
  for (const d of m.decls) declaredIn.set(d, m);
}
const exportsOf = new Map(modules.map((m) => [m, new Set()]));
for (const m of modules) {
  const globals = new Set();
  traverse(m.ast, {
    Program(path) { path.scope.crawl(); for (const g of Object.keys(path.scope.globals)) globals.add(g); },
    JSXOpeningElement(path) {
      const n = path.node.name;
      if (t.isJSXIdentifier(n) && /^[A-Z]/.test(n.name) && !path.scope.hasBinding(n.name)) globals.add(n.name);
      if (t.isJSXMemberExpression(n)) { let o = n; while (t.isJSXMemberExpression(o)) o = o.object; if (!path.scope.hasBinding(o.name)) globals.add(o.name); }
    },
  });
  m.imports = new Map(); // module -> names
  m.icons = new Set();
  m.unresolved = new Set();
  for (const g of globals) {
    if (m.reactNames.has(g)) continue;
    if (iconNames.has(g)) { m.icons.add(g); continue; }
    const owner = declaredIn.get(g);
    if (owner && owner !== m) {
      if (!m.imports.has(owner)) m.imports.set(owner, new Set());
      m.imports.get(owner).add(g);
      exportsOf.get(owner).add(g);
    } else if (!owner) m.unresolved.add(g);
  }
}

const fileOf = (m) => m.name.replace(/^app\//, "").replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js");
const rel = (from, to) => "./" + fileOf(to).replace(/\.(jsx|js)$/, "");

mkdirSync(outDir, { recursive: true });
const report = [];
for (const m of modules) {
  const out = [];
  const reactList = [...m.reactNames].sort();
  if (reactList.length) out.push(`import { ${reactList.join(", ")} } from "react";`);
  if (m.icons.size) out.push(`import { ${[...m.icons].sort().join(", ")} } from "lucide-react";`);
  for (const [owner, names] of m.imports) out.push(`import { ${[...names].sort().join(", ")} } from "${rel(m, owner)}";`);
  // export markers
  const ex = exportsOf.get(m);
  const body = m.ast.program.body.filter((s) => !(t.isExportNamedDeclaration(s) && !s.declaration));
  m.ast.program.body = body.map((s) => {
    const names = t.isFunctionDeclaration(s) ? [s.id?.name] : t.isVariableDeclaration(s) ? s.declarations.map((d) => d.id.name) : [];
    if (names.some((n) => ex.has(n))) return t.exportNamedDeclaration(s, []);
    return s;
  });
  if (m.name === "app/page.tsx") m.ast.program.body.push(t.exportDefaultDeclaration(t.identifier("HomePage")));
  const code = generate(m.ast, { comments: false, jsescOption: { minimal: true } }).code;
  const header = `// Recovered from the Deal Line production build (${m.name}). Types were stripped by the build and are not recoverable.\n`;
  const full = header + out.join("\n") + "\n\n" + code + "\n";
  const pretty = await prettier.format(full, { parser: "babel", printWidth: 110 });
  const file = join(outDir, fileOf(m));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, pretty);
  report.push({ module: m.name, file: fileOf(m), exports: [...ex].length, icons: m.icons.size, unresolved: [...m.unresolved] });
}
console.log(JSON.stringify(report, null, 2));
