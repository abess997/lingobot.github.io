import { test, before } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { harness } from "./harness.js";
import { deliverWebhooks, emitDueSoon, processEvents, sign } from "../src/automation.js";

const { db, call, signup, waSent, hooks, workers, mails, setHookStatus } = await harness();
const day = (n: number) => new Date(Date.now() + n * 86400e3).toISOString().slice(0, 10);
const HOST = "auto-co.dealline.site";
let OWNER = "", OTHER = "", MEMBER = "", orgId = "", memberId = "";

const metaPost = (payload: unknown, secret = "meta_app_secret") => {
  const raw = JSON.stringify(payload);
  return call("POST", "/webhooks/whatsapp", {
    raw, headers: { "x-hub-signature-256": "sha256=" + createHmac("sha256", secret).update(raw).digest("hex") },
  });
};
const inbound = (from: string, id: string, text: string, name = "سارة") => ({
  object: "whatsapp_business_account",
  entry: [{ changes: [{ field: "messages", value: {
    messaging_product: "whatsapp", metadata: { phone_number_id: "1234567890" },
    contacts: [{ wa_id: from, profile: { name } }],
    messages: [{ from, id, type: "text", text: { body: text } }],
  } }] }],
});

before(async () => {
  OWNER = await signup("owner@auto.test", "شركة الأتمتة");
  OTHER = await signup("other@auto.test", "شركة أخرى");
  MEMBER = await signup("member@auto.test", "x");
  orgId = (await call("GET", "/me", { cookie: OWNER })).json.org_id;
  memberId = (await call("GET", "/me", { cookie: MEMBER })).json.id;
  await db.asSystem(async (q) => {
    await q.query("delete from memberships where user_id = $1", [memberId]);
    await q.query("insert into memberships values ($1,$2,'member')", [orgId, memberId]);
  });
  await call("PUT", "/api/org", { cookie: OWNER, body: { name: "شركة الأتمتة", fal_license: "1300011111" } });
  await call("PUT", "/api/site", { cookie: OWNER, body: { slug: "auto-co", title: "شركة الأتمتة" } });
  await call("POST", "/api/site/publish", { cookie: OWNER, body: { published: true } });
});

test("WhatsApp account: owner only, token encrypted at rest", async () => {
  const body = { phone_number_id: "1234567890", waba_id: "99887766", display_phone: "+966 50 000 0000", access_token: "EAAG-super-secret-token-123456" };
  assert.equal((await call("PUT", "/api/integrations/whatsapp", { cookie: MEMBER, body })).status, 403);
  assert.equal((await call("PUT", "/api/integrations/whatsapp", { cookie: OWNER, body })).status, 200);
  const raw = await db.asSystem((q) => q.query("select access_token_enc from whatsapp_accounts"));
  assert.equal(raw.rows[0].access_token_enc.includes("super-secret"), false);
  assert.equal((await call("GET", "/api/integrations/whatsapp", { cookie: OWNER })).json.access_token_enc, undefined);
});

