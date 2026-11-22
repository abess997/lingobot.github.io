import { useState } from "react";
import { ExternalLink, Globe } from "lucide-react";
import { api, backendInfo, date } from "../api.js";
import { Badge, Field, Form, Loaded, Panel, opt, useAction, useLoad } from "../ui.jsx";

const FONTS = ["IBM Plex Sans Arabic", "Tajawal", "Cairo", "Noto Kufi Arabic", "Almarai"];

export function SiteScreen({ me, notify, isOwner, refreshMe }) {
  const site = useLoad(() => api("/api/site"));
  const domains = useLoad(() => api("/api/domains"));
  const [run, busy] = useAction(notify);
  const [dnsHelp, setDnsHelp] = useState(null);
  const root = backendInfo()?.sitesRoot ?? "dealline.site";

  const save = (v) =>
    run(async () => {
      await api("/api/site", {
        method: "PUT",
        body: {
          slug: v.slug, title: v.title, tagline: opt(v.tagline), template: v.template, logo_url: opt(v.logo_url),
          theme: { primary: v.primary, accent: v.accent, font: v.font },
          seo: Object.fromEntries(Object.entries({ title: v.seo_title, description: v.seo_description }).filter(([, x]) => x)),
          contact_phone: opt(v.contact_phone), contact_whatsapp: opt(v.contact_whatsapp), contact_email: opt(v.contact_email),
        },
      });
      await site.reload();
    }, "تم حفظ إعدادات الموقع");

  return (
    <>
      <Panel title="هوية المنشأة" subtitle="رقم رخصة فال شرط لنشر الموقع (يُعرض في كل صفحة كمعلن)">
        <Form
          busy={busy}
          onSubmit={(v) => run(async () => { await api("/api/org", { method: "PUT", body: { name: v.name, fal_license: opt(v.fal_license) } }); await refreshMe(); }, "تم تحديث بيانات المنشأة")}
        >
          <Field label="اسم المنشأة"><input name="name" defaultValue={me.org_name} required /></Field>
          <Field label="رقم رخصة فال" hint="أرقام فقط (6–15)"><input name="fal_license" defaultValue={me.fal_license ?? ""} inputMode="numeric" pattern="[0-9]{6,15}" /></Field>
        </Form>
      </Panel>
      <Loaded state={site}>
        {(s) => (
          <>
            <Panel
              title="موقع المكتب"
              subtitle={s ? `الرابط: ${s.slug}.${root}` : "لم يُنشأ الموقع بعد — املأ الحقول واحفظ"}
              actions={
                s && (
                  <>
                    <Badge status={s.published ? "published" : "draft"}>{s.published ? "منشور" : "غير منشور"}</Badge>
                    <button
                      className="live-btn primary"
                      disabled={busy}
                      onClick={() => run(async () => { await api("/api/site/publish", { method: "POST", body: { published: !s.published } }); await site.reload(); }, s.published ? "تم إيقاف الموقع" : "تم نشر الموقع")}
                    >
                      <Globe size={15} /> {s.published ? "إيقاف النشر" : "نشر الموقع"}
                    </button>
                    {s.published && (
                      <a className="live-btn" href={`#/site/${s.slug}`}>
                        <ExternalLink size={15} /> فتح الموقع
                      </a>
                    )}
                  </>
                )
              }
            >
              <Form onSubmit={save} busy={busy} submit="حفظ الموقع">
                <Field label="رابط الموقع (slug)" hint={`حروف إنجليزية صغيرة وأرقام وشرطة · ${root}`}><input name="slug" required defaultValue={s?.slug ?? ""} pattern="[a-z0-9][a-z0-9\-]{1,38}[a-z0-9]" dir="ltr" /></Field>
                <Field label="عنوان الموقع"><input name="title" required maxLength={80} defaultValue={s?.title ?? me.org_name} /></Field>
                <Field label="العبارة التعريفية" wide><input name="tagline" maxLength={160} defaultValue={s?.tagline ?? ""} /></Field>
                <Field label="القالب">
                  <select name="template" defaultValue={s?.template ?? "classic"}>
                    <option value="classic">كلاسيكي</option><option value="modern">حديث</option><option value="minimal">بسيط</option>
                  </select>
                </Field>
                <Field label="الخط">
                  <select name="font" defaultValue={s?.theme?.font ?? FONTS[0]}>{FONTS.map((f) => <option key={f}>{f}</option>)}</select>
                </Field>
                <Field label="اللون الأساسي"><input name="primary" type="color" defaultValue={s?.theme?.primary ?? "#145c43"} /></Field>
                <Field label="لون التمييز"><input name="accent" type="color" defaultValue={s?.theme?.accent ?? "#c9a227"} /></Field>
                <Field label="رابط الشعار (https)"><input name="logo_url" type="url" defaultValue={s?.logo_url ?? ""} dir="ltr" /></Field>
                <Field label="جوال التواصل"><input name="contact_phone" defaultValue={s?.contact_phone ?? ""} placeholder="05xxxxxxxx" dir="ltr" /></Field>
                <Field label="واتساب"><input name="contact_whatsapp" defaultValue={s?.contact_whatsapp ?? ""} placeholder="05xxxxxxxx" dir="ltr" /></Field>
                <Field label="البريد"><input name="contact_email" type="email" defaultValue={s?.contact_email ?? ""} dir="ltr" /></Field>
                <Field label="عنوان SEO"><input name="seo_title" maxLength={70} defaultValue={s?.seo?.title ?? ""} /></Field>
                <Field label="وصف SEO" wide><input name="seo_description" maxLength={160} defaultValue={s?.seo?.description ?? ""} /></Field>
              </Form>
            </Panel>
            <Panel title="العربون عبر ميسّر" subtitle="متوقف افتراضيًا. المالك فقط يفعّله بعد التحقق النظامي من جواز أخذ العربون عبر موقع الوسيط.">
              <div className="live-inline live-body">
                <Badge status={s?.accept_deposits ? "active" : "draft"}>{s?.accept_deposits ? `مفعل · ${s.deposit_halalas / 100} ر.س` : "غير مفعل"}</Badge>
                {isOwner && s && (
                  <button
                    className="live-btn"
                    disabled={busy}
                    onClick={() => run(async () => { await api("/api/site/deposits", { method: "PUT", body: { accept_deposits: !s.accept_deposits, deposit_halalas: 500000 } }); await site.reload(); }, "تم التحديث")}
                  >
                    {s.accept_deposits ? "إيقاف العربون" : "تفعيل عربون 5,000 ر.س"}
                  </button>
                )}
              </div>
              <p className="live-note warn">الدفع لا يُفعّل إلا بمفاتيح ميسّر في الخادم؛ في البيئة التجريبية سيظهر أن الدفع غير مهيأ — وهذا مقصود.</p>
            </Panel>
          </>
        )}
      </Loaded>
      <Panel title="نطاق خاص" subtitle="يُخدم النطاق فقط بعد التحقق من سجل TXT">
        <Form
          busy={busy}
          submit="إضافة نطاق"
          onSubmit={(v, form) => run(async () => { const r = await api("/api/domains", { method: "POST", body: { hostname: v.hostname } }); setDnsHelp(r); form.reset(); await domains.reload(); }, "أضفنا النطاق؛ أضف سجلات DNS ثم تحقق")}
        >
          <Field label="النطاق"><input name="hostname" required placeholder="www.example.sa" dir="ltr" /></Field>
        </Form>
        {dnsHelp && (
          <div className="live-body">
            <p className="live-note">أضف هذه السجلات لدى مزود النطاق:</p>
            <div className="live-secret">{dnsHelp.dns.map((r) => `${r.type}  ${r.name}  →  ${r.value}`).join("\n")}</div>
          </div>
        )}
        <Loaded state={domains} empty="لا توجد نطاقات خاصة.">
          {(rows) => (
            <div className="live-table-wrap">
              <table className="live-table">
                <thead><tr><th>النطاق</th><th>الحالة</th><th /></tr></thead>
                <tbody>
                  {rows.map((d) => (
                    <tr key={d.id}>
                      <td dir="ltr">{d.hostname}</td>
                      <td><Badge status={d.verified_at ? "active" : "pending"}>{d.verified_at ? `موثق ${date(d.verified_at)}` : "بانتظار التحقق"}</Badge></td>
                      <td className="live-actions">
                        {!d.verified_at && (
                          <button className="live-btn" onClick={() => run(async () => { const r = await api(`/api/domains/${d.id}/verify`, { method: "POST" }); await domains.reload(); notify(r.verified ? "تم التحقق من النطاق" : "لم نجد سجل TXT بعد (قد يستغرق انتشار DNS حتى 48 ساعة)", r.verified ? "ok" : "error"); })}>تحقق</button>
                        )}
                        <button className="live-btn danger" onClick={() => run(async () => { await api(`/api/domains/${d.id}`, { method: "DELETE" }); await domains.reload(); }, "تم حذف النطاق")}>حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Loaded>
      </Panel>
    </>
  );
}
