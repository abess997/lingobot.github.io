import { useState } from "react";
import { api, date, dateTime, statusLabel, TRIGGERS } from "../api.js";
import { Badge, Field, Form, Loaded, Panel, opt, useAction, useLoad } from "../ui.jsx";

const SCOPES = { "listings:read": "قراءة العقارات", "listings:write": "إضافة عقارات", "leads:read": "قراءة العملاء", "leads:write": "إضافة عملاء", "projects:read": "قراءة المشاريع" };

export function IntegrationsScreen({ notify, isOwner }) {
  const wa = useLoad(() => api("/api/integrations/whatsapp"));
  const [run, busy] = useAction(notify);
  return (
    <>
      <Panel title="واتساب الأعمال (Cloud API)" subtitle="كل منشأة تربط رقمها؛ الرمز مشفر (AES-256-GCM) ولا يُعرض بعد الحفظ">
        <Loaded state={wa}>
          {(acc) => (
            <div className="live-body">
              {acc ? (
                <div className="live-inline">
                  <Badge status={acc.active ? "active" : "draft"}>{acc.active ? "مربوط" : "متوقف"}</Badge>
                  <span dir="ltr">{acc.display_phone ?? acc.phone_number_id}</span>
                  <small className="live-note">آخر تحديث {date(acc.updated_at)}</small>
                  {isOwner && <button className="live-btn danger" disabled={busy} onClick={() => run(async () => { await api("/api/integrations/whatsapp", { method: "DELETE" }); await wa.reload(); }, "أُلغي الربط")}>إلغاء الربط</button>}
                </div>
              ) : (
                <p className="live-note">غير مربوط. الرسائل الواردة من رقم جديد تنشئ عميلًا محتملًا تلقائيًا بعد الربط.</p>
              )}
              {isOwner ? (
                <Form busy={busy} submit={acc ? "تحديث الربط" : "ربط الرقم"} onSubmit={(v, f) => run(async () => { await api("/api/integrations/whatsapp", { method: "PUT", body: { phone_number_id: v.phone_number_id, waba_id: opt(v.waba_id), display_phone: opt(v.display_phone), access_token: v.access_token } }); f.reset(); await wa.reload(); }, "تم ربط واتساب")}>
                  <Field label="Phone number ID"><input name="phone_number_id" required pattern="[0-9]{5,30}" dir="ltr" /></Field>
                  <Field label="WABA ID"><input name="waba_id" pattern="[0-9]{5,30}" dir="ltr" /></Field>
                  <Field label="الرقم الظاهر"><input name="display_phone" dir="ltr" placeholder="+9665…" /></Field>
                  <Field label="Access token" hint="من تطبيق Meta الخاص بديل لاين"><input name="access_token" type="password" required minLength={20} dir="ltr" autoComplete="off" /></Field>
                </Form>
              ) : (
                <p className="live-note">الربط وإدارة التكاملات للمالك فقط.</p>
              )}
              <p className="live-note warn">الإرسال الفعلي يحتاج تطبيق Meta موثق وقوالب معتمدة لكل منشأة. في البيئة التجريبية تُسجل الرسائل دون إرسال.</p>
            </div>
          )}
        </Loaded>
      </Panel>
      {isOwner ? (
        <>
          <Webhooks notify={notify} />
          <ApiKeys notify={notify} />
        </>
      ) : (
        <Panel title="Webhooks ومفاتيح API" subtitle="للمالك فقط" />
      )}
      <Panel title="تكاملات غير مبنية — بقرار" subtitle="لا توجد واجهات تجريبية مزيفة لها">
        <ul className="live-timeline live-body">
          <li>هيئة العقار، إيجار، نفاذ <small>لا توجد واجهات API عامة مؤكدة؛ كل منها يحتاج اتفاقية (منصة مرخصة / شريك / مزود معتمد).</small></li>
          <li>Booking.com و Airbnb <small>مستبعدة بقرار المنتج.</small></li>
          <li>الفوترة الإلكترونية (فاتورة – المرحلة الثانية) <small>تتطلب الربط مع هيئة الزكاة والضريبة والجمارك.</small></li>
        </ul>
      </Panel>
    </>
  );
}