test("rule: Snapchat lead -> task for owner + WhatsApp template + email; other sources skipped; once per event", async () => {
  assert.equal((await call("POST", "/api/automation/rules", { cookie: MEMBER, body: {} })).status, 403);
  assert.equal((await call("POST", "/api/automation/rules", { cookie: OWNER, body: {
    name: "x", trigger: "lead.created", actions: [{ type: "whatsapp_template", template: "Bad Name!" }] } })).status, 400);

  const rule = await call("POST", "/api/automation/rules", { cookie: OWNER, body: {
    name: "عميل سناب جديد", trigger: "lead.created", conditions: { "lead.source_channel": "snapchat" },
    actions: [
      { type: "create_task", title: "اتصل بـ {{lead.name}} خلال ساعة", assign_to: "owner", due_in_hours: 1 },
      { type: "whatsapp_template", template: "welcome_lead", language: "ar", params: ["{{lead.name}}"] },
      { type: "email", to: "owners", subject: "عميل جديد: {{lead.name}}", body: "رقم الجوال: {{contact.phone}}\n<script>x</script>{{lead.name}}" },
    ],
  } });
  assert.equal(rule.status, 201);

  await call("POST", `/public/sites/${HOST}/leads`, { body: { name: "<b>ريم</b>", phone: "0541112222", source_channel: "Snapchat", utm_campaign: "ramadan" } });
  await call("POST", `/public/sites/${HOST}/leads`, { body: { name: "علي", phone: "0541113333", source_channel: "google" } });
  const r1 = await processEvents(workers);
  assert.equal(r1.events, 2);
  assert.equal((await processEvents(workers)).events, 0, "nothing left to process");

  const tasks = (await call("GET", "/api/automation/tasks", { cookie: OWNER })).json;
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].title, "اتصل بـ <b>ريم</b> خلال ساعة");
  assert.ok(tasks[0].due_at);
  assert.equal(waSent.length, 1);
  assert.equal(waSent[0].to, "+966541112222");
  assert.deepEqual(waSent[0].message, { kind: "template", name: "welcome_lead", language: "ar", params: ["<b>ريم</b>"] });
  assert.equal(waSent[0].token, "EAAG-super-secret-token-123456");
  const mail = mails.find((m) => m.to === "owner@auto.test" && m.html.includes("0541112222".slice(1)))!;
  assert.ok(mail.html.includes("&lt;b&gt;ريم&lt;/b&gt;"), "email body is HTML-escaped");
  assert.equal(mail.html.includes("<script>"), false);

  const runs = (await call("GET", `/api/automation/runs?rule_id=${rule.json.id}`, { cookie: OWNER })).json;
  assert.deepEqual(runs.map((r: any) => r.status).sort(), ["done", "skipped"]);

  // pause -> no run
  await call("PATCH", `/api/automation/rules/${rule.json.id}`, { cookie: OWNER, body: { active: false } });
  await call("POST", `/public/sites/${HOST}/leads`, { body: { name: "نوف", phone: "0541114444", source_channel: "snapchat" } });
  await processEvents(workers);
  assert.equal(waSent.length, 1);
});

test("tasks: a member sees only their own", async () => {
  await call("POST", "/api/automation/tasks", { cookie: MEMBER, body: { title: "مهمتي" } });
  const mine = (await call("GET", "/api/automation/tasks", { cookie: MEMBER })).json;
  assert.deepEqual(mine.map((t: any) => t.title), ["مهمتي"]);
  assert.equal((await call("POST", "/api/automation/tasks", { cookie: MEMBER, body: { title: "x", assigned_to: (await call("GET", "/me", { cookie: OWNER })).json.id } })).status, 403);
  assert.deepEqual((await call("GET", "/api/automation/tasks", { cookie: OTHER })).json, []);
});

