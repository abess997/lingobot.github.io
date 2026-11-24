import { AuthorizationError, CimdFetchError, type ConsentDescription } from "@cloudflare/workers-oauth-provider";
import { randomToken, safeEqual, sha256b64url, sign, verify } from "./crypto";
import type { Env } from "./env";
import { fmtTime, listAccounts, storeImage, tweetUrl } from "./publish";
import { X_AUTHORIZE_URL, X_SCOPES, exchangeCode, saveAccount } from "./x";

const SESSION_COOKIE = "__Host-xmcp-session";
const SESSION_DAYS = 14;

export const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
export const originOf = (req: Request, env: Env) => (env.PUBLIC_URL || new URL(req.url).origin).replace(/\/$/, "");

const SECURITY_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": "no-store",
};

function page(title: string, body: string, headers: HeadersInit = {}, status = 200): Response {
  const h = new Headers(SECURITY_HEADERS);
  new Headers(headers).forEach((v, k) => h.set(k, v));
  return new Response(
    `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${CSS}</style></head><body><main>${body}</main></body></html>`,
    { status, headers: h },
  );
}

const CSS = `
:root{--bg:#f6f7f9;--card:#fff;--ink:#14171a;--muted:#5b6670;--line:#e3e7eb;--accent:#0f766e;--accent-ink:#fff;--danger:#b42318}
@media (prefers-color-scheme:dark){:root{--bg:#0e1113;--card:#171b1f;--ink:#e8ecef;--muted:#9aa5ae;--line:#2a3036;--accent:#2dd4bf;--accent-ink:#06201d;--danger:#f97066}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif}
main{max-width:760px;margin:0 auto;padding:24px 16px 64px}
h1{font-size:1.6rem;margin:.2em 0}h2{font-size:1.1rem;margin:0 0 .6em}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;margin:16px 0}
.muted{color:var(--muted);font-size:.92rem}
.row{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:10px 0;border-top:1px solid var(--line)}
.row:first-of-type{border-top:0}
button,.btn{font:inherit;border:0;border-radius:10px;padding:9px 16px;background:var(--accent);color:var(--accent-ink);cursor:pointer;text-decoration:none;display:inline-block}
button.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}button.danger{background:transparent;color:var(--danger);border:1px solid var(--line)}
input[type=password],input[type=text],input[type=file]{font:inherit;width:100%;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink)}
code,.mono{font-family:ui-monospace,Menlo,Consolas,monospace;direction:ltr;unicode-bidi:embed}
.link{display:flex;gap:8px}.link input{direction:ltr}
.flash{background:color-mix(in srgb,var(--accent) 14%,transparent);border-radius:10px;padding:10px 14px}
.err{background:color-mix(in srgb,var(--danger) 14%,transparent)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px}
.grid figure{margin:0;border:1px solid var(--line);border-radius:10px;overflow:hidden}.grid img{width:100%;height:100px;object-fit:cover;display:block}
.grid figcaption{padding:6px 8px;font-size:.85rem;display:flex;justify-content:space-between;gap:6px;align-items:center}
.pill{font-size:.8rem;border:1px solid var(--line);border-radius:999px;padding:1px 8px}
form.inline{display:inline}
`;

// ---------- session ----------

async function isOwner(req: Request, env: Env): Promise<boolean> {
  const cookie = req.headers.get("Cookie") || "";
  const m = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!m) return false;
  const payload = await verify(env.APP_SECRET, m[1]);
  if (!payload) return false;
  const [who, exp] = payload.split("|");
  return who === "owner" && Number(exp) > Date.now();
}

async function sessionCookie(env: Env): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 86_400_000;
  const value = await sign(env.APP_SECRET, `owner|${exp}`);
  return `${SESSION_COOKIE}=${value}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`;
}

