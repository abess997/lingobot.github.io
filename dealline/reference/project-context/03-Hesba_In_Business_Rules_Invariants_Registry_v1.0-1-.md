# HESBA IN — BUSINESS RULES & INVARIANTS REGISTRY
Version: 1.0

Purpose: Convert confirmed product and architecture decisions into enforceable rules for Domain, API, Database, QA, and Audit.

## 1. Inventory & Reservation

BR-001 — One Active Reservation
Status: CONFIRMED
A Unit may have at most one ACTIVE reservation at any time.

BR-002 — Concurrency Safety
Status: CONFIRMED
Reservation creation must be atomic/concurrency-safe. UI checks alone are insufficient.

BR-003 — Reservation Expiry
Status: OPEN
Every temporary reservation must have an explicit expiry/hold policy before implementation.

## 2. Lead, Deal & Communication

BR-004 — Lead Before Deal
Status: CONFIRMED
Pre-reservation buyer interest is represented by a Lead, not a Deal.

BR-005 — Pre-Reservation Chat
Status: CONFIRMED
Buyer may communicate with the developer sales agent before reservation.

BR-006 — Conversation Continuity
Status: CONFIRMED
Lead-to-Deal conversion must preserve authorized conversation history.

BR-007 — Bank Chat Trigger
Status: OPEN
Exact trigger for Buyer ↔ Finance Employee chat remains a product decision.

## 3. Financing

BR-008 — Parallel Financing
Status: CONFIRMED
One Deal may have multiple financing applications/invitations and multiple offers.

BR-009 — Single Selected Offer
Status: CONFIRMED
A Deal may have only one currently selected financing offer unless an explicit replacement workflow is executed.

BR-010 — Explicit Offer Selection
Status: CONFIRMED
Selection requires an explicit event/action; an issued offer is not automatically selected.

BR-011 — Eligibility ≠ Approval
Status: CONFIRMED
Calculator or prequalification output must never be represented as final financing approval.

BR-012 — Decision Snapshot
Status: CONFIRMED
Financing calculations/eligibility decisions must preserve:
InputsSnapshot, RuleSetVersion, CalculatedAt, OutputSnapshot, Source, Expiry.

BR-013 — Regulatory Gate
Status: REGULATORY-GATE
Do not finalize regulated financing routing, matching, recommendation, or intermediation behavior before resolving applicable Saudi regulatory requirements.

## 4. Privacy & Access

BR-014 — Purpose-Limited Access
Status: CONFIRMED
Sensitive data access must be limited by role, tenant, relationship, and purpose.

BR-015 — Developer Financing Visibility
Status: CONFIRMED
Developer-side users must not receive raw detailed financing records by default. Use an approved limited projection/summary.

BR-016 — Consent Auditability
Status: CONFIRMED
Consent records must preserve purpose, data scope, recipient, legal basis where applicable, timestamps, and version/reference.

BR-017 — Consent Withdrawal
Status: CONFIRMED
Where withdrawal applies, revoked consent must stop future access/sharing governed by that consent, subject to lawful retention obligations.

BR-018 — Data Minimization
Status: CONFIRMED
Do not collect sensitive fields without a defined purpose, ownership, recipient/access rule, and retention basis.

## 5. Multi-Tenancy

BR-019 — Tenant Isolation
Status: CONFIRMED
No cross-tenant leakage of data, files, chats, documents, transactions, analytics, or AI context.

BR-020 — MVP Tenant Boundary
Status: CONFIRMED — MVP ONLY
Organization is the primary MVP tenant boundary, but architecture must not permanently hard-code Organization == Tenant.

## 6. Financial Ledger & Incentives

BR-021 — Ledger Source of Truth
Status: CONFIRMED
Transaction Ledger is the authoritative financial record.

BR-022 — Wallet Is Projection
Status: CONFIRMED
Wallet/bonus balances are derived read models and must not be independently mutated.

BR-023 — Idempotent Financial Operations
Status: CONFIRMED
Retries/duplicate events must not create duplicate payments, fees, bonuses, or payouts.

BR-024 — No Silent Financial Mutation
Status: CONFIRMED
Corrections require explicit reversal/adjustment/compensating entries; historical financial events are not silently overwritten.

