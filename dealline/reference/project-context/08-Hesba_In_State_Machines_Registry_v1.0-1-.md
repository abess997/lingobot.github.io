# HESBA IN — STATE MACHINES REGISTRY
Version: 1.0

Purpose: Define approved lifecycle states and legal transitions for core Hesba In domain objects.
This registry must remain consistent with the Master Context, Decision Registry, Business Rules, ADR Registry, Domain Model, Open Decisions, and Compliance Matrix.

## State Machine Status
- CONFIRMED: Approved lifecycle.
- CONDITIONAL: Applies only when a transaction/regulatory condition exists.
- PROPOSED: Useful candidate, but still depends on an open decision.
- REGULATORY-GATE: Do not finalize production behavior until the relevant gate is resolved.

## Global Transition Rules
1. Every critical transition must record Actor, Timestamp, PreviousState, NewState, and Reason/Source where applicable.
2. Critical commands must be idempotent.
3. Illegal transitions must be rejected server-side.
4. Manual overrides must be explicit and audited.
5. REGULATORY-GATE items must not be silently converted into confirmed production transitions.
6. Historical financial/audit states must not be silently rewritten.

---

# SM-001 — Lead

Status: CONFIRMED
Owner: Sales & CRM

States:
NEW
ASSIGNED
CONTACTED
QUALIFIED
CONVERTED
COLD
LOST

Primary flow:
NEW
→ ASSIGNED
→ CONTACTED
→ QUALIFIED
→ CONVERTED

Alternative terminal/paused outcomes:
NEW / ASSIGNED / CONTACTED / QUALIFIED
→ COLD
or
→ LOST

Allowed recovery:
COLD → ASSIGNED or CONTACTED

Terminal:
CONVERTED
LOST

Key rule:
CONVERTED creates/links the Deal context while preserving authorized conversation history.

Forbidden:
CONVERTED → NEW
LOST → CONVERTED without explicit reopen/reactivation workflow.

---

# SM-002 — Unit Availability

Status: CONFIRMED
Owner: Inventory Management

States:
AVAILABLE
HELD
RESERVED
UNAVAILABLE
SOLD
ARCHIVED

Core invariant:
A Unit may have at most one ACTIVE reservation/hold at a time.

Typical transitions:
AVAILABLE → HELD
HELD → AVAILABLE
HELD → RESERVED
RESERVED → AVAILABLE
RESERVED → SOLD
AVAILABLE → UNAVAILABLE
UNAVAILABLE → AVAILABLE
SOLD → ARCHIVED

Conditional:
HELD may be omitted if final reservation policy does not use temporary hold.

Forbidden:
AVAILABLE → multiple concurrent HELD/RESERVED states.
SOLD → AVAILABLE without an explicit reversal/cancellation authority and audit trail.

Dependencies:
OD-004, OD-005

---

# SM-003 — Reservation

Status: PROPOSED / PARTIALLY CONFIRMED
Owner: Inventory Management

States:
CREATED
ACTIVE
EXPIRED
RELEASED
CANCELLED
CONFIRMED
COMPLETED

Typical flow:
CREATED → ACTIVE
ACTIVE → CONFIRMED
CONFIRMED → COMPLETED

Alternative:
ACTIVE → EXPIRED
ACTIVE → RELEASED
ACTIVE → CANCELLED
CONFIRMED → CANCELLED only through an approved cancellation workflow

Rule:
ACTIVE reservation must be the only active reservation for its Unit.

Open behavior:
- Whether payment is required.
- Hold duration.
- Extension policy.

Dependencies:
OD-004, OD-005

---

# SM-004 — Deal

Status: CONFIRMED CORE / DETAILED PHASES PROPOSED
Owner: Deal Orchestration

States:
CREATED
RESERVATION_CONFIRMED
FINANCING_IN_PROGRESS
OFFERS_AVAILABLE
OFFER_SELECTED
CONTRACTING
COMPLETION_IN_PROGRESS
COMPLETED
CANCELLED
FAILED
DISPUTED

Primary flow:
CREATED
→ RESERVATION_CONFIRMED
→ FINANCING_IN_PROGRESS
→ OFFERS_AVAILABLE
→ OFFER_SELECTED
→ CONTRACTING
→ COMPLETION_IN_PROGRESS
→ COMPLETED

