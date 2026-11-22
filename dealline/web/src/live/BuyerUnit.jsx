// The unit a buyer picked on an office site, shown inside the Deal Line buyer portal after login,
// with a calculation on that unit's exact price. Uses the recovered calculator's styles and rule
// (45% of income as the payment cap, 5% a year over 25 years as the worked example).
import { useState } from "react";
import { Building2, CircleCheck, CircleQuestionMark, ShieldCheck } from "lucide-react";
import { api, PLAN_TRIGGERS, UNIT_TYPES } from "./api.js";
import { monthlyInstallment, splitHalalas } from "./handoff.js";

const riyal = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
const RATE = 5;
const YEARS = 25;
const CAP = 0.45;

export function BuyerUnitBanner({ handoff, open }) {
  const { project, unit } = handoff;
  return (
    <section className="panel live-panel buyer-unit-banner">
      <div className="panel-head">
        <div>
          <span className="eyebrow"><Building2 size={14} /> الوحدة التي اخترتها من موقع {handoff.office}</span>
          <h3>{project.name} — الوحدة <bdi>{unit.code}</bdi></h3>
          <p>{UNIT_TYPES[unit.unit_type] ?? ""} · {unit.area_sqm} م² · {riyal(unit.price_halalas / 100)} ر.س</p>
        </div>
        <button className="primary-action" onClick={open}>{handoff.intent === "buy" ? "أكمل الشراء" : "عرض الحسبة"}</button>
      </div>
    </section>
  );
}

