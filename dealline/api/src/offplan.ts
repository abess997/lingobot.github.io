// Off-plan sales (البيع على الخارطة): projects, units, payment plans, the deal journey
// (hold -> reserved -> contracted -> handed over), escrow receipts, exceptions
// (cancel, default, transfer), the dashboard, public project pages and the daily job.
import { Hono, type Context } from "hono";
import { z } from "zod";
import type { Db, Q } from "./db.js";
import type { Vars } from "./auth.js";
import { can, type Action } from "./authz.js";
import { HttpError, body, deny, notFound } from "./http.js";
import { publicLeadInput, saPhone } from "./validation.js";
import { emit, leadPayload, sar } from "./events.js";

const uuid = z.string().uuid();
const httpsUrl = z.string().url().max(500).refine((u) => u.startsWith("https://"));
const date = z.string().date();
const today = () => new Date().toISOString().slice(0, 10);

const projectInput = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().max(5000).nullish(),
  city: z.string().trim().min(2).max(60),
  district: z.string().trim().max(60).nullish(),
  lat: z.number().min(-90).max(90).nullish(),
  lng: z.number().min(-180).max(180).nullish(),
  images: z.array(httpsUrl).max(30).default([]),
  wafi_license_number: z.string().trim().regex(/^[0-9A-Za-z-]{3,30}$/).nullish(),
  escrow_bank: z.string().trim().max(80).nullish(),
  escrow_iban: z.string().trim().toUpperCase().transform((s) => s.replace(/\s/g, "")).pipe(z.string().regex(/^SA[0-9]{22}$/, "IBAN سعودي غير صحيح")).nullish(),
  ad_license_number: z.string().trim().regex(/^[0-9A-Za-z-]{4,30}$/).nullish(),
  ad_license_expires_on: date.nullish(),
  expected_handover_on: date.nullish(),
  show_on_site: z.boolean().default(true),
  hold_days: z.number().int().min(1).max(30).default(3),
});

const unitInput = z.object({
  code: z.string().trim().min(1).max(30),
  unit_type: z.enum(["apartment", "villa", "townhouse", "floor", "office", "shop", "other"]),
  building: z.string().trim().max(30).nullish(),
  floor: z.number().int().min(-5).max(200).nullish(),
  area_sqm: z.number().positive().max(1e6),
  bedrooms: z.number().int().min(0).max(20).nullish(),
  price_halalas: z.number().int().positive().max(1e14),
});

const planItem = z.object({
  label: z.string().trim().min(1).max(80),
  share_bp: z.number().int().min(1).max(10000),
  trigger: z.enum(["on_booking", "on_contract", "after_days", "at_progress", "on_handover"]),
  days_after_contract: z.number().int().min(1).max(3650).optional(),
  at_progress_pct: z.number().gt(0).max(100).optional(),
}).superRefine((i, ctx) => {
  if ((i.trigger === "after_days") !== (i.days_after_contract !== undefined))
    ctx.addIssue({ code: "custom", message: "days_after_contract only with after_days" });
  if ((i.trigger === "at_progress") !== (i.at_progress_pct !== undefined))
    ctx.addIssue({ code: "custom", message: "at_progress_pct only with at_progress" });
});
const planInput = z.object({
  name: z.string().trim().min(1).max(80),
  items: z.array(planItem).min(1).max(60),
}).refine((p) => p.items.reduce((s, i) => s + i.share_bp, 0) === 10000, "مجموع نسب الدفعات يجب أن يساوي 100%");

/** Splits a price by basis points; rounding leftovers go to the last installment so the sum is exact. */
export function splitAmount(price: number, shares: number[]): number[] {
  const out = shares.map((bp) => Math.floor((price * bp) / 10000));
  out[out.length - 1] += price - out.reduce((a, b) => a + b, 0);
  return out;
}

type Ctx = Context<{ Variables: Vars }>;

