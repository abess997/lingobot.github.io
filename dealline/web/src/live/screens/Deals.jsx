import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { ExperienceDialog } from "../../app/experience.jsx";
import { api, date, dateTime, PLAN_TRIGGERS, sar, statusLabel, today, toHalalas } from "../api.js";
import { Badge, Field, Form, Loaded, Panel, opt, useAction, useLoad } from "../ui.jsx";

const STATUSES = ["", "held", "reserved", "contracted", "defaulted", "handed_over", "cancelled", "transferred"];
const EVENT_LABELS = {
  held: "حجز مؤقت", reserved: "تأكيد الحجز", contracted: "توقيع العقد", handed_over: "التسليم", escrow_receipt: "إيداع في حساب الضمان",
  cancelled: "إلغاء", defaulted: "تعثر", reinstated: "إعادة تفعيل", transferred_out: "تنازل إلى مشترٍ جديد", transferred_in: "انتقال من صفقة سابقة",
  hold_expired: "انتهاء الحجز المؤقت",
};

export function DealsScreen({ notify, isAdmin, focus, go }) {
  const [status, setStatus] = useState("");
  const deals = useLoad(() => api(`/api/offplan/deals${status ? `?status=${status}` : ""}`), [status]);
  const [open, setOpen] = useState(focus?.deal ?? null);
  const [creating, setCreating] = useState(focus?.newDealProject ? { project: focus.newDealProject } : null);
  const [run, busy] = useAction(notify);

  if (open) return <DealDetail id={open} back={() => { setOpen(null); deals.reload(); }} open={setOpen} notify={notify} isAdmin={isAdmin} />;

  return (
    <>
      <Panel
        title="صفقات البيع على الخارطة"
        subtitle="حجز مؤقت ← دفعة الحجز في حساب الضمان ← تأكيد ← عقد ← تسليم. صفقة مفتوحة واحدة فقط لكل وحدة."
        actions={<button className="live-btn primary" onClick={() => setCreating({})}><Plus size={15} /> حجز وحدة</button>}
      >
        <div className="crm-filters live-body">
          {STATUSES.map((s) => <button key={s || "all"} className={status === s ? "active" : ""} onClick={() => setStatus(s)}>{s ? statusLabel(s) : "الكل"}</button>)}
        </div>
        <Loaded state={deals} empty="لا توجد صفقات بهذا الفلتر.">
          {(rows) => (
            <div className="live-table-wrap">
              <table className="live-table">
                <thead><tr><th>المشتري</th><th>الوحدة</th><th>السعر</th><th>المحصّل</th><th>المتأخر</th><th>الحالة</th></tr></thead>
                <tbody>
                  {rows.map((d) => (
                    <tr key={d.id} className="clickable" tabIndex={0} onClick={() => setOpen(d.id)} onKeyDown={(e) => e.key === "Enter" && setOpen(d.id)}>
                      <td><strong>{d.buyer_name}</strong><small dir="ltr" style={{ textAlign: "right" }}>{d.buyer_phone}</small></td>
                      <td>{d.unit_code}<small>{d.project_name}</small></td>
                      <td className="num">{sar(d.price_halalas)}</td>
                      <td className="num">{sar(d.paid_halalas)}</td>
                      <td className="num">{d.overdue_halalas ? <Badge status="overdue">{sar(d.overdue_halalas)}</Badge> : "—"}</td>
                      <td><Badge status={d.status} />{d.status === "held" && <small>ينتهي {dateTime(d.hold_expires_at)}</small>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Loaded>
      </Panel>
      {creating && (
        <ExperienceDialog title="حجز مؤقت لوحدة" close={() => setCreating(null)} wide>
          <NewDeal
            initialProject={creating.project}
            busy={busy}
            onSave={(body) => run(async () => { const r = await api("/api/offplan/deals", { method: "POST", body }); setCreating(null); setOpen(r.id); }, "تم الحجز المؤقت. سجّل دفعة الحجز عند وصولها لحساب الضمان.")}
          />
        </ExperienceDialog>
      )}
    </>
  );
}

function NewDeal({ initialProject, onSave, busy }) {
  const projects = useLoad(() => api("/api/offplan/projects"));
  const [pid, setPid] = useState(initialProject ?? "");
  const units = useLoad(() => (pid ? api(`/api/offplan/projects/${pid}/units`) : []), [pid]);
  const plans = useLoad(() => (pid ? api(`/api/offplan/projects/${pid}/plans`) : []), [pid]);
  const leads = useLoad(() => api("/api/leads"));
  const selling = (projects.data ?? []).filter((p) => p.status === "selling");
  return (
    <Form
      busy={busy}
      submit="تأكيد الحجز المؤقت"
      onSubmit={(v) => onSave({ unit_id: v.unit_id, plan_id: v.plan_id, buyer_name: v.buyer_name, buyer_phone: v.buyer_phone, buyer_email: opt(v.buyer_email), lead_id: opt(v.lead_id) })}
    >
      <Field label="المشروع">
        <select value={pid} onChange={(e) => setPid(e.target.value)} required>
          <option value="">اختر مشروعًا متاحًا للبيع</option>
          {selling.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.units_available} متاحة)</option>)}
        </select>
      </Field>
      <Field label="الوحدة">
        <select name="unit_id" required disabled={!pid}>
          {(units.data ?? []).filter((u) => u.status === "available").map((u) => <option key={u.id} value={u.id}>{u.code} · {u.area_sqm} م² · {sar(u.price_halalas)}</option>)}
        </select>
      </Field>
      <Field label="خطة الدفع">
        <select name="plan_id" required disabled={!pid}>
          {(plans.data ?? []).filter((p) => p.active).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </Field>
      <Field label="ربط بعميل محتمل (اختياري)">
        <select name="lead_id">
          <option value="">بدون</option>
          {(leads.data ?? []).map((l) => <option key={l.id} value={l.id}>{l.name} · {l.phone}</option>)}
        </select>
      </Field>
      <Field label="اسم المشتري"><input name="buyer_name" required maxLength={120} /></Field>
      <Field label="جوال المشتري"><input name="buyer_phone" required placeholder="05xxxxxxxx" dir="ltr" /></Field>
      <Field label="البريد (اختياري)"><input name="buyer_email" type="email" dir="ltr" /></Field>
    </Form>
  );
}

function DealDetail({ id, back, open, notify, isAdmin }) {
  const deal = useLoad(() => api(`/api/offplan/deals/${id}`), [id]);
  const [dialog, setDialog] = useState(null);
  const [run, busy] = useAction(notify);
  const act = (path, body, msg) => run(async () => { const r = await api(`/api/offplan/deals/${id}/${path}`, { method: "POST", body }); setDialog(null); await deal.reload(); return r; }, msg);

  return (
    <>
      <button className="live-btn" onClick={back} style={{ marginBottom: 12 }}><ArrowRight size={15} /> كل الصفقات</button>
      <Loaded state={deal}>
        {(d) => {
          const overdue = d.installments.some((i) => i.status === "overdue");
          return (
            <>
              <Panel
                title={`${d.buyer_name} — ${d.unit_code}`}
                subtitle={d.project_name}
                actions={
                  <>
                    <Badge status={d.status} />
                    {d.status === "held" && <button className="live-btn primary" disabled={busy} onClick={() => act("reserve", {}, "تأكد الحجز")}>تأكيد الحجز</button>}
                    {d.status === "reserved" && <button className="live-btn primary" onClick={() => setDialog("contract")}>توقيع العقد</button>}
                    {d.status === "contracted" && <button className="live-btn primary" onClick={() => setDialog("handover")}>تسليم الوحدة</button>}
                    {isAdmin && d.status === "contracted" && <button className="live-btn" onClick={() => setDialog("transfer")}>تنازل</button>}
                    {isAdmin && ["reserved", "contracted"].includes(d.status) && <button className="live-btn" disabled={!overdue} title={overdue ? "" : "يتطلب دفعة متأخرة"} onClick={() => setDialog("default")}>تسجيل تعثر</button>}
                    {isAdmin && d.status === "defaulted" && <button className="live-btn" onClick={() => setDialog("reinstate")}>إعادة تفعيل</button>}
                    {isAdmin && ["held", "reserved", "contracted", "defaulted"].includes(d.status) && <button className="live-btn danger" onClick={() => setDialog("cancel")}>إلغاء</button>}
                  </>
                }
              >
                <dl className="live-dl live-body">
                  <div><dt>السعر المثبّت</dt><dd>{sar(d.price_halalas)}</dd></div>
                  <div><dt>جوال المشتري</dt><dd dir="ltr">{d.buyer_phone}</dd></div>
                  <div><dt>العقد</dt><dd>{d.contract_ref ?? "—"} <small>{date(d.contract_signed_on)}</small></dd></div>
                  <div><dt>حساب الضمان</dt><dd dir="ltr">{d.escrow_iban ?? "—"}</dd></div>
                  {d.hold_expires_at && <div><dt>ينتهي الحجز المؤقت</dt><dd>{dateTime(d.hold_expires_at)}</dd></div>}
                  {d.transferred_from && <div><dt>منقولة من</dt><dd><button className="live-btn" onClick={() => open(d.transferred_from)}>الصفقة السابقة</button></dd></div>}
                </dl>
                <p className="live-note">أموال المشتري تذهب لحساب الضمان مباشرة ولا تمر عبر ديل لاين؛ هنا يُسجل كل تحويل يظهر في كشف البنك.</p>
              </Panel>
              <Panel title="جدول الدفعات" subtitle="المستحق يتحدد بالعقد وتقارير الإنجاز؛ المهمة اليومية تعلّم المتأخر">
                <div className="live-table-wrap">
                  <table className="live-table">
                    <thead><tr><th>الدفعة</th><th>الاستحقاق</th><th>المبلغ</th><th>المسدد</th><th>الحالة</th><th /></tr></thead>
                    <tbody>
                      {d.installments.map((i) => (
                        <tr key={i.id}>
                          <td><strong>{i.label}</strong><small>{PLAN_TRIGGERS[i.trigger]}{i.at_progress_pct ? ` ${i.at_progress_pct}%` : ""}</small></td>
                          <td>{date(i.due_on)}</td>
                          <td className="num">{sar(i.amount_halalas)}</td>
                          <td className="num">{sar(i.paid_halalas)}</td>
                          <td><Badge status={i.status} /></td>
                          <td>{isAdmin && !["paid", "waived", "cancelled"].includes(i.status) && ["held", "reserved", "contracted", "defaulted"].includes(d.status) && <button className="live-btn" onClick={() => setDialog({ receipt: i })}>تسجيل إيداع</button>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
              <div className="live-grid-2">
                <Panel title="إيداعات حساب الضمان">
                  <ul className="live-timeline live-body">
                    {d.receipts.map((r) => <li key={r.id}>{sar(r.amount_halalas)} <small>{date(r.received_on)} · مرجع {r.bank_ref}</small></li>)}
                    {!d.receipts.length && <li>لا توجد إيداعات بعد.</li>}
                  </ul>
                </Panel>
                <Panel title="سجل الصفقة" subtitle="كل خطوة واستثناء مسجّل مع السبب">
                  <ul className="live-timeline live-body">
                    {d.events.map((e, k) => <li key={k}>{EVENT_LABELS[e.type] ?? e.type} <small>{dateTime(e.created_at)}{e.note ? ` · ${e.note}` : ""}</small></li>)}
                  </ul>
                </Panel>
              </div>
            </>
          );
        }}
      </Loaded>

      {dialog?.receipt && (
        <ExperienceDialog title={`إيداع: ${dialog.receipt.label}`} close={() => setDialog(null)}>
          <p className="live-note">المتبقي {sar(dialog.receipt.amount_halalas - dialog.receipt.paid_halalas)}. يُسمح بالسداد الجزئي، ويُرفض المبلغ الزائد ومرجع البنك المكرر.</p>
          <Form busy={busy} onSubmit={(v) => run(async () => { const r = await api(`/api/offplan/installments/${dialog.receipt.id}/receipts`, { method: "POST", body: { amount_halalas: toHalalas(v.amount), received_on: v.received_on, bank_ref: v.bank_ref } }); setDialog(null); await deal.reload(); notify(r.status === "paid" ? "سُددت الدفعة بالكامل" : `سُجل الإيداع · المتبقي ${sar(r.remaining_halalas)}`); })}>
            <Field label="المبلغ (ر.س)"><input name="amount" type="number" min="0.01" step="0.01" required defaultValue={(dialog.receipt.amount_halalas - dialog.receipt.paid_halalas) / 100} /></Field>
            <Field label="تاريخ الإيداع"><input name="received_on" type="date" required max={today()} defaultValue={today()} /></Field>
            <Field label="مرجع التحويل البنكي"><input name="bank_ref" required minLength={3} dir="ltr" /></Field>
          </Form>
        </ExperienceDialog>
      )}
      {dialog === "contract" && (
        <ExperienceDialog title="توقيع العقد" close={() => setDialog(null)}>
          <Form busy={busy} onSubmit={(v) => act("contract", v, "سُجل العقد وتحددت مواعيد الدفعات")}>
            <Field label="رقم العقد"><input name="contract_ref" required minLength={3} dir="ltr" /></Field>
            <Field label="تاريخ التوقيع"><input name="signed_on" type="date" required max={today()} defaultValue={today()} /></Field>
          </Form>
        </ExperienceDialog>
      )}
      {dialog === "handover" && (
        <ExperienceDialog title="تسليم الوحدة" close={() => setDialog(null)}>
          <p className="live-note">يتطلب إنجاز المشروع 100% وعدم وجود دفعات غير مسددة.</p>
          <Form busy={busy} onSubmit={(v) => act("handover", v, "تم تسليم الوحدة")}>
            <Field label="تاريخ التسليم"><input name="handed_over_on" type="date" required max={today()} defaultValue={today()} /></Field>
          </Form>
        </ExperienceDialog>
      )}
      {["cancel", "default", "reinstate"].includes(dialog) && (
        <ExperienceDialog title={{ cancel: "إلغاء الصفقة", default: "تسجيل تعثر", reinstate: "إعادة تفعيل الصفقة" }[dialog]} close={() => setDialog(null)}>
          <p className="live-note warn">شروط الإشعار والغرامات ومواعيد الاسترداد تحددها لوائح وافي والعقد الموقع؛ النظام يسجل الخطوة وترتيبها فقط.</p>
          <Form
            busy={busy}
            submit="تأكيد"
            onSubmit={async (v) => {
              const r = await act(dialog, { reason: v.reason }, null);
              if (r) notify(dialog === "cancel" ? `أُلغيت الصفقة · مبلغ في حساب الضمان للاسترداد: ${sar(r.paid_to_escrow_halalas)}` : "تم");
            }}
          >
            <Field label="السبب (إلزامي)" wide><textarea name="reason" required minLength={5} maxLength={1000} /></Field>
          </Form>
        </ExperienceDialog>
      )}
      {dialog === "transfer" && (
        <ExperienceDialog title="تنازل لمشترٍ جديد" close={() => setDialog(null)} wide>
          <p className="live-note">تُنشأ صفقة جديدة متعاقدة تحمل الرصيد غير المسدد فقط؛ المدفوعات تبقى في الصفقة الأصلية كسجل.</p>
          <Form busy={busy} onSubmit={(v) => run(async () => { const r = await api(`/api/offplan/deals/${id}/transfer`, { method: "POST", body: { ...v, buyer_email: opt(v.buyer_email) } }); setDialog(null); open(r.to); }, "تم التنازل")}>
            <Field label="اسم المشتري الجديد"><input name="buyer_name" required /></Field>
            <Field label="الجوال"><input name="buyer_phone" required dir="ltr" placeholder="05xxxxxxxx" /></Field>
            <Field label="البريد"><input name="buyer_email" type="email" dir="ltr" /></Field>
            <Field label="رقم العقد الجديد"><input name="contract_ref" required minLength={3} dir="ltr" /></Field>
            <Field label="تاريخ التوقيع"><input name="signed_on" type="date" required max={today()} defaultValue={today()} /></Field>
            <Field label="السبب" wide><textarea name="reason" required minLength={5} /></Field>
          </Form>
        </ExperienceDialog>
      )}
    </>
  );
}
