# HESBA IN — DOMAIN MODEL REGISTRY
Version: 1.0

Purpose: Define the approved conceptual domain model for Hesba In based on the current Master Context, Decision Registry, Business Rules, Open Decisions, Compliance Matrix, and ADR Registry.

## Status Rule
- CONFIRMED: Stable enough to design/build against.
- CONDITIONAL: Exists only when transaction/regulatory conditions apply.
- PROPOSED: Architecture candidate pending an open decision.
- PROJECTION: Read model, not source of truth.
- REGULATORY-GATE: Do not finalize behavior until the relevant gate is resolved.

---

# 1. BOUNDED CONTEXTS

## Core
1. Deal Orchestration
2. Financing

## Supporting
3. Sales & CRM
4. Real Estate Catalog
5. Inventory Management
6. Organization & Billing
7. Financial Ledger
8. Document Management

## Compliance-Critical Supporting
9. Regulatory Compliance
10. Escrow / Trust Tracking

## Generic / Platform
11. Identity & Access
12. Communication
13. Notifications / Read Models
14. AI Services
15. Integration Layer

---

# 2. PRIMARY AGGREGATE ROOTS

## DM-001 — User
Status: CONFIRMED
Purpose: Base identity/account actor.

Related roles:
- Buyer
- Developer Sales Agent
- Finance Employee
- Platform Admin
- Super Admin

Rule:
Role does not bypass tenant, relationship, purpose, or compliance controls.

---

## DM-002 — Organization
Status: CONFIRMED — MVP TENANT BOUNDARY
Purpose: Represents participating legal/operating organizations.

Capabilities may include:
- developer
- finance_provider
- platform

Owns/references:
- Users/Memberships
- Licenses
- Subscription
- Configuration
- Branch/Business Unit future structure

Rule:
Organization is the MVP tenant boundary, but Organization == Tenant must not be permanently hard-coded.

---

## DM-003 — Project
Status: CONFIRMED
Purpose: Represents a real-estate project.

Contains/references:
- Property/project metadata
- Developer Organization
- Project Type: Ready / Off-plan / Future
- Licenses
- Escrow reference where applicable

Rule:
Project does not own Unit as one large aggregate.

---

## DM-004 — Unit
Status: CONFIRMED — CRITICAL AGGREGATE
Purpose: Authoritative inventory and availability object.

Owns internally:
- Reservation state/history required to enforce availability integrity

Core invariant:
One Unit → Maximum One ACTIVE Reservation.

Rule:
Reservation changes must be concurrency-safe and atomic.

---

## DM-005 — Lead
Status: CONFIRMED
Purpose: Buyer interest before a Deal exists.

References:
- Buyer
- Project and/or Unit interest
- Developer Organization
- Assigned Sales Agent
- Conversation

Lifecycle example:
New → Assigned → Contacted → Qualified → Converted
or Lost / Cold.

Rule:
Buyer ↔ Developer Agent communication may exist at Lead stage.

---

## DM-006 — Deal
Status: CONFIRMED — CORE COORDINATION ROOT
Purpose: Central business-process coordination reference after lead conversion/reservation trigger.

References:
- Buyer
- Unit
- Developer Organization
- Reservation context
- Financing Applications
- Contract/Documents
- Conversations
- SLA/Timeline
- Support/Dispute references

Rule:
Deal is the approved coordination reference for Unit in financing/downstream workflows.
FinancingApplication must not independently redefine Unit identity.

---

## DM-007 — FinancingApplication
Status: CONFIRMED, WITH REGULATORY-GATED BEHAVIOR
Purpose: Represents financing engagement for one Deal with one finance provider.

References:
- Deal
- Buyer
- Finance Organization
- Assigned Finance Employee where applicable
- Decision snapshot
- Offers
- Valuation/KYC references where applicable

Must preserve:
- InputsSnapshot
- RuleSetVersion
- CalculatedAt
- OutputSnapshot
- Source
- Expiry

Rule:
Eligibility is indicative unless confirmed by an authorized financing entity.

---

## DM-008 — FinancingOffer
Status: CONFIRMED
Purpose: Represents one financing offer from one finance provider.

Belongs to:
- FinancingApplication

Possible states:
Draft
Issued
Expired
Withdrawn
Declined
Selected
NotSelected

