import { Building2, CalendarClock, CircleAlert, Globe, House, Landmark, UsersRound, Wallet } from "lucide-react";
import { api, dateTime, sar, statusLabel } from "../api.js";
import { Badge, Kpi, Loaded, Panel, useLoad } from "../ui.jsx";

export function Overview({ me, isAdmin, go }) {
  const data = useLoad(async () => {
    const [leads, tasks, listings, site, dash] = await Promise.all([
      api("/api/leads"),
      api("/api/automation/tasks?status=open"),
      api("/api/listings"),
      isAdmin ? api("/api/site") : null,
      isAdmin ? api("/api/offplan/dashboard") : null,
    ]);
    return { leads, tasks, listings, site, dash };
  }, [isAdmin]);

  return (
    <>
      <section className="welcome-row sales-welcome">
        <div>
          <span className="eyebrow"><Building2 size={14} /> {me.org_name}</span>
          <h2>أهلًا {me.name}، هذا وضع اليوم.</h2>
          <p>{isAdmin ? "الموقع والمخزون والعملاء وتحصيلات مشاريع الخارطة — من قاعدة البيانات مباشرة." : "مهامك والعملاء المسندون لك."}</p>
        </div>
      </section>
      <Loaded state={data}>
        {({ leads, tasks, listings, site, dash }) => (
          <>
            <section className="sales-kpis">
              <Kpi icon={UsersRound} tone="mint" label="عملاء جدد" value={leads.filter((l) => l.status === "new").length} note={`من ${leads.length} عميل`} onClick={() => go("leads")} />
              <Kpi icon={CalendarClock} tone="gold" label="مهام مفتوحة" value={tasks.length} note="من الأتمتة أو يدويًا" onClick={() => go("automation")} />
              <Kpi icon={House} tone="blue" label="عقارات منشورة" value={listings.filter((l) => l.status === "published").length} note={`${listings.length} في المخزون`} onClick={() => go("listings")} />
              {isAdmin ? (
                <Kpi icon={Globe} tone="coral" label="موقع المكتب" value={site?.published ? "منشور" : site ? "غير منشور" : "لم يُنشأ"} note={site ? site.slug : "ابدأ من «موقع المكتب»"} onClick={() => go("site")} />
              ) : (
                <Kpi icon={Building2} tone="coral" label="مشاريع الخارطة" value="—" note="ابدأ حجزًا من «صفقات الخارطة»" onClick={() => go("deals")} />
              )}
            </section>
            {dash && (
              <section className="sales-kpis">
                <Kpi icon={Building2} tone="mint" label="وحدات الخارطة" value={dash.units.total ?? 0} note={`${dash.units.available ?? 0} متاحة · ${(dash.units.reserved ?? 0) + (dash.units.held ?? 0)} محجوزة`} onClick={() => go("projects")} />
                <Kpi icon={Landmark} tone="blue" label="قيمة المبيعات" value={sar(dash.sold_value_halalas)} note="حجوزات وعقود" />
                <Kpi icon={Wallet} tone="gold" label="المحصّل في حساب الضمان" value={sar(dash.collected_halalas)} note={`نسبة التحصيل ${dash.collection_pct}%`} onClick={() => go("deals")} />
                <Kpi icon={CircleAlert} tone="coral" label="متأخرات" value={sar(dash.overdue_outstanding_halalas)} note={`${dash.defaulted_deals} صفقة متعثرة · مستحق ${sar(dash.due_outstanding_halalas)}`} onClick={() => go("deals")} />
              </section>
            )}
            <div className="live-grid-2">
              <Panel title="أحدث العملاء المحتملين" subtitle="من نماذج الموقع وواتساب والـ API">
                <ul className="live-timeline live-body">
                  {leads.slice(0, 6).map((l) => (
                    <li key={l.id}>
                      <span><strong>{l.name}</strong> <small>{l.listing_title ?? l.message ?? ""}</small></span>
                      <Badge status={l.status} />
                    </li>
                  ))}
                  {!leads.length && <li>لا يوجد عملاء بعد.</li>}
                </ul>
              </Panel>
              <Panel title="مهامي المفتوحة" subtitle="تنشئها قواعد الأتمتة تلقائيًا">
                <ul className="live-timeline live-body">
                  {tasks.slice(0, 6).map((t) => (
                    <li key={t.id}>
                      <span>{t.title} <small>{t.due_at ? `حتى ${dateTime(t.due_at)}` : ""}</small></span>
                      <Badge status={t.status}>{statusLabel(t.status)}</Badge>
                    </li>
                  ))}
                  {!tasks.length && <li>لا توجد مهام مفتوحة.</li>}
                </ul>
              </Panel>
            </div>
          </>
        )}
      </Loaded>
    </>
  );
}
