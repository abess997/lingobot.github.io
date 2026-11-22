# HESBA IN — PRD & FEATURE SPECIFICATION REGISTRY
Version: 1.0

Purpose: Define the product requirements and feature-level implementation scope for Hesba In without overriding confirmed decisions or prematurely resolving open/regulatory-gated items.

This registry is governed by:
- Master Context
- Decision Registry
- Business Rules & Invariants
- Open Decisions Register
- Compliance Matrix
- ADR Registry
- Domain Model Registry
- State Machines Registry
- Permissions & Access Control Matrix
- API & Data Contracts Registry
- Database Schema Registry
- Workflow & Orchestration Registry
- QA & Acceptance Criteria Registry

---

# 1. PRODUCT OBJECTIVE

Hesba In digitally orchestrates the Saudi property-buying and financing journey across:

Buyer
→ Developer / Developer Sales Agent
→ Finance Provider / Finance Employee
→ Platform Operations

North-star journey:

Discover
→ Qualify
→ Communicate
→ Reserve
→ Apply
→ Compare
→ Select
→ Contract
→ Complete

Primary outcomes:
- Lower buyer friction
- Higher deal completion
- Clear ownership and SLA accountability
- Safe parallel financing
- Strong partner adoption
- Regulatory safety
- Data integrity
- Scalable multi-tenant operations

---

# 2. FEATURE STATUS LABELS

MUST:
Required for core MVP/platform integrity.

SHOULD:
Important but may follow the first production slice.

COULD:
Useful expansion feature.

CONDITIONAL:
Required only for applicable transaction/project/provider type.

REGULATORY-GATE:
Do not production-enable until formally resolved.

OPEN:
Feature behavior depends on unresolved founder/product/business decision.

---

# 3. BUYER EXPERIENCE

## PRD-001 — Property / Project Discovery
Priority: MUST

Goal:
Allow buyer to discover developer projects and available units.

Core requirements:
- Project listing
- Project detail
- Unit listing
- Unit availability
- Basic commercial/property information
- Developer/storefront identity
- Project type awareness: Ready vs Off-plan
- Clear status for unavailable/reserved units

Acceptance dependencies:
Unit availability must come from authoritative Inventory/Unit state.

Do not:
Infer availability from stale UI cache alone.

---

## PRD-002 — Financing Calculator
Priority: MUST

Goal:
Give buyer/sales agent an indicative financing calculation.

Requirements:
- Input required financing variables
- Produce indicative outputs
- Preserve point-in-time calculation snapshot
- Show calculatedAt
- Show rule/provider source where applicable
- Show expiry where applicable
- Clearly label output as indicative unless confirmed by authorized provider

Required snapshot:
InputsSnapshot
RuleSetVersion
CalculatedAt
OutputSnapshot
Source
Expiry

Critical rule:
Eligibility ≠ Approval.

---

## PRD-003 — Identity Verification
Priority: MUST / INTEGRATION DEPENDENT

Goal:
Support verified onboarding/readiness using an IdentityVerificationProvider.

Requirements:
- Start verification
- Track pending/completed/failed state
- Store minimum required provider reference/result
- Retry/reconciliation path
- Provider abstraction

Initial target:
Nafath or approved identity channel.

Do not:
Hard-code core domain to one provider schema.

---

## PRD-004 — Buyer Consent Management
Priority: MUST

Goal:
Allow controlled sharing/processing of buyer data.

Requirements:
- Purpose-specific consent/authorization
- Data scope
- Recipient
- Notice version
- Legal basis where applicable
- Grant/revoke history
- Auditability
- Future access enforcement after revocation where applicable

Critical:
Consent is not merely a checkbox.
Consent is not equivalent to KYC.

---

## PRD-005 — Buyer ↔ Developer Communication
Priority: MUST

Goal:
Allow buyer to communicate with developer sales agent before reservation.

Requirements:
- Lead-linked conversation
- Secure participant authorization
- Persistent history
- Lead → Deal continuity
- Message timestamps
- Thread state
- Audit/security controls

Confirmed:
Pre-reservation developer chat is allowed.

---

## PRD-006 — Reservation
Priority: MUST / PARTIALLY OPEN

Goal:
Allow buyer to reserve/hold a unit safely.

Confirmed:
- One active reservation per Unit
- Atomic/concurrency-safe behavior
- Reservation state/history
- Unit availability update
- Audit and notifications
- Expiry/release support conceptually

OPEN:
- Paid vs unpaid hold
- External payment reference
- Hold duration
- Extension policy

