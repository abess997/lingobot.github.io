import { test, before } from "node:test";
import assert from "node:assert/strict";
import { harness } from "./harness.js";
import { runOffplanJobs, splitAmount } from "../src/offplan.js";

const { db, lite, call, signup } = await harness();
const day = (n: number) => new Date(Date.now() + n * 86400e3).toISOString().slice(0, 10);
let DEV = "", OTHER = "", REP = "";
let projectId = "", planId = "";
const units: Record<string, string> = {};

const project = {
  name: "مشروع واحة الشرقية", city: "الدمام", district: "الفرسان",
  wafi_license_number: "WAFI-2026-118", escrow_bank: "بنك تجريبي", escrow_iban: "SA03 8000 0000 6080 1016 7519",
  ad_license_number: "7200001111", ad_license_expires_on: day(60), expected_handover_on: day(700),
};
const plan = {
  name: "خطة 10/20/30/40",
  items: [
    { label: "دفعة الحجز", share_bp: 1000, trigger: "on_booking" },
    { label: "عند توقيع العقد", share_bp: 2000, trigger: "on_contract" },
    { label: "عند إنجاز 50%", share_bp: 3000, trigger: "at_progress", at_progress_pct: 50 },
    { label: "عند التسليم", share_bp: 4000, trigger: "on_handover" },
  ],
};
const deal = (unit: string, extra: object = {}) => ({ unit_id: units[unit], plan_id: planId, buyer_name: "خالد", buyer_phone: "0501234567", ...extra });
const dealView = async (id: string, cookie = DEV) => (await call("GET", `/api/offplan/deals/${id}`, { cookie })).json;
const pay = async (instId: string, amount: number, ref: string) =>
  call("POST", `/api/offplan/installments/${instId}/receipts`, { cookie: DEV, body: { amount_halalas: amount, received_on: day(0), bank_ref: ref } });

before(async () => {
  DEV = await signup("dev@example.com", "شركة تطوير");
  OTHER = await signup("other@example.com", "منافس");
  REP = await signup("rep@example.com", "x");
  const org = (await call("GET", "/me", { cookie: DEV })).json.org_id;
  const rep = (await call("GET", "/me", { cookie: REP })).json.id;
  await db.asSystem(async (q) => {
    await q.query("delete from memberships where user_id = $1", [rep]);
    await q.query("insert into memberships values ($1,$2,'member')", [org, rep]);
  });
});

test("split is exact to the halala", () => {
  const parts = splitAmount(1_000_000_01, [1000, 2000, 3000, 4000]);
  assert.equal(parts.reduce((a, b) => a + b, 0), 1_000_000_01);
});

test("project cannot sell without Wafi license, escrow account and ad license", async () => {
  const p = await call("POST", "/api/offplan/projects", { cookie: DEV, body: { name: "بدون تراخيص", city: "الخبر" } });
  assert.equal(p.status, 201);
  assert.equal((await call("POST", `/api/offplan/projects/${p.json.id}/status`, { cookie: DEV, body: { status: "selling" } })).json.error, "wafi_license_required");
  assert.equal((await call("POST", "/api/offplan/projects", { cookie: DEV, body: { ...project, escrow_iban: "SA12" } })).status, 400);

  const ok = await call("POST", "/api/offplan/projects", { cookie: DEV, body: project });
  projectId = ok.json.id;
  assert.equal((await call("POST", `/api/offplan/projects/${projectId}/status`, { cookie: DEV, body: { status: "selling" } })).json.status, "selling");
  assert.equal((await call("POST", `/api/offplan/projects/${projectId}/status`, { cookie: REP, body: { status: "draft" } })).status, 403);
});

