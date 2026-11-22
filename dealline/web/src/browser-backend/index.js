// Runs the real Deal Line API (../../../api/src) inside the browser tab, on PGlite
// (Postgres compiled to WebAssembly). Used only by the "demo" build so the platform can be
// browsed without a server. Same routes, validation, RLS and business rules as the server;
// what differs is listed in BROWSER_LIMITS below and shown in the UI.
import "./shims/globals.js";
import { PGlite } from "@electric-sql/pglite";
import { createApp } from "../../../api/src/app.ts";
import { pgliteDb } from "../../../api/src/db.ts";
import { loadEnv } from "../../../api/src/env.ts";
import { deliverWebhooks, processEvents } from "../../../api/src/automation.ts";
import { runOffplanJobs } from "../../../api/src/offplan.ts";
import { seedDemo } from "../../../api/scripts/demo-seed.ts";

const migrations = import.meta.glob("../../../api/db/migrations/*.sql", { query: "?raw", import: "default", eager: true });

export const BROWSER_LIMITS = [
  "قاعدة البيانات تعمل داخل متصفحك (PGlite) وتُحفظ على جهازك فقط.",
  "لا يُرسل بريد ولا رسائل واتساب فعلية؛ تظهر في «صندوق الإرسال التجريبي».",
  "الدفع (ميسّر) غير مفعّل، والتحقق من النطاقات وفحص عناوين Webhook يحتاجان الخادم.",
];

const DB_NAME = "idb://dealline-demo-v1";
const SITES_ROOT = "dealline.site";

function storage() {
  try { return window.localStorage; } catch { return null; }
}

function secretsKey() {
  const s = storage();
  try {
    const saved = s?.getItem("dealline-demo-secrets-key");
    if (saved) return saved;
  } catch { /* storage blocked */ }
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  const key = btoa(String.fromCharCode(...b));
  try { s?.setItem("dealline-demo-secrets-key", key); } catch { /* memory only */ }
  return key;
}

// Two tabs on one IndexedDB-backed PGlite would each keep their own copy and overwrite each other.
// Only the tab holding this lock persists; any other tab runs on a fresh in-memory copy.
function holdTabLock() {
  if (!navigator.locks?.request) return Promise.resolve(true);
  return new Promise((resolve) => {
    navigator.locks.request("dealline-demo-db", { ifAvailable: true }, (lock) => {
      if (!lock) { resolve(false); return undefined; }
      resolve(true);
      return new Promise(() => {}); // keep the lock for the tab's lifetime
    }).catch(() => resolve(false));
  });
}

async function openDb() {
  const parsers = { 20: (v) => Number(v) };
  if (!(await holdTabLock())) {
    const lite = new PGlite({ parsers });
    await lite.waitReady;
    return { lite, persisted: false, otherTab: true };
  }
  try {
    const lite = new PGlite(DB_NAME, { parsers });
    await lite.waitReady;
    return { lite, persisted: true };
  } catch {
    const lite = new PGlite({ parsers });
    await lite.waitReady;
    return { lite, persisted: false };
  }
}

async function migrate(lite) {
  await lite.exec(`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`);
  const done = new Set((await lite.query(`select name from schema_migrations`)).rows.map((r) => r.name));
  for (const path of Object.keys(migrations).sort()) {
    const name = path.split("/").pop();
    if (done.has(name)) continue;
    await lite.transaction(async (t) => {
      await t.exec(migrations[path]);
      await t.query(`insert into schema_migrations (name) values ($1)`, [name]);
    });
  }
}

export async function bootBrowserBackend() {
  const { lite, persisted, otherTab = false } = await openDb();
  await migrate(lite);
  const db = pgliteDb(lite);
  const env = loadEnv({
    NODE_ENV: "development",
    DATABASE_URL: "pglite",
    APP_URL: window.location.origin.startsWith("http") ? window.location.origin : "https://app.example.sa",
    SITES_ROOT_DOMAIN: SITES_ROOT,
    SECRETS_KEY: secretsKey(),
    WHATSAPP_APP_SECRET: "browser-demo",
    WHATSAPP_VERIFY_TOKEN: "browser-demo",
  });
  const outbox = [];
  const record = (entry) => { outbox.unshift({ at: new Date().toISOString(), ...entry }); if (outbox.length > 50) outbox.pop(); };
  const mailer = { send: async (to, subject, html) => record({ channel: "email", to, subject, body: html }) };
  let n = 0;
  const whatsapp = {
    send: async ({ to, message }) => {
      record({ channel: "whatsapp", to, subject: message.kind === "template" ? `قالب: ${message.name}` : "رسالة نصية", body: message.body ?? (message.params ?? []).join(" | ") });
      return { id: `wamid.browser.${++n}` };
    },
  };
  const unavailable = async () => { throw new Error("DNS غير متاح داخل المتصفح"); };
  const payments = { fetchPayment: async () => { throw new Error("payments not configured"); } };
  const app = createApp({ db, env, mailer, payments, whatsapp, resolveTxt: unavailable, lookup: unavailable });

  const seeded = (await lite.query(`select 1 from users limit 1`)).rows.length > 0;
  if (!seeded) await seedDemo({ app, lite, root: SITES_ROOT });

  // the server runs these every 5s / daily; here they run while the tab is open
  const deps = { db, env, mailer, whatsapp, lookup: unavailable, fetch: async () => new Response("", { status: 503 }) };
  let busy = false;
  const tick = async () => {
    if (busy) return;
    busy = true;
    try { await processEvents(deps); await deliverWebhooks(deps); } catch (e) { console.warn("worker:", e.message); } finally { busy = false; }
  };
  await runOffplanJobs(db).catch((e) => console.warn("jobs:", e.message));
  await tick();
  setInterval(tick, 4000);

  return {
    mode: "browser",
    persisted,
    otherTab,
    sitesRoot: SITES_ROOT,
    outbox,
    limits: BROWSER_LIMITS,
    fetch: (req) => app.fetch(req),
    async reset() {
      await lite.close().catch(() => {});
      await new Promise((resolve) => {
        const r = indexedDB.deleteDatabase("/pglite/dealline-demo-v1");
        r.onsuccess = r.onerror = r.onblocked = () => resolve();
      });
    },
  };
}