export function offplanApi(db: Db) {
  const r = new Hono<{ Variables: Vars }>();
  const member = (c: Ctx) => { const m = c.get("member"); if (!m) throw deny(); return m; };
  const need = (c: Ctx, a: Action, ctx?: { ownsRecord?: boolean }) => {
    const m = member(c); if (!can(m, a, ctx)) throw deny(); return m;
  };
  const event = (q: Q, orgId: string, dealId: string, type: string, actor: string, note?: string | null) =>
    q.query(`insert into deal_events (org_id, deal_id, type, note, actor) values ($1,$2,$3,$4,$5)`, [orgId, dealId, type, note ?? null, actor]);

  // ---------------- projects ----------------
  r.get("/projects", async (c) => {
    const m = member(c);
    const rows = await db.asOrg(m.orgId, (q) => q.query(
      `select p.*, p.progress_pct::float8 as progress_pct,
         (select count(*)::int from units u where u.project_id = p.id) as units_total,
         (select count(*)::int from units u where u.project_id = p.id and u.status = 'available') as units_available
       from projects p order by p.created_at desc`));
    return c.json(rows.rows);
  });

  r.post("/projects", async (c) => {
    const m = need(c, "project:manage");
    const b = await body(c, projectInput);
    const row = await db.asOrg(m.orgId, (q) => q.query(
      `insert into projects (org_id, name, description, city, district, lat, lng, images, wafi_license_number, escrow_bank,
         escrow_iban, ad_license_number, ad_license_expires_on, expected_handover_on, show_on_site, hold_days, created_by)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) returning id, status`,
      [m.orgId, b.name, b.description ?? null, b.city, b.district ?? null, b.lat ?? null, b.lng ?? null, JSON.stringify(b.images),
       b.wafi_license_number ?? null, b.escrow_bank ?? null, b.escrow_iban ?? null, b.ad_license_number ?? null,
       b.ad_license_expires_on ?? null, b.expected_handover_on ?? null, b.show_on_site, b.hold_days, c.get("userId")]));
    return c.json(row.rows[0], 201);
  });

  r.patch("/projects/:id", async (c) => {
    const m = need(c, "project:manage");
    const id = uuid.parse(c.req.param("id"));
    const b = await body(c, projectInput.partial());
    const cols = Object.keys(b) as (keyof typeof b)[];
    if (!cols.length) throw new HttpError(400, "nothing_to_update");
    const sets = cols.map((k, i) => `${k} = $${i + 2}`).join(", "); // keys from the zod schema only
    const vals = cols.map((k) => (k === "images" ? JSON.stringify(b[k]) : b[k] ?? null));
    const row = await db.asOrg(m.orgId, (q) => q.query(`update projects set ${sets} where id = $1 returning id, status`, [id, ...vals]));
    if (!row.rows[0]) throw notFound();
    return c.json(row.rows[0]);
  });

  r.post("/projects/:id/status", async (c) => {
    const m = need(c, "project:manage");
    const id = uuid.parse(c.req.param("id"));
    const { status } = await body(c, z.object({ status: z.enum(["draft", "selling", "sold_out", "completed", "archived"]) }));
    const row = await db.asOrg(m.orgId, async (q) => {
      const p = (await q.query(`select *, ad_license_expires_on >= current_date as ad_valid from projects where id = $1`, [id])).rows[0];
      if (!p) throw notFound();
      if (status === "selling") {
        if (!p.wafi_license_number) throw new HttpError(422, "wafi_license_required");
        if (!p.escrow_iban) throw new HttpError(422, "escrow_account_required");
        if (!p.ad_valid) throw new HttpError(422, "ad_license_missing_or_expired");
      }
      if (status === "completed" && Number(p.progress_pct) < 100) throw new HttpError(422, "progress_not_100");
      return q.query(`update projects set status = $2 where id = $1 returning id, status`, [id, status]);
    });
    return c.json(row.rows[0]);
  });

  /** A consultant progress report. Milestone installments of contracted deals fall due when it is reached. */
  r.post("/projects/:id/progress", async (c) => {
    const m = need(c, "project:manage");
    const id = uuid.parse(c.req.param("id"));
    const b = await body(c, z.object({
      pct: z.number().min(0).max(100),
      report_ref: z.string().trim().min(1).max(120),
      reported_on: date.refine((d) => d <= today(), "لا يمكن أن يكون التقرير بتاريخ مستقبلي"),
    }));
    const out = await db.asOrg(m.orgId, async (q) => {
      const p = (await q.query(`select progress_pct from projects where id = $1 for update`, [id])).rows[0];
      if (!p) throw notFound();
      if (b.pct < Number(p.progress_pct)) throw new HttpError(422, "progress_cannot_go_down");
      await q.query(`insert into project_progress (org_id, project_id, pct, report_ref, reported_on, created_by) values ($1,$2,$3,$4,$5,$6)`,
        [m.orgId, id, b.pct, b.report_ref, b.reported_on, c.get("userId")]);
      await q.query(`update projects set progress_pct = $2 where id = $1`, [id, b.pct]);
      const due = await q.query(
        `update installments i set due_on = $2::date, status = 'due'
           from offplan_deals d join units u on u.id = d.unit_id
          where i.deal_id = d.id and u.project_id = $1 and d.status = 'contracted' and i.due_on is null
            and ((i.trigger = 'at_progress' and i.at_progress_pct <= $3) or (i.trigger = 'on_handover' and $3 >= 100))
          returning i.id`, [id, b.reported_on, b.pct]);
      return { progress_pct: b.pct, installments_now_due: due.rows.length };
    });
    return c.json(out);
  });

  // ---------------- units ----------------
  r.get("/projects/:id/units", async (c) => {
    const m = member(c);
    const id = uuid.parse(c.req.param("id"));
    const rows = await db.asOrg(m.orgId, (q) => q.query(
      `select u.*, u.area_sqm::float8 as area_sqm, d.id as deal_id, d.buyer_name, d.status as deal_status
         from units u left join offplan_deals d on d.unit_id = u.id
              and d.status in ('held','reserved','contracted','handed_over','defaulted')
        where u.project_id = $1 order by u.building nulls first, u.floor nulls first, u.code`, [id]));
    return c.json(rows.rows);
  });

  r.post("/projects/:id/units", async (c) => {
    const m = need(c, "project:manage");
    const id = uuid.parse(c.req.param("id"));
    const b = await body(c, z.union([
      unitInput,
      // bulk: e.g. prefix "A-", from 101, count 20 -> A-101 ... A-120
      unitInput.omit({ code: true }).extend({
        bulk: z.object({ prefix: z.string().max(10), from: z.number().int().min(0).max(99999), count: z.number().int().min(1).max(500) }),
      }),
    ]));
    const codes = "bulk" in b ? Array.from({ length: b.bulk.count }, (_, i) => `${b.bulk.prefix}${b.bulk.from + i}`) : [b.code];
    const rows = await db.asOrg(m.orgId, async (q) => {
      if (!(await q.query(`select 1 from projects where id = $1`, [id])).rows[0]) throw notFound();
      const ins = await q.query(
        `insert into units (org_id, project_id, code, unit_type, building, floor, area_sqm, bedrooms, price_halalas)
         select $1, $2, code, $4, $5, $6, $7, $8, $9 from unnest($3::text[]) as code returning id, code`,
        [m.orgId, id, codes, b.unit_type, b.building ?? null, b.floor ?? null, b.area_sqm, b.bedrooms ?? null, b.price_halalas]);
      return ins.rows;
    });
    return c.json(rows, 201);
  });

  r.patch("/units/:id", async (c) => {
    const m = need(c, "project:manage");
    const id = uuid.parse(c.req.param("id"));
    const b = await body(c, unitInput.partial().extend({ status: z.enum(["available", "blocked"]).optional() }));
    const cols = Object.keys(b) as (keyof typeof b)[];
    if (!cols.length) throw new HttpError(400, "nothing_to_update");
    const row = await db.asOrg(m.orgId, async (q) => {
      const u = (await q.query(`select status from units where id = $1 for update`, [id])).rows[0];
      if (!u) throw notFound();
      // a unit in a deal keeps the deal's price and status; change them through the deal
      if (!["available", "blocked"].includes(u.status)) throw new HttpError(409, "unit_in_deal");
      const sets = cols.map((k, i) => `${k} = $${i + 2}`).join(", ");
      return q.query(`update units set ${sets} where id = $1 returning id, status, price_halalas`, [id, ...cols.map((k) => b[k] ?? null)]);
    });
    return c.json(row.rows[0]);
  });

  // ---------------- payment plans ----------------
  r.get("/projects/:id/plans", async (c) => {
    const m = member(c);
    const id = uuid.parse(c.req.param("id"));
    const rows = await db.asOrg(m.orgId, (q) => q.query(
      `select p.id, p.name, p.active, coalesce(json_agg(json_build_object('seq', i.seq, 'label', i.label, 'share_bp', i.share_bp,
          'trigger', i.trigger, 'days_after_contract', i.days_after_contract, 'at_progress_pct', i.at_progress_pct::float8) order by i.seq)
          filter (where i.id is not null), '[]') as items
         from payment_plans p left join payment_plan_items i on i.plan_id = p.id
        where p.project_id = $1 group by p.id order by p.created_at`, [id]));
    return c.json(rows.rows);
  });

  r.post("/projects/:id/plans", async (c) => {
    const m = need(c, "plan:manage");
    const id = uuid.parse(c.req.param("id"));
    const b = await body(c, planInput);
    const row = await db.asOrg(m.orgId, async (q) => {
      if (!(await q.query(`select 1 from projects where id = $1`, [id])).rows[0]) throw notFound();
      const p = await q.query(`insert into payment_plans (org_id, project_id, name) values ($1,$2,$3) returning id`, [m.orgId, id, b.name]);
      let seq = 0;
      for (const i of b.items)
        await q.query(
          `insert into payment_plan_items (org_id, plan_id, seq, label, share_bp, trigger, days_after_contract, at_progress_pct)
           values ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [m.orgId, p.rows[0].id, ++seq, i.label, i.share_bp, i.trigger, i.days_after_contract ?? null, i.at_progress_pct ?? null]);
      return p.rows[0];
    });
    return c.json(row, 201);
  });

  r.post("/plans/:id/deactivate", async (c) => {
    const m = need(c, "plan:manage");
    const row = await db.asOrg(m.orgId, (q) => q.query(`update payment_plans set active = false where id = $1 returning id`, [uuid.parse(c.req.param("id"))]));
    if (!row.rows[0]) throw notFound();
    return c.json({ ok: true });
  });

  // ---------------- deals: the journey ----------------
  const loadDeal = async (q: Q, id: string) => {
    const d = (await q.query(
      `select d.*, u.project_id, u.code as unit_code, p.progress_pct from offplan_deals d
         join units u on u.id = d.unit_id join projects p on p.id = u.project_id where d.id = $1 for update of d`, [id])).rows[0];
    if (!d) throw notFound();
    return d;
  };
  const assertStatus = (d: any, allowed: string[]) => {
    if (!allowed.includes(d.status)) throw new HttpError(409, `invalid_transition_from_${d.status}`);
  };

  r.get("/deals", async (c) => {
    const m = member(c);
    const f = z.object({ status: z.string().max(20).optional(), project_id: uuid.optional() }).parse(c.req.query());
    const rows = await db.asOrg(m.orgId, (q) => q.query(
      `select d.id, d.status, d.buyer_name, d.buyer_phone, d.price_halalas, d.hold_expires_at, d.contract_ref, d.created_at,
              u.code as unit_code, p.name as project_name,
              coalesce((select sum(paid_halalas) from installments i where i.deal_id = d.id), 0)::bigint as paid_halalas,
              coalesce((select sum(amount_halalas - paid_halalas) from installments i where i.deal_id = d.id and i.status = 'overdue'), 0)::bigint as overdue_halalas
         from offplan_deals d join units u on u.id = d.unit_id join projects p on p.id = u.project_id
        where ($1::text is null or d.status = $1) and ($2::uuid is null or u.project_id = $2)
          and ($3::uuid is null or d.sales_rep = $3)
        order by d.created_at desc limit 200`,
      [f.status ?? null, f.project_id ?? null, m.role === "member" ? c.get("userId") : null]));
    return c.json(rows.rows);
  });

  r.get("/deals/:id", async (c) => {
    const m = member(c);
    const id = uuid.parse(c.req.param("id"));
    const out = await db.asOrg(m.orgId, async (q) => {
      const d = (await q.query(
        `select d.*, u.code as unit_code, u.project_id, p.name as project_name, p.escrow_bank, p.escrow_iban
           from offplan_deals d join units u on u.id = d.unit_id join projects p on p.id = u.project_id where d.id = $1`, [id])).rows[0];
      if (!d) throw notFound();
      if (m.role === "member" && d.sales_rep !== c.get("userId")) throw notFound();
      const inst = await q.query(
        `select id, seq, label, amount_halalas, paid_halalas, trigger, due_on::text as due_on, status, at_progress_pct::float8 as at_progress_pct
           from installments where deal_id = $1 order by seq`, [id]);
      const rec = await q.query(
        `select r.id, r.installment_id, r.amount_halalas, r.received_on::text as received_on, r.bank_ref
           from escrow_receipts r join installments i on i.id = r.installment_id where i.deal_id = $1 order by r.received_on`, [id]);
      const ev = await q.query(`select type, note, created_at from deal_events where deal_id = $1 order by created_at`, [id]);
      return { ...d, installments: inst.rows, receipts: rec.rows, events: ev.rows };
    });
    return c.json(out);
  });

  /** Hold: the unit is kept for the buyer for the project's hold_days while the booking payment reaches escrow. */
  r.post("/deals", async (c) => {
    const m = need(c, "deal:create");
    const b = await body(c, z.object({
      unit_id: uuid, plan_id: uuid,
      buyer_name: z.string().trim().min(1).max(120), buyer_phone: saPhone, buyer_email: z.string().email().max(200).nullish(),
      lead_id: uuid.nullish(),
    }));
    const out = await db.asOrg(m.orgId, async (q) => {
      const u = (await q.query(
        `select u.*, p.status as project_status, p.hold_days from units u join projects p on p.id = u.project_id where u.id = $1 for update of u`,
        [b.unit_id])).rows[0];
      if (!u) throw notFound();
      if (u.project_status !== "selling") throw new HttpError(422, "project_not_selling");
      if (u.status !== "available") throw new HttpError(409, "unit_not_available");
      const items = (await q.query(
        `select i.* from payment_plan_items i join payment_plans p on p.id = i.plan_id
          where p.id = $1 and p.project_id = $2 and p.active order by i.seq`, [b.plan_id, u.project_id])).rows;
      if (!items.length) throw new HttpError(422, "plan_not_found_for_project");
      if (b.lead_id && !(await q.query(`select 1 from leads where id = $1`, [b.lead_id])).rows[0]) throw new HttpError(422, "lead_not_found");

      const d = (await q.query(
        `insert into offplan_deals (org_id, unit_id, plan_id, lead_id, buyer_name, buyer_phone, buyer_email, price_halalas, hold_expires_at, sales_rep)
         values ($1,$2,$3,$4,$5,$6,$7,$8, now() + make_interval(days => $9), $10) returning id, status, hold_expires_at`,
        [m.orgId, u.id, b.plan_id, b.lead_id ?? null, b.buyer_name, b.buyer_phone, b.buyer_email ?? null, u.price_halalas, u.hold_days, c.get("userId")])).rows[0];
      const amounts = splitAmount(Number(u.price_halalas), items.map((i: any) => i.share_bp));
      for (const [k, i] of items.entries()) {
        const dueNow = i.trigger === "on_booking";
        await q.query(
          `insert into installments (org_id, deal_id, seq, label, amount_halalas, trigger, days_after_contract, at_progress_pct, due_on, status)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [m.orgId, d.id, i.seq, i.label, amounts[k], i.trigger, i.days_after_contract, i.at_progress_pct,
           dueNow ? today() : null, dueNow ? "due" : "scheduled"]);
      }
      await q.query(`update units set status = 'held' where id = $1`, [u.id]);
      if (b.lead_id) await q.query(`update leads set status = 'qualified', unit_id = $2, project_id = $3 where id = $1`, [b.lead_id, u.id, u.project_id]);
      await event(q, m.orgId, d.id, "held", c.get("userId"));
      const pname = (await q.query(`select name from projects where id = $1`, [u.project_id])).rows[0]?.name;
      await emit(q, m.orgId, "deal.held", {
        deal: { id: d.id, buyer_name: b.buyer_name, unit_code: u.code, project_name: pname, price_sar: sar(u.price_halalas), hold_expires_at: d.hold_expires_at },
        contact: { name: b.buyer_name, phone: b.buyer_phone, email: b.buyer_email ?? null },
        assignee: c.get("userId"), related: { type: "deal", id: d.id },
      });
      return d;
    });
    return c.json(out, 201);
  });

  /** Booking payment confirmed in escrow -> reserved. */
  r.post("/deals/:id/reserve", async (c) => {
    const m = member(c);
    const id = uuid.parse(c.req.param("id"));
    const out = await db.asOrg(m.orgId, async (q) => {
      const d = await loadDeal(q, id);
      if (!can(m, "deal:advance", { ownsRecord: d.sales_rep === c.get("userId") })) throw deny();
      assertStatus(d, ["held"]);
      const unpaid = (await q.query(`select 1 from installments where deal_id = $1 and trigger = 'on_booking' and status not in ('paid','waived')`, [id])).rows[0];
      if (unpaid) throw new HttpError(422, "booking_payment_not_received");
      await q.query(`update offplan_deals set status = 'reserved', hold_expires_at = null where id = $1`, [id]);
      await q.query(`update units set status = 'reserved' where id = $1`, [d.unit_id]);
      await event(q, m.orgId, id, "reserved", c.get("userId"));
      return { id, status: "reserved" };
    });
    return c.json(out);
  });

  /** Contract signed -> installments get their due dates. */
  r.post("/deals/:id/contract", async (c) => {
    const m = member(c);
    const id = uuid.parse(c.req.param("id"));
    const b = await body(c, z.object({ contract_ref: z.string().trim().min(3).max(80), signed_on: date.refine((d) => d <= today()) }));
    const out = await db.asOrg(m.orgId, async (q) => {
      const d = await loadDeal(q, id);
      if (!can(m, "deal:advance", { ownsRecord: d.sales_rep === c.get("userId") })) throw deny();
      assertStatus(d, ["reserved"]);
      await q.query(`update offplan_deals set status = 'contracted', contract_ref = $2, contract_signed_on = $3 where id = $1`, [id, b.contract_ref, b.signed_on]);
      await q.query(`update units set status = 'sold' where id = $1`, [d.unit_id]);
      await q.query(
        `update installments set
           due_on = case trigger
             when 'on_contract' then $2::date
             when 'after_days' then $2::date + days_after_contract
             when 'at_progress' then case when at_progress_pct <= $3 then $2::date end
             when 'on_handover' then case when $3 >= 100 then $2::date end end,
           status = 'scheduled'
         where deal_id = $1 and status = 'scheduled'`, [id, b.signed_on, Number(d.progress_pct)]);
      await q.query(`update installments set status = case when due_on < current_date then 'overdue' else 'due' end
                      where deal_id = $1 and status = 'scheduled' and due_on <= current_date`, [id]);
      await event(q, m.orgId, id, "contracted", c.get("userId"), b.contract_ref);
      const pname = (await q.query(`select name from projects where id = $1`, [d.project_id])).rows[0]?.name;
      await emit(q, m.orgId, "deal.contracted", {
        deal: { id, buyer_name: d.buyer_name, unit_code: d.unit_code, project_name: pname, price_sar: sar(d.price_halalas), contract_ref: b.contract_ref },
        contact: { name: d.buyer_name, phone: d.buyer_phone, email: d.buyer_email },
        assignee: d.sales_rep, related: { type: "deal", id },
      });
      return { id, status: "contracted" };
    });
    return c.json(out);
  });

  r.post("/deals/:id/handover", async (c) => {
    const m = member(c);
    const id = uuid.parse(c.req.param("id"));
    const b = await body(c, z.object({ handed_over_on: date.refine((d) => d <= today()) }));
    const out = await db.asOrg(m.orgId, async (q) => {
      const d = await loadDeal(q, id);
      if (!can(m, "deal:advance", { ownsRecord: d.sales_rep === c.get("userId") })) throw deny();
      assertStatus(d, ["contracted"]);
      if (Number(d.progress_pct) < 100) throw new HttpError(422, "project_not_complete");
      const open = (await q.query(`select count(*)::int n from installments where deal_id = $1 and status not in ('paid','waived')`, [id])).rows[0].n;
      if (open > 0) throw new HttpError(422, "installments_outstanding");
      await q.query(`update offplan_deals set status = 'handed_over', handed_over_on = $2 where id = $1`, [id, b.handed_over_on]);
      await q.query(`update units set status = 'handed_over' where id = $1`, [d.unit_id]);
      await event(q, m.orgId, id, "handed_over", c.get("userId"));
      return { id, status: "handed_over" };
    });
    return c.json(out);
  });

  // ---------------- escrow receipts ----------------
  /** Records a transfer the bank statement shows in the project's escrow account. No card payments here. */
  r.post("/installments/:id/receipts", async (c) => {
    const m = need(c, "escrow:record");
    const id = uuid.parse(c.req.param("id"));
    const b = await body(c, z.object({
      amount_halalas: z.number().int().positive().max(1e14),
      received_on: date.refine((d) => d <= today()),
      bank_ref: z.string().trim().min(3).max(80),
    }));
    const out = await db.asOrg(m.orgId, async (q) => {
      const i = (await q.query(
        `select i.*, d.status as deal_status from installments i join offplan_deals d on d.id = i.deal_id where i.id = $1 for update of i`, [id])).rows[0];
      if (!i) throw notFound();
      if (!["held", "reserved", "contracted", "defaulted"].includes(i.deal_status)) throw new HttpError(409, "deal_closed");
      if (["paid", "waived", "cancelled"].includes(i.status)) throw new HttpError(409, `installment_${i.status}`);
      const remaining = Number(i.amount_halalas) - Number(i.paid_halalas);
      if (b.amount_halalas > remaining) throw new HttpError(422, "overpayment");
      await q.query(`insert into escrow_receipts (org_id, installment_id, amount_halalas, received_on, bank_ref, recorded_by) values ($1,$2,$3,$4,$5,$6)`,
        [m.orgId, id, b.amount_halalas, b.received_on, b.bank_ref, c.get("userId")]);
      const full = b.amount_halalas === remaining;
      await q.query(`update installments set paid_halalas = paid_halalas + $2, status = case when $3 then 'paid' else status end where id = $1`,
        [id, b.amount_halalas, full]);
      await event(q, m.orgId, i.deal_id, "escrow_receipt", c.get("userId"), `${i.label}: ${b.amount_halalas} (${b.bank_ref})`);
      return { installment_id: id, status: full ? "paid" : i.status, remaining_halalas: remaining - b.amount_halalas };
    });
    return c.json(out, 201);
  });

  // ---------------- exceptions ----------------
  const reason = z.object({ reason: z.string().trim().min(5).max(1000) });

  /** Cancel: the unit goes back on sale, unpaid installments are cancelled. Money already in escrow is
   *  returned to the buyer through the escrow process, outside Deal Line; the amount is reported here. */
  r.post("/deals/:id/cancel", async (c) => {
    const m = need(c, "deal:exception");
    const id = uuid.parse(c.req.param("id"));
    const { reason: why } = await body(c, reason);
    const out = await db.asOrg(m.orgId, async (q) => {
      const d = await loadDeal(q, id);
      assertStatus(d, ["held", "reserved", "contracted", "defaulted"]);
      const paid = Number((await q.query(`select coalesce(sum(paid_halalas),0)::bigint s from installments where deal_id = $1`, [id])).rows[0].s);
      await q.query(`update installments set status = 'cancelled' where deal_id = $1 and status not in ('paid','waived')`, [id]);
      await q.query(`update offplan_deals set status = 'cancelled', hold_expires_at = null where id = $1`, [id]);
      await q.query(`update units set status = 'available' where id = $1`, [d.unit_id]);
      await event(q, m.orgId, id, "cancelled", c.get("userId"), why);
      return { id, status: "cancelled", paid_to_escrow_halalas: paid };
    });
    return c.json(out);
  });

  /** Default (تعثر): only with an overdue installment. The unit is blocked until the default is resolved. */
  r.post("/deals/:id/default", async (c) => {
    const m = need(c, "deal:exception");
    const id = uuid.parse(c.req.param("id"));
    const { reason: why } = await body(c, reason);
    const out = await db.asOrg(m.orgId, async (q) => {
      const d = await loadDeal(q, id);
      assertStatus(d, ["reserved", "contracted"]);
      const overdue = (await q.query(`select 1 from installments where deal_id = $1 and status = 'overdue'`, [id])).rows[0];
      if (!overdue) throw new HttpError(422, "no_overdue_installment");
      await q.query(`update offplan_deals set status = 'defaulted' where id = $1`, [id]);
      await q.query(`update units set status = 'blocked' where id = $1`, [d.unit_id]);
      await event(q, m.orgId, id, "defaulted", c.get("userId"), why);
      return { id, status: "defaulted" };
    });
    return c.json(out);
  });

  /** Resolve a default by reinstating the deal (buyer caught up or agreed terms). To end it, use /cancel. */
  r.post("/deals/:id/reinstate", async (c) => {
    const m = need(c, "deal:exception");
    const id = uuid.parse(c.req.param("id"));
    const { reason: why } = await body(c, reason);
    const out = await db.asOrg(m.orgId, async (q) => {
      const d = await loadDeal(q, id);
      assertStatus(d, ["defaulted"]);
      const back = d.contract_ref ? "contracted" : "reserved";
      await q.query(`update offplan_deals set status = $2 where id = $1`, [id, back]);
      await q.query(`update units set status = $2 where id = $1`, [d.unit_id, back === "contracted" ? "sold" : "reserved"]);
      await event(q, m.orgId, id, "reinstated", c.get("userId"), why);
      return { id, status: back };
    });
    return c.json(out);
  });

  /** Ownership transfer (التنازل): a new contracted deal for the new buyer carries the unpaid balance.
   *  Payments already made stay on the original deal as history. */
  r.post("/deals/:id/transfer", async (c) => {
    const m = need(c, "deal:exception");
    const id = uuid.parse(c.req.param("id"));
    const b = await body(c, z.object({
      buyer_name: z.string().trim().min(1).max(120), buyer_phone: saPhone, buyer_email: z.string().email().max(200).nullish(),
      contract_ref: z.string().trim().min(3).max(80), signed_on: date.refine((d) => d <= today()),
      reason: z.string().trim().min(5).max(1000),
    }));
    const out = await db.asOrg(m.orgId, async (q) => {
      const d = await loadDeal(q, id);
      assertStatus(d, ["contracted"]);
      await q.query(`update offplan_deals set status = 'transferred' where id = $1`, [id]);
      const nd = (await q.query(
        `insert into offplan_deals (org_id, unit_id, plan_id, buyer_name, buyer_phone, buyer_email, price_halalas, status,
           contract_ref, contract_signed_on, transferred_from, sales_rep)
         values ($1,$2,$3,$4,$5,$6,$7,'contracted',$8,$9,$10,$11) returning id`,
        [m.orgId, d.unit_id, d.plan_id, b.buyer_name, b.buyer_phone, b.buyer_email ?? null, d.price_halalas,
         b.contract_ref, b.signed_on, id, d.sales_rep])).rows[0];
      await q.query(
        `insert into installments (org_id, deal_id, seq, label, amount_halalas, trigger, days_after_contract, at_progress_pct, due_on, status)
         select org_id, $2, seq, label, amount_halalas - paid_halalas, trigger, days_after_contract, at_progress_pct, due_on,
                case when status = 'overdue' then 'overdue' when due_on is not null then 'due' else 'scheduled' end
           from installments where deal_id = $1 and status not in ('paid','waived','cancelled') and amount_halalas > paid_halalas`,
        [id, nd.id]);
      await q.query(`update installments set status = 'cancelled' where deal_id = $1 and status not in ('paid','waived')`, [id]);
      await event(q, m.orgId, id, "transferred_out", c.get("userId"), b.reason);
      await event(q, m.orgId, nd.id, "transferred_in", c.get("userId"), b.reason);
      return { from: id, to: nd.id, status: "contracted" };
    });
    return c.json(out, 201);
  });

  // ---------------- dashboard ----------------
  r.get("/dashboard", async (c) => {
    const m = need(c, "project:manage");
    const pid = uuid.optional().parse(c.req.query("project_id"));
    const out = await db.asOrg(m.orgId, async (q) => {
      const units = await q.query(
        `select u.status, count(*)::int n from units u where ($1::uuid is null or u.project_id = $1) group by u.status`, [pid ?? null]);
      const money = (await q.query(
        `select coalesce(sum(d.price_halalas) filter (where d.status in ('reserved','contracted','handed_over','defaulted')), 0)::bigint as sold_value,
                coalesce(sum(x.paid), 0)::bigint as collected,
                coalesce(sum(x.due), 0)::bigint as due_outstanding,
                coalesce(sum(x.overdue), 0)::bigint as overdue_outstanding,
                count(*) filter (where d.status = 'defaulted')::int as defaulted_deals
           from offplan_deals d join units u on u.id = d.unit_id
           left join lateral (
             select sum(i.paid_halalas) paid,
                    sum(i.amount_halalas - i.paid_halalas) filter (where i.status = 'due') due,
                    sum(i.amount_halalas - i.paid_halalas) filter (where i.status = 'overdue') overdue
               from installments i where i.deal_id = d.id) x on true
          where ($1::uuid is null or u.project_id = $1) and d.status not in ('cancelled')`, [pid ?? null])).rows[0];
      const byStatus = Object.fromEntries(units.rows.map((r: any) => [r.status, r.n]));
      const total = units.rows.reduce((s: number, r: any) => s + r.n, 0);
      return {
        units: { total, ...byStatus },
        sold_value_halalas: money.sold_value,
        collected_halalas: money.collected,
        collection_pct: money.sold_value ? Math.round((money.collected / money.sold_value) * 1000) / 10 : 0,
        due_outstanding_halalas: money.due_outstanding,
        overdue_outstanding_halalas: money.overdue_outstanding,
        defaulted_deals: money.defaulted_deals,
      };
    });
    return c.json(out);
  });

  return r;
}