test("units in bulk, plan must add up to 100%", async () => {
  const u = await call("POST", `/api/offplan/projects/${projectId}/units`, {
    cookie: DEV, body: { unit_type: "apartment", building: "A", floor: 1, area_sqm: 140, bedrooms: 3, price_halalas: 90_000_000, bulk: { prefix: "A-", from: 101, count: 4 } },
  });
  assert.equal(u.status, 201);
  for (const r of u.json) units[r.code] = r.id;
  assert.equal((await call("POST", `/api/offplan/projects/${projectId}/units`, { cookie: DEV, body: { code: "A-101", unit_type: "apartment", area_sqm: 1, price_halalas: 1 } })).status, 409);

  const bad = await call("POST", `/api/offplan/projects/${projectId}/plans`, { cookie: DEV, body: { ...plan, items: plan.items.slice(0, 3) } });
  assert.equal(bad.status, 400);
  const p = await call("POST", `/api/offplan/projects/${projectId}/plans`, { cookie: DEV, body: plan });
  assert.equal(p.status, 201);
  planId = p.json.id;
});

test("tenant isolation: another company sees and touches nothing", async () => {
  assert.deepEqual((await call("GET", "/api/offplan/projects", { cookie: OTHER })).json, []);
  assert.deepEqual((await call("GET", `/api/offplan/projects/${projectId}/units`, { cookie: OTHER })).json, []);
  assert.equal((await call("POST", "/api/offplan/deals", { cookie: OTHER, body: deal("A-101") })).status, 404);
  assert.equal((await call("POST", `/api/offplan/projects/${projectId}/progress`, { cookie: OTHER, body: { pct: 99, report_ref: "x", reported_on: day(0) } })).status, 404);
});

test("full journey: hold -> reserve -> contract -> milestone -> handover", async () => {
  const d = await call("POST", "/api/offplan/deals", { cookie: REP, body: deal("A-101") });
  assert.equal(d.status, 201);
  const id = d.json.id;
  // double sale guard
  assert.equal((await call("POST", "/api/offplan/deals", { cookie: DEV, body: deal("A-101", { buyer_name: "آخر" }) })).json.error, "unit_not_available");

  let v = await dealView(id);
  assert.deepEqual(v.installments.map((i: any) => i.amount_halalas), [9_000_000, 18_000_000, 27_000_000, 36_000_000]);
  assert.equal(v.installments[0].status, "due");
  assert.equal(v.escrow_iban, "SA0380000000608010167519");

  // reserving needs the booking payment in escrow
  assert.equal((await call("POST", `/api/offplan/deals/${id}/reserve`, { cookie: REP })).json.error, "booking_payment_not_received");
  // a member cannot record escrow receipts
  assert.equal((await call("POST", `/api/offplan/installments/${v.installments[0].id}/receipts`, { cookie: REP, body: { amount_halalas: 1, received_on: day(0), bank_ref: "TRX-1" } })).status, 403);
  assert.equal((await pay(v.installments[0].id, 9_000_001, "TRX-1")).json.error, "overpayment");
  assert.equal((await pay(v.installments[0].id, 4_000_000, "TRX-1")).json.remaining_halalas, 5_000_000);
  assert.equal((await pay(v.installments[0].id, 5_000_000, "TRX-1")).status, 409, "same bank ref twice");
  assert.equal((await pay(v.installments[0].id, 5_000_000, "TRX-2")).json.status, "paid");
  assert.equal((await call("POST", `/api/offplan/deals/${id}/reserve`, { cookie: REP })).json.status, "reserved");

  assert.equal((await call("POST", `/api/offplan/deals/${id}/contract`, { cookie: REP, body: { contract_ref: "CNT-1001", signed_on: day(0) } })).json.status, "contracted");
  v = await dealView(id);
  assert.equal(v.installments[1].status, "due");
  assert.equal(v.installments[2].due_on, null, "50% milestone not reached yet");

  // handover blocked: project not complete, installments open
  assert.equal((await call("POST", `/api/offplan/deals/${id}/handover`, { cookie: DEV, body: { handed_over_on: day(0) } })).json.error, "project_not_complete");

  const pr = await call("POST", `/api/offplan/projects/${projectId}/progress`, { cookie: DEV, body: { pct: 55, report_ref: "RPT-55", reported_on: day(0) } });
  assert.equal(pr.json.installments_now_due, 1);
  assert.equal((await call("POST", `/api/offplan/projects/${projectId}/progress`, { cookie: DEV, body: { pct: 40, report_ref: "RPT-x", reported_on: day(0) } })).json.error, "progress_cannot_go_down");

  v = await dealView(id);
  await pay(v.installments[1].id, 18_000_000, "TRX-3");
  await pay(v.installments[2].id, 27_000_000, "TRX-4");
  await call("POST", `/api/offplan/projects/${projectId}/progress`, { cookie: DEV, body: { pct: 100, report_ref: "RPT-100", reported_on: day(0) } });
  v = await dealView(id);
  assert.equal(v.installments[3].status, "due", "handover installment falls due at 100%");
  assert.equal((await call("POST", `/api/offplan/deals/${id}/handover`, { cookie: DEV, body: { handed_over_on: day(0) } })).json.error, "installments_outstanding");
  await pay(v.installments[3].id, 36_000_000, "TRX-5");
  assert.equal((await call("POST", `/api/offplan/deals/${id}/handover`, { cookie: DEV, body: { handed_over_on: day(0) } })).json.status, "handed_over");

  v = await dealView(id);
  assert.deepEqual(v.events.map((e: any) => e.type).filter((t: string) => t !== "escrow_receipt"), ["held", "reserved", "contracted", "handed_over"]);
  // the rep can see their own deal, another member could not
  assert.equal((await call("GET", `/api/offplan/deals/${id}`, { cookie: REP })).status, 200);
});