/** Checks the owner password, with a simple per-IP lockout after repeated failures. */
async function checkPassword(req: Request, env: Env, password: string): Promise<"ok" | "wrong" | "locked"> {
  const ip = req.headers.get("CF-Connecting-IP") || "local";
  const key = `login-fail:${ip}`;
  const fails = Number((await env.OAUTH_KV.get(key)) || 0);
  if (fails >= 10) return "locked";
  if (env.OWNER_PASSWORD && password && (await safeEqual(password, env.OWNER_PASSWORD))) {
    if (fails) await env.OAUTH_KV.delete(key);
    return "ok";
  }
  await env.OAUTH_KV.put(key, String(fails + 1), { expirationTtl: 900 });
  return "wrong";
}

const PW_MESSAGES = { wrong: "كلمة المرور غير صحيحة.", locked: "محاولات خاطئة كثيرة. انتظر ١٥ دقيقة ثم حاول مرة أخرى." };

// ---------- pages ----------

function loginPage(error?: string): Response {
  return page(
    "تسجيل الدخول",
    `<h1>ناشر X</h1><p class="muted">لوحة خاصة لربط حساباتك في X مع Claude.</p>
<div class="card">${error ? `<p class="flash err">${esc(error)}</p>` : ""}
<form method="post" action="/login"><label>كلمة المرور<br><input type="password" name="password" autocomplete="current-password" required autofocus></label>
<p><button>دخول</button></p></form></div>`,
    {},
    error ? 401 : 200,
  );
}

