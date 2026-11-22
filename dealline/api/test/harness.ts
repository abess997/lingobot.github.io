import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { createApp } from "../src/app.js";
import { pgliteDb } from "../src/db.js";
import { loadEnv } from "../src/env.js";
import type { MoyasarPayment } from "../src/services.js";

export async function harness() {
  const lite = new PGlite({ parsers: { 20: (v: string) => Number(v) } });
  const dir = new URL("../db/migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort())
    await lite.exec(readFileSync(new URL(f, dir), "utf8"));
  const db = pgliteDb(lite);
  const mails: { to: string; html: string }[] = [];
  const moyasar = new Map<string, MoyasarPayment>();
  const dns = new Map<string, string[][]>();
  const env = loadEnv({
    NODE_ENV: "test", DATABASE_URL: "pglite", APP_URL: "https://app.dealline.test", SITES_ROOT_DOMAIN: "dealline.site",
    MOYASAR_PUBLISHABLE_KEY: "pk_test_x", MOYASAR_SECRET_KEY: "sk_test_x", MOYASAR_WEBHOOK_SECRET: "whsec_test",
    SECRETS_KEY: Buffer.alloc(32, 7).toString("base64"), WHATSAPP_APP_SECRET: "meta_app_secret", WHATSAPP_VERIFY_TOKEN: "verify_me",
  });
  const waSent: { phoneNumberId: string; token: string; to: string; message: any }[] = [];
  const whatsapp = { send: async (a: any) => { waSent.push(a); return { id: `wamid.${waSent.length}` }; } };
  const lookup = async (h: string) => [{ address: h.includes("internal-trap") ? "10.0.0.5" : "93.184.216.34" }];
  const hooks: { url: string; headers: Record<string, string>; body: string }[] = [];
  let hookStatus = 200;
  const fakeFetch = (async (url: string, init: any) => {
    hooks.push({ url, headers: init.headers, body: init.body });
    return new Response("{}", { status: hookStatus });
  }) as unknown as typeof fetch;
  const app = createApp({
    db, env,
    mailer: { send: async (to, _s, html) => { mails.push({ to, html }); } },
    payments: { fetchPayment: async (id) => { const p = moyasar.get(id); if (!p) throw new Error("404"); return p; } },
    resolveTxt: async (h) => { const r = dns.get(h); if (!r) throw new Error("ENOTFOUND"); return r; },
    whatsapp, lookup,
  });
  const workers = { db, env, mailer: { send: async (to: string, _s: string, html: string) => { mails.push({ to, html }); } }, whatsapp, lookup, fetch: fakeFetch };
  let ipN = 0;
  async function call(method: string, path: string, opts: { body?: unknown; cookie?: string; headers?: Record<string, string>; raw?: string } = {}) {
    const res = await app.request(path, {
      method,
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `10.0.${Math.floor(++ipN / 250)}.${ipN % 250}`,
        ...(opts.cookie ? { cookie: opts.cookie } : {}),
        ...(opts.headers ?? {}),
      },
      body: opts.raw ?? (opts.body === undefined ? undefined : JSON.stringify(opts.body)),
    });
    const text = await res.text();
    let json: any; try { json = JSON.parse(text); } catch { json = text; }
    return { status: res.status, json, cookie: res.headers.get("set-cookie")?.split(";")[0] };
  }
  async function signup(email: string, org: string) {
    const r = await call("POST", "/auth/signup", { body: { name: "Test", email, password: "long-enough-pw", org_name: org } });
    if (r.status !== 201) throw new Error(JSON.stringify(r.json));
    return r.cookie!;
  }
  return { lite, db, mails, moyasar, dns, env, app, call, signup, waSent, hooks, workers, setHookStatus: (n: number) => { hookStatus = n; } };
}