test("hold expires on its own and the unit goes back on sale", async () => {
  const d = await call("POST", "/api/offplan/deals", { cookie: DEV, body: deal("A-102") });
  await db.asSystem((q) => q.query("update offplan_deals set hold_expires_at = now() - interval '1 minute' where id = $1", [d.json.id]));
  const r = await runOffplanJobs(db);
  assert.equal(r.holds_expired, 1);
  assert.equal((await dealView(d.json.id)).status, "cancelled");
  const u = (await call("GET", `/api/offplan/projects/${projectId}/units`, { cookie: DEV })).json.find((x: any) => x.code === "A-102");
  assert.equal(u.status, "available");
});

test("default needs an overdue installment; cancel reports what was paid into escrow", async () => {
  const d = (await call("POST", "/api/offplan/deals", { cookie: DEV, body: deal("A-103") })).json.id;
  let v = await dealView(d);
  await pay(v.installments[0].id, 9_000_000, "TRX-20");
  await call("POST", `/api/offplan/deals/${d}/reserve`, { cookie: DEV });
  await call("POST", `/api/offplan/deals/${d}/contract`, { cookie: DEV, body: { contract_ref: "CNT-1003", signed_on: day(-10) } });
  // signed 10 days ago: on-contract installment is already overdue
  v = await dealView(d);
  assert.equal(v.installments[1].status, "overdue");
  assert.equal((await call("POST", `/api/offplan/deals/${d}/default`, { cookie: DEV, body: { reason: "قصير" } })).status, 400);
  assert.equal((await call("POST", `/api/offplan/deals/${d}/default`, { cookie: DEV, body: { reason: "تأخر سداد دفعة العقد أكثر من المهلة" } })).json.status, "defaulted");

  const dash = (await call("GET", `/api/offplan/dashboard?project_id=${projectId}`, { cookie: DEV })).json;
  assert.equal(dash.defaulted_deals, 1);
  // the project is already at 100%, so contract, 50% and handover installments all fell due on signing (18M + 27M + 36M)
  assert.equal(dash.overdue_outstanding_halalas, 81_000_000);
  assert.equal(dash.units.blocked, 1);

  const c = await call("POST", `/api/offplan/deals/${d}/cancel`, { cookie: DEV, body: { reason: "فسخ بعد التعثر وفق العقد" } });
  assert.equal(c.json.paid_to_escrow_halalas, 9_000_000);
  const u = (await call("GET", `/api/offplan/projects/${projectId}/units`, { cookie: DEV })).json.find((x: any) => x.code === "A-103");
  assert.equal(u.status, "available");
  assert.equal((await dealView(d)).installments.filter((i: any) => i.status === "cancelled").length, 3);
});