Invariant:
A Deal has only one currently selected FinancingOffer unless an explicit replacement transition occurs.

Required event:
FinancingOfferSelected.

---

## DM-009 — Transaction
Status: CONFIRMED — FINANCIAL SOURCE OF TRUTH
Purpose: Append-oriented financial event/ledger record.

Possible types:
- fee_accrual
- payment
- refund
- bonus_accrual
- bonus_release
- bonus_reversal
- payout
- adjustment

Rules:
- Idempotent
- Auditable
- Traceable
- Corrections through explicit compensating/reversal entries
- No silent mutation of financial history

---

## DM-010 — ConsentRecord
Status: CONFIRMED
Purpose: Auditable record of data-sharing/processing authorization where applicable.

Fields:
- Subject/User
- Purpose
- DataScope
- Recipient
- LegalBasis where applicable
- GrantedAt
- RevokedAt
- PrivacyNoticeVersion

Rule:
Consent is not only a UI checkbox.

---

## DM-011 — AuditLog
Status: CONFIRMED
Purpose: Immutable/append-oriented audit evidence.

Covers:
- Permission changes
- Consent
- Reservation
- Financing status
- Offer selection
- Financial actions
- Document access
- Manual overrides
- Admin intervention

---

## DM-012 — ChatThread
Status: CONFIRMED
Purpose: Authorized in-platform communication.

May reference:
- Lead
- Deal

Rule:
Lead → Deal conversion must preserve authorized conversation history.

Exact Buyer ↔ Finance Employee chat trigger remains OPEN.

---

## DM-013 — SupportTicket / Dispute
Status: CONFIRMED
Purpose: Formal support, complaint, escalation, or dispute record.

References:
- Deal where applicable
- Involved parties
- Decision/outcome
- Audit trail

---

## DM-014 — Subscription
Status: CONFIRMED — BUSINESS MODEL CANDIDATE
Purpose: Commercial SaaS relationship between an Organization and Hesba In.

References:
- Organization
- Plan
- Billing cycle
- Status

---

## DM-015 — Invoice
Status: CONDITIONAL
Purpose: Billing record for chargeable platform services.

Possible related records:
- CreditNote
- DebitNote
- Payment reference

Rule:
Actual tax/e-invoicing behavior must follow applicable ZATCA requirements.

---

# 3. CONDITIONAL / COMPLIANCE ENTITIES

## DM-016 — License
Status: CONDITIONAL / CONFIRMED CONCEPT
Purpose: Represent licenses/certifications required for organization, project, or actor.

Possible scopes:
- Organization
- Project
- Sales/marketing actor

Fields:
Type, Issuer, Number, ValidFrom, ValidTo, Status.

---

## DM-017 — EscrowReference
Status: CONDITIONAL
Purpose: Track external regulated escrow state where applicable.

Possible fields:
- EscrowReference
- EscrowStatus
- EscrowPaymentReference
- EscrowMilestone

Rule:
Hesba In is not assumed to own or custody escrow funds.

---

## DM-018 — KYC/AMLCheck
Status: CONDITIONAL / REGULATORY-GATE
Purpose: Represent identity/due-diligence/compliance checks where applicable.

Rule:
Exact ownership/execution depends on the approved regulatory operating model and provider access.

---

## DM-019 — Valuation
Status: CONDITIONAL
Purpose: Property valuation associated with financing review.

References:
- FinancingApplication
- Unit context through Deal
- Valuation provider
- Value
- Date/Expiry

---

## DM-020 — DataSubjectRequest
Status: CONFIRMED CONCEPT
Purpose: Track privacy/data-subject rights requests.

Examples:
Access
Correction
Deletion/Restriction where legally applicable.

---

# 4. READ MODELS / PROJECTIONS

These are NOT independent sources of truth.

## DM-P01 — Wallet / Bonus Balance
Status: PROJECTION
Source: Transaction Ledger

Views may include:
Pending
Available
Paid
Reversed

---

## DM-P02 — EligibilitySummary
Status: PROJECTION
Source: Financing domain

Purpose:
Expose only approved minimal financing status to developer-side users.

Rule:
Do not expose raw detailed financing records by default.

---

## DM-P03 — Notification
Status: PROJECTION
Source: Domain/integration events

