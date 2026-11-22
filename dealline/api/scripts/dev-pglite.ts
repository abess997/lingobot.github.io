// Local development without Postgres: the same API on PGlite (Postgres in WebAssembly),
// stored in ./.pglite, with demo data on first run. Usage: npm run dev:pglite
import { readdirSync, readFileSync } from "node:fs";
import { serve } from "@hono/node-server";
import { PGlite } from "@electric-sql/pglite";
import { createApp } from "../src/app.js";
import { pgliteDb } from "../src/db.js";
import { loadEnv } from "../src/env.js";
import { deliverWebhooks, processEvents } from "../src/automation.js";
import { runOffplanJobs } from "../src/offplan.js";
import { seedDemo, DEMO_USERS, DEMO_PASSWORD } from "./demo-seed.js";

const dataDir = process.env.PGLITE_DIR ?? ".pglite";
const lite = new PGlite(dataDir === ":memory:" ? undefined : dataDir, { parsers: { 20: (v: string) => Number(v) } });
await lite.exec(`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`);
const done = new Set((await lite.query<{ name: string }>(`select name from schema_migrations`)).rows.map((r) => r.name));
const dir = new URL("../db/migrations/", import.meta.url);
for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  if (done.has(f)) continue;
  await lite.transaction(async (t) => {
    await t.exec(readFileSync(new URL(f, dir), "utf8"));
    await t.query(`insert into schema_migrations (name) values ($1)`, [f]);
  });
  console.info(`applied ${f}`);
}

const env = loadEnv({
  NODE_ENV: "development", DATABASE_URL: "pglite", APP_URL: process.env.APP_URL ?? "http://localhost:5173",
  SITES_ROOT_DOMAIN: "dealline.site", PORT: process.env.PORT ?? "8787",
  SECRETS_KEY: process.env.SECRETS_KEY ?? Buffer.alloc(32, 1).toString("base64"), // dev only
  WHATSAPP_APP_SECRET: "dev", WHATSAPP_VERIFY_TOKEN: "dev",
});
const db = pgliteDb(lite);
const mailer = { send: async (to: string, subject: string) => console.info(`[dev email] to=${to} subject=${subject}`) };
const whatsapp = { send: async (a: { to: string }) => { console.info(`[dev whatsapp] to=${a.to}`); return { id: `wamid.dev.${Date.now()}` }; } };
const payments = { fetchPayment: async () => { throw new Error("payments not configured"); } };
const app = createApp({ db, env, mailer, payments, whatsapp });

if (!(await lite.query(`select 1 from users limit 1`)).rows.length) {
  await seedDemo({ app, lite, root: env.SITES_ROOT_DOMAIN });
  console.info(`demo data ready. sign in with ${DEMO_USERS.map((u) => `${u.email} (${u.role})`).join(", ")} / ${DEMO_PASSWORD}`);
}
await runOffplanJobs(db);
const deps = { db, env, mailer, whatsapp };
setInterval(async () => {
  try { await processEvents(deps); await deliverWebhooks(deps); } catch (e) { console.error("worker:", (e as Error).message); }
}, 5_000);
serve({ fetch: app.fetch, port: env.PORT }, (i) => console.info(`Deal Line API (PGlite) on :${i.port}`));
