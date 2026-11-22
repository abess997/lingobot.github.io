// Integrations: WhatsApp Business (Cloud API), outbound webhooks for Zapier/Make/n8n,
// and a public REST API with per-org keys. Booking.com and Airbnb are intentionally not supported.
import { Hono, type Context, type MiddlewareHandler } from "hono";
import { z } from "zod";
import { createHmac } from "node:crypto";
import type { Db } from "./db.js";
import type { Env } from "./env.js";
import type { Vars } from "./auth.js";
import { safeEqual, sha256, newToken } from "./auth.js";
import { can, type Action } from "./authz.js";
import { HttpError, body, deny, notFound } from "./http.js";
import { EVENT_TYPES, decrypt, emit, encrypt, leadPayload } from "./events.js";
import { assertPublicUrl, type WorkerDeps } from "./automation.js";
import { WINDOW_HOURS, type WhatsAppClient } from "./whatsapp.js";
import { listingInput, saPhone } from "./validation.js";
import { rateLimiter } from "./services.js";

const uuid = z.string().uuid();
type Ctx = Context<{ Variables: Vars }>;
const SCOPES = ["listings:read", "listings:write", "leads:read", "leads:write", "projects:read"] as const;

export function integrationsApi(d: { db: Db; env: Env; whatsapp: WhatsAppClient; lookup?: WorkerDeps["lookup"] }) {
  const { db, env } = d;
  const r = new Hono<{ Variables: Vars }>();
  const member = (c: Ctx) => { const m = c.get("member"); if (!m) throw deny(); return m; };
  const need = (c: Ctx, a: Action) => { const m = member(c); if (!can(m, a)) throw deny(); return m; };

  // ---------- WhatsApp account ----------
  r.get("/whatsapp", async (c) => {
    const m = member(c);
    const row = (await db.asOrg(m.orgId, (q) => q.query(
      `select phone_number_id, waba_id, display_phone, active, updated_at from whatsapp_accounts limit 1`))).rows[0];
    return c.json(row ?? null);
  });

  r.put("/whatsapp", async (c) => {
    const m = need(c, "integrations:manage");
    const b = await body(c, z.object({
      phone_number_id: z.string().regex(/^[0-9]{5,30}$/), waba_id: z.string().regex(/^[0-9]{5,30}$/).nullish(),
      display_phone: z.string().max(30).nullish(), access_token: z.string().min(20).max(1000),
    }));
    await db.asOrg(m.orgId, (q) => q.query(
      `insert into whatsapp_accounts (org_id, phone_number_id, waba_id, display_phone, access_token_enc)
       values ($1,$2,$3,$4,$5)
       on conflict (org_id) do update set phone_number_id = excluded.phone_number_id, waba_id = excluded.waba_id,
         display_phone = excluded.display_phone, access_token_enc = excluded.access_token_enc, active = true`,
      [m.orgId, b.phone_number_id, b.waba_id ?? null, b.display_phone ?? null, encrypt(b.access_token, env.SECRETS_KEY)]));
    return c.json({ ok: true });
  });

  r.delete("/whatsapp", async (c) => {
    const m = need(c, "integrations:manage");
    await db.asOrg(m.orgId, (q) => q.query(`delete from whatsapp_accounts`));
    return c.json({ ok: true });
  });

  // ---------- outbound webhooks ----------
  r.get("/webhooks", async (c) => {
    const m = need(c, "integrations:manage");
    return c.json((await db.asOrg(m.orgId, (q) => q.query(
      `select id, url, event_types, active, created_at from webhook_endpoints order by created_at`))).rows);
  });

  r.post("/webhooks", async (c) => {
    const m = need(c, "integrations:manage");
    const b = await body(c, z.object({ url: z.string().url().max(500), event_types: z.array(z.enum(EVENT_TYPES)).min(1).max(20) }));
    try { await assertPublicUrl(b.url, d.lookup); } catch (e) { throw new HttpError(422, `url_rejected: ${(e as Error).message}`); }
    const secret = `whsec_${newToken()}`;
    const row = await db.asOrg(m.orgId, (q) => q.query(
      `insert into webhook_endpoints (org_id, url, secret_enc, event_types) values ($1,$2,$3,$4) returning id`,
      [m.orgId, b.url, encrypt(secret, env.SECRETS_KEY), b.event_types]));
    // the signing secret is shown once
    return c.json({ id: row.rows[0].id, secret, signature: "X-DealLine-Signature: t=<unix>,v1=hex(HMAC-SHA256(secret, `${t}.${body}`))" }, 201);
  });

  r.delete("/webhooks/:id", async (c) => {
    const m = need(c, "integrations:manage");
    const row = await db.asOrg(m.orgId, (q) => q.query(`delete from webhook_endpoints where id = $1 returning id`, [uuid.parse(c.req.param("id"))]));
    if (!row.rows[0]) throw notFound();
    return c.json({ ok: true });
  });

  r.get("/webhooks/:id/deliveries", async (c) => {
    const m = need(c, "integrations:manage");
    return c.json((await db.asOrg(m.orgId, (q) => q.query(
      `select w.id, w.status, w.attempts, w.last_status, w.next_attempt_at, e.type
         from webhook_deliveries w join events e on e.id = w.event_id where w.endpoint_id = $1
        order by w.created_at desc limit 100`, [uuid.parse(c.req.param("id"))]))).rows);
  });

  // ---------- API keys ----------
  r.get("/api-keys", async (c) => {
    const m = need(c, "integrations:manage");
    return c.json((await db.asOrg(m.orgId, (q) => q.query(
      `select id, name, prefix, scopes, last_used_at, revoked_at, created_at from api_keys order by created_at`))).rows);
  });

  r.post("/api-keys", async (c) => {
    const m = need(c, "integrations:manage");
    const b = await body(c, z.object({ name: z.string().trim().min(1).max(80), scopes: z.array(z.enum(SCOPES)).min(1) }));
    const prefix = newToken().replace(/[-_]/g, "").slice(0, 8).toLowerCase();
    const key = `dl_${prefix}_${newToken()}`;
    const row = await db.asOrg(m.orgId, (q) => q.query(
      `insert into api_keys (org_id, name, prefix, key_hash, scopes, created_by) values ($1,$2,$3,$4,$5,$6) returning id`,
      [m.orgId, b.name, prefix, sha256(key), [...new Set(b.scopes)], c.get("userId")]));
    return c.json({ id: row.rows[0].id, key, note: "shown once; store it securely" }, 201);
  });

  r.delete("/api-keys/:id", async (c) => {
    const m = need(c, "integrations:manage");
    const row = await db.asOrg(m.orgId, (q) => q.query(
      `update api_keys set revoked_at = now() where id = $1 and revoked_at is null returning id`, [uuid.parse(c.req.param("id"))]));
    if (!row.rows[0]) throw notFound();
    return c.json({ ok: true });
  });

  return r;
}

