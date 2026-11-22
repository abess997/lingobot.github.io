import { Hono, type Context } from "hono";
import { getCookie } from "hono/cookie";
import { z, ZodError } from "zod";
import { resolveTxt } from "node:dns/promises";
import type { Db, Q } from "./db.js";
import type { Env } from "./env.js";
import type { Mailer, PaymentGateway } from "./services.js";
import { rateLimiter } from "./services.js";
import {
  COOKIE, clearSessionCookie, createSession, hashPassword, newToken, requireUser,
  safeEqual, sha256, verifyPassword, type Vars,
} from "./auth.js";
import { can, type Action } from "./authz.js";
import { RESERVED_SLUGS, hostname, listingInput, publicLeadInput, siteInput } from "./validation.js";
import { HttpError, body, deny, notFound } from "./http.js";
import { emit, leadPayload, sar } from "./events.js";
import { automationApi } from "./automation.js";
import { integrationsApi, leadWhatsAppRoutes, publicApi, whatsappWebhook } from "./integrations.js";
import type { WhatsAppClient } from "./whatsapp.js";
import { offplanApi, offplanPublic } from "./offplan.js";

export type Deps = {
  db: Db; env: Env; mailer: Mailer; payments: PaymentGateway; whatsapp: WhatsAppClient;
  resolveTxt?: (h: string) => Promise<string[][]>;
  lookup?: (host: string) => Promise<{ address: string }[]>;
};

const ip = (c: Context) =>
  c.req.header("x-forwarded-for")?.split(",")[0]?.trim() || c.req.header("x-real-ip") || "local";

const LISTING_PUBLIC_COLS = `id, title, description, purpose, property_type, price_halalas, currency, city, district,
  area_sqm::float8 as area_sqm, bedrooms, bathrooms, lat, lng, images, status,
  ad_license_number, ad_license_expires_on::text as ad_license_expires_on`;