Rule:
Notifications should not become a second source of business truth.

---

## DM-P04 — Deal Timeline
Status: PROJECTION
Source: Deal + workflow + audit events

---

## DM-P05 — SLA Dashboard
Status: PROJECTION
Source:
Owner, StartedAt, ExpectedBy, CompletedAt, escalation/status events.

---

# 5. INTEGRATION PORTS

Not core domain entities; external boundaries.

## IdentityVerificationProvider
Examples:
- Nafath
- Future approved provider

## PropertyInventoryProvider
Examples:
- Hesba Native
- Developer API
- NHC / TechHub
- Batch Import

## CreditDataProvider
Examples:
- SIMAH / approved channel
- Future approved provider

## FinancingProviderAdapter
Examples:
- Bank API
- Finance Company API
- Manual employee workflow
- Hybrid integration

Rule:
External providers must not be hard-coded into core domain logic.

---

# 6. KEY RELATIONSHIPS

Organization 1 → N Projects
Project 1 → N Units (reference relationship; Unit remains independent aggregate)

Buyer 1 → N Leads
Lead → 0..1 Deal after conversion

Unit 1 → 0..1 ACTIVE Reservation at a time

Deal 1 → 1 Unit reference
Deal 1 → N FinancingApplications
FinancingApplication 1 → N FinancingOffers
Deal 1 → 0..1 currently Selected FinancingOffer

Deal/Lead → ChatThread
Deal → Documents / SupportTickets / SLA Timeline

Organization 1 → Subscription
Subscription/chargeable service → Invoices

Transaction Ledger → Wallet/Bonus Projection

Financing domain → EligibilitySummary Projection

---

# 7. DOMAIN OWNERSHIP RULES

Inventory owns:
- Unit availability
- Reservation integrity

Sales & CRM owns:
- Lead lifecycle

Deal Orchestration owns:
- Cross-domain process coordination
- Deal lifecycle
- Process Manager/Saga state

Financing owns:
- FinancingApplication
- FinancingOffer
- Financing decision snapshots

Financial Ledger owns:
- Transaction truth

Compliance owns:
- Consent
- Audit
- DataSubjectRequest
- applicable compliance checks

Communication owns:
- ChatThread
- communication delivery/history

Billing owns:
- Subscription
- Invoice

No context may silently mutate another context's source-of-truth entity.

---

# 8. OPEN DOMAIN ITEMS

DM-OPEN-001 — Reservation payment model
Depends on: OD-004

DM-OPEN-002 — Reservation expiry policy
Depends on: OD-005

DM-OPEN-003 — Buyer ↔ Finance Employee chat activation
Depends on: OD-003

DM-OPEN-004 — Finance-provider routing model
Depends on: OD-007

DM-OPEN-005 — Offer-ranking model
Depends on: OD-008

DM-OPEN-006 — Final finance integration behavior
Depends on: OD-006

DM-OPEN-007 — Final SAMA operating boundary
Depends on: OD-001
Blocking regulatory behavior for FinancingApplication/routing/recommendation.

DM-OPEN-008 — Bank employee incentive payout model
Depends on: OD-002

---

# 9. FORBIDDEN MODELING SHORTCUTS

Do NOT:
- Model Reservation as an independent competing authority over Unit availability.
- Store an independently mutable Wallet balance.
- Give FinancingApplication a separate Unit truth.
- Treat Eligibility as Approval.
- Expose raw buyer financing data to developer users by default.
- Hard-code Nafath, SIMAH, NHC, or a bank directly into core domain rules.
- Assume Organization == Tenant forever.
- Assume Hesba In owns escrow funds.
- Resolve REGULATORY-GATE items through technical design alone.
- Delete historical financial/audit events to "correct" state.

---

# 10. DOMAIN MODEL GOVERNANCE

When changing the domain model:
1. Check Decision Registry.
2. Check Business Rules/Invariants.
3. Check ADR Registry.
4. Check Compliance Matrix and Open Decisions.
5. Identify affected aggregate/bounded context.
6. Record the change as DEC/ADR where material.
7. Mark replaced design DEPRECATED/SUPERSEDED.
8. Update API, database, workflows, permissions, and QA.

This registry is conceptual.
It does not authorize production implementation of any REGULATORY-GATE behavior.
