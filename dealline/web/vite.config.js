import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const shim = (f) => fileURLToPath(new URL(`./src/browser-backend/shims/${f}`, import.meta.url));

// Two ways to run the frontend:
//   npm run dev / build        -> talks to the API server (../api) through the proxy below.
//   npm run dev:demo / build:demo (VITE_BACKEND=browser) -> the same API runs inside the tab on PGlite.
// The Node shims are only reached from src/browser-backend (the API source imported there).
const api = process.env.DEALLINE_API ?? "http://localhost:8787";
const backend = ["/auth", "/me", "/api", "/public", "/webhooks", "/v1", "/healthz"];
const proxy = Object.fromEntries(backend.map((p) => [p, { target: api, changeOrigin: false }]));

// The recovered demo attributes invented financing offers to real Saudi banks. Builds meant to be
// shared (build:demo) swap those names for neutral placeholders; the recovered source is left as found.
const NEUTRAL_BANKS = [["مصرف الراجحي", "مصرف تجريبي (أ)"], ["البنك الأهلي السعودي", "بنك تجريبي (ب)"], ["مصرف الإنماء", "مصرف تجريبي (ج)"]];
const neutralBanks = () => ({
  name: "dealline-neutral-bank-names",
  enforce: "pre",
  transform(code, id) {
    if (!id.includes("/src/app/")) return null;
    let out = code;
    for (const [real, demo] of NEUTRAL_BANKS) out = out.split(real).join(demo);
    return out === code ? null : { code: out, map: null };
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    base: "./",
    define: { __BROWSER_BACKEND__: JSON.stringify(env.VITE_BACKEND === "browser") },
    plugins: [react(), ...(env.VITE_BACKEND === "browser" ? [neutralBanks()] : [])],
    resolve: {
      alias: [
        { find: /^hono\/cookie$/, replacement: shim("hono-cookie.js") },
        ...Object.entries({
        "node:crypto": shim("crypto.js"),
        "node:util": shim("util.js"),
        "node:dns/promises": shim("dns.js"),
        "node:net": shim("net.js"),
        pg: shim("pg.js"),
        }).map(([find, replacement]) => ({ find, replacement })),
      ],
    },
    optimizeDeps: { exclude: ["@electric-sql/pglite"] },
    build: { target: "es2022", outDir: env.VITE_BACKEND === "browser" ? "dist-demo" : "dist", chunkSizeWarningLimit: 1500 },
    server: { port: 5173, proxy, fs: { allow: [".."] } },
    preview: { port: 4173, proxy },
  };
});
