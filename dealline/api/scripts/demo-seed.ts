// Demo data for local development and the in-browser build. Fake names and numbers only.
// Goes through the HTTP API (same validation and rules as real use); SQL only where no
// endpoint exists yet (team members: invites are not built).
type App = { request: (path: string, init?: RequestInit) => Response | Promise<Response> };
type Sql = { query: (sql: string, params?: unknown[]) => Promise<{ rows: any[] }> };

export const DEMO_PASSWORD = "demo-password-123";
export const DEMO_USERS = [
  { email: "owner@dealline.test", role: "owner", name: "مدير تلال العقارية" },
  { email: "admin@dealline.test", role: "admin", name: "مشرفة المبيعات" },
  { email: "sales@dealline.test", role: "member", name: "نورة العتيبي" },
] as const;

const day = (offset: number) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);

export async function seedDemo({ app, lite, root }: { app: App; lite: Sql; root: string }) {
  let cookie = "";
  let ip = 0;
  const call = async (method: string, path: string, body?: unknown, as?: string) => {
    const res = await app.request(path, {
      method,
      headers: { "content-type": "application/json", "x-forwarded-for": `198.51.100.${++ip % 250}`, ...(as ?? cookie ? { cookie: as ?? cookie, "x-dl-cookie": as ?? cookie } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    if (res.status >= 400) throw new Error(`seed ${method} ${path} -> ${res.status} ${text}`);
    // browsers hide Set-Cookie on JS-built responses; the in-browser build mirrors it in x-dl-set-cookie
    const set = res.headers.get("set-cookie") ?? res.headers.get("x-dl-set-cookie");
    return { json: text ? JSON.parse(text) : null, cookie: set ? set.split(";")[0] : "" };
  };

  // ---- people and org ----
  const owner = await call("POST", "/auth/signup", { name: DEMO_USERS[0].name, email: DEMO_USERS[0].email, password: DEMO_PASSWORD, org_name: "تلال العقارية" });
  cookie = owner.cookie;
  const me = (await call("GET", "/me")).json;
  await lite.query(`update users set email_verified_at = now() where id = $1`, [me.id]);
  for (const u of DEMO_USERS.slice(1)) {
    const s = await call("POST", "/auth/signup", { name: u.name, email: u.email, password: DEMO_PASSWORD, org_name: "مؤقت" }, "");
    const other = (await call("GET", "/me", undefined, s.cookie)).json;
    await lite.query(`delete from orgs where id = $1`, [other.org_id]);
    await lite.query(`insert into memberships (org_id, user_id, role) values ($1,$2,$3)`, [me.org_id, other.id, u.role]);
    await lite.query(`update users set email_verified_at = now() where id = $1`, [other.id]);
  }
  await call("PUT", "/api/org", { name: "تلال العقارية", fal_license: "1100000000" });

  // ---- website ----
  await call("PUT", "/api/site", {
    slug: "tilal", title: "تلال العقارية", tagline: "بيوت جاهزة ومشاريع على الخارطة في المنطقة الشرقية",
    template: "modern", theme: { primary: "#145c43", accent: "#c9a227", font: "IBM Plex Sans Arabic" },
    seo: { title: "تلال العقارية — بيوت للبيع في الشرقية", description: "فلل وشقق وتاون هاوس جاهزة، ومشاريع على الخارطة بخطط دفع واضحة." },
    contact_phone: "0551234567", contact_whatsapp: "0551234567", contact_email: "hello@example.sa",
  });
  await call("POST", "/api/site/publish", { published: true });

  // ---- ready listings (the same homes the marketing site shows) ----
  const ready = [
    ["فيلا عائلية — واجهة الدمام", "villa", 112_000_000, "الدمام", "واجهة الدمام", 210, 4, 4, "مساحات عائلية مستقلة، مجلس بمدخل خاص، وصالة معيشة تطل على الحديقة."],
    ["شقة تمليك — قلب الخبر", "apartment", 89_000_000, "الخبر", "وسط الخبر", 132, 3, 3, "شقة بمساحات مفتوحة وإضاءة طبيعية، قريبة من الخدمات اليومية."],
    ["تاون هاوس — قمرة", "villa", 98_000_000, "صفوى", "قمرة", 198, 4, 3, "تاون هاوس على دورين مع فناء خاص ومساحات مرنة للعائلة."],
    ["فيلا — واحة النرجس", "villa", 165_000_000, "الرياض", "النرجس", 260, 5, 5, "فيلا عائلية بمجلس مستقل وجناح رئيسي وصالة علوية."],
    ["شقة — إطلالة الروضة", "apartment", 76_000_000, "جدة", "الروضة", 145, 3, 3, "شقة عائلية بتشطيب حديث وإطلالة مفتوحة."],
  ] as const;
  const listingIds: string[] = [];
  for (const [title, type, price, city, district, area, beds, baths, description] of ready) {
    const l = await call("POST", "/api/listings", {
      title, description, purpose: "sale", property_type: type, price_halalas: price, city, district,
      area_sqm: area, bedrooms: beds, bathrooms: baths, ad_license_number: `7100${listingIds.length + 1}2026`, ad_license_expires_on: day(120),
    });
    listingIds.push(l.json.id);
    await call("POST", `/api/listings/${l.json.id}/status`, { status: "published" });
  }
  // a draft without an ad license: cannot be published until one is added
  await call("POST", "/api/listings", { title: "مكتب إداري للإيجار — الفيصلية", purpose: "rent", property_type: "office", price_halalas: 6_000_000, city: "الدمام", district: "الفيصلية", area_sqm: 120 });

  // ---- off-plan project ----
  const p = await call("POST", "/api/offplan/projects", {
    name: "أبراج تلال — الخبر", description: "برج سكني على الخارطة قرب الواجهة البحرية، بخطة دفع مرتبطة بنسب الإنجاز.",
    city: "الخبر", district: "الكورنيش", wafi_license_number: "WAFI-2026-0142", escrow_bank: "بنك تجريبي",
    escrow_iban: "SA44 2000 0001 2345 6789 1234", ad_license_number: "7200112026", ad_license_expires_on: day(180),
    expected_handover_on: day(540), hold_days: 3,
  });
  const pid = p.json.id;
  await call("POST", `/api/offplan/projects/${pid}/units`, { unit_type: "apartment", building: "A", floor: 1, area_sqm: 145, bedrooms: 3, price_halalas: 95_000_000, bulk: { prefix: "A-1", from: 1, count: 6 } });
  await call("POST", `/api/offplan/projects/${pid}/units`, { unit_type: "apartment", building: "A", floor: 2, area_sqm: 168, bedrooms: 4, price_halalas: 112_000_000, bulk: { prefix: "A-2", from: 1, count: 6 } });
  const plan = await call("POST", `/api/offplan/projects/${pid}/plans`, {
    name: "10 / 20 / 30 / 40",
    items: [
      { label: "دفعة الحجز", share_bp: 1000, trigger: "on_booking" },
      { label: "عند توقيع العقد", share_bp: 2000, trigger: "on_contract" },
      { label: "عند إنجاز 50%", share_bp: 3000, trigger: "at_progress", at_progress_pct: 50 },
      { label: "عند التسليم", share_bp: 4000, trigger: "on_handover" },
    ],
  });
  await call("POST", `/api/offplan/projects/${pid}/status`, { status: "selling" });
  await call("POST", `/api/offplan/projects/${pid}/progress`, { pct: 35, report_ref: "CONS-2026-07", reported_on: day(-10) });

  const units = (await call("GET", `/api/offplan/projects/${pid}/units`)).json as any[];
  const byCode = (code: string) => units.find((u) => u.code === code).id;
  // deal 1: held -> booking paid into escrow -> reserved -> contracted
  const d1 = (await call("POST", "/api/offplan/deals", { unit_id: byCode("A-11"), plan_id: plan.json.id, buyer_name: "خالد الدوسري", buyer_phone: "0501112233" })).json;
  let detail = (await call("GET", `/api/offplan/deals/${d1.id}`)).json;
  await call("POST", `/api/offplan/installments/${detail.installments[0].id}/receipts`, { amount_halalas: detail.installments[0].amount_halalas, received_on: day(-6), bank_ref: "TRX-883201" });
  await call("POST", `/api/offplan/deals/${d1.id}/reserve`, {});
  await call("POST", `/api/offplan/deals/${d1.id}/contract`, { contract_ref: "CT-2026-0091", signed_on: day(-3) });
  detail = (await call("GET", `/api/offplan/deals/${d1.id}`)).json;
  const second = detail.installments.find((i: any) => i.trigger === "on_contract");
  if (second) await call("POST", `/api/offplan/installments/${second.id}/receipts`, { amount_halalas: Math.round(second.amount_halalas / 2), received_on: day(-1), bank_ref: "TRX-883977" });
  // deal 2: just held, waiting for the booking payment
  await call("POST", "/api/offplan/deals", { unit_id: byCode("A-21"), plan_id: plan.json.id, buyer_name: "منى الشمري", buyer_phone: "0559876543" });

  // ---- automation (before leads, so the rules run on them) ----
  await call("POST", "/api/automation/rules", {
    name: "عميل جديد من الموقع ← مهمة اتصال خلال ساعتين", trigger: "lead.created",
    actions: [{ type: "create_task", title: "اتصل بـ {{lead.name}} ({{lead.phone}})", assign_to: "owner", due_in_hours: 2 }],
  });
  await call("POST", "/api/automation/rules", {
    name: "عميل سناب شات ← رسالة ترحيب واتساب", trigger: "lead.created", conditions: { "lead.source_channel": "snapchat" },
    actions: [{ type: "whatsapp_template", template: "welcome_lead", language: "ar", params: ["{{lead.name}}"] }],
  });
  await call("POST", "/api/automation/rules", {
    name: "حجز وحدة على الخارطة ← تذكير بدفعة الحجز", trigger: "deal.held",
    actions: [{ type: "create_task", title: "تابع تحويل دفعة الحجز من {{deal.buyer_name}} — {{deal.unit_code}}", assign_to: "assignee", due_in_hours: 24 }],
  });

  // ---- leads arriving from the public site ----
  const host = `tilal.${root}`;
  const leads = [
    { name: "عبدالله الحربي", phone: "0503334455", message: "أبغى أعرف تفاصيل فيلا واجهة الدمام", listing_id: listingIds[0], source_channel: "snapchat", utm_campaign: "summer-villas" },
    { name: "سارة الغامدي", phone: "0544445566", message: "هل يوجد تمويل للشقة؟", listing_id: listingIds[1], source_channel: "google" },
    { name: "فهد القحطاني", phone: "0566667788", message: "متى موعد المعاينة؟", source_channel: "tiktok" },
  ];
  for (const l of leads) await call("POST", `/public/sites/${host}/leads`, l, "");
  await call("POST", `/public/sites/${host}/projects/${pid}/interest`, { name: "ريم العنزي", phone: "0577778899", unit_id: byCode("A-13"), message: "مهتمة بوحدة الدور الأول", source_channel: "x" }, "");
  return { host, owner: DEMO_USERS[0].email };
}
