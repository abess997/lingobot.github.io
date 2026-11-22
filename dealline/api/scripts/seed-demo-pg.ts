// Same demo data as the in-browser build, into a real Postgres (after npm run migrate). Usage: npm run seed:demo
import pg from "pg";
import { createApp } from "../src/app.js";
import { pgDb } from "../src/db.js";
import { loadEnv } from "../src/env.js";
import { seedDemo, DEMO_USERS, DEMO_PASSWORD } from "./demo-seed.js";

const env = loadEnv({ ...process.env, NODE_ENV: "development", SECRETS_KEY: process.env.SECRETS_KEY ?? Buffer.alloc(32, 1).toString("base64") });
const sql = new pg.Pool({ connectionString: env.DATABASE_URL, max: 2 });
if ((await sql.query(`select 1 from users where email = $1`, [DEMO_USERS[0].email])).rows.length) {
  console.info("demo data already present");
} else {
  const app = createApp({
    db: pgDb(env.DATABASE_URL), env,
    mailer: { send: async () => {} }, whatsapp: { send: async () => ({ id: "seed" }) },
    payments: { fetchPayment: async () => { throw new Error("payments not configured"); } },
  });
  await seedDemo({ app, lite: sql, root: env.SITES_ROOT_DOMAIN });
  console.info(`demo data ready: ${DEMO_USERS.map((u) => u.email).join(", ")} / ${DEMO_PASSWORD}`);
}
await sql.end();
process.exit(0);
