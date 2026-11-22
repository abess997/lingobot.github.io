// Recovered from the Deal Line production build (app/page.tsx). Types were stripped by the build and are not recoverable.
import { useEffect, useMemo, useState } from "react";
import { LiveWorkspace } from "../live/LiveWorkspace.jsx";
import {
  ArrowLeft,
  BadgeCheck,
  Bath,
  BedDouble,
  Bell,
  Bot,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CalendarClock,
  Check,
  ChevronLeft,
  CircleCheck,
  CircleQuestionMark,
  Clock3,
  CloudUpload,
  Download,
  Ellipsis,
  FileCheckCorner,
  FileText,
  FingerprintPattern,
  FolderLock,
  Headphones,
  House,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircleMore,
  Phone,
  Ruler,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  UsersRound,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { projects } from "./property-data";
import { ExperienceDialog, PropertyDetails, SpatialSurface, WalletPanel, WelcomePage } from "./experience";
import { csvCell, demoInventory, indicativePrincipal, periodRange, withinRange } from "./demo-domain";
import { DemoDocumentPicker } from "./quality-ui";

const buyerNav = [
  {
    key: "home",
    label: "الرئيسية",
    icon: House,
  },
  {
    key: "market",
    label: "اكتشف المشاريع",
    icon: Building2,
  },
  {
    key: "deal",
    label: "رحلة الصفقة",
    icon: LayoutDashboard,
  },
  {
    key: "offers",
    label: "عروض التمويل",
    icon: Landmark,
  },
  {
    key: "property",
    label: "العقار المحجوز",
    icon: Building2,
  },
  {
    key: "documents",
    label: "مستنداتي",
    icon: FolderLock,
  },
];
const salesNav = [
  {
    key: "home",
    label: "مساحة اليوم",
    icon: House,
  },
  {
    key: "leads",
    label: "Mini CRM",
    icon: UsersRound,
  },
  {
    key: "followups",
    label: "المتابعات",
    icon: CalendarClock,
  },
  {
    key: "deal",
    label: "صفقاتي",
    icon: BriefcaseBusiness,
  },
  {
    key: "calculator",
    label: "الحاسبة السريعة",
    icon: Calculator,
  },
];
const bankEmployeeNav = [
  {
    key: "home",
    label: "مساحة اليوم",
    icon: House,
  },
  {
    key: "applications",
    label: "الملفات الواردة",
    icon: Landmark,
  },
  {
    key: "leads",
    label: "Mini CRM",
    icon: UsersRound,
  },
  {
    key: "tasks",
    label: "النواقص والمهام",
    icon: FileCheckCorner,
  },
  {
    key: "deal",
    label: "صفقاتي",
    icon: BriefcaseBusiness,
  },
];
const developerNav = [
  {
    key: "home",
    label: "لوحة الإدارة",
    icon: LayoutDashboard,
  },
  {
    key: "inventory",
    label: "المشاريع والمخزون",
    icon: Building2,
  },
  {
    key: "reservations",
    label: "الحجوزات",
    icon: FileCheckCorner,
  },
  {
    key: "leads",
    label: "CRM الشركة",
    icon: UsersRound,
  },
  {
    key: "team",
    label: "تقارير المبيعات",
    icon: TrendingUp,
  },
  {
    key: "tracking",
    label: "تتبع بيع الصفقة",
    icon: BriefcaseBusiness,
  },
  {
    key: "storefront",
    label: "المتجر الإلكتروني",
    icon: House,
  },
];
const bankAdminNav = [
  {
    key: "home",
    label: "لوحة الإدارة",
    icon: LayoutDashboard,
  },
  {
    key: "queue",
    label: "طابور الطلبات",
    icon: Landmark,
  },
  {
    key: "leads",
    label: "CRM البنك",
    icon: UsersRound,
  },
  {
    key: "team",
    label: "أداء موظفي التمويل",
    icon: TrendingUp,
  },
  {
    key: "tracking",
    label: "تتبع طلبات التمويل",
    icon: BriefcaseBusiness,
  },
  {
    key: "rules",
    label: "سياسات البنك",
    icon: Settings,
  },
];
const platformAdminNav = [
  {
    key: "home",
    label: "نظرة تشغيلية",
    icon: LayoutDashboard,
  },
  {
    key: "organizations",
    label: "الجهات والمنظمات",
    icon: Building2,
  },
  {
    key: "integrations",
    label: "التكاملات",
    icon: Zap,
  },
  {
    key: "tracking",
    label: "الصفقات والمنصة",
    icon: BriefcaseBusiness,
  },
  {
    key: "audit",
    label: "التدقيق والامتثال",
    icon: ShieldCheck,
  },
  {
    key: "rules",
    label: "الإعدادات والفوترة",
    icon: Settings,
  },
];
const roleMeta = {
  buyer: {
    label: "لوحة العميل",
    subtitle: "رحلة تملكك في مكان واحد",
    name: "عباس السالم",
    initials: "ع",
  },
  sales: {
    label: "بوابة موظف مبيعات العقار",
    subtitle: "مساحة عمل المبيعات",
    name: "نورة العتيبي",
    initials: "ن",
  },
  developer: {
    label: "بوابة إدارة المطور العقاري",
    subtitle: "إدارة المشاريع والفريق",
    name: "مدير تلال العقارية",
    initials: "ت",
  },
  bankEmployee: {
    label: "بوابة موظف مبيعات البنك",
    subtitle: "ملفات التمويل المسندة",
    name: "فيصل الشهري",
    initials: "ف",
  },
  bankAdmin: {
    label: "بوابة إدارة البنك",
    subtitle: "الفريق والسياسات والأحمال",
    name: "مدير مصرف الراجحي",
    initials: "ر",
  },
  platformAdmin: {
    label: "إدارة منصة ديل لاين",
    subtitle: "التشغيل والتكاملات والامتثال",
    name: "إدارة المنصة",
    initials: "ح",
  },
};
const scopeAdditions = [
  "5.1 العميل/المشتري: يمكن للعميل التواصل مع البنك بعد اختيار الوحدة المطابقة.",
  "5.2 موظف مبيعات المطور: يمكنه التواصل والتنسيق مع موظف البنك عبر محادثة آمنة في حال حجز عميله واختياره للبنك لتقديم الدعم والمتابعة، ويظهر زر «متاح الآن» لاستقبال الطلبات له كما لدى موظف مبيعات البنك.",
  "5.4 موظف الجهة التمويلية: لديه Mini CRM خاص به، ويمكنه التواصل مع موظف مبيعات العقار عبر محادثة في نفس طلب العميل عند الحاجة إلى معلومات أو دعم للصفقة من الجهة العقارية.",
];
const journey = [
  {
    label: "تأكيد الهوية",
    meta: "مكتمل",
    done: true,
  },
  {
    label: "حجز الوحدة",
    meta: "مكتمل",
    done: true,
  },
  {
    label: "طلب التمويل",
    meta: "مكتمل",
    done: true,
  },
  {
    label: "مقارنة العروض",
    meta: "أنت هنا",
    active: true,
  },
  {
    label: "العقد",
    meta: "الخطوة التالية",
  },
  {
    label: "اكتمال الصفقة",
    meta: "—",
  },
];
const offers = [
  {
    bank: "مصرف الراجحي",
    mark: "ر",
    payment: "7,840",
    term: "25 سنة",
    down: "150,000 ر.س",
    color: "#0a8b78",
    rate: "نسبة سنوية تجريبية 4.18%",
  },
  {
    bank: "البنك الأهلي السعودي",
    mark: "أ",
    payment: "8,120",
    term: "20 سنة",
    down: "135,000 ر.س",
    color: "#196947",
    rate: "نسبة سنوية تجريبية 4.34%",
  },
  {
    bank: "مصرف الإنماء",
    mark: "إ",
    payment: "7,960",
    term: "25 سنة",
    down: "165,000 ر.س",
    color: "#7b5648",
    rate: "نسبة سنوية تجريبية 4.25%",
  },
];
const leadSeed = [
  {
    id: "LD-1842",
    name: "سلمان العتيبي",
    initials: "سع",
    project: "روابي الخبر",
    unit: "A-204",
    status: "متابعة اليوم",
    tone: "urgent",
    source: "المتجر",
    last: "قبل 18 دقيقة",
    next: "تأكيد موعد زيارة المعرض",
    sla: "متبقي 42 دقيقة",
    phone: "05•• ••• 2841",
    note: "مهتم بوحدة زاوية ويرغب بزيارة بعد الدوام.",
    eligibility: "ملخص أهلية مبدئي متاح",
    eligible: true,
  },
  {
    id: "LD-1839",
    name: "نجلاء القحطاني",
    initials: "نق",
    project: "تلال الواجهة",
    unit: "T-118",
    status: "عميل مؤهل",
    tone: "qualified",
    source: "معرض الظهران",
    last: "قبل ساعة",
    next: "اختيار الوحدة المناسبة",
    sla: "ضمن الوقت",
    phone: "05•• ••• 9175",
    note: "تفضّل الدور الأرضي وتحتاج مساحة لا تقل عن 220م².",
    eligibility: "ملخص أهلية مبدئي متاح",
    eligible: true,
  },
  {
    id: "LD-1835",
    name: "محمد الدوسري",
    initials: "مد",
    project: "واحة الدمام",
    unit: "لم يحدد",
    status: "بانتظار رد العميل",
    tone: "waiting",
    source: "إحالة",
    last: "أمس، 7:40 م",
    next: "إعادة التواصل الساعة 4:00 م",
    sla: "متبقي 3 ساعات",
    phone: "05•• ••• 5032",
    note: "يبحث عن تاون هاوس قريب من الخدمات.",
    eligibility: "لم يبدأ التحقق المبدئي",
    eligible: false,
  },
  {
    id: "LD-1827",
    name: "ريم الشمري",
    initials: "رش",
    project: "روابي الخبر",
    unit: "B-311",
    status: "جديد",
    tone: "new",
    source: "حملة رقمية",
    last: "قبل 6 دقائق",
    next: "أول اتصال",
    sla: "متبقي 54 دقيقة",
    phone: "05•• ••• 6628",
    note: "سجلت اهتمامها من صفحة المشروع.",
    eligibility: "لم يبدأ التحقق المبدئي",
    eligible: false,
  },
];
function HomePage() {
  // Deal Line merge: the office workspace backed by the real API (see src/live). #/office opens it directly.
  const [liveOpen, setLiveOpenState] = useState(() => window.location.hash === "#/office");
  const setLiveOpen = (open) => {
    setLiveOpenState(open);
    window.history.replaceState(null, "", open ? "#/office" : window.location.pathname + window.location.search);
  };
  const [signedIn, setSignedIn] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [walletOpen, setWalletOpen] = useState(false);
  const [savedUnits, setSavedUnits] = useState([]);
  const toggleSavedUnit = (unit) =>
    setSavedUnits((items) => (items.includes(unit) ? items.filter((id) => id !== unit) : [...items, unit]));
  const [propertyInquiry, setPropertyInquiry] = useState(null);
  const [nafathPending, setNafathPending] = useState(false);
  const [role, setRole] = useState("buyer");
  const [activeNav, setActiveNav] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [toast, setToast] = useState("");
  const [operationPreview, setOperationPreview] = useState(null);
  const [selectedLead, setSelectedLead] = useState(leadSeed[0]);
  const [leadDrawer, setLeadDrawer] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [qualified, setQualified] = useState(["LD-1839"]);
  const [sharedCalc, setSharedCalc] = useState("pending");
  const [aiOpen, setAiOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [availableNow, setAvailableNow] = useState(true);
  const navItems =
    role === "buyer"
      ? buyerNav
      : role === "sales"
        ? salesNav
        : role === "developer"
          ? developerNav
          : role === "bankEmployee"
            ? bankEmployeeNav
            : role === "bankAdmin"
              ? bankAdminNav
              : platformAdminNav;
  const meta = roleMeta[role];
  const chatEnabled = role === "buyer" || role === "sales" || role === "bankEmployee";
  const title = useMemo(
    () => navItems.find((item) => item.key === activeNav)?.label ?? "الرئيسية",
    [activeNav, navItems],
  );
  const showToast = (message) => {
    if (/^تم فتح|^تقرير SLA:|^جهّزنا نموذج|^تم تجهيز|^سجلنا طلب اتصال/.test(message)) {
      setOperationPreview(message.replace(/^تم فتح|^تم تجهيز|^جهّزنا/, "معاينة"));
      return;
    }
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };
  const navigate = (key) => {
    setActiveNav(key);
    setSidebarOpen(false);
    if (key === "calculator" && role === "sales") setCalculatorOpen(true);
    const target =
      (role === "developer" || role === "bankAdmin") && (key === "team" || key === "tracking")
        ? "operations"
        : key === "home"
          ? "top"
          : key;
    window.setTimeout(
      () =>
        document.getElementById(target)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      40,
    );
  };
  const openLead = (lead) => {
    setSelectedLead(lead);
    setLeadDrawer(true);
  };
  const openDetail = (kind, id) =>
    setDetail({
      kind,
      id,
    });
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const projectResults = projects
      .filter((p) => `${p.name} ${p.city} ${p.type}`.toLowerCase().includes(q))
      .map((p) => ({
        label: p.name,
        meta: `${p.city} • ${p.type}`,
        run: () => openDetail("project", p.name),
      }));
    const offerResults =
      role === "buyer"
        ? offers
            .filter((o) => o.bank.toLowerCase().includes(q))
            .map((o) => ({
              label: o.bank,
              meta: `عرض تمويلي • ${o.payment} ر.س`,
              run: () => openDetail("offer", o.bank),
            }))
        : [];
    const leadResults =
      role === "sales"
        ? leadSeed
            .filter((l) => `${l.name} ${l.project} ${l.unit} ${l.id}`.toLowerCase().includes(q))
            .map((l) => ({
              label: l.name,
              meta: `${l.project} • ${l.unit}`,
              run: () => openLead(l),
            }))
        : [];
    const bankResults =
      role === "bankEmployee" || role === "bankAdmin"
        ? financeApplications
            .filter((item) =>
              `${item.name} ${item.project} ${item.unit} ${item.id}`.toLowerCase().includes(q),
            )
            .map((item) => ({
              label: item.name,
              meta: `${item.id} • ${item.stage}`,
              run: () => openDetail("deal", item.name),
            }))
        : [];
    return [...projectResults, ...offerResults, ...leadResults, ...bankResults].slice(0, 6);
  }, [searchQuery, role]);
  if (liveOpen) return <LiveWorkspace exit={() => setLiveOpen(false)} />;
  if (welcomeOpen)
    return (
      <>
        <WelcomePage
          returning={signedIn}
          enter={() => {
            setWelcomeOpen(false);
            setDetail(null);
            window.scrollTo({
              top: 0,
              behavior: "instant",
            });
          }}
          browse={() =>
            document.getElementById("market")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <ProjectMarketplace
            navigate={() =>
              document.getElementById("market")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            openDetail={openDetail}
          />
        </WelcomePage>
        {detail?.kind === "project" && (
          <ExperienceDialog title={detail.id ?? "تفاصيل العقار"} close={() => setDetail(null)} wide>
            <PropertyDetails
              key={detail.id}
              savedUnits={savedUnits}
              toggleSaved={toggleSavedUnit}
              project={projects.find((p) => p.name === detail.id) ?? projects[0]}
              isVisitor={!signedIn}
              contact={(unit) => {
                setPropertyInquiry({
                  name: detail.id ?? projects[0].name,
                  unit,
                });
                setDetail(null);
                setWelcomeOpen(false);
                if (signedIn) setChatOpen(true);
                window.scrollTo({
                  top: 0,
                  behavior: "instant",
                });
              }}
            />
          </ExperienceDialog>
        )}
      </>
    );
  if (!signedIn)
    return (
      <PortalLogin
        welcome={() => setWelcomeOpen(true)}
        pending={nafathPending}
        begin={() => setNafathPending(true)}
        complete={() => {
          setSignedIn(true);
          setRole("buyer");
          setActiveNav("home");
          if (propertyInquiry) setChatOpen(true);
        }}
        portal={(next) => {
          if (next === "live") {
            setLiveOpen(true);
            return;
          }
          setSignedIn(true);
          setRole(next);
          setAvailableNow(true);
          setNoticeOpen(false);
          setToast("");
          setOperationPreview(null);
          setActiveNav("home");
        }}
      />
    );
  return (
    <SpatialSurface>
      <main className={`app-shell ${role !== "buyer" ? "sales-mode" : ""}`} data-portal={role} dir="rtl">
        <div
          className={`mobile-overlay ${sidebarOpen ? "show" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="التنقل الرئيسي">
          <div className="brand-row">
            <div className="brand-mark">
              <span>د</span>
              <i />
            </div>
            <div>
              <strong>ديل لاين</strong>
              <small>{meta.subtitle}</small>
            </div>
            <button
              className="icon-button close-sidebar"
              onClick={() => setSidebarOpen(false)}
              aria-label="إغلاق القائمة"
            >
              <X size={20} />
            </button>
          </div>
          <div className="profile-card">
            <div className="avatar">{meta.initials}</div>
            <div className="profile-copy">
              <span>{meta.label}</span>
              <strong>{meta.name}</strong>
            </div>
            <button className="more-button" aria-label="خيارات الحساب" onClick={() => openDetail("account")}>
              <Ellipsis size={20} />
            </button>
          </div>
          <nav className="main-nav">
            <span className="nav-label">{role === "buyer" ? "حسابي" : "عملي"}</span>
            {navItems.map(({ key, label, icon: Icon }) => (
              <button key={key} className={activeNav === key ? "active" : ""} onClick={() => navigate(key)}>
                <Icon size={19} strokeWidth={1.9} />
                <span>{label}</span>
              </button>
            ))}
            <span className="nav-label second">المساعدة</span>
            {role === "buyer" && (
              <button
                onClick={() => {
                  setWelcomeOpen(true);
                  window.scrollTo({
                    top: 0,
                    behavior: "instant",
                  });
                }}
              >
                <CircleQuestionMark size={19} />
                <span>تعرّف على ديل لاين</span>
              </button>
            )}
            {chatEnabled && (
              <button onClick={() => setChatOpen(true)}>
                <MessageCircleMore size={19} />
                <span>المحادثات</span>
              </button>
            )}
            <button onClick={() => openDetail("scope")}>
              <FileText size={19} />
              <span>إضافات نطاق المشروع</span>
            </button>
            <button onClick={() => openDetail("support")}>
              <Headphones size={19} />
              <span>الدعم والمساعدة</span>
            </button>
          </nav>
          <div className="sidebar-trust">
            <ShieldCheck size={20} />
            <div>
              <strong>{role === "buyer" ? "بياناتك محمية" : "وصول حسب الصلاحية"}</strong>
              <span>
                {role === "buyer"
                  ? "لا نشاركها دون موافقتك"
                  : role === "sales" || role === "bankEmployee"
                    ? "ترى فقط الطلبات المسندة لك"
                    : role === "developer"
                      ? "بيانات شركة المطور وفريقها فقط"
                      : role === "bankAdmin"
                        ? "بيانات البنك وفريقه فقط"
                        : "وصول تشغيلي مقيد ومسجل"}
              </span>
            </div>
          </div>
          <div className="sidebar-footer">
            <button
              onClick={() => {
                setSignedIn(false);
                setChatOpen(false);
                setNoticeOpen(false);
                setWalletOpen(false);
                setSavedUnits([]);
                setPropertyInquiry(null);
                setDetail(null);
                setAiOpen(false);
                setLeadDrawer(false);
                setCalculatorOpen(false);
                setSearchQuery("");
                setSearchOpen(false);
              }}
            >
              <LockKeyhole size={17} />
              {" تسجيل الخروج"}
            </button>
            <span>نسخة تفاعلية تجريبية</span>
          </div>
        </aside>
        <section className="workspace" id="top">
          <header className="topbar">
            <div className="topbar-start">
              <button
                className="icon-button menu-button"
                onClick={() => setSidebarOpen(true)}
                aria-label="فتح القائمة"
              >
                <Menu size={22} />
              </button>
              <div>
                <small>{meta.label}</small>
                <h1>{title}</h1>
              </div>
            </div>
            <div className="topbar-actions">
              <div className="global-search">
                <label className="search-box">
                  <Search size={18} />
                  <input
                    aria-label="بحث"
                    value={searchQuery}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setSearchOpen(true);
                    }}
                    placeholder={
                      role === "buyer" ? "ابحث في المشاريع والعروض..." : "ابحث باسم العميل أو الوحدة..."
                    }
                  />
                </label>
                {searchOpen && searchQuery && (
                  <div className="search-results">
                    <div>
                      <strong>نتائج البحث</strong>
                      <button onClick={() => setSearchOpen(false)}>
                        <X size={15} />
                      </button>
                    </div>
                    {searchResults.length ? (
                      searchResults.map((result) => (
                        <button
                          key={`${result.label}-${result.meta}`}
                          onClick={() => {
                            result.run();
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          <Search size={16} />
                          <span>
                            <strong>{result.label}</strong>
                            <small>{result.meta}</small>
                          </span>
                          <ChevronLeft size={16} />
                        </button>
                      ))
                    ) : (
                      <p>ما لقينا نتيجة مطابقة. جرّب اسم مشروع، بنك، عميل أو وحدة.</p>
                    )}
                  </div>
                )}
              </div>
              {(role === "sales" || role === "bankEmployee") && (
                <button
                  className="icon-button wallet-top-button"
                  title="المحفظة"
                  aria-label="فتح المحفظة"
                  onClick={() => setWalletOpen(true)}
                >
                  <Wallet size={22} />
                  <span>المحفظة</span>
                </button>
              )}
              {chatEnabled && (
                <button
                  className="icon-button chat-top-button"
                  aria-label="المحادثات"
                  onClick={() => setChatOpen(true)}
                >
                  <MessageCircleMore size={20} />
                  <i />
                </button>
              )}
              <button
                className="icon-button notification-button"
                aria-label="الإشعارات"
                onClick={() => setNoticeOpen(!noticeOpen)}
              >
                <Bell size={20} />
                <i />
              </button>
              <button
                className="help-button"
                onClick={() =>
                  role === "sales"
                    ? setCalculatorOpen(true)
                    : chatEnabled
                      ? setChatOpen(true)
                      : openDetail("support")
                }
              >
                {role === "sales" ? (
                  <Calculator size={18} />
                ) : chatEnabled ? (
                  <MessageCircleMore size={18} />
                ) : (
                  <Headphones size={18} />
                )}
                <span>{role === "sales" ? "حسبة سريعة" : chatEnabled ? "فتح المحادثة" : "الدعم"}</span>
              </button>
            </div>
            {noticeOpen && (
              <Notifications
                role={role}
                close={() => setNoticeOpen(false)}
                openDetail={(id) => {
                  setNoticeOpen(false);
                  openDetail("notification", id);
                }}
              />
            )}
          </header>
          <div className="demo-environment" role="status">
            <ShieldCheck size={17} />
            <span>
              <strong>بيئة تجريبية</strong>
              {" · بيانات توضيحية. نفاذ والبنوك والمدفوعات غير متصلة بخدمات حقيقية."}
            </span>
          </div>
          <div key={role} className="portal-stage">
            {role === "buyer" ? (
              <BuyerDashboard
                uploaded={uploaded}
                setUploaded={setUploaded}
                showToast={showToast}
                navigate={navigate}
                openChat={() => setChatOpen(true)}
                sharedCalc={sharedCalc}
                approveCalc={() => {
                  setSharedCalc("approved");
                  showToast("تمت الموافقة التجريبية وربط الحسبة داخل الجلسة");
                }}
                openAi={() => setAiOpen(true)}
                openDetail={openDetail}
                selectedOffer={selectedOffer}
              />
            ) : role === "sales" ? (
              <SalesDashboard
                openLead={openLead}
                openCalculator={() => setCalculatorOpen(true)}
                showToast={showToast}
                qualified={qualified}
                openDetail={openDetail}
                openChat={() => setChatOpen(true)}
                available={availableNow}
                toggleAvailable={() => setAvailableNow((value) => !value)}
              />
            ) : role === "developer" ? (
              <DeveloperAdminDashboard activeNav={activeNav} showToast={showToast} openDetail={openDetail} />
            ) : role === "bankEmployee" ? (
              <BankDashboard
                showToast={showToast}
                openChat={() => setChatOpen(true)}
                openDetail={openDetail}
                available={availableNow}
                toggleAvailable={() => setAvailableNow((value) => !value)}
              />
            ) : role === "bankAdmin" ? (
              <BankAdminDashboard activeNav={activeNav} showToast={showToast} openDetail={openDetail} />
            ) : (
              <PlatformAdminDashboard showToast={showToast} openDetail={openDetail} />
            )}
          </div>
        </section>
        {role === "buyer" && (
          <BuyerChat
            key={propertyInquiry ? `${propertyInquiry.name}-${propertyInquiry.unit}` : "default"}
            projectContext={propertyInquiry}
            open={chatOpen}
            close={() => setChatOpen(false)}
            showToast={showToast}
          />
        )}
        {role === "sales" && (
          <SalesChat open={chatOpen} close={() => setChatOpen(false)} showToast={showToast} />
        )}
        {role === "bankEmployee" && (
          <BankChat open={chatOpen} close={() => setChatOpen(false)} showToast={showToast} />
        )}
        {role === "sales" && (
          <LeadDrawer
            lead={selectedLead}
            open={leadDrawer}
            close={() => setLeadDrawer(false)}
            qualified={qualified.includes(selectedLead.id)}
            onQualify={() => {
              setQualified((items) => [...new Set([...items, selectedLead.id])]);
              showToast("تم تحديث الحالة إلى عميل مؤهل");
            }}
            openChat={() => {
              setLeadDrawer(false);
              setChatOpen(true);
            }}
            showToast={showToast}
          />
        )}
        {role === "sales" && (
          <QuickCalculator
            open={calculatorOpen}
            close={() => setCalculatorOpen(false)}
            showToast={showToast}
            onShare={() => setSharedCalc("pending")}
          />
        )}
        {role === "buyer" && (
          <AiAssistant open={aiOpen} close={() => setAiOpen(false)} showToast={showToast} />
        )}
        {walletOpen && (role === "sales" || role === "bankEmployee") && (
          <ExperienceDialog title="محفظتي" close={() => setWalletOpen(false)}>
            <WalletPanel bank={role === "bankEmployee"} />
          </ExperienceDialog>
        )}
        {detail?.kind === "project" && (
          <ExperienceDialog title={detail.id ?? "تفاصيل العقار"} close={() => setDetail(null)} wide>
            <PropertyDetails
              key={detail.id}
              savedUnits={savedUnits}
              toggleSaved={toggleSavedUnit}
              project={projects.find((p) => p.name === detail.id) ?? projects[0]}
              contact={
                role === "buyer"
                  ? (unit) => {
                      setPropertyInquiry({
                        name: detail.id ?? projects[0].name,
                        unit,
                      });
                      setDetail(null);
                      setChatOpen(true);
                    }
                  : void 0
              }
            />
          </ExperienceDialog>
        )}
        <DetailModal
          role={role}
          logout={() => {
            setSignedIn(false);
            setDetail(null);
            setChatOpen(false);
            setWalletOpen(false);
            setNoticeOpen(false);
            setSearchQuery("");
          }}
          detail={detail?.kind === "project" ? null : detail}
          close={() => setDetail(null)}
          openChat={() => {
            setDetail(null);
            setChatOpen(true);
          }}
          showToast={showToast}
          selectedOffer={selectedOffer}
          selectOffer={(bank) => {
            setSelectedOffer(bank);
            showToast(`حفظنا ${bank} كخيارك للمراجعة`);
          }}
        />
        {role === "buyer" && (
          <button className="ai-fab" onClick={() => setAiOpen(true)} aria-label="افتح مساعد ديل لاين الذكي">
            <Sparkles size={19} />
            <span>اسأل ديل لاين</span>
          </button>
        )}
        {operationPreview && (
          <ExperienceDialog title={operationPreview} close={() => setOperationPreview(null)}>
            <section className="operation-preview">
              <CircleQuestionMark size={32} />
              <h3>هذه العملية تحتاج ربطًا تشغيليًا</h3>
              <p>
                الواجهة تعرض النموذج التجريبي فقط. لا توجد بيانات مباشرة أو خدمة خارجية متصلة بهذا الإجراء،
                ولم يتم إرسال طلب أو تغيير بيانات في جهة أخرى.
              </p>
              <button className="ghost-action" onClick={() => setOperationPreview(null)}>
                رجوع للبوابة
              </button>
            </section>
          </ExperienceDialog>
        )}
        {toast && (
          <div className="toast" role="status">
            <CircleCheck size={19} />
            {toast}
          </div>
        )}
      </main>
    </SpatialSurface>
  );
}
function PortalLogin({ pending, begin, complete, portal, welcome }) {
  return (
    <SpatialSurface>
      <main className="login-shell" dir="rtl">
        <section className="login-story">
          <div className="login-brand">
            <span className="brand-mark">
              <span>د</span>
              <i />
            </span>
            <strong>ديل لاين</strong>
          </div>
          <div className="story-copy">
            <span className="login-kicker">
              <Sparkles size={15} />
              {" تملك بيتك بوضوح"}
            </span>
            <h1>
              من أول حسبة
              <br />
              إلى مفتاح بيتك.
            </h1>
            <p>مشاريع، حسبة تمويل، عروض ومتابعة الصفقة—كلها في تجربة سعودية واحدة، سهلة وواضحة.</p>
          </div>
          <div className="story-cards">
            <article>
              <ShieldCheck size={20} />
              <strong>خصوصية من البداية</strong>
              <span>أنت تحدد وش توافق عليه ومين يشوفه.</span>
            </article>
            <article>
              <LayoutDashboard size={20} />
              <strong>خطوتك واضحة</strong>
              <span>نعلمك وين وصلت وش المطلوب منك.</span>
            </article>
          </div>
          <div className="login-orbit orbit-one" />
          <div className="login-orbit orbit-two" />
        </section>
        <section className="login-panel">
          <div className="login-box portal-login-box">
            <button className="back-to-welcome" onClick={welcome}>
              <ArrowLeft size={17} />
              {" تعرّف على ديل لاين واستكشف العقارات"}
            </button>
            <div className="client-login-card">
              <span className="nafath-symbol">
                <FingerprintPattern size={29} />
              </span>
              {!pending ? (
                <>
                  <div>
                    <span className="eyebrow">دخول العميل المستقل</span>
                    <h2>بوابة العميل</h2>
                    <p>الدخول عبر نفاذ للوصول إلى العقارات والحسبة والطلب والمستندات.</p>
                  </div>
                  <button className="nafath-button" onClick={begin}>
                    <FingerprintPattern size={20} />
                    {" تجربة دخول العميل "}
                    <ArrowLeft size={18} />
                  </button>
                  <div className="login-assurance">
                    <LockKeyhole size={15} />
                    {" لا يمكن الانتقال من حساب العميل إلى بوابات الجهات"}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="eyebrow">بانتظار موافقتك</span>
                    <h2>محاكاة التحقق عبر نفاذ</h2>
                    <p>هذه محاكاة للعرض؛ لا يوجد طلب حقيقي في تطبيق نفاذ.</p>
                  </div>
                  <div className="nafath-code">
                    <small>رمز التحقق</small>
                    <strong>47</strong>
                    <span>
                      <i />
                      {" رمز عرض ثابت · لا يوجد طلب توثيق حقيقي"}
                    </span>
                  </div>
                  <button className="nafath-button" onClick={complete}>
                    <CircleCheck size={20} />
                    {" متابعة التجربة كعميل"}
                  </button>
                </>
              )}
            </div>
            <div className="portal-divider">
              <span>بوابات الجهات والموظفين — دخول مستقل حسب الصلاحية</span>
            </div>
            <div className="portal-login-grid">
              {[
                {
                  role: "live",
                  icon: Zap,
                  title: "المكتب العقاري والمطور — متصل بالخادم",
                  copy: "منشئ الموقع، المخزون، العملاء، الخارطة والأتمتة ببيانات حقيقية",
                },
                {
                  role: "sales",
                  icon: UserRound,
                  title: "موظف مبيعات العقار",
                  copy: "عملائي، الحاسبة السريعة وصفقاتي",
                },
                {
                  role: "developer",
                  icon: Building2,
                  title: "إدارة المطور العقاري",
                  copy: "المشاريع، المخزون، CRM والفريق",
                },
                {
                  role: "bankEmployee",
                  icon: Landmark,
                  title: "موظف مبيعات البنك",
                  copy: "الملفات المسندة، Mini CRM والعروض",
                },
                {
                  role: "bankAdmin",
                  icon: LayoutDashboard,
                  title: "إدارة البنك",
                  copy: "الأحمال، الموظفون والسياسات",
                },
                {
                  role: "platformAdmin",
                  icon: Settings,
                  title: "إدارة المنصة",
                  copy: "الجهات، التكاملات والامتثال",
                },
              ].map(({ role, icon: Icon, title, copy }) => (
                <button key={role} onClick={() => portal(role)}>
                  <span>
                    <Icon size={19} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <small>{copy}</small>
                  </div>
                  <ArrowLeft size={17} />
                </button>
              ))}
            </div>
            <p className="portal-security-note">
              <ShieldCheck size={15} />
              {" كل بوابة لها صلاحياتها وبياناتها؛ لا يوجد تبديل أدوار من داخل الحساب."}
            </p>
          </div>
          <footer>
            <span>ديل لاين — منتج سعودي</span>
            <span>نسخة تفاعلية • تكامل نفاذ غير مفعّل بعد</span>
          </footer>
        </section>
      </main>
    </SpatialSurface>
  );
}
function Notifications({ role, close, openDetail }) {
  return (
    <div className="notifications-popover">
      <div>
        <strong>الإشعارات</strong>
        <button onClick={close}>
          <X size={17} />
        </button>
      </div>
      {role === "sales" ? (
        <>
          <button className="notice-row" onClick={() => openDetail("followup")}>
            <span className="notice-icon">
              <Clock3 size={18} />
            </span>
            <p>
              <strong>متابعة تستحق الآن</strong>
              <small>سلمان العتيبي ينتظر تأكيد موعد الزيارة.</small>
              <time>منذ 4 دقائق</time>
            </p>
            <ChevronLeft size={16} />
          </button>
          <button className="notice-row" onClick={() => openDetail("newLead")}>
            <span className="notice-icon green">
              <UsersRound size={18} />
            </span>
            <p>
              <strong>عميل جديد أُسند إليك</strong>
              <small>ريم الشمري مهتمة بمشروع روابي الخبر.</small>
              <time>منذ 6 دقائق</time>
            </p>
            <ChevronLeft size={16} />
          </button>
        </>
      ) : role === "bankEmployee" ? (
        <>
          <button className="notice-row" onClick={() => openDetail("followup")}>
            <span className="notice-icon">
              <Clock3 size={18} />
            </span>
            <p>
              <strong>طلب جديد بانتظار القبول</strong>
              <small>سلمان العتيبي • الوحدة A-208.</small>
              <time>منذ 3 دقائق</time>
            </p>
            <ChevronLeft size={16} />
          </button>
          <button className="notice-row" onClick={() => openDetail("document")}>
            <span className="notice-icon green">
              <MessageCircleMore size={18} />
            </span>
            <p>
              <strong>رد من موظفة المطور</strong>
              <small>تم رفع عرض سعر الوحدة T-118.</small>
              <time>منذ 5 دقائق</time>
            </p>
            <ChevronLeft size={16} />
          </button>
        </>
      ) : role === "buyer" ? (
        <>
          <button className="notice-row" onClick={() => openDetail("document")}>
            <span className="notice-icon">
              <FileText size={18} />
            </span>
            <p>
              <strong>مستند جديد مطلوب</strong>
              <small>ارفع كشف الحساب لاستكمال مراجعة الطلب.</small>
              <time>منذ 12 دقيقة</time>
            </p>
            <ChevronLeft size={16} />
          </button>
          <button className="notice-row" onClick={() => openDetail("newOffer")}>
            <span className="notice-icon green">
              <Landmark size={18} />
            </span>
            <p>
              <strong>وصل عرض تمويلي جديد</strong>
              <small>لديك الآن 3 عروض جاهزة للمقارنة.</small>
              <time>اليوم، 10:42 ص</time>
            </p>
            <ChevronLeft size={16} />
          </button>
        </>
      ) : (
        <>
          <button className="notice-row" onClick={() => openDetail("management")}>
            <span className="notice-icon">
              <ShieldCheck size={18} />
            </span>
            <p>
              <strong>تنبيه إداري جديد</strong>
              <small>يوجد إجراء يحتاج مراجعة ضمن صلاحيات بوابتك.</small>
              <time>منذ 8 دقائق</time>
            </p>
            <ChevronLeft size={16} />
          </button>
          <button className="notice-row" onClick={() => openDetail("managementReport")}>
            <span className="notice-icon green">
              <TrendingUp size={18} />
            </span>
            <p>
              <strong>اكتمل التقرير اليومي</strong>
              <small>ملخص الأداء وSLA جاهز للمراجعة.</small>
              <time>اليوم، 11:00 ص</time>
            </p>
            <ChevronLeft size={16} />
          </button>
        </>
      )}
    </div>
  );
}
function SalesDashboard({
  openLead,
  openCalculator,
  showToast,
  qualified,
  openDetail,
  openChat,
  available,
  toggleAvailable,
}) {
  const reservedLeadCount = leadSeed.filter((lead) =>
    ["نجلاء القحطاني", "عبدالله الحربي", "مشاعل الغامدي"].includes(lead.name),
  ).length;
  const [crmFilter, setCrmFilter] = useState("الكل");
  const [crmQuery, setCrmQuery] = useState("");
  const crmLeads = leadSeed.filter((lead) => {
    const matchesQuery = `${lead.name} ${lead.project} ${lead.unit} ${lead.id}`.includes(crmQuery.trim());
    const currentStatus = qualified.includes(lead.id)
      ? "مؤهل"
      : lead.tone === "urgent"
        ? "متابعة اليوم"
        : lead.tone === "waiting"
          ? "بانتظار العميل"
          : "جديد";
    return matchesQuery && (crmFilter === "الكل" || crmFilter === currentStatus);
  });
  return (
    <div className="content-wrap sales-content">
      <section className="welcome-row sales-welcome">
        <div>
          <span className="eyebrow">
            <Sparkles size={14} />
            {" صباح الخير يا نورة"}
          </span>
          <h2>فرصك اليوم، أقرب للإغلاق.</h2>
          <p>رتبنا العملاء حسب الوقت والأولوية. ابدئي بالأعلى، والباقي تحت السيطرة.</p>
        </div>
        <button
          className={`shift-status availability-toggle ${available ? "online" : "offline"}`}
          onClick={toggleAvailable}
        >
          <span>
            <i /> {available ? "متاحة الآن لاستقبال الطلبات" : "غير متاحة لاستقبال الطلبات"}
          </span>
          <small>{available ? "اضغطي لإيقاف الاستقبال" : "اضغطي لتفعيل الاستقبال"}</small>
        </button>
      </section>
      <section className="sales-kpis" aria-label="ملخص الأداء اليومي">
        <button onClick={() => openDetail("performance", "followups")}>
          <span className="kpi-icon coral">
            <CalendarClock size={20} />
          </span>
          <div>
            <small>متابعات اليوم</small>
            <strong>4</strong>
            <em>2 خلال ساعة</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => {
            setCrmFilter("الكل");
            document.getElementById("leads")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <span className="kpi-icon mint">
            <UsersRound size={20} />
          </span>
          <div>
            <small>عملاء مسندون</small>
            <strong>{leadSeed.length}</strong>
            <em>حسب قائمة العملاء</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => {
            setCrmFilter("مؤهل");
            document.getElementById("leads")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <span className="kpi-icon blue">
            <BadgeCheck size={20} />
          </span>
          <div>
            <small>عملاء مؤهلون</small>
            <strong>{qualified.length}</strong>
            <em>{Math.round((qualified.length / leadSeed.length) * 100)}% من النشطين</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => openDetail("performance", "reservations")}>
          <span className="kpi-icon gold">
            <Building2 size={20} />
          </span>
          <div>
            <small>حجوزات نشطة</small>
            <strong>3</strong>
            <em>لا توجد حجوزات متعثرة</em>
          </div>
          <ChevronLeft size={16} />
        </button>
      </section>
      <section className="focus-card" id="followups">
        <div className="focus-top">
          <div>
            <span className="focus-mark">
              <Zap size={20} />
            </span>
            <div>
              <span className="eyebrow">ابدئي من هنا</span>
              <h3>تأكيد زيارة سلمان للمعرض</h3>
              <p>موعد المتابعة يستحق خلال 42 دقيقة • مشروع روابي الخبر</p>
            </div>
          </div>
          <span className="sla-chip urgent">
            <Clock3 size={14} />
            {" متبقي 42 دقيقة"}
          </span>
        </div>
        <div className="focus-person">
          <span className="lead-avatar">سع</span>
          <div>
            <strong>سلمان العتيبي</strong>
            <small>آخر تواصل قبل 18 دقيقة • مهتم بالوحدة A-204</small>
          </div>
          <button className="ghost-action" onClick={() => openLead(leadSeed[0])}>
            فتح الملف
          </button>
          <button className="primary-action" onClick={() => showToast("تم تسجيل محاولة التواصل في النشاط")}>
            <Phone size={17} />
            {" تسجيل اتصال"}
          </button>
        </div>
      </section>
      <div className="sales-grid">
        <section className="panel lead-queue sales-mini-crm" id="leads">
          <div className="panel-head">
            <div>
              <span className="eyebrow">
                <UsersRound size={14} />
                {" خاص بعملائك المسندين"}
              </span>
              <h3>Mini CRM موظف المبيعات</h3>
              <p>إدارة العميل والاهتمام والمتابعة والخطوة التالية من سجل واحد</p>
            </div>
            <button onClick={() => showToast("تم تحديث ترتيب الأولويات ومواعيد المتابعة")}>
              تحديث القائمة
            </button>
          </div>
          <div className="mini-crm-toolbar">
            <label>
              <Search size={16} />
              <input
                aria-label="بحث داخل Mini CRM"
                value={crmQuery}
                onChange={(event) => setCrmQuery(event.target.value)}
                placeholder="اسم العميل، المشروع أو الوحدة"
              />
            </label>
            <div>
              {["الكل", "جديد", "متابعة اليوم", "مؤهل", "بانتظار العميل"].map((item) => (
                <button
                  key={item}
                  className={crmFilter === item ? "active" : ""}
                  onClick={() => setCrmFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mini-crm-summary">
            <button onClick={() => setCrmFilter("الكل")}>
              <strong>{leadSeed.length}</strong>
              <span>كل العملاء</span>
            </button>
            <button onClick={() => setCrmFilter("متابعة اليوم")}>
              <strong>{leadSeed.filter((lead) => lead.tone === "urgent").length}</strong>
              <span>متابعة اليوم</span>
            </button>
            <button onClick={() => setCrmFilter("مؤهل")}>
              <strong>{qualified.length}</strong>
              <span>مؤهلون</span>
            </button>
            <button onClick={() => setCrmFilter("بانتظار العميل")}>
              <strong>{leadSeed.filter((lead) => lead.tone === "waiting").length}</strong>
              <span>بانتظار رد</span>
            </button>
          </div>
          <div className="lead-list">
            {crmLeads.map((lead) => (
              <button key={lead.id} className="lead-row" onClick={() => openLead(lead)}>
                <span className="lead-avatar">{lead.initials}</span>
                <span className="lead-identity">
                  <strong>{lead.name}</strong>
                  <small>
                    {lead.project}
                    {" • "}
                    {lead.unit}
                  </small>
                </span>
                <span className={`status-pill ${qualified.includes(lead.id) ? "qualified" : lead.tone}`}>
                  {qualified.includes(lead.id) ? "عميل مؤهل" : lead.status}
                </span>
                <span className="lead-next">
                  <small>الإجراء التالي</small>
                  <strong>{lead.next}</strong>
                </span>
                <span className={`lead-sla ${lead.tone === "urgent" ? "urgent" : ""}`}>
                  <Clock3 size={13} /> {lead.sla}
                </span>
                <ChevronLeft size={18} />
              </button>
            ))}
            {!crmLeads.length && (
              <div className="crm-empty">
                <Search size={21} />
                <strong>ما فيه عملاء مطابقين</strong>
                <span>غيّر الفلتر أو كلمة البحث.</span>
              </div>
            )}
          </div>
        </section>
        <aside className="sales-side">
          <section className="panel pulse-card">
            <div className="panel-head">
              <div>
                <h3>نبض مسارك</h3>
                <p>من العملاء المسندين لك فقط</p>
              </div>
              <TrendingUp size={19} />
            </div>
            <div className="funnel">
              <div>
                <span>{leadSeed.length}</span>
                <small>نشط</small>
              </div>
              <i />
              <div>
                <span>{qualified.length}</span>
                <small>مؤهل</small>
              </div>
              <i />
              <div>
                <span>{reservedLeadCount}</span>
                <small>حجز</small>
              </div>
            </div>
            <div className="progress-label">
              <span>التحويل إلى حجز</span>
              <strong>{Math.round((reservedLeadCount / leadSeed.length) * 100)}%</strong>
            </div>
            <div className="progress-track">
              <i
                style={{
                  width: `${(reservedLeadCount / leadSeed.length) * 100}%`,
                }}
              />
            </div>
            <p className="privacy-copy">
              <LockKeyhole size={15} />
              {" تظهر لك حالة الأهلية المختصرة فقط، دون الدخل أو الالتزامات أو عروض البنوك."}
            </p>
          </section>
          <button className="calculator-launch" id="calculator" onClick={openCalculator}>
            <span>
              <Calculator size={23} />
            </span>
            <div>
              <small>للعميل أمامك الآن</small>
              <strong>افتح الحاسبة السريعة</strong>
              <p>نتيجة مبدئية خلال أقل من دقيقة</p>
            </div>
            <ArrowLeft size={20} />
          </button>
          <section className="panel reservation-mini" id="deal">
            <div className="panel-head">
              <div>
                <h3>الصفقات النشطة</h3>
                <p>آخر حالة تشغيلية</p>
              </div>
              <span>3</span>
            </div>
            <button onClick={() => openDetail("activeDeal", "نجلاء القحطاني")}>
              <span className="deal-dot green" />
              <p>
                <strong>نجلاء القحطاني</strong>
                <small>الحجز مؤكد • اختيار التمويل</small>
              </p>
              <em>ضمن الوقت</em>
              <ChevronLeft size={15} />
            </button>
            <button onClick={() => openDetail("activeDeal", "عبدالله الحربي")}>
              <span className="deal-dot amber" />
              <p>
                <strong>عبدالله الحربي</strong>
                <small>بانتظار مستند من العميل</small>
              </p>
              <em>متبقي 5 س</em>
              <ChevronLeft size={15} />
            </button>
            <button onClick={() => openDetail("activeDeal", "مشاعل الغامدي")}>
              <span className="deal-dot blue" />
              <p>
                <strong>مشاعل الغامدي</strong>
                <small>مرحلة التعاقد</small>
              </p>
              <em>محدثة اليوم</em>
              <ChevronLeft size={15} />
            </button>
            <button className="bank-coordination" onClick={openChat}>
              <span className="deal-dot green" />
              <p>
                <strong>تنسيق مع موظف البنك</strong>
                <small>صفقة نجلاء • مصرف الراجحي</small>
              </p>
              <em>محادثة آمنة</em>
              <MessageCircleMore size={15} />
            </button>
          </section>
        </aside>
      </div>
      <footer>
        <span>© 2026 ديل لاين</span>
        <div>
          <button onClick={() => openDetail("privacy", "privacy")}>الخصوصية</button>
          <button onClick={() => openDetail("privacy", "access")}>سياسة الوصول</button>
          <button onClick={() => openDetail("support")}>الدعم</button>
        </div>
        <span className="saudi">
          <i />
          {" صُممت في السعودية"}
        </span>
      </footer>
    </div>
  );
}
const financeApplications = [
  {
    id: "FN-2841",
    name: "نجلاء القحطاني",
    project: "تلال الواجهة",
    unit: "T-118",
    stage: "مراجعة المستندات",
    sla: "متبقي 1:20 س",
    status: "urgent",
  },
  {
    id: "FN-2838",
    name: "عباس السالم",
    project: "روابي الخبر",
    unit: "A-204",
    stage: "بانتظار مستند",
    sla: "متبقي 5 ساعات",
    status: "waiting",
  },
  {
    id: "FN-2829",
    name: "مشاعل الغامدي",
    project: "واحة الدمام",
    unit: "B-311",
    stage: "العرض جاهز",
    sla: "ضمن الوقت",
    status: "qualified",
  },
  {
    id: "FN-2824",
    name: "سلمان العتيبي",
    project: "روابي الخبر",
    unit: "A-208",
    stage: "طلب جديد",
    sla: "متبقي 36 دقيقة",
    status: "new",
  },
];
function BankDashboard({ showToast, openChat, openDetail, available, toggleAvailable }) {
  const [filter, setFilter] = useState("الكل");
  const [applications, setApplications] = useState(financeApplications);
  const [activeApplicationId, setActiveApplicationId] = useState(financeApplications[0].id);
  const activeApplication = applications.find((item) => item.id === activeApplicationId) ?? applications[0];
  const applicationStage = activeApplication.stage;
  const setApplicationStage = (stage) =>
    setApplications((items) =>
      items.map((item) =>
        item.id === activeApplicationId
          ? {
              ...item,
              stage,
            }
          : item,
      ),
    );
  const shown = applications.filter((item) => filter === "الكل" || item.stage === filter);
  return (
    <div className="content-wrap sales-content bank-content">
      <section className="welcome-row sales-welcome">
        <div>
          <span className="eyebrow">
            <Landmark size={14} />
            {" صباح الخير يا فيصل"}
          </span>
          <h2>كل طلب أقرب لخطوته الجاية.</h2>
          <p>Mini CRM يجمع الطلب والمستندات والـSLA والتنسيق العقاري في نفس سجل العميل.</p>
        </div>
        <button
          className={`shift-status availability-toggle ${available ? "online" : "offline"}`}
          onClick={toggleAvailable}
        >
          <span>
            <i /> {available ? "متاح الآن لاستقبال الطلبات" : "غير متاح لاستقبال الطلبات"}
          </span>
          <small>{available ? "اضغط لإيقاف الإسناد الجديد" : "اضغط لتفعيل الإسناد"}</small>
        </button>
      </section>
      <section className="sales-kpis" aria-label="ملخص طلبات التمويل">
        <button onClick={() => setFilter("الكل")}>
          <span className="kpi-icon mint">
            <Landmark size={20} />
          </span>
          <div>
            <small>طلبات نشطة</small>
            <strong>{applications.length}</strong>
            <em>طلبات النموذج المسندة لك</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => setFilter("طلب جديد")}>
          <span className="kpi-icon blue">
            <UsersRound size={20} />
          </span>
          <div>
            <small>طلبات جديدة</small>
            <strong>{applications.filter((a) => a.stage === "طلب جديد").length}</strong>
            <em>حسب سجل الطلبات</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => setFilter("بانتظار مستند")}>
          <span className="kpi-icon coral">
            <FileCheckCorner size={20} />
          </span>
          <div>
            <small>نواقص معلقة</small>
            <strong>{applications.filter((a) => a.stage === "بانتظار مستند").length}</strong>
            <em>تحتاج مستندًا إضافيًا</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => setFilter("العرض جاهز")}>
          <span className="kpi-icon gold">
            <BadgeCheck size={20} />
          </span>
          <div>
            <small>عروض جاهزة</small>
            <strong>{applications.filter((a) => a.stage === "العرض جاهز").length}</strong>
            <em>حسب سجل الطلبات</em>
          </div>
          <ChevronLeft size={16} />
        </button>
      </section>
      <section className="focus-card bank-focus" id="tasks">
        <div className="focus-top">
          <div>
            <span className="focus-mark">
              <Zap size={20} />
            </span>
            <div>
              <span className="eyebrow">الأولوية الآن</span>
              <h3>راجع مستندات نجلاء القحطاني</h3>
              <p>الوحدة محجوزة لدى تلال الواجهة • الموظفة العقارية نورة العتيبي</p>
            </div>
          </div>
          <span className="sla-chip urgent">
            <Clock3 size={14} />
            {" متبقي 1:20 س"}
          </span>
        </div>
        <div className="focus-person">
          <span className="lead-avatar">نق</span>
          <div>
            <strong>FN-2841 • الوحدة T-118</strong>
            <small>آخر تحديث قبل 12 دقيقة • 4 من 5 مستندات مكتملة</small>
          </div>
          <button className="ghost-action" onClick={openChat}>
            <MessageCircleMore size={17} />
            {" تواصل مع المطور"}
          </button>
          <button
            className="primary-action"
            onClick={() => {
              setApplicationStage("العرض جاهز");
              showToast("تم تحديث الطلب إلى: العرض جاهز");
            }}
          >
            <FileCheckCorner size={17} />
            {" إنهاء المراجعة"}
          </button>
        </div>
      </section>
      <div className="bank-crm-grid" id="leads">
        <section className="panel mini-crm" id="applications">
          <div className="panel-head">
            <div>
              <h3>Mini CRM التمويل</h3>
              <p>كل طلب رسمي مرتبط بوحدة وموظف عقاري مسؤول</p>
            </div>
            <div className="crm-filters">
              {["الكل", "طلب جديد", "بانتظار مستند", "العرض جاهز"].map((item) => (
                <button
                  key={item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="finance-list">
            {shown.map((item) => (
              <button
                key={item.id}
                className={activeApplication.id === item.id ? "active" : ""}
                onClick={() => {
                  setActiveApplicationId(item.id);
                }}
              >
                <span className="lead-avatar">{item.name.slice(0, 2)}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.id}
                    {" • "}
                    {item.project}
                    {" • "}
                    {item.unit}
                  </small>
                </span>
                <em className={`status-pill ${item.status}`}>{item.stage}</em>
                <span className={item.status === "urgent" ? "urgent-text" : ""}>
                  <Clock3 size={13} /> {item.sla}
                </span>
                <ChevronLeft size={17} />
              </button>
            ))}
          </div>
        </section>
        <aside className="panel application-inspector" id="deal">
          <div className="panel-head">
            <div>
              <h3>ملف الطلب</h3>
              <p>{activeApplication.id}</p>
            </div>
            <span className="status-pill qualified">{applicationStage}</span>
          </div>
          <div className="application-person">
            <span className="lead-avatar large">{activeApplication.name.slice(0, 2)}</span>
            <div>
              <strong>{activeApplication.name}</strong>
              <small>
                {activeApplication.project}
                {" • الوحدة "}
                {activeApplication.unit}
              </small>
            </div>
          </div>
          <div className="detail-grid">
            <button onClick={() => showToast("تم فتح خزنة المستندات المصرح بها")}>
              <small>المستندات</small>
              <strong>4 / 5 مكتملة</strong>
            </button>
            <button onClick={() => showToast("الحسبة داخل سياسة الجهة التمويلية")}>
              <small>الحسبة</small>
              <strong>7,840 ر.س شهرياً</strong>
            </button>
            <button onClick={() => openDetail("deal", activeApplication.name)}>
              <small>المرحلة</small>
              <strong>{applicationStage}</strong>
            </button>
            <button onClick={openChat}>
              <small>الموظف العقاري</small>
              <strong>نورة العتيبي</strong>
            </button>
          </div>
          <label className="stage-select" id="calculator">
            <span>تحديث حالة الطلب والعرض</span>
            <select
              value={applicationStage}
              onChange={(event) => {
                setApplicationStage(event.target.value);
                showToast(`تم حفظ الحالة: ${event.target.value}`);
              }}
            >
              <option>طلب جديد</option>
              <option>مراجعة المستندات</option>
              <option>بانتظار مستند</option>
              <option>العرض جاهز</option>
              <option>أُرسل للعميل</option>
            </select>
          </label>
          <button className="primary-action full-action" onClick={openChat}>
            <MessageCircleMore size={17} />
            {" محادثة موظف مبيعات العقار"}
          </button>
          <p className="privacy-copy">
            <LockKeyhole size={15} />
            {" المحادثة مرتبطة بهذا الطلب فقط، ولا تكشف CRM المطور أو عروض البنوك الأخرى."}
          </p>
        </aside>
      </div>
      <footer>
        <span>© 2026 ديل لاين</span>
        <div>
          <button onClick={() => openDetail("scope")}>إضافات النطاق</button>
          <button onClick={() => openDetail("privacy", "access")}>سياسة الوصول</button>
          <button onClick={() => openDetail("support")}>الدعم</button>
        </div>
        <span className="saudi">
          <i />
          {" صُممت في السعودية"}
        </span>
      </footer>
    </div>
  );
}
function DeveloperAdminDashboard({ activeNav, showToast, openDetail }) {
  const [inventoryFilter, setInventoryFilter] = useState("الكل");
  const [storeEnabled, setStoreEnabled] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState("RSV-90172");
  const units = demoInventory;
  const shown = units.filter((unit) => inventoryFilter === "الكل" || unit.state === inventoryFilter);
  return (
    <div className="content-wrap sales-content management-content">
      <section className="welcome-row sales-welcome">
        <div>
          <span className="eyebrow">
            <Building2 size={14} />
            {" إدارة تلال العقارية"}
          </span>
          <h2>مشاريعك وفريقك، في صورة واضحة.</h2>
          <p>
            هنا تُدار المشاريع والمخزون والحجوزات والفريق وسياسات المتجر؛ بدون الدخول إلى محادثات الموظفين
            الخاصة.
          </p>
        </div>
        <button
          className={`shift-status availability-toggle ${storeEnabled ? "online" : "offline"}`}
          onClick={() => {
            setStoreEnabled((value) => !value);
            showToast(
              storeEnabled ? "تم إيقاف استقبال الاهتمامات من المتجر" : "تم تفعيل المتجر واستقبال الاهتمامات",
            );
          }}
        >
          <span>
            <i />
            {" المتجر "}
            {storeEnabled ? "منشور" : "متوقف"}
          </span>
          <small>تغيير حالة قناة البيع العامة</small>
        </button>
      </section>
      <section className="sales-kpis">
        <button onClick={() => setInventoryFilter("الكل")}>
          <span className="kpi-icon mint">
            <Building2 size={20} />
          </span>
          <div>
            <small>إجمالي الوحدات</small>
            <strong>{units.length}</strong>
            <em>
              {new Set(units.map((u) => u.project)).size}
              {" مشاريع تجريبية"}
            </em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => setInventoryFilter("متاحة")}>
          <span className="kpi-icon blue">
            <House size={20} />
          </span>
          <div>
            <small>الوحدات المتاحة</small>
            <strong>{units.filter((u) => u.state === "متاحة").length}</strong>
            <em>حسب الوحدات الظاهرة</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() =>
            document.getElementById("reservations")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <span className="kpi-icon gold">
            <FileCheckCorner size={20} />
          </span>
          <div>
            <small>حجوزات نشطة</small>
            <strong>3</strong>
            <em>حجوزات في سجل النموذج</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() =>
            document.getElementById("team")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <span className="kpi-icon coral">
            <UsersRound size={20} />
          </span>
          <div>
            <small>فريق المبيعات</small>
            <strong>3</strong>
            <em>2 متاحين في النموذج</em>
          </div>
          <ChevronLeft size={16} />
        </button>
      </section>
      <div className="management-grid" id="inventory">
        <section className="panel management-table" id="leads">
          <div className="panel-head">
            <div>
              <h3>المشاريع والمخزون</h3>
              <p>مصدر الحالة الموحد للمنصة والمتجر والحجوزات وCRM الشركة</p>
            </div>
            <div className="crm-filters">
              {["الكل", "متاحة", "محجوزة", "مباعة"].map((item) => (
                <button
                  key={item}
                  className={inventoryFilter === item ? "active" : ""}
                  onClick={() => setInventoryFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="management-list">
            {shown.map((unit) => (
              <button
                key={unit.id}
                onClick={() =>
                  openDetail(
                    "project",
                    projects.find(
                      (p) =>
                        p.name.includes(unit.project) ||
                        p.name.includes(
                          unit.project.replace("تلال الواجهة", "واجهة الدمام").replace("بيوت قمرة", "قمرة"),
                        ),
                    )?.name ?? projects[0].name,
                  )
                }
              >
                <span className="lead-avatar">{unit.id.slice(0, 2)}</span>
                <span>
                  <strong>
                    {unit.project}
                    {" • "}
                    {unit.id}
                  </strong>
                  <small>
                    {unit.type}
                    {" • "}
                    {unit.inquiries}
                    {" اهتمام"}
                  </small>
                </span>
                <em
                  className={`status-pill ${unit.state === "متاحة" ? "qualified" : unit.state === "محجوزة" ? "waiting" : "new"}`}
                >
                  {unit.state}
                </em>
                <ChevronLeft size={17} />
              </button>
            ))}
          </div>
        </section>
        <aside className="panel" id="team">
          <div className="panel-head">
            <div>
              <h3>أداء فريق المبيعات</h3>
              <p>إنتاجية وSLA — بدون فتح محادثاتهم</p>
            </div>
            <TrendingUp size={19} />
          </div>
          <div className="staff-list">
            {[
              ["نورة العتيبي", "متاحة الآن", "12 عميل", "92%"],
              ["ماجد الشهري", "متاح الآن", "9 عملاء", "88%"],
              ["ريم الدوسري", "غير متاحة", "7 عملاء", "84%"],
            ].map(([name, state, load, score]) => (
              <button key={name} onClick={() => showToast(`تم فتح تقرير أداء ${name}`)}>
                <span className="lead-avatar">{name.slice(0, 2)}</span>
                <span>
                  <strong>{name}</strong>
                  <small>
                    {state}
                    {" • "}
                    {load}
                  </small>
                </span>
                <em>{score}</em>
              </button>
            ))}
          </div>
        </aside>
      </div>
      <div className="management-grid lower-grid">
        <section className="panel" id="reservations">
          <div className="panel-head">
            <div>
              <h3>الحجوزات النشطة</h3>
              <p>قرارات المطور فقط: تأكيد، تمديد أو إلغاء موثق</p>
            </div>
            <span className="status-pill waiting">3 في النموذج</span>
          </div>
          <div className="reservation-selector">
            {["RSV-90172", "RSV-90168", "RSV-90161"].map((id) => (
              <button
                key={id}
                className={selectedReservation === id ? "active" : ""}
                onClick={() => setSelectedReservation(id)}
              >
                <strong>{id}</strong>
                <span>
                  {id === "RSV-90172"
                    ? "عباس السالم • A-204"
                    : id === "RSV-90168"
                      ? "نجلاء القحطاني • T-118"
                      : "مشاعل الغامدي • B-311"}
                </span>
              </button>
            ))}
          </div>
          <div className="detail-actions">
            <button
              className="ghost-action"
              onClick={() => showToast(`تم تسجيل تمديد ${selectedReservation}`)}
            >
              تمديد الحجز
            </button>
            <button
              className="primary-action"
              onClick={() => showToast(`تم تأكيد الحجز ${selectedReservation}`)}
            >
              <Check size={17} />
              {" تأكيد الحجز"}
            </button>
          </div>
        </section>
        <section className="panel" id="storefront">
          <div className="panel-head">
            <div>
              <h3>المتجر الإلكتروني</h3>
              <p>إدارة العرض العام وتحويل الاهتمامات إلى CRM الشركة</p>
            </div>
            <span className={`status-pill ${storeEnabled ? "qualified" : "waiting"}`}>
              {storeEnabled ? "منشور" : "متوقف"}
            </span>
          </div>
          <div className="store-summary">
            <span>
              <House size={24} />
            </span>
            <div>
              <strong>واجهة مشاريع تلال</strong>
              <small>الوحدات المعروضة تجريبية • لا يوجد اتصال بمخزون حي</small>
            </div>
          </div>
          <div className="detail-actions">
            <button className="ghost-action" onClick={() => showToast("تم فتح إعدادات المتجر")}>
              إدارة العرض
            </button>
            <button className="primary-action" onClick={() => openDetail("project", projects[0].name)}>
              معاينة المتجر
            </button>
          </div>
        </section>
      </div>
      <SalesCommandCenter
        mode="developer"
        initialView={activeNav === "tracking" ? "deals" : "performance"}
        showToast={showToast}
      />
    </div>
  );
}
function BankAdminDashboard({ activeNav, showToast, openDetail }) {
  const [autoAssign, setAutoAssign] = useState(true);
  const [assignments, setAssignments] = useState({
    "FN-2841": "فيصل الشهري",
    "FN-2838": "عمر الحربي",
    "FN-2829": "سارة الدوسري",
    "FN-2824": "فيصل الشهري",
  });
  const [assignmentReason, setAssignmentReason] = useState("");
  const [reviewed, setReviewed] = useState([]);
  const [rateDelta, setRateDelta] = useState("0.35");
  return (
    <div className="content-wrap sales-content management-content">
      <section className="welcome-row sales-welcome">
        <div>
          <span className="eyebrow">
            <Landmark size={14} />
            {" إدارة مصرف الراجحي"}
          </span>
          <h2>إدارة البنك تراقب وتوزّع؛ الموظف يعالج الطلب.</h2>
          <p>هذه البوابة للفريق والأحمال والسياسات والمراجعة الإدارية، وليست Mini CRM شخصياً لموظف التمويل.</p>
        </div>
        <button
          className={`shift-status availability-toggle ${autoAssign ? "online" : "offline"}`}
          onClick={() => setAutoAssign((value) => !value)}
        >
          <span>
            <i />
            {" الإسناد الآلي "}
            {autoAssign ? "مفعّل" : "متوقف"}
          </span>
          <small>المتاح الآن والأقل حملاً يستقبل الطلب</small>
        </button>
      </section>
      <section className="sales-kpis">
        <button
          onClick={() =>
            document.getElementById("queue")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <span className="kpi-icon mint">
            <Landmark size={20} />
          </span>
          <div>
            <small>طلبات تحت الإجراء</small>
            <strong>{financeApplications.length}</strong>
            <em>طلبات النموذج الحالي</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() =>
            document.getElementById("team")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <span className="kpi-icon blue">
            <UsersRound size={20} />
          </span>
          <div>
            <small>الموظفون المتاحون</small>
            <strong>2 / 3</strong>
            <em>توفّر توضيحي للموظفين</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => openDetail("performance", "bank-sla")}>
          <span className="kpi-icon gold">
            <Clock3 size={20} />
          </span>
          <div>
            <small>متوسط أول رد</small>
            <strong>8 د</strong>
            <em>الهدف أقل من 15 دقيقة</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() =>
            document.getElementById("tracking")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <span className="kpi-icon coral">
            <BadgeCheck size={20} />
          </span>
          <div>
            <small>موافقات مبدئية</small>
            <strong>0</strong>
            <em>لا موافقات مصرفية حقيقية</em>
          </div>
          <ChevronLeft size={16} />
        </button>
      </section>
      <div className="management-grid" id="queue">
        <section className="panel management-table" id="leads">
          <div className="panel-head">
            <div>
              <h3>طابور الطلبات وCRM البنك</h3>
              <p>إعادة الإسناد داخل البنك بسبب موثق</p>
            </div>
            <span className="status-pill waiting">
              {financeApplications.length - reviewed.length}
              {" تحتاج إجراء"}
            </span>
          </div>
          <label className="assignment-reason">
            سبب إعادة الإسناد
            <input
              aria-label="سبب إعادة الإسناد"
              placeholder="مثال: توزيع حمل العمل"
              value={assignmentReason}
              onChange={(event) => setAssignmentReason(event.target.value)}
            />
          </label>
          <div className="management-list">
            {financeApplications.map((item) => (
              <div key={item.id} className="manager-row">
                <span className="lead-avatar">{item.name.slice(0, 2)}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.id}
                    {" • "}
                    {item.stage}
                  </small>
                </span>
                <select
                  aria-label={`موظف الطلب ${item.id}`}
                  value={assignments[item.id]}
                  onChange={(event) => {
                    if (!assignmentReason.trim()) {
                      showToast("اكتب سبب إعادة الإسناد أولًا.");
                      return;
                    }
                    setAssignments((items) => ({
                      ...items,
                      [item.id]: event.target.value,
                    }));
                    showToast(
                      `إسناد تجريبي: ${item.id} إلى ${event.target.value} · السبب: ${assignmentReason}`,
                    );
                  }}
                >
                  <option>فيصل الشهري</option>
                  <option>عمر الحربي</option>
                  <option>سارة الدوسري</option>
                </select>
                <button
                  disabled={reviewed.includes(item.id)}
                  onClick={() => {
                    setReviewed((items) => [...items, item.id]);
                    showToast(`اعتمدت المراجعة داخل التجربة: ${item.id}`);
                  }}
                >
                  <Check size={15} />{" "}
                  {reviewed.includes(item.id) ? "مراجعة معتمدة تجريبيًا" : "اعتماد المراجعة"}
                </button>
              </div>
            ))}
          </div>
        </section>
        <aside className="panel" id="team">
          <div className="panel-head">
            <div>
              <h3>الموظفون والأحمال</h3>
              <p>حالة التوفر والإنتاجية</p>
            </div>
            <UsersRound size={19} />
          </div>
          <div className="staff-list">
            {[
              ["فيصل الشهري", "متاح", "3 طلبات", "9 د"],
              ["عمر الحربي", "متاح", "4 طلبات", "11 د"],
              ["سارة الدوسري", "غير متاحة", "2 طلب", "7 د"],
            ].map(([name, state, load, response]) => (
              <button key={name} onClick={() => showToast(`تقرير SLA: ${name}`)}>
                <span className="lead-avatar">{name.slice(0, 2)}</span>
                <span>
                  <strong>{name}</strong>
                  <small>
                    {state}
                    {" • "}
                    {load}
                  </small>
                </span>
                <em>{response}</em>
              </button>
            ))}
          </div>
        </aside>
      </div>
      <div className="management-grid lower-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>ملخص رحلة التمويل</h3>
              <p>حالة مشتركة ضمن صلاحية البنك</p>
            </div>
            <BriefcaseBusiness size={19} />
          </div>
          <div className="vertical-timeline">
            {journey.slice(1, 6).map((step, index) => (
              <div key={step.label} className={index < 3 ? "done" : index === 3 ? "active" : ""}>
                <i>{index < 3 ? <Check size={13} /> : index + 1}</i>
                <p>
                  <strong>{step.label}</strong>
                  <small>{index < 3 ? "مكتملة" : index === 3 ? "تحت الإجراء" : "لاحقاً"}</small>
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="panel" id="rules">
          <div className="panel-head">
            <div>
              <h3>سياسات البنك</h3>
              <p>مصدر الحقيقة للحاسبات والعروض</p>
            </div>
            <Settings size={19} />
          </div>
          <label className="stage-select">
            <span>فرق نسبة افتراضي للتجربة (0–10)</span>
            <input
              inputMode="decimal"
              value={rateDelta}
              onChange={(event) => setRateDelta(event.target.value)}
              onBlur={() =>
                showToast(
                  Number.isFinite(Number(rateDelta)) && Number(rateDelta) >= 0 && Number(rateDelta) <= 10
                    ? "حُفظ الافتراض داخل التجربة فقط؛ لم تتغير سياسة البنك."
                    : "أدخل قيمة من 0 إلى 10. لم تُحفظ القيمة غير الصحيحة.",
                )
              }
            />
          </label>
          <label className="consent-check">
            <input type="checkbox" checked={autoAssign} onChange={() => setAutoAssign((value) => !value)} />
            <span>توزيع الطلبات الجديدة تلقائياً على الموظف المتاح الأقل حملاً.</span>
          </label>
        </section>
      </div>
      <SalesCommandCenter
        mode="bank"
        initialView={activeNav === "tracking" ? "deals" : "performance"}
        showToast={showToast}
      />
    </div>
  );
}
function PlatformAdminDashboard({ showToast, openDetail }) {
  const [maintenance, setMaintenance] = useState(false);
  const [orgFilter, setOrgFilter] = useState("الكل");
  const organizations = [
    ["تلال العقارية", "مطور", "نشطة"],
    ["مصرف الراجحي", "جهة تمويل", "نشطة"],
    ["واحة العقارية", "مطور", "تحتاج مراجعة"],
    ["شركة تمويل الأولى", "جهة تمويل", "تجريبية"],
  ];
  return (
    <div className="content-wrap sales-content management-content admin-content">
      <section className="welcome-row sales-welcome">
        <div>
          <span className="eyebrow">
            <ShieldCheck size={14} />
            {" مركز تشغيل ديل لاين"}
          </span>
          <h2>تشغيل المنصة بدون تجاوز صلاحيات الجهات.</h2>
          <p>
            إدارة المنظمات والتكاملات والامتثال والفوترة؛ لا يوجد اطلاع روتيني على محادثات العملاء أو قرارات
            البنك.
          </p>
        </div>
        <button
          className={`shift-status availability-toggle ${maintenance ? "offline" : "online"}`}
          onClick={() => setMaintenance((value) => !value)}
        >
          <span>
            <i />
            {" المنصة "}
            {maintenance ? "في وضع الصيانة" : "تعمل بشكل طبيعي"}
          </span>
          <small>تغيير تجريبي لحالة التشغيل</small>
        </button>
      </section>
      <section className="sales-kpis">
        <button onClick={() => setOrgFilter("الكل")}>
          <span className="kpi-icon mint">
            <Building2 size={20} />
          </span>
          <div>
            <small>الجهات النشطة</small>
            <strong>{organizations.filter((org) => org[2] === "نشطة").length}</strong>
            <em>
              {"من "}
              {organizations.length}
              {" جهات في النموذج"}
            </em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() =>
            document.getElementById("tracking")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <span className="kpi-icon blue">
            <BriefcaseBusiness size={20} />
          </span>
          <div>
            <small>صفقات نشطة</small>
            <strong>{trackedSalesSeed.filter((sale) => sale.stage !== "مكتملة").length}</strong>
            <em>صفقات تجريبية مفتوحة</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() =>
            document.getElementById("integrations")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <span className="kpi-icon gold">
            <Zap size={20} />
          </span>
          <div>
            <small>تكاملات تحتاج انتباه</small>
            <strong>2</strong>
            <em>لا يوجد توقف شامل</em>
          </div>
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() =>
            document.getElementById("audit")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <span className="kpi-icon coral">
            <ShieldCheck size={20} />
          </span>
          <div>
            <small>تنبيهات امتثال</small>
            <strong>3</strong>
            <em>ضمن مدة المعالجة</em>
          </div>
          <ChevronLeft size={16} />
        </button>
      </section>
      <div className="management-grid">
        <section className="panel management-table" id="organizations">
          <div className="panel-head">
            <div>
              <h3>الجهات والمنظمات</h3>
              <p>عزل مستقل لكل مطور وجهة تمويل</p>
            </div>
            <div className="crm-filters">
              {["الكل", "مطور", "جهة تمويل"].map((item) => (
                <button
                  key={item}
                  className={orgFilter === item ? "active" : ""}
                  onClick={() => setOrgFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="management-list">
            {organizations
              .filter((item) => orgFilter === "الكل" || item[1] === orgFilter)
              .map(([name, type, status]) => (
                <button key={name} onClick={() => showToast(`تم فتح ملف منظمة ${name}`)}>
                  <span className="lead-avatar">{name.slice(0, 2)}</span>
                  <span>
                    <strong>{name}</strong>
                    <small>
                      {type}
                      {" • وصول متعدد المستأجرين"}
                    </small>
                  </span>
                  <em className={`status-pill ${status === "نشطة" ? "qualified" : "waiting"}`}>{status}</em>
                  <ChevronLeft size={17} />
                </button>
              ))}
          </div>
        </section>
        <aside className="panel" id="integrations">
          <div className="panel-head">
            <div>
              <h3>صحة التكاملات</h3>
              <p>مراقبة القنوات الخارجية</p>
            </div>
            <Zap size={19} />
          </div>
          <div className="integration-list">
            {[
              ["نفاذ", "تجريبي", "waiting"],
              ["SIMAH", "خلف بوابة", "waiting"],
              ["مخزون المطورين", "بيانات تجريبية", "waiting"],
              ["الإشعارات", "محلية في التجربة", "waiting"],
            ].map(([name, state, tone]) => (
              <button key={name} onClick={() => showToast(`تم فتح سجل تكامل ${name}`)}>
                <span>
                  <strong>{name}</strong>
                  <small>حالة العرض التجريبي؛ غير متصل</small>
                </span>
                <em className={`status-pill ${tone}`}>{state}</em>
              </button>
            ))}
          </div>
        </aside>
      </div>
      <div className="management-grid lower-grid" id="rules">
        <section className="panel" id="tracking">
          <div className="panel-head">
            <div>
              <h3>نبض الصفقات</h3>
              <p>إحصاءات تشغيلية مجمعة بدون كشف بيانات حساسة</p>
            </div>
            <TrendingUp size={19} />
          </div>
          <div className="performance-chart">
            <div>
              <span
                style={{
                  height: "52%",
                }}
              />
              <small>اكتشاف</small>
            </div>
            <div>
              <span
                style={{
                  height: "78%",
                }}
              />
              <small>حسبة</small>
            </div>
            <div>
              <span
                style={{
                  height: "64%",
                }}
              />
              <small>حجز</small>
            </div>
            <div>
              <span
                style={{
                  height: "43%",
                }}
              />
              <small>تمويل</small>
            </div>
          </div>
        </section>
        <section className="panel" id="audit">
          <div className="panel-head">
            <div>
              <h3>التدقيق والامتثال والفوترة</h3>
              <p>وصول مؤقت ومسبب فقط</p>
            </div>
            <ShieldCheck size={19} />
          </div>
          <div className="audit-list">
            <button onClick={() => showToast("تم فتح سجل الوصول الإداري")}>
              {"مراجعة وصول إداري مؤقت "}
              <span>حالتان</span>
            </button>
            <button onClick={() => showToast("تم فتح سجل الموافقات")}>
              {"موافقات العملاء حسب الغرض "}
              <span>98.7%</span>
            </button>
            <button onClick={() => openDetail("scope")}>
              {"حوكمة نطاق المشروع "}
              <span>الإصدار 2.0</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
function downloadCsv(filename, rows) {
  const csv = "﻿" + rows.map((row) => row.map((cell) => csvCell(String(cell))).join(",")).join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], {
      type: "text/csv;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
const developerAgents = [
  {
    id: "SA-101",
    name: "عباس السالم",
    role: "مستشار مبيعات",
    target: 8,
    closed: 6,
    sales: 724e4,
    reservations: 9,
    active: 7,
    projectSales: {
      "تلال الواجهة": 284e4,
      "روابي الخبر": 236e4,
      "واحة الدمام": 204e4,
    },
  },
  {
    id: "SA-102",
    name: "نورة العتيبي",
    role: "مستشارة مبيعات",
    target: 10,
    closed: 8,
    sales: 936e4,
    reservations: 12,
    active: 9,
    projectSales: {
      "تلال الواجهة": 426e4,
      "روابي الخبر": 318e4,
      "بيوت قمرة": 192e4,
    },
  },
  {
    id: "SA-103",
    name: "ماجد الشهري",
    role: "مستشار مبيعات",
    target: 9,
    closed: 5,
    sales: 586e4,
    reservations: 7,
    active: 6,
    projectSales: {
      "روابي الخبر": 354e4,
      "واحة الدمام": 143e4,
      "بيوت قمرة": 89e4,
    },
  },
  {
    id: "SA-104",
    name: "ريم الدوسري",
    role: "منسقة مبيعات",
    target: 7,
    closed: 4,
    sales: 412e4,
    reservations: 6,
    active: 4,
    projectSales: {
      "تلال الواجهة": 142e4,
      "واحة الدمام": 18e5,
      "بيوت قمرة": 9e5,
    },
  },
];
const bankAgents = [
  {
    id: "BA-201",
    name: "فيصل الشهري",
    role: "أخصائي تمويل",
    target: 15,
    closed: 12,
    sales: 128e5,
    reservations: 0,
    active: 8,
    projectSales: {
      "تلال الواجهة": 42e5,
      "روابي الخبر": 51e5,
      "واحة الدمام": 35e5,
    },
  },
  {
    id: "BA-202",
    name: "عمر الحربي",
    role: "أخصائي تمويل",
    target: 14,
    closed: 9,
    sales: 965e4,
    reservations: 0,
    active: 7,
    projectSales: {
      "تلال الواجهة": 325e4,
      "روابي الخبر": 28e5,
      "بيوت قمرة": 36e5,
    },
  },
  {
    id: "BA-203",
    name: "سارة الدوسري",
    role: "أخصائية تمويل",
    target: 16,
    closed: 11,
    sales: 117e5,
    reservations: 0,
    active: 9,
    projectSales: {
      "تلال الواجهة": 39e5,
      "واحة الدمام": 47e5,
      "بيوت قمرة": 31e5,
    },
  },
];
const trackedSalesSeed = [
  {
    id: "DL-4101",
    reservation: "RSV-90168",
    client: "نجلاء القحطاني",
    project: "تلال الواجهة",
    unit: "T-118",
    value: 142e4,
    financing: "تمويل بنكي",
    stage: "مراجعة التمويل",
    developerAgent: "نورة العتيبي",
    bank: "مصرف الراجحي",
    bankAgent: "فيصل الشهري",
    bankStage: "مراجعة المستندات",
    updated: "قبل 12 دقيقة",
    nextAction: "استكمال كشف الحساب",
    sla: "متبقي 1:20 س",
    createdAt: "2026-11-01",
  },
  {
    id: "DL-4102",
    reservation: "RSV-90172",
    client: "عباس السالم",
    project: "روابي الخبر",
    unit: "A-204",
    value: 135e4,
    financing: "تمويل بنكي",
    stage: "موافقة مبدئية",
    developerAgent: "عباس السالم",
    bank: "البنك الأهلي السعودي",
    bankAgent: "عمر الحربي",
    bankStage: "العرض الائتماني جاهز",
    updated: "قبل 38 دقيقة",
    nextAction: "اعتماد العرض من العميل",
    sla: "ضمن الوقت",
    createdAt: "2026-11-02",
  },
  {
    id: "DL-4103",
    reservation: "RSV-90161",
    client: "مشاعل الغامدي",
    project: "واحة الدمام",
    unit: "B-311",
    value: 89e4,
    financing: "نقدي",
    stage: "العقود والإفراغ",
    developerAgent: "ريم الدوسري",
    bank: "—",
    bankAgent: "—",
    bankStage: "لا ينطبق",
    updated: "اليوم 10:40 ص",
    nextAction: "توقيع العقد الإلكتروني",
    sla: "موعد غداً",
    createdAt: "2026-11-03",
  },
  {
    id: "DL-4104",
    reservation: "RSV-90154",
    client: "عبدالله الحربي",
    project: "بيوت قمرة",
    unit: "V-027",
    value: 126e4,
    financing: "تمويل بنكي",
    stage: "مكتملة",
    developerAgent: "ماجد الشهري",
    bank: "مصرف الإنماء",
    bankAgent: "سارة الدوسري",
    bankStage: "تم الصرف",
    updated: "2 نوفمبر 2026",
    nextAction: "اكتملت الصفقة",
    sla: "مكتمل",
    createdAt: "2026-10-29",
    closedAt: "2026-11-02",
  },
  {
    id: "DL-4105",
    reservation: "RSV-90180",
    client: "ريم الشمري",
    project: "تلال الواجهة",
    unit: "T-122",
    value: 138e4,
    financing: "تمويل بنكي",
    stage: "حجز الوحدة",
    developerAgent: "عباس السالم",
    bank: "لم يُحدد",
    bankAgent: "لم يُسند",
    bankStage: "بانتظار اختيار البنك",
    updated: "قبل 6 دقائق",
    nextAction: "اختيار الجهة التمويلية",
    sla: "متبقي 23 ساعة",
    createdAt: "2026-11-04",
  },
];
const salesStages = ["حجز الوحدة", "مراجعة التمويل", "موافقة مبدئية", "العقود والإفراغ", "مكتملة"];
const periodLabels = {
  daily: "يومي",
  weekly: "أسبوعي",
  monthly: "شهري",
  quarterly: "ربع سنوي",
  yearly: "سنوي",
  custom: "مدة مخصصة",
};
function SalesCommandCenter({ mode, initialView, showToast }) {
  const [view, setView] = useState(initialView);
  useEffect(() => setView(initialView), [initialView]);
  const [period, setPeriod] = useState("monthly");
  const [fromDate, setFromDate] = useState("2026-11-01");
  const [toDate, setToDate] = useState("2026-11-04");
  const agents = mode === "developer" ? developerAgents : bankAgents;
  const [agentFilter, setAgentFilter] = useState("الكل");
  const [projectFilter, setProjectFilter] = useState("الكل");
  const [stageFilter, setStageFilter] = useState("الكل");
  const [financeFilter, setFinanceFilter] = useState("الكل");
  const [sales, setSales] = useState(trackedSalesSeed);
  const [selectedSaleId, setSelectedSaleId] = useState(trackedSalesSeed[0].id);
  const projectsData = [...new Set(demoInventory.map((unit) => unit.project))].map((name) => {
    const units = demoInventory.filter((unit) => unit.project === name);
    return {
      name,
      total: units.length,
      available: units.filter((u) => u.state === "متاحة").length,
      reserved: units.filter((u) => u.state === "محجوزة").length,
      sold: units.filter((u) => u.state === "مباعة").length,
    };
  });
  const reportToday = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const range = periodRange(period, reportToday, fromDate, toDate);
  const scopedSales = sales.filter((sale) => mode === "developer" || sale.bank === "مصرف الراجحي");
  const chosenAgents = agents
    .map((agent) => {
      const own = scopedSales.filter(
        (sale) => (mode === "developer" ? sale.developerAgent : sale.bankAgent) === agent.name,
      );
      const closed = own.filter(
        (sale) => sale.stage === "مكتملة" && withinRange(sale.closedAt ?? sale.createdAt, range),
      );
      return {
        ...agent,
        closedPeriod: closed.length,
        salesPeriod: closed.reduce((sum, sale) => sum + sale.value, 0),
        targetPeriod: agent.target,
        active: own.filter((sale) => sale.stage !== "مكتملة").length,
      };
    })
    .filter((agent) => agentFilter === "الكل" || agent.name === agentFilter);
  const closedTotal = chosenAgents.reduce((sum, agent) => sum + agent.closedPeriod, 0);
  const salesTotal = chosenAgents.reduce((sum, agent) => sum + agent.salesPeriod, 0);
  const targetTotal = chosenAgents.reduce((sum, agent) => sum + agent.targetPeriod, 0);
  const agentSales = scopedSales.filter(
    (sale) =>
      agentFilter === "الكل" || (mode === "developer" ? sale.developerAgent : sale.bankAgent) === agentFilter,
  );
  const reservationTotal = agentSales.filter(
    (sale) => sale.stage !== "مكتملة" && withinRange(sale.createdAt, range),
  ).length;
  const inventoryTotal = projectsData.reduce((sum, project) => sum + project.available, 0);
  const projectChart = projectsData.map((project) => ({
    ...project,
    value: agentSales
      .filter(
        (sale) =>
          sale.project === project.name &&
          sale.stage === "مكتملة" &&
          withinRange(sale.closedAt ?? sale.createdAt, range),
      )
      .reduce((sum, sale) => sum + sale.value, 0),
  }));
  const chartMax = Math.max(...projectChart.map((item) => item.value), 1);
  const filteredSales = agentSales.filter(
    (sale) =>
      withinRange(sale.closedAt ?? sale.createdAt, range) &&
      (projectFilter === "الكل" || sale.project === projectFilter) &&
      (stageFilter === "الكل" || sale.stage === stageFilter) &&
      (financeFilter === "الكل" || sale.financing === financeFilter),
  );
  const selectedSale = filteredSales.find((sale) => sale.id === selectedSaleId) ?? filteredSales[0];
  const changeStage = (stage) => {
    if (!selectedSale) return;
    if (selectedSale.stage === "مكتملة" && stage !== "مكتملة") {
      showToast("الصفقة مكتملة؛ عكسها يحتاج إجراءً موثقًا مستقلًا.");
      return;
    }
    if (salesStages.indexOf(stage) > salesStages.indexOf(selectedSale.stage) + 1) {
      showToast("أكمل المرحلة التالية أولًا؛ لا يمكن القفز إلى إغلاق الصفقة.");
      return;
    }
    setSales((items) =>
      items.map((item) =>
        item.id === selectedSale.id
          ? {
              ...item,
              stage,
              updated: "الآن · تجربة",
              closedAt: stage === "مكتملة" ? reportToday : void 0,
            }
          : item,
      ),
    );
    showToast(`تم تحديث المرحلة داخل التجربة إلى: ${stage}`);
  };
  const exportPerformance = () =>
    downloadCsv(`${mode}-sales-performance.csv`, [
      ["الفترة", periodLabels[period]],
      ["الموظف", "التارقت", "الصفقات المغلقة", "نسبة التحقيق", "إجمالي المبيعات"],
      ...chosenAgents.map((agent) => [
        agent.name,
        String(agent.targetPeriod),
        String(agent.closedPeriod),
        `${Math.round((agent.closedPeriod / agent.targetPeriod) * 100)}%`,
        String(agent.salesPeriod),
      ]),
    ]);
  const exportTracking = () =>
    downloadCsv(`${mode}-deal-tracking.csv`, [
      [
        "الصفقة",
        "الحجز",
        "العميل",
        "المشروع",
        "الوحدة",
        "القيمة",
        "نوع السداد",
        "مرحلة البيع",
        "موظف المطور",
        "البنك",
        "موظف البنك",
        "مرحلة البنك",
      ],
      ...filteredSales.map((sale) => [
        sale.id,
        sale.reservation,
        sale.client,
        sale.project,
        sale.unit,
        String(sale.value),
        sale.financing,
        sale.stage,
        sale.developerAgent,
        sale.bank,
        sale.bankAgent,
        sale.bankStage,
      ]),
    ]);
  return (
    <section className="sales-command" id="operations">
      <header className="sales-command-head">
        <div>
          <span className="eyebrow">
            <TrendingUp size={14} />{" "}
            {mode === "developer" ? "مركز قيادة مبيعات المطور" : "مركز قيادة تمويل البنك"}
          </span>
          <h2>
            {mode === "developer"
              ? "الحجوزات، التارقت، المبيعات ومسار الصفقة"
              : "طلبات التمويل، أداء الموظفين ومسار الموافقات"}
          </h2>
          <p>
            {mode === "developer"
              ? "قياس كل موظف وكل مشروع من الحجز حتى إقفال البيع، مع رؤية حالة البنك دون كشف بيانات العميل الحساسة."
              : "قياس إنجاز موظفي البنك ومتابعة كل طلب تمويل والموظف العقاري المرتبط به ضمن نفس الصفقة."}
          </p>
        </div>
        <div className="command-tabs">
          <button className={view === "performance" ? "active" : ""} onClick={() => setView("performance")}>
            <TrendingUp size={16} />
            {" الأداء والمبيعات"}
          </button>
          <button className={view === "deals" ? "active" : ""} onClick={() => setView("deals")}>
            <BriefcaseBusiness size={16} />
            {" تتبع بيع الصفقة"}
          </button>
        </div>
      </header>
      <p className="report-method">
        الأرقام محسوبة من سجلات الصفقات التجريبية المؤرخة. التارقت المعروض شهري، والفترة حسب توقيت الرياض. حجم
        القيمة يمثل أسعار العقارات، وليس مبالغ قروض أو إيراد المنصة.
      </p>
      <div className="report-filters">
        <div className="period-buttons">
          {Object.keys(periodLabels).map((key) => (
            <button key={key} className={period === key ? "active" : ""} onClick={() => setPeriod(key)}>
              {periodLabels[key]}
            </button>
          ))}
        </div>
        <label>
          <span>الموظف</span>
          <select
            aria-label="فلترة تقرير الموظفين"
            value={agentFilter}
            onChange={(event) => setAgentFilter(event.target.value)}
          >
            <option>الكل</option>
            {agents.map((agent) => (
              <option key={agent.id}>{agent.name}</option>
            ))}
          </select>
        </label>
        {period === "custom" && (
          <div className="custom-dates">
            <label>
              <span>من</span>
              <input
                aria-label="بداية فترة التقرير"
                type="date"
                value={fromDate}
                onInput={(event) => setFromDate(event.currentTarget.value)}
                onChange={(event) => setFromDate(event.target.value)}
              />
            </label>
            <label>
              <span>إلى</span>
              <input
                aria-label="نهاية فترة التقرير"
                type="date"
                value={toDate}
                onInput={(event) => setToDate(event.currentTarget.value)}
                onChange={(event) => setToDate(event.target.value)}
              />
            </label>
          </div>
        )}
      </div>
      {!range && (
        <p className="report-error" role="alert">
          اختر تاريخين صحيحين؛ البداية يجب أن تسبق النهاية.
        </p>
      )}
      {view === "performance" ? (
        <div className="command-body" id="team">
          <div className="command-kpis">
            <article>
              <span className="kpi-icon gold">
                <FileCheckCorner size={19} />
              </span>
              <div>
                <small>{mode === "developer" ? "الحجوزات القائمة" : "طلبات التمويل القائمة"}</small>
                <strong>{reservationTotal}</strong>
                <em>
                  {"خلال "}
                  {periodLabels[period]}
                </em>
              </div>
            </article>
            <article>
              <span className="kpi-icon mint">
                <BadgeCheck size={19} />
              </span>
              <div>
                <small>الصفقات المقفلة</small>
                <strong>{closedTotal}</strong>
                <em>
                  {"من تارقت "}
                  {targetTotal}
                </em>
              </div>
            </article>
            <article>
              <span className="kpi-icon blue">
                <TrendingUp size={19} />
              </span>
              <div>
                <small>{mode === "developer" ? "إجمالي المبيعات" : "قيمة العقارات الممولة"}</small>
                <strong>{(salesTotal / 1e6).toFixed(2)}م</strong>
                <em>ريال سعودي</em>
              </div>
            </article>
            <article>
              <span className="kpi-icon coral">
                <Building2 size={19} />
              </span>
              <div>
                <small>{mode === "developer" ? "المخزون المتاح" : "نسبة تحقيق التارقت"}</small>
                <strong>
                  {mode === "developer"
                    ? inventoryTotal
                    : `${Math.round((closedTotal / Math.max(targetTotal, 1)) * 100)}%`}
                </strong>
                <em>{mode === "developer" ? "وحدة عبر 4 مشاريع" : "حسب الفترة المختارة"}</em>
              </div>
            </article>
          </div>
          <div className="sales-analytics-grid">
            <section className="sales-chart-card">
              <div className="command-section-head">
                <div>
                  <h3>{mode === "developer" ? "المبيعات حسب المشروع" : "قيمة العقارات حسب المشروع"}</h3>
                  <p>
                    {periodLabels[period]}{" "}
                    {period === "custom" ? `• ${fromDate} إلى ${toDate}` : "• يتحدث حسب الفلتر"}
                  </p>
                </div>
                <button onClick={exportPerformance}>
                  <Download size={15} />
                  {" تصدير التقرير"}
                </button>
              </div>
              <div className="horizontal-sales-chart">
                {projectChart.map((item) => (
                  <div key={item.name}>
                    <span>
                      <strong>{item.name}</strong>
                      <small>{(item.value / 1e6).toFixed(2)}م ر.س</small>
                    </span>
                    <i>
                      <b
                        style={{
                          width: `${(item.value / chartMax) * 100}%`,
                        }}
                      />
                    </i>
                  </div>
                ))}
              </div>
            </section>
            <aside className="inventory-card">
              <div className="command-section-head">
                <div>
                  <h3>{mode === "developer" ? "المخزون حسب المشروع" : "حالة طلبات التمويل"}</h3>
                  <p>صورة تشغيلية فورية</p>
                </div>
              </div>
              {mode === "developer" ? (
                <div className="inventory-projects">
                  {projectsData.map((project) => (
                    <div key={project.name}>
                      <strong>{project.name}</strong>
                      <span>
                        <i className="available" />
                        {" متاح "}
                        {project.available}
                      </span>
                      <span>
                        <i className="reserved" />
                        {" محجوز "}
                        {project.reserved}
                      </span>
                      <span>
                        <i className="sold" />
                        {" مباع "}
                        {project.sold}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bank-stage-summary">
                  {["مراجعة المستندات", "تقييم ائتماني", "عرض جاهز", "تم الصرف"].map((stage, index) => (
                    <div key={stage}>
                      <span>{stage}</span>
                      <strong>{scopedSales.filter((sale) => sale.bankStage === stage).length}</strong>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>
          <section className="agent-sales-table">
            <div className="command-section-head">
              <div>
                <h3>أداء الموظفين</h3>
                <p>كم صفقة أُقفلت، نسبة التارقت، وقيمة الإنجاز في المدة المختارة</p>
              </div>
            </div>
            <div className="agent-table-head">
              <span>الموظف</span>
              <span>الهدف الشهري</span>
              <span>المقفل</span>
              <span>نسبة التحقيق</span>
              <span>إجمالي القيمة</span>
              <span>صفقات نشطة</span>
            </div>
            {chosenAgents.map((agent) => (
              <button key={agent.id} onClick={() => setAgentFilter(agent.name)}>
                <span>
                  <i className="lead-avatar">{agent.name.slice(0, 2)}</i>
                  <strong>
                    {agent.name}
                    <small>{agent.role}</small>
                  </strong>
                </span>
                <b>{agent.targetPeriod}</b>
                <b>{agent.closedPeriod}</b>
                <span className="target-achievement">
                  <i>
                    <b
                      style={{
                        width: `${Math.min(100, (agent.closedPeriod / agent.targetPeriod) * 100)}%`,
                      }}
                    />
                  </i>
                  <em>{Math.round((agent.closedPeriod / agent.targetPeriod) * 100)}%</em>
                </span>
                <strong>{(agent.salesPeriod / 1e6).toFixed(2)}م ر.س</strong>
                <b>{agent.active}</b>
              </button>
            ))}
          </section>
        </div>
      ) : (
        <div className="command-body" id="tracking">
          <div className="deal-filter-row">
            <label>
              <span>المشروع</span>
              <select
                aria-label="مشروع الصفقة"
                value={projectFilter}
                onChange={(event) => setProjectFilter(event.target.value)}
              >
                <option>الكل</option>
                {projectsData.map((project) => (
                  <option key={project.name}>{project.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span>مرحلة البيع</span>
              <select
                aria-label="مرحلة البيع"
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value)}
              >
                <option>الكل</option>
                {salesStages.map((stage) => (
                  <option key={stage}>{stage}</option>
                ))}
              </select>
            </label>
            <label>
              <span>طريقة السداد</span>
              <select
                aria-label="طريقة سداد الصفقة"
                value={financeFilter}
                onChange={(event) => setFinanceFilter(event.target.value)}
              >
                <option>الكل</option>
                <option>تمويل بنكي</option>
                <option>نقدي</option>
              </select>
            </label>
            <button onClick={exportTracking}>
              <Download size={15} />
              {" تصدير التفاصيل"}
            </button>
          </div>
          <div className="tracked-layout">
            <section className="tracked-sales-list">
              <header>
                <span>العميل والصفقة</span>
                <span>مرحلة البيع</span>
                <span>{mode === "developer" ? "موظف المطور" : "موظف البنك"}</span>
                <span>حالة البنك</span>
              </header>
              {filteredSales.map((sale) => (
                <button
                  key={sale.id}
                  className={selectedSale?.id === sale.id ? "selected" : ""}
                  onClick={() => setSelectedSaleId(sale.id)}
                >
                  <span>
                    <i className="lead-avatar">{sale.client.slice(0, 2)}</i>
                    <strong>
                      {sale.client}
                      <small>
                        {sale.reservation}
                        {" • "}
                        {sale.project}
                        {" • "}
                        {sale.unit}
                      </small>
                    </strong>
                  </span>
                  <em className="status-pill qualified">{sale.stage}</em>
                  <strong>{mode === "developer" ? sale.developerAgent : sale.bankAgent}</strong>
                  <span>
                    <b>{sale.financing === "تمويل بنكي" ? sale.bank : "نقدي"}</b>
                    <small>{sale.bankStage}</small>
                  </span>
                </button>
              ))}
            </section>
            {selectedSale ? (
              <aside className="sale-tracker-detail">
                <div className="tracker-title">
                  <span className="status-pill waiting">{selectedSale.financing}</span>
                  <h3>{selectedSale.client}</h3>
                  <p>
                    {selectedSale.id}
                    {" • "}
                    {selectedSale.reservation}
                    {" • "}
                    {selectedSale.project}
                    {" • "}
                    {selectedSale.unit}
                  </p>
                </div>
                <div className="sale-value">
                  <small>قيمة الصفقة</small>
                  <strong>
                    {selectedSale.value.toLocaleString("en-US")}
                    {" ر.س"}
                  </strong>
                  <span>
                    {"آخر تحديث: "}
                    {selectedSale.updated}
                  </span>
                </div>
                <div className="ownership-grid">
                  <article>
                    <small>موظف مبيعات المطور</small>
                    <strong>{selectedSale.developerAgent}</strong>
                    <span>{selectedSale.project}</span>
                  </article>
                  <article>
                    <small>موظف البنك المسؤول</small>
                    <strong>{selectedSale.bankAgent}</strong>
                    <span>{selectedSale.bank}</span>
                  </article>
                </div>
                <div className="bank-progress">
                  <span>
                    <strong>مرحلة البنك الحالية</strong>
                    <em>{selectedSale.bankStage}</em>
                  </span>
                  <div>
                    {["اختيار البنك", "رفع الطلب", "مراجعة البنك", "العرض", "الصرف"].map((step, index) => (
                      <i
                        key={step}
                        className={
                          selectedSale.financing === "نقدي"
                            ? "disabled"
                            : index <= Math.max(0, salesStages.indexOf(selectedSale.stage))
                              ? "done"
                              : ""
                        }
                      >
                        <b>{index + 1}</b>
                        <small>{step}</small>
                      </i>
                    ))}
                  </div>
                </div>
                <label className="tracker-stage-select">
                  <span>تحديث مرحلة بيع الصفقة</span>
                  <select
                    aria-label="مرحلة الصفقة المختارة"
                    value={selectedSale.stage}
                    onChange={(event) => changeStage(event.target.value)}
                  >
                    {salesStages.map((stage) => (
                      <option key={stage}>{stage}</option>
                    ))}
                  </select>
                </label>
                <div className="next-sale-action">
                  <Clock3 size={16} />
                  <p>
                    <small>
                      {"الإجراء التالي • "}
                      {selectedSale.sla}
                    </small>
                    <strong>{selectedSale.nextAction}</strong>
                  </p>
                </div>
              </aside>
            ) : (
              <div className="report-empty" role="status">
                <Search size={26} />
                <strong>لا توجد صفقات تطابق الفترة والفلاتر</strong>
                <p>جرّب فترة أو موظفًا آخر.</p>
              </div>
            )}
          </div>
          <p className="ops-audit-note">
            <ShieldCheck size={15} />
            {
              " المدير يرى مسار البيع، الحجز، موظف المطور، البنك وموظف البنك والمرحلة الحالية فقط ضمن الصفقة المصرّح بها؛ بيانات دخل العميل والتزاماته لا تظهر للمطور."
            }
          </p>
        </div>
      )}
    </section>
  );
}
function BuyerDashboard({
  uploaded,
  setUploaded,
  showToast,
  navigate,
  openChat,
  sharedCalc,
  approveCalc,
  openAi,
  openDetail,
  selectedOffer,
}) {
  return (
    <div className="content-wrap">
      <section className="welcome-row">
        <div>
          <span className="eyebrow">
            <Sparkles size={14} />
            {" صباح الخير يا عباس"}
          </span>
          <h2>حيّاك في رحلة بيتك الجديد.</h2>
          <p>جمعنا لك حالة العقار والتمويل والمستندات في شاشة واحدة؛ فقط نفّذ الخطوة التالية.</p>
        </div>
        <div className="deal-reference">
          <small>رقم معاملتك</small>
          <strong dir="ltr">HI-24081</strong>
          <span>
            <i />
            {" نشطة الآن"}
          </span>
        </div>
      </section>
      {sharedCalc !== "none" && <SharedCalculationCard status={sharedCalc} approve={approveCalc} />}
      <ProjectMarketplace navigate={navigate} openDetail={openDetail} />
      <section className="journey-card" id="deal">
        <div className="section-heading">
          <div>
            <span className="section-icon">
              <LayoutDashboard size={20} />
            </span>
            <div>
              <h3>رحلة تملكك</h3>
              <p>نعرض لك المهم فقط، ونخبرك من المسؤول عن كل خطوة.</p>
            </div>
          </div>
          <button className="updated" onClick={() => openDetail("deal")}>
            <Clock3 size={14} />
            {" حُدثت الآن"}
          </button>
        </div>
        <div className="journey-track">
          {journey.map((step, index) => (
            <button
              key={step.label}
              className={`journey-step ${step.done ? "done" : ""} ${step.active ? "active" : ""}`}
              onClick={() => openDetail("deal", step.label)}
            >
              <div className="step-dot">{step.done ? <Check size={16} /> : index + 1}</div>
              <div className="step-copy">
                <strong>{step.label}</strong>
                <span>{step.meta}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className={`next-action ${uploaded ? "completed" : ""}`} id="documents">
        <div className="action-accent" />
        <span className="action-icon">
          {uploaded ? <CircleCheck size={25} /> : <CloudUpload size={25} />}
        </span>
        <div className="action-copy">
          <span className="eyebrow">خطوتك الآن</span>
          <h3>{uploaded ? "اختير المستند في التجربة" : "ارفع كشف الحساب البنكي"}</h3>
          <p>
            {uploaded
              ? "الملف محلي على جهازك؛ لن يصل لموظف البنك قبل تفعيل التكامل."
              : "مطلوب لاستكمال مراجعة طلبك لدى الجهة التمويلية. الملف يبقى مشفّراً ولا يراه إلا الطرف المخوّل."}
          </p>
          <div className="action-meta">
            <span>
              <Clock3 size={14} />
              {" يستغرق أقل من دقيقة"}
            </span>
            <span>
              <LockKeyhole size={14} />
              {" PDF أو صورة، حتى 10MB"}
            </span>
          </div>
        </div>
        <DemoDocumentPicker
          uploaded={uploaded}
          onPick={(name) => {
            setUploaded(true);
            showToast(`اختير ${name} محليًا في التجربة؛ لم يُرسل للبنك.`);
          }}
        />
      </section>
      <div className="dashboard-grid">
        <section className="panel property-panel" id="property">
          <div className="panel-head">
            <div>
              <h3>عقارك المحجوز</h3>
              <p>آخر حالة مؤكدة من سجل الوحدة</p>
            </div>
            <button onClick={() => openDetail("property")}>
              {"عرض التفاصيل "}
              <ChevronLeft size={16} />
            </button>
          </div>
          <button
            className="property-visual property-click"
            onClick={() => openDetail("property")}
            aria-label="عرض تفاصيل مشروع روابي الخبر"
          >
            <img
              className="reserved-property-image"
              src={`${import.meta.env.BASE_URL}images/saudi-townhouses.webp`}
              alt="صورة تصورية لتاون هاوس، وليست صورة فعلية للوحدة المحجوزة"
              width={960}
              height={640}
              loading="lazy"
            />
            <span className="reserved-image-note">صورة تصورية</span>
            <div className="visual-label">
              <span>مشروع روابي الخبر</span>
              <strong>واجهة بحرية • الخبر</strong>
            </div>
            <span className="available-pill">
              <i />
              {" الحجز مؤكد"}
            </span>
          </button>
          <div className="property-details">
            <button onClick={() => openDetail("property")}>
              <span>الوحدة</span>
              <strong>A-204</strong>
            </button>
            <button onClick={() => openDetail("property")}>
              <span>النوع</span>
              <strong>فيلا تاون هاوس</strong>
            </button>
            <button onClick={() => openDetail("property")}>
              <span>المساحة</span>
              <strong>248 م²</strong>
            </button>
            <button onClick={() => openDetail("property")}>
              <span>السعر</span>
              <strong>1,350,000 ر.س</strong>
            </button>
          </div>
          <div className="agent-row">
            <div className="agent-avatar">ن</div>
            <div>
              <small>مستشارة المبيعات</small>
              <strong>نورة العتيبي</strong>
            </div>
            <span>
              <i />
              {" متاحة الآن"}
            </span>
            <button onClick={openChat}>
              <MessageCircleMore size={18} />
              {" مراسلة"}
            </button>
          </div>
        </section>
        <OffersPanel openDetail={openDetail} selectedOffer={selectedOffer} />
      </div>
      <section className="quick-tools">
        <button onClick={openAi}>
          <span>
            <Bot size={20} />
          </span>
          <div>
            <strong>اسأل حِسبة</strong>
            <small>مساعدك لفهم المشاريع والخطوة الجاية</small>
          </div>
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => navigate("documents")}>
          <span>
            <FileCheckCorner size={20} />
          </span>
          <div>
            <strong>مستنداتك</strong>
            <small>{uploaded ? "لا توجد نواقص جديدة" : "ملفان ينتظران الرفع"}</small>
          </div>
          <ChevronLeft size={18} />
        </button>
        <button onClick={openChat}>
          <span>
            <MessageCircleMore size={20} />
          </span>
          <div>
            <strong>محادثات الصفقة</strong>
            <small>كل طرف يرى ما يخصه فقط</small>
          </div>
          <ChevronLeft size={18} />
        </button>
      </section>
      <footer>
        <span>© 2026 ديل لاين</span>
        <div>
          <button onClick={() => openDetail("privacy", "privacy")}>الخصوصية</button>
          <button onClick={() => openDetail("privacy", "terms")}>الشروط والأحكام</button>
          <button onClick={() => openDetail("support")}>تواصل معنا</button>
        </div>
        <span className="saudi">
          <i />
          {" صُممت في السعودية"}
        </span>
      </footer>
    </div>
  );
}
function SharedCalculationCard({ status, approve }) {
  const [reviewing, setReviewing] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  if (status === "approved")
    return (
      <section className="shared-calc-card approved">
        <div className="shared-icon">
          <CircleCheck size={23} />
        </div>
        <div>
          <span className="eyebrow">حسبة مشارَكة ومعتمدة منك</span>
          <h3>نتيجتك المبدئية صارت في حسابك</h3>
          <p>أرسلها لك نورة العتيبي من شركة تلال العقارية • مشروع واجهة الدمام</p>
        </div>
        <div className="calc-attribution">
          <small>مصدر الفرصة موثّق</small>
          <strong>نورة العتيبي</strong>
          <span>10 أغسطس 2026 • 10:42 م</span>
        </div>
      </section>
    );
  return (
    <section className="shared-calc-card pending">
      <div className="shared-icon">
        <Send size={22} />
      </div>
      <div>
        <span className="eyebrow">طلب جديد ينتظر موافقتك</span>
        <h3>نورة أرسلت لك حسبة تمويل مبدئية</h3>
        <p>مرتبطة بمشروع بيوت تلال — واجهة الدمام. راجع الغرض والبيانات قبل القبول.</p>
      </div>
      <button className="primary-action" onClick={() => setReviewing(true)}>
        {"مراجعة وقبول "}
        <ArrowLeft size={17} />
      </button>
      {reviewing && (
        <div className="consent-sheet">
          <button className="modal-scrim" aria-label="إغلاق" onClick={() => setReviewing(false)} />
          <div className="consent-card">
            <div className="consent-head">
              <span className="section-icon">
                <ShieldCheck size={20} />
              </span>
              <div>
                <small>موافقة محددة وواضحة</small>
                <h3>اربط الحسبة بحسابك؟</h3>
              </div>
              <button onClick={() => setReviewing(false)}>
                <X size={19} />
              </button>
            </div>
            <div className="consent-source">
              <span className="lead-avatar large">نع</span>
              <div>
                <small>أرسل الطلب</small>
                <strong>نورة العتيبي</strong>
                <span>شركة تلال العقارية • واجهة الدمام</span>
              </div>
            </div>
            <div className="consent-details">
              <article>
                <strong>الغرض</strong>
                <span>عرض نتيجة تمويل مبدئية في حسابك وربطها باهتمامك بالمشروع.</span>
              </article>
              <article>
                <strong>البيانات المستخدمة</strong>
                <span>رقم الهوية للتحقق والربط، الدخل المدخل، سعر العقار ونتيجة الحسبة.</span>
              </article>
              <article>
                <strong>ما يراه الموظف</strong>
                <span>حالة قبول الطلب وملخص أهلية فقط—بدون التزاماتك أو عروض البنوك.</span>
              </article>
            </div>
            <label className="consent-check">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(event) => setConsentChecked(event.target.checked)}
              />
              <span>قرأت الغرض ونطاق البيانات وأوافق على ربط الحسبة بحسابي.</span>
            </label>
            <div className="modal-actions">
              <button className="ghost-action" onClick={() => setReviewing(false)}>
                ليس الآن
              </button>
              <button
                className="primary-action"
                disabled={!consentChecked}
                onClick={() => {
                  approve();
                  setReviewing(false);
                }}
              >
                <Check size={17} />
                {" موافق، اعرض الحسبة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
function OffersPanel({ openDetail, selectedOffer }) {
  const [filter, setFilter] = useState("payment");
  const ordered = [...offers].sort((a, b) => {
    if (filter === "payment") return Number(a.payment.replace(",", "")) - Number(b.payment.replace(",", ""));
    if (filter === "term") return Number(b.term.split(" ")[0]) - Number(a.term.split(" ")[0]);
    return Number(a.down.replace(/\D/g, "")) - Number(b.down.replace(/\D/g, ""));
  });
  return (
    <section className="panel offers-panel" id="offers">
      <div className="panel-head">
        <div>
          <h3>عروض التمويل</h3>
          <p>نماذج توضيحية بأسماء جهات تمويل حقيقية</p>
        </div>
        <button onClick={() => openDetail("offer", "compare")}>
          {"مقارنة كاملة "}
          <ChevronLeft size={16} />
        </button>
      </div>
      <div className="offer-filters">
        <button className={filter === "payment" ? "active" : ""} onClick={() => setFilter("payment")}>
          <SlidersHorizontal size={13} />
          {" الأقل قسطاً"}
        </button>
        <button className={filter === "term" ? "active" : ""} onClick={() => setFilter("term")}>
          25 سنة
        </button>
        <button className={filter === "down" ? "active" : ""} onClick={() => setFilter("down")}>
          دفعة أقل
        </button>
      </div>
      <div className="offer-list">
        {ordered.map((offer) => (
          <button
            key={offer.bank}
            className={`offer-row ${selectedOffer === offer.bank ? "selected" : ""}`}
            onClick={() => openDetail("offer", offer.bank)}
          >
            <div
              className="bank-mark"
              style={{
                background: offer.color,
              }}
            >
              {offer.mark}
            </div>
            <div className="offer-name">
              <strong>{offer.bank}</strong>
              <span>{offer.rate}</span>
            </div>
            <div className="payment">
              <small>القسط الشهري</small>
              <strong>
                {offer.payment} <em>ر.س</em>
              </strong>
            </div>
            <div className="offer-terms">
              <span>{offer.term}</span>
              <span>
                {"دفعة "}
                {offer.down}
              </span>
            </div>
            {selectedOffer === offer.bank ? (
              <span className="selected-badge">
                <Check size={14} />
                {" للمراجعة"}
              </span>
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        ))}
      </div>
      <div className="offer-note">
        <ShieldCheck size={17} />
        <p>
          <strong>مقارنة حيادية وواضحة</strong>
          <span>
            الأسماء حقيقية، لكن الأرقام محاكاة للتجربة وليست عروضاً صادرة من البنوك أو موافقات نهائية.
          </span>
        </p>
      </div>
    </section>
  );
}
function DetailModal({ detail, close, openChat, showToast, selectedOffer, selectOffer, role, logout }) {
  if (!detail) return null;
  const project =
    detail.kind === "project" ? (projects.find((item) => item.name === detail.id) ?? projects[0]) : null;
  const offer =
    detail.kind === "offer" && detail.id !== "compare"
      ? (offers.find((item) => item.bank === detail.id) ?? offers[0])
      : null;
  const title =
    (detail.kind === "offer" && detail.id === "compare" ? "مقارنة عروض التمويل" : null) ??
    project?.name ??
    offer?.bank ??
    {
      property: "تفاصيل العقار المحجوز",
      deal: detail.id || "تفاصيل رحلة الصفقة",
      documents: "مستنداتي",
      privacy:
        detail.id === "terms"
          ? "الشروط والأحكام"
          : detail.id === "access"
            ? "سياسة الوصول"
            : "الخصوصية والموافقات",
      support: "الدعم والمساعدة",
      account: "الحساب والإعدادات",
      notification: "تفاصيل الإشعار",
      performance: "تفاصيل الأداء",
      activeDeal: `صفقة ${detail.id ?? "نشطة"}`,
      scope: "إضافات نطاق المشروع",
    }[detail.kind] ??
    "التفاصيل";
  return (
    <div className="detail-modal-wrap" role="dialog" aria-modal="true" aria-label={title}>
      <button className="modal-scrim" onClick={close} aria-label="إغلاق التفاصيل" />
      <section className="detail-modal">
        <header>
          <div>
            <span className="section-icon">
              {project ? <Building2 size={20} /> : offer ? <Landmark size={20} /> : <FileText size={20} />}
            </span>
            <div>
              <small>تفاصيل النموذج التجريبي</small>
              <h2>{title}</h2>
            </div>
          </div>
          <button onClick={close} aria-label="إغلاق">
            <X size={21} />
          </button>
        </header>
        <div className="detail-body">
          {offer && (
            <>
              <div className="offer-detail-head">
                <div
                  className="bank-mark large"
                  style={{
                    background: offer.color,
                  }}
                >
                  {offer.mark}
                </div>
                <div>
                  <small>عرض تمويلي تجريبي</small>
                  <strong>{offer.bank}</strong>
                  <span>{offer.rate}</span>
                </div>
                <span className="status-pill qualified">صالح للمقارنة</span>
              </div>
              <div className="detail-grid">
                <article>
                  <small>القسط الشهري</small>
                  <strong>
                    {offer.payment}
                    {" ر.س"}
                  </strong>
                </article>
                <article>
                  <small>المدة</small>
                  <strong>{offer.term}</strong>
                </article>
                <article>
                  <small>الدفعة الأولى</small>
                  <strong>{offer.down}</strong>
                </article>
                <article>
                  <small>انتهاء النموذج</small>
                  <strong>30 نوفمبر 2026 · تجريبي</strong>
                </article>
              </div>
              <section className="terms-list">
                <strong>تفاصيل المقارنة</strong>
                <p>
                  <Check size={15} />
                  {" التمويل التقديري: 1,200,000 ر.س"}
                </p>
                <p>
                  <Check size={15} />
                  {" الرسوم الإدارية: 6,000 ر.س (تجريبي)"}
                </p>
                <p>
                  <Check size={15} />
                  {" التقييم والتأمين: حسب الجهة"}
                </p>
                <p>
                  <Check size={15} />
                  {" النتيجة لا تعني موافقة نهائية"}
                </p>
              </section>
              <div className="detail-actions">
                <button
                  className="ghost-action"
                  onClick={() =>
                    downloadCsv("Deal_Line_Offer_Demo.csv", [
                      ["الجهة", "القسط التجريبي", "المدة", "الدفعة"],
                      [offer.bank, offer.payment, offer.term, offer.down],
                    ])
                  }
                >
                  <FileText size={17} />
                  {" ملخص العرض"}
                </button>
                <button
                  className="primary-action"
                  disabled={selectedOffer === offer.bank}
                  onClick={() => selectOffer(offer.bank)}
                >
                  {selectedOffer === offer.bank ? (
                    <>
                      <Check size={17} />
                      {" محفوظ للمراجعة"}
                    </>
                  ) : (
                    <>
                      {"احفظه للمراجعة "}
                      <ArrowLeft size={17} />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
          {detail.kind === "offer" && detail.id === "compare" && (
            <>
              <div className="comparison-table">
                <div className="comparison-row head">
                  <span>الجهة</span>
                  <span>القسط</span>
                  <span>المدة</span>
                  <span>الدفعة</span>
                </div>
                {[...offers]
                  .sort(
                    (a, b) => Number(a.payment.replaceAll(",", "")) - Number(b.payment.replaceAll(",", "")),
                  )
                  .map((item) => (
                    <button
                      key={item.bank}
                      className="comparison-row"
                      onClick={() => showToast(`اختر ${item.bank} من قائمة العروض لفتح شروطه كاملة`)}
                    >
                      <strong>{item.bank}</strong>
                      <span>
                        {item.payment}
                        {" ر.س"}
                      </span>
                      <span>{item.term}</span>
                      <span>{item.down}</span>
                    </button>
                  ))}
              </div>
              <p className="detail-disclaimer">
                <ShieldCheck size={15} />
                {" الترتيب الحالي حسب الأقل قسطًا، وليس توصية مالية أو ترتيبًا مدفوعًا."}
              </p>
            </>
          )}
          {detail.kind === "property" && (
            <>
              <div className="reserved-detail-photo">
                <img
                  src={`${import.meta.env.BASE_URL}images/saudi-townhouses.webp`}
                  alt="تصور معماري لتاون هاوس"
                  width={960}
                  height={640}
                />
                <span>صورة تصورية · ليست صورة فعلية للوحدة</span>
              </div>
              <div className="property-summary">
                <span className="status-pill qualified">
                  <CircleCheck size={14} />
                  {" الحجز مؤكد"}
                </span>
                <h3>روابي الخبر • الوحدة A-204</h3>
                <p>فيلا تاون هاوس • 248 م² • 1,350,000 ر.س</p>
              </div>
              <div className="detail-grid">
                <article>
                  <small>رقم الحجز</small>
                  <strong>RSV-90172</strong>
                </article>
                <article>
                  <small>تاريخ التأكيد</small>
                  <strong>8 أغسطس 2026</strong>
                </article>
                <article>
                  <small>حالة الوحدة</small>
                  <strong>محجوزة لك</strong>
                </article>
                <article>
                  <small>المسؤول الحالي</small>
                  <strong>نورة العتيبي</strong>
                </article>
              </div>
              <section className="terms-list">
                <strong>ما الخطوة الجاية؟</strong>
                <p>
                  <Check size={15} />
                  {" اختيار العرض التمويلي المناسب"}
                </p>
                <p>
                  <Clock3 size={15} />
                  {" متوقع خلال يومي عمل"}
                </p>
                <p>
                  <ShieldCheck size={15} />
                  {" سجل الوحدة هو المرجع النهائي للتوفر"}
                </p>
              </section>
              <div className="detail-actions">
                <button className="ghost-action" onClick={openChat}>
                  <MessageCircleMore size={17} />
                  {" مراسلة نورة"}
                </button>
                <button
                  className="primary-action"
                  onClick={() =>
                    downloadCsv("Deal_Line_Reservation_Demo.csv", [
                      ["الحجز", "الوحدة", "المشروع", "الحالة", "القيمة"],
                      ["RSV-90172", "A-204", "روابي الخبر", "حجز تجريبي", "1350000"],
                    ])
                  }
                >
                  <FileText size={17} />
                  {" عرض ملخص الحجز"}
                </button>
              </div>
            </>
          )}
          {detail.kind === "deal" && (
            <>
              <div className="deal-detail-summary">
                <span>المعاملة HI-24081</span>
                <strong>{detail.id ?? "مقارنة العروض"}</strong>
                <p>المسؤول الحالي: العميل • المتوقع: خلال يومين عمل</p>
              </div>
              <div className="vertical-timeline">
                {journey.map((step, index) => (
                  <div key={step.label} className={step.done ? "done" : step.active ? "active" : ""}>
                    <i>{step.done ? <Check size={13} /> : index + 1}</i>
                    <p>
                      <strong>{step.label}</strong>
                      <small>
                        {step.done
                          ? "اكتملت وسُجلت"
                          : step.active
                            ? "بانتظار اختيارك"
                            : "تبدأ بعد إكمال المرحلة السابقة"}
                      </small>
                    </p>
                  </div>
                ))}
              </div>
              <div className="detail-actions">
                <button className="ghost-action" onClick={openChat}>
                  اسأل عن الصفقة
                </button>
                <button
                  className="primary-action"
                  onClick={() => {
                    close();
                    document.getElementById("offers")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  راجع العروض
                </button>
              </div>
            </>
          )}
          {detail.kind === "documents" && (
            <section className="document-summary">
              <FolderLock size={30} />
              <h3>خزنة المستندات</h3>
              <p>
                يمكن اختيار PDF أو صورة من الصفحة الرئيسية للتجربة. الملفات تبقى محلية؛ الرفع والتشفير
                والمشاركة مع البنك تحتاج التكامل الخلفي.
              </p>
              <p>حالة التكامل: غير مفعّل.</p>
            </section>
          )}
          {detail.kind === "notification" && (
            <NotificationDetail id={detail.id} showToast={showToast} close={close} />
          )}
          {detail.kind === "performance" && <PerformanceDetail id={detail.id} />}
          {detail.kind === "activeDeal" && (
            <>
              <div className="property-summary">
                <span className="status-pill qualified">صفقة نشطة</span>
                <h3>{detail.id}</h3>
                <p>المشروع: بيوت تلال • المسؤول الحالي موضح أدناه</p>
              </div>
              <div className="detail-grid">
                <article>
                  <small>المرحلة</small>
                  <strong>
                    {detail.id === "نجلاء القحطاني"
                      ? "اختيار التمويل"
                      : detail.id === "عبدالله الحربي"
                        ? "استكمال المستندات"
                        : "التعاقد"}
                  </strong>
                </article>
                <article>
                  <small>حالة SLA</small>
                  <strong>ضمن الوقت</strong>
                </article>
                <article>
                  <small>ملخص الأهلية</small>
                  <strong>مؤهل مبدئيًا</strong>
                </article>
                <article>
                  <small>البيانات التمويلية</small>
                  <strong>محجوبة حسب الصلاحية</strong>
                </article>
              </div>
              <div className="detail-actions">
                <button className="ghost-action" onClick={openChat}>
                  فتح المحادثة
                </button>
                <button
                  className="primary-action"
                  onClick={() => showToast("تم تسجيل فتح سجل الصفقة في النشاط")}
                >
                  فتح سجل الصفقة
                </button>
              </div>
            </>
          )}
          {detail.kind === "account" && (
            <>
              <div className="account-card">
                <span className="avatar">{roleMeta[role].initials}</span>
                <div>
                  <small>حساب تجريبي؛ الهوية غير موثقة فعليًا</small>
                  <strong>{roleMeta[role].name}</strong>
                  <span>{roleMeta[role].label}</span>
                </div>
              </div>
              <div className="settings-list">
                <button onClick={() => showToast("تم تفعيل التنبيهات")}>
                  {"التنبيهات "}
                  <span>
                    {"مفعّلة "}
                    <ChevronLeft size={15} />
                  </span>
                </button>
                <button onClick={() => showToast("تم حفظ اللغة العربية")}>
                  {"اللغة "}
                  <span>
                    {"العربية "}
                    <ChevronLeft size={15} />
                  </span>
                </button>
                <button onClick={() => showToast("لا توجد جلسات أخرى نشطة")}>
                  {"الأجهزة والجلسات "}
                  <span>
                    {"جهاز واحد "}
                    <ChevronLeft size={15} />
                  </span>
                </button>
                <button onClick={logout}>
                  {"تسجيل الخروج "}
                  <span>
                    <ChevronLeft size={15} />
                  </span>
                </button>
              </div>
            </>
          )}
          {detail.kind === "privacy" && (
            <>
              <section className="privacy-panel">
                <ShieldCheck size={25} />
                <div>
                  <strong>{title}</strong>
                  <p>
                    {detail.id === "access"
                      ? "صلاحياتك تُحدد حسب دورك والمنظمة والعلاقة والغرض. لا يملك أي دور وصولًا مفتوحًا تلقائيًا."
                      : detail.id === "terms"
                        ? "هذه نسخة تفاعلية للتجربة. لا تمثل الأرقام عروضًا ملزمة أو موافقات تمويلية أو نشرة بيع رسمية."
                        : "نجمع أقل قدر لازم من البيانات، ونوضح الغرض والمستلم والنطاق قبل أي موافقة."}
                  </p>
                </div>
              </section>
              <div className="settings-list">
                <button onClick={() => showToast("تم فتح موافقة الحسبة المشاركة")}>
                  {"موافقة الحسبة المشاركة "}
                  <span>
                    {"نشطة "}
                    <ChevronLeft size={15} />
                  </span>
                </button>
                <button onClick={() => showToast("لا توجد موافقات تسويق نشطة")}>
                  {"موافقات التسويق "}
                  <span>
                    {"غير مفعّلة "}
                    <ChevronLeft size={15} />
                  </span>
                </button>
                <button onClick={() => showToast("جهّزنا نموذج طلب البيانات")}>
                  {"طلب نسخة من بياناتي "}
                  <span>
                    <ChevronLeft size={15} />
                  </span>
                </button>
              </div>
            </>
          )}
          {detail.kind === "scope" && (
            <section className="scope-additions">
              <div className="scope-note">
                <FileText size={22} />
                <div>
                  <strong>إضافات مستقلة على نطاق الإصدار 2.0</strong>
                  <p>جُمعت النقاط المطلوبة في خانة واحدة، ولم يُعدّل أي نص داخل تقرير نطاق المشروع الأصلي.</p>
                </div>
              </div>
              <ul>
                {scopeAdditions.map((item) => (
                  <li key={item}>
                    <CircleCheck size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="scope-flow">
                <span>
                  <UserRound size={17} />
                  {" العميل"}
                </span>
                <ChevronLeft size={16} />
                <span>
                  <Building2 size={17} />
                  {" موظف المطور"}
                </span>
                <ChevronLeft size={16} />
                <span>
                  <Landmark size={17} />
                  {" موظف التمويل"}
                </span>
              </div>
            </section>
          )}
          {detail.kind === "support" && (
            <>
              <div className="support-options">
                <button onClick={() => showToast("الدعم في هذه النسخة توضيحي؛ لم تُفعّل قناة دعم خارجية بعد.")}>
                  <MessageCircleMore size={22} />
                  <strong>حالة الدعم</strong>
                  <span>القناة الخارجية غير مفعّلة</span>
                </button>
                <button onClick={() => showToast("سجلنا طلب اتصال تجريبي")}>
                  <Phone size={22} />
                  <strong>اطلب اتصال</strong>
                  <span>خلال ساعات العمل</span>
                </button>
                <button onClick={() => showToast("تم فتح مركز المساعدة")}>
                  <CircleQuestionMark size={22} />
                  <strong>مركز المساعدة</strong>
                  <span>إجابات سريعة وواضحة</span>
                </button>
              </div>
              <div className="support-ticket">
                <small>رقم مرجع الدعم</small>
                <strong>SUP-24081</strong>
                <span>مرتبط بمعاملتك لتسهيل المتابعة</span>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
function NotificationDetail({ id, showToast, close }) {
  const data =
    id === "document"
      ? {
          title: "كشف الحساب مطلوب",
          text: "ارفع آخر كشف حساب لاستكمال مراجعة الطلب. يقبل PDF أو صورة حتى 10MB.",
          action: "رفع المستند",
        }
      : id === "newOffer"
        ? {
            title: "وصل عرض تمويلي جديد",
            text: "صار عندك ثلاثة نماذج عروض جاهزة للمقارنة. راجع القسط والمدة والدفعة قبل حفظ خيار للمراجعة.",
            action: "عرض المقارنة",
          }
        : id === "newLead"
          ? {
              title: "ريم الشمري أُسندت لك",
              text: "مهتمة بمشروع روابي الخبر، ولم يبدأ معها التواصل حتى الآن. أول رد متوقع خلال 54 دقيقة.",
              action: "فتح ملف العميل",
            }
          : id === "management"
            ? {
                title: "إجراء إداري يحتاج مراجعة",
                text: "يوجد طلب أو إعداد ضمن صلاحيات بوابتك يحتاج قراراً موثقاً. لم تُكشف لك أي بيانات خارج نطاق منظمتك.",
                action: "فتح الإجراء",
              }
            : id === "managementReport"
              ? {
                  title: "اكتمل التقرير اليومي",
                  text: "ملخص الأداء والأحمال والـSLA جاهز للمراجعة داخل بوابتك الإدارية.",
                  action: "عرض التقرير",
                }
              : {
                  title: "متابعة سلمان مستحقة",
                  text: "العميل ينتظر تأكيد موعد زيارة المعرض لمعاينة الوحدة A-204.",
                  action: "تسجيل المتابعة",
                };
  return (
    <>
      <div className="notification-detail">
        <span className="notice-icon">
          <Bell size={20} />
        </span>
        <div>
          <small>إشعار نشط</small>
          <h3>{data.title}</h3>
          <p>{data.text}</p>
        </div>
      </div>
      <div className="detail-actions">
        <button className="ghost-action" onClick={close}>
          لاحقًا
        </button>
        <button
          className="primary-action"
          onClick={() => {
            showToast(`تم تنفيذ: ${data.action}`);
            close();
          }}
        >
          {data.action}
        </button>
      </div>
    </>
  );
}
function PerformanceDetail({ id }) {
  return (
    <>
      <div className="performance-chart">
        <div>
          <span
            style={{
              height: "48%",
            }}
          />
          <small>الأحد</small>
        </div>
        <div>
          <span
            style={{
              height: "72%",
            }}
          />
          <small>الاثنين</small>
        </div>
        <div>
          <span
            style={{
              height: "58%",
            }}
          />
          <small>الثلاثاء</small>
        </div>
        <div>
          <span
            style={{
              height: "88%",
            }}
          />
          <small>اليوم</small>
        </div>
      </div>
      <div className="performance-list">
        {(id === "followups"
          ? [
              ["سلمان العتيبي", "خلال 42 دقيقة"],
              ["ريم الشمري", "خلال 54 دقيقة"],
              ["محمد الدوسري", "4:00 م"],
              ["نجلاء القحطاني", "غدًا"],
            ]
          : id === "qualified"
            ? [
                ["نجلاء القحطاني", "جاهزة للحجز"],
                ["سلمان العتيبي", "ملخص أهلية متاح"],
                ["أحمد الشهري", "بانتظار اختيار وحدة"],
              ]
            : id === "reservations"
              ? [
                  ["A-204", "مؤكد"],
                  ["T-118", "مؤكد"],
                  ["B-311", "بانتظار مستند"],
                ]
              : [
                  ["سلمان العتيبي", "روابي الخبر"],
                  ["نجلاء القحطاني", "تلال الواجهة"],
                  ["محمد الدوسري", "واحة الدمام"],
                  ["ريم الشمري", "روابي الخبر"],
                ]
        ).map(([name, meta]) => (
          <div key={name}>
            <strong>{name}</strong>
            <span>{meta}</span>
          </div>
        ))}
      </div>
    </>
  );
}
function ProjectMarketplace({ navigate, openDetail }) {
  const [city, setCity] = useState("الكل");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("الكل");
  const [sort, setSort] = useState("featured");
  const shown = projects
    .filter(
      (project) =>
        (city === "الكل" || project.city === city) &&
        (kind === "الكل" || project.type === kind) &&
        `${project.name} ${project.city} ${project.district} ${project.type}`.includes(query.trim()),
    )
    .sort((a, b) =>
      sort === "price-low" ? a.basePrice - b.basePrice : sort === "area" ? b.baseArea - a.baseArea : 0,
    );
  return (
    <section className="market-section enriched-market" id="market">
      <div className="market-head">
        <div>
          <span className="eyebrow">
            <Building2 size={16} />
            {" اكتشف مكانك الجاي"}
          </span>
          <h3>عقارات تستاهل تشوف تفاصيلها</h3>
          <p>فلل وشقق وتاون هاوس. اختَر اللي يناسب مساحتك وميزانيتك.</p>
        </div>
        <button
          onClick={() => {
            setCity("الكل");
            setKind("الكل");
            setQuery("");
            setSort("featured");
            navigate("market");
          }}
        >
          {"كل العقارات "}
          <ArrowLeft size={17} />
        </button>
      </div>
      <div className="property-search-controls">
        <label className="catalog-search">
          <Search size={19} />
          <input
            aria-label="ابحث في المشاريع"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="اسم المشروع، الحي أو المدينة"
          />
        </label>
        <label>
          <span>المدينة</span>
          <select aria-label="المدينة" value={city} onChange={(event) => setCity(event.target.value)}>
            {["الكل", ...new Set(projects.map((p) => p.city))].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>نوع العقار</span>
          <select aria-label="نوع العقار" value={kind} onChange={(event) => setKind(event.target.value)}>
            {["الكل", ...new Set(projects.map((p) => p.type))].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="catalog-results-row">
        <span role="status">
          {shown.length}
          {" مشاريع للمعاينة"}
        </span>
        <label>
          ترتيب حسب
          <select aria-label="ترتيب العقارات" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">المقترحة للمعاينة</option>
            <option value="price-low">السعر: الأقل أولًا</option>
            <option value="area">المساحة: الأكبر أولًا</option>
          </select>
        </label>
      </div>
      <div className="project-grid">
        {shown.map((project, index) => (
          <article
            key={project.name}
            className="project-card"
            style={{
              animationDelay: `${index * 65}ms`,
            }}
          >
            <button
              className={`project-art photo-art ${project.tone}`}
              onClick={() => openDetail("project", project.name)}
              aria-label={`تفاصيل ${project.name}`}
            >
              <img
                src={project.image}
                alt={`تصور معماري لنمط ${project.type} — ${project.name}`}
                width={960}
                height={640}
                loading="lazy"
              />
              <span className="project-tag">{project.type}</span>
              <span className="concept-image-label">صورة تصورية</span>
              <span className="project-image-action">
                <ArrowLeft size={20} />
              </span>
            </button>
            <div className="project-body">
              <span>
                <MapPin size={15} /> {project.city}
                {" · "}
                {project.district}
              </span>
              <h4>{project.name}</h4>
              <div className="project-facts">
                <span>
                  <BedDouble size={16} /> {project.beds}
                  {" غرف"}
                </span>
                <span>
                  <Bath size={16} /> {project.baths}
                </span>
                <span>
                  <Ruler size={16} /> {project.area}
                </span>
              </div>
              <div className="project-price">
                <small>السعر التجريبي</small>
                <strong>{project.price}</strong>
              </div>
              <button onClick={() => openDetail("project", project.name)}>
                {"اكتشف التفاصيل والوحدات "}
                <ChevronLeft size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {shown.length === 0 && (
        <div className="empty-state">
          <Search size={25} />
          <strong>ما لقينا عقار يطابق بحثك</strong>
          <span>جرّب مدينة أو نوع عقار ثاني.</span>
          <button
            className="ghost-action"
            onClick={() => {
              setCity("الكل");
              setKind("الكل");
              setQuery("");
            }}
          >
            مسح الفلاتر
          </button>
        </div>
      )}
      <small className="demo-data-note">
        <CircleQuestionMark size={16} />
        {" صور تصورية وبيانات تجريبية للمعاينة؛ ليست عروض بيع رسمية أو إثباتًا لتوفر الوحدات."}
      </small>
    </section>
  );
}
function LeadDrawer({ lead, open, close, qualified, onQualify, openChat, showToast }) {
  return (
    <div className={`lead-drawer ${open ? "open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="drawer-head">
        <div>
          <span className="lead-avatar large">{lead.initials}</span>
          <div>
            <small>{lead.id}</small>
            <strong>{lead.name}</strong>
          </div>
        </div>
        <button onClick={close} aria-label="إغلاق ملف العميل">
          <X size={20} />
        </button>
      </div>
      <div className="drawer-body">
        <div className="drawer-status">
          <span className={`status-pill ${qualified ? "qualified" : lead.tone}`}>
            {qualified ? "عميل مؤهل" : lead.status}
          </span>
          <span>
            <Clock3 size={14} /> {lead.sla}
          </span>
        </div>
        <section>
          <span className="drawer-label">الإجراء التالي</span>
          <h3>{lead.next}</h3>
          <div className="drawer-actions">
            <button className="primary-action" onClick={() => showToast("تم تسجيل محاولة الاتصال في النشاط")}>
              <Phone size={17} />
              {" تسجيل اتصال"}
            </button>
            <button className="ghost-action" onClick={openChat}>
              <MessageCircleMore size={17} />
              {" مراسلة"}
            </button>
          </div>
        </section>
        <section>
          <span className="drawer-label">اهتمام العميل</span>
          <div className="detail-grid">
            <div>
              <small>المشروع</small>
              <strong>{lead.project}</strong>
            </div>
            <div>
              <small>الوحدة</small>
              <strong>{lead.unit}</strong>
            </div>
            <div>
              <small>المصدر</small>
              <strong>{lead.source}</strong>
            </div>
            <div>
              <small>الجوال</small>
              <strong dir="ltr">{lead.phone}</strong>
            </div>
          </div>
        </section>
        <section className="eligibility-summary">
          <span>
            <ShieldCheck size={18} />
          </span>
          <div>
            <small>ملخص الأهلية المسموح</small>
            <strong>{lead.eligibility}</strong>
            <p>
              {lead.eligible || qualified
                ? "يمكن متابعة رحلة العقار. النتيجة مبدئية وليست موافقة تمويلية."
                : "لا تظهر أي بيانات دخل أو التزامات لموظف المبيعات."}
            </p>
          </div>
        </section>
        <section>
          <span className="drawer-label">آخر ملاحظة</span>
          <p className="note-box">{lead.note}</p>
        </section>
        <section className="timeline">
          <span className="drawer-label">النشاط</span>
          <div>
            <i />
            <p>
              <strong>أُسند العميل إليك</strong>
              <small>{lead.last}</small>
            </p>
          </div>
          <div>
            <i />
            <p>
              <strong>تم حفظ الاهتمام بالمشروع</strong>
              <small>المحادثة مرتبطة بسجل العميل وتستمر عند تحويله إلى صفقة</small>
            </p>
          </div>
        </section>
      </div>
      <div className="drawer-footer">
        <button className="ghost-action" onClick={() => showToast("تمت إضافة متابعة جديدة")}>
          إضافة متابعة
        </button>
        <button className="primary-action" disabled={qualified} onClick={onQualify}>
          {qualified ? <Check size={17} /> : <Target size={17} />}
          {qualified ? "تم التأهيل" : "تأهيل العميل"}
        </button>
      </div>
    </div>
  );
}
function QuickCalculator({ open, close, showToast, onShare }) {
  const [income, setIncome] = useState("18000");
  const [property, setProperty] = useState("1350000");
  const [nationalId, setNationalId] = useState("");
  const [sent, setSent] = useState(false);
  const maxPayment = Math.round((Number(income) || 0) * 0.45);
  const indicative = Math.min(Number(property) || 0, indicativePrincipal(maxPayment, 5, 25));
  const gap = Math.max(0, (Number(property) || 0) - indicative);
  const submit = (event) => {
    event.preventDefault();
    if (nationalId.length !== 10) {
      showToast("أدخل رقم هوية مكوّن من 10 أرقام");
      return;
    }
    setSent(true);
    onShare();
    showToast("أرسلنا طلب الموافقة للعميل ووثّقنا مصدر الحسبة");
  };
  return (
    <div className={`modal-wrap ${open ? "open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="modal-scrim" onClick={close} />
      <div className="calculator-modal">
        <div className="modal-head">
          <div>
            <span className="section-icon">
              <Calculator size={20} />
            </span>
            <div>
              <small>وضع المعرض السريع</small>
              <h3>حسبة تمويل مبدئية</h3>
            </div>
          </div>
          <button aria-label="إغلاق الحاسبة" onClick={close}>
            <X size={20} />
          </button>
        </div>
        {!sent ? (
          <form onSubmit={submit}>
            <div className="shared-flow-steps">
              <span className="active">
                <i>1</i>
                {" احسب"}
              </span>
              <b />
              <span>
                <i>2</i>
                {" موافقة العميل"}
              </span>
              <b />
              <span>
                <i>3</i>
                {" ربط وتوثيق"}
              </span>
            </div>
            <div className="calc-fields">
              <label className="id-field">
                <span>رقم هوية العميل</span>
                <div>
                  <input
                    aria-label="رقم هوية العميل"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10 أرقام"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                  <FingerprintPattern size={17} />
                </div>
                <small>يُستخدم لإرسال الطلب للحساب الصحيح—ولا يكفي وحده لعرض أي بيانات.</small>
              </label>
              <label>
                <span>الدخل الشهري</span>
                <div>
                  <input
                    inputMode="numeric"
                    value={income}
                    onChange={(e) => setIncome(e.target.value.replace(/\D/g, ""))}
                  />
                  <em>ر.س</em>
                </div>
              </label>
              <label>
                <span>سعر العقار</span>
                <div>
                  <input
                    inputMode="numeric"
                    value={property}
                    onChange={(e) => setProperty(e.target.value.replace(/\D/g, ""))}
                  />
                  <em>ر.س</em>
                </div>
              </label>
            </div>
            <div className="calc-result">
              <span className="eyebrow">مثال حسابي: 5% سنويًا · 25 سنة · سقف افتراضي 45% من الدخل</span>
              <div>
                <small>قسط تقديري أعلى</small>
                <strong>
                  {maxPayment.toLocaleString("en-US")} <em>ر.س / شهر</em>
                </strong>
              </div>
              <div>
                <small>تمويل تقديري</small>
                <strong>
                  {indicative.toLocaleString("en-US")} <em>ر.س</em>
                </strong>
              </div>
              {gap > 0 && (
                <p>
                  {"الفارق التقريبي المطلوب تغطيته: "}
                  <strong>
                    {gap.toLocaleString("en-US")}
                    {" ر.س"}
                  </strong>
                </p>
              )}
            </div>
            <div className="calc-warning">
              <CircleQuestionMark size={16} />
              <p>
                <strong>هذه ليست موافقة تمويلية</strong>
                <span>لن تظهر النتيجة في حساب العميل إلا بعد دخوله عبر نفاذ وموافقته على الربط.</span>
              </p>
            </div>
            <div className="modal-actions">
              <button type="button" className="ghost-action" onClick={close}>
                إلغاء
              </button>
              <button type="submit" className="primary-action">
                <Send size={17} />
                {" إرسال طلب الحسبة للعميل"}
              </button>
            </div>
          </form>
        ) : (
          <div className="calc-sent">
            <span className="sent-pulse">
              <CircleCheck size={31} />
            </span>
            <span className="eyebrow">تم إنشاء المثال التجريبي</span>
            <h3>طلب تجريبي داخل الجلسة</h3>
            <p>
              {"نموذج طلب للهوية التجريبية المنتهية بـ "}
              <strong>{nationalId.slice(-4)}</strong>. تظهر النتيجة بعد موافقته فقط.
            </p>
            <div className="attribution-receipt">
              <div>
                <small>الموظف المستقبِل</small>
                <strong>نورة العتيبي</strong>
              </div>
              <div>
                <small>الشركة / المشروع</small>
                <strong>تلال العقارية • واجهة الدمام</strong>
              </div>
              <div>
                <small>حالة التوثيق</small>
                <strong>
                  <i />
                  {" مسجل بانتظار موافقة العميل"}
                </strong>
              </div>
            </div>
            <div className="calc-warning">
              <ShieldCheck size={16} />
              <p>
                <strong>التوثيق لا يعني مكافأة تلقائية</strong>
                <span>
                  يثبت مصدر الفرصة، ويبدأ تقييم الاستحقاق فقط بعد اكتمال الصفقة ووفق السياسة المعتمدة.
                </span>
              </p>
            </div>
            <button
              className="primary-action"
              onClick={() => {
                setSent(false);
                setNationalId("");
                close();
              }}
            >
              تم
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
function AiAssistant({ open, close, showToast }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "حيّاك يا عباس 👋 أنا مساعد ديل لاين، معك أفهمك الخيارات وأرتب لك الخطوة الجاية، بدون ما أتخذ قرار عنك.",
  );
  const ask = (value) => {
    const text = value || question;
    if (!text.trim()) return;
    if (text.includes("قسط") || text.includes("تمويل"))
      setAnswer(
        "حسب الحسبة المبدئية الحالية، نطاق القسط المعروض بين 7,840 و8,120 ر.س. الأرقام تجريبية وتحتاج عرضاً رسمياً من الجهة التمويلية.",
      );
    else if (text.includes("مشروع") || text.includes("بيت"))
      setAnswer(
        "لو تفضّل الدمام وبيت جاهز، ابدأ بمشروع بيوت تلال — واجهة الدمام. أقدر أساعدك تقارن السعر والمساحة، لكن تأكد من النشرة الرسمية قبل القرار.",
      );
    else
      setAnswer(
        "أقدر أساعدك في مقارنة المشاريع، فهم العروض، أو معرفة الخطوة المطلوبة في صفقتك. وش الجانب اللي ودك نبدأ فيه؟",
      );
    setQuestion("");
    showToast("جهّز مساعد ديل لاين الرد");
  };
  return (
    <aside className={`ai-drawer ${open ? "open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="ai-head">
        <div>
          <span>
            <Sparkles size={19} />
          </span>
          <div>
            <strong>مساعد ديل لاين</strong>
            <small>
              <i />
              {" جاهز يساعدك"}
            </small>
          </div>
        </div>
        <button onClick={close}>
          <X size={20} />
        </button>
      </div>
      <div className="ai-context">
        <ShieldCheck size={15} />
        {" ردود إرشادية تجريبية، وليست خدمة ذكاء اصطناعي متصلة أو موافقة تمويلية."}
      </div>
      <div className="ai-body">
        <div className="ai-bubble">
          <span className="bot-mark">
            <Bot size={17} />
          </span>
          <p>{answer}</p>
        </div>
        <div className="ai-prompts">
          <span>جرّب تسأل:</span>
          {["وش أقل قسط؟", "وش المشروع المناسب في الدمام؟", "وش خطوتي الجاية؟"].map((item) => (
            <button key={item} onClick={() => ask(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <form
        className="ai-compose"
        onSubmit={(event) => {
          event.preventDefault();
          ask(question);
        }}
      >
        <input
          aria-label="سؤالك لمساعد ديل لاين"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="اكتب سؤالك هنا..."
        />
        <button aria-label="إرسال">
          <Send size={18} />
        </button>
      </form>
    </aside>
  );
}
function BuyerChat({ open, close, showToast, projectContext }) {
  const [channel, setChannel] = useState(projectContext ? "developer" : "bank");
  const bank = channel === "bank";
  return (
    <div className={`chat-drawer ${open ? "open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="chat-head">
        <div>
          <span className="agent-avatar">{bank ? "ف" : "ن"}</span>
          <div>
            <strong>{bank ? "فيصل الشهري" : "نورة العتيبي"}</strong>
            <small>
              <i />
              {" متاح الآن • "}
              {bank ? "مصرف الراجحي" : "مبيعات المطور"}
            </small>
          </div>
        </div>
        <button onClick={close}>
          <X size={20} />
        </button>
      </div>
      <div className="chat-tabs">
        <button className={bank ? "active" : ""} onClick={() => setChannel("bank")}>
          <Landmark size={15} />
          {" البنك"}
        </button>
        <button className={!bank ? "active" : ""} onClick={() => setChannel("developer")}>
          <Building2 size={15} />
          {" المطور"}
        </button>
      </div>
      <div className="chat-context">
        {bank ? <Landmark size={17} /> : <Building2 size={17} />}
        <div>
          <strong>
            {projectContext ? `${projectContext.name} • ${projectContext.unit}` : "روابي الخبر • A-204"}
          </strong>
          <span>{bank ? "فُتحت قناة البنك بعد اختيار الوحدة والبنك" : "مرتبطة بالمعاملة HI-24081"}</span>
        </div>
      </div>
      <div className="messages">
        <time>اليوم</time>
        {bank ? (
          <>
            <div className="message incoming">
              حيّاك عباس، استلمت طلبك للوحدة A-204. أراجع المستندات وأوضح لك أي نقص من هنا.<span>10:32 ص</span>
            </div>
            <div className="message outgoing">
              هل العرض الحالي نهائي؟<span>10:34 ص ✓✓</span>
            </div>
            <div className="message incoming">
              العرض الظاهر مبدئي. بعد اكتمال المراجعة أرفع لك العرض الرسمي داخل نفس الطلب.<span>10:35 ص</span>
            </div>
          </>
        ) : (
          <>
            <div className="message incoming">
              أهلاً عباس، تم تأكيد حجز الوحدة A-204. أنا معك لأي استفسار يخص العقار.<span>10:18 ص</span>
            </div>
            <div className="message outgoing">
              ممتاز، هل أحتاج أي إجراء الآن من جهة المطور؟<span>10:23 ص ✓✓</span>
            </div>
            <div className="message incoming">
              لا، المطلوب الآن فقط رفع كشف الحساب للجهة التمويلية.<span>10:25 ص</span>
            </div>
          </>
        )}
      </div>
      <div className="privacy-hint">
        <LockKeyhole size={14} />{" "}
        {bank
          ? "موظف البنك يرى فقط بيانات الطلب المصرح بها."
          : "لا تظهر للمطور تفاصيلك التمويلية أو عروض البنوك."}
      </div>
      <ChatForm key={channel} showToast={showToast} />
    </div>
  );
}
function SalesChat({ open, close, showToast }) {
  const [channel, setChannel] = useState("bank");
  const bank = channel === "bank";
  return (
    <div className={`chat-drawer ${open ? "open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="chat-head">
        <div>
          <span className="agent-avatar">{bank ? "ف" : "س"}</span>
          <div>
            <strong>{bank ? "فيصل الشهري" : "سلمان العتيبي"}</strong>
            <small>
              <i /> {bank ? "موظف التمويل • مصرف الراجحي" : "عميل محتمل • روابي الخبر"}
            </small>
          </div>
        </div>
        <button onClick={close}>
          <X size={20} />
        </button>
      </div>
      <div className="chat-tabs">
        <button className={bank ? "active" : ""} onClick={() => setChannel("bank")}>
          <Landmark size={15} />
          {" موظف البنك"}
        </button>
        <button className={!bank ? "active" : ""} onClick={() => setChannel("customer")}>
          <UserRound size={15} />
          {" العميل"}
        </button>
      </div>
      <div className="chat-context">
        {bank ? <BriefcaseBusiness size={17} /> : <UsersRound size={17} />}
        <div>
          <strong>{bank ? "صفقة نجلاء • FN-2841" : "سجل العميل LD-1842"}</strong>
          <span>{bank ? "قناة تنسيق آمنة داخل طلب العميل نفسه" : "تستمر المحادثة عند التحويل إلى صفقة"}</span>
        </div>
      </div>
      <div className="messages">
        <time>اليوم</time>
        {bank ? (
          <>
            <div className="message incoming">
              نورة، أحتاج نسخة محدثة من عرض سعر الوحدة T-118 لإكمال مراجعة الطلب.<span>11:04 ص</span>
            </div>
            <div className="message outgoing">
              تم، برفعها الآن في خزنة الصفقة وأحدثك هنا.<span>11:06 ص ✓✓</span>
            </div>
            <div className="message incoming">
              وصلت، شكراً. ما احتجنا نطلب من العميل يعيد إرسالها.<span>11:08 ص</span>
            </div>
          </>
        ) : (
          <>
            <div className="message incoming">
              السلام عليكم، هل الوحدة A-204 ما زالت متاحة؟<span>10:18 ص</span>
            </div>
            <div className="message outgoing">
              وعليكم السلام سلمان، أراجع لك آخر حالة للوحدة قبل تأكيد التوفر. هل يناسبك موعد زيارة اليوم بعد
              المغرب؟<span>10:22 ص ✓✓</span>
            </div>
          </>
        )}
      </div>
      <div className="privacy-hint">
        <LockKeyhole size={14} />{" "}
        {bank
          ? "تظهر فقط للموظفين المسؤولين عن هذه الصفقة وتُسجل في مسار التدقيق."
          : "المحادثة ضمن نطاق العميل المسند لك."}
      </div>
      <ChatForm key={channel} showToast={showToast} />
    </div>
  );
}
function BankChat({ open, close, showToast }) {
  const [channel, setChannel] = useState("developer");
  const developer = channel === "developer";
  return (
    <div className={`chat-drawer ${open ? "open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="chat-head">
        <div>
          <span className="agent-avatar">{developer ? "ن" : "نق"}</span>
          <div>
            <strong>{developer ? "نورة العتيبي" : "نجلاء القحطاني"}</strong>
            <small>
              <i /> {developer ? "موظفة المطور • تلال العقارية" : "العميل • الطلب FN-2841"}
            </small>
          </div>
        </div>
        <button onClick={close}>
          <X size={20} />
        </button>
      </div>
      <div className="chat-tabs">
        <button className={developer ? "active" : ""} onClick={() => setChannel("developer")}>
          <Building2 size={15} />
          {" موظف المطور"}
        </button>
        <button className={!developer ? "active" : ""} onClick={() => setChannel("customer")}>
          <UserRound size={15} />
          {" العميل"}
        </button>
      </div>
      <div className="chat-context">
        <BriefcaseBusiness size={17} />
        <div>
          <strong>الطلب FN-2841 • الوحدة T-118</strong>
          <span>محادثة مرتبطة بطلب نجلاء القحطاني</span>
        </div>
      </div>
      <div className="messages">
        <time>اليوم</time>
        {developer ? (
          <>
            <div className="message outgoing">
              نورة، أحتاج نسخة محدثة من عرض سعر الوحدة T-118 لإكمال مراجعة الطلب.<span>11:04 ص ✓✓</span>
            </div>
            <div className="message incoming">
              تم، رفعتها في خزنة الصفقة.<span>11:06 ص</span>
            </div>
            <div className="message outgoing">
              وصلت، شكراً. بكمل المراجعة الآن.<span>11:08 ص ✓✓</span>
            </div>
          </>
        ) : (
          <>
            <div className="message outgoing">
              حيّاك، استلمت طلبك وأراجع المستندات الآن.<span>10:32 ص ✓✓</span>
            </div>
            <div className="message incoming">
              هل فيه شيء ناقص؟<span>10:34 ص</span>
            </div>
            <div className="message outgoing">
              حالياً نحتاج كشف الحساب فقط، وتقدر ترفعه من خانة مستنداتك.<span>10:35 ص ✓✓</span>
            </div>
          </>
        )}
      </div>
      <div className="privacy-hint">
        <LockKeyhole size={14} />{" "}
        {developer
          ? "لا تظهر لموظف المطور بيانات الدخل أو الالتزامات أو تفاصيل العرض."
          : "لا يشارك هذا الحوار مع المطور إلا بإجراء صريح ومحدد."}
      </div>
      <ChatForm key={channel} showToast={showToast} />
    </div>
  );
}
function ChatForm({ showToast }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState([]);
  return (
    <>
      {sent.map((item, index) => (
        <div key={`${item}-${index}`} className="inline-sent-message">
          {item}
          <span>الآن ✓✓</span>
        </div>
      ))}
      <form
        className="chat-compose"
        onSubmit={(event) => {
          event.preventDefault();
          if (!message.trim()) return;
          setSent((items) => [...items, message.trim()]);
          setMessage("");
          showToast("أضيفت الرسالة داخل التجربة؛ لم تُرسل لأي جهة خارجية.");
        }}
      >
        <button
          type="button"
          aria-label="إرفاق ملف"
          onClick={() => showToast("يمكنك اختيار PDF أو صورة حتى 10MB في الربط الفعلي")}
        >
          <CloudUpload size={19} />
        </button>
        <input
          aria-label="الرسالة"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="اكتب رسالتك..."
        />
        <button type="submit" aria-label="إرسال">
          <ArrowLeft size={19} />
        </button>
      </form>
    </>
  );
}
export default HomePage;
