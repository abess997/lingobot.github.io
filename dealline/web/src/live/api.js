// One client for both ways of running Deal Line:
//  - "http": the real API server (npm run dev in ../api), same origin through the Vite proxy, http-only cookie.
//  - "browser": the same API running inside this tab on PGlite (demo build, VITE_BACKEND=browser).
let transport = null;
let booting = null;
let jar = ""; // browser mode only: the session cookie the in-tab API set

export const backendMode = () => transport?.mode ?? (__BROWSER_BACKEND__ ? "browser" : "http");
export const backendInfo = () => transport;

export function initBackend() {
  if (transport) return Promise.resolve(transport);
  booting ??= (async () => {
    if (__BROWSER_BACKEND__) {
      const { bootBrowserBackend } = await import("../browser-backend/index.js");
      transport = await bootBrowserBackend();
      try { jar = sessionStorage.getItem("dealline-demo-session") ?? ""; } catch { /* storage blocked */ }
    } else {
      transport = { mode: "http", sitesRoot: import.meta.env.VITE_SITES_ROOT ?? "dealline.site", fetch: (req) => fetch(req) };
    }
    return transport;
  })();
  return booting;
}

export class ApiError extends Error {
  constructor(status, data) {
    super(errorText(data, status));
    this.status = status;
    this.code = data?.error;
    this.data = data;
  }
}