/** WhatsApp conversation on a lead: read the thread, reply (free text inside 24h, template otherwise). */
export function leadWhatsAppRoutes(d: { db: Db; env: Env; whatsapp: WhatsAppClient }) {
  const { db, env } = d;
  const r = new Hono<{ Variables: Vars }>();
  const member = (c: Ctx) => { const m = c.get("member"); if (!m) throw deny(); return m; };

  const loadLead = async (c: Ctx) => {
    const m = member(c);
    const id = uuid.parse(c.req.param("id"));
    const lead = (await db.asOrg(m.orgId, (q) => q.query(`select id, phone, assigned_to from leads where id = $1`, [id]))).rows[0];
    if (!lead) throw notFound();
    if (!can(m, "whatsapp:send", { ownsRecord: lead.assigned_to === c.get("userId") })) throw deny();
    return { m, lead };
  };

  r.get("/leads/:id/whatsapp", async (c) => {
    const { m, lead } = await loadLead(c);
    return c.json((await db.asOrg(m.orgId, (q) => q.query(
      `select id, direction, kind, body, template_name, status, created_at from whatsapp_messages
        where phone = $1 order by created_at limit 500`, [lead.phone]))).rows);
  });

  r.post("/leads/:id/whatsapp", async (c) => {
    const { m, lead } = await loadLead(c);
    const b = await body(c, z.union([
      z.object({ text: z.string().trim().min(1).max(4096) }),
      z.object({ template: z.string().regex(/^[a-z0-9_]{1,512}$/), language: z.string().regex(/^[a-z]{2}(_[A-Z]{2})?$/).default("ar"),
                 params: z.array(z.string().max(200)).max(10).default([]) }),
    ]));
    const out = await db.asOrg(m.orgId, async (q) => {
      const acc = (await q.query(`select * from whatsapp_accounts where active limit 1`)).rows[0];
      if (!acc) throw new HttpError(422, "whatsapp_not_connected");
      if ("text" in b) {
        const recent = (await q.query(
          `select 1 from whatsapp_messages where phone = $1 and direction = 'in' and created_at > now() - make_interval(hours => $2)`,
          [lead.phone, WINDOW_HOURS])).rows[0];
        if (!recent) throw new HttpError(422, "outside_24h_window_use_template");
      }
      return { acc };
    });
    const message = "text" in b
      ? { kind: "text" as const, body: b.text }
      : { kind: "template" as const, name: b.template, language: b.language, params: b.params };
    const sent = await d.whatsapp.send({
      phoneNumberId: out.acc.phone_number_id, token: decrypt(out.acc.access_token_enc, env.SECRETS_KEY), to: lead.phone, message,
    });
    await db.asOrg(m.orgId, (q) => q.query(
      `insert into whatsapp_messages (org_id, lead_id, direction, wa_message_id, phone, kind, body, template_name, status)
       values ($1,$2,'out',$3,$4,$5,$6,$7,'sent')`,
      [m.orgId, lead.id, sent.id, lead.phone, message.kind, "text" in b ? b.text : b.params.join(" | "), "text" in b ? null : b.template]));
    return c.json({ ok: true, id: sent.id }, 201);
  });

  return r;
}

