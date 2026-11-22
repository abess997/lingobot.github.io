import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { pgDb } from "./db.js";
import { loadEnv } from "./env.js";
import { moyasarGateway, resendMailer } from "./services.js";
import { metaWhatsApp } from "./whatsapp.js";
import { deliverWebhooks, processEvents } from "./automation.js";

const env = loadEnv();
const db = pgDb(env.DATABASE_URL);
const mailer = resendMailer(env);
const whatsapp = metaWhatsApp(env.WHATSAPP_GRAPH_VERSION);
const app = createApp({ db, env, mailer, payments: moyasarGateway(env), whatsapp });
serve({ fetch: app.fetch, port: env.PORT }, (i) => console.info(`Deal Line API on :${i.port}`));

// automation + webhook workers. Several instances are safe: events are claimed with SKIP LOCKED,
// and each rule runs once per event (unique rule_id + event_id).
let busy = false;
setInterval(async () => {
  if (busy) return;
  busy = true;
  try {
    await processEvents({ db, env, mailer, whatsapp });
    await deliverWebhooks({ db, env, mailer, whatsapp });
  } catch (e) {
    console.error("worker:", (e as Error).message);
  } finally {
    busy = false;
  }
}, 5_000);
