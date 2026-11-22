// The tenant website the builder produces ({slug}.SITES_ROOT_DOMAIN in production; #/site/{slug} here).
// Reads only the public endpoints: no buyer data, no IBAN, ads hidden once their license expires.
import { useEffect, useState } from "react";
import { ArrowRight, Calculator, MapPin, Phone, ShieldCheck, ShoppingBag } from "lucide-react";
import { saveHandoff } from "./handoff.js";
import { ExperienceDialog } from "../app/experience.jsx";
import { api, initBackend, PLAN_TRIGGERS, PROPERTY_TYPES, sar, UNIT_TYPES, date } from "./api.js";
import { Field, Form, Loaded, useAction, useLoad } from "./ui.jsx";
import "./live.css";

const img = (name) => `${import.meta.env.BASE_URL}images/${name}`;
const fallbackImage = (type) => img(type === "villa" || type === "townhouse" ? "saudi-villa.webp" : type === "apartment" ? "khobar-apartments.webp" : "saudi-townhouses.webp");

export function PublicSite({ slug }) {
  const [root, setRoot] = useState(null);
  useEffect(() => { initBackend().then((t) => setRoot(t.sitesRoot)); }, []);
  if (!root) return <main className="pub-site" dir="rtl"><p className="pub-section">جارٍ تحميل الموقع…</p></main>;
  return <SiteView host={`${slug}.${root}`} />;
}

function SiteView({ host }) {
  const data = useLoad(async () => {
    const [site, listings, projects] = await Promise.all([
      api(`/public/sites/${host}`), api(`/public/sites/${host}/listings`), api(`/public/sites/${host}/projects`),
    ]);
    return { site, listings, projects };
  }, [host]);
  const [open, setOpen] = useState(null);
  const [toast, setToast] = useState("");
  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 3500); };

  if (data.error)
    return (
      <main className="pub-site" dir="rtl">
        <section className="pub-section">
          <h1>الموقع غير متاح</h1>
          <p>{data.error.status === 404 ? "الموقع غير منشور، أو لا تتوفر رخصة فال للمنشأة." : data.error.message}</p>
          <a href="#/" className="pub-btn">العودة إلى ديل لاين</a>
        </section>
      </main>
    );
  return (
    <Loaded state={data}>
      {({ site, listings, projects }) => (
        <main className="pub-site" dir="rtl" style={{ "--pub-primary": site.theme?.primary ?? "#145c43", "--pub-accent": site.theme?.accent ?? "#c9a227", "--pub-font": site.theme?.font }}>
          <title>{site.seo?.title ?? site.title}</title>
          <header className="pub-top">
            <strong>{site.logo_url ? <img src={site.logo_url} alt={site.title} height="36" /> : site.title}</strong>
            <nav aria-label="أقسام الموقع">
              <a href="#ready">عقارات جاهزة</a>
              <a href="#offplan">على الخارطة</a>
              <a href="#contact">تواصل</a>
            </nav>
          </header>
          <section className="pub-hero">
            <h1>{site.title}</h1>
            <p>{site.tagline}</p>
          </section>
          <section className="pub-section" id="ready">
            <h2>عقارات جاهزة</h2>
            {listings.length ? (
              <div className="pub-cards">
                {listings.map((l) => (
                  <button key={l.id} className="pub-card" onClick={() => setOpen({ listing: l })}>
                    <img src={l.images?.[0] ?? fallbackImage(l.property_type)} alt="" loading="lazy" />
                    <div>
                      <strong>{l.title}</strong>
                      <span><MapPin size={13} /> {l.city}{l.district ? ` · ${l.district}` : ""} · {PROPERTY_TYPES[l.property_type]}{l.area_sqm ? ` · ${l.area_sqm} م²` : ""}</span>
                      <b>{sar(l.price_halalas)}</b>
                      <small className="pub-license">رخصة الإعلان {l.ad_license_number}</small>
                    </div>
                  </button>
                ))}
              </div>
            ) : <p>لا توجد عقارات معروضة حاليًا.</p>}
          </section>
          <section className="pub-section" id="offplan">
            <h2>مشاريع على الخارطة</h2>
            {projects.length ? (
              <div className="pub-cards">
                {projects.map((p) => (
                  <button key={p.id} className="pub-card" onClick={() => setOpen({ project: p.id })}>
                    <img src={p.images?.[0] ?? img("saudi-townhouses.webp")} alt="" loading="lazy" />
                    <div>
                      <strong>{p.name}</strong>
                      <span><MapPin size={13} /> {p.city}{p.district ? ` · ${p.district}` : ""} · الإنجاز {p.progress_pct}%</span>
                      <b>{p.price_from_halalas ? `يبدأ من ${sar(p.price_from_halalas)}` : "لا توجد وحدات متاحة"}</b>
                      <small className="pub-license">ترخيص وافي {p.wafi_license_number} · {p.units_available} وحدة متاحة</small>
                    </div>
                  </button>
                ))}
              </div>
            ) : <p>لا توجد مشاريع معروضة حاليًا.</p>}
          </section>
          <footer className="pub-foot" id="contact">
            <span><ShieldCheck size={14} /> المعلن: {site.advertiser.name} · رخصة فال {site.advertiser.fal_license}</span>
            {site.contact_phone && <span dir="ltr"><Phone size={13} /> {site.contact_phone}</span>}
            {site.contact_email && <span dir="ltr">{site.contact_email}</span>}
            <span>يعمل بواسطة ديل لاين</span>
            <a href="#/office" style={{ color: "inherit" }}><ArrowRight size={13} /> مساحة المكتب (ديل لاين)</a>
          </footer>
          {open?.listing && (
            <ExperienceDialog title={open.listing.title} close={() => setOpen(null)} wide>
              <ListingDetail host={host} listing={open.listing} notify={notify} done={() => setOpen(null)} />
            </ExperienceDialog>
          )}
          {open?.project && (
            <ExperienceDialog title="تفاصيل المشروع" close={() => setOpen(null)} wide>
              <ProjectDetail host={host} office={site.title} id={open.project} notify={notify} done={() => setOpen(null)} />
            </ExperienceDialog>
          )}
          {toast && <div className="toast" role="status">{toast}</div>}
        </main>
      )}
    </Loaded>
  );
}