test("ownership transfer carries only the unpaid balance to the new buyer", async () => {
  const d = (await call("POST", "/api/offplan/deals", { cookie: DEV, body: deal("A-104") })).json.id;
  let v = await dealView(d);
  await pay(v.installments[0].id, 9_000_000, "TRX-30");
  await call("POST", `/api/offplan/deals/${d}/reserve`, { cookie: DEV });
  await call("POST", `/api/offplan/deals/${d}/contract`, { cookie: DEV, body: { contract_ref: "CNT-1004", signed_on: day(0) } });
  v = await dealView(d);
  await pay(v.installments[1].id, 8_000_000, "TRX-31"); // partial

  const t = await call("POST", `/api/offplan/deals/${d}/transfer`, {
    cookie: DEV, body: { buyer_name: "فهد", buyer_phone: "0559998888", contract_ref: "CNT-1004-T", signed_on: day(0), reason: "تنازل بموافقة المطور" },
  });
  assert.equal(t.status, 201);
  const nv = await dealView(t.json.to);
  assert.equal(nv.status, "contracted");
  assert.equal(nv.transferred_from, d);
  // all four installments were on the old deal; booking was paid, contract partly paid (8M of 18M)
  // unpaid balance = 10M + 27M + 36M = 73M; paid ones stay as history on the old deal
  assert.equal(nv.installments.reduce((s: number, i: any) => s + i.amount_halalas, 0), 73_000_000);
  assert.equal((await dealView(d)).status, "transferred");
});

test("public site: project page with units and plans, no buyer data; interest form creates a lead", async () => {
  await call("PUT", "/api/org", { cookie: DEV, body: { name: "شركة تطوير", fal_license: "1200099999" } });
  await call("PUT", "/api/site", { cookie: DEV, body: { slug: "dev-co", title: "شركة تطوير" } });
  await call("POST", "/api/site/publish", { cookie: DEV, body: { published: true } });

  const list = (await call("GET", "/public/sites/dev-co.dealline.site/projects")).json;
  assert.equal(list.length, 1);
  assert.equal(list[0].wafi_license_number, "WAFI-2026-118");
  const page = (await call("GET", `/public/sites/dev-co.dealline.site/projects/${projectId}`)).json;
  assert.ok(page.units?.length >= 4, JSON.stringify(page));
  assert.equal(JSON.stringify(page).includes("خالد"), false, "buyer names must not leak");
  assert.equal(JSON.stringify(page).includes("SA03"), false, "escrow IBAN not on the public page");
  assert.equal(page.payment_plans[0].items.length, 4);

  const free = page.units.find((u: any) => u.available);
  const lead = await call("POST", `/public/sites/dev-co.dealline.site/projects/${projectId}/interest`, { body: { name: "منيرة", phone: "0533334444", unit_id: free.id } });
  assert.equal(lead.status, 201);
  const leads = (await call("GET", "/api/leads", { cookie: DEV })).json;
  assert.equal(leads[0].name, "منيرة");
  assert.equal((await call("GET", "/public/sites/dev-co.dealline.site/projects")).status, 200);
  // raw RLS check on a new table
  const otherOrg = (await call("GET", "/me", { cookie: OTHER })).json.org_id;
  assert.equal((await db.asOrg(otherOrg, (q) => q.query("select * from installments"))).rows.length, 0);
  void lite;
});
