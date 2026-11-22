import { useState } from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { ExperienceDialog } from "../../app/experience.jsx";
import { api, date, PLAN_TRIGGERS, sar, statusLabel, toHalalas, today, UNIT_TYPES } from "../api.js";
import { Badge, Field, Form, Loaded, Panel, num, opt, useAction, useLoad } from "../ui.jsx";

export function ProjectsScreen({ notify, isAdmin, go, focus }) {
  const projects = useLoad(() => api("/api/offplan/projects"));
  const [selected, setSelected] = useState(focus?.project ?? null);
  const [creating, setCreating] = useState(false);
  const [run, busy] = useAction(notify);

  if (selected)
    return <ProjectDetail id={selected} back={() => { setSelected(null); projects.reload(); }} notify={notify} isAdmin={isAdmin} go={go} />;

  return (
    <>
      <Panel
        title="مشاريع البيع على الخارطة"
        subtitle="لا يُطرح المشروع للبيع بدون ترخيص وافي وحساب ضمان ورخصة إعلان سارية"
        actions={isAdmin && <button className="live-btn primary" onClick={() => setCreating(true)}><Plus size={15} /> مشروع جديد</button>}
      >
        <Loaded state={projects} empty="لا توجد مشاريع بعد.">
          {(rows) => (
            <div className="live-table-wrap">
              <table className="live-table">
                <thead><tr><th>المشروع</th><th>الإنجاز</th><th>الوحدات</th><th>وافي</th><th>التسليم المتوقع</th><th>الحالة</th></tr></thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id} className="clickable" tabIndex={0} onClick={() => setSelected(p.id)} onKeyDown={(e) => e.key === "Enter" && setSelected(p.id)}>
                      <td><strong>{p.name}</strong><small>{p.city}{p.district ? ` · ${p.district}` : ""}</small></td>
                      <td style={{ minWidth: 120 }}><div className="live-progress" aria-label={`الإنجاز ${p.progress_pct}%`}><i style={{ width: `${p.progress_pct}%` }} /></div><small>{p.progress_pct}%</small></td>
                      <td>{p.units_available} متاحة<small>من {p.units_total}</small></td>
                      <td dir="ltr" style={{ textAlign: "right" }}>{p.wafi_license_number ?? "—"}</td>
                      <td>{date(p.expected_handover_on)}</td>
                      <td><Badge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Loaded>
      </Panel>
      {creating && (
        <ExperienceDialog title="مشروع على الخارطة" close={() => setCreating(false)} wide>
          <ProjectForm busy={busy} onSave={(body) => run(async () => { const r = await api("/api/offplan/projects", { method: "POST", body }); setCreating(false); setSelected(r.id); }, "أُنشئ المشروع كمسودة")} />
        </ExperienceDialog>
      )}
    </>
  );
}

function ProjectForm({ project: p, onSave, busy }) {
  return (
    <Form
      busy={busy}
      onSubmit={(v) =>
        onSave({
          name: v.name, description: opt(v.description), city: v.city, district: opt(v.district),
          wafi_license_number: opt(v.wafi_license_number), escrow_bank: opt(v.escrow_bank), escrow_iban: opt(v.escrow_iban),
          ad_license_number: opt(v.ad_license_number), ad_license_expires_on: opt(v.ad_license_expires_on),
          expected_handover_on: opt(v.expected_handover_on), hold_days: Number(v.hold_days || 3), show_on_site: v.show_on_site === "on",
        })
      }
    >
      <Field label="اسم المشروع" wide><input name="name" required minLength={2} defaultValue={p?.name} /></Field>
      <Field label="المدينة"><input name="city" required defaultValue={p?.city} /></Field>
      <Field label="الحي"><input name="district" defaultValue={p?.district ?? ""} /></Field>
      <Field label="رقم ترخيص وافي"><input name="wafi_license_number" pattern="[0-9A-Za-z\-]{3,30}" defaultValue={p?.wafi_license_number ?? ""} dir="ltr" /></Field>
      <Field label="بنك حساب الضمان"><input name="escrow_bank" defaultValue={p?.escrow_bank ?? ""} /></Field>
      <Field label="IBAN حساب الضمان" hint="SA + 22 رقمًا"><input name="escrow_iban" defaultValue={p?.escrow_iban ?? ""} dir="ltr" /></Field>
      <Field label="رخصة الإعلان"><input name="ad_license_number" pattern="[0-9A-Za-z\-]{4,30}" defaultValue={p?.ad_license_number ?? ""} dir="ltr" /></Field>
      <Field label="تنتهي الرخصة"><input name="ad_license_expires_on" type="date" defaultValue={p?.ad_license_expires_on ?? ""} /></Field>
      <Field label="التسليم المتوقع"><input name="expected_handover_on" type="date" defaultValue={p?.expected_handover_on ?? ""} /></Field>
      <Field label="مدة الحجز المؤقت (أيام)"><input name="hold_days" type="number" min="1" max="30" defaultValue={p?.hold_days ?? 3} /></Field>
      <Field label="الوصف" wide><textarea name="description" defaultValue={p?.description ?? ""} /></Field>
      <Field label="يظهر في الموقع"><input name="show_on_site" type="checkbox" defaultChecked={p?.show_on_site ?? true} /></Field>
    </Form>
  );
}

function ProjectDetail({ id, back, notify, isAdmin, go }) {
  const all = useLoad(() => api("/api/offplan/projects"), [id]);
  const units = useLoad(() => api(`/api/offplan/projects/${id}/units`), [id]);
  const plans = useLoad(() => api(`/api/offplan/projects/${id}/plans`), [id]);
  const dash = useLoad(() => (isAdmin ? api(`/api/offplan/dashboard?project_id=${id}`) : null), [id, isAdmin]);
  const [dialog, setDialog] = useState(null); // edit | units | plan | progress
  const [run, busy] = useAction(notify);
  const reloadAll = () => Promise.all([all.reload(), units.reload(), plans.reload(), dash.reload()]);
  const setStatus = (status) => run(async () => { await api(`/api/offplan/projects/${id}/status`, { method: "POST", body: { status } }); await reloadAll(); }, `حالة المشروع: ${statusLabel(status)}`);

  return (
    <>
      <button className="live-btn" onClick={back} style={{ marginBottom: 12 }}><ArrowRight size={15} /> كل المشاريع</button>
      <Loaded state={all}>
        {(rows) => {
          const p = rows.find((x) => x.id === id);
          if (!p) return <p>المشروع غير موجود.</p>;
          return (
            <Panel
              title={p.name}
              subtitle={`${p.city}${p.district ? ` · ${p.district}` : ""}`}
              actions={
                <>
                  <Badge status={p.status} />
                  {isAdmin && (
                    <>
                      {p.status !== "selling" && <button className="live-btn primary" disabled={busy} onClick={() => setStatus("selling")}>طرح للبيع</button>}
                      {p.status === "selling" && <button className="live-btn" disabled={busy} onClick={() => setStatus("sold_out")}>مباع بالكامل</button>}
                      {p.status !== "completed" && <button className="live-btn" disabled={busy} onClick={() => setStatus("completed")}>اكتمل</button>}
                      <button className="live-btn" onClick={() => setDialog({ kind: "progress", p })}>تقرير إنجاز</button>
                      <button className="live-btn" onClick={() => setDialog({ kind: "edit", p })}>تعديل</button>
                    </>
                  )}
                </>
              }
            >
              <dl className="live-dl live-body">
                <div><dt>نسبة الإنجاز</dt><dd>{p.progress_pct}%<div className="live-progress"><i style={{ width: `${p.progress_pct}%` }} /></div></dd></div>
                <div><dt>ترخيص وافي</dt><dd dir="ltr">{p.wafi_license_number ?? "غير مدخل"}</dd></div>
                <div><dt>حساب الضمان</dt><dd dir="ltr">{p.escrow_iban ?? "غير مدخل"}</dd></div>
                <div><dt>رخصة الإعلان</dt><dd>{p.ad_license_number ?? "—"} <small>{date(p.ad_license_expires_on)}</small></dd></div>
                <div><dt>التسليم المتوقع</dt><dd>{date(p.expected_handover_on)}</dd></div>
                <div><dt>مدة الحجز المؤقت</dt><dd>{p.hold_days} أيام</dd></div>
                {dash.data && (
                  <>
                    <div><dt>قيمة المبيعات</dt><dd>{sar(dash.data.sold_value_halalas)}</dd></div>
                    <div><dt>المحصّل (ضمان)</dt><dd>{sar(dash.data.collected_halalas)} <small>{dash.data.collection_pct}%</small></dd></div>
                    <div><dt>المتأخرات</dt><dd>{sar(dash.data.overdue_outstanding_halalas)}</dd></div>
                  </>
                )}
              </dl>
            </Panel>
          );
        }}
      </Loaded>
      <Panel
        title="الوحدات"
        subtitle="السعر يُثبَّت في الصفقة لحظة الحجز المؤقت"
        actions={
          <>
            <button className="live-btn primary" onClick={() => go("deals", { newDealProject: id })}>حجز وحدة لعميل</button>
            {isAdmin && <button className="live-btn" onClick={() => setDialog({ kind: "units" })}><Plus size={15} /> إضافة وحدات</button>}
          </>
        }
      >
        <Loaded state={units} empty="لا توجد وحدات. أضف وحدة أو دفعة وحدات (مثل A-101 … A-120).">
          {(rows) => (
            <div className="live-table-wrap">
              <table className="live-table">
                <thead><tr><th>الوحدة</th><th>النوع</th><th>المساحة</th><th>السعر</th><th>الحالة</th><th>الصفقة</th><th /></tr></thead>
                <tbody>
                  {rows.map((u) => (
                    <tr key={u.id}>
                      <td><strong>{u.code}</strong><small>{u.building ? `مبنى ${u.building}` : ""}{u.floor != null ? ` · دور ${u.floor}` : ""}</small></td>
                      <td>{UNIT_TYPES[u.unit_type]}<small>{u.bedrooms != null ? `${u.bedrooms} غرف` : ""}</small></td>
                      <td className="num">{u.area_sqm} م²</td>
                      <td className="num">{sar(u.price_halalas)}</td>
                      <td><Badge status={u.status} /></td>
                      <td>{u.deal_id ? <button className="live-btn" onClick={() => go("deals", { deal: u.deal_id })}>{u.buyer_name} · {statusLabel(u.deal_status)}</button> : "—"}</td>
                      <td>
                        {isAdmin && ["available", "blocked"].includes(u.status) && (
                          <button className="live-btn" disabled={busy} onClick={() => run(async () => { await api(`/api/offplan/units/${u.id}`, { method: "PATCH", body: { status: u.status === "available" ? "blocked" : "available" } }); await units.reload(); }, "تم تحديث الوحدة")}>
                            {u.status === "available" ? "إيقاف" : "إتاحة"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Loaded>
      </Panel>
      <Panel title="خطط الدفع" subtitle="مجموع النسب يجب أن يساوي 100% بالضبط؛ تُقسم المبالغ حتى الهللة" actions={isAdmin && <button className="live-btn" onClick={() => setDialog({ kind: "plan" })}><Plus size={15} /> خطة جديدة</button>}>
        <Loaded state={plans} empty="لا توجد خطط دفع؛ الحجز يحتاج خطة مفعلة.">
          {(rows) => (
            <div className="live-grid-2 live-body">
              {rows.map((pl) => (
                <article key={pl.id} className="live-dl" style={{ display: "block" }}>
                  <div>
                    <dt>{pl.active ? "مفعلة" : "متوقفة"}</dt>
                    <dd>{pl.name}</dd>
                    <ul className="live-timeline" style={{ marginTop: 8 }}>
                      {pl.items.map((i) => (
                        <li key={i.seq}>{i.label} — {i.share_bp / 100}% <small>{PLAN_TRIGGERS[i.trigger]}{i.days_after_contract ? ` (${i.days_after_contract} يوم)` : ""}{i.at_progress_pct ? ` (${i.at_progress_pct}%)` : ""}</small></li>
                      ))}
                    </ul>
                    {isAdmin && pl.active && (
                      <button className="live-btn danger" style={{ marginTop: 8 }} disabled={busy} onClick={() => run(async () => { await api(`/api/offplan/plans/${pl.id}/deactivate`, { method: "POST" }); await plans.reload(); }, "أُوقفت الخطة")}>إيقاف الخطة</button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Loaded>
      </Panel>

      {dialog?.kind === "edit" && (
        <ExperienceDialog title="تعديل المشروع" close={() => setDialog(null)} wide>
          <ProjectForm project={dialog.p} busy={busy} onSave={(body) => run(async () => { await api(`/api/offplan/projects/${id}`, { method: "PATCH", body }); setDialog(null); await reloadAll(); }, "تم الحفظ")} />
        </ExperienceDialog>
      )}
      {dialog?.kind === "progress" && (
        <ExperienceDialog title="تقرير إنجاز من الاستشاري" close={() => setDialog(null)}>
          <p className="live-note">الإنجاز لا ينقص. دفعات «عند نسبة إنجاز» للعقود الموقعة تصبح مستحقة بتاريخ التقرير، ودفعة التسليم عند 100%.</p>
          <Form
            busy={busy}
            onSubmit={(v) => run(async () => { const r = await api(`/api/offplan/projects/${id}/progress`, { method: "POST", body: { pct: Number(v.pct), report_ref: v.report_ref, reported_on: v.reported_on } }); setDialog(null); await reloadAll(); notify(`الإنجاز ${r.progress_pct}% · ${r.installments_now_due} دفعة أصبحت مستحقة`); })}
          >
            <Field label="نسبة الإنجاز %"><input name="pct" type="number" min={dialog.p.progress_pct} max="100" step="0.1" required defaultValue={dialog.p.progress_pct} /></Field>
            <Field label="مرجع التقرير"><input name="report_ref" required /></Field>
            <Field label="تاريخ التقرير"><input name="reported_on" type="date" required max={today()} defaultValue={today()} /></Field>
          </Form>
        </ExperienceDialog>
      )}
      {dialog?.kind === "units" && (
        <ExperienceDialog title="إضافة وحدات" close={() => setDialog(null)} wide>
          <UnitsForm busy={busy} onSave={(body) => run(async () => { const r = await api(`/api/offplan/projects/${id}/units`, { method: "POST", body }); setDialog(null); await units.reload(); notify(`أُضيفت ${r.length} وحدة`); })} />
        </ExperienceDialog>
      )}
      {dialog?.kind === "plan" && (
        <ExperienceDialog title="خطة دفع جديدة" close={() => setDialog(null)} wide>
          <PlanBuilder busy={busy} onSave={(body) => run(async () => { await api(`/api/offplan/projects/${id}/plans`, { method: "POST", body }); setDialog(null); await plans.reload(); }, "أُضيفت الخطة")} />
        </ExperienceDialog>
      )}
    </>
  );
}

function UnitsForm({ onSave, busy }) {
  const [bulk, setBulk] = useState(true);
  return (
    <>
      <div className="live-tabs">
        <button className={bulk ? "active" : ""} onClick={() => setBulk(true)}>دفعة وحدات</button>
        <button className={!bulk ? "active" : ""} onClick={() => setBulk(false)}>وحدة واحدة</button>
      </div>
      <Form
        busy={busy}
        onSubmit={(v) => {
          const base = { unit_type: v.unit_type, building: opt(v.building), floor: num(v.floor), area_sqm: Number(v.area_sqm), bedrooms: num(v.bedrooms), price_halalas: toHalalas(v.price) };
          onSave(bulk ? { ...base, bulk: { prefix: v.prefix, from: Number(v.from), count: Number(v.count) } } : { ...base, code: v.code });
        }}
      >
        {bulk ? (
          <>
            <Field label="البادئة" hint="مثال: A-"><input name="prefix" maxLength={10} defaultValue="B-" dir="ltr" /></Field>
            <Field label="من رقم"><input name="from" type="number" min="0" required defaultValue={101} /></Field>
            <Field label="العدد"><input name="count" type="number" min="1" max="500" required defaultValue={10} /></Field>
          </>
        ) : (
          <Field label="رمز الوحدة"><input name="code" required maxLength={30} dir="ltr" /></Field>
        )}
        <Field label="النوع"><select name="unit_type">{Object.entries(UNIT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
        <Field label="المبنى"><input name="building" maxLength={30} /></Field>
        <Field label="الدور"><input name="floor" type="number" min="-5" max="200" /></Field>
        <Field label="المساحة (م²)"><input name="area_sqm" type="number" min="1" step="any" required /></Field>
        <Field label="غرف النوم"><input name="bedrooms" type="number" min="0" max="20" /></Field>
        <Field label="السعر (ر.س)"><input name="price" type="number" min="1" step="0.01" required /></Field>
      </Form>
    </>
  );
}

function PlanBuilder({ onSave, busy }) {
  const [items, setItems] = useState([
    { label: "دفعة الحجز", pct: 10, trigger: "on_booking" },
    { label: "عند العقد", pct: 20, trigger: "on_contract" },
    { label: "عند التسليم", pct: 70, trigger: "on_handover" },
  ]);
  const [name, setName] = useState("");
  const total = items.reduce((s, i) => s + Number(i.pct || 0), 0);
  const set = (k, patch) => setItems(items.map((it, i) => (i === k ? { ...it, ...patch } : it)));
  return (
    <form
      className="live-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          name,
          items: items.map((i) => ({
            label: i.label, share_bp: Math.round(Number(i.pct) * 100), trigger: i.trigger,
            ...(i.trigger === "after_days" && { days_after_contract: Number(i.extra) }),
            ...(i.trigger === "at_progress" && { at_progress_pct: Number(i.extra) }),
          })),
        });
      }}
    >
      <Field label="اسم الخطة"><input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} /></Field>
      <div className="live-table-wrap" style={{ marginTop: 12 }}>
        <table className="live-table">
          <thead><tr><th>الدفعة</th><th>النسبة %</th><th>الاستحقاق</th><th>أيام / إنجاز %</th><th /></tr></thead>
          <tbody>
            {items.map((it, k) => (
              <tr key={k}>
                <td><input aria-label="اسم الدفعة" className="live-inline" value={it.label} required onChange={(e) => set(k, { label: e.target.value })} /></td>
                <td><input aria-label="النسبة" type="number" min="0.01" max="100" step="0.01" value={it.pct} required onChange={(e) => set(k, { pct: e.target.value })} style={{ width: 90 }} /></td>
                <td>
                  <select aria-label="الاستحقاق" value={it.trigger} onChange={(e) => set(k, { trigger: e.target.value })}>
                    {Object.entries(PLAN_TRIGGERS).map(([t, l]) => <option key={t} value={t}>{l}</option>)}
                  </select>
                </td>
                <td>{["after_days", "at_progress"].includes(it.trigger) ? <input aria-label="القيمة" type="number" min="1" max={it.trigger === "at_progress" ? 100 : 3650} required value={it.extra ?? ""} onChange={(e) => set(k, { extra: e.target.value })} style={{ width: 90 }} /> : "—"}</td>
                <td><button type="button" className="live-btn danger" aria-label="حذف الدفعة" onClick={() => setItems(items.filter((_, i) => i !== k))}><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="live-form-foot">
        <button type="button" className="live-btn" onClick={() => setItems([...items, { label: "دفعة", pct: 0, trigger: "after_days", extra: 90 }])}><Plus size={14} /> دفعة</button>
        <span className={`live-badge ${Math.abs(total - 100) < 0.001 ? "s-active" : "s-overdue"}`}>المجموع {total.toFixed(2)}%</span>
        <button className="primary-action" disabled={busy || Math.abs(total - 100) > 0.001 || !items.length}>حفظ الخطة</button>
      </div>
    </form>
  );
}