/** Meta webhook: verification handshake + signed events (inbound messages, delivery statuses). */
export function whatsappWebhook(app: Hono<any>, d: { db: Db; env: Env }) {
  const { db, env } = d;

  app.get("/webhooks/whatsapp", (c) => {
    const mode = c.req.query("hub.mode"), token = c.req.query("hub.verify_token") ?? "", challenge = c.req.query("hub.challenge") ?? "";
    if (mode === "subscribe" && env.WHATSAPP_VERIFY_TOKEN && safeEqual(token, env.WHATSAPP_VERIFY_TOKEN)) return c.text(challenge);
    return c.text("forbidden", 403);
  });

  app.post("/webhooks/whatsapp", async (c) => {
    if (!env.WHATSAPP_APP_SECRET) return c.json({ error: "not_configured" }, 503);
    const raw = await c.req.text(); // signature is over the raw bytes, so verify before parsing
    const sig = c.req.header("x-hub-signature-256") ?? "";
    const want = "sha256=" + createHmac("sha256", env.WHATSAPP_APP_SECRET).update(raw).digest("hex");
    if (!safeEqual(sig, want)) return c.json({ error: "bad_signature" }, 401);
    let payload: any;
    try { payload = JSON.parse(raw); } catch { return c.json({ error: "invalid_json" }, 400); }
    if (payload?.object !== "whatsapp_business_account") return c.json({ ok: true });

    for (const entry of payload.entry ?? []) for (const change of entry.changes ?? []) {
      const v = change?.value ?? {};
      const pnid = String(v.metadata?.phone_number_id ?? "");
      if (!/^[0-9]{5,30}$/.test(pnid)) continue;
      const acc = (await db.asSystem((q) => q.query(`select org_id from whatsapp_accounts where phone_number_id = $1 and active`, [pnid]))).rows[0];
      if (!acc) continue;
      const orgId = acc.org_id;

      for (const msg of v.messages ?? []) {
        if (!/^[0-9]{6,20}$/.test(String(msg.from ?? "")) || typeof msg.id !== "string") continue;
        const phone = `+${msg.from}`;
        const text = msg.type === "text" ? String(msg.text?.body ?? "").slice(0, 4096) : `[${String(msg.type).slice(0, 20)}]`;
        const name = String(v.contacts?.find((x: any) => x.wa_id === msg.from)?.profile?.name ?? "عميل واتساب").slice(0, 120) || "عميل واتساب";
        await db.asSystem(async (q) => {
          const ins = await q.query(
            `insert into whatsapp_messages (org_id, direction, wa_message_id, phone, kind, body, status)
             values ($1,'in',$2,$3,$4,$5,'received') on conflict (wa_message_id) do nothing returning id`,
            [orgId, msg.id.slice(0, 200), phone, msg.type === "text" ? "text" : "other", text]);
          if (!ins.rows[0]) return; // Meta retried: already stored
          let lead = (await q.query(`select * from leads where org_id = $1 and phone = $2 order by created_at desc limit 1`, [orgId, phone])).rows[0];
          if (!lead) {
            lead = (await q.query(
              `insert into leads (org_id, name, phone, source, source_channel, message) values ($1,$2,$3,'whatsapp','whatsapp',$4) returning *`,
              [orgId, name, phone, text.slice(0, 2000)])).rows[0];
            await emit(q, orgId, "lead.created", leadPayload(lead));
          }
          await q.query(`update whatsapp_messages set lead_id = $2 where id = $1`, [ins.rows[0].id, lead.id]);
          await emit(q, orgId, "whatsapp.received", leadPayload(lead, { message: { text } }));
        });
      }
      for (const st of v.statuses ?? []) {
        if (!["sent", "delivered", "read", "failed"].includes(st.status) || typeof st.id !== "string") continue;
        await db.asSystem((q) => q.query(
          `update whatsapp_messages set status = $3, error = $4
            where org_id = $1 and wa_message_id = $2 and direction = 'out'
              and (array_position(array['queued','sent','delivered','read'], status) < array_position(array['queued','sent','delivered','read'], $3) or $3 = 'failed')`,
          [orgId, st.id, st.status, st.status === "failed" ? String(st.errors?.[0]?.title ?? "failed").slice(0, 300) : null]));
      }
    }
    return c.json({ ok: true });
  });
}

