import { useState } from "react";
import { Plus } from "lucide-react";
import { ExperienceDialog } from "../../app/experience.jsx";
import { api, date, PROPERTY_TYPES, sar, statusLabel, toHalalas } from "../api.js";
import { Badge, ConfirmButton, Field, Form, Loaded, Panel, num, opt, useAction, useLoad } from "../ui.jsx";

const FILTERS = ["", "draft", "published", "reserved", "sold", "archived"];

export function ListingsScreen({ me, notify, isAdmin }) {
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const list = useLoad(() => api(`/api/listings?${new URLSearchParams({ ...(status && { status }), ...(query && { q: query }) })}`), [status, query]);
  const [editing, setEditing] = useState(null); // null | "new" | listing
  const [run, busy] = useAction(notify);

  const setListingStatus = (l, next) =>
    run(async () => { await api(`/api/listings/${l.id}/status`, { method: "POST", body: { status: next } }); await list.reload(); }, `أصبحت الحالة: ${statusLabel(next)}`);

  return (
    <>
      <Panel
        title="المخزون الجاهز"
        subtitle="يظهر العقار في الموقع فقط وهو منشور ورخصة إعلانه سارية"
        actions={<button className="live-btn primary" onClick={() => setEditing("new")}><Plus size={15} /> إضافة عقار</button>}
      >
        <div className="live-inline live-body">
          <div className="crm-filters">
            {FILTERS.map((f) => (
              <button key={f || "all"} className={status === f ? "active" : ""} onClick={() => setStatus(f)}>{f ? statusLabel(f) : "الكل"}</button>
            ))}
          </div>
          <form className="live-inline" onSubmit={(e) => { e.preventDefault(); setQuery(q.trim()); }}>
            <input aria-label="بحث في العقارات" placeholder="بحث بالعنوان أو المدينة" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="live-btn">بحث</button>
          </form>
        </div>
        <Loaded state={list} empty="لا توجد عقارات بهذا الفلتر.">
          {(rows) => (
            <div className="live-table-wrap">
              <table className="live-table">
                <thead><tr><th>العقار</th><th>النوع</th><th>السعر</th><th>رخصة الإعلان</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {rows.map((l) => {
                    const own = l.created_by === me.id;
                    const canEdit = isAdmin || own;
                    const licensed = l.ad_license_expires_on && l.ad_license_expires_on >= new Date().toISOString().slice(0, 10);
                    return (
                      <tr key={l.id}>
                        <td><strong>{l.title}</strong><small>{l.city}{l.district ? ` · ${l.district}` : ""}{l.area_sqm ? ` · ${l.area_sqm} م²` : ""}</small></td>
                        <td>{PROPERTY_TYPES[l.property_type]}<small>{statusLabel(l.purpose)}</small></td>
                        <td className="num">{sar(l.price_halalas)}</td>
                        <td>{l.ad_license_number ? <>{l.ad_license_number}<small>{licensed ? `حتى ${date(l.ad_license_expires_on)}` : "منتهية"}</small></> : <Badge status="blocked">لا توجد</Badge>}</td>
                        <td><Badge status={l.status} /></td>
                        <td className="live-actions">
                          {canEdit && <button className="live-btn" onClick={() => setEditing(l)}>تعديل</button>}
                          {isAdmin && l.status === "draft" && <button className="live-btn primary" disabled={busy} onClick={() => setListingStatus(l, "published")}>نشر</button>}
                          {canEdit && l.status === "published" && <button className="live-btn" disabled={busy} onClick={() => setListingStatus(l, "draft")}>إلى مسودة</button>}
                          {canEdit && ["published", "reserved"].includes(l.status) && <button className="live-btn" disabled={busy} onClick={() => setListingStatus(l, "sold")}>مباع</button>}
                          {canEdit && l.status !== "archived" && <button className="live-btn" disabled={busy} onClick={() => setListingStatus(l, "archived")}>أرشفة</button>}
                          {isAdmin && (
                            <ConfirmButton disabled={busy} confirmLabel="تأكيد الحذف" onConfirm={() => run(async () => { const r = await api(`/api/listings/${l.id}`, { method: "DELETE" }); await list.reload(); notify(r.status === "deleted" ? "تم الحذف" : "عليه حجوزات؛ أُرشف بدل الحذف"); })}>حذف</ConfirmButton>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Loaded>
      </Panel>
      {editing && (
        <ExperienceDialog title={editing === "new" ? "عقار جديد" : `تعديل: ${editing.title}`} close={() => setEditing(null)} wide>
          <ListingForm
            listing={editing === "new" ? null : editing}
            busy={busy}
            onSave={(payload) =>
              run(async () => {
                if (editing === "new") await api("/api/listings", { method: "POST", body: payload });
                else await api(`/api/listings/${editing.id}`, { method: "PATCH", body: payload });
                setEditing(null);
                await list.reload();
              }, editing === "new" ? "أُضيف العقار كمسودة" : "تم حفظ التعديلات")
            }
          />
        </ExperienceDialog>
      )}
    </>
  );
}

function ListingForm({ listing: l, onSave, busy }) {
  return (
    <Form
      busy={busy}
      onSubmit={(v) =>
        onSave({
          title: v.title, description: opt(v.description), purpose: v.purpose, property_type: v.property_type,
          price_halalas: toHalalas(v.price), city: v.city, district: opt(v.district), area_sqm: num(v.area_sqm),
          bedrooms: num(v.bedrooms), bathrooms: num(v.bathrooms),
          images: v.images ? v.images.split(/\s+/).filter(Boolean) : [],
          ad_license_number: opt(v.ad_license_number), ad_license_expires_on: opt(v.ad_license_expires_on),
          show_on_site: v.show_on_site === "on",
        })
      }
    >
      <Field label="العنوان" wide><input name="title" required minLength={3} maxLength={120} defaultValue={l?.title} /></Field>
      <Field label="الغرض"><select name="purpose" defaultValue={l?.purpose ?? "sale"}><option value="sale">بيع</option><option value="rent">إيجار</option></select></Field>
      <Field label="النوع"><select name="property_type" defaultValue={l?.property_type ?? "apartment"}>{Object.entries(PROPERTY_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
      <Field label="السعر (ر.س)"><input name="price" type="number" min="0" step="0.01" required defaultValue={l ? l.price_halalas / 100 : ""} /></Field>
      <Field label="المدينة"><input name="city" required defaultValue={l?.city} /></Field>
      <Field label="الحي"><input name="district" defaultValue={l?.district ?? ""} /></Field>
      <Field label="المساحة (م²)"><input name="area_sqm" type="number" min="1" step="any" defaultValue={l?.area_sqm ?? ""} /></Field>
      <Field label="غرف النوم"><input name="bedrooms" type="number" min="0" max="50" defaultValue={l?.bedrooms ?? ""} /></Field>
      <Field label="دورات المياه"><input name="bathrooms" type="number" min="0" max="50" defaultValue={l?.bathrooms ?? ""} /></Field>
      <Field label="رقم رخصة الإعلان (هيئة العقار)" hint="مطلوب للنشر"><input name="ad_license_number" pattern="[0-9A-Za-z\-]{4,30}" defaultValue={l?.ad_license_number ?? ""} dir="ltr" /></Field>
      <Field label="تنتهي الرخصة في"><input name="ad_license_expires_on" type="date" defaultValue={l?.ad_license_expires_on ?? ""} /></Field>
      <Field label="روابط الصور (https، مسافة بين كل رابط)" wide hint="رفع الصور إلى تخزين سحابي لم يُبنَ بعد"><input name="images" defaultValue={(l?.images ?? []).join(" ")} dir="ltr" /></Field>
      <Field label="الوصف" wide><textarea name="description" maxLength={5000} defaultValue={l?.description ?? ""} /></Field>
      <Field label="يظهر في الموقع"><input name="show_on_site" type="checkbox" defaultChecked={l?.show_on_site ?? true} /></Field>
    </Form>
  );
}
