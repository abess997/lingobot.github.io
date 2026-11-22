# HESBA IN — ARCHITECTURE DECISION RECORDS REGISTRY
Version: 1.0

Purpose: Record confirmed architecture decisions that constrain implementation.
This registry does not replace the Decision Registry; it translates approved decisions into architectural commitments.

## ADR Status
- ACCEPTED: Approved architecture decision.
- PROPOSED: Candidate architecture pending confirmation.
- DEPRECATED: Replaced by a newer ADR.
- SUPERSEDED: Explicitly replaced by another ADR.

---

## ADR-001 — Unit Owns Reservation Integrity
Status: ACCEPTED

Context:
Double booking is a critical commercial risk.

Decision:
Unit is the transactional authority for availability and reservation integrity.
A Unit may have at most one ACTIVE reservation.

Consequences:
- Reservation creation must be atomic/concurrency-safe.
- UI validation is insufficient.
- Database/domain constraints must enforce the invariant.
- Reservation expiry/release must update Unit availability consistently.

Related:
DEC-005, DEC-006
BR-001, BR-002

---

## ADR-002 — Deal Is the Coordination Reference for Unit
Status: ACCEPTED

Context:
Direct references to Unit from multiple domains create conflicting sources of truth.

Decision:
Deal is the approved coordination reference for the selected Unit across financing and downstream workflows.
FinancingApplication must not independently redefine Unit identity.

Consequences:
- Reduce circular/domain leakage.
- Unit ownership stays in Inventory.
- Financing consumes deal context rather than owning property inventory state.

---

## ADR-003 — Transaction Ledger Is the Financial Source of Truth
Status: ACCEPTED

Context:
Independent Wallet/Bonus balances can create duplicate or inconsistent financial truth.

Decision:
Transaction Ledger is authoritative.
Wallet/Bonus views are derived projections.

Consequences:
- No direct Wallet balance mutation.
- Corrections use reversal/adjustment/compensating entries.
- Financial operations must be traceable and idempotent.
- Projection can be rebuilt from ledger history.

Related:
DEC-020, DEC-021, DEC-022
BR-021 through BR-024

---

## ADR-004 — Critical Operations Are Idempotent
Status: ACCEPTED

Decision:
Critical commands/events must support idempotent processing.

Applies to:
- Reservation
- Financing application submission
- Offer selection
- Payments/fees
- Bonus/incentive events
- External integration callbacks

Consequences:
Retries or duplicate delivery must not create duplicate business effects.
Use stable idempotency/correlation identifiers where applicable.

---

## ADR-005 — Organization Is MVP Tenant Boundary
Status: ACCEPTED — MVP ONLY

Decision:
Organization is the primary tenant boundary for MVP.

Constraint:
Do not permanently encode Organization == Tenant.

Future-compatible hierarchy:
Tenant
→ Organization
→ Business Unit
→ Branch
→ Team / Project / SPV

Consequences:
All tenant-scoped data, files, chats, events, analytics and financial records must carry enforceable tenant isolation.

Related:
DEC-026 to DEC-028
BR-019, BR-020

---

## ADR-006 — Cross-Tenant Isolation Is Mandatory
Status: ACCEPTED

Decision:
No implicit cross-tenant access.

Authorization must consider:
- Tenant
- Role
- Relationship
- Purpose

Consequences:
Tenant filtering must be enforced server-side/data-side, not only in UI.
Cross-tenant admin access must be explicit, privileged and audited.

---

## ADR-007 — Deal Orchestration Uses Process Manager / Saga
Status: ACCEPTED

Context:
Major journeys span multiple domains and external services.

Decision:
Use explicit orchestration/process-manager patterns for multi-step, cross-domain workflows.

Examples:
Financing approved
→ Deal state update
→ Notification
→ Document requirements
→ Incentive evaluation
→ Audit event

Consequences:
- Domains do not secretly mutate each other.
- Compensation/recovery paths are explicit.
- State transitions are traceable.
- Partial failures can be reconciled.

Related:
DEC-042, DEC-043
BR-033, BR-034

---

## ADR-008 — Event-Driven Projections for Read Models
Status: ACCEPTED

Decision:
Derived read experiences should be built from authoritative events/state where appropriate.

Examples:
- Wallet balance
- Notifications
- Dashboard metrics
- SLA views
- Deal timeline

Consequences:
Read models are not independent sources of truth.
Projection rebuild/reconciliation must be possible.

---

## ADR-009 — Provider / Adapter Integration Architecture
Status: ACCEPTED

Decision:
External providers must be abstracted behind adapters/providers.

Required abstractions:
- IdentityVerificationProvider
- PropertyInventoryProvider
- CreditDataProvider
- FinancingProviderAdapter

Examples:
Nafath, NHC/TechHub, SIMAH, banks/finance companies.

Consequences:
- Core domain does not hard-code external vendors.
- Providers can be replaced or added.
- External failure/retry/reconciliation logic stays at integration boundaries.

Related:
DEC-031 to DEC-034
BR-035, BR-036

---

## ADR-010 — Hybrid Finance Integration Is the Preferred MVP Architecture
Status: PROPOSED

Context:
Finance providers may have different API maturity.

