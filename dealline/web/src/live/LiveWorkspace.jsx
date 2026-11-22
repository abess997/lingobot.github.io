import { useEffect, useState } from "react";
import {
  ArrowLeft, Building2, CircleAlert, CircleCheck, Globe, House, KeyRound, LayoutDashboard, LockKeyhole, Menu,
  ShieldCheck, UserRound, UsersRound, Workflow, X, Zap, BriefcaseBusiness,
} from "lucide-react";
import { SpatialSurface } from "../app/experience.jsx";
import { api, backendInfo, backendMode, initBackend, statusLabel } from "./api.js";
import { Field, Form, Loading, useAction } from "./ui.jsx";
import { Overview } from "./screens/Overview.jsx";
import { SiteScreen } from "./screens/Site.jsx";
import { ListingsScreen } from "./screens/Listings.jsx";
import { LeadsScreen } from "./screens/Leads.jsx";
import { ProjectsScreen } from "./screens/Projects.jsx";
import { DealsScreen } from "./screens/Deals.jsx";
import { AutomationScreen } from "./screens/Automation.jsx";
import { IntegrationsScreen } from "./screens/Integrations.jsx";
import { AccountScreen } from "./screens/Account.jsx";
import "./live.css";

const NAV = [
  { key: "overview", label: "لوحة اليوم", icon: LayoutDashboard },
  { key: "site", label: "موقع المكتب", icon: Globe, admin: true },
  { key: "listings", label: "العقارات الجاهزة", icon: House },
  { key: "leads", label: "العملاء المحتملون", icon: UsersRound },
  { key: "projects", label: "مشاريع على الخارطة", icon: Building2 },
  { key: "deals", label: "صفقات الخارطة", icon: BriefcaseBusiness },
  { key: "automation", label: "الأتمتة والمهام", icon: Workflow },
  { key: "integrations", label: "التكاملات", icon: Zap },
  { key: "account", label: "الحساب والفريق", icon: UserRound },
];

export const DEMO_ACCOUNTS = [
  { email: "owner@dealline.test", role: "owner" },
  { email: "admin@dealline.test", role: "admin" },
  { email: "sales@dealline.test", role: "member" },
];
const DEMO_PASSWORD = "demo-password-123";

