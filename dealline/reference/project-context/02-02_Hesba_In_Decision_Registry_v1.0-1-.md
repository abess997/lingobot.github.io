# HESBA IN — DECISION REGISTRY
Version: 1.0

## STATUS DEFINITIONS

CONFIRMED — Approved current decision.
ASSUMPTION — Temporary working assumption.
REGULATORY-GATE — Cannot be finalized before regulatory/legal resolution.
EXPERIMENT — Hypothesis under testing.
DEPRECATED — Previously approved and later replaced.
REJECTED — Considered and rejected.

---

## PRODUCT & JOURNEY

### DEC-001 — Hesba In Product Nature
Status: CONFIRMED
Category: Product Strategy

Hesba In is a Saudi PropTech / FinTech-enabled SaaS platform orchestrating
property purchase and financing interactions between buyers, developers,
sales agents, finance providers, finance employees, and platform administrators.

It is not automatically assumed to be the lender, escrow holder, or regulated intermediary.

### DEC-002 — Core Value Proposition
Status: CONFIRMED

Reduce friction, fragmentation, duplicated work, unclear ownership,
and communication delays across the property purchase + financing journey.

### DEC-003 — Communication Before Reservation
Status: CONFIRMED

Buyer may communicate with the developer sales agent before reservation.

### DEC-004 — Lead Before Deal
Status: CONFIRMED

Lead exists before Deal and represents pre-transaction interest.

---

## PROPERTY & INVENTORY

### DEC-005 — Unit Is Availability Authority
Status: CONFIRMED
Priority: Critical

Unit is the source of truth for availability.

Invariant:
One Unit → Maximum One Active Reservation.

### DEC-006 — Reservation Concurrency
Status: CONFIRMED

Reservation must be concurrency-safe.
Race conditions must never create two active reservations for one unit.

### DEC-007 — Property Transaction Types
Status: CONFIRMED

Differentiate ready property from off-plan property.
Do not apply off-plan requirements universally.

### DEC-008 — Escrow Capability
Status: CONFIRMED — CONDITIONAL

Escrow capability activates when applicable to the transaction/project type.

Hesba In may track:
- Escrow Reference
- Escrow Status
- Payment Events
- Escrow Milestones

Hesba In is not assumed to hold or own escrow funds.

---

## FINANCING

### DEC-009 — Parallel Financing
Status: CONFIRMED
Priority: Critical

One Deal
→ Multiple Financing Applications / Invitations
→ Multiple Financing Offers
→ One Selected Financing Offer.

### DEC-010 — Explicit Financing Offer Selection
Status: CONFIRMED

Final financing provider is selected through an explicit domain event such as:
FinancingOfferSelected.

### DEC-011 — Eligibility Is Not Approval
Status: CONFIRMED

Calculator/prequalification outputs are indicative.
They must not be presented as final financing approval unless confirmed by an authorized financing entity.

### DEC-012 — Versioned Financing Decisions
Status: CONFIRMED

Store:
- InputsSnapshot
- RuleSetVersion
- CalculatedAt
- OutputSnapshot
- Source
- Expiry

### DEC-013 — SAMA Regulatory Classification
Status: REGULATORY-GATE
Priority: Blocking

The regulatory classification of Hesba In's financing-intermediation activities must be formally resolved before finalizing workflows that may constitute regulated digital brokerage or related activity.

Affected:
- Financing routing
- Bank matching
- Eligibility
- Offer aggregation
- Offer comparison
- Recommendation
- Customer financial data sharing
- Finance employee incentives
- Commercial finance-provider agreements

---

## REVENUE

### DEC-014 — Percentage of Financing Is Not Default Revenue
Status: CONFIRMED

Do not default to revenue based on a percentage of loan principal or financing amount.

Preferred candidates:
- SaaS Subscription
- Fixed Platform Fee
- Fixed Service Fee
- Usage Fee
- Integration/API Fee
- Advertising
- Premium Analytics
- Enterprise Services

### DEC-015 — Percentage Commission
Status: REGULATORY-GATE

Any percentage-based commission requires:
Business + Regulatory + Sharia + Tax/Accounting review.

### DEC-016 — Developer SaaS Subscription
Status: CONFIRMED — BUSINESS MODEL CANDIDATE