function LeadForm({ submit, busy, cta = "أرسل طلبك" }) {
  return (
    <Form busy={busy} submit={cta} onSubmit={submit}>
      <Field label="الاسم"><input name="name" required maxLength={120} autoComplete="name" /></Field>
      <Field label="الجوال"><input name="phone" required placeholder="05xxxxxxxx" dir="ltr" autoComplete="tel" /></Field>
      <Field label="رسالتك" wide><textarea name="message" maxLength={2000} /></Field>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
    </Form>
  );
}

const utm = () => {
  const p = new URLSearchParams(window.location.search);
  return { source_channel: p.get("src") ?? undefined, utm_source: p.get("utm_source") ?? undefined, utm_medium: p.get("utm_medium") ?? undefined, utm_campaign: p.get("utm_campaign") ?? undefined };
};

function ListingDetail({ host, listing: l, notify, done }) {
  const [run, busy] = useAction((m, kind) => notify(kind === "error" ? m : m));
  return (
    <div className="live-body">
      <img src={l.images?.[0] ?? fallbackImage(l.property_type)} alt="" style={{ width: "100%", borderRadius: 18, aspectRatio: "16/8", objectFit: "cover" }} />
      <dl className="live-dl" style={{ marginTop: 12 }}>
        <div><dt>السعر</dt><dd>{sar(l.price_halalas)}</dd></div>
        <div><dt>الموقع</dt><dd>{l.city}{l.district ? ` · ${l.district}` : ""}</dd></div>
        {l.area_sqm && <div><dt>المساحة</dt><dd>{l.area_sqm} م²</dd></div>}
        {l.bedrooms != null && <div><dt>غرف النوم</dt><dd>{l.bedrooms}</dd></div>}
        <div><dt>رخصة الإعلان</dt><dd>{l.ad_license_number} <small>حتى {date(l.ad_license_expires_on)}</small></dd></div>
      </dl>
      {l.description && <p className="live-note">{l.description}</p>}
      <h3>مهتم؟ نتواصل معك</h3>
      <LeadForm busy={busy} submit={(v) => run(async () => { await api(`/public/sites/${host}/leads`, { method: "POST", body: { ...v, message: v.message || null, listing_id: l.id, ...utm() } }); done(); }, "وصل طلبك، وسيتواصل معك المكتب قريبًا.")} />
    </div>
  );
}

