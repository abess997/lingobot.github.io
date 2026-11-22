# Deal Line: website builder backend

Target: what Nuzul's website builder does (branded office site, inventory management, responsive,
linked to CRM, payments, and the account), rebuilt clean-room. No Nuzul code, copy, or assets.

## Stack (assumed; Deal Line's real stack is not known yet)
Hono + TypeScript, Postgres (any managed host: Supabase, Neon), Resend for email, Moyasar for payments.
Same style as Hesba In (Hono + TS), so it can be merged or run as its own service.

## Done
- **Auth**: email signup, email verification, password reset (signs out every device), logout,
  logout-all, http-only secure cookies (SameSite=Lax, 30 days), scrypt passwords, account deletion
  (deletes the user and any org where they are the only owner).
- **Roles**: owner / admin / member, decided in one place: `src/authz.ts` → `can()`.
- **Database**: `db/migrations/001_website_builder.sql`, applied by `npm run migrate`.
  RLS on every tenant table (sites, site_domains, listings, leads, reservations), keyed on `app.org_id`
  and enforced through the `dealline_app` role. Tested: a second org gets nothing back.
- **Site**: slug at `{slug}.SITES_ROOT_DOMAIN`, template, theme (colours + open Arabic fonts), logo,
  SEO, contact numbers. Publishing requires the org's FAL license.
- **Custom domains**: TXT record `_dealline-verify.<domain>` + CNAME; served only after verification.
- **Listings**: CRUD, filters, status flow draft → published → reserved/sold/archived.
  **Cannot be published without a valid REGA ad license** (DB constraint plus an expiry check);
  public pages stop showing a listing as soon as its license expires.
- **Leads**: site form → CRM; Saudi phone numbers normalised to +9665…; honeypot plus rate limit.
- **Booking deposit (عربون)**: off by default, owner switches it on. Moyasar payment form config →
  webhook (secret_token, compared in constant time) → payment re-read from Moyasar's API (status,
  amount, currency, reservation_id) → reservation paid, unit reserved, lead qualified. Idempotent
  (`webhook_events`). Only one paid reservation per unit (unique index); a late duplicate
  becomes `refund_due`.
- **Seed**: `npm run seed` (fake data only).

## Not done / to verify
- [x] **Frontend**: merged with the Deal Line frontend in `../web` (dashboard for every module + public site at `#/site/<slug>`). The three `template` values are stored but render with one layout.
- [ ] **Image uploads**: signed upload to R2 or Supabase Storage (size and type limits, separate domain).
      Listings currently take https URLs.
- [ ] **Team invites** by email.
- [ ] **Booking.com**: requires joining their connectivity partner program. Do not build without approval.
- [ ] **Real estate registry (السجل العقاري)**: no public API confirmed. Check with REGA / the registry.
- [ ] **Legal**: can a broker take a deposit through their own site? Check against the brokerage
      regulation and your Moyasar agreement before switching deposits on.
- [ ] **Rate limits** are in memory, per instance. Move to Redis/Upstash once you run more than one instance.
- [ ] **TLS for custom domains**: the host (Vercel, Cloudflare for SaaS) issues certificates. Not configured here.
- [ ] **Backups**: turn on the host's daily backups and check they are on.
- [x] Migrations 001–004 applied on PostgreSQL 16 (local server), re-run is a no-op; RLS checked with a second org over HTTP. Managed hosts (Supabase, Neon) not tried.

## Off-plan sales (البيع على الخارطة) — migration 002, src/offplan.ts
What Nuzul's off-plan gateway does, rebuilt: the whole journey in one pipeline, units shown on the site,
the payment schedule per customer, and default / cancel / transfer handled within the rules.

- **Projects**: Wafi license number, escrow account (validated Saudi IBAN), REGA ad license,
  progress %, expected handover. A project **cannot be put on sale** without all three (DB constraint + API).
- **Progress reports**: consultant report reference + date; progress never goes down. Progress-linked
  installments of contracted deals fall due on the report date; the handover installment falls due at 100%.
- **Units**: single or bulk (A-101 … A-120), statuses available → held → reserved → sold → handed_over, or blocked.
  The price is locked into the deal when the unit is held.
- **Payment plans**: steps in basis points that must add up to exactly 100%. Triggers: on booking, on contract,
  N days after contract, at progress %, on handover. Amounts split exactly to the halala.
