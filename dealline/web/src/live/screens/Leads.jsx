import { useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { ExperienceDialog } from "../../app/experience.jsx";
import { api, CHANNELS, dateTime, statusLabel } from "../api.js";
import { Badge, Field, Form, Loaded, Panel, useAction, useLoad } from "../ui.jsx";

const STATUSES = ["new", "contacted", "qualified", "won", "lost"];

export function LeadsScreen({ me, notify, isAdmin }) {
  const leads = useLoad(() => api("/api/leads"));
  const members = useLoad(() => api("/api/members"));
  const [filter, setFilter] = useState("");
  const [chat, setChat] = useState(null);
  const [run, busy] = useAction(notify);
  const update = (l, body, msg) => run(async () => { await api(`/api/leads/${l.id}`, { method: "PATCH", body }); await leads.reload(); }, msg);

  return (
    <>
      <Panel title="العملاء المحتملون" subtitle={isAdmin ? "كل عملاء الجهة؛ وزّعهم على الفريق" : "العملاء المسندون لك فقط"}>
        <div className="crm-filters live-body">
          {["", ...STATUSES].map((s) => <button key={s || "all"} className={filter === s ? "active" : ""} onClick={() => setFilter(s)}>{s ? statusLabel(s) : "الكل"}</button>)}
        </div>
        <Loaded state={leads} empty={isAdmin ? "لا يوجد عملاء بعد. نماذج الموقع تضيفهم هنا تلقائيًا." : "لا يوجد عملاء مسندون لك بعد."}>
          {(rows) => {
            const shown = rows.filter((l) => !filter || l.status === filter);
            return (
              <div className="live-table-wrap">
                <table className="live-table">
                  <thead><tr><th>العميل</th><th>الاهتمام</th><th>المصدر</th><th>الحالة</th><th>المسؤول</th><th /></tr></thead>
                  <tbody>
                    {shown.map((l) => (
                      <tr key={l.id}>
                        <td><strong>{l.name}</strong><small dir="ltr" style={{ textAlign: "right" }}>{l.phone}</small></td>
                        <td>{l.listing_title ?? (l.project_id ? "مشروع على الخارطة" : "—")}<small>{l.message}</small></td>
                        <td>
                          <Badge status="channel">{CHANNELS[l.source_channel] ?? l.source_channel ?? l.source}</Badge>
                          <small>{l.utm_campaign ? `حملة: ${l.utm_campaign}` : dateTime(l.created_at)}</small>
                        </td>
                        <td>
                          <select aria-label={`حالة ${l.name}`} className="live-inline" value={l.status} disabled={busy || (!isAdmin && l.assigned_to !== me.id)} onChange={(e) => update(l, { status: e.target.value }, "تم تحديث الحالة")}>
                            {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                          </select>
                        </td>
                        <td>
                          {isAdmin ? (
                            <select aria-label={`المسؤول عن ${l.name}`} value={l.assigned_to ?? ""} disabled={busy} onChange={(e) => update(l, { assigned_to: e.target.value || null }, "تم إسناد العميل")}>
                              <option value="">غير مسند</option>
                              {(members.data ?? []).map((m) => <option key={m.id} value={m.id}>{m.name} ({statusLabel(m.role)})</option>)}
                            </select>
                          ) : (
                            "أنت"
                          )}
                        </td>
                        <td><button className="live-btn" onClick={() => setChat(l)}><MessageCircleMore size={15} /> واتساب</button></td>
                      </tr>
                    ))}
                    {!shown.length && <tr><td colSpan={6}>لا يوجد عملاء بهذه الحالة.</td></tr>}
                  </tbody>
                </table>
              </div>
            );
          }}
        </Loaded>
      </Panel>
      {chat && (
        <ExperienceDialog title={`واتساب — ${chat.name}`} close={() => setChat(null)}>
          <WhatsAppThread lead={chat} notify={notify} />
        </ExperienceDialog>
      )}
    </>
  );
}

function WhatsAppThread({ lead, notify }) {
  const thread = useLoad(() => api(`/api/leads/${lead.id}/whatsapp`), [lead.id]);
  const [run, busy] = useAction(notify);
  const [mode, setMode] = useState("text");
  return (
    <div className="live-body">
      <p className="live-note">النص الحر مسموح فقط خلال 24 ساعة من آخر رسالة من العميل (قاعدة Meta)؛ بعدها يلزم قالب معتمد.</p>
      <Loaded state={thread} empty="لا توجد رسائل مع هذا الرقم بعد.">
        {(msgs) => (
          <div className="live-chat">
            {msgs.map((m) => (
              <p key={m.id} className={m.direction}>
                {m.template_name ? `[قالب ${m.template_name}] ` : ""}{m.body}
                <small>{dateTime(m.created_at)} · {statusLabel(m.status)}</small>
              </p>
            ))}
          </div>
        )}
      </Loaded>
      <div className="live-tabs" style={{ marginTop: 12 }}>
        <button className={mode === "text" ? "active" : ""} onClick={() => setMode("text")}>رسالة نصية</button>
        <button className={mode === "template" ? "active" : ""} onClick={() => setMode("template")}>قالب معتمد</button>
      </div>
      <Form
        busy={busy}
        submit="إرسال"
        onSubmit={(v, form) =>
          run(async () => {
            await api(`/api/leads/${lead.id}/whatsapp`, { method: "POST", body: mode === "text" ? { text: v.text } : { template: v.template, language: "ar", params: v.params ? v.params.split("|").map((s) => s.trim()) : [] } });
            form.reset();
            await thread.reload();
          }, "أُرسلت الرسالة")
        }
      >
        {mode === "text" ? (
          <Field label="الرسالة" wide><textarea name="text" required maxLength={4096} /></Field>
        ) : (
          <>
            <Field label="اسم القالب"><input name="template" required pattern="[a-z0-9_]{1,512}" placeholder="welcome_lead" dir="ltr" /></Field>
            <Field label="المتغيرات (افصل بـ |)"><input name="params" placeholder={lead.name} /></Field>
          </>
        )}
      </Form>
    </div>
  );
}