export function createApp(d: Deps) {
  const { db, env, mailer, payments } = d;
  const txt = d.resolveTxt ?? resolveTxt;
  const secure = env.NODE_ENV === "production";
  const authLimit = rateLimiter(10, 15 * 60_000);
  const leadLimit = rateLimiter(5, 10 * 60_000);

  const app = new Hono<{ Variables: Vars }>();

  app.onError((err, c) => {
    if (err instanceof HttpError) return c.json({ error: err.message }, err.status);
    if (err instanceof ZodError) return c.json({ error: "validation", issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, 400);
    const code = (err as any)?.code;
    if (code === "23505") return c.json({ error: "conflict" }, 409);
    if (code === "23514" || code === "22P02") return c.json({ error: "rule_violation", detail: (err as any).constraint ?? null }, 422);
    console.error(err instanceof Error ? err.message : "error"); // no request bodies or user data in logs
    return c.json({ error: "internal" }, 500);
  });

  // ================= auth =================
  const sendVerify = async (q: Q, userId: string, email: string) => {
    const t = newToken();
    await q.query(
      `insert into auth_tokens (user_id, purpose, token_hash, expires_at) values ($1,'verify_email',$2, now() + interval '2 days')`,
      [userId, sha256(t)],
    );
    // token goes in the URL fragment, so it never reaches server logs or Referer headers
    await mailer.send(email, "أكّد بريدك الإلكتروني — ديل لاين",
      `<p dir="rtl">مرحبًا، اضغط الرابط لتأكيد بريدك:</p><p><a href="${env.APP_URL}/verify-email#token=${t}">تأكيد البريد</a></p>`);
  };

  app.post("/auth/signup", async (c) => {
    if (!authLimit(`signup:${ip(c)}`)) throw new HttpError(429, "rate_limited");
    const b = await body(c, z.object({
      name: z.string().trim().min(1).max(120),
      email: z.string().trim().toLowerCase().email().max(200),
      password: z.string().min(10).max(200),
      org_name: z.string().trim().min(1).max(120),
    }));
    const hash = await hashPassword(b.password);
    await db.asSystem(async (q) => {
      const u = await q.query(`insert into users (name, email, password_hash) values ($1,$2,$3) returning id`, [b.name, b.email, hash]);
      const o = await q.query(`insert into orgs (name) values ($1) returning id`, [b.org_name]);
      await q.query(`insert into memberships (org_id, user_id, role) values ($1,$2,'owner')`, [o.rows[0].id, u.rows[0].id]);
      await createSession(q, c, u.rows[0].id, secure);
      await sendVerify(q, u.rows[0].id, b.email);
    });
    return c.json({ ok: true }, 201);
  });

  app.post("/auth/login", async (c) => {
    const b = await body(c, z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().max(200) }));
    if (!authLimit(`login:${ip(c)}:${b.email}`)) throw new HttpError(429, "rate_limited");
    await db.asSystem(async (q) => {
      const u = (await q.query(`select id, password_hash from users where email = $1`, [b.email])).rows[0];
      const ok = u ? await verifyPassword(b.password, u.password_hash) : (await hashPassword(b.password), false);
      if (!ok) throw new HttpError(401, "invalid_credentials");
      await createSession(q, c, u.id, secure);
    });
    return c.json({ ok: true });
  });

  app.post("/auth/logout", async (c) => {
    const t = getCookie(c, COOKIE);
    if (t) await db.asSystem((q) => q.query(`delete from sessions where token_hash = $1`, [sha256(t)]));
    clearSessionCookie(c);
    return c.json({ ok: true });
  });

  app.post("/auth/logout-all", requireUser(db), async (c) => {
    await db.asSystem((q) => q.query(`delete from sessions where user_id = $1`, [c.get("userId")]));
    clearSessionCookie(c);
    return c.json({ ok: true });
  });

  app.post("/auth/verify-email", async (c) => {
    const { token } = await body(c, z.object({ token: z.string().min(20).max(100) }));
    const ok = await db.asSystem(async (q) => {
      const r = await q.query(
        `update auth_tokens set used_at = now() where token_hash = $1 and purpose = 'verify_email'
           and used_at is null and expires_at > now() returning user_id`, [sha256(token)]);
      if (!r.rows[0]) return false;
      await q.query(`update users set email_verified_at = now() where id = $1`, [r.rows[0].user_id]);
      return true;
    });
    if (!ok) throw new HttpError(400, "invalid_or_expired");
    return c.json({ ok: true });
  });

  app.post("/auth/resend-verification", requireUser(db), async (c) => {
    if (!authLimit(`resend:${c.get("userId")}`)) throw new HttpError(429, "rate_limited");
    await db.asSystem(async (q) => {
      const u = (await q.query(`select email, email_verified_at from users where id = $1`, [c.get("userId")])).rows[0];
      if (u && !u.email_verified_at) await sendVerify(q, c.get("userId"), u.email);
    });
    return c.json({ ok: true });
  });

  app.post("/auth/password/forgot", async (c) => {
    if (!authLimit(`forgot:${ip(c)}`)) throw new HttpError(429, "rate_limited");
    const { email } = await body(c, z.object({ email: z.string().trim().toLowerCase().email() }));
    await db.asSystem(async (q) => {
      const u = (await q.query(`select id from users where email = $1`, [email])).rows[0];
      if (!u) return; // same answer either way: no account enumeration
      const t = newToken();
      await q.query(
        `insert into auth_tokens (user_id, purpose, token_hash, expires_at) values ($1,'reset_password',$2, now() + interval '1 hour')`,
        [u.id, sha256(t)]);
      await mailer.send(email, "إعادة تعيين كلمة المرور — ديل لاين",
        `<p dir="rtl">لإعادة تعيين كلمة المرور (صالح لساعة):</p><p><a href="${env.APP_URL}/reset-password#token=${t}">إعادة التعيين</a></p>`);
    });
    return c.json({ ok: true });
  });

  app.post("/auth/password/reset", async (c) => {
    const b = await body(c, z.object({ token: z.string().min(20).max(100), password: z.string().min(10).max(200) }));
    const hash = await hashPassword(b.password);
    const ok = await db.asSystem(async (q) => {
      const r = await q.query(
        `update auth_tokens set used_at = now() where token_hash = $1 and purpose = 'reset_password'
           and used_at is null and expires_at > now() returning user_id`, [sha256(b.token)]);
      const uid = r.rows[0]?.user_id;
      if (!uid) return false;
      await q.query(`update users set password_hash = $2 where id = $1`, [uid, hash]);
      await q.query(`delete from sessions where user_id = $1`, [uid]); // sign out everywhere
      return true;
    });
    if (!ok) throw new HttpError(400, "invalid_or_expired");
    return c.json({ ok: true });
  });

  app.get("/me", requireUser(db), async (c) => {
    const r = await db.asSystem((q) => q.query(
      `select u.id, u.name, u.email, u.email_verified_at is not null as email_verified,
              m.role, o.id as org_id, o.name as org_name, o.fal_license
         from users u left join memberships m on m.user_id = u.id left join orgs o on o.id = m.org_id
        where u.id = $1 limit 1`, [c.get("userId")]));
    return c.json(r.rows[0]);
  });

  // Account deletion that actually deletes. Orgs where this user is the only owner go with it.
  app.delete("/me", requireUser(db), async (c) => {
    const { password } = await body(c, z.object({ password: z.string().max(200) }));
    await db.asSystem(async (q) => {
      const uid = c.get("userId");
      const u = (await q.query(`select password_hash from users where id = $1`, [uid])).rows[0];
      if (!u || !(await verifyPassword(password, u.password_hash))) throw new HttpError(401, "invalid_credentials");
      const solo = await q.query(
        `select m.org_id from memberships m where m.user_id = $1 and m.role = 'owner'
           and not exists (select 1 from memberships o where o.org_id = m.org_id and o.role = 'owner' and o.user_id <> $1)`, [uid]);
      for (const { org_id } of solo.rows) {
        // paid reservations block deletion of listings (on delete restrict): keep the money trail explicit
        const paid = await q.query(`select 1 from reservations where org_id = $1 and status in ('paid','refund_due') limit 1`, [org_id]);
        if (paid.rows[0]) throw new HttpError(409, "org_has_paid_reservations");
        await q.query(`delete from reservations where org_id = $1`, [org_id]);
        await q.query(`delete from orgs where id = $1`, [org_id]);
      }
      await q.query(`delete from users where id = $1`, [uid]);
    });
    clearSessionCookie(c);
    return c.json({ ok: true });
  });

  // ================= dashboard (tenant-scoped, RLS) =================
  const api = new Hono<{ Variables: Vars }>();
  api.use("*", requireUser(db));
  const member = (c: Context<{ Variables: Vars }>) => {
    const m = c.get("member");
    if (!m) throw deny();
    return m;
  };
  const need = (c: Context<{ Variables: Vars }>, a: Action, ctx?: { ownsRecord?: boolean }) => {
    const m = member(c);
    if (!can(m, a, ctx)) throw deny();
    return m;
  };

  api.put("/org", async (c) => {
    const m = need(c, "org:edit");
    const b = await body(c, z.object({
      name: z.string().trim().min(1).max(120),
      fal_license: z.string().trim().regex(/^[0-9]{6,15}$/, "رقم رخصة فال أرقام فقط").nullish(),
    }));
    // orgs is not under RLS (the user's org comes from their membership, checked above)
    await db.asSystem((q) => q.query(`update orgs set name = $2, fal_license = $3 where id = $1`, [m.orgId, b.name, b.fal_license ?? null]));
    return c.json({ ok: true });
  });

  // team list for assignment pickers; emails only for owners/admins
  api.get("/members", async (c) => {
    const m = member(c);
    const showEmail = can(m, "lead:assign");
    const r = await db.asSystem((q) => q.query(
      `select u.id, u.name, case when $2 then u.email end as email, ms.role
         from memberships ms join users u on u.id = ms.user_id where ms.org_id = $1 order by ms.created_at`,
      [m.orgId, showEmail]));
    return c.json(r.rows);
  });

  // ---- site ----
  api.get("/site", async (c) => {
    const m = member(c);
    const r = await db.asOrg(m.orgId, (q) => q.query(`select * from sites limit 1`));
    return c.json(r.rows[0] ?? null);
  });

  api.put("/site", async (c) => {
    const m = need(c, "site:edit");
    const b = await body(c, siteInput);
    if (RESERVED_SLUGS.has(b.slug)) throw new HttpError(409, "slug_reserved");
    const r = await db.asOrg(m.orgId, (q) => q.query(
      `insert into sites (org_id, slug, title, tagline, template, logo_url, theme, seo, contact_phone, contact_whatsapp, contact_email)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       on conflict (org_id) do update set slug=excluded.slug, title=excluded.title, tagline=excluded.tagline,
         template=excluded.template, logo_url=excluded.logo_url, theme=excluded.theme, seo=excluded.seo,
         contact_phone=excluded.contact_phone, contact_whatsapp=excluded.contact_whatsapp, contact_email=excluded.contact_email
       returning *`,
      [m.orgId, b.slug, b.title, b.tagline ?? null, b.template, b.logo_url ?? null, JSON.stringify(b.theme),
       JSON.stringify(b.seo), b.contact_phone ?? null, b.contact_whatsapp ?? null, b.contact_email ?? null]));
    return c.json(r.rows[0]);
  });

  api.post("/site/publish", async (c) => {
    const m = need(c, "site:publish");
    const { published } = await body(c, z.object({ published: z.boolean() }));
    if (published) {
      const o = await db.asSystem((q) => q.query(`select fal_license from orgs where id = $1`, [m.orgId]));
      if (!o.rows[0]?.fal_license) throw new HttpError(422, "fal_license_required");
    }
    const r = await db.asOrg(m.orgId, (q) => q.query(`update sites set published = $1 returning id, published`, [published]));
    if (!r.rows[0]) throw notFound();
    return c.json(r.rows[0]);
  });

  api.put("/site/deposits", async (c) => {
    const m = need(c, "payments:configure");
    const b = await body(c, z.object({ accept_deposits: z.boolean(), deposit_halalas: z.number().int().min(100).max(1e8).nullish() }));
    if (b.accept_deposits && (!env.MOYASAR_PUBLISHABLE_KEY || !env.MOYASAR_SECRET_KEY)) throw new HttpError(422, "payments_not_configured");
    const r = await db.asOrg(m.orgId, (q) => q.query(
      `update sites set accept_deposits = $1, deposit_halalas = $2 returning accept_deposits, deposit_halalas`,
      [b.accept_deposits, b.deposit_halalas ?? null]));
    if (!r.rows[0]) throw notFound();
    return c.json(r.rows[0]);
  });

  // ---- custom domains ----
  api.get("/domains", async (c) => {
    const m = need(c, "domain:manage");
    const r = await db.asOrg(m.orgId, (q) => q.query(`select id, hostname, verify_token, verified_at from site_domains order by created_at`));
    return c.json(r.rows);
  });

  api.post("/domains", async (c) => {
    const m = need(c, "domain:manage");
    const h = hostname.parse((await body(c, z.object({ hostname: z.string() }))).hostname);
    if (h === env.SITES_ROOT_DOMAIN || h.endsWith(`.${env.SITES_ROOT_DOMAIN}`)) throw new HttpError(422, "use_slug_instead");
    const token = newToken().slice(0, 32);
    const r = await db.asOrg(m.orgId, async (q) => {
      const s = (await q.query(`select id from sites limit 1`)).rows[0];
      if (!s) throw new HttpError(422, "create_site_first");
      return q.query(
        `insert into site_domains (org_id, site_id, hostname, verify_token) values ($1,$2,$3,$4) returning id, hostname`,
        [m.orgId, s.id, h, token]);
    });
    return c.json({
      ...r.rows[0],
      dns: [
        { type: "TXT", name: `_dealline-verify.${h}`, value: token },
        { type: "CNAME", name: h, value: `sites.${env.SITES_ROOT_DOMAIN}` },
      ],
    }, 201);
  });

  api.post("/domains/:id/verify", async (c) => {
    const m = need(c, "domain:manage");
    const id = z.string().uuid().parse(c.req.param("id"));
    const dom = (await db.asOrg(m.orgId, (q) => q.query(`select hostname, verify_token from site_domains where id = $1`, [id]))).rows[0];
    if (!dom) throw notFound();
    let records: string[][] = [];
    try { records = await txt(`_dealline-verify.${dom.hostname}`); } catch { /* not found yet */ }
    const ok = records.some((r) => safeEqual(r.join(""), dom.verify_token));
    if (!ok) return c.json({ verified: false, hint: "DNS may take up to 48h to propagate" });
    await db.asOrg(m.orgId, (q) => q.query(`update site_domains set verified_at = now() where id = $1`, [id]));
    return c.json({ verified: true });
  });

  api.delete("/domains/:id", async (c) => {
    const m = need(c, "domain:manage");
    const id = z.string().uuid().parse(c.req.param("id"));
    const r = await db.asOrg(m.orgId, (q) => q.query(`delete from site_domains where id = $1 returning id`, [id]));
    if (!r.rows[0]) throw notFound();
    return c.json({ ok: true });
  });

  // ---- listings (the inventory the site shows) ----
  api.get("/listings", async (c) => {
    const m = member(c);
    const f = z.object({
      status: z.enum(["draft", "published", "reserved", "sold", "archived"]).optional(),
      q: z.string().max(100).optional(),
      page: z.coerce.number().int().min(1).max(1000).default(1),
    }).parse(c.req.query());
    const r = await db.asOrg(m.orgId, (q) => q.query(
      `select *, area_sqm::float8 as area_sqm, ad_license_expires_on::text as ad_license_expires_on from listings
        where ($1::text is null or status = $1) and ($2::text is null or title ilike '%' || $2 || '%' or city ilike '%' || $2 || '%')
        order by created_at desc limit 50 offset $3`,
      [f.status ?? null, f.q ?? null, (f.page - 1) * 50]));
    return c.json(r.rows);
  });

  api.post("/listings", async (c) => {
    const m = need(c, "listing:create");
    const b = await body(c, listingInput);
    const r = await db.asOrg(m.orgId, (q) => q.query(
      `insert into listings (org_id, title, description, purpose, property_type, price_halalas, city, district, area_sqm,
         bedrooms, bathrooms, lat, lng, images, ad_license_number, ad_license_expires_on, show_on_site, created_by)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) returning id, status`,
      [m.orgId, b.title, b.description ?? null, b.purpose, b.property_type, b.price_halalas, b.city, b.district ?? null,
       b.area_sqm ?? null, b.bedrooms ?? null, b.bathrooms ?? null, b.lat ?? null, b.lng ?? null, JSON.stringify(b.images),
       b.ad_license_number ?? null, b.ad_license_expires_on ?? null, b.show_on_site, c.get("userId")]));
    return c.json(r.rows[0], 201);
  });

  const loadListing = async (q: Q, id: string) => {
    const l = (await q.query(`select id, created_by, status from listings where id = $1`, [id])).rows[0];
    if (!l) throw notFound();
    return l;
  };

  api.patch("/listings/:id", async (c) => {
    const m = member(c);
    const id = z.string().uuid().parse(c.req.param("id"));
    const b = await body(c, listingInput.partial());
    const cols = Object.keys(b) as (keyof typeof b)[];
    if (!cols.length) throw new HttpError(400, "nothing_to_update");
    const r = await db.asOrg(m.orgId, async (q) => {
      const l = await loadListing(q, id);
      if (!can(m, "listing:edit", { ownsRecord: l.created_by === c.get("userId") })) throw deny();
      const sets = cols.map((k, i) => `${k} = $${i + 2}`).join(", "); // keys come from the zod schema, not the client
      const vals = cols.map((k) => (k === "images" ? JSON.stringify(b[k]) : b[k] ?? null));
      return q.query(`update listings set ${sets} where id = $1 returning id, status`, [id, ...vals]);
    });
    return c.json(r.rows[0]);
  });

  api.post("/listings/:id/status", async (c) => {
    const m = member(c);
    const id = z.string().uuid().parse(c.req.param("id"));
    const { status } = await body(c, z.object({ status: z.enum(["draft", "published", "sold", "archived"]) }));
    if (status === "published" && !can(m, "listing:publish")) throw deny();
    const r = await db.asOrg(m.orgId, async (q) => {
      const l = await loadListing(q, id);
      if (status !== "published" && !can(m, "listing:edit", { ownsRecord: l.created_by === c.get("userId") })) throw deny();
      if (status === "published") {
        const lic = (await q.query(`select ad_license_expires_on >= current_date as valid from listings where id = $1`, [id])).rows[0];
        if (!lic?.valid) throw new HttpError(422, "ad_license_missing_or_expired");
      }
      const res = await q.query(`update listings set status = $2 where id = $1 returning id, status, title, city, price_halalas`, [id, status]);
      if (status === "published" && l.status !== "published") {
        const x = res.rows[0];
        await emit(q, m.orgId, "listing.published", {
          listing: { id, title: x.title, city: x.city, price_sar: sar(x.price_halalas) }, related: { type: "listing", id },
        });
      }
      return res;
    });
    return c.json(r.rows[0]);
  });

  api.delete("/listings/:id", async (c) => {
    const m = need(c, "listing:delete");
    const id = z.string().uuid().parse(c.req.param("id"));
    const r = await db.asOrg(m.orgId, async (q) => {
      const hasRes = (await q.query(`select 1 from reservations where listing_id = $1 limit 1`, [id])).rows[0];
      if (hasRes) return q.query(`update listings set status = 'archived' where id = $1 returning id, status`, [id]);
      return q.query(`delete from listings where id = $1 returning id, 'deleted' as status`, [id]);
    });
    if (!r.rows[0]) throw notFound();
    return c.json(r.rows[0]);
  });

  // ---- leads from the site (feed the CRM) ----
  api.get("/leads", async (c) => {
    const m = need(c, "lead:view");
    const mine = m.role === "member";
    const r = await db.asOrg(m.orgId, (q) => q.query(
      `select l.*, li.title as listing_title from leads l left join listings li on li.id = l.listing_id
        where ($1::uuid is null or l.assigned_to = $1) order by l.created_at desc limit 200`,
      [mine ? c.get("userId") : null]));
    return c.json(r.rows);
  });

  api.patch("/leads/:id", async (c) => {
    const m = member(c);
    const id = z.string().uuid().parse(c.req.param("id"));
    const b = await body(c, z.object({
      status: z.enum(["new", "contacted", "qualified", "won", "lost"]).optional(),
      assigned_to: z.string().uuid().nullable().optional(),
    }));
    if (b.assigned_to !== undefined && !can(m, "lead:assign")) throw deny();
    if (b.assigned_to) {
      const ok = await db.asSystem((s) => s.query(`select 1 from memberships where org_id = $1 and user_id = $2`, [m.orgId, b.assigned_to]));
      if (!ok.rows[0]) throw new HttpError(422, "assignee_not_in_org");
    }
    const r = await db.asOrg(m.orgId, async (q) => {
      const lead = (await q.query(`select assigned_to from leads where id = $1`, [id])).rows[0];
      if (!lead) throw notFound();
      if (!can(m, "lead:update", { ownsRecord: lead.assigned_to === c.get("userId") })) throw deny();
      return q.query(
        `update leads set status = coalesce($2, status),
           assigned_to = case when $3::boolean then $4::uuid else assigned_to end
         where id = $1 returning id, status, assigned_to`,
        [id, b.status ?? null, b.assigned_to !== undefined, b.assigned_to ?? null]);
    });
    return c.json(r.rows[0]);
  });

  api.get("/reservations", async (c) => {
    const m = need(c, "lead:assign");
    const r = await db.asOrg(m.orgId, (q) => q.query(
      `select r.*, li.title as listing_title, le.name as lead_name, le.phone as lead_phone
         from reservations r join listings li on li.id = r.listing_id left join leads le on le.id = r.lead_id
        order by r.created_at desc limit 200`));
    return c.json(r.rows);
  });

  api.route("/offplan", offplanApi(db));
  api.route("/automation", automationApi(db));
  api.route("/integrations", integrationsApi({ db, env, whatsapp: d.whatsapp, lookup: d.lookup }));
  api.route("/", leadWhatsAppRoutes({ db, env, whatsapp: d.whatsapp }));
  whatsappWebhook(app, { db, env });
  publicApi(app, { db });
  app.route("/api", api);

  // ================= public site (no auth) =================
  // The tenant site frontend calls these server-side with the request's Host.
  // asSystem: every query below filters by the site's org explicitly.
  const findSite = async (q: Q, host: string) => {
    const h = hostname.parse(host);
    const suffix = `.${env.SITES_ROOT_DOMAIN}`;
    const r = h.endsWith(suffix)
      ? await q.query(`select s.*, o.name as org_name, o.fal_license from sites s join orgs o on o.id = s.org_id
                        where s.slug = $1 and s.published`, [h.slice(0, -suffix.length)])
      : await q.query(`select s.*, o.name as org_name, o.fal_license from site_domains d join sites s on s.id = d.site_id
                        join orgs o on o.id = s.org_id where d.hostname = $1 and d.verified_at is not null and s.published`, [h]);
    const site = r.rows[0];
    if (!site || !site.fal_license) throw notFound();
    return site;
  };
  const publicSite = (s: any) => ({
    title: s.title, tagline: s.tagline, template: s.template, logo_url: s.logo_url, theme: s.theme, seo: s.seo,
    contact_phone: s.contact_phone, contact_whatsapp: s.contact_whatsapp, contact_email: s.contact_email,
    advertiser: { name: s.org_name, fal_license: s.fal_license },
    deposits: s.accept_deposits ? { amount_halalas: s.deposit_halalas, currency: "SAR" } : null,
  });
  offplanPublic(app, { db, findSite, allow: leadLimit, ip });

  // ads shown only while their REGA ad license is valid
  const LIVE = `org_id = $1 and show_on_site and status in ('published','reserved') and ad_license_expires_on >= current_date`;

  app.get("/public/sites/:host", async (c) => {
    const s = await db.asSystem((q) => findSite(q, c.req.param("host")));
    c.header("Cache-Control", "public, max-age=60");
    return c.json(publicSite(s));
  });

  app.get("/public/sites/:host/listings", async (c) => {
    const f = z.object({
      purpose: z.enum(["sale", "rent"]).optional(),
      type: z.string().max(20).optional(),
      city: z.string().max(60).optional(),
      page: z.coerce.number().int().min(1).max(500).default(1),
    }).parse(c.req.query());
    const rows = await db.asSystem(async (q) => {
      const s = await findSite(q, c.req.param("host"));
      return (await q.query(
        `select ${LISTING_PUBLIC_COLS} from listings where ${LIVE}
           and ($2::text is null or purpose = $2) and ($3::text is null or property_type = $3) and ($4::text is null or city = $4)
         order by created_at desc limit 24 offset $5`,
        [s.org_id, f.purpose ?? null, f.type ?? null, f.city ?? null, (f.page - 1) * 24])).rows;
    });
    c.header("Cache-Control", "public, max-age=60");
    return c.json(rows);
  });

  app.get("/public/sites/:host/listings/:id", async (c) => {
    const id = z.string().uuid().parse(c.req.param("id"));
    const row = await db.asSystem(async (q) => {
      const s = await findSite(q, c.req.param("host"));
      return (await q.query(`select ${LISTING_PUBLIC_COLS} from listings where ${LIVE} and id = $2`, [s.org_id, id])).rows[0];
    });
    if (!row) throw notFound();
    return c.json(row);
  });

  const createLead = async (q: Q, s: any, b: z.infer<typeof publicLeadInput>) => {
    if (b.listing_id) {
      const ok = await q.query(`select 1 from listings where ${LIVE} and id = $2`, [s.org_id, b.listing_id]);
      if (!ok.rows[0]) throw notFound();
    }
    const r = await q.query(
      `insert into leads (org_id, site_id, listing_id, name, phone, email, message, source, source_channel, utm_source, utm_medium, utm_campaign)
       values ($1,$2,$3,$4,$5,$6,$7,'website',$8,$9,$10,$11) returning *`,
      [s.org_id, s.id, b.listing_id ?? null, b.name, b.phone, b.email ?? null, b.message ?? null,
       b.source_channel ?? null, b.utm_source ?? null, b.utm_medium ?? null, b.utm_campaign ?? null]);
    await emit(q, s.org_id, "lead.created", leadPayload(r.rows[0]));
    return r.rows[0].id as string;
  };

  app.post("/public/sites/:host/leads", async (c) => {
    if (!leadLimit(`lead:${ip(c)}`)) throw new HttpError(429, "rate_limited");
    const b = await body(c, publicLeadInput);
    if (b.website) return c.json({ ok: true }, 201); // honeypot hit: pretend success
    await db.asSystem(async (q) => createLead(q, await findSite(q, c.req.param("host")), b));
    return c.json({ ok: true }, 201);
  });

  // ---- booking deposit (عربون حجز) via Moyasar ----
  app.post("/public/sites/:host/reservations", async (c) => {
    if (!leadLimit(`res:${ip(c)}`)) throw new HttpError(429, "rate_limited");
    const b = await body(c, publicLeadInput.extend({ listing_id: z.string().uuid() }));
    if (!env.MOYASAR_PUBLISHABLE_KEY) throw new HttpError(422, "payments_not_configured");
    const host = c.req.param("host");
    const out = await db.asSystem(async (q) => {
      const s = await findSite(q, host);
      if (!s.accept_deposits || !s.deposit_halalas) throw new HttpError(422, "deposits_disabled");
      const l = (await q.query(`select id, title, status from listings where ${LIVE} and id = $2`, [s.org_id, b.listing_id])).rows[0];
      if (!l) throw notFound();
      if (l.status !== "published") throw new HttpError(409, "already_reserved");
      const leadId = await createLead(q, s, { ...b, message: b.message ?? "طلب حجز بعربون" });
      const r = await q.query(
        `insert into reservations (org_id, listing_id, lead_id, amount_halalas) values ($1,$2,$3,$4) returning id`,
        [s.org_id, l.id, leadId, s.deposit_halalas]);
      return { reservationId: r.rows[0].id, amount: s.deposit_halalas, title: l.title };
    });
    // config for the Moyasar payment form on the site (card, mada, Apple Pay handled by Moyasar)
    return c.json({
      reservation_id: out.reservationId,
      moyasar: {
        publishable_api_key: env.MOYASAR_PUBLISHABLE_KEY,
        amount: out.amount, currency: "SAR",
        description: `عربون حجز: ${out.title}`.slice(0, 255),
        callback_url: `https://${hostname.parse(host)}/payments/return`,
        metadata: { reservation_id: out.reservationId },
      },
    }, 201);
  });

  /** Source of truth for a payment: re-read from Moyasar with the secret key, then apply once. */
  const applyPayment = async (paymentId: string) => {
    const p = await payments.fetchPayment(paymentId);
    const reservationId = p.metadata?.reservation_id;
    if (!reservationId || !z.string().uuid().safeParse(reservationId).success) return "ignored";
    return db.asSystem(async (q) => {
      const r = (await q.query(`select * from reservations where id = $1 for update`, [reservationId])).rows[0];
      if (!r) return "ignored";
      if (r.provider_payment_id && r.provider_payment_id !== p.id) return "ignored";
      if (r.status !== "pending") return r.status; // already applied
      if (p.status === "failed") {
        await q.query(`update reservations set status = 'failed', provider_payment_id = $2 where id = $1`, [r.id, p.id]);
        return "failed";
      }
      if (p.status !== "paid") return "pending";
      if (p.amount !== r.amount_halalas || p.currency !== r.currency) {
        console.error(`amount mismatch on reservation ${r.id}`);
        return "mismatch";
      }
      const taken = (await q.query(`select 1 from reservations where listing_id = $1 and status = 'paid'`, [r.listing_id])).rows[0];
      if (taken) {
        await q.query(`update reservations set status = 'refund_due', provider_payment_id = $2 where id = $1`, [r.id, p.id]);
        return "refund_due";
      }
      await q.query(`update reservations set status = 'paid', provider_payment_id = $2 where id = $1`, [r.id, p.id]);
      await q.query(`update listings set status = 'reserved' where id = $1 and org_id = $2 and status = 'published'`, [r.listing_id, r.org_id]);
      await q.query(`update leads set status = 'qualified' where id = $1 and org_id = $2`, [r.lead_id, r.org_id]);
      const info = (await q.query(
        `select l.title, le.name, le.phone, le.email, le.assigned_to from listings l left join leads le on le.id = $2 where l.id = $1`,
        [r.listing_id, r.lead_id])).rows[0];
      await emit(q, r.org_id, "reservation.paid", {
        listing: { id: r.listing_id, title: info?.title }, amount_sar: sar(r.amount_halalas),
        contact: { name: info?.name, phone: info?.phone, email: info?.email }, assignee: info?.assigned_to ?? null,
        related: { type: "reservation", id: r.id },
      });
      return "paid";
    });
  };

  app.post("/webhooks/moyasar", async (c) => {
    if (!env.MOYASAR_WEBHOOK_SECRET) return c.json({ error: "not_configured" }, 503);
    const ev = await body(c, z.object({
      id: z.string().min(1).max(100),
      type: z.string().max(60),
      secret_token: z.string().max(200),
      data: z.object({ id: z.string().min(1).max(64) }).passthrough(),
    }).passthrough());
    if (!safeEqual(ev.secret_token, env.MOYASAR_WEBHOOK_SECRET)) return c.json({ error: "unauthorized" }, 401);
    if (!["payment_paid", "payment_failed"].includes(ev.type)) return c.json({ ok: true });
    const fresh = await db.asSystem((q) => q.query(
      `insert into webhook_events (provider, event_id, type) values ('moyasar', $1, $2) on conflict do nothing returning event_id`,
      [ev.id, ev.type]));
    if (!fresh.rows[0]) return c.json({ ok: true, duplicate: true });
    try {
      return c.json({ ok: true, result: await applyPayment(ev.data.id) });
    } catch (e) {
      // let Moyasar retry: forget the event so the retry is processed
      await db.asSystem((q) => q.query(`delete from webhook_events where provider = 'moyasar' and event_id = $1`, [ev.id]));
      throw e;
    }
  });

  // The site's /payments/return page calls this with ?id= from Moyasar's redirect. Same verification as the webhook.
  app.get("/public/payments/:paymentId", async (c) => {
    const id = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/).parse(c.req.param("paymentId"));
    if (!leadLimit(`pay:${ip(c)}`)) throw new HttpError(429, "rate_limited");
    return c.json({ result: await applyPayment(id) });
  });

  app.get("/healthz", (c) => c.json({ ok: true }));
  return app;
}