- **Deal journey**: hold (expires after the project's hold_days) → reserved (booking installment paid) →
  contracted (contract ref + date; due dates set) → handed over (project 100% + nothing outstanding).
  **One open deal per unit** (unique index): the double-sale guard.
- **Escrow receipts**: buyer money goes to the project's escrow account, never through Deal Line. Each bank
  transfer is recorded (amount, date, bank ref) against an installment; partial payments allowed, overpayment
  and a reused bank ref rejected. Admin/owner only.
- **Exceptions** (owner/admin, reason required, all logged in deal_events):
  - default (تعثر): only with an overdue installment; the unit is blocked; resolve by reinstate or cancel
  - cancel: unit back on sale, unpaid installments cancelled, the amount already in escrow reported for refund
  - transfer (تنازل): a new contracted deal carries only the unpaid balance; payments stay on the old deal as history
- **Dashboard**: units by status, sold value, collected, collection %, due, overdue, defaulted deals.
- **Public site**: projects page and project page (units with available yes/no, payment plans, Wafi and ad
  license numbers). No buyer data and no IBAN. The interest form creates a lead linked to the project or unit.
- **Daily job**: `npm run jobs` (schedule once a day): expires holds, marks installments due and overdue.
- **Roles**: members create holds and move their own deals forward; admins/owners manage projects and plans,
  record escrow receipts, and handle exceptions.

### Off-plan: not done / to verify
- [ ] **Live sync with REGA/Wafi** units: no public API confirmed; units are entered in Deal Line for now.
- [ ] **Exception rules**: notice periods, penalties, refund timelines for default/cancel/transfer come from the
      Wafi rules and the signed contract. The system records and enforces the order of steps, not those legal terms.
      Check with a Wafi-licensed advisor.
- [ ] **Bank statement import** (auto-matching receipts) and integration with the escrow bank.
- [ ] **Contract document** generation from the approved Wafi template.
- [ ] **Buyer reminders** before due dates (SMS/WhatsApp/email).
- [ ] Off-plan units have no card deposit on purpose (money goes to escrow). The website-builder deposit stays for ready listings only.

## Automation — migration 003, src/automation.ts
"When X happens, do Y", set once, pausable any time.
- **Events (outbox)**: written in the same transaction as the change, so an event exists only if the change
  committed. Triggers: lead.created, listing.published, reservation.paid, deal.held, deal.contracted,
  installment.due_soon (7/3/1 days, from the daily job), installment.overdue (daily job), whatsapp.received.
- **Rules**: trigger + conditions (exact match on any payload field, e.g. `lead.source_channel = snapchat`,
  `days = 3`) + up to 10 actions:
  - create_task (for the record's assignee, the owner, or a named employee, with a due time)
  - whatsapp_template (approved Meta template, params like `{{lead.name}}`, `{{installment.amount_sar}}`)
  - email (to the customer or to owners/admins; HTML-escaped)
- Each rule runs **once per event** (unique rule+event); every run is logged (done / failed / skipped).
- **Worker**: runs every 5s inside the API process (safe with several instances: SKIP LOCKED + unique runs).
- **Tasks**: from rules or by hand; members see their own; status open/done/cancelled.
- **Lead sources**: source_channel (snapchat, tiktok, google, x, whatsapp, or custom) + UTM fields on
  site forms, project interest, the API and WhatsApp.

## Integrations — src/integrations.ts (no Booking.com, no Airbnb, by decision)
- **WhatsApp Business (Cloud API)**: each org connects its number (owner only; token AES-256-GCM encrypted).
  Webhook: GET handshake with the verify token, POST verified with HMAC-SHA256 of the raw body (app secret).
  An inbound message from an unknown number creates a lead (source whatsapp); every message joins the
  lead's thread; Meta retries are deduplicated; delivery statuses only move forward. Replies: free text only
  within 24h of the customer's last message, templates otherwise (Meta's rule, enforced).
- **Outbound webhooks** (Zapier, Make, n8n, your systems): pick events, get a signing secret once.
  Header `X-DealLine-Signature: t=<unix>,v1=hex(HMAC-SHA256(secret, "<t>.<body>"))`. Retries after
  1m, 5m, 30m, 2h, 12h, then dead. Internal/private addresses refused (SSRF), redirects not followed.
- **Public API `/v1`**: per-org keys with scopes (listings:read/write, leads:read/write, projects:read),
  stored as sha256 only, shown once, revocable, 120 requests/min per key, RLS per org.
  Listings created through the API start as drafts (publishing keeps the ad-license check in the dashboard).

### Automation & integrations: not done / to verify
- [ ] **REGA, Ejar, Nafath**: no public APIs confirmed. Each needs an agreement (licensed platform / partner /
      approved provider). Not built; no fake adapters.
- [ ] **WhatsApp**: Deal Line needs a Meta app (Tech Provider + Embedded Signup for onboarding orgs' numbers),
      business verification and approved templates per org. Graph API version is configurable; check the current one.
- [ ] **WhatsApp bot** and a **custom forms builder**: not built.
- [ ] **Solutions not covered**: rentals management (leases, rent collection), ZATCA e-invoicing, tourism (out of scope).
- [ ] SSRF check resolves DNS before sending; a DNS-rebinding attacker could still race it. For stronger isolation,
      send webhooks through an egress proxy that blocks private ranges.
- [ ] Rate limits and the 5s worker run in-process; for heavy load move to a queue (e.g. pg-boss) and Redis.

## Merge changes (with the Deal Line frontend)
- `GET /api/members`: team list for assignment pickers; emails only for owners/admins. Tested.
- Bug fix: `x` is a documented lead source but the API and the DB check required 2+ characters. Fixed in the API and in migration `004` (003 left untouched). Tested.
- `scripts/demo-seed.ts`: demo org through the HTTP API (used by `dev:pglite`, `seed:demo` and the in-browser build). Tested.
- `npm run dev:pglite`: the API on PGlite, no Postgres needed. `npm run seed:demo`: same demo data into Postgres.

## Accounts the user creates (Claude never does)
Postgres host · Resend (verified sending domain) · Meta app for WhatsApp (app secret, verify token) · Moyasar (test keys first, webhook to
`https://<api>/webhooks/moyasar` for `payment_paid` and `payment_failed`) · the DNS for SITES_ROOT_DOMAIN.

## Security checklist
- [x] secrets only in env vars, `.env*` in `.gitignore`, nothing in client bundles (`.env.example` has names only)
- [x] input validated on the server (zod) on every route
- [x] authorisation on every read and write: RLS + `can()`, tested with a second org and a member
- [x] rate limits on signup, login, password reset, resend-verification, lead and reservation forms
- [x] webhooks verified (Moyasar secret_token, constant-time) + server-side re-fetch of the payment
- [ ] uploads: size/type limits, separate domain (uploads not built yet)
- [x] no user data in URLs or logs (email tokens in the URL fragment, logs carry error messages only)
- [x] dependencies audited (`npm audit`: 0 vulnerabilities)
- [ ] privacy policy lists every processor (Moyasar, Resend, host): write before launch (PDPL)