export async function api(path, { method = "GET", body } = {}) {
  const t = await initBackend();
  const init = { method, headers: { "content-type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) };
  let res;
  if (t.mode === "browser") {
    if (jar) init.headers["x-dl-cookie"] = jar;
    res = await t.fetch(new Request(`https://api.dealline.local${path}`, init));
    const set = res.headers.get("x-dl-set-cookie");
    if (set) {
      const [pair] = set.split(";");
      jar = /max-age=0/i.test(set) || pair.endsWith("=") ? "" : pair;
      try { jar ? sessionStorage.setItem("dealline-demo-session", jar) : sessionStorage.removeItem("dealline-demo-session"); } catch { /* memory only */ }
    }
  } else {
    res = await t.fetch(new Request(path, { ...init, credentials: "include" }));
  }
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { error: text }; }
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

const MESSAGES = {
  unauthenticated: "انتهت الجلسة. سجّل الدخول من جديد.",
  invalid_credentials: "البريد أو كلمة المرور غير صحيحة.",
  forbidden: "صلاحيتك لا تسمح بهذا الإجراء.",
  not_found: "العنصر غير موجود أو ليس ضمن جهتك.",
  conflict: "يوجد سجل بنفس البيانات (تكرار).",
  rate_limited: "محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.",
  validation: "تحقق من الحقول المدخلة.",
  rule_violation: "الإجراء يخالف قاعدة في النظام.",
  fal_license_required: "لا يمكن نشر الموقع قبل إدخال رقم رخصة فال للمنشأة.",
  ad_license_missing_or_expired: "رخصة الإعلان (هيئة العقار) غير موجودة أو منتهية؛ أضف رخصة سارية أولًا.",
  wafi_license_required: "لا يمكن طرح المشروع للبيع بدون رقم ترخيص وافي.",
  escrow_account_required: "لا يمكن طرح المشروع للبيع بدون حساب ضمان (IBAN).",
  progress_not_100: "لا يكتمل المشروع قبل وصول الإنجاز إلى 100%.",
  progress_cannot_go_down: "نسبة الإنجاز لا تنقص عن آخر تقرير.",
  project_not_selling: "المشروع ليس في حالة «متاح للبيع».",
  unit_not_available: "الوحدة غير متاحة (محجوزة أو مباعة).",
  unit_in_deal: "الوحدة داخل صفقة؛ عدّلها من الصفقة.",
  plan_not_found_for_project: "خطة الدفع غير موجودة لهذا المشروع أو غير مفعلة.",
  booking_payment_not_received: "لم تصل دفعة الحجز كاملة إلى حساب الضمان بعد.",
  installments_outstanding: "توجد دفعات غير مسددة؛ لا يمكن التسليم.",
  project_not_complete: "لا يمكن التسليم قبل إنجاز المشروع 100%.",
  overpayment: "المبلغ أكبر من المتبقي على الدفعة.",
  deal_closed: "الصفقة مغلقة.",
  installment_paid: "الدفعة مسددة بالكامل.",
  installment_cancelled: "الدفعة ملغاة.",
  no_overdue_installment: "لا يمكن تسجيل تعثر بدون دفعة متأخرة.",
  lead_not_found: "العميل المحتمل غير موجود.",
  assignee_not_in_org: "الموظف ليس ضمن الجهة.",
  nothing_to_update: "لا توجد تغييرات.",
  slug_reserved: "هذا الاسم محجوز؛ اختر اسمًا آخر للرابط.",
  create_site_first: "أنشئ الموقع واحفظه أولًا.",
  use_slug_instead: "استخدم رابط ديل لاين الفرعي بدل هذا النطاق.",
  payments_not_configured: "الدفع الإلكتروني غير مهيأ في هذه البيئة.",
  deposits_disabled: "العربون غير مفعل لهذا الموقع.",
  already_reserved: "الوحدة محجوزة.",
  whatsapp_not_connected: "واتساب الأعمال غير مربوط.",
  outside_24h_window_use_template: "مرّت 24 ساعة على آخر رسالة من العميل؛ أرسل قالبًا معتمدًا.",
  org_has_paid_reservations: "توجد حجوزات مدفوعة؛ لا يمكن حذف الجهة.",
  internal: "حدث خطأ في الخادم.",
};

export function errorText(data, status) {
  const code = data?.error ?? "";
  if (code === "validation" && data.issues?.length)
    return `${MESSAGES.validation} ${data.issues.map((i) => `${i.path || "—"}: ${i.message}`).join(" · ")}`;
  if (code.startsWith("invalid_transition_from_")) return `لا يمكن تنفيذ الخطوة من الحالة الحالية (${statusLabel(code.slice(24))}).`;
  if (code.startsWith("url_rejected")) return `عنوان Webhook مرفوض: ${code.slice(14)}`;
  if (code === "rule_violation" && data.detail) return `${MESSAGES.rule_violation} (${data.detail})`;
  return MESSAGES[code] ?? (status ? `تعذر تنفيذ الطلب (${status}${code ? ` · ${code}` : ""}).` : "تعذر الاتصال بالخادم.");
}

// ---- formatting ----
export const sar = (halalas) =>
  halalas == null ? "—" : `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(halalas) / 100)} ر.س`;
export const toHalalas = (riyals) => Math.round(Number(riyals) * 100);
export const date = (v) => (v ? new Date(v).toLocaleDateString("ar-SA-u-nu-latn", { year: "numeric", month: "short", day: "numeric" }) : "—");
export const dateTime = (v) =>
  v ? new Date(v).toLocaleString("ar-SA-u-nu-latn", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
export const today = () => new Date().toISOString().slice(0, 10);

const LABELS = {
  draft: "مسودة", published: "منشور", reserved: "محجوز", sold: "مباع", archived: "مؤرشف",
  new: "جديد", contacted: "تم التواصل", qualified: "مؤهل", won: "تم البيع", lost: "لم يتم",
  selling: "متاح للبيع", sold_out: "مباع بالكامل", completed: "مكتمل",
  available: "متاحة", held: "محجوزة مؤقتًا", handed_over: "سُلّمت", blocked: "موقوفة",
  contracted: "متعاقد", defaulted: "متعثر", cancelled: "ملغاة", transferred: "متنازل عنها",
  scheduled: "مجدولة", due: "مستحقة", overdue: "متأخرة", paid: "مسددة", waived: "معفاة",
  open: "مفتوحة", done: "منجزة", failed: "فشل", skipped: "تخطّي", pending: "قيد الانتظار", dead: "متوقف",
  owner: "مالك", admin: "مشرف", member: "موظف مبيعات",
  sale: "بيع", rent: "إيجار",
};
export const statusLabel = (s) => LABELS[s] ?? s;

export const PROPERTY_TYPES = {
  apartment: "شقة", villa: "فيلا", floor: "دور", land: "أرض", building: "عمارة", office: "مكتب", shop: "محل", warehouse: "مستودع", other: "أخرى",
};
export const UNIT_TYPES = { apartment: "شقة", villa: "فيلا", townhouse: "تاون هاوس", floor: "دور", office: "مكتب", shop: "محل", other: "أخرى" };
export const TRIGGERS = {
  "lead.created": "عميل محتمل جديد", "listing.published": "نشر عقار", "reservation.paid": "دفع عربون",
  "deal.held": "حجز وحدة على الخارطة", "deal.contracted": "توقيع عقد", "installment.due_soon": "اقتراب موعد دفعة",
  "installment.overdue": "تأخر دفعة", "whatsapp.received": "رسالة واتساب واردة",
};
export const PLAN_TRIGGERS = {
  on_booking: "عند الحجز", on_contract: "عند العقد", after_days: "بعد أيام من العقد", at_progress: "عند نسبة إنجاز", on_handover: "عند التسليم",
};
export const CHANNELS = { snapchat: "سناب شات", tiktok: "تيك توك", google: "قوقل", x: "إكس", whatsapp: "واتساب", instagram: "انستقرام" };
