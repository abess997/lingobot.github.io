// Fake demo data only (no real people). Usage: npm run seed
import pg from "pg";
import { hashPassword } from "../src/auth.js";

const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
await c.connect();
const pw = await hashPassword("demo-password-123");
const u = await c.query(`insert into users (name, email, password_hash, email_verified_at) values ('مستخدم تجريبي','demo@example.com',$1, now()) returning id`, [pw]);
const o = await c.query(`insert into orgs (name, fal_license) values ('مكتب الأفق التجريبي','1100000000') returning id`);
await c.query(`insert into memberships values ($1,$2,'owner')`, [o.rows[0].id, u.rows[0].id]);
const s = await c.query(
  `insert into sites (org_id, slug, title, tagline, published, theme) values ($1,'demo-ofuq','مكتب الأفق','عقارات الشرقية',true,'{"primary":"#0F766E","accent":"#F59E0B","font":"IBM Plex Sans Arabic"}') returning id`,
  [o.rows[0].id]);
const demo = [
  ["شقة 3 غرف في حي الشاطئ", "sale", "apartment", 85000000, "الدمام", "الشاطئ", 165, 3],
  ["فيلا دورين مع ملحق", "sale", "villa", 210000000, "الخبر", "الحزام الذهبي", 400, 5],
  ["مكتب إداري للإيجار", "rent", "office", 6000000, "الدمام", "الفيصلية", 120, 0],
] as const;
for (const [title, purpose, type, price, city, district, area, beds] of demo)
  await c.query(
    `insert into listings (org_id, title, purpose, property_type, price_halalas, city, district, area_sqm, bedrooms,
       ad_license_number, ad_license_expires_on, status, created_by)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'DEMO-0001', current_date + 90,'published',$10)`,
    [o.rows[0].id, title, purpose, type, price, city, district, area, beds, u.rows[0].id]);
console.info(`seeded site ${s.rows[0].id}: login demo@example.com / demo-password-123`);
await c.end();