Alternative transitions:
Any non-terminal active state → CANCELLED
Eligible failure condition → FAILED
Eligible dispute condition → DISPUTED
DISPUTED → prior valid operational state or CANCELLED/COMPLETED only through explicit resolution

Rules:
- Deal coordinates, but does not own all domain data.
- Unit truth remains in Inventory.
- Financing truth remains in Financing.
- Financial truth remains in Transaction Ledger.

Forbidden:
COMPLETED → active state without explicit reversal/new deal workflow.
CANCELLED → active state without explicit reopen/new deal workflow.

---

# SM-005 — Financing Application

Status: CONFIRMED CONCEPT / REGULATORY-GATED BEHAVIOR
Owner: Financing

States:
DRAFT
SUBMITTED
RECEIVED
UNDER_REVIEW
NEED_DOCUMENTS
DOCUMENTS_RECEIVED
PREQUALIFIED
APPROVED
DECLINED
WITHDRAWN
EXPIRED
CLOSED

Typical flow:
DRAFT
→ SUBMITTED
→ RECEIVED
→ UNDER_REVIEW

Review branches:
UNDER_REVIEW → NEED_DOCUMENTS
NEED_DOCUMENTS → DOCUMENTS_RECEIVED
DOCUMENTS_RECEIVED → UNDER_REVIEW

Decision outcomes:
UNDER_REVIEW → PREQUALIFIED
UNDER_REVIEW → APPROVED
UNDER_REVIEW → DECLINED

Other:
DRAFT / SUBMITTED / UNDER_REVIEW → WITHDRAWN
PREQUALIFIED / APPROVED → EXPIRED where validity applies
DECLINED / WITHDRAWN / EXPIRED → CLOSED

Rules:
- PREQUALIFIED is not final financing approval.
- Decision snapshot/version must be preserved.
- Exact routing and intermediation behavior remains subject to SAMA gate.

Dependency:
OD-001

---

# SM-006 — Financing Offer

Status: CONFIRMED
Owner: Financing

States:
DRAFT
ISSUED
SELECTED
NOT_SELECTED
EXPIRED
WITHDRAWN
DECLINED
REPLACED

Flow:
DRAFT → ISSUED

From ISSUED:
→ SELECTED
→ NOT_SELECTED
→ EXPIRED
→ WITHDRAWN
→ DECLINED

Replacement:
SELECTED → REPLACED only through an explicit replacement workflow
Then another ISSUED offer may become SELECTED.

Invariant:
One Deal may have at most one currently SELECTED offer.

Required event:
FinancingOfferSelected

Forbidden:
DRAFT → SELECTED
EXPIRED → SELECTED without re-issuance/new valid offer
Multiple simultaneous SELECTED offers for one Deal

---

# SM-007 — Consent Record

Status: CONFIRMED
Owner: Regulatory Compliance / Privacy

States:
GRANTED
ACTIVE
REVOKED
EXPIRED

Flow:
GRANTED → ACTIVE
ACTIVE → REVOKED
ACTIVE → EXPIRED

Rules:
- Revocation must be auditable.
- Future sharing governed by revoked consent must stop where withdrawal applies.
- Lawful retention obligations may survive revocation.

Forbidden:
REVOKED → ACTIVE without a new grant/consent event.
Silent mutation of historical consent timestamps or scope.

---

# SM-008 — KYC / AML Check

Status: CONDITIONAL / REGULATORY-GATE
Owner: Compliance / Finance Provider as applicable

States:
INITIATED
IN_PROGRESS
CLEARED
FLAGGED
MANUAL_REVIEW
REJECTED
EXPIRED

Typical transitions:
INITIATED → IN_PROGRESS
IN_PROGRESS → CLEARED
IN_PROGRESS → FLAGGED
FLAGGED → MANUAL_REVIEW
MANUAL_REVIEW → CLEARED
MANUAL_REVIEW → REJECTED
CLEARED → EXPIRED where validity period applies

Rule:
Exact ownership/execution and blocking effect depend on the approved regulatory operating model.

---

# SM-009 — Valuation

Status: CONDITIONAL
Owner: Financing

States:
REQUESTED
SCHEDULED
IN_PROGRESS
COMPLETED
REJECTED
EXPIRED
CANCELLED

Typical flow:
REQUESTED → SCHEDULED → IN_PROGRESS → COMPLETED

Alternative:
REQUESTED / SCHEDULED / IN_PROGRESS → CANCELLED
IN_PROGRESS → REJECTED
COMPLETED → EXPIRED after validity period

