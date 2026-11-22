import { useState } from "react";
import { api, backendInfo, dateTime, statusLabel } from "../api.js";
import { Badge, Field, Form, Loaded, Panel, useAction, useLoad } from "../ui.jsx";

export function AccountScreen({ me, notify, onSignedOut }) {
  const members = useLoad(() => api("/api/members"));
  const [run, busy] = useAction(notify);
  const info = backendInfo();
  const [, force] = useState(0);
  return (
    <>
      <Panel title="حسابي">
        <dl className="live-dl live-body">
          <div><dt>الاسم</dt><dd>{me.name}</dd></div>
          <div><dt>البريد</dt><dd dir="ltr">{me.email}</dd></div>
          <div><dt>البريد مؤكد</dt><dd>{me.email_verified ? "نعم" : "لا"}</dd></div>
          <div><dt>الدور</dt><dd>{statusLabel(me.role)}</dd></div>
          <div><dt>المنشأة</dt><dd>{me.org_name}</dd></div>
          <div><dt>رخصة فال</dt><dd>{me.fal_license ?? "غير مدخلة"}</dd></div>
        </dl>
        <div className="live-inline live-body">
          {!me.email_verified && <button className="live-btn" disabled={busy} onClick={() => run(() => api("/auth/resend-verification", { method: "POST" }), "أُرسل رابط التأكيد")}>إعادة إرسال رابط التأكيد</button>}
          <button className="live-btn" disabled={busy} onClick={() => run(async () => { await api("/auth/logout-all", { method: "POST" }); onSignedOut(); })}>الخروج من كل الأجهزة</button>
        </div>
      </Panel>
      <Panel title="الفريق" subtitle="الأدوار: مالك / مشرف / موظف مبيعات. دعوة أعضاء بالبريد لم تُبنَ بعد.">
        <Loaded state={members}>
          {(rows) => (
            <div className="live-table-wrap">
              <table className="live-table">
                <thead><tr><th>الاسم</th><th>البريد</th><th>الدور</th></tr></thead>
                <tbody>{rows.map((m) => <tr key={m.id}><td>{m.name}</td><td dir="ltr" style={{ textAlign: "right" }}>{m.email ?? "—"}</td><td><Badge status={m.role === "owner" ? "active" : "draft"}>{statusLabel(m.role)}</Badge></td></tr>)}</tbody>
              </table>
            </div>
          )}
        </Loaded>
      </Panel>
      {info?.mode === "browser" && (
        <Panel title="صندوق الإرسال التجريبي" subtitle="ما كان سيُرسل بريدًا أو واتساب في البيئة الحقيقية" actions={<button className="live-btn" onClick={() => force((n) => n + 1)}>تحديث</button>}>
          <ul className="live-timeline live-body">
            {info.outbox.map((m, k) => <li key={k}>{m.channel === "email" ? "بريد" : "واتساب"} إلى <span dir="ltr">{m.to}</span>: {m.subject} <small>{dateTime(m.at)}</small></li>)}
            {!info.outbox.length && <li>لا شيء بعد في هذه الجلسة.</li>}
          </ul>
          <p className="live-note">قاعدة البيانات محفوظة في متصفحك ({info.persisted ? "IndexedDB" : "في الذاكرة فقط"}).</p>
          <button className="live-btn danger" onClick={async () => { if (!window.confirm("حذف كل البيانات التجريبية والبدء من جديد؟")) return; await info.reset(); window.location.reload(); }}>إعادة ضبط البيانات التجريبية</button>
        </Panel>
      )}
      <Panel title="حذف الحساب" subtitle="يحذف حسابك فعليًا، ومعه المنشأة إن كنت المالك الوحيد (ما لم توجد حجوزات مدفوعة).">
        <Form busy={busy} submit="حذف حسابي نهائيًا" onSubmit={(v) => window.confirm("لا يمكن التراجع. متأكد؟") && run(async () => { await api("/me", { method: "DELETE", body: { password: v.password } }); onSignedOut(); }, "حُذف الحساب")}>
          <Field label="كلمة المرور للتأكيد"><input name="password" type="password" required autoComplete="current-password" /></Field>
        </Form>
      </Panel>
    </>
  );
}