Developer SaaS subscriptions are a preferred revenue candidate.

### DEC-017 — Advertising / Premium Placement
Status: CONFIRMED — OPTIONAL

Sponsored placements may exist, but must not secretly alter objective financing eligibility or recommendation logic.

---

## EMPLOYEE INCENTIVES

### DEC-018 — Employee Wallet Infrastructure
Status: CONFIRMED — INFRASTRUCTURE

Wallet/incentive balance may be supported as infrastructure.

Wallet is not the financial source of truth.

### DEC-019 — Bank Employee Cash Incentive
Status: REGULATORY-GATE

Requires review of:
- Regulatory compliance
- Employer policy
- Conflict of interest
- Contract structure
- Tax
- Sharia

---

## FINANCIAL ARCHITECTURE

### DEC-020 — Transaction Ledger Is Source of Truth
Status: CONFIRMED
Priority: Critical

Potential financial events:
- bonus_accrual
- bonus_release
- bonus_reversal
- payout
- fee_accrual
- payment
- refund
- adjustment

### DEC-021 — Wallet Is a Projection
Status: CONFIRMED

Wallet/Bonus Ledger is a read model derived from financial transactions.

### DEC-022 — Idempotency
Status: CONFIRMED

Critical operations must be idempotent.

Prevent:
- Duplicate Payment
- Duplicate Bonus
- Duplicate Reservation
- Duplicate Application

---

## PRIVACY

### DEC-023 — Consent Domain
Status: CONFIRMED

Consent is an auditable domain record, not a UI checkbox.

Record:
- Purpose
- Data Scope
- Recipient
- Legal Basis
- GrantedAt
- RevokedAt
- Privacy Notice Version

### DEC-024 — Data Minimization
Status: CONFIRMED

Do not collect sensitive data without a defined purpose and governance basis.

### DEC-025 — Developer Financing Visibility
Status: CONFIRMED

Developer and property sales employees do not receive detailed buyer financing records by default.

Use an Eligibility Summary / limited projection where appropriate.

---

## MULTI-TENANCY

### DEC-026 — Multi-Tenant Architecture
Status: CONFIRMED
Priority: Critical

Hesba In is multi-tenant by design.

### DEC-027 — Organization as MVP Tenant Boundary
Status: CONFIRMED — MVP ONLY

Organization is the primary tenant boundary for MVP,
but Organization == Tenant must not be permanently hard-coded.

### DEC-028 — Cross-Tenant Isolation
Status: CONFIRMED

Prevent cross-tenant leakage of:
- Data
- Files
- Chats
- Documents
- Analytics
- AI Context
- Transactions

---

## AI GOVERNANCE

### DEC-029 — Cross-Tenant AI Training
Status: CONFIRMED

Tenant data must not automatically train models benefiting competing tenants.

### DEC-030 — AI Authority
Status: CONFIRMED

AI is advisory by default.
Sensitive automated actions require explicit workflow authority and auditability.

---

## INTEGRATIONS

### DEC-031 — Nafath
Status: CONFIRMED — INTEGRATION TARGET

Use an IdentityVerificationProvider abstraction.
Do not hard-code core domain logic to Nafath.

### DEC-032 — SIMAH
Status: CONFIRMED — INTEGRATION TARGET / ACCESS DEPENDENT

SIMAH is a targeted credit-data integration subject to authorization,
contractual access, and applicable regulatory structure.

### DEC-033 — NHC / TechHub
Status: CONFIRMED — INTEGRATION TARGET

Use a PropertyInventoryProvider abstraction.
NHC/TechHub must not become a hard core-domain dependency.

### DEC-034 — Finance Provider Integration
Status: CONFIRMED

Use FinancingProviderAdapter abstractions for banks/finance companies.

---

## COMMUNICATION & TRACKING

### DEC-035 — Secure In-Platform Communication
Status: CONFIRMED

Support authorized in-platform communication between relevant parties.

### DEC-036 — Preserve Conversation History
Status: CONFIRMED

Lead → Deal conversion must preserve communication history.

### DEC-037 — Deal Tracker
Status: CONFIRMED

Authorized actors receive role-appropriate deal status visibility.

### DEC-038 — Role-Specific Visibility
Status: CONFIRMED

Apply:
- Role-Based
- Tenant-Based
- Relationship-Based
- Purpose-Based
access control.