---

# SM-010 — Subscription

Status: CONFIRMED CONCEPT
Owner: Organization & Billing

States:
TRIAL
ACTIVE
PAST_DUE
SUSPENDED
CANCELLED
EXPIRED

Typical transitions:
TRIAL → ACTIVE
TRIAL → EXPIRED
ACTIVE → PAST_DUE
PAST_DUE → ACTIVE
PAST_DUE → SUSPENDED
SUSPENDED → ACTIVE
ACTIVE / SUSPENDED → CANCELLED
ACTIVE → EXPIRED where fixed term applies

Rule:
Commercial suspension must not silently destroy historical access/audit records.

---

# SM-011 — Invoice

Status: CONDITIONAL
Owner: Billing

States:
DRAFT
ISSUED
DUE
PAID
OVERDUE
VOIDED
CREDITED
PARTIALLY_PAID

Typical transitions:
DRAFT → ISSUED
ISSUED → DUE
DUE → PAID
DUE → PARTIALLY_PAID
PARTIALLY_PAID → PAID
DUE / PARTIALLY_PAID → OVERDUE

Correction:
ISSUED/DUE/PAID → CREDITED through an approved credit-note workflow where applicable.

Rule:
Do not silently edit an issued financial record to correct history.

Tax/e-invoicing behavior:
Subject to applicable ZATCA configuration.

---

# SM-012 — Support Ticket / Dispute

Status: CONFIRMED
Owner: Regulatory Compliance / Support

States:
OPEN
ACKNOWLEDGED
UNDER_REVIEW
WAITING_ON_CUSTOMER
WAITING_ON_PARTNER
ESCALATED
RESOLVED
CLOSED
REOPENED

Typical flow:
OPEN → ACKNOWLEDGED → UNDER_REVIEW

Branches:
UNDER_REVIEW → WAITING_ON_CUSTOMER
UNDER_REVIEW → WAITING_ON_PARTNER
UNDER_REVIEW → ESCALATED
WAITING_* → UNDER_REVIEW
UNDER_REVIEW / ESCALATED → RESOLVED
RESOLVED → CLOSED
CLOSED → REOPENED only through explicit authorized action
REOPENED → UNDER_REVIEW

Rule:
Any resolution affecting Deal or financial state must generate audit evidence and explicit downstream transition.

---

# SM-013 — License / Certification

Status: CONDITIONAL
Owner: Organization & Compliance

States:
PENDING_VERIFICATION
VALID
RENEWAL_PENDING
EXPIRED
REVOKED
REJECTED

Flow:
PENDING_VERIFICATION → VALID
PENDING_VERIFICATION → REJECTED
VALID → RENEWAL_PENDING
RENEWAL_PENDING → VALID
VALID / RENEWAL_PENDING → EXPIRED
VALID → REVOKED

Rule:
Activity blocking on expiry/revocation depends on license type and applicable rule.

---

# SM-014 — Escrow Reference

Status: CONDITIONAL
Owner: Escrow / Trust Tracking

States:
NOT_REQUIRED
PENDING_REFERENCE
ACTIVE
PAYMENT_PENDING
PAYMENT_RECORDED
MILESTONE_PENDING
MILESTONE_CONFIRMED
CLOSED
SUSPENDED

Rule:
This machine tracks external regulated escrow state.
It does not imply Hesba In custody or ownership of funds.

Exact transition model must follow applicable off-plan/project structure.

---

# SM-015 — Chat Thread

Status: CONFIRMED CONCEPT
Owner: Communication

States:
OPEN
RESTRICTED
CLOSED
ARCHIVED

Typical transitions:
OPEN → RESTRICTED
RESTRICTED → OPEN
OPEN / RESTRICTED → CLOSED
CLOSED → ARCHIVED

Rule:
Lead → Deal conversion must preserve authorized conversation history.
Exact Buyer ↔ Finance Employee activation trigger remains OPEN.

Dependency:
OD-003

---

# SM-016 — Document

Status: PROPOSED
Owner: Document Management

States:
UPLOADED
PENDING_REVIEW
ACCEPTED
REJECTED
REPLACED
EXPIRED
ARCHIVED

Flow:
UPLOADED → PENDING_REVIEW
PENDING_REVIEW → ACCEPTED
PENDING_REVIEW → REJECTED
REJECTED → REPLACED through new version/upload
ACCEPTED → EXPIRED where validity applies
Any terminal historical version → ARCHIVED according to retention policy