test("WhatsApp webhook: handshake, signature, new lead from inbound, dedupe, 24h window", async () => {
  assert.equal((await call("GET", "/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=verify_me&hub.challenge=12345")).json, 12345);
  assert.equal((await call("GET", "/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=nope&hub.challenge=1")).status, 403);
  assert.equal((await metaPost(inbound("966551230000", "wamid.in1", "مرحبا"), "wrong")).status, 401);

  assert.equal((await metaPost(inbound("966551230000", "wamid.in1", "أبي شقة 3 غرف"))).status, 200);
  assert.equal((await metaPost(inbound("966551230000", "wamid.in1", "أبي شقة 3 غرف"))).status, 200, "retry is fine");
  const leads = (await call("GET", "/api/leads", { cookie: OWNER })).json.filter((l: any) => l.phone === "+966551230000");
  assert.equal(leads.length, 1);
  assert.equal(leads[0].source, "whatsapp");
  assert.equal(leads[0].name, "سارة");
  const thread = (await call("GET", `/api/leads/${leads[0].id}/whatsapp`, { cookie: OWNER })).json;
  assert.equal(thread.length, 1);

  // reply inside the 24h window: free text allowed
  assert.equal((await call("POST", `/api/leads/${leads[0].id}/whatsapp`, { cookie: OWNER, body: { text: "أهلاً سارة، عندنا خيارات" } })).status, 201);
  // a lead who never wrote: free text refused, template allowed
  const quiet = (await call("GET", "/api/leads", { cookie: OWNER })).json.find((l: any) => l.name === "علي");
  assert.equal((await call("POST", `/api/leads/${quiet.id}/whatsapp`, { cookie: OWNER, body: { text: "مرحبا" } })).json.error, "outside_24h_window_use_template");
  assert.equal((await call("POST", `/api/leads/${quiet.id}/whatsapp`, { cookie: OWNER, body: { template: "follow_up", params: ["علي"] } })).status, 201);
  // a member cannot message a lead that is not assigned to them
  assert.equal((await call("POST", `/api/leads/${quiet.id}/whatsapp`, { cookie: MEMBER, body: { template: "follow_up" } })).status, 403);

  // delivery status moves forward only
  const outId = waSent.at(-1)!;
  void outId;
  const st = (id: string, status: string) => ({ object: "whatsapp_business_account", entry: [{ changes: [{ value: {
    metadata: { phone_number_id: "1234567890" }, statuses: [{ id, status }] } }] }] });
  const sentId = `wamid.${waSent.length}`;
  await metaPost(st(sentId, "read"));
  await metaPost(st(sentId, "delivered"));
  const msg = await db.asSystem((q) => q.query("select status from whatsapp_messages where wa_message_id = $1", [sentId]));
  assert.equal(msg.rows[0].status, "read");
});

test("outbound webhooks: internal URLs refused, signed delivery, retries with backoff", async () => {
  await processEvents(workers); // drain events from earlier tests (the WhatsApp lead), before the endpoint exists
  assert.equal((await call("POST", "/api/integrations/webhooks", { cookie: OWNER, body: { url: "https://internal-trap.example.com/h", event_types: ["lead.created"] } })).status, 422);
  assert.equal((await call("POST", "/api/integrations/webhooks", { cookie: OWNER, body: { url: "http://hooks.zapier.com/x", event_types: ["lead.created"] } })).status, 422);
  const ep = await call("POST", "/api/integrations/webhooks", { cookie: OWNER, body: { url: "https://hooks.zapier.com/hooks/catch/1/abc", event_types: ["lead.created"] } });
  assert.equal(ep.status, 201);
  assert.ok(ep.json.secret.startsWith("whsec_"));

  await call("POST", `/public/sites/${HOST}/leads`, { body: { name: "هند", phone: "0541115555" } });
  await processEvents(workers);
  const d1 = await deliverWebhooks(workers);
  assert.equal(d1.delivered, 1);
  const h = hooks.at(-1)!;
  const ts = Number(/t=(\d+)/.exec(h.headers["X-DealLine-Signature"])![1]);
  assert.equal(h.headers["X-DealLine-Signature"], sign(ep.json.secret, ts, h.body));
  assert.equal(JSON.parse(h.body).data.lead.name, "هند");

  setHookStatus(500);
  await call("POST", `/public/sites/${HOST}/leads`, { body: { name: "لمى", phone: "0541116666" } });
  await processEvents(workers);
  await deliverWebhooks(workers);
  const del = (await call("GET", `/api/integrations/webhooks/${ep.json.id}/deliveries`, { cookie: OWNER })).json;
  const failed = del.find((x: any) => x.status === "pending");
  assert.equal(failed.attempts, 1);
  assert.equal(failed.last_status, 500);
  assert.equal((await deliverWebhooks(workers)).attempted, 0, "not retried before backoff");
  setHookStatus(200);
});