/** Daily job (run once a day, e.g. 03:00 Riyadh): expire holds, mark installments due and overdue.
 *  Runs across all orgs as the owner role; every statement is scoped by its own joins. */
export async function runOffplanJobs(db: Db) {
  return db.asSystem(async (q) => {
    const expired = await q.query(
      `with x as (
         update offplan_deals set status = 'cancelled', hold_expires_at = null
          where status = 'held' and hold_expires_at < now() returning id, org_id, unit_id)
       , u as (update units set status = 'available' from x where units.id = x.unit_id and units.status = 'held')
       , i as (update installments set status = 'cancelled' from x where installments.deal_id = x.id and installments.status not in ('paid','waived'))
       insert into deal_events (org_id, deal_id, type, note) select org_id, id, 'hold_expired', 'انتهت مدة الحجز المؤقت' from x returning deal_id`);
    const due = await q.query(
      `update installments set status = 'due' where status = 'scheduled' and due_on = current_date returning id`);
    const overdue = await q.query(
      `with x as (
         update installments set status = 'overdue' where status in ('scheduled','due') and due_on < current_date
         returning id, org_id, deal_id, label, amount_halalas, paid_halalas, due_on)
       , ev as (
         insert into events (org_id, type, payload)
         select x.org_id, 'installment.overdue', jsonb_build_object(
             'installment', jsonb_build_object('id', x.id, 'label', x.label, 'amount_sar', round((x.amount_halalas - x.paid_halalas) / 100.0, 2), 'due_on', x.due_on),
             'deal', jsonb_build_object('id', d.id, 'buyer_name', d.buyer_name, 'unit_code', u.code, 'project_name', p.name),
             'contact', jsonb_build_object('name', d.buyer_name, 'phone', d.buyer_phone, 'email', d.buyer_email),
             'assignee', d.sales_rep, 'related', jsonb_build_object('type', 'installment', 'id', x.id))
           from x join offplan_deals d on d.id = x.deal_id join units u on u.id = d.unit_id join projects p on p.id = u.project_id
          where d.status in ('reserved','contracted','defaulted'))
       select id from x`);
    return { holds_expired: expired.rows.length, now_due: due.rows.length, now_overdue: overdue.rows.length };
  });
}