/** Public REST API: Authorization: Bearer dl_<prefix>_<secret>. Scoped per key, RLS per org. */
export function publicApi(app: Hono<any>, d: { db: Db }) {
  const { db } = d;
  const limit = rateLimiter(120, 60_000);
  type KV = { Variables: { orgId: string; scopes: string[]; keyId: string } };
  const v1 = new Hono<KV>();

  const auth = (scope: (typeof SCOPES)[number]): MiddlewareHandler<KV> => async (c, next) => {
    const h = c.req.header("authorization") ?? "";
    const key = h.startsWith("Bearer ") ? h.slice(7).trim() : "";
    if (!/^dl_[a-z0-9]{8}_[A-Za-z0-9_-]{20,}$/.test(key)) return c.json({ error: "invalid_api_key" }, 401);
    const row = (await db.asSystem((q) => q.query(
      `update api_keys set last_used_at = now() where key_hash = $1 and revoked_at is null returning id, org_id, scopes`, [sha256(key)]))).rows[0];
    if (!row) return c.json({ error: "invalid_api_key" }, 401);
    if (!row.scopes.includes(scope)) return c.json({ error: "insufficient_scope", required: scope }, 403);
    if (!limit(row.id)) return c.json({ error: "rate_limited" }, 429);
    c.set("orgId", row.org_id); c.set("scopes", row.scopes); c.set("keyId", row.id);
    await next();
  };

  v1.get("/listings", auth("listings:read"), async (c) => {
    const status = z.enum(["draft", "published", "reserved", "sold", "archived"]).optional().parse(c.req.query("status"));
    const page = z.coerce.number().int().min(1).max(1000).default(1).parse(c.req.query("page") ?? 1);
    return c.json((await db.asOrg(c.get("orgId"), (q) => q.query(
      `select id, title, purpose, property_type, price_halalas, city, district, area_sqm::float8 as area_sqm, bedrooms, bathrooms,
              images, status, ad_license_number, ad_license_expires_on::text as ad_license_expires_on, created_at, updated_at
         from listings where ($1::text is null or status = $1) order by created_at desc limit 100 offset $2`,
      [status ?? null, (page - 1) * 100]))).rows);
  });

  v1.post("/listings", auth("listings:write"), async (c) => {
    const b = await body(c, listingInput);
    const row = await db.asOrg(c.get("orgId"), (q) => q.query(
      `insert into listings (org_id, title, description, purpose, property_type, price_halalas, city, district, area_sqm,
         bedrooms, bathrooms, lat, lng, images, ad_license_number, ad_license_expires_on, show_on_site)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) returning id, status`,
      [c.get("orgId"), b.title, b.description ?? null, b.purpose, b.property_type, b.price_halalas, b.city, b.district ?? null,
       b.area_sqm ?? null, b.bedrooms ?? null, b.bathrooms ?? null, b.lat ?? null, b.lng ?? null, JSON.stringify(b.images),
       b.ad_license_number ?? null, b.ad_license_expires_on ?? null, b.show_on_site]));
    return c.json(row.rows[0], 201); // created as draft; publishing stays in the dashboard (ad license check)
  });

  v1.get("/leads", auth("leads:read"), async (c) => {
    const since = z.string().datetime({ offset: true }).optional().parse(c.req.query("since"));
    return c.json((await db.asOrg(c.get("orgId"), (q) => q.query(
      `select id, name, phone, email, message, source, source_channel, utm_source, utm_medium, utm_campaign, status,
              listing_id, project_id, unit_id, created_at
         from leads where ($1::timestamptz is null or created_at > $1) order by created_at desc limit 200`, [since ?? null]))).rows);
  });

  v1.post("/leads", auth("leads:write"), async (c) => {
    const b = await body(c, z.object({
      name: z.string().trim().min(1).max(120), phone: saPhone, email: z.string().email().max(200).nullish(),
      message: z.string().max(2000).nullish(), source_channel: z.string().regex(/^[a-z0-9_-]{1,30}$/).nullish(),
      utm_source: z.string().max(100).nullish(), utm_medium: z.string().max(100).nullish(), utm_campaign: z.string().max(150).nullish(),
    }));
    const row = await db.asOrg(c.get("orgId"), async (q) => {
      const lead = (await q.query(
        `insert into leads (org_id, name, phone, email, message, source, source_channel, utm_source, utm_medium, utm_campaign)
         values ($1,$2,$3,$4,$5,'api',$6,$7,$8,$9) returning *`,
        [c.get("orgId"), b.name, b.phone, b.email ?? null, b.message ?? null, b.source_channel ?? null,
         b.utm_source ?? null, b.utm_medium ?? null, b.utm_campaign ?? null])).rows[0];
      await emit(q, c.get("orgId"), "lead.created", leadPayload(lead));
      return lead;
    });
    return c.json({ id: row.id }, 201);
  });

  v1.get("/projects", auth("projects:read"), async (c) =>
    c.json((await db.asOrg(c.get("orgId"), (q) => q.query(
      `select id, name, city, district, status, progress_pct::float8 as progress_pct, expected_handover_on::text as expected_handover_on,
              wafi_license_number from projects order by created_at desc`))).rows));

  v1.get("/projects/:id/units", auth("projects:read"), async (c) =>
    c.json((await db.asOrg(c.get("orgId"), (q) => q.query(
      `select id, code, unit_type, building, floor, area_sqm::float8 as area_sqm, bedrooms, price_halalas, status
         from units where project_id = $1 order by code`, [uuid.parse(c.req.param("id"))]))).rows));

  app.route("/v1", v1);
}
