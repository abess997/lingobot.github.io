// Recovered from the Deal Line production build (app/demo-domain.ts). Types were stripped by the build and are not recoverable.

export function periodRange(period, today, from, to) {
  const date = new Date(`${today}T12:00:00Z`);
  if (!Number.isFinite(date.getTime())) throw new Error("Invalid report date");
  const iso = (d) => d.toISOString().slice(0, 10);
  if (period === "custom") {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(to) ||
      !Number.isFinite(Date.parse(from)) ||
      !Number.isFinite(Date.parse(to)) ||
      from > to
    )
      return null;
    return {
      from,
      to,
    };
  }
  const start = new Date(date);
  if (period === "weekly") start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  if (period === "monthly") start.setUTCDate(1);
  if (period === "quarterly") {
    start.setUTCDate(1);
    start.setUTCMonth(Math.floor(start.getUTCMonth() / 3) * 3);
  }
  if (period === "yearly") start.setUTCMonth(0, 1);
  return {
    from: iso(start),
    to: today,
  };
}
export function withinRange(date, range) {
  return !!range && date >= range.from && date <= range.to;
}
export function indicativePrincipal(monthlyPayment, annualRate, years) {
  if (
    ![monthlyPayment, annualRate, years].every(Number.isFinite) ||
    monthlyPayment < 0 ||
    annualRate < 0 ||
    years <= 0
  )
    return 0;
  const months = years * 12;
  const rate = annualRate / 1200;
  return Math.round(
    rate === 0 ? monthlyPayment * months : (monthlyPayment * (1 - Math.pow(1 + rate, -months))) / rate,
  );
}
export function walletSummary(entries) {
  return entries.reduce(
    (totals, entry) => {
      if (!Number.isFinite(entry.amount) || entry.amount < 0) throw new Error("Invalid ledger amount");
      if (entry.state === "available") totals.available += entry.amount;
      if (entry.state === "paid" || entry.state === "reversed") totals.available -= entry.amount;
      if (entry.state === "paid") totals.paid += entry.amount;
      if (entry.state === "pending") totals.pending += entry.amount;
      return totals;
    },
    {
      available: 0,
      pending: 0,
      paid: 0,
    },
  );
}
export function csvCell(value) {
  return `"${(/^[=+\-@\t\r]/.test(value) ? `'${value}` : value).replaceAll('"', '""')}"`;
}
export const demoInventory = [
  {
    id: "A-204",
    project: "روابي الخبر",
    type: "تاون هاوس",
    state: "محجوزة",
    inquiries: 14,
  },
  {
    id: "T-118",
    project: "تلال الواجهة",
    type: "فيلا",
    state: "محجوزة",
    inquiries: 9,
  },
  {
    id: "B-311",
    project: "واحة الدمام",
    type: "شقة",
    state: "محجوزة",
    inquiries: 5,
  },
  {
    id: "V-027",
    project: "بيوت قمرة",
    type: "فيلا",
    state: "مباعة",
    inquiries: 21,
  },
  {
    id: "T-122",
    project: "تلال الواجهة",
    type: "فيلا",
    state: "متاحة",
    inquiries: 2,
  },
];
