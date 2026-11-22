// Applies db/migrations/*.sql in order, once each. Usage: npm run migrate
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const dir = join(import.meta.dirname, "..", "db", "migrations");
const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
await c.connect();
await c.query(`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`);
const done = new Set((await c.query(`select name from schema_migrations`)).rows.map((r) => r.name));
for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  if (done.has(f)) continue;
  await c.query("begin");
  try {
    await c.query(readFileSync(join(dir, f), "utf8"));
    await c.query(`insert into schema_migrations (name) values ($1)`, [f]);
    await c.query("commit");
    console.info(`applied ${f}`);
  } catch (e) {
    await c.query("rollback");
    throw e;
  }
}
// let the API's login role act as dealline_app (needed for `set local role`)
const me = (await c.query(`select current_user`)).rows[0].current_user;
await c.query(`grant dealline_app to "${me}"`).catch(() => {});
await c.end();
