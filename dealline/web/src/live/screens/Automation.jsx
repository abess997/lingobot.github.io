import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ExperienceDialog } from "../../app/experience.jsx";
import { api, dateTime, statusLabel, TRIGGERS } from "../api.js";
import { Badge, Field, Form, Loaded, Panel, opt, useAction, useLoad } from "../ui.jsx";

export function AutomationScreen({ notify, isAdmin }) {
  const [tab, setTab] = useState("tasks");
  return (
    <>
      <div className="live-tabs" role="tablist">
        <button role="tab" aria-selected={tab === "tasks"} className={tab === "tasks" ? "active" : ""} onClick={() => setTab("tasks")}>المهام</button>
        {isAdmin && <button role="tab" aria-selected={tab === "rules"} className={tab === "rules" ? "active" : ""} onClick={() => setTab("rules")}>قواعد الأتمتة</button>}
        {isAdmin && <button role="tab" aria-selected={tab === "runs"} className={tab === "runs" ? "active" : ""} onClick={() => setTab("runs")}>سجل التنفيذ</button>}
      </div>
      {tab === "tasks" && <Tasks notify={notify} isAdmin={isAdmin} />}
      {tab === "rules" && <Rules notify={notify} />}
      {tab === "runs" && <Runs />}
    </>
  );
}