async function dashboard(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const origin = originOf(req, env);
  const flash = url.searchParams.get("ok");
  const error = url.searchParams.get("error");
  const accounts = await listAccounts(env);
  const { results: scheduled } = await env.DB.prepare(
    "SELECT s.id, s.posts, s.run_at, s.status, s.error, a.username FROM scheduled s LEFT JOIN accounts a ON a.x_user_id = s.account_id WHERE s.status IN ('pending','failed','sending') ORDER BY s.run_at LIMIT 50",
  ).all<{ id: number; posts: string; run_at: number; status: string; error: string | null; username: string | null }>();
  const { results: history } = await env.DB.prepare("SELECT * FROM history ORDER BY posted_at DESC LIMIT 15").all<{
    tweet_id: string;
    username: string;
    text: string;
    posted_at: number;
    deleted_at: number | null;
  }>();
  const { results: images } = await env.DB.prepare("SELECT name, size FROM images ORDER BY created_at DESC").all<{ name: string; size: number }>();

  const accountsHtml = accounts.length
    ? accounts
        .map(
          (a) => `<div class="row"><div><strong>@${esc(a.username)}</strong> <span class="muted">${esc(a.name)}</span></div>
<form class="inline" method="post" action="/accounts/remove" onsubmit="return confirm('فصل @${esc(a.username)}؟')"><input type="hidden" name="id" value="${esc(a.x_user_id)}"><button class="danger">فصل</button></form></div>`,
        )
        .join("")
    : `<p class="muted">لا يوجد حساب مربوط بعد.</p>`;

  const scheduledHtml = scheduled.length
    ? scheduled
        .map((s) => {
          const posts = JSON.parse(s.posts) as { text: string }[];
          return `<div class="row"><div><span class="pill">#${s.id}</span> <span class="pill">${esc(s.status)}</span> @${esc(s.username ?? "?")} · ${esc(fmtTime(env, s.run_at))}
<div class="muted">${esc(posts[0].text.slice(0, 140))}${posts.length > 1 ? ` (+${posts.length - 1})` : ""}</div>${s.error ? `<div class="muted" style="color:var(--danger)">${esc(s.error)}</div>` : ""}</div>
${s.status === "pending" ? `<form class="inline" method="post" action="/scheduled/cancel"><input type="hidden" name="id" value="${s.id}"><button class="danger">إلغاء</button></form>` : ""}</div>`;
        })
        .join("")
    : `<p class="muted">لا توجد منشورات مجدولة.</p>`;

  const historyHtml = history.length
    ? history
        .map(
          (h) => `<div class="row"><div><a href="${esc(tweetUrl(h.username, h.tweet_id))}" rel="noreferrer" target="_blank">@${esc(h.username)}</a> · <span class="muted">${esc(fmtTime(env, h.posted_at))}</span>${h.deleted_at ? ' <span class="pill">محذوف</span>' : ""}
<div class="muted">${esc(h.text.slice(0, 140))}</div></div></div>`,
        )
        .join("")
    : `<p class="muted">لم يُنشر شيء بعد.</p>`;

  const imagesHtml = images.length
    ? `<div class="grid">${images
        .map(
          (i) => `<figure><img src="/images/file/${encodeURIComponent(i.name)}" alt="${esc(i.name)}" loading="lazy"><figcaption><span>${esc(i.name)}</span>
<form class="inline" method="post" action="/images/delete"><input type="hidden" name="name" value="${esc(i.name)}"><button class="danger" title="حذف">×</button></form></figcaption></figure>`,
        )
        .join("")}</div>`
    : `<p class="muted">لا توجد صور محفوظة.</p>`;

  return page(
    "ناشر X",
    `<div class="row" style="border:0"><h1>ناشر X</h1><form method="post" action="/logout"><button class="ghost">خروج</button></form></div>
${flash ? `<p class="flash">${esc(flash)}</p>` : ""}${error ? `<p class="flash err">${esc(error)}</p>` : ""}
<section class="card"><h2>١. حساباتك في X</h2>${accountsHtml}
<form method="post" action="/x/connect" style="margin-top:12px"><button>${accounts.length ? "ربط حساب آخر" : "ربط حساب X"}</button></form>
<p class="muted">تتم الموافقة على صفحة X نفسها. لا نطلب كلمة مرور حسابك.</p></section>
<section class="card"><h2>٢. رابطك في Claude</h2>
<div class="link"><input type="text" id="mcp" value="${esc(origin)}/mcp" readonly><button type="button" onclick="navigator.clipboard.writeText(document.getElementById('mcp').value);this.textContent='تم النسخ'">نسخ</button></div>
<p class="muted">في Claude: الإعدادات ← Connectors ← Add custom connector، ثم الصق الرابط ووافق. سيطلب منك Claude كلمة مرور هذه اللوحة مرة واحدة.</p>
<p class="muted">في Claude Code: <code>claude mcp add --transport http x ${esc(origin)}/mcp</code></p></section>
<section class="card"><h2>المجدول</h2>${scheduledHtml}</section>
<section class="card"><h2>الصور</h2>${imagesHtml}
<form method="post" action="/images" enctype="multipart/form-data" style="margin-top:14px;display:grid;gap:8px">
<input type="text" name="name" placeholder="اسم الصورة، مثل: صورة الإطلاق" required maxlength="80">
<input type="file" name="file" accept="image/jpeg,image/png,image/gif,image/webp" required>
<div><button>رفع</button> <span class="muted">JPG / PNG / GIF / WEBP حتى ٥ ميغابايت. بعدها قل لـ Claude: «انشرها مع صورة الإطلاق».</span></div></form></section>
<section class="card"><h2>آخر ما نُشر</h2>${historyHtml}</section>`,
  );
}

function consentPage(details: ConsentDescription, handle: string, needPassword: boolean, error?: string): string {
  const name = esc(details.clientName || "تطبيق");
  return `<h1>السماح لـ ${name} بالنشر على حساباتك؟</h1>
<div class="card">${error ? `<p class="flash err">${esc(error)}</p>` : ""}
<p>${details.clientDomain ? `ناشر الطلب: <strong class="mono">${esc(details.clientDomain)}</strong>.` : "سجّل هذا التطبيق نفسه، واسمه غير موثّق."}
سيُرسَل الإذن إلى <strong class="mono">${esc(details.redirectHost)}</strong>.</p>
${details.redirectIsLoopback ? "<p><strong>هذا يرسل الإذن إلى برنامج على جهازك.</strong> تابع فقط إن كنت بدأت الربط منه الآن.</p>" : ""}
<p class="muted">سيستطيع النشر والجدولة وحذف ما نشره وقراءة الأرقام العامة. لا يستطيع الإعجاب أو المتابعة أو الرسائل.</p>
<form method="post" action="/authorize"><input type="hidden" name="handle" value="${esc(handle)}">
${needPassword ? `<label>كلمة مرور اللوحة<br><input type="password" name="password" autocomplete="current-password" required autofocus></label>` : ""}
<p><button name="decision" value="approve">سماح</button> <button class="ghost" name="decision" value="deny" formnovalidate>رفض</button></p></form></div>`;
}