function Webhooks({ notify }) {
  const hooks = useLoad(() => api("/api/integrations/webhooks"));
  const [secret, setSecret] = useState(null);
  const [events, setEvents] = useState(["lead.created"]);
  const [deliveries, setDeliveries] = useState(null);
  const [run, busy] = useAction(notify);
  return (
    <Panel title="Webhooks (Zapier / Make / n8n)" subtitle="موقّعة بـ HMAC-SHA256؛ إعادة محاولة بعد 1د، 5د، 30د، 2س، 12س">
      <Form
        busy={busy}
        submit="إضافة Webhook"
        onSubmit={(v, f) => run(async () => { const r = await api("/api/integrations/webhooks", { method: "POST", body: { url: v.url, event_types: events } }); setSecret(r); f.reset(); await hooks.reload(); }, "أُضيف الـ Webhook")}
      >
        <Field label="العنوان (https)" wide><input name="url" type="url" required dir="ltr" placeholder="https://hooks.zapier.com/…" /></Field>
        <fieldset className="live-field wide" style={{ border: 0, padding: 0 }}>
          <span>الأحداث</span>
          <div className="live-inline">
            {Object.entries(TRIGGERS).map(([k, l]) => (
              <label key={k} className="live-inline" style={{ gap: 4 }}>
                <input type="checkbox" style={{ minWidth: 0, width: 18 }} checked={events.includes(k)} onChange={(e) => setEvents(e.target.checked ? [...events, k] : events.filter((x) => x !== k))} /> {l}
              </label>
            ))}
          </div>
        </fieldset>
      </Form>
      <p className="live-note">العناوين الداخلية والخاصة مرفوضة (حماية SSRF). يتطلب ذلك فحص DNS من الخادم؛ في النسخة داخل المتصفح سيُرفض أي عنوان.</p>
      {secret && (
        <div className="live-body">
          <p className="live-note warn">سر التوقيع يظهر مرة واحدة فقط — احفظه الآن:</p>
          <div className="live-secret">{secret.secret}{"\n"}{secret.signature}</div>
        </div>
      )}
      <Loaded state={hooks} empty="لا توجد Webhooks.">
        {(rows) => (
          <div className="live-table-wrap">
            <table className="live-table">
              <thead><tr><th>العنوان</th><th>الأحداث</th><th /></tr></thead>
              <tbody>
                {rows.map((h) => (
                  <tr key={h.id}>
                    <td dir="ltr" style={{ textAlign: "right" }}>{h.url}</td>
                    <td>{h.event_types.map((e) => <small key={e}>{TRIGGERS[e]}</small>)}</td>
                    <td className="live-actions">
                      <button className="live-btn" onClick={async () => setDeliveries({ id: h.id, rows: await api(`/api/integrations/webhooks/${h.id}/deliveries`) })}>التسليمات</button>
                      <button className="live-btn danger" disabled={busy} onClick={() => run(async () => { await api(`/api/integrations/webhooks/${h.id}`, { method: "DELETE" }); await hooks.reload(); }, "حُذف")}>حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Loaded>
      {deliveries && (
        <ul className="live-timeline live-body">
          {deliveries.rows.map((d) => <li key={d.id}>{TRIGGERS[d.type]} · {statusLabel(d.status)} <small>محاولات {d.attempts}{d.last_status ? ` · HTTP ${d.last_status}` : ""}{d.next_attempt_at ? ` · التالية ${dateTime(d.next_attempt_at)}` : ""}</small></li>)}
          {!deliveries.rows.length && <li>لا توجد تسليمات بعد.</li>}
        </ul>
      )}
    </Panel>
  );
}

function ApiKeys({ notify }) {
  const keys = useLoad(() => api("/api/integrations/api-keys"));
  const [created, setCreated] = useState(null);
  const [scopes, setScopes] = useState(["listings:read", "leads:write"]);
  const [run, busy] = useAction(notify);
  return (
    <Panel title="مفاتيح API العامة (/v1)" subtitle="تُحفظ كبصمة sha256 فقط، تظهر مرة واحدة، 120 طلب/دقيقة لكل مفتاح">
      <Form busy={busy} submit="إنشاء مفتاح" onSubmit={(v, f) => run(async () => { const r = await api("/api/integrations/api-keys", { method: "POST", body: { name: v.name, scopes } }); setCreated(r); f.reset(); await keys.reload(); }, "أُنشئ المفتاح")}>
        <Field label="اسم المفتاح"><input name="name" required maxLength={80} placeholder="Zapier" /></Field>
        <fieldset className="live-field wide" style={{ border: 0, padding: 0 }}>
          <span>الصلاحيات</span>
          <div className="live-inline">
            {Object.entries(SCOPES).map(([k, l]) => (
              <label key={k} className="live-inline" style={{ gap: 4 }}>
                <input type="checkbox" style={{ minWidth: 0, width: 18 }} checked={scopes.includes(k)} onChange={(e) => setScopes(e.target.checked ? [...scopes, k] : scopes.filter((x) => x !== k))} /> {l}
              </label>
            ))}
          </div>
        </fieldset>
      </Form>
      {created && (
        <div className="live-body">
          <p className="live-note warn">المفتاح يظهر مرة واحدة فقط:</p>
          <div className="live-secret">{created.key}</div>
          <p className="live-note">مثال: <code dir="ltr">curl -H "Authorization: Bearer {created.key.slice(0, 14)}…" /v1/listings</code></p>
        </div>
      )}
      <Loaded state={keys} empty="لا توجد مفاتيح.">
        {(rows) => (
          <div className="live-table-wrap">
            <table className="live-table">
              <thead><tr><th>الاسم</th><th>البادئة</th><th>الصلاحيات</th><th>آخر استخدام</th><th>الحالة</th><th /></tr></thead>
              <tbody>
                {rows.map((k) => (
                  <tr key={k.id}>
                    <td>{k.name}</td>
                    <td dir="ltr">dl_{k.prefix}_…</td>
                    <td>{k.scopes.map((s) => <small key={s}>{SCOPES[s]}</small>)}</td>
                    <td>{dateTime(k.last_used_at)}</td>
                    <td><Badge status={k.revoked_at ? "blocked" : "active"}>{k.revoked_at ? "ملغى" : "فعال"}</Badge></td>
                    <td>{!k.revoked_at && <button className="live-btn danger" disabled={busy} onClick={() => run(async () => { await api(`/api/integrations/api-keys/${k.id}`, { method: "DELETE" }); await keys.reload(); }, "أُلغي المفتاح")}>إلغاء</button>}</td>
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