export function LiveWorkspace({ exit }) {
  const [boot, setBoot] = useState({ state: "booting", error: null });
  const [me, setMe] = useState(null);
  const [view, setView] = useState("overview");
  const [focus, setFocus] = useState(null); // deep link between screens, e.g. { deal: id }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (message, kind = "ok") => {
    setToast({ message, kind });
    window.clearTimeout(notify.t);
    notify.t = window.setTimeout(() => setToast(null), kind === "error" ? 6000 : 3000);
  };

  const loadMe = async () => {
    try { setMe(await api("/me")); } catch { setMe(null); }
  };
  const signedOut = () => { setMe(null); setView("overview"); setFocus(null); };

  useEffect(() => {
    initBackend()
      .then(loadMe)
      .then(() => setBoot({ state: "ready", error: null }))
      .catch((e) => setBoot({ state: "failed", error: e }));
  }, []);

  if (boot.state === "booting")
    return (
      <main className="login-shell live-shell" dir="rtl">
        <section className="login-panel" style={{ margin: "auto" }}>
          <Loading label={backendMode() === "browser" ? "تشغيل خادم ديل لاين داخل المتصفح وتجهيز قاعدة البيانات… (أول مرة تأخذ ثوانٍ)" : "الاتصال بخادم ديل لاين…"} />
        </section>
      </main>
    );
  if (boot.state === "failed")
    return (
      <main className="login-shell live-shell" dir="rtl">
        <section className="login-panel" style={{ margin: "auto", maxWidth: 520 }}>
          <div className="live-state error" role="alert">
            <CircleAlert size={20} /> تعذر تشغيل الخادم: {boot.error?.message}
          </div>
          <button className="ghost-action" onClick={exit}>رجوع</button>
        </section>
      </main>
    );
  if (!me) return <LiveLogin exit={exit} onSignedIn={loadMe} notify={notify} toast={toast} />;

  const isAdmin = me.role === "owner" || me.role === "admin";
  const nav = NAV.filter((n) => !n.admin || isAdmin);
  const go = (key, f = null) => { setView(key); setFocus(f); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: "instant" }); };
  const props = { me, notify, go, focus, isAdmin, isOwner: me.role === "owner", refreshMe: loadMe };
  const title = NAV.find((n) => n.key === view)?.label;
  const info = backendInfo();

  return (
    <SpatialSurface>
      <main className="app-shell sales-mode live-shell" data-portal="developer" dir="rtl">
        <div className={`mobile-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="التنقل الرئيسي">
          <div className="brand-row">
            <div className="brand-mark"><span>د</span><i /></div>
            <div>
              <strong>ديل لاين</strong>
              <small>مساحة المكتب — متصلة بالخادم</small>
            </div>
            <button className="icon-button close-sidebar" onClick={() => setSidebarOpen(false)} aria-label="إغلاق القائمة"><X size={20} /></button>
          </div>
          <div className="profile-card">
            <div className="avatar">{me.name?.slice(0, 1) ?? "؟"}</div>
            <div className="profile-copy">
              <span>{me.org_name} · {statusLabel(me.role)}</span>
              <strong>{me.name}</strong>
            </div>
          </div>
          <nav className="main-nav">
            <span className="nav-label">عملي</span>
            {nav.map(({ key, label, icon: Icon }) => (
              <button key={key} className={view === key ? "active" : ""} aria-current={view === key ? "page" : undefined} onClick={() => go(key)}>
                <Icon size={19} strokeWidth={1.9} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-trust">
            <ShieldCheck size={20} />
            <div>
              <strong>صلاحيات من الخادم</strong>
              <span>{isAdmin ? "ترى بيانات جهتك فقط (RLS)" : "ترى العملاء والصفقات المسندة لك"}</span>
            </div>
          </div>
          <div className="sidebar-footer">
            <button
              onClick={async () => {
                await api("/auth/logout", { method: "POST" }).catch(() => {});
                signedOut();
              }}
            >
              <LockKeyhole size={17} /> تسجيل الخروج
            </button>
            <button onClick={exit}><ArrowLeft size={17} /> البوابات التجريبية</button>
          </div>
        </aside>
        <section className="workspace" id="top">
          <header className="topbar">
            <div className="topbar-start">
              <button className="icon-button menu-button" onClick={() => setSidebarOpen(true)} aria-label="فتح القائمة"><Menu size={22} /></button>
              <div>
                <small>{me.org_name}</small>
                <h1>{title}</h1>
              </div>
            </div>
            <div className="topbar-actions">
              <span className="live-connection"><i />{info?.mode === "browser" ? "الخادم يعمل داخل المتصفح" : "متصل بخادم ديل لاين"}</span>
            </div>
          </header>
          {info?.mode === "browser" && (
            <div className="demo-environment" role="status">
              <ShieldCheck size={17} />
              <span>
                <strong>نسخة تجريبية كاملة داخل المتصفح</strong>
                {info.otherTab
                  ? " · النسخة مفتوحة في تبويب آخر، لذلك هذا التبويب يعمل على نسخة مؤقتة لا تُحفظ. أغلق التبويب الآخر وأعد التحميل للحفظ."
                  : " · نفس منطق الخادم وقاعدة بيانات Postgres، لكن البيانات محفوظة على جهازك فقط، ولا يُرسل بريد أو واتساب أو دفع فعلي."}
              </span>
            </div>
          )}
          <div className="content-wrap sales-content management-content" key={view}>
            {view === "overview" && <Overview {...props} />}
            {view === "site" && <SiteScreen {...props} />}
            {view === "listings" && <ListingsScreen {...props} />}
            {view === "leads" && <LeadsScreen {...props} />}
            {view === "projects" && <ProjectsScreen {...props} />}
            {view === "deals" && <DealsScreen {...props} />}
            {view === "automation" && <AutomationScreen {...props} />}
            {view === "integrations" && <IntegrationsScreen {...props} />}
            {view === "account" && <AccountScreen {...props} onSignedOut={signedOut} />}
          </div>
        </section>
        <Toast toast={toast} />
      </main>
    </SpatialSurface>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.kind === "error" ? "live-toast-error" : ""}`} role={toast.kind === "error" ? "alert" : "status"}>
      {toast.kind === "error" ? <CircleAlert size={19} /> : <CircleCheck size={19} />}
      {toast.message}
    </div>
  );
}