Dependencies:
OD-004
OD-005

Release blocker:
Double booking.

---

## PRD-007 — Buyer Deal Tracker
Priority: MUST

Goal:
Give buyer clear visibility into where the transaction currently stands.

Requirements:
- Current Deal state
- Completed milestones
- Next required action
- Owner of current step where appropriate
- SLA/expected-by indicator
- Required documents/actions
- Financing progress summary
- Selected offer status
- Contract/completion milestones
- Notifications

Do not:
Expose provider/developer internal-only notes.

---

## PRD-008 — Buyer Financing Applications
Priority: MUST / REGULATORY-GATE FOR ROUTING

Goal:
Allow buyer Deal to interact with multiple finance providers.

Core model:
One Deal
→ Many FinancingApplications
→ Many FinancingOffers
→ One selected offer

Requirements:
- Application state
- Provider identity
- Required documents
- status timeline
- withdrawal where applicable
- decision snapshot
- privacy controls

Dependencies:
OD-001
OD-006
OD-007

---

## PRD-009 — Buyer Financing Offer Comparison
Priority: MUST / REGULATORY-GATE FOR RANKING

Goal:
Allow buyer to compare authorized financing offers.

Requirements:
- Side-by-side comparable fields
- Provider
- Monthly payment
- Term
- Down payment
- Fees
- Total cost / approved comparison field
- Conditions
- Offer expiry
- Offer status
- Explicit selection action

Critical:
Issued ≠ Selected.

OPEN:
Ordering/ranking/sponsored placement rules.

Dependencies:
OD-008
OD-001

---

## PRD-010 — Buyer ↔ Finance Provider Communication
Priority: MUST / OPEN

Goal:
Allow secure conversation with authorized finance employee/provider.

Confirmed:
- Secure
- Relationship scoped
- Deal/application scoped
- Auditable
- Document-request capable

OPEN:
Exact activation trigger.

Depends on:
OD-003

---

## PRD-011 — Document Vault
Priority: MUST

Goal:
Centralize buyer/deal/financing documents safely.

Requirements:
- Upload
- Categorization
- Versioning
- Review status
- Replacement lineage
- Expiry where applicable
- Fine-grained authorization
- Audit of sensitive access
- Context linkage: Deal / FinancingApplication / other approved context

Critical:
Deal visibility does not automatically grant all document access.

---

## PRD-012 — Notifications
Priority: MUST

Goal:
Notify each actor about actionable state changes.

Examples:
- New lead assignment
- Reservation created/expiring
- Financing document requested
- Offer issued
- Offer expiry
- Deal milestone change
- SLA overdue
- Support update

Architecture:
Notification is a projection from authoritative events.

Do not:
Use notification state as business source of truth.

---

# 4. DEVELOPER SALES EXPERIENCE

## PRD-020 — Sales Agent Lead Inbox
Priority: MUST

Goal:
Allow assigned sales agent to follow buyer interest.

Requirements:
- Assigned leads
- Lead state
- Contact context
- Project/unit interest
- conversation
- qualification
- convert to Deal
- SLA/follow-up status

Rule:
Only authorized/assigned scope.

---

## PRD-021 — Sales Agent Mini CRM
Priority: MUST

Requirements:
- Lead list
- Buyer follow-up
- status transitions
- assigned inventory context
- active deals
- tasks/next action
- SLA indicators
- activity timeline

Do not:
Expose raw finance-provider files.

---

## PRD-022 — Sales Agent Quick Financing Calculator
Priority: MUST

Use case:
Events, exhibitions, showroom, live buyer conversation.

Requirements:
- Fast calculation
- Indicative label
- Snapshot/version
- optional provider/rule context
- share/save into Lead/Deal where authorized

Offline capability:
COULD / dependent on client-channel architecture.

---

## PRD-023 — Sales Agent Deal Tracking
Priority: MUST

Requirements:
- Assigned Deals
- reservation state
- approved financing summary
- next action
- SLA
- document readiness summary where permitted
- completion status

Financing view:
EligibilitySummary / minimal projection only.

---

## PRD-024 — Sales Agent Wallet / Reward Projection
Priority: CONDITIONAL

Goal:
Show employee reward status if approved business model permits.

Possible views:
Pending
Available
Paid
Reversed

Architecture:
Projection from Transaction Ledger.

Critical:
Wallet infrastructure ≠ authorization to pay.

Bank/finance employee reward payout:
REGULATORY-GATE.

---

# 5. DEVELOPER ORGANIZATION EXPERIENCE

