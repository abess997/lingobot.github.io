// Changes made while merging with the Deal Line frontend: GET /api/members, "x" as a lead source, demo seed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { harness } from "./harness.js";
import { seedDemo, DEMO_PASSWORD } from "../scripts/demo-seed.js";

const h = await harness();

test("members: listed for the caller's org only; emails hidden from members", async () => {
  const A = await h.signup("owner-m@example.com", "مكتب الأعضاء");
  const B = await h.signup("other-m@example.com", "مكتب آخر");
  const orgA = (await h.call("GET", "/me", { cookie: A })).json.org_id;
  const M = await h.signup("member-m@example.com", "مؤقت");
  const mUser = (await h.call("GET", "/me", { cookie: M })).json;
  await h.lite.query(`delete from orgs where id = $1`, [mUser.org_id]);
  await h.lite.query(`insert into memberships (org_id, user_id, role) values ($1,$2,'member')`, [orgA, mUser.id]);

  const asOwner = await h.call("GET", "/api/members", { cookie: A });
  assert.equal(asOwner.status, 200);
  assert.deepEqual(asOwner.json.map((m: any) => m.role).sort(), ["member", "owner"]);
  assert.ok(asOwner.json.every((m: any) => m.email));

  const asMember = await h.call("GET", "/api/members", { cookie: M });
  assert.equal(asMember.json.length, 2);
  assert.ok(asMember.json.every((m: any) => m.email === null));

  const other = await h.call("GET", "/api/members", { cookie: B });
  assert.equal(other.json.length, 1);
  assert.equal((await h.call("GET", "/api/members")).status, 401);
});

test('lead source "x" (documented) is accepted by the site form and the database', async () => {
  const A = await h.signup("x-src@example.com", "مكتب إكس");
  await h.call("PUT", "/api/org", { cookie: A, body: { name: "مكتب إكس", fal_license: "1100000001" } });
  await h.call("PUT", "/api/site", { cookie: A, body: { slug: "office-x", title: "مكتب إكس" } });
  await h.call("POST", "/api/site/publish", { cookie: A, body: { published: true } });
  const r = await h.call("POST", "/public/sites/office-x.dealline.site/leads", { body: { name: "عميل", phone: "0501234567", source_channel: "x" } });
  assert.equal(r.status, 201, JSON.stringify(r.json));
  const leads = (await h.call("GET", "/api/leads", { cookie: A })).json;
  assert.equal(leads[0].source_channel, "x");
  const bad = await h.call("POST", "/public/sites/office-x.dealline.site/leads", { body: { name: "عميل", phone: "0501234567", source_channel: "X Y" } });
  assert.equal(bad.status, 400);
});

test("demo seed runs through the API and leaves a consistent demo org", async () => {
  const fresh = await harness();
  await seedDemo({ app: fresh.app, lite: fresh.lite, root: "dealline.site" });
  const login = await fresh.call("POST", "/auth/login", { body: { email: "owner@dealline.test", password: DEMO_PASSWORD } });
  assert.equal(login.status, 200);
  const cookie = login.cookie!;
  const dash = (await fresh.call("GET", "/api/offplan/dashboard", { cookie })).json;
  assert.equal(dash.units.total, 12);
  assert.ok(dash.collected_halalas > 0);
  const site = await fresh.call("GET", "/public/sites/tilal.dealline.site/listings");
  assert.equal(site.json.length, 5); // the 6th listing is a draft without an ad license
  const leads = (await fresh.call("GET", "/api/leads", { cookie })).json;
  assert.equal(leads.length, 4);
  const sales = await fresh.call("POST", "/auth/login", { body: { email: "sales@dealline.test", password: DEMO_PASSWORD } });
  assert.equal((await fresh.call("GET", "/me", { cookie: sales.cookie })).json.role, "member");
});