function Tasks({ notify, isAdmin }) {
  const [status, setStatus] = useState("open");
  const [mine, setMine] = useState(!isAdmin);
  const tasks = useLoad(() => api(`/api/automation/tasks?${new URLSearchParams({ ...(status && { status }), ...(mine && { mine: "1" }) })}`), [status, mine]);
  const members = useLoad(() => api("/api/members"));
  const [run, busy] = useAction(notify);
  const name = (id) => members.data?.find((m) => m.id === id)?.name ?? "—";
  return (
    <Panel title="المهام" subtitle={isAdmin ? "مهام الفريق؛ الأتمتة تنشئها تلقائيًا" : "مهامك فقط"}>
      <div className="live-inline live-body">
        <div className="crm-filters">
          {["open", "done", "cancelled", ""].map((s) => <button key={s || "all"} className={status === s ? "active" : ""} onClick={() => setStatus(s)}>{s ? statusLabel(s) : "الكل"}</button>)}
        </div>
        {isAdmin && <label className="live-inline"><input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} style={{ minWidth: 0, width: 18 }} /> مهامي فقط</label>}
      </div>
      <Form
        busy={busy}
        submit="إضافة مهمة"
        onSubmit={(v, form) => run(async () => {
          await api("/api/automation/tasks", { method: "POST", body: { title: v.title, due_at: v.due_at ? new Date(v.due_at).toISOString() : null, assigned_to: opt(v.assigned_to) } });
          form.reset();
          await tasks.reload();
        }, "أُضيفت المهمة")}
      >
        <Field label="مهمة جديدة"><input name="title" required maxLength={200} /></Field>
        <Field label="الموعد"><input name="due_at" type="datetime-local" /></Field>
        {isAdmin && (
          <Field label="المسؤول">
            <select name="assigned_to"><option value="">أنا</option>{(members.data ?? []).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
          </Field>
        )}
      </Form>
      <Loaded state={tasks} empty="لا توجد مهام هنا.">
        {(rows) => (
          <div className="live-table-wrap">
            <table className="live-table">
              <thead><tr><th>المهمة</th><th>المسؤول</th><th>الموعد</th><th>المصدر</th><th>الحالة</th><th /></tr></thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id}>
                    <td><strong>{t.title}</strong>{t.description && <small>{t.description}</small>}</td>
                    <td>{name(t.assigned_to)}</td>
                    <td>{dateTime(t.due_at)}</td>
                    <td>{t.rule_id ? <Badge status="channel">أتمتة</Badge> : "يدوي"}</td>
                    <td><Badge status={t.status} /></td>
                    <td className="live-actions">
                      {t.status === "open" && <button className="live-btn primary" disabled={busy} onClick={() => run(async () => { await api(`/api/automation/tasks/${t.id}`, { method: "PATCH", body: { status: "done" } }); await tasks.reload(); }, "أُنجزت المهمة")}>إنجاز</button>}
                      {t.status === "open" && <button className="live-btn" disabled={busy} onClick={() => run(async () => { await api(`/api/automation/tasks/${t.id}`, { method: "PATCH", body: { status: "cancelled" } }); await tasks.reload(); }, "أُلغيت المهمة")}>إلغاء</button>}
                      {t.status !== "open" && <button className="live-btn" disabled={busy} onClick={() => run(async () => { await api(`/api/automation/tasks/${t.id}`, { method: "PATCH", body: { status: "open" } }); await tasks.reload(); }, "أُعيد فتح المهمة")}>إعادة فتح</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Loaded>
    </Panel>
  );
}

const describeAction = (a) =>
  a.type === "create_task" ? `مهمة: «${a.title}» لـ${a.assign_to === "owner" ? "المالك" : a.assign_to === "assignee" ? "المسؤول عن السجل" : "موظف محدد"}${a.due_in_hours != null ? ` خلال ${a.due_in_hours} ساعة` : ""}`
    : a.type === "whatsapp_template" ? `واتساب: قالب ${a.template}${a.params?.length ? ` (${a.params.join("، ")})` : ""}`
      : `بريد إلى ${a.to === "contact" ? "العميل" : "المالكين والمشرفين"}: «${a.subject}»`;

function Rules({ notify }) {
  const rules = useLoad(() => api("/api/automation/rules"));
  const [creating, setCreating] = useState(false);
  const [run, busy] = useAction(notify);
  return (
    <Panel title="قواعد «إذا حدث… فافعل…»" subtitle="كل قاعدة تُنفذ مرة واحدة لكل حدث، ويمكن إيقافها أي وقت" actions={<button className="live-btn primary" onClick={() => setCreating(true)}><Plus size={15} /> قاعدة جديدة</button>}>
      <Loaded state={rules} empty="لا توجد قواعد بعد.">
        {(rows) => (
          <div className="live-table-wrap">
            <table className="live-table">
              <thead><tr><th>القاعدة</th><th>عند</th><th>الشروط</th><th>الإجراءات</th><th>الحالة</th><th /></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.name}</strong></td>
                    <td>{TRIGGERS[r.trigger]}</td>
                    <td>{Object.keys(r.conditions).length ? Object.entries(r.conditions).map(([k, v]) => <small key={k} dir="ltr">{k} = {String(v)}</small>) : "—"}</td>
                    <td>{r.actions.map((a, k) => <small key={k}>{describeAction(a)}</small>)}</td>
                    <td><Badge status={r.active ? "active" : "draft"}>{r.active ? "تعمل" : "موقوفة"}</Badge></td>
                    <td className="live-actions">
                      <button className="live-btn" disabled={busy} onClick={() => run(async () => { await api(`/api/automation/rules/${r.id}`, { method: "PATCH", body: { active: !r.active } }); await rules.reload(); }, r.active ? "أُوقفت القاعدة" : "تعمل القاعدة")}>{r.active ? "إيقاف" : "تشغيل"}</button>
                      <button className="live-btn danger" disabled={busy} onClick={() => window.confirm("حذف القاعدة؟") && run(async () => { await api(`/api/automation/rules/${r.id}`, { method: "DELETE" }); await rules.reload(); }, "حُذفت القاعدة")}>حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Loaded>
      {creating && (
        <ExperienceDialog title="قاعدة أتمتة جديدة" close={() => setCreating(false)} wide>
          <RuleBuilder busy={busy} onSave={(body) => run(async () => { await api("/api/automation/rules", { method: "POST", body }); setCreating(false); await rules.reload(); }, "أُضيفت القاعدة")} />
        </ExperienceDialog>
      )}
    </Panel>
  );
}

function RuleBuilder({ onSave, busy }) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("lead.created");
  const [conds, setConds] = useState([]);
  const [actions, setActions] = useState([{ type: "create_task", title: "تابع {{lead.name}}", assign_to: "assignee", due_in_hours: 4 }]);
  const setA = (k, patch) => setActions(actions.map((a, i) => (i === k ? { ...a, ...patch } : a)));
  const clean = (a) =>
    a.type === "create_task" ? { type: a.type, title: a.title, assign_to: a.assign_to, ...(a.due_in_hours !== "" && a.due_in_hours != null && { due_in_hours: Number(a.due_in_hours) }) }
      : a.type === "whatsapp_template" ? { type: a.type, template: a.template, language: "ar", params: (a.params ?? "").split("|").map((s) => s.trim()).filter(Boolean) }
        : { type: a.type, to: a.to, subject: a.subject, body: a.body };
  return (
    <form
      className="live-form"
      onSubmit={(e) => {
        e.preventDefault();
        const conditions = Object.fromEntries(conds.filter((c) => c.key).map((c) => [c.key, /^\d+$/.test(c.value) ? Number(c.value) : c.value]));
        onSave({ name, trigger, conditions, actions: actions.map(clean) });
      }}
    >
      <div className="live-form-grid">
        <Field label="اسم القاعدة"><input value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} /></Field>
        <Field label="عندما يحدث">
          <select value={trigger} onChange={(e) => setTrigger(e.target.value)}>{Object.entries(TRIGGERS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </Field>
      </div>
      <h4 style={{ margin: "16px 0 8px" }}>الشروط (اختياري، تطابق تام)</h4>
      {conds.map((c, k) => (
        <div className="live-inline" key={k} style={{ marginBottom: 6 }}>
          <input aria-label="الحقل" placeholder="lead.source_channel" dir="ltr" value={c.key} pattern="[a-z_]+(\.[a-z_]+)*" onChange={(e) => setConds(conds.map((x, i) => (i === k ? { ...x, key: e.target.value } : x)))} />
          <span>=</span>
          <input aria-label="القيمة" placeholder="snapchat" dir="ltr" value={c.value} onChange={(e) => setConds(conds.map((x, i) => (i === k ? { ...x, value: e.target.value } : x)))} />
          <button type="button" className="live-btn danger" aria-label="حذف الشرط" onClick={() => setConds(conds.filter((_, i) => i !== k))}><Trash2 size={14} /></button>
        </div>
      ))}
      <button type="button" className="live-btn" onClick={() => setConds([...conds, { key: "", value: "" }])}><Plus size={14} /> شرط</button>
      <h4 style={{ margin: "16px 0 8px" }}>الإجراءات</h4>
      <p className="live-note">متغيرات مثل {"{{lead.name}}"} و{"{{contact.phone}}"} و{"{{deal.unit_code}}"} و{"{{installment.amount_sar}}"} تُستبدل من بيانات الحدث.</p>
      {actions.map((a, k) => (
        <div key={k} className="live-dl" style={{ display: "block", marginBottom: 10 }}>
          <div className="live-form-grid">
            <Field label="النوع">
              <select value={a.type} onChange={(e) => setA(k, { type: e.target.value, ...(e.target.value === "email" && { to: "contact", subject: "", body: "" }), ...(e.target.value === "whatsapp_template" && { template: "", params: "" }), ...(e.target.value === "create_task" && { title: "", assign_to: "assignee" }) })}>
                <option value="create_task">إنشاء مهمة</option><option value="whatsapp_template">قالب واتساب</option><option value="email">بريد إلكتروني</option>
              </select>
            </Field>
            {a.type === "create_task" && (
              <>
                <Field label="عنوان المهمة"><input value={a.title} required onChange={(e) => setA(k, { title: e.target.value })} /></Field>
                <Field label="لمن">
                  <select value={a.assign_to} onChange={(e) => setA(k, { assign_to: e.target.value })}><option value="assignee">المسؤول عن السجل</option><option value="owner">المالك</option></select>
                </Field>
                <Field label="خلال (ساعات)"><input type="number" min="0" max="2160" value={a.due_in_hours ?? ""} onChange={(e) => setA(k, { due_in_hours: e.target.value })} /></Field>
              </>
            )}
            {a.type === "whatsapp_template" && (
              <>
                <Field label="اسم القالب المعتمد"><input value={a.template} required pattern="[a-z0-9_]{1,512}" dir="ltr" onChange={(e) => setA(k, { template: e.target.value })} /></Field>
                <Field label="المتغيرات (افصل بـ |)"><input value={a.params ?? ""} onChange={(e) => setA(k, { params: e.target.value })} placeholder="{{lead.name}}" /></Field>
              </>
            )}
            {a.type === "email" && (
              <>
                <Field label="إلى"><select value={a.to} onChange={(e) => setA(k, { to: e.target.value })}><option value="contact">العميل</option><option value="owners">المالكون والمشرفون</option></select></Field>
                <Field label="العنوان"><input value={a.subject} required onChange={(e) => setA(k, { subject: e.target.value })} /></Field>
                <Field label="النص" wide><textarea value={a.body} required onChange={(e) => setA(k, { body: e.target.value })} /></Field>
              </>
            )}
          </div>
          {actions.length > 1 && <button type="button" className="live-btn danger" style={{ marginTop: 8 }} onClick={() => setActions(actions.filter((_, i) => i !== k))}>حذف الإجراء</button>}
        </div>
      ))}
      <div className="live-form-foot">
        {actions.length < 10 && <button type="button" className="live-btn" onClick={() => setActions([...actions, { type: "create_task", title: "", assign_to: "assignee" }])}><Plus size={14} /> إجراء</button>}
        <button className="primary-action" disabled={busy}>حفظ القاعدة</button>
      </div>
    </form>
  );
}

function Runs() {
  const runs = useLoad(() => api("/api/automation/runs"));
  return (
    <Panel title="سجل التنفيذ" subtitle="كل تشغيل لقاعدة: تم / فشل / تخطي، مع السبب" actions={<button className="live-btn" onClick={runs.reload}>تحديث</button>}>
      <Loaded state={runs} empty="لم تُنفذ أي قاعدة بعد.">
        {(rows) => (
          <div className="live-table-wrap">
            <table className="live-table">
              <thead><tr><th>الوقت</th><th>الحدث</th><th>النتيجة</th><th>التفاصيل</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{dateTime(r.created_at)}</td>
                    <td>{TRIGGERS[r.event_type] ?? r.event_type}</td>
                    <td><Badge status={r.status} /></td>
                    <td><small>{r.detail ?? ""}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Loaded>
    </Panel>
  );
}