## PRD-030 — Developer Storefront
Priority: MUST

Goal:
Allow developer to publish/manage a branded digital property presence.

Requirements:
- Organization profile
- Projects
- Units
- availability
- media/content
- inquiry entry point
- financing widget entry point
- project/license metadata where applicable

---

## PRD-031 — Project & Unit Inventory Management
Priority: MUST

Requirements:
- Create/update project
- Create/update unit
- status/availability
- external-source mapping
- sync/reconciliation
- Ready vs Off-plan type
- license/escrow metadata where required

Critical:
External inventory updates cannot break active reservation integrity.

---

## PRD-032 — Developer Dashboard
Priority: MUST

KPIs:
- Leads
- Qualified leads
- Reservations
- Active deals
- Conversion rate
- Unit availability
- Financing progress summary
- Completion rate
- SLA performance
- Sales agent activity/performance
- cancellation/loss reasons

Privacy:
No raw financing-detail exposure by default.

---

## PRD-033 — Developer Team Management
Priority: MUST

Requirements:
- Members
- sales-agent roles
- assignments
- status
- role constraints
- audit of permission changes

Cannot:
Grant Platform Admin/Super Admin.

---

## PRD-034 — Embeddable Financing Widget
Priority: SHOULD

Goal:
Allow partner/developer site to launch Hesba financing experience.

Requirements:
- secure embeddable integration
- organization/project context
- calculator
- lead capture where permitted
- attribution/source tracking
- API isolation
- consent/privacy
- versioned widget config

Do not:
Let widget bypass platform authorization/business rules.

---

# 6. FINANCE EMPLOYEE EXPERIENCE

## PRD-040 — Financing Application Inbox
Priority: MUST / REGULATORY-GATE FOR ROUTING

Goal:
Finance employee sees only assigned/authorized financing requests.

Requirements:
- application list
- buyer/deal context
- required documents
- status
- SLA
- provider reference
- review actions

Privacy:
Cannot view competitor applications/offers.

---

## PRD-041 — Financing Review Workspace
Priority: MUST

Requirements:
- application summary
- buyer authorized financial data
- required documents
- decision/status transitions
- request missing documents
- provider notes
- decision snapshot
- valuation/compliance references where applicable

Critical:
Provider decision remains authoritative within approved model.

---

## PRD-042 — Financing Offer Creation
Priority: MUST

Requirements:
- issue offer
- comparable offer fields
- validity/expiry
- conditions
- provider reference
- status lifecycle
- buyer notification
- immutable historical preservation

Cannot:
Create multiple current selected offers.

---

## PRD-043 — Finance Employee Chat
Priority: MUST / OPEN

Requirements:
- buyer conversation
- document requests
- authorized thread only
- Deal/Application context
- audit
- thread restrictions

Activation:
Depends on OD-003.

---

## PRD-044 — Finance Employee Wallet / Incentive
Priority: REGULATORY-GATE

Infrastructure:
Can display disabled/pending projection if needed.

Payout:
Must remain disabled until OD-002 is resolved.

---

# 7. FINANCE ORGANIZATION EXPERIENCE

## PRD-050 — Finance Organization Dashboard
Priority: MUST

KPIs:
- received applications
- active reviews
- documents pending
- prequalified
- approved
- declined
- offers issued
- offers selected
- approval turnaround
- SLA performance
- completion contribution
- employee workload

Privacy:
Only own organization data.

---

## PRD-051 — Finance Team & Assignment Management
Priority: MUST

Requirements:
- members
- finance employee roles
- application assignment
- workload visibility
- provider-specific configuration
- own-tenant audit/performance

---

## PRD-052 — Provider Configuration
Priority: SHOULD

Requirements:
- integration mode
- provider IDs
- rule/version references
- API/manual/hybrid capability
- SLA config
- active/inactive status

Depends on:
OD-006

---

# 8. ADMIN / PLATFORM EXPERIENCE

## PRD-060 — Admin Operations Dashboard
Priority: MUST

Goal:
Monitor agents and workflows without routinely intervening.

KPIs:
- Deal funnel
- stuck deals
- SLA breaches
- provider failures
- reservation conflicts
- integration errors
- document bottlenecks
- support/disputes
- privileged/manual overrides
- compliance alerts
- transaction/projection health

Admin model:
Observe first, intervene only through approved commands/workflows.

---

## PRD-061 — Deal Operations Console
Priority: MUST

Requirements:
- search Deal
- timeline
- participant/organization context
- current workflow state
- SLA
- integration state
- support/disputes
- audit trail
- approved manual intervention controls

