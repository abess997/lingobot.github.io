// Automation: rules run on events from the outbox. "When X happens (and conditions match), do Y":
// create a task for the right employee, send the customer a WhatsApp template or an email.
// Rules can be paused any time. Each rule runs at most once per event.
import { Hono, type Context } from "hono";
import { z } from "zod";
import { lookup as dnsLookup } from "node:dns/promises";
import { isIP } from "node:net";
import { createHmac } from "node:crypto";
import type { Db } from "./db.js";
import type { Env } from "./env.js";
import type { Vars } from "./auth.js";
import type { Mailer } from "./services.js";
import type { WhatsAppClient } from "./whatsapp.js";
import { can, type Action } from "./authz.js";
import { HttpError, body, deny, notFound } from "./http.js";
import { EVENT_TYPES, decrypt } from "./events.js";

const uuid = z.string().uuid();
const tmpl = z.string().trim().min(1).max(1000);

export const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("create_task"),
    title: tmpl.max(200),
    assign_to: z.union([z.enum(["assignee", "owner"]), uuid]).default("assignee"),
    due_in_hours: z.number().int().min(0).max(24 * 90).optional(),
  }),
  z.object({
    type: z.literal("whatsapp_template"),
    template: z.string().regex(/^[a-z0-9_]{1,512}$/, "اسم قالب واتساب المعتمد"),
    language: z.string().regex(/^[a-z]{2}(_[A-Z]{2})?$/).default("ar"),
    params: z.array(tmpl.max(200)).max(10).default([]),
  }),
  z.object({
    type: z.literal("email"),
    to: z.enum(["contact", "owners"]),
    subject: tmpl.max(150),
    body: tmpl.max(3000),
  }),
]);
const conditionsSchema = z.record(z.string().regex(/^[a-z_]+(\.[a-z_]+)*$/), z.union([z.string().max(200), z.number(), z.boolean()]))
  .refine((o) => Object.keys(o).length <= 10, "max 10 conditions");
const ruleInput = z.object({
  name: z.string().trim().min(1).max(100),
  trigger: z.enum(EVENT_TYPES),
  conditions: conditionsSchema.default({}),
  actions: z.array(actionSchema).min(1).max(10),
  active: z.boolean().default(true),
});

const get = (o: any, path: string) => path.split(".").reduce((v, k) => (v == null ? undefined : v[k]), o);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
/** {{lead.name}} -> value from the event payload. Unknown keys render empty. */
export const render = (s: string, payload: unknown, html = false) =>
  // in HTML mode the template text itself is escaped too ({{ }} placeholders contain nothing escapable)
  (html ? esc(s) : s).replace(/\{\{\s*([a-z_]+(?:\.[a-z_]+)*)\s*\}\}/g, (_, p) => {
    const v = get(payload, p);
    const str = v == null ? "" : String(v);
    return html ? esc(str) : str;
  });
export const matches = (conditions: Record<string, unknown>, payload: unknown) =>
  Object.entries(conditions).every(([k, v]) => get(payload, k) === v);

type Ctx = Context<{ Variables: Vars }>;