function LiveLogin({ exit, onSignedIn, notify, toast }) {
  const [mode, setMode] = useState("login");
  const [run, busy] = useAction(notify);
  const [creds, setCreds] = useState({ email: "", password: "" });
  const login = (values) => run(async () => { await api("/auth/login", { method: "POST", body: values }); await onSignedIn(); });
  return (
    <SpatialSurface>
      <main className="login-shell live-shell" dir="rtl">
        <section className="login-story">
          <div className="login-brand">
            <span className="brand-mark"><span>د</span><i /></span>
            <strong>ديل لاين</strong>
          </div>
          <div className="story-copy">
            <span className="login-kicker"><KeyRound size={15} /> مساحة المكتب العقاري والمطور</span>
            <h1>موقعك، عقاراتك،<br />وصفقاتك في مكان واحد.</h1>
            <p>منشئ موقع المكتب، المخزون، العملاء، البيع على الخارطة، الأتمتة والتكاملات — بيانات حقيقية من الخادم.</p>
          </div>
          <div className="story-cards">
            <article><ShieldCheck size={20} /><strong>بيانات كل جهة معزولة</strong><span>عزل على مستوى قاعدة البيانات (RLS).</span></article>
            <article><Building2 size={20} /><strong>امتثال قبل النشر</strong><span>لا نشر بدون رخصة فال ورخصة إعلان سارية.</span></article>
          </div>
          <div className="login-orbit orbit-one" />
          <div className="login-orbit orbit-two" />
        </section>
        <section className="login-panel">
          <div className="login-box portal-login-box live-login">
            <button className="back-to-welcome" onClick={exit}><ArrowLeft size={17} /> رجوع إلى البوابات التجريبية</button>
            <div className="live-tabs" role="tablist">
              <button role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>تسجيل الدخول</button>
              <button role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>حساب جديد لمنشأة</button>
            </div>
            {mode === "login" ? (
              <>
                <Form onSubmit={login} submit="دخول" busy={busy}>
                  <Field label="البريد الإلكتروني">
                    <input name="email" type="email" required autoComplete="username" value={creds.email} onChange={(e) => setCreds({ ...creds, email: e.target.value })} />
                  </Field>
                  <Field label="كلمة المرور">
                    <input name="password" type="password" required autoComplete="current-password" value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} />
                  </Field>
                </Form>
                <div className="live-demo-accounts">
                  <small className="live-note">حسابات البيانات التجريبية (كلمة المرور: {DEMO_PASSWORD}) — اختر واحدًا ثم «دخول»:</small>
                  {DEMO_ACCOUNTS.map((a) => (
                    <button key={a.email} type="button" onClick={() => setCreds({ email: a.email, password: DEMO_PASSWORD })}>
                      <span dir="ltr">{a.email}</span>
                      <strong>{statusLabel(a.role)}</strong>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <Form
                busy={busy}
                submit="إنشاء الحساب"
                onSubmit={(v) => run(async () => { await api("/auth/signup", { method: "POST", body: v }); await onSignedIn(); }, "تم إنشاء الحساب. أرسلنا رابط تأكيد البريد.")}
              >
                <Field label="اسمك"><input name="name" required maxLength={120} /></Field>
                <Field label="اسم المنشأة"><input name="org_name" required maxLength={120} /></Field>
                <Field label="البريد الإلكتروني"><input name="email" type="email" required autoComplete="email" /></Field>
                <Field label="كلمة المرور" hint="10 أحرف على الأقل"><input name="password" type="password" required minLength={10} autoComplete="new-password" /></Field>
              </Form>
            )}
            <p className="portal-security-note"><ShieldCheck size={15} /> كلمات المرور مشفرة (scrypt) والجلسة في كوكي http-only.</p>
          </div>
        </section>
        <Toast toast={toast} />
      </main>
    </SpatialSurface>
  );
}