Rule:
Replacement must preserve historical audit/version lineage.

---

# SM-017 — Financial Transaction

Status: CONFIRMED PRINCIPLE
Owner: Financial Ledger

Important:
Transaction is primarily an append-only record, not a freely mutable lifecycle entity.

Processing states:
PENDING
POSTED
FAILED
REVERSED

Typical transitions:
PENDING → POSTED
PENDING → FAILED
POSTED → REVERSED only via explicit compensating/reversal transaction relationship

Rule:
Do not mutate POSTED into FAILED or delete it to correct history.
Idempotency key/correlation must prevent duplicate economic effect.

---

# SM-018 — Data Subject Request

Status: CONFIRMED CONCEPT
Owner: Privacy / Compliance

States:
SUBMITTED
IDENTITY_VERIFICATION
IN_REVIEW
IN_PROGRESS
COMPLETED
PARTIALLY_COMPLETED
REJECTED_WITH_REASON
CLOSED

Typical flow:
SUBMITTED → IDENTITY_VERIFICATION → IN_REVIEW → IN_PROGRESS
IN_PROGRESS → COMPLETED
IN_PROGRESS → PARTIALLY_COMPLETED
IN_REVIEW / IN_PROGRESS → REJECTED_WITH_REASON
COMPLETED / PARTIALLY_COMPLETED / REJECTED_WITH_REASON → CLOSED

Rule:
Retention/legal exceptions must be documented rather than silently ignoring the request.

---

# CROSS-MACHINE ORCHESTRATION RULES

## O-001 — Lead Conversion
Lead.CONVERTED
→ create/link Deal
→ preserve ChatThread history
→ audit conversion

## O-002 — Reservation Confirmation
Reservation.CONFIRMED
→ Unit state updates consistently
→ Deal may move to RESERVATION_CONFIRMED
→ trigger financing journey when permitted

## O-003 — Financing Offer Selection
FinancingOffer.SELECTED
→ ensure no other current SELECTED offer
→ Deal → OFFER_SELECTED
→ audit selection
→ notify relevant parties

## O-004 — Deal Completion
Deal.COMPLETED
→ completion events
→ financial/incentive evaluation only if approved
→ wallet projection updates from Transaction events
→ notifications/audit

## O-005 — Consent Revocation
Consent.REVOKED
→ stop future governed sharing/access where applicable
→ update authorizations/projections
→ audit event

## O-006 — Reservation Expiry
Reservation.EXPIRED
→ release Unit availability atomically
→ update Deal/process state if relevant
→ notify parties
→ audit event

---

# OPEN STATE-MACHINE ITEMS

SM-OPEN-001 — Reservation payment states
Depends on OD-004.

SM-OPEN-002 — Reservation hold duration/extension transitions
Depends on OD-005.

SM-OPEN-003 — Buyer ↔ Finance Employee chat activation
Depends on OD-003.

SM-OPEN-004 — Finance-provider routing states
Depends on OD-007.

SM-OPEN-005 — Offer ranking/sponsored placement workflow
Depends on OD-008.

SM-OPEN-006 — Final finance integration callback/reconciliation states
Depends on OD-006.

SM-OPEN-007 — Final regulatory blocking states for financing
Depends on OD-001.

SM-OPEN-008 — Employee incentive payout states
Depends on OD-002.

---

# FORBIDDEN GLOBAL TRANSITIONS

Do not allow:
- More than one active Unit reservation.
- More than one currently selected FinancingOffer per Deal.
- Eligibility/prequalification state to be treated as final approval.
- A revoked consent to become active without a new grant.
- A posted financial transaction to be silently edited/deleted.
- A completed/cancelled Deal to silently return to an active state.
- Cross-tenant transition/action without explicit privileged authority.
- Manual state override without audit evidence.
- A REGULATORY-GATE transition to be activated solely because the UI or prototype contains it.

---

# GOVERNANCE

When a state machine changes:
1. Identify the affected SM ID.
2. Check Decision Registry, Business Rules, ADR, Domain Model, Compliance Matrix, and Open Decisions.
3. Record material decisions before implementation.
4. Update APIs, DB constraints, permissions, automation, notifications, SLA logic, and QA tests.
5. Mark replaced transitions/states DEPRECATED rather than deleting historical rationale.
6. Never change a CONFIRMED invariant silently.