// ---------- router ----------

export async function handleWeb(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  const back = (q: Record<string, string>) => Response.redirect(`${originOf(req, env)}/?${new URLSearchParams(q)}`, 303);

  if (path === "/authorize") return authorize(req, env);
  if (path === "/x/callback" && method === "GET") return xCallback(req, env);

  if (path === "/login" && method === "POST") {
    const form = await req.formData();
    const result = await checkPassword(req, env, String(form.get("password") || ""));
    if (result !== "ok") return loginPage(PW_MESSAGES[result]);
    return new Response(null, { status: 303, headers: { Location: "/", "Set-Cookie": await sessionCookie(env) } });
  }
  if (path === "/logout" && method === "POST") {
    return new Response(null, { status: 303, headers: { Location: "/", "Set-Cookie": `${SESSION_COOKIE}=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0` } });
  }

  const owner = await isOwner(req, env);
  if (path === "/" && method === "GET") return owner ? dashboard(req, env) : loginPage();
  if (!owner) return new Response("Not found", { status: 404 });

  // Everything below needs the owner session. State-changing routes are POST-only and the
  // cookie is SameSite=Lax, so other sites can't trigger them.
  if (method === "POST" && req.headers.get("Origin") && req.headers.get("Origin") !== originOf(req, env))
    return new Response("Bad origin", { status: 403 });

  if (path === "/x/connect" && method === "POST") {
    if (!env.X_CLIENT_ID || !env.X_CLIENT_SECRET) return back({ error: "أضف X_CLIENT_ID و X_CLIENT_SECRET أولاً." });
    const state = randomToken(24);
    const verifier = randomToken(48);
    await env.OAUTH_KV.put(`x-state:${state}`, verifier, { expirationTtl: 600 });
    const q = new URLSearchParams({
      response_type: "code",
      client_id: env.X_CLIENT_ID,
      redirect_uri: `${originOf(req, env)}/x/callback`,
      scope: X_SCOPES.join(" "),
      state,
      code_challenge: await sha256b64url(verifier),
      code_challenge_method: "S256",
    });
    return Response.redirect(`${X_AUTHORIZE_URL}?${q}`, 303);
  }

  if (path === "/accounts/remove" && method === "POST") {
    const id = String((await req.formData()).get("id") || "");
    await env.DB.prepare("DELETE FROM accounts WHERE x_user_id = ?1").bind(id).run();
    await env.DB.prepare("UPDATE scheduled SET status = 'cancelled', error = 'Account disconnected' WHERE account_id = ?1 AND status = 'pending'").bind(id).run();
    return back({ ok: "تم فصل الحساب. لإلغاء الإذن نهائياً: X ← الإعدادات ← الأمان ← التطبيقات المتصلة." });
  }

  if (path === "/scheduled/cancel" && method === "POST") {
    const id = Number((await req.formData()).get("id"));
    await env.DB.prepare("UPDATE scheduled SET status = 'cancelled' WHERE id = ?1 AND status = 'pending'").bind(id).run();
    return back({ ok: `تم إلغاء #${id}.` });
  }

  if (path === "/images" && method === "POST") {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return back({ error: "اختر صورة." });
    try {
      await storeImage(env, String(form.get("name") || ""), await file.arrayBuffer(), file.type);
    } catch (e) {
      return back({ error: e instanceof Error ? e.message : String(e) });
    }
    return back({ ok: "تم حفظ الصورة." });
  }

  if (path === "/images/delete" && method === "POST") {
    const name = String((await req.formData()).get("name") || "");
    await env.DB.prepare("DELETE FROM images WHERE name = ?1").bind(name).run();
    await env.IMAGES.delete(name);
    return back({ ok: "تم حذف الصورة." });
  }

  if (path.startsWith("/images/file/") && method === "GET") {
    const obj = await env.IMAGES.get(decodeURIComponent(path.slice("/images/file/".length)));
    if (!obj) return new Response("Not found", { status: 404 });
    return new Response(obj.body, {
      headers: { "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream", "Cache-Control": "private, max-age=300", "X-Content-Type-Options": "nosniff" },
    });
  }

  return new Response("Not found", { status: 404 });
}