### DEC-039 — SLA Ownership
Status: CONFIRMED

Critical stages should define:
- Owner
- StartedAt
- ExpectedBy
- CompletedAt
- SLA Status
- Escalation Rule

---

## AUDIT & WORKFLOW

### DEC-040 — Immutable Audit Trail
Status: CONFIRMED

Audit sensitive actions including:
- Permissions
- Consent
- Financing status
- Offer selection
- Reservation
- Financial transactions
- Document access
- Manual override
- Admin intervention

### DEC-041 — Manual Override
Status: CONFIRMED

Sensitive manual overrides require:
Actor + Reason + Before State + After State + Timestamp + Audit Event.

### DEC-042 — Deal Orchestration
Status: CONFIRMED

Deal Orchestration is the central process coordination layer,
but does not own all domain data.

### DEC-043 — Saga / Process Manager
Status: CONFIRMED

Cross-domain and external-system workflows should use a Process Manager / Saga pattern or equivalent.

### DEC-044 — Failure-First Architecture
Status: CONFIRMED

Every critical feature must define failure, retry, duplicate-event,
partial-failure, timeout, expiry, withdrawal, and compensation behavior.

---

## DOCUMENT GOVERNANCE

### DEC-045 — Prototype Authority
Status: CONFIRMED

Prototype is not a source of truth.
It supports UX validation and concept testing only.

### DEC-046 — Legacy Documents
Status: CONFIRMED

Superseded decisions must be marked DEPRECATED rather than silently coexisting as active decisions.

### DEC-047 — Professional MVP Placeholder PDF
Status: REJECTED AS SOURCE

`PropTech_MVP_v1_0_Specification_Professional.pdf` is not a real product specification
and must not be used as a project knowledge source.

### DEC-048 — Feature Completion Standard
Status: CONFIRMED

Product Requirement
→ Business Rules
→ Domain
→ State Machine
→ Permissions
→ Data
→ API
→ UI
→ Automation
→ Audit
→ Metrics
→ QA

### DEC-049 — No Silent Decision Changes
Status: CONFIRMED
Priority: Critical

Conflicting proposals must explicitly identify the current decision,
new evidence, impact, and replacement decision.

### DEC-050 — Current Saudi Regulatory Sources
Status: CONFIRMED

For SAMA, REGA, PDPL/SDAIA, ZATCA, Nafath, SIMAH, NHC,
payments, finance, and real-estate licensing:
verify current official Saudi requirements before implementation decisions.

---

# OPEN DECISIONS

### OPEN-001 — Final SAMA Regulatory Classification
Status: REGULATORY-GATE

### OPEN-002 — Final Bank Employee Incentive Model
Status: REGULATORY-GATE

### OPEN-003 — Buyer ↔ Bank Chat Before or After Reservation
Status: ASSUMPTION / PRODUCT DECISION REQUIRED

Current working assumption:
Developer Chat → Before Reservation
Bank Chat → After Qualified Reservation/Deal Trigger

### OPEN-004 — Reservation Payment vs Reservation Hold
Status: PRODUCT + REGULATORY DECISION REQUIRED

### OPEN-005 — Reservation Hold Duration
Status: BUSINESS RULE REQUIRED

### OPEN-006 — Financing Data Source Per Bank in MVP
Status: ARCHITECTURE DECISION REQUIRED

Options:
API / Manual Employee Entry / Rules Engine / Hybrid

### OPEN-007 — Buyer Selects Banks vs Broadcast to All
Status: PRODUCT DECISION REQUIRED

### OPEN-008 — Objective vs Sponsored Financing Offer Ordering
Status: PRODUCT + COMPLIANCE DECISION REQUIRED

### OPEN-009 — Final Fee Model by Actor
Status: BUSINESS MODEL DECISION REQUIRED

Actors:
Developer / Finance Provider / Buyer / Enterprise Partner

### OPEN-010 — Mobile App vs Responsive Web/PWA for MVP
Status: PRODUCT / COST DECISION REQUIRED

---

# DECISION GOVERNANCE

Every new major decision should include:

- Decision ID
- Title
- Status
- Category
- Decision
- Reason
- Impact
- Dependencies
- Date
- Owner
- Source / Evidence where needed
