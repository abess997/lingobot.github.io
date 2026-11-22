import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import type { Q } from "./db.js";

export const EVENT_TYPES = [
  "lead.created", "listing.published", "reservation.paid", "deal.held", "deal.contracted",
  "installment.due_soon", "installment.overdue", "whatsapp.received",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/** Writes to the outbox inside the caller's transaction: the event exists if and only if the change committed. */
export async function emit(q: Q, orgId: string, type: EventType, payload: Record<string, unknown>) {
  await q.query(`insert into events (org_id, type, payload) values ($1,$2,$3)`, [orgId, type, JSON.stringify(payload)]);
}

/** Snapshot of a lead for event payloads ({{lead.name}}, {{contact.phone}} in rules). */
export const leadPayload = (l: any, extra: Record<string, unknown> = {}) => ({
  lead: {
    id: l.id, name: l.name, phone: l.phone, email: l.email ?? null, source: l.source,
    source_channel: l.source_channel ?? null, utm_campaign: l.utm_campaign ?? null,
    listing_id: l.listing_id ?? null, project_id: l.project_id ?? null, unit_id: l.unit_id ?? null,
  },
  contact: { name: l.name, phone: l.phone, email: l.email ?? null },
  assignee: l.assigned_to ?? null,
  related: { type: "lead", id: l.id },
  ...extra,
});

export const sar =(halalas: number) => (Number(halalas) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });

// ---------- secrets at rest (per-org WhatsApp tokens, webhook signing secrets) ----------
function key(b64?: string) {
  if (!b64) throw new Error("SECRETS_KEY not configured");
  const k = Buffer.from(b64, "base64");
  if (k.length !== 32) throw new Error("SECRETS_KEY must be 32 bytes, base64");
  return k;
}
export function encrypt(plain: string, b64Key?: string) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(b64Key), iv);
  const ct = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return `v1.${iv.toString("base64")}.${c.getAuthTag().toString("base64")}.${ct.toString("base64")}`;
}
export function decrypt(blob: string, b64Key?: string) {
  const [v, iv, tag, ct] = blob.split(".");
  if (v !== "v1" || !iv || !tag || !ct) throw new Error("bad secret format");
  const d = createDecipheriv("aes-256-gcm", key(b64Key), Buffer.from(iv, "base64"));
  d.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([d.update(Buffer.from(ct, "base64")), d.final()]).toString("utf8");
}