async function xCallback(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const origin = originOf(req, env);
  const fail = (msg: string) => Response.redirect(`${origin}/?${new URLSearchParams({ error: msg })}`, 303);
  if (url.searchParams.get("error")) return fail("تم إلغاء الربط على صفحة X.");
  const state = url.searchParams.get("state") || "";
  const code = url.searchParams.get("code") || "";
  const verifier = state && (await env.OAUTH_KV.get(`x-state:${state}`));
  if (!verifier || !code) return fail("انتهت صلاحية طلب الربط. حاول مرة أخرى.");
  await env.OAUTH_KV.delete(`x-state:${state}`);
  try {
    const tokens = await exchangeCode(env, code, verifier, `${origin}/x/callback`);
    const { username } = await saveAccount(env, tokens);
    return Response.redirect(`${origin}/?${new URLSearchParams({ ok: `تم ربط @${username}.` })}`, 303);
  } catch (e) {
    return fail(`تعذّر الربط: ${e instanceof Error ? e.message : String(e)}`);
  }
}

async function authorize(req: Request, env: Env): Promise<Response> {
  const oauth = env.OAUTH_PROVIDER;
  try {
    if (req.method === "GET") {
      const request = await oauth.parseAuthRequest(req);
      const details = await oauth.describeConsent(request);
      const consent = await oauth.beginConsent(request);
      return page("السماح بالوصول", consentPage(details, consent.handle, !(await isOwner(req, env))), consent.headers);
    }
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const form = await req.formData();
    const handle = String(form.get("handle") || "");
    if (form.get("decision") !== "approve") {
      const denied = await oauth.denyConsent(req, handle);
      return new Response(null, { status: 302, headers: denied.headers });
    }
    let setCookie: string | null = null;
    if (!(await isOwner(req, env))) {
      const result = await checkPassword(req, env, String(form.get("password") || ""));
      if (result !== "ok") {
        // The handle is single-use only once approved, so the same page can be shown again.
        return page("السماح بالوصول", `<p class="flash err">${PW_MESSAGES[result]}</p><p><a href="javascript:history.back()">رجوع</a></p>`, {}, 401);
      }
      setCookie = await sessionCookie(env);
    }
    const approved = await oauth.approveConsent(req, handle, {});
    const { redirectTo } = await oauth.completeAuthorization({
      request: approved.request,
      userId: "owner",
      metadata: {},
      scope: approved.request.scope,
      props: { owner: true },
    });
    approved.headers.set("Location", redirectTo);
    if (setCookie) approved.headers.append("Set-Cookie", setCookie);
    return new Response(null, { status: 302, headers: approved.headers });
  } catch (error) {
    if (error instanceof AuthorizationError && error.redirectTo) return Response.redirect(error.redirectTo, 302);
    if (error instanceof AuthorizationError || error instanceof CimdFetchError) {
      const message = error instanceof AuthorizationError ? error.description : "تعذّر التحقق من هذا التطبيق.";
      return page("خطأ", `<div class="card"><p class="flash err">${esc(message)}</p><p class="muted">ابدأ الربط من Claude مرة أخرى.</p></div>`, {}, 400);
    }
    throw error;
  }
}