export function automationApi(db: Db) {
  const r = new Hono<{ Variables: Vars }>();
  const member = (c: Ctx) => { const m = c.get("member"); if (!m) throw deny(); return m; };
  const need = (c: Ctx, a: Action) => { const m = member(c); if (!can(m, a)) throw deny(); return m; };

  r.get("/rules", async (c) => {
    const m = need(c, "automation:manage");
    return c.json((await db.asOrg(m.orgId, (q) => q.query(`select * from automation_rules order by created_at`))).rows);
  });

  r.post("/rules", async (c) => {
    const m = need(c, "automation:manage");
    const b = await body(c, ruleInput);
    const row = await db.asOrg(m.orgId, (q) => q.query(
      `insert into automation_rules (org_id, name, trigger, conditions, actions, active, created_by)
       values ($1,$2,$3,$4,$5,$6,$7) returning id, active`,
      [m.orgId, b.name, b.trigger, JSON.stringify(b.conditions), JSON.stringify(b.actions), b.active, c.get("userId")]));
    return c.json(row.rows[0], 201);
  });

  r.patch("/rules/:id", async (c) => {
    const m = need(c, "automation:manage");
    const id = uuid.parse(c.req.param("id"));
    const b = await body(c, ruleInput.partial().omit({ trigger: true }));
    const row = await db.asOrg(m.orgId, (q) => q.query(
      `update automation_rules set name = coalesce($2, name), conditions = coalesce($3, conditions),
         actions = coalesce($4, actions), active = coalesce($5, active) where id = $1 returning id, active`,
      [id, b.name ?? null, b.conditions ? JSON.stringify(b.conditions) : null, b.actions ? JSON.stringify(b.actions) : null, b.active ?? null]));
    if (!row.rows[0]) throw notFound();
    return c.json(row.rows[0]);
  });

  r.delete("/rules/:id", async (c) => {
    const m = need(c, "automation:manage");
    const row = await db.asOrg(m.orgId, (q) => q.query(`delete from automation_rules where id = $1 returning id`, [uuid.parse(c.req.param("id"))]));
    if (!row.rows[0]) throw notFound();
    return c.json({ ok: true });
  });

  r.get("/runs", async (c) => {
    const m = need(c, "automation:manage");
    const rid = uuid.optional().parse(c.req.query("rule_id"));
    return c.json((await db.asOrg(m.orgId, (q) => q.query(
      `select r.id, r.rule_id, r.status, r.detail, r.created_at, e.type as event_type
         from automation_runs r join events e on e.id = r.event_id
        where ($1::uuid is null or r.rule_id = $1) order by r.created_at desc limit 200`, [rid ?? null]))).rows);
  });

  // ---- tasks ----
  r.get("/tasks", async (c) => {
    const m = member(c);
    const status = z.enum(["open", "done", "cancelled"]).optional().parse(c.req.query("status"));
    const mineOnly = m.role === "member" || c.req.query("mine") === "1";
    return c.json((await db.asOrg(m.orgId, (q) => q.query(
      `select * from tasks where ($1::text is null or status = $1) and ($2::uuid is null or assigned_to = $2)
        order by status = 'open' desc, due_at nulls last, created_at desc limit 200`,
      [status ?? null, mineOnly ? c.get("userId") : null]))).rows);
  });

  r.post("/tasks", async (c) => {
    const m = member(c);
    const b = await body(c, z.object({
      title: z.string().trim().min(1).max(200), description: z.string().max(2000).nullish(),
      due_at: z.string().datetime({ offset: true }).nullish(), assigned_to: uuid.nullish(),
      related_type: z.enum(["lead", "listing", "deal", "installment", "reservation"]).nullish(), related_id: uuid.nullish(),
    }));
    const assignee = b.assigned_to ?? c.get("userId");
    if (assignee !== c.get("userId") && !can(m, "lead:assign")) throw deny();
    const ok = await db.asSystem((q) => q.query(`select 1 from memberships where org_id = $1 and user_id = $2`, [m.orgId, assignee]));
    if (!ok.rows[0]) throw new HttpError(422, "assignee_not_in_org");
    const row = await db.asOrg(m.orgId, (q) => q.query(
      `insert into tasks (org_id, title, description, due_at, assigned_to, related_type, related_id, created_by)
       values ($1,$2,$3,$4,$5,$6,$7,$8) returning id`,
      [m.orgId, b.title, b.description ?? null, b.due_at ?? null, assignee, b.related_type ?? null, b.related_id ?? null, c.get("userId")]));
    return c.json(row.rows[0], 201);
  });

  r.patch("/tasks/:id", async (c) => {
    const m = member(c);
    const id = uuid.parse(c.req.param("id"));
    const { status } = await body(c, z.object({ status: z.enum(["open", "done", "cancelled"]) }));
    const row = await db.asOrg(m.orgId, async (q) => {
      const t = (await q.query(`select assigned_to from tasks where id = $1`, [id])).rows[0];
      if (!t) throw notFound();
      if (t.assigned_to !== c.get("userId") && !can(m, "lead:assign")) throw deny();
      return q.query(`update tasks set status = $2 where id = $1 returning id, status`, [id, status]);
    });
    return c.json(row.rows[0]);
  });

  return r;
}

// ================= workers =================
export type WorkerDeps = {
  db: Db; env: Env; mailer: Mailer; whatsapp: WhatsAppClient;
  fetch?: typeof fetch;
  lookup?: (host: string) => Promise<{ address: string }[]>;
};