/** Public project pages on the tenant site. No buyer data leaves here. */
export function offplanPublic(app: Hono<any>, ctx: {
  db: Db; findSite: (q: Q, host: string) => Promise<any>; allow: (key: string) => boolean; ip: (c: Context) => string;
}) {
  const { db, findSite } = ctx;
  const LIVE = `p.org_id = $1 and p.status in ('selling','sold_out') and p.show_on_site and p.ad_license_expires_on >= current_date`;
  const COLS = `p.id, p.name, p.description, p.city, p.district, p.lat, p.lng, p.images, p.progress_pct::float8 as progress_pct,
    p.expected_handover_on::text as expected_handover_on, p.wafi_license_number, p.ad_license_number,
    p.ad_license_expires_on::text as ad_license_expires_on, p.status`;

  app.get("/public/sites/:host/projects", async (c) => {
    const rows = await db.asSystem(async (q) => {
      const s = await findSite(q, c.req.param("host"));
      return (await q.query(
        `select ${COLS}, (select count(*)::int from units u where u.project_id = p.id and u.status = 'available') as units_available,
                (select min(price_halalas) from units u where u.project_id = p.id and u.status = 'available') as price_from_halalas
           from projects p where ${LIVE} order by p.created_at desc`, [s.org_id])).rows;
    });
    c.header("Cache-Control", "public, max-age=60");
    return c.json(rows);
  });

  app.get("/public/sites/:host/projects/:id", async (c) => {
    const id = uuid.parse(c.req.param("id"));
    const out = await db.asSystem(async (q) => {
      const s = await findSite(q, c.req.param("host"));
      const p = (await q.query(`select ${COLS} from projects p where ${LIVE} and p.id = $2`, [s.org_id, id])).rows[0];
      if (!p) throw notFound();
      const units = await q.query(
        `select id, code, unit_type, building, floor, area_sqm::float8 as area_sqm, bedrooms, price_halalas,
                (status = 'available') as available
           from units where project_id = $1 and status <> 'blocked' order by building nulls first, floor nulls first, code`, [id]);
      const plans = await q.query(
        `select p.name, json_agg(json_build_object('label', i.label, 'share_bp', i.share_bp, 'trigger', i.trigger,
            'days_after_contract', i.days_after_contract, 'at_progress_pct', i.at_progress_pct::float8) order by i.seq) as items
           from payment_plans p join payment_plan_items i on i.plan_id = p.id where p.project_id = $1 and p.active group by p.id`, [id]);
      return { ...p, units: units.rows, payment_plans: plans.rows };
    });
    return c.json(out);
  });

  app.post("/public/sites/:host/projects/:id/interest", async (c) => {
    if (!ctx.allow(`interest:${ctx.ip(c)}`)) throw new HttpError(429, "rate_limited");
    const id = uuid.parse(c.req.param("id"));
    const b = await body(c, publicLeadInput.omit({ listing_id: true }).extend({ unit_id: uuid.nullish() }));
    if (b.website) return c.json({ ok: true }, 201);
    await db.asSystem(async (q) => {
      const s = await findSite(q, c.req.param("host"));
      const p = (await q.query(`select p.id from projects p where ${LIVE} and p.id = $2`, [s.org_id, id])).rows[0];
      if (!p) throw notFound();
      if (b.unit_id && !(await q.query(`select 1 from units where id = $1 and project_id = $2`, [b.unit_id, id])).rows[0]) throw notFound();
      const lead = (await q.query(
        `insert into leads (org_id, site_id, project_id, unit_id, name, phone, email, message, source, source_channel, utm_source, utm_medium, utm_campaign)
         values ($1,$2,$3,$4,$5,$6,$7,$8,'website',$9,$10,$11,$12) returning *`,
        [s.org_id, s.id, id, b.unit_id ?? null, b.name, b.phone, b.email ?? null, b.message ?? null,
         b.source_channel ?? null, b.utm_source ?? null, b.utm_medium ?? null, b.utm_campaign ?? null])).rows[0];
      await emit(q, s.org_id, "lead.created", leadPayload(lead));
    });
    return c.json({ ok: true }, 201);
  });
}