Decision candidate:
Support API, manual employee entry, rules-engine support, or mixed modes through FinancingProviderAdapter.

Reason:
Avoid blocking MVP on universal bank API readiness.

Constraint:
Final implementation remains dependent on OD-006 and regulatory/access conditions.

---

## ADR-011 — Financing Decisions Are Point-in-Time Reproducible
Status: ACCEPTED

Decision:
Financing calculator and eligibility outputs must preserve decision snapshots.

Store:
- InputsSnapshot
- RuleSetVersion
- CalculatedAt
- OutputSnapshot
- Source
- Expiry

Consequences:
Historical decisions remain explainable after bank/rule changes.
Do not retroactively rewrite prior decision results.

Related:
DEC-012
BR-012

---

## ADR-012 — Eligibility Summary Projection Protects Financing Data
Status: ACCEPTED

Decision:
Developer-side actors receive only an approved limited financing projection when needed.

Do not expose raw financing records by default.

Consequences:
- Financing domain remains private.
- Developer context consumes EligibilitySummary or equivalent.
- Projection fields must be explicitly approved.

Related:
DEC-025
BR-014, BR-015

---

## ADR-013 — Consent Is a First-Class Auditable Domain Record
Status: ACCEPTED

Decision:
Consent is not represented only by a UI checkbox.

It must preserve:
- Purpose
- Data Scope
- Recipient
- Legal basis where applicable
- GrantedAt
- RevokedAt
- Notice/version reference

Consequences:
Sharing/access workflows must consult applicable authorization/consent rules.
Withdrawal effects must be traceable.

---

## ADR-014 — Immutable Audit Trail for Sensitive Actions
Status: ACCEPTED

Decision:
Sensitive events generate append-oriented audit records.

Includes:
- Permission changes
- Consent
- Reservation
- Financing status
- Offer selection
- Financial events
- Document access
- Manual overrides
- Admin intervention

Manual override record:
Actor + Reason + BeforeState + AfterState + Timestamp.

---

## ADR-015 — Ready Property and Off-Plan Are Distinct Workflow Variants
Status: ACCEPTED

Decision:
Do not force one universal property transaction workflow.

Consequences:
Project/transaction type controls:
- Licensing checks
- Reservation/payment behavior
- Escrow-related capabilities
- Required documents
- Compliance gates

Related:
BR-026 to BR-028

---

## ADR-016 — Hesba In Does Not Assume Escrow Custody
Status: ACCEPTED

Decision:
Model escrow as external/regulated financial state and references where applicable.

Possible internal concepts:
- EscrowReference
- EscrowStatus
- EscrowPaymentReference
- EscrowMilestone

Do not model Hesba In as custodian or owner of escrow funds without a separately approved legal/regulatory structure.

---

## ADR-017 — Parallel Financing Supports Many Offers, One Selected Offer
Status: ACCEPTED

Decision:
One Deal can have multiple financing applications/invitations and offers.
Only one offer is selected at a time.

Selection requires explicit action/event:
FinancingOfferSelected.

Consequences:
Issued ≠ Selected.
Replacement must follow an explicit transition.
Historical offers are retained for audit/history.

---

## ADR-018 — Conversation History Survives Lead-to-Deal Conversion
Status: ACCEPTED

Decision:
Pre-reservation communication must not be lost when a Lead converts to a Deal.

Consequences:
Conversation ownership/context may transition, but history and authorization boundaries remain auditable.

---

## ADR-019 — Failure-First Workflow Design
Status: ACCEPTED

Decision:
Critical workflows must define non-happy paths before implementation is considered complete.

Required considerations:
- Timeout
- Retry
- Duplicate message/request
- Partial failure
- External API outage
- Expiry
- User abandonment
- Conflict
- Compensation/recovery
- Manual intervention

---

## ADR-020 — Regulatory Gates Override Technical Convenience
Status: ACCEPTED

Decision:
No architecture decision may silently resolve a REGULATORY-GATE.

Applies especially to:
- SAMA-related financing intermediation
- Bank employee incentives
- Sensitive data sharing/access
- Off-plan payment/escrow workflows
- SIMAH/Nafath access assumptions

Consequences:
Use interfaces/feature flags/configurable boundaries until the relevant gate is formally resolved.

---

# OPEN / FUTURE ADR CANDIDATES

ADR-CANDIDATE-001 — Final finance-provider routing architecture after OD-007.
ADR-CANDIDATE-002 — Final reservation payment architecture after OD-004.
ADR-CANDIDATE-003 — Final reservation expiry policy after OD-005.
ADR-CANDIDATE-004 — Final client channel architecture after OD-010.
ADR-CANDIDATE-005 — Final offer-ranking architecture after OD-008.
ADR-CANDIDATE-006 — Final SAMA operating boundary after OD-001.

---

# ADR GOVERNANCE

Every future ADR must include:
- ADR ID
- Title
- Status
- Context
- Decision
- Alternatives considered
- Consequences
- Related DEC / BR / OD references
- Date
- Owner

When replaced:
1. Do not delete the old ADR.
2. Mark it SUPERSEDED or DEPRECATED.
3. Reference the replacement ADR.
4. Update impacted Decision Registry, Business Rules, PRD, Domain Model, APIs, and QA.