/** Claims pending events, runs matching rules, queues webhook deliveries. Safe to run on a timer. */
export async function processEvents(d: WorkerDeps, limit = 50) {
  const { db } = d;
  const events = (await db.asSystem((q) => q.query(
    `update events set processed_at = now() where id in (
       select id from events where processed_at is null order by created_at limit $1 for update skip locked)
     returning id, org_id, type, payload`, [limit]))).rows;
  let runs = 0;
  for (const ev of events) {
    await db.asSystem((q) => q.query(
      `insert into webhook_deliveries (org_id, endpoint_id, event_id)
       select org_id, id, $2 from webhook_endpoints where org_id = $1 and active and $3 = any(event_types)
       on conflict do nothing`, [ev.org_id, ev.id, ev.type]));
    const rules = (await db.asSystem((q) => q.query(
      `select * from automation_rules where org_id = $1 and trigger = $2 and active order by created_at`, [ev.org_id, ev.type]))).rows;
    for (const rule of rules) {
      const claimed = await db.asSystem((q) => q.query(
        `insert into automation_runs (org_id, rule_id, event_id, status) values ($1,$2,$3,'skipped')
         on conflict do nothing returning id`, [ev.org_id, rule.id, ev.id]));
      const runId = claimed.rows[0]?.id;
      if (!runId) continue;
      if (!matches(rule.conditions, ev.payload)) continue; // stays 'skipped'
      const notes: string[] = [];
      let failed = false;
      for (const raw of rule.actions) {
        try {
          notes.push(await runAction(d, ev, rule, actionSchema.parse(raw)));
        } catch (e) {
          failed = true;
          notes.push(`${raw?.type}: ${(e as Error).message}`.slice(0, 300));
        }
      }
      runs++;
      await db.asSystem((q) => q.query(`update automation_runs set status = $2, detail = $3 where id = $1`,
        [runId, failed ? "failed" : "done", notes.join(" | ").slice(0, 2000)]));
    }
  }
  return { events: events.length, runs };
}

async function runAction(d: WorkerDeps, ev: any, rule: any, a: z.infer<typeof actionSchema>): Promise<string> {
  const { db, env } = d;
  const p = ev.payload;
  if (a.type === "create_task") {
    const target = a.assign_to === "assignee" ? p.assignee : a.assign_to === "owner" ? null : a.assign_to;
    const user = (await db.asSystem((q) => q.query(
      target
        ? `select user_id from memberships where org_id = $1 and user_id = $2`
        : `select user_id from memberships where org_id = $1 and role = 'owner' order by created_at limit 1`,
      target ? [ev.org_id, target] : [ev.org_id]))).rows[0]
      ?? (await db.asSystem((q) => q.query(`select user_id from memberships where org_id = $1 and role = 'owner' order by created_at limit 1`, [ev.org_id]))).rows[0];
    const rel = p.related && uuid.safeParse(p.related.id).success ? p.related : null;
    await db.asOrg(ev.org_id, (q) => q.query(
      `insert into tasks (org_id, title, due_at, assigned_to, related_type, related_id, rule_id)
       values ($1,$2, case when $3::int is null then null else now() + make_interval(hours => $3::int) end, $4,$5,$6,$7)`,
      [ev.org_id, render(a.title, p).slice(0, 200), a.due_in_hours ?? null, user?.user_id ?? null, rel?.type ?? null, rel?.id ?? null, rule.id]));
    return "task";
  }
  if (a.type === "whatsapp_template") {
    const phone = p.contact?.phone;
    if (!phone) return "whatsapp: no phone, skipped";
    const acc = (await db.asOrg(ev.org_id, (q) => q.query(`select * from whatsapp_accounts where active limit 1`))).rows[0];
    if (!acc) throw new Error("whatsapp not connected");
    const params = a.params.map((s) => render(s, p).slice(0, 200) || "-");
    const sent = await d.whatsapp.send({
      phoneNumberId: acc.phone_number_id, token: decrypt(acc.access_token_enc, env.SECRETS_KEY), to: phone,
      message: { kind: "template", name: a.template, language: a.language, params },
    });
    await db.asOrg(ev.org_id, (q) => q.query(
      `insert into whatsapp_messages (org_id, lead_id, direction, wa_message_id, phone, kind, body, template_name, status)
       values ($1,$2,'out',$3,$4,'template',$5,$6,'sent')`,
      [ev.org_id, uuid.safeParse(p.lead?.id).success ? p.lead.id : null, sent.id, phone, params.join(" | "), a.template]));
    return "whatsapp";
  }
  // email
  const to = a.to === "contact"
    ? (p.contact?.email ? [p.contact.email] : [])
    : (await db.asSystem((q) => q.query(
        `select u.email from memberships m join users u on u.id = m.user_id where m.org_id = $1 and m.role in ('owner','admin')`, [ev.org_id]))).rows.map((r: any) => r.email);
  if (!to.length) return "email: no recipient, skipped";
  for (const addr of to)
    await d.mailer.send(addr, render(a.subject, p).replace(/[\r\n]/g, " ").slice(0, 150),
      `<div dir="rtl">${render(a.body, p, true).replace(/\n/g, "<br>")}</div>`);
  return `email x${to.length}`;
}