BR-025 — Bank Employee Incentive
Status: REGULATORY-GATE
Cash or equivalent incentives to bank/finance employees must not be activated until regulatory, employer-policy, conflict-of-interest, tax, contractual, and Sharia review is resolved.

## 7. Property Type & Escrow

BR-026 — Transaction-Type Rules
Status: CONFIRMED
Ready-property and off-plan workflows must be distinguished.

BR-027 — Conditional Escrow
Status: CONFIRMED
Escrow-related rules activate only where applicable to the project/transaction type.

BR-028 — No Assumed Custody
Status: CONFIRMED
Hesba In must not be modeled as custodian/owner of escrow funds unless a formally approved structure explicitly establishes that role.

## 8. Audit & Overrides

BR-029 — Immutable Audit Trail
Status: CONFIRMED
Sensitive actions must generate audit records.

BR-030 — Manual Override Evidence
Status: CONFIRMED
Sensitive manual overrides require:
Actor, Reason, BeforeState, AfterState, Timestamp, AuditEvent.

BR-031 — Critical Event Traceability
Status: CONFIRMED
Reservation, financing status, offer selection, consent, document access, permissions, and financial events must be traceable.

## 9. Workflow Reliability

BR-032 — Idempotent Critical Commands
Status: CONFIRMED
Critical commands/events must include sufficient uniqueness/idempotency protection.

BR-033 — Failure Paths Required
Status: CONFIRMED
Critical workflows must define timeout, retry, duplicate, partial failure, expiry, external API failure, and compensation/recovery behavior.

BR-034 — Cross-Domain Orchestration
Status: CONFIRMED
Multi-domain/external workflows must use an explicit orchestration/process-manager pattern or equivalent; domains must not update each other through hidden shortcuts.

## 10. Integration Rules

BR-035 — Provider Abstraction
Status: CONFIRMED
Core domain logic must use provider/adapter abstractions for identity, property inventory, credit data, and finance providers.

BR-036 — External Integration Failure
Status: CONFIRMED
External API failure must not corrupt internal state; retries and reconciliation must be defined.

## 11. AI Governance

BR-037 — No Cross-Tenant Training Leakage
Status: CONFIRMED
Tenant data must not automatically train/improve models for competing tenants.

BR-038 — AI Advisory by Default
Status: CONFIRMED
AI outputs are advisory unless an explicitly approved workflow grants automated authority.

BR-039 — Sensitive AI Actions
Status: CONFIRMED
Any sensitive automated action must be explainable, permissioned, logged, and auditable.

## 12. Revenue & Commercial Rules

BR-040 — Percentage-Based Revenue Not Default
Status: CONFIRMED
Do not assume revenue based on a percentage of financing principal, loan amount, property value, or transaction value.

BR-041 — Percentage Commission Review
Status: REGULATORY-GATE
Percentage-based commissions require Business, Saudi Regulatory, Sharia, and Tax/Accounting review before adoption.

BR-042 — Sponsored Placement Integrity
Status: CONFIRMED
Paid placement must not secretly alter objective eligibility/approval logic and must be clearly distinguishable where applicable.

## 13. Definition of Done

BR-043 — Feature Completeness
Status: CONFIRMED
A critical feature is not fully designed until it defines:
Business Rule
→ State Machine
→ Permissions
→ Data
→ API
→ Failure Cases
→ Audit
→ Metrics
→ QA Acceptance Criteria.

## OPEN RULES TO RESOLVE

OPEN-BR-001 — Reservation hold duration.
OPEN-BR-002 — Reservation payment vs non-payment hold.
OPEN-BR-003 — Exact Buyer ↔ Bank chat trigger.
OPEN-BR-004 — Whether buyer chooses finance providers or requests are broadcast/routed.
OPEN-BR-005 — Final offer ordering/ranking and sponsored-offer policy.
OPEN-BR-006 — Final fee model by actor.
OPEN-BR-007 — MVP finance-provider integration mode: API / manual / rules engine / hybrid.

## Governance

When a rule changes:
1. Identify the affected BR ID.
2. Record the new decision/evidence.
3. Mark the old rule DEPRECATED if replaced.
4. Update related Decision Registry, PRD, Domain Model, API, and QA artifacts.
5. Never silently change a CONFIRMED invariant.
