import { test, before } from "node:test";
import assert from "node:assert/strict";
import { harness } from "./harness.js";

const { lite, db, mails, moyasar, dns, call, signup } = await harness();
const listing = (extra: object = {}) => ({
  title: "شقة للبيع في الدمام", purpose: "sale", property_type: "apartment", price_halalas: 85_000_000, city: "الدمام", ...extra,
});
const future = new Date(Date.now() + 30 * 86400e3).toISOString().slice(0, 10);
const past = new Date(Date.now() - 86400e3).toISOString().slice(0, 10);

let A = "", B = "";
before(async () => {
  A = await signup("a@example.com", "مكتب أ");
  B = await signup("b@example.com", "مكتب ب");
});

test("a second tenant gets nothing back (API and raw RLS)", async () => {
  const site = await call("PUT", "/api/site", { cookie: A, body: { slug: "office-a", title: "مكتب أ" } });
  assert.equal(site.status, 200);
  const l = await call("POST", "/api/listings", { cookie: A, body: listing() });
  assert.equal(l.status, 201);

  assert.deepEqual((await call("GET", "/api/listings", { cookie: B })).json, []);
  assert.equal((await call("GET", "/api/site", { cookie: B })).json, null);
  assert.equal((await call("PATCH", `/api/listings/${l.json.id}`, { cookie: B, body: { title: "مخترق!" } })).status, 404);
  assert.equal((await call("DELETE", `/api/listings/${l.json.id}`, { cookie: B })).status, 404);

  const orgA = (await call("GET", "/me", { cookie: A })).json.org_id;
  const orgB = (await call("GET", "/me", { cookie: B })).json.org_id;
  const raw = await db.asOrg(orgB, (q) => q.query("select * from listings"));
  assert.equal(raw.rows.length, 0);
  await assert.rejects(db.asOrg(orgB, (q) => q.query(
    `insert into listings (org_id, title, purpose, property_type, price_halalas, city) values ($1,'xxx','sale','land',1,'x')`, [orgA])));
  // no org set at all: nothing visible
  const none = await lite.transaction(async (t: any) => { await t.query("set local role dealline_app"); return t.query("select * from listings"); });
  assert.equal(none.rows.length, 0);
});

test("REGA: a listing cannot be published without a valid ad license", async () => {
  const l = await call("POST", "/api/listings", { cookie: A, body: listing({ title: "فيلا بدون ترخيص" }) });
  assert.equal((await call("POST", `/api/listings/${l.json.id}/status`, { cookie: A, body: { status: "published" } })).status, 422);
  await call("PATCH", `/api/listings/${l.json.id}`, { cookie: A, body: { ad_license_number: "7100001234", ad_license_expires_on: past } });
  assert.equal((await call("POST", `/api/listings/${l.json.id}/status`, { cookie: A, body: { status: "published" } })).status, 422);
  await call("PATCH", `/api/listings/${l.json.id}`, { cookie: A, body: { ad_license_expires_on: future } });
  const ok = await call("POST", `/api/listings/${l.json.id}/status`, { cookie: A, body: { status: "published" } });
  assert.equal(ok.json.status, "published");
});

test("site publishing needs a FAL license; public site shows only live listings", async () => {
  assert.equal((await call("POST", "/api/site/publish", { cookie: A, body: { published: true } })).json.error, "fal_license_required");
  assert.equal((await call("PUT", "/api/org", { cookie: A, body: { name: "مكتب أ", fal_license: "1100012345" } })).status, 200);
  assert.equal((await call("POST", "/api/site/publish", { cookie: A, body: { published: true } })).status, 200);

  const s = await call("GET", "/public/sites/office-a.dealline.site");
  assert.equal(s.status, 200);
  assert.equal(s.json.advertiser.fal_license, "1100012345");
  const ls = await call("GET", "/public/sites/office-a.dealline.site/listings");
  assert.equal(ls.json.length, 1, "draft listing must not show");
  assert.ok(ls.json[0].ad_license_number);
  assert.equal((await call("GET", "/public/sites/nobody.dealline.site")).status, 404);
});