// ---------- outbound webhooks (Zapier, Make, n8n, your own systems) ----------
const PRIVATE = [
  /^10\./, /^127\./, /^0\./, /^169\.254\./, /^192\.168\./, /^172\.(1[6-9]|2\d|3[01])\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^::1$/, /^::$/, /^f[cd]/i, /^fe[89ab]/i, /^::ffff:(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.)/i,
];
/** Blocks webhooks aimed at internal addresses (SSRF). */
export async function assertPublicUrl(url: string, lookup: WorkerDeps["lookup"] = (h) => dnsLookup(h, { all: true })) {
  const u = new URL(url);
  if (u.protocol !== "https:") throw new Error("https only");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (/^(localhost|.*\.local|.*\.internal|.*\.localhost)$/i.test(host)) throw new Error("internal host");
  const addrs = isIP(host) ? [{ address: host }] : await lookup(host);
  if (!addrs.length || addrs.some((a) => PRIVATE.some((re) => re.test(a.address)))) throw new Error("internal address");
}

export const sign = (secret: string, ts: number, raw: string) =>
  `t=${ts},v1=${createHmac("sha256", secret).update(`${ts}.${raw}`).digest("hex")}`;
const BACKOFF_S = [60, 300, 1800, 7200, 43200];

export async function deliverWebhooks(d: WorkerDeps, limit = 50) {
  const { db, env } = d;
  const fetchFn = d.fetch ?? fetch;
  const due = (await db.asSystem((q) => q.query(
    `select w.id, w.attempts, e.id as event_id, e.type, e.payload, e.created_at, ep.url, ep.secret_enc
       from webhook_deliveries w join events e on e.id = w.event_id join webhook_endpoints ep on ep.id = w.endpoint_id
      where w.status = 'pending' and w.next_attempt_at <= now() and ep.active
      order by w.next_attempt_at limit $1`, [limit]))).rows;
  let ok = 0;
  for (const w of due) {
    let status = 0;
    try {
      await assertPublicUrl(w.url, d.lookup);
      const raw = JSON.stringify({ id: w.event_id, type: w.type, created_at: w.created_at, data: w.payload });
      const ts = Math.floor(Date.now() / 1000);
      const r = await fetchFn(w.url, {
        method: "POST", redirect: "manual", signal: AbortSignal.timeout(10_000),
        headers: {
          "Content-Type": "application/json", "User-Agent": "DealLine-Webhooks/1",
          "X-DealLine-Event": w.type, "X-DealLine-Event-Id": w.event_id,
          "X-DealLine-Signature": sign(decrypt(w.secret_enc, env.SECRETS_KEY), ts, raw),
        },
        body: raw,
      });
      status = r.status;
    } catch { status = 0; }
    const delivered = status >= 200 && status < 300;
    if (delivered) ok++;
    const attempts = w.attempts + 1;
    await db.asSystem((q) => q.query(
      `update webhook_deliveries set attempts = $2::int, last_status = $3::int,
         status = case when $4::boolean then 'delivered' when $2::int > $5::int then 'dead' else 'pending' end,
         next_attempt_at = now() + make_interval(secs => $6::int)
       where id = $1`,
      [w.id, attempts, status || null, delivered, BACKOFF_S.length, BACKOFF_S[Math.min(attempts - 1, BACKOFF_S.length - 1)]]));
  }
  return { attempted: due.length, delivered: ok };
}

/** Daily: reminders 7, 3 and 1 days before an installment is due (once each). */
export async function emitDueSoon(db: Db) {
  return db.asSystem(async (q) => {
    const r = await q.query(
      `insert into events (org_id, type, payload)
       select i.org_id, 'installment.due_soon', jsonb_build_object(
           'days', n.days,
           'installment', jsonb_build_object('id', i.id, 'label', i.label, 'amount_sar', round((i.amount_halalas - i.paid_halalas) / 100.0, 2), 'due_on', i.due_on),
           'deal', jsonb_build_object('id', d.id, 'buyer_name', d.buyer_name, 'unit_code', u.code, 'project_name', p.name),
           'contact', jsonb_build_object('name', d.buyer_name, 'phone', d.buyer_phone, 'email', d.buyer_email),
           'assignee', d.sales_rep, 'related', jsonb_build_object('type', 'installment', 'id', i.id))
         from installments i
         join offplan_deals d on d.id = i.deal_id join units u on u.id = d.unit_id join projects p on p.id = u.project_id
         cross join (values (1), (3), (7)) as n(days)
        where i.status in ('scheduled','due') and i.due_on = current_date + n.days
          and d.status in ('reserved','contracted')
          and not exists (select 1 from events e where e.org_id = i.org_id and e.type = 'installment.due_soon'
                            and e.payload->'installment'->>'id' = i.id::text and (e.payload->>'days')::int = n.days)
       returning id`);
    return { due_soon_events: r.rows.length };
  });
}
