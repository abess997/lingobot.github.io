// Recovered from the Deal Line production build (app/experience.tsx). Types were stripped by the build and are not recoverable.
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  Bath,
  BedDouble,
  Building2,
  Check,
  ChevronLeft,
  CircleCheck,
  CircleQuestionMark,
  Clock3,
  Download,
  Expand,
  FingerprintPattern,
  House,
  Info,
  LockKeyhole,
  MapPin,
  MessageCircleMore,
  MoveUpRight,
  Ruler,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import { money, projectUnits } from "./property-data";
import { csvCell, walletSummary } from "./demo-domain";

const motionSelector =
  ".project-card, .sales-kpis > button, .sales-kpis > article, .welcome-visual, .wallet-balance, .journey-card, .focus-card, .intro-step-card, .portal-login-grid > button, .next-action, .calculator-launch";
export function SpatialSurface({ children, className = "" }) {
  const motion = useRef({
    element: null,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    tx: 0,
    ty: 0,
    frame: 0,
    time: 0,
  });
  useEffect(() => () => cancelAnimationFrame(motion.current.frame), []);
  const animate = (time) => {
    const m = motion.current;
    const dt = Math.min((time - (m.time || time - 16)) / 1e3, 0.032);
    m.time = time;
    m.vx += (190 * (m.tx - m.x) - 28 * m.vx) * dt;
    m.vy += (190 * (m.ty - m.y) - 28 * m.vy) * dt;
    m.x += m.vx * dt;
    m.y += m.vy * dt;
    m.element?.style.setProperty("--tilt-x", `${m.x}deg`);
    m.element?.style.setProperty("--tilt-y", `${m.y}deg`);
    if (Math.abs(m.x - m.tx) + Math.abs(m.y - m.ty) + Math.abs(m.vx) + Math.abs(m.vy) > 0.008)
      m.frame = requestAnimationFrame(animate);
    else {
      m.frame = 0;
      m.time = 0;
    }
  };
  const reset = () => {
    const m = motion.current;
    m.tx = 0;
    m.ty = 0;
    if (!m.frame) m.frame = requestAnimationFrame(animate);
  };
  const move = (event) => {
    if (
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches
    )
      return;
    const target = event.target.closest(motionSelector);
    if (!target) {
      reset();
      return;
    }
    const m = motion.current;
    if (m.element !== target) {
      m.element?.style.removeProperty("--tilt-x");
      m.element?.style.removeProperty("--tilt-y");
      m.element = target;
      m.x = 0;
      m.y = 0;
      m.vx = 0;
      m.vy = 0;
    }
    const box = target.getBoundingClientRect();
    m.tx = (-(event.clientY - box.top - box.height / 2) / box.height) * 4;
    m.ty = ((event.clientX - box.left - box.width / 2) / box.width) * 5;
    if (!m.frame) m.frame = requestAnimationFrame(animate);
  };
  return (
    <div className={`spatial-surface ${className}`} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </div>
  );
}
export function ExperienceDialog({ title, children, close, wide = false }) {
  const ref = useRef(null);
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const dialog = ref.current;
    const focusBefore = document.activeElement;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      focusBefore?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`experience-dialog ${wide ? "wide" : ""}`}
      dir="rtl"
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        closeRef.current();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeRef.current();
      }}
    >
      <div className="experience-dialog-inner">
        <header>
          <div>
            <span className="eyebrow">ديل لاين</span>
            <h2>{title}</h2>
          </div>
          <button className="icon-button" autoFocus onClick={close} aria-label="إغلاق النافذة">
            <X size={22} />
          </button>
        </header>
        <div className="experience-dialog-body">{children}</div>
      </div>
    </dialog>
  );
}
const steps = [
  {
    title: "اختَر البيت اللي يناسبك",
    short: "اكتشف",
    icon: House,
    text: "تصفّح المشاريع، افتح تفاصيل الوحدة، وقارن المساحة والسعر والمميزات قبل ما تبدأ.",
    note: "البداية من الوحدة المناسبة لك",
  },
  {
    title: "اعرف خياراتك بوضوح",
    short: "احسب",
    icon: FingerprintPattern,
    text: "بعد اختيار الوحدة، تبدأ رحلة التحقق وموافقتك على مشاركة البيانات اللازمة للحسبة المبدئية.",
    note: "الحسبة المبدئية ليست موافقة تمويلية",
  },
  {
    title: "تواصل في نفس المكان",
    short: "تواصل",
    icon: MessageCircleMore,
    text: "اسأل موظف المشروع وتابع مع موظف التمويل المختص في مسار يجمع محادثاتك وطلبك.",
    note: "المسؤول عن الخطوة واضح لك",
  },
  {
    title: "تابع لين تكتمل صفقتك",
    short: "تملّك",
    icon: CircleCheck,
    text: "تعرف وين وصل الطلب، وش المستند الناقص، ومتى تنتقل للخطوة التالية إلى اكتمال الرحلة.",
    note: "حالة الصفقة والمطلوب منك في مكان واحد",
  },
];
export function WelcomePage({ enter, browse, children, returning = false }) {
  const [step, setStep] = useState(0);
  const Icon = steps[step].icon;
  return (
    <SpatialSurface>
      <main className="welcome-page" dir="rtl">
        <header className="welcome-header">
          <a className="welcome-brand" href="#welcome-top" aria-label="ديل لاين الرئيسية">
            <span className="brand-mark">
              <span>د</span>
              <i />
            </span>
            <strong>ديل لاين</strong>
          </a>
          <nav aria-label="التنقل التعريفي">
            <a href="#how-it-works">كيف تبدأ؟</a>
            <a href="#market">العقارات</a>
          </nav>
          <button className="primary-action" onClick={enter}>
            {returning ? "ارجع لبوابتك" : "الدخول للمنصة"}
            <ArrowLeft size={17} />
          </button>
        </header>
        <section className="welcome-hero" id="welcome-top">
          <div className="welcome-copy">
            <span className="intro-kicker">
              <span />
              {" بيتك. قرارك. مسارك."}
            </span>
            <h1>
              بيتك الجاي،
              <br />
              <em>تبدأ حكايته هنا.</em>
            </h1>
            <p>
              من البحث عن البيت إلى متابعة التمويل والصفقة. ديل لاين تجمعك مع المطور والجهة التمويلية في مسار
              واحد، وتخلّي كل خطوة أوضح.
            </p>
            <div className="welcome-actions">
              <button className="primary-action" onClick={browse}>
                استكشف العقارات
                <ArrowLeft size={19} />
              </button>
              <a className="welcome-secondary" href="#how-it-works">
                خلّنا نعرّفك على ديل لاين
                <ChevronLeft size={18} />
              </a>
            </div>
            <div className="welcome-assurance">
              <ShieldCheck size={19} />
              <span>بياناتك بموافقتك. وقرارك بيدك.</span>
            </div>
          </div>
          <div className="welcome-visual">
            <img
              src={`${import.meta.env.BASE_URL}images/saudi-villa.webp`}
              alt="تصور معماري لفيلا سعودية حديثة بواجهة حجرية وحديقة"
              width={960}
              height={720}
              fetchPriority="high"
            />
            <span className="visual-caption">صورة تصورية</span>
            <div className="hero-property-caption">
              <span>
                <MapPin size={15} />
                {" مساحة لحياتك الجديدة"}
              </span>
              <strong>
                تفاصيل تشوفها.
                <br />
                وخطوات تعرفها.
              </strong>
            </div>
            <div className="hero-floating-card">
              <span className="floating-icon">
                <CircleCheck size={25} />
              </span>
              <div>
                <small>رحلة واحدة تجمع الأطراف</small>
                <strong>العقار + التمويل + المتابعة</strong>
              </div>
            </div>
          </div>
        </section>
        <section className="welcome-journey" id="how-it-works">
          <div className="intro-section-title">
            <span className="eyebrow">أول مرة تدخل؟ حيّاك الله</span>
            <h2>من وين تبدأ؟ خطوة بخطوة.</h2>
            <p>اختر أي خطوة وخلّنا نوضحها لك.</p>
          </div>
          <div className="intro-journey-grid">
            <div className="intro-steps" role="tablist" aria-label="خطوات رحلة العميل">
              {steps.map((item, index) => (
                <button
                  key={item.short}
                  type="button"
                  role="tab"
                  aria-selected={step === index}
                  aria-controls="intro-step-panel"
                  id={`intro-step-${index}`}
                  tabIndex={step === index ? 0 : -1}
                  onKeyDown={(event) => {
                    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
                      event.preventDefault();
                      const next =
                        event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? 3
                            : (step + (event.key === "ArrowLeft" ? 1 : 3)) % 4;
                      setStep(next);
                      document.getElementById(`intro-step-${next}`)?.focus();
                    }
                  }}
                  className={step === index ? "active" : ""}
                  onClick={() => setStep(index)}
                >
                  <span>0{index + 1}</span>
                  <strong>{item.short}</strong>
                  <ArrowUpLeft size={18} />
                </button>
              ))}
            </div>
            <article
              className="intro-step-card"
              id="intro-step-panel"
              role="tabpanel"
              aria-labelledby={`intro-step-${step}`}
              tabIndex={0}
            >
              <div key={step} className="intro-step-content">
                <span className="intro-step-icon">
                  <Icon size={30} />
                </span>
                <div>
                  <h3>{steps[step].title}</h3>
                  <p>{steps[step].text}</p>
                  <span className="intro-step-note">
                    <Check size={16} />
                    {steps[step].note}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
        <div className="welcome-catalog">{children}</div>
        <section className="welcome-finish">
          <div>
            <span className="eyebrow">خطوتك الأولى بيدك</span>
            <h2>شوف التفاصيل، وخذ وقتك بالقرار.</h2>
            <p>المنصة في هذه النسخة للتجربة؛ بيانات العقارات والتمويل توضيحية.</p>
          </div>
          <button className="primary-action" onClick={enter}>
            {returning ? "ارجع لبوابتك" : "الدخول إلى البوابات"}
            <ArrowLeft size={18} />
          </button>
        </section>
        <footer className="welcome-footer">
          <strong>ديل لاين</strong>
          <span>رحلة التملك في مكان واحد</span>
          <small>© 2026 · نسخة تفاعلية تجريبية</small>
        </footer>
      </main>
    </SpatialSurface>
  );
}
export function PropertyDetails({ project, contact, isVisitor = false, savedUnits, toggleSaved }) {
  const [tab, setTab] = useState("overview");
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const units = projectUnits(project);
  const unit = units[selected];
  const interested = savedUnits.includes(unit.id);
  return (
    <div className="property-experience">
      <div className={`property-photo ${expanded ? "expanded" : ""}`}>
        <img
          src={project.image}
          alt={`صورة تصورية لنمط ${project.type} في ${project.name}`}
          width={1200}
          height={800}
        />
        <span>صورة تصورية · ليست صورة فعلية للمشروع</span>
        <button
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "تصغير الصورة" : "تكبير صورة العقار"}
          aria-pressed={expanded}
        >
          <Expand size={20} />
        </button>
      </div>
      <div className="property-heading">
        <div>
          <span>
            <MapPin size={16} />
            {project.city}
            {" · "}
            {project.district}
          </span>
          <h3>{project.name}</h3>
        </div>
        <div>
          <small>سعر الوحدة المختارة · تجريبي</small>
          <strong>
            {money(unit.price)} <em>ر.س</em>
          </strong>
        </div>
      </div>
      <div className="property-specs">
        <span>
          <BedDouble size={21} />
          <strong>{unit.beds}</strong>
          {" غرف نوم"}
        </span>
        <span>
          <Bath size={21} />
          <strong>{unit.baths}</strong>
          {" دورات مياه"}
        </span>
        <span>
          <Ruler size={21} />
          <strong>{unit.area}</strong>
          {" م²"}
        </span>
        <span>
          <Building2 size={21} />
          {unit.floor}
        </span>
      </div>
      <div className="property-tabs" role="tablist" aria-label="تفاصيل العقار">
        {[
          ["overview", "عن العقار"],
          ["units", "الوحدات"],
          ["location", "الموقع والخدمات"],
        ].map(([key, label], index, all) => (
          <button
            key={key}
            role="tab"
            id={`property-tab-${key}`}
            aria-controls={`property-panel-${tab}`}
            aria-selected={tab === key}
            tabIndex={tab === key ? 0 : -1}
            className={tab === key ? "active" : ""}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                const next = all[(index + (event.key === "ArrowLeft" ? 1 : 2)) % 3][0];
                setTab(next);
                document.getElementById(`property-tab-${next}`)?.focus();
              }
            }}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <section
        className="property-tab-panel"
        role="tabpanel"
        id={`property-panel-${tab}`}
        aria-labelledby={`property-tab-${tab}`}
        tabIndex={0}
      >
        {tab === "overview" && (
          <>
            <h4>بيت يناسب يومك</h4>
            <p>{project.description}</p>
            <div className="amenity-grid">
              {project.amenities.map((item) => (
                <span key={item}>
                  <CircleCheck size={17} />
                  {item}
                </span>
              ))}
            </div>
            <dl className="property-facts-table">
              <div>
                <dt>نوع العقار</dt>
                <dd>{project.type}</dd>
              </div>
              <div>
                <dt>حالة البناء في النموذج</dt>
                <dd>{project.tag}</dd>
              </div>
              <div>
                <dt>واجهة الوحدة</dt>
                <dd>{unit.facing}</dd>
              </div>
              <div>
                <dt>رمز الوحدة</dt>
                <dd dir="ltr">{unit.id}</dd>
              </div>
            </dl>
          </>
        )}
        {tab === "units" && (
          <>
            <div className="units-section-title">
              <h4>اختر وحدة وشوف مواصفاتها</h4>
              <span>وحدتان متاحتان في النموذج</span>
            </div>
            <div className="unit-choice-list">
              {units.map((item, i) => (
                <button
                  key={item.id}
                  disabled={!item.available}
                  aria-pressed={selected === i}
                  className={selected === i ? "selected" : ""}
                  onClick={() => {
                    setSelected(i);
                  }}
                >
                  <span className="unit-choice-icon">
                    <House size={21} />
                  </span>
                  <span>
                    <strong dir="ltr">{item.id}</strong>
                    <small>
                      {item.area}
                      {" م² · "}
                      {item.beds}
                      {" غرف · "}
                      {item.facing}
                    </small>
                  </span>
                  <span>
                    <strong>
                      {money(item.price)}
                      {" ر.س"}
                    </strong>
                    <small>
                      {item.available ? (selected === i ? "الوحدة المختارة" : "متاحة للتجربة") : "غير متاحة"}
                    </small>
                  </span>
                  {selected === i && <CircleCheck size={20} />}
                </button>
              ))}
            </div>
          </>
        )}
        {tab === "location" && (
          <>
            <div className="location-summary">
              <MapPin size={29} />
              <div>
                <h4>
                  {project.city}
                  {" · "}
                  {project.district}
                </h4>
                <p>موقع تقريبي على مستوى الحي. موقع المشروع الفعلي يحتاج اعتماد المطور.</p>
              </div>
            </div>
            <h4>المرافق التي تهمك</h4>
            <div className="amenity-grid">
              <span>
                <Check size={17} />
                {" خدمات الحي"}
              </span>
              <span>
                <Check size={17} />
                {" خيارات التسوق"}
              </span>
              <span>
                <Check size={17} />
                {" مدارس ومرافق تعليمية"}
              </span>
              <span>
                <Check size={17} />
                {" طرق الوصول"}
              </span>
            </div>
            <p className="property-location-note">
              هذه قائمة للمراجعة عند الزيارة؛ لم يتم تأكيد القرب أو المسافات في النموذج.
            </p>
          </>
        )}
      </section>
      <div className="property-detail-bottom">
        <div>
          <small>الوحدة المختارة</small>
          <strong>
            {unit.id}
            {" · "}
            {unit.area}
            {" م²"}
          </strong>
        </div>
        <button className="ghost-action" onClick={() => (contact ? contact(unit.id) : setTab("units"))}>
          <MessageCircleMore size={17} />
          {contact ? (isVisitor ? "سجّل دخولك للاستفسار" : "اسأل موظف المشروع") : "راجع الوحدات"}
        </button>
        <button className="primary-action" onClick={() => toggleSaved(unit.id)}>
          <CircleCheck size={17} />
          {interested ? "محفوظة للمعاينة" : "احفظ للمعاينة"}
        </button>
      </div>
      {interested && (
        <p className="property-saved-note" role="status">
          {"حفظنا اهتمامك بالوحدة "}
          {unit.id}
          {" داخل هذه الجلسة التجريبية. هذا لا ينشئ حجزًا أو طلب تمويل."}
        </p>
      )}
      <p className="property-demo-note">
        <Info size={17} />
        {" الصور تصورية والأسعار والمواصفات والتوفر بيانات تجريبية، ولا تمثل نشرة بيع رسمية."}
      </p>
    </div>
  );
}
const walletEntries = [
  {
    id: "TX-1048",
    date: "2026-09-04",
    label: "استحقاق صفقة مكتملة",
    deal: "HI-24071",
    state: "available",
    amount: 1200,
    note: "قيد إتاحة بعد اكتمال فترة التحقق التجريبية.",
  },
  {
    id: "TX-1046",
    date: "2026-09-02",
    label: "استحقاق قيد التحقق",
    deal: "HI-24081",
    state: "pending",
    amount: 600,
    note: "مثال لاستحقاق ينتظر انتهاء مدة التحقق، ولا يدخل في الرصيد المتاح.",
  },
  {
    id: "TX-1042",
    date: "2026-08-28",
    label: "تحويل مستحقات سابق",
    deal: "HI-24063",
    state: "paid",
    amount: 800,
    note: "قيد تحويل توضيحي يخفض الرصيد المتاح. لم يحدث تحويل بنكي حقيقي.",
  },
  {
    id: "TX-1040",
    date: "2026-08-27",
    label: "عكس استحقاق سابق",
    deal: "HI-24059",
    state: "reversed",
    amount: 200,
    note: "قيد تعويضي مستقل يعكس استحقاقًا متاحًا؛ السجل الأصلي محفوظ.",
  },
  {
    id: "TX-1038",
    date: "2026-08-24",
    label: "إتاحة مستحقات سابقة",
    deal: "HI-24059 / HI-24063",
    state: "available",
    amount: 1e3,
    note: "قيد إتاحة سابق مرتبط بقيود التحويل والعكس اللاحقة.",
  },
];
const stateLabels = {
  available: "متاح",
  pending: "قيد التحقق",
  paid: "محوّل",
  reversed: "معكوس",
};
export function WalletPanel({ bank }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [section, setSection] = useState("transactions");
  const entries = bank ? [] : walletEntries;
  const { available, pending, paid } = walletSummary(entries);
  const shown = entries.filter((row) => filter === "all" || row.state === filter);
  const exportLedger = () => {
    const rows = [
      ["رقم القيد", "التاريخ", "الوصف", "الصفقة", "الحالة", "المبلغ (ر.س)"],
      ...shown.map((row) => [
        row.id,
        row.date,
        row.label,
        row.deal,
        stateLabels[row.state],
        String(row.amount),
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob(["﻿" + rows.map((row) => row.map((cell) => csvCell(cell)).join(",")).join("\r\n")], {
        type: "text/csv;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "Deal_Line_Wallet_Demo.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  };
  return (
    <SpatialSurface>
      <div className="wallet-experience">
        <div className="wallet-balance">
          <div>
            <span>
              <Wallet size={20} />
              {" محفظة "}
              {bank ? "موظف مبيعات البنك" : "موظف مبيعات العقار"}
            </span>
            <small>{bank ? "بانتظار التفعيل" : "الرصيد المتاح · توضيحي"}</small>
            <strong>
              {money(available)} <em>ر.س</em>
            </strong>
          </div>
          <ShieldCheck size={56} />
          <p>{bank ? "لا توجد مستحقات مفعّلة على حسابك" : "عرض للمستحقات من سجل العمليات"}</p>
        </div>
        <div className="wallet-metrics">
          <div>
            <Clock3 size={19} />
            <small>قيد التحقق</small>
            <strong>
              {money(pending)} <em>ر.س</em>
            </strong>
          </div>
          <div>
            <MoveUpRight size={19} />
            <small>سبق تحويله</small>
            <strong>
              {money(paid)} <em>ر.س</em>
            </strong>
          </div>
        </div>
        {bank && (
          <div className="wallet-gate">
            <LockKeyhole size={21} />
            <div>
              <strong>عرض المحفظة متاح، والصرف غير مفعّل</strong>
              <p>
                تظهر المستحقات بعد اعتماد نموذج الحوافز وسياسة جهة العمل واستكمال المتطلبات النظامية. ما فيه
                عمليات صرف في هذه النسخة.
              </p>
            </div>
          </div>
        )}
        <div className="wallet-section-switch">
          <button
            className={section === "transactions" ? "active" : ""}
            aria-pressed={section === "transactions"}
            onClick={() => setSection("transactions")}
          >
            سجل العمليات
          </button>
          <button
            className={section === "policy" ? "active" : ""}
            aria-pressed={section === "policy"}
            onClick={() => setSection("policy")}
          >
            كيف تظهر مستحقاتي؟
          </button>
        </div>
        {section === "transactions" ? (
          <>
            <div className="wallet-toolbar">
              <label>
                الحالة
                <select
                  aria-label="فلترة عمليات المحفظة"
                  value={filter}
                  onChange={(event) => {
                    setFilter(event.target.value);
                    setSelected(null);
                  }}
                >
                  <option value="all">كل العمليات</option>
                  {Object.entries(stateLabels).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <button className="ghost-action" disabled={!shown.length} onClick={exportLedger}>
                <Download size={16} />
                {" تنزيل السجل"}
              </button>
            </div>
            <div className="wallet-ledger">
              {shown.map((row) => (
                <article key={row.id}>
                  <button
                    aria-expanded={selected === row.id}
                    onClick={() => setSelected(selected === row.id ? null : row.id)}
                  >
                    <span className={`ledger-icon ${row.state}`}>
                      {row.state === "pending" ? <Clock3 size={19} /> : <Wallet size={19} />}
                    </span>
                    <span>
                      <strong>{row.label}</strong>
                      <small>
                        {row.date}
                        {" · "}
                        {row.id}
                      </small>
                    </span>
                    <span>
                      <strong>
                        {row.state === "paid" || row.state === "reversed" ? "−" : "+"}
                        {money(row.amount)}
                        {" ر.س"}
                      </strong>
                      <small>{stateLabels[row.state]}</small>
                    </span>
                    <ChevronLeft size={17} />
                  </button>
                  {selected === row.id && (
                    <div className="ledger-detail">
                      <strong>
                        {"مرجع الصفقة: "}
                        <bdi>{row.deal}</bdi>
                      </strong>
                      <p>{row.note}</p>
                      <small>قيد توضيحي للعرض، وليس معاملة مالية حقيقية.</small>
                    </div>
                  )}
                </article>
              ))}
              {!shown.length && (
                <div className="wallet-empty">
                  <Wallet size={35} />
                  <h3>{bank ? "محفظتك جاهزة لاستقبال السجل" : "ما فيه عمليات بهذه الحالة"}</h3>
                  <p>
                    {bank
                      ? "بتظهر العمليات هنا عند تفعيل النموذج واعتماد المستحقات."
                      : "اختر حالة ثانية لعرض العمليات."}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="wallet-policy">
            <h3>كل مبلغ له حالة ومرجع</h3>
            <p>
              <Clock3 size={18} />
              {" قيد التحقق: استحقاق ينتظر اكتمال الشروط، ولا يُحسب ضمن المتاح."}
            </p>
            <p>
              <CircleCheck size={18} />
              {" المتاح: المستحقات التي أُتيحت، بعد خصم التحويلات والقيود العكسية."}
            </p>
            <p>
              <MoveUpRight size={18} />
              {" المحوّل: مبلغ مسجل كتحويل سابق في السجل التوضيحي."}
            </p>
            <p>
              <ShieldCheck size={18} />
              {" أي تصحيح يظهر كقيد مستقل، مع حفظ تاريخ العملية."}
            </p>
            <span>صرف المستحقات يخضع للسياسة المعتمدة؛ وجود المحفظة لا يعني استحقاقًا تلقائيًا.</span>
          </div>
        )}
        <p className="property-demo-note">
          <CircleQuestionMark size={17} />
          {bank
            ? "المحفظة للعرض فقط حتى اعتماد التفعيل."
            : "كل الأرصدة والقيود المعروضة تجريبية؛ التحويل والسحب الفعلي غير مفعّلين."}
        </p>
      </div>
    </SpatialSurface>
  );
}