test("public lead form: Saudi phone normalised, invalid rejected, honeypot swallowed", async () => {
  const ls = await call("GET", "/public/sites/office-a.dealline.site/listings");
  const ok = await call("POST", "/public/sites/office-a.dealline.site/leads", { body: { name: "سعد", phone: "0551234567", listing_id: ls.json[0].id } });
  assert.equal(ok.status, 201);
  assert.equal((await call("POST", "/public/sites/office-a.dealline.site/leads", { body: { name: "x", phone: "12345" } })).status, 400);
  const bot = await call("POST", "/public/sites/office-a.dealline.site/leads", { body: { name: "bot", phone: "0550000000", website: "http://spam" } });
  assert.equal(bot.status, 201, "bot sees success");
  const leads = (await call("GET", "/api/leads", { cookie: A })).json;
  assert.equal(leads[0].phone, "+966551234567");
  assert.equal(leads[0].listing_title, ls.json[0].title);
  assert.deepEqual((await call("GET", "/api/leads", { cookie: B })).json, []);
});

test("members cannot publish, cannot edit others' listings", async () => {
  const m = await signup("m@example.com", "ignored");
  const orgA = (await call("GET", "/me", { cookie: A })).json.org_id;
  const mid = (await call("GET", "/me", { cookie: m })).json.id;
  await db.asSystem(async (q) => {
    await q.query("delete from memberships where user_id = $1", [mid]);
    await q.query("insert into memberships (org_id, user_id, role) values ($1,$2,'member')", [orgA, mid]);
  });
  const mine = await call("POST", "/api/listings", { cookie: m, body: listing({ title: "إعلان العضو", ad_license_number: "7100009999", ad_license_expires_on: future }) });
  assert.equal(mine.status, 201);
  assert.equal((await call("POST", `/api/listings/${mine.json.id}/status`, { cookie: m, body: { status: "published" } })).status, 403);
  const others = (await call("GET", "/api/listings", { cookie: A })).json.find((x: any) => x.title === "شقة للبيع في الدمام");
  assert.equal((await call("PATCH", `/api/listings/${others.id}`, { cookie: m, body: { title: "تعديل" } })).status, 403);
  assert.equal((await call("PUT", "/api/site/deposits", { cookie: m, body: { accept_deposits: true, deposit_halalas: 50000 } })).status, 403);
});

test("deposit: wrong secret rejected, paid once, duplicate ignored, unit reserved", async () => {
  assert.equal((await call("PUT", "/api/site/deposits", { cookie: A, body: { accept_deposits: true, deposit_halalas: 100_000 } })).status, 200);
  const live = (await call("GET", "/public/sites/office-a.dealline.site/listings")).json[0];
  const r = await call("POST", "/public/sites/office-a.dealline.site/reservations", { body: { name: "نورة", phone: "0561112222", listing_id: live.id } });
  assert.equal(r.status, 201);
  assert.equal(r.json.moyasar.amount, 100_000);

  moyasar.set("pay_1", { id: "pay_1", status: "paid", amount: 100_000, currency: "SAR", metadata: { reservation_id: r.json.reservation_id } });
  const ev = { id: "evt_1", type: "payment_paid", secret_token: "whsec_test", data: { id: "pay_1" } };
  assert.equal((await call("POST", "/webhooks/moyasar", { body: { ...ev, secret_token: "nope" } })).status, 401);
  assert.equal((await call("POST", "/webhooks/moyasar", { body: ev })).json.result, "paid");
  assert.equal((await call("POST", "/webhooks/moyasar", { body: ev })).json.duplicate, true);
  assert.equal((await call("GET", "/public/payments/pay_1")).json.result, "paid");

  const after = (await call("GET", `/public/sites/office-a.dealline.site/listings/${live.id}`)).json;
  assert.equal(after.status, "reserved");
  const again = await call("POST", "/public/sites/office-a.dealline.site/reservations", { body: { name: "x", phone: "0561112223", listing_id: live.id } });
  assert.equal(again.json.error, "already_reserved");
});