Forbidden:
Direct arbitrary DB state editing.

---

## PRD-062 — Support & Dispute Management
Priority: MUST

Requirements:
- ticket queue
- ownership
- evidence
- escalation
- resolution
- downstream explicit commands
- audit

---

## PRD-063 — Compliance Operations
Priority: MUST

Requirements:
- licenses
- consent status
- data-subject requests
- gated-feature flags
- privileged access review
- KYC/AML references where applicable
- audit investigation

---

## PRD-064 — Integration Operations
Priority: MUST

Requirements:
- provider status
- callback failures
- retries
- reconciliation
- inbox/outbox monitoring
- mapping errors
- stale inventory alerts

---

## PRD-065 — Platform Tenant Management
Priority: MUST

Requirements:
- organizations
- capabilities
- status
- membership
- subscription reference
- privileged roles
- tenant lifecycle

Cross-tenant access:
Explicit + audited only.

---

# 9. BILLING & COMMERCIAL FEATURES

## PRD-070 — SaaS Subscription
Priority: SHOULD

Requirements:
- plans
- billing cycle
- organization subscription
- active/past due/suspended/cancelled states
- invoice linkage

Final pricing/model:
Depends on OD-009.

---

## PRD-071 — Invoicing
Priority: CONDITIONAL

Requirements:
- invoice history
- structured tax/e-invoice compatibility where applicable
- credit/debit adjustments
- immutable issued record lineage

Critical:
PDF invoice alone is not equivalent to compliant e-invoicing.

---

## PRD-072 — Sponsored Placement / Advertising
Priority: COULD / REGULATORY-COMPLIANCE REVIEW

Requirements:
- clear sponsored labeling
- separation from objective eligibility/approval logic
- campaign ownership
- impression/click analytics
- tenant attribution

Open:
Interaction with financing offer ordering.

Depends on:
OD-008

---

## PRD-073 — Analytics / Insights
Priority: COULD

Requirements:
- aggregated reporting
- tenant isolation
- privacy-safe data use
- no raw cross-tenant leakage
- controlled AI/analytics context

No cross-tenant AI training leakage.

---

# 10. INTEGRATION FEATURES

## PRD-080 — IdentityVerificationProvider
Priority: MUST / ACCESS DEPENDENT

Initial target:
Nafath or approved identity provider.

---

## PRD-081 — PropertyInventoryProvider
Priority: SHOULD

Targets:
- Hesba Native
- Developer API
- NHC / TechHub
- Batch import

---

## PRD-082 — CreditDataProvider
Priority: CONDITIONAL / REGULATORY & CONTRACTUAL GATE

Target:
SIMAH / approved channel where legally/contractually permitted.

Do not assume direct platform access.

---

## PRD-083 — FinancingProviderAdapter
Priority: MUST

Support conceptual modes:
API
Manual
Rules-assisted
Hybrid

Final MVP mode:
Depends on OD-006.

---

# 11. CONDITIONAL TRANSACTION FEATURES

## PRD-090 — Off-Plan Compliance
Priority: CONDITIONAL / MUST WHEN APPLICABLE

Requirements:
- project type
- license validation
- applicable escrow reference
- transaction-specific reservation/payment controls
- compliance gating

Ready-property workflow must not inherit unnecessary off-plan requirements.

---

## PRD-091 — Escrow Tracking
Priority: CONDITIONAL

Requirements:
- external escrow reference
- status
- payment reference
- milestone reference
- audit

Critical:
Hesba In is not assumed to be custodian/owner of escrow funds.

---

## PRD-092 — Valuation
Priority: CONDITIONAL

Requirements:
- request/reference
- provider
- amount
- date
- expiry
- FinancingApplication relationship

---

## PRD-093 — KYC / AML Check
Priority: CONDITIONAL / REGULATORY-GATE

Requirements:
- provider/reference
- state
- restricted access
- expiry
- audit

Exact ownership/blocking:
Depends on approved regulatory operating model.

---

# 12. MVP FEATURE SET — CURRENT RECOMMENDED BASELINE

## MVP MUST
- User/Organization foundation
- Buyer onboarding
- Identity verification readiness
- Project discovery
- Unit discovery
- Lead
- Buyer ↔ Developer chat
- Sales Agent CRM
- Reservation integrity
- Deal
- Deal tracker
- Financing calculator
- FinancingApplication architecture
- Parallel financing support
- FinancingOffer
- Explicit offer selection
- Document vault
- Consent
- Notifications
- SLA tracking
- Developer dashboard
- Finance employee workspace
- Finance organization dashboard
- Admin operations console
- Support/disputes
- Audit trail
- Transaction Ledger foundation
- Multi-tenancy/security
- Provider adapter layer
- Integration monitoring
- QA/security/compliance gates

