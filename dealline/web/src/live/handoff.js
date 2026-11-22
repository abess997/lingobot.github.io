// Carries the unit a visitor picked on an office site (#/site/<slug>) into the Deal Line buyer
// portal (#/buy): login, then the same unit with a calculation on its exact price.
// Kept in memory, and in sessionStorage so a reload during login does not lose it.
const KEY = "dealline-unit-handoff";
let current = null;

export function saveHandoff(h) {
  current = h;
  try { sessionStorage.setItem(KEY, JSON.stringify(h)); } catch { /* memory only */ }
}

export function loadHandoff() {
  if (current) return current;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) current = JSON.parse(raw);
  } catch { /* storage blocked */ }
  return current;
}

export function clearHandoff() {
  current = null;
  try { sessionStorage.removeItem(KEY); } catch { /* memory only */ }
}

/** Same split the API uses for installments: floor by basis points, leftover to the last one. */
export function splitHalalas(price, shares) {
  const out = shares.map((bp) => Math.floor((price * bp) / 10000));
  out[out.length - 1] += price - out.reduce((a, b) => a + b, 0);
  return out;
}

/** Monthly installment for a principal at an annual rate over years (annuity). */
export function monthlyInstallment(principal, annualRate, years) {
  const n = years * 12;
  const r = annualRate / 1200;
  if (principal <= 0 || n <= 0) return 0;
  return r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
}