function ProjectDetail({ host, office, id, notify, done }) {
  const p = useLoad(() => api(`/public/sites/${host}/projects/${id}`), [id]);
  const [unit, setUnit] = useState(null);
  const [run, busy] = useAction((m) => notify(m));
  return (
    <Loaded state={p}>
      {(d) => (
        <div className="live-body">
          <h2 style={{ marginTop: 0 }}>{d.name}</h2>
          <p className="live-note">{d.description}</p>
          <dl className="live-dl">
            <div><dt>نسبة الإنجاز</dt><dd>{d.progress_pct}%<div className="live-progress"><i style={{ width: `${d.progress_pct}%` }} /></div></dd></div>
            <div><dt>التسليم المتوقع</dt><dd>{date(d.expected_handover_on)}</dd></div>
            <div><dt>ترخيص وافي</dt><dd dir="ltr">{d.wafi_license_number}</dd></div>
            <div><dt>رخصة الإعلان</dt><dd dir="ltr">{d.ad_license_number}</dd></div>
          </dl>
          <h3>الوحدات</h3>
          <div className="pub-units">
            {d.units.map((u) => (
              <button key={u.id} disabled={!u.available} aria-pressed={unit === u.id} onClick={() => setUnit(unit === u.id ? null : u.id)}>
                <strong>{u.code}</strong><br />
                <small>{UNIT_TYPES[u.unit_type]} · {u.area_sqm} م²{u.bedrooms != null ? ` · ${u.bedrooms} غرف` : ""}</small><br />
                <small>{u.available ? sar(u.price_halalas) : "غير متاحة"}</small>
              </button>
            ))}
          </div>
          {d.payment_plans.map((pl) => (
            <div key={pl.name} style={{ marginTop: 14 }}>
              <h3>خطة الدفع: {pl.name}</h3>
              <ul className="live-timeline">{pl.items.map((i, k) => <li key={k}>{i.label} — {i.share_bp / 100}% <small>{PLAN_TRIGGERS[i.trigger]}</small></li>)}</ul>
            </div>
          ))}
          <p className="live-note">المدفوعات تُحوّل إلى حساب الضمان الخاص بالمشروع وفق نظام البيع على الخارطة، ولا تُدفع عبر هذا الموقع.</p>
          {unit ? (
            <UnitActions host={host} office={office} project={d} unit={d.units.find((u) => u.id === unit)} />
          ) : (
            <>
              <h3>سجّل اهتمامك</h3>
              <p className="live-note">اختر وحدة متاحة من الأعلى لتظهر لك خيارات الشراء والحسبة.</p>
              <LeadForm busy={busy} cta="سجّل اهتمامي" submit={(v) => run(async () => { await api(`/public/sites/${host}/projects/${id}/interest`, { method: "POST", body: { ...v, message: v.message || null, unit_id: null, ...utm() } }); done(); }, "سجلنا اهتمامك، وسيتواصل معك فريق المبيعات.")} />
            </>
          )}
        </div>
      )}
    </Loaded>
  );
}

/** A unit is picked: buy now, or calculate it with Deal Line. Both continue in the Deal Line buyer
 *  portal (login first), on this exact unit and price. */
function UnitActions({ host, office, project, unit }) {
  const go = (intent) => {
    saveHandoff({
      intent, host, office,
      project: { id: project.id, name: project.name, city: project.city, district: project.district, wafi_license_number: project.wafi_license_number },
      unit: { id: unit.id, code: unit.code, unit_type: unit.unit_type, area_sqm: unit.area_sqm, bedrooms: unit.bedrooms, price_halalas: unit.price_halalas },
      plans: project.payment_plans,
      at: new Date().toISOString(),
    });
    window.location.hash = "#/buy";
  };
  return (
    <div className="pub-unit-actions">
      <h3>الوحدة <bdi>{unit.code}</bdi> · <bdi>{sar(unit.price_halalas)}</bdi></h3>
      <div className="pub-unit-buttons">
        <button className="primary-action" onClick={() => go("buy")}><ShoppingBag size={18} /> شراء الآن</button>
        <button className="secondary-action" onClick={() => go("calc")}><Calculator size={18} /> احسبها مع ديل لاين</button>
      </div>
      <p className="live-note">تنتقل إلى بوابة العميل في ديل لاين لتسجيل الدخول، ثم تظهر لك نفس الوحدة وحسبتك على سعرها بالضبط. لا يتم أي دفع من هنا.</p>
    </div>
  );
}
