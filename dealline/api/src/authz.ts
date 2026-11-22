import type { Member } from "./auth.js";

/** The one place that answers "can this member do this?". Row ownership (which org)
 *  is enforced by RLS; this decides what a role may do inside its own org. */
export type Action =
  | "site:edit" | "site:publish" | "domain:manage" | "payments:configure"
  | "listing:create" | "listing:edit" | "listing:publish" | "listing:delete"
  | "lead:view" | "lead:update" | "lead:assign"
  | "org:edit" | "org:delete"
  // off-plan
  | "project:manage" | "plan:manage" | "deal:create" | "deal:advance" | "deal:exception" | "escrow:record"
  // automation & integrations
  | "automation:manage" | "whatsapp:send" | "integrations:manage";

const ADMIN_UP: Action[] = [
  "automation:manage",
  "site:edit", "site:publish", "domain:manage", "listing:publish", "listing:delete", "lead:assign", "org:edit",
  "project:manage", "plan:manage", "deal:exception", "escrow:record",
];
const OWNER_ONLY: Action[] = ["payments:configure", "org:delete", "integrations:manage"];

export function can(m: Member | null, action: Action, ctx: { ownsRecord?: boolean } = {}): boolean {
  if (!m) return false;
  if (OWNER_ONLY.includes(action)) return m.role === "owner";
  if (ADMIN_UP.includes(action)) return m.role === "owner" || m.role === "admin";
  if (m.role !== "member") return true;
  // members: create listings, edit their own, see and update leads assigned to them
  if (action === "listing:create" || action === "lead:view" || action === "deal:create") return true;
  if (action === "listing:edit" || action === "lead:update" || action === "deal:advance" || action === "whatsapp:send")
    return ctx.ownsRecord === true;
  return false;
}