test("deposit: tampered amount is not marked paid", async () => {
  const l = await call("POST", "/api/listings", { cookie: A, body: listing({ title: "شقة ثانية", ad_license_number: "7100005555", ad_license_expires_on: future }) });
  await call("POST", `/api/listings/${l.json.id}/status`, { cookie: A, body: { status: "published" } });
  const r = await call("POST", "/public/sites/office-a.dealline.site/reservations", { body: { name: "س", phone: "0561112229", listing_id: l.json.id } });
  moyasar.set("pay_2", { id: "pay_2", status: "paid", amount: 100, currency: "SAR", metadata: { reservation_id: r.json.reservation_id } });
  const res = await call("POST", "/webhooks/moyasar", { body: { id: "evt_2", type: "payment_paid", secret_token: "whsec_test", data: { id: "pay_2" } } });
  assert.equal(res.json.result, "mismatch");
});

test("custom domain: verified by DNS TXT, then serves the site", async () => {
  const d = await call("POST", "/api/domains", { cookie: A, body: { hostname: "Ofuq-Realty.sa" } });
  assert.equal(d.status, 201);
  assert.equal(d.json.hostname, "ofuq-realty.sa");
  assert.equal((await call("GET", "/public/sites/ofuq-realty.sa")).status, 404, "unverified domain must not serve");
  assert.equal((await call("POST", `/api/domains/${d.json.id}/verify`, { cookie: A })).json.verified, false);
  dns.set("_dealline-verify.ofuq-realty.sa", [[d.json.dns[0].value]]);
  assert.equal((await call("POST", `/api/domains/${d.json.id}/verify`, { cookie: A })).json.verified, true);
  assert.equal((await call("GET", "/public/sites/ofuq-realty.sa")).status, 200);
  assert.equal((await call("POST", "/api/domains", { cookie: B, body: { hostname: "ofuq-realty.sa" } })).status, 422, "B has no site yet");
});

test("email verification, password reset signs out everywhere", async () => {
  const link = mails.find((m) => m.to === "b@example.com")!.html.match(/token=([\w-]+)/)![1];
  assert.equal((await call("POST", "/auth/verify-email", { body: { token: link } })).status, 200);
  assert.equal((await call("POST", "/auth/verify-email", { body: { token: link } })).status, 400, "single use");
  assert.equal((await call("GET", "/me", { cookie: B })).json.email_verified, true);

  await call("POST", "/auth/password/forgot", { body: { email: "b@example.com" } });
  assert.equal((await call("POST", "/auth/password/forgot", { body: { email: "ghost@example.com" } })).status, 200);
  const reset = mails.at(-1)!.html.match(/token=([\w-]+)/)![1];
  assert.equal((await call("POST", "/auth/password/reset", { body: { token: reset, password: "brand-new-password" } })).status, 200);
  assert.equal((await call("GET", "/me", { cookie: B })).status, 401);
  assert.equal((await call("POST", "/auth/login", { body: { email: "b@example.com", password: "long-enough-pw" } })).status, 401);
  B = (await call("POST", "/auth/login", { body: { email: "b@example.com", password: "brand-new-password" } })).cookie!;
  assert.ok(B);
});

test("account deletion actually deletes the user and their solo org", async () => {
  await call("PUT", "/api/site", { cookie: B, body: { slug: "office-b", title: "مكتب ب" } });
  assert.equal((await call("DELETE", "/me", { cookie: B, body: { password: "wrong" } })).status, 401);
  assert.equal((await call("DELETE", "/me", { cookie: B, body: { password: "brand-new-password" } })).status, 200);
  const left = await db.asSystem((q) => q.query(
    `select (select count(*) from users where email = 'b@example.com')::int u, (select count(*) from orgs where name = 'مكتب ب')::int o,
            (select count(*) from sites where slug = 'office-b')::int s`));
  assert.deepEqual(left.rows[0], { u: 0, o: 0, s: 0 });
  // owner A has paid reservations: deletion is blocked, not silently dropping payment records
  assert.equal((await call("DELETE", "/me", { cookie: A, body: { password: "long-enough-pw" } })).json.error, "org_has_paid_reservations");
});