test("public API: scoped keys, isolation, revoke", async () => {
  assert.equal((await call("POST", "/api/integrations/api-keys", { cookie: MEMBER, body: { name: "x", scopes: ["leads:read"] } })).status, 403);
  const k = await call("POST", "/api/integrations/api-keys", { cookie: OWNER, body: { name: "CRM sync", scopes: ["leads:read", "leads:write"] } });
  assert.equal(k.status, 201);
  const auth = { authorization: `Bearer ${k.json.key}` };
  const raw = await db.asSystem((q) => q.query("select key_hash from api_keys"));
  assert.equal(JSON.stringify(raw.rows).includes(k.json.key), false, "only the hash is stored");

  const created = await call("POST", "/v1/leads", { headers: auth, body: { name: "من الـ API", phone: "0547778888", source_channel: "tiktok" } });
  assert.equal(created.status, 201);
  const list = (await call("GET", "/v1/leads", { headers: auth })).json;
  assert.ok(list.some((l: any) => l.name === "من الـ API" && l.source === "api" && l.source_channel === "tiktok"));
  assert.equal((await call("GET", "/v1/listings", { headers: auth })).json.error, "insufficient_scope");
  assert.equal((await call("GET", "/v1/leads", { headers: { authorization: "Bearer dl_aaaaaaaa_notarealkeynotarealkey" } })).status, 401);

  const other = await call("POST", "/api/integrations/api-keys", { cookie: OTHER, body: { name: "o", scopes: ["leads:read"] } });
  const otherLeads = (await call("GET", "/v1/leads", { headers: { authorization: `Bearer ${other.json.key}` } })).json;
  assert.deepEqual(otherLeads, [], "a key only sees its own org");

  await call("DELETE", `/api/integrations/api-keys/${k.json.id}`, { cookie: OWNER });
  assert.equal((await call("GET", "/v1/leads", { headers: auth })).status, 401);
});

test("installment reminders 3 days before due, sent once, via a rule with a condition", async () => {
  const p = (await call("POST", "/api/offplan/projects", { cookie: OWNER, body: {
    name: "مشروع التذكير", city: "الخبر", wafi_license_number: "WAFI-9", escrow_iban: "SA0380000000608010167519",
    ad_license_number: "7300002222", ad_license_expires_on: day(90) } })).json.id;
  await call("POST", `/api/offplan/projects/${p}/status`, { cookie: OWNER, body: { status: "selling" } });
  const unit = (await call("POST", `/api/offplan/projects/${p}/units`, { cookie: OWNER, body: { code: "B-1", unit_type: "villa", area_sqm: 300, price_halalas: 150_000_000 } })).json[0].id;
  const plan = (await call("POST", `/api/offplan/projects/${p}/plans`, { cookie: OWNER, body: { name: "خطة", items: [
    { label: "الحجز", share_bp: 1000, trigger: "on_booking" },
    { label: "الدفعة الثانية", share_bp: 9000, trigger: "after_days", days_after_contract: 3 },
  ] } })).json.id;
  const deal = (await call("POST", "/api/offplan/deals", { cookie: OWNER, body: { unit_id: unit, plan_id: plan, buyer_name: "ماجد", buyer_phone: "0509990000" } })).json.id;
  const v = (await call("GET", `/api/offplan/deals/${deal}`, { cookie: OWNER })).json;
  await call("POST", `/api/offplan/installments/${v.installments[0].id}/receipts`, { cookie: OWNER, body: { amount_halalas: 15_000_000, received_on: day(0), bank_ref: "RMD-1" } });
  await call("POST", `/api/offplan/deals/${deal}/reserve`, { cookie: OWNER });
  await call("POST", `/api/offplan/deals/${deal}/contract`, { cookie: OWNER, body: { contract_ref: "C-77", signed_on: day(0) } });

  await call("POST", "/api/automation/rules", { cookie: OWNER, body: {
    name: "تذكير قبل 3 أيام", trigger: "installment.due_soon", conditions: { days: 3 },
    actions: [{ type: "whatsapp_template", template: "installment_reminder", params: ["{{contact.name}}", "{{installment.amount_sar}}", "{{installment.due_on}}"] }],
  } });
  await processEvents(workers); // drain earlier events (deal.held, deal.contracted)
  const before = waSent.length;
  assert.equal((await emitDueSoon(db)).due_soon_events, 1);
  assert.equal((await emitDueSoon(db)).due_soon_events, 0, "once per installment per reminder day");
  await processEvents(workers);
  assert.equal(waSent.length, before + 1);
  assert.deepEqual(waSent.at(-1)!.message.params, ["ماجد", "1350000", day(3)]);
});
