import type { Env } from "./env.js";

// ---------- email ----------
export interface Mailer {
  send(to: string, subject: string, html: string): Promise<void>;
}
export function resendMailer(env: Env): Mailer {
  return {
    async send(to, subject, html) {
      if (!env.RESEND_API_KEY) {
        if (env.NODE_ENV === "production") throw new Error("email not configured");
        console.info(`[dev email] to=${to} subject=${subject}\n${html}`);
        return;
      }
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: env.EMAIL_FROM, to, subject, html }),
      });
      if (!r.ok) throw new Error(`resend ${r.status}`);
    },
  };
}

// ---------- Moyasar ----------
export type MoyasarPayment = {
  id: string; status: string; amount: number; currency: string;
  metadata?: Record<string, string> | null;
};
export interface PaymentGateway {
  fetchPayment(id: string): Promise<MoyasarPayment>;
}
/** Server-side lookup with the secret key. The webhook body is never trusted on its own:
 *  status, amount, currency and our reservation id are re-read from Moyasar's API. */
export function moyasarGateway(env: Env, fetchFn: typeof fetch = fetch): PaymentGateway {
  return {
    async fetchPayment(id) {
      if (!env.MOYASAR_SECRET_KEY) throw new Error("payments not configured");
      if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) throw new Error("bad payment id");
      const auth = Buffer.from(`${env.MOYASAR_SECRET_KEY}:`).toString("base64");
      const r = await fetchFn(`https://api.moyasar.com/v1/payments/${id}`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (!r.ok) throw new Error(`moyasar ${r.status}`);
      return (await r.json()) as MoyasarPayment;
    },
  };
}

// ---------- rate limit (per instance; use Redis/Upstash when running more than one) ----------
export function rateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { n: number; reset: number }>();
  return (key: string) => {
    const now = Date.now();
    const h = hits.get(key);
    if (!h || h.reset < now) {
      hits.set(key, { n: 1, reset: now + windowMs });
      if (hits.size > 50_000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
      return true;
    }
    return ++h.n <= limit;
  };
}