## MVP CONDITIONAL / GATED
- Production regulated finance routing
- SIMAH
- Buyer ↔ Finance employee activation policy
- Paid reservation
- Escrow/payment workflow
- Bank employee cash incentives
- Offer recommendation/ranking
- E-contracting
- Actual payout execution

## POST-MVP / SHOULD/COULD
- Native mobile apps if selected
- Advanced embedded widget
- Advanced sponsored marketplace
- Advanced analytics
- AI operational assistance
- additional finance verticals
- deeper partner APIs

---

# 13. NON-FUNCTIONAL PRODUCT REQUIREMENTS

## NFR-001 — Security
- default deny
- tenant isolation
- field-level security
- privileged access audit
- sensitive data minimization

## NFR-002 — Reliability
- idempotent critical commands
- retry/reconciliation
- no duplicate business effects
- explicit compensation

## NFR-003 — Performance
Critical interactive operations should have explicit target SLAs during implementation.
Do not hard-code unsupported numbers in this registry.

## NFR-004 — Auditability
All sensitive state transitions must be reconstructable.

## NFR-005 — Explainability
Financing calculation/eligibility output must preserve source/version/snapshot.

## NFR-006 — Scalability
Architecture must support multiple organizations, projects, finance providers, and high deal concurrency.

## NFR-007 — Availability Integrity
Reservation consistency is more important than optimistic UI responsiveness.

## NFR-008 — Privacy
No cross-tenant leakage.
No unnecessary raw sensitive data exposure.

---

# 14. PRODUCT ANALYTICS REQUIREMENTS

Track at minimum:

Acquisition:
- visitors
- leads
- lead source

Sales:
- lead qualification rate
- lead→reservation conversion
- reservation→deal conversion

Financing:
- applications per Deal
- provider response rate
- time to first offer
- offers per Deal
- offer selection rate
- approval rate

Completion:
- deal completion rate
- cancellation rate
- median cycle time
- stage drop-off

Operations:
- SLA breach rate
- manual intervention rate
- provider failure rate
- document rejection rate

Integrity:
- reservation conflict attempts
- duplicate callback attempts
- failed idempotency conflicts
- privileged cross-tenant accesses

Commercial:
- subscriptions
- fixed/usage revenue when finalized
- retention/churn where applicable

Do not create cross-tenant analytics that violate isolation/privacy.

---

# 15. PRD OPEN ITEMS

PRD-OPEN-001 — Final SAMA-enabled financing scope
Depends on OD-001.

PRD-OPEN-002 — Bank employee incentive/payout feature
Depends on OD-002.

PRD-OPEN-003 — Buyer ↔ Finance chat trigger
Depends on OD-003.

PRD-OPEN-004 — Reservation paid/free/external-payment structure
Depends on OD-004.

PRD-OPEN-005 — Reservation duration/extension
Depends on OD-005.

PRD-OPEN-006 — Provider integration mode
Depends on OD-006.

PRD-OPEN-007 — Provider selection/routing
Depends on OD-007.

PRD-OPEN-008 — Offer ordering/ranking/sponsorship
Depends on OD-008.

PRD-OPEN-009 — Final fee model
Depends on OD-009.

PRD-OPEN-010 — Native vs Web/PWA MVP client
Depends on OD-010.

---

# 16. FEATURE DEFINITION TEMPLATE

Every future feature must include:

Feature ID
Title
Actor(s)
Problem
Goal
Priority
Status
Preconditions
Happy Path
States/Transitions
Permissions
Data
API
Events
Failure Cases
Audit
Notifications
Metrics
Acceptance Criteria
Compliance Impact
Open Decisions
Dependencies
Out of Scope

---

# 17. FEATURE CHANGE GOVERNANCE

Before materially changing a feature:

1. Check latest founder decision.
2. Check Decision Registry.
3. Check Master Context.
4. Check Business Rules.
5. Check Compliance/Open Decisions.
6. Check ADR/Domain/State/Permissions.
7. Check API/Database/Workflow.
8. Check QA acceptance criteria.
9. Record conflicts explicitly.
10. Mark superseded feature decisions DEPRECATED.
11. Do not silently reinterpret prototype behavior as a product decision.

This registry defines product scope; it does not independently authorize REGULATORY-GATE features.