export function BuyerUnitDetail({ handoff, buyerName, done }) {
  const { project, unit, plans = [] } = handoff;
  const price = unit.price_halalas / 100;
  const [income, setIncome] = useState("18000");
  const [downPct, setDownPct] = useState("10");
  const down = Math.round(price * (Math.min(Math.max(Number(downPct) || 0, 0), 100) / 100) * 100) / 100;
  const financed = Math.max(0, price - down);
  const monthly = Math.round(monthlyInstallment(financed, RATE, YEARS));
  const maxPayment = Math.round((Number(income) || 0) * CAP);
  const neededIncome = Math.ceil(monthly / CAP);
  const fits = maxPayment >= monthly;

  return (
    <div className="live-body buyer-unit">
      <dl className="live-dl">
        <div><dt>المشروع</dt><dd>{project.name}</dd></div>
        <div><dt>الوحدة</dt><dd>{unit.code} · {UNIT_TYPES[unit.unit_type] ?? ""}</dd></div>
        <div><dt>المساحة</dt><dd>{unit.area_sqm} م²{unit.bedrooms != null ? ` · ${unit.bedrooms} غرف` : ""}</dd></div>
        <div><dt>سعر الوحدة</dt><dd>{riyal(price)} ر.س</dd></div>
        <div><dt>الموقع</dt><dd>{project.city}{project.district ? ` · ${project.district}` : ""}</dd></div>
        {project.wafi_license_number && <div><dt>ترخيص وافي</dt><dd dir="ltr">{project.wafi_license_number}</dd></div>}
      </dl>

      <h3>حسبتك على سعر هذه الوحدة</h3>
      <div className="calc-fields">
        <label>
          <span>الدخل الشهري</span>
          <div>
            <input id="buyer-unit-income" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value.replace(/\D/g, ""))} />
            <em>ر.س</em>
          </div>
        </label>
        <label>
          <span>الدفعة الأولى</span>
          <div>
            <input id="buyer-unit-down" inputMode="decimal" value={downPct} onChange={(e) => setDownPct(e.target.value.replace(/[^\d.]/g, ""))} />
            <em>%</em>
          </div>
        </label>
        <label>
          <span>سعر العقار</span>
          <div>
            <input id="buyer-unit-price" value={riyal(price)} readOnly aria-readonly="true" />
            <em>ر.س</em>
          </div>
        </label>
      </div>
      <div className="calc-result">
        <span className="eyebrow">مثال حسابي: {RATE}% سنويًا · {YEARS} سنة · سقف افتراضي 45% من الدخل</span>
        <div>
          <small>الدفعة الأولى</small>
          <strong>{riyal(down)} <em>ر.س</em></strong>
        </div>
        <div>
          <small>مبلغ التمويل</small>
          <strong>{riyal(financed)} <em>ر.س</em></strong>
        </div>
        <div>
          <small>القسط الشهري التقديري</small>
          <strong>{riyal(monthly)} <em>ر.س / شهر</em></strong>
        </div>
        <p>
          {fits ? "القسط ضمن سقف 45% من دخلك المدخل" : "القسط أعلى من سقف 45% من دخلك المدخل؛ الدخل التقريبي المطلوب: "}
          {!fits && <strong>{riyal(neededIncome)} ر.س</strong>}
        </p>
      </div>
      <div className="calc-warning">
        <CircleQuestionMark size={16} />
        <p>
          <strong>هذه ليست موافقة تمويلية</strong>
          <span>الأرقام توضيحية بنسبة وسنوات افتراضية. العرض الفعلي يصدر من الجهة التمويلية بعد طلبك وموافقتك على مشاركة البيانات.</span>
        </p>
      </div>

      {plans.map((pl) => {
        const amounts = splitHalalas(unit.price_halalas, pl.items.map((i) => i.share_bp));
        return (
          <div key={pl.name} style={{ marginTop: 16 }}>
            <h3>دفعات المطور على سعر الوحدة: {pl.name}</h3>
            <div className="live-table-wrap">
              <table className="live-table">
                <thead><tr><th>الدفعة</th><th>النسبة</th><th>الاستحقاق</th><th>المبلغ</th></tr></thead>
                <tbody>
                  {pl.items.map((i, k) => (
                    <tr key={k}>
                      <td>{i.label}</td>
                      <td className="num">{i.share_bp / 100}%</td>
                      <td>{PLAN_TRIGGERS[i.trigger]}{i.at_progress_pct ? ` ${i.at_progress_pct}%` : ""}{i.days_after_contract ? ` (${i.days_after_contract} يوم)` : ""}</td>
                      <td className="num">{riyal(amounts[k] / 100)} ر.س</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="live-note">مبالغ البيع على الخارطة تُحوّل إلى حساب الضمان الخاص بالمشروع، ولا تُدفع عبر ديل لاين.</p>
          </div>
        );
      })}

      <PurchaseRequest handoff={handoff} buyerName={buyerName} done={done} />
    </div>
  );
}

function PurchaseRequest({ handoff, buyerName, done }) {
  const { project, unit } = handoff;
  const [state, setState] = useState({ sent: false, busy: false, error: "" });
  if (state.sent)
    return (
      <div className="live-state" role="status" style={{ marginTop: 16 }}>
        <CircleCheck size={20} /> وصل طلب الشراء إلى {handoff.office}. سيتواصل معك فريق المبيعات لحجز الوحدة {unit.code}.
        <button className="ghost-action" onClick={done}>تم</button>
      </div>
    );
  return (
    <form
      className="live-form"
      style={{ marginTop: 18 }}
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setState({ sent: false, busy: true, error: "" });
        try {
          await api(`/public/sites/${handoff.host}/projects/${project.id}/interest`, {
            method: "POST",
            body: {
              name: String(fd.get("name")).trim(),
              phone: String(fd.get("phone")).trim(),
              unit_id: unit.id,
              source_channel: "dealline",
              message: `طلب شراء عبر ديل لاين — الوحدة ${unit.code} بسعر ${riyal(unit.price_halalas / 100)} ر.س`,
            },
          });
          setState({ sent: true, busy: false, error: "" });
        } catch (err) {
          setState({ sent: false, busy: false, error: err.message });
        }
      }}
    >
      <h3 style={{ margin: "0 0 10px" }}>{handoff.intent === "buy" ? "أكمل طلب الشراء" : "جاهز تشتري؟"}</h3>
      <div className="live-form-grid">
        <label className="live-field"><span>الاسم</span><input id="buyer-unit-name" name="name" required maxLength={120} defaultValue={buyerName} /></label>
        <label className="live-field"><span>الجوال</span><input id="buyer-unit-phone" name="phone" required placeholder="05xxxxxxxx" dir="ltr" autoComplete="tel" /></label>
      </div>
      {state.error && <div className="live-state error" role="alert" style={{ marginTop: 10 }}>{state.error}</div>}
      <div className="live-form-foot">
        <button className="primary-action" disabled={state.busy}>{state.busy ? "جارٍ الإرسال…" : "إرسال طلب الشراء للمكتب"}</button>
      </div>
      <p className="portal-security-note"><ShieldCheck size={15} /> يُرسل اسمك وجوالك والوحدة فقط إلى {handoff.office}. لا دفع ولا حجز مالي من هنا.</p>
    </form>
  );
}
