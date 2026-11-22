# PROJECT MASTER CONTEXT — HESBA IN
Version: 2.0
Market: Saudi Arabia

## 1. PRODUCT MISSION

Hesba In is a Saudi PropTech / FinTech-enabled SaaS platform that digitally orchestrates
the property-buying and financing journey between:

- Buyer
- Developer / Property Organization
- Developer Sales Agent
- Bank / Finance Company
- Bank Employee
- Platform Admin
- Super Admin

The platform's primary purpose is to reduce fragmentation, manual handoffs, uncertainty,
duplicated work, and communication friction across the real-estate purchasing and financing journey.

Hesba In is not assumed to be the lender, escrow holder, or regulated financial intermediary
unless explicitly established through the applicable legal/regulatory structure.

## 2. PRODUCT NORTH STAR

Discover
→ Qualify
→ Communicate
→ Reserve
→ Apply
→ Compare
→ Select
→ Contract
→ Complete

Optimize for:

Minimum Buyer Friction
+ Maximum Deal Completion
+ Clear Accountability
+ Partner Adoption
+ Regulatory Safety
+ Data Integrity
+ Scalability

## 3. SOURCE-OF-TRUTH HIERARCHY

When information conflicts, use:

1. Latest explicit founder/user decision
2. Master Context
3. Approved Architecture Decision Records (ADR)
4. Latest approved PRD / Domain Model
5. Older product documentation
6. Prototype / UI implementation

Never resurrect an old decision silently.

## 4. PRIMARY ACTORS

- Buyer
- Developer Organization
- Developer Sales Agent
- Finance Organization
- Bank / Finance Employee
- Platform Admin
- Super Admin

Developer and Bank are organizational capabilities, not necessarily separate base identity entities.

## 5. CORE JOURNEY MODEL

Visitor
→ Lead
→ Qualified Lead
→ Reservation
→ Deal
→ Financing Applications
→ Financing Offers
→ Offer Selection
→ Contract
→ Completion

A user may communicate with the developer sales agent before reservation.
A Lead therefore exists before a Deal.

## 6. CORE PRODUCT CAPABILITIES

- Identity Verification
- KYC readiness
- Consent Management
- Financing Calculator
- Indicative Eligibility
- Property / Project Discovery
- Developer Storefront
- Inventory Management
- Reservation
- Buyer ↔ Developer Communication
- Buyer ↔ Finance Provider Communication
- Parallel Financing Applications
- Financing Offer Comparison
- Document Vault
- Deal Tracker
- SLA Management
- Notifications
- Audit Trail
- Employee Ledger / Wallet Projection
- Developer Dashboard
- Finance Organization Dashboard
- Admin Dashboard
- Partner APIs
- Embeddable Financing Widget

Conditional / regulated capabilities:

- AML / Due Diligence
- Valuation
- Escrow orchestration
- E-contracting
- Payments
- Regulated financing intermediation

These capabilities must activate according to transaction type and regulatory requirements.

## 7. FINANCING PRINCIPLES

One Deal may interact with multiple finance providers in parallel.

One Deal
→ Many Financing Applications / Invitations
→ Many Offers
→ One explicitly selected offer

Eligibility is NOT financing approval.

Calculator outputs and prequalification results must be described as indicative unless issued
or confirmed by an authorized financing entity.

Every financing calculation or eligibility decision must preserve:

- InputsSnapshot
- RuleSetVersion
- CalculatedAt
- OutputSnapshot
- Source
- Expiry

## 8. INVENTORY & RESERVATION INTEGRITY

Unit is the transactional authority for availability.

A Unit may have at most ONE active reservation.

Double booking must be impossible at the domain/data layer, not merely prevented by UI validation.

Reservation operations must be concurrency-safe.

## 9. FINANCIAL LEDGER PRINCIPLES

Transaction Ledger is the financial source of truth.

Wallet / Bonus Ledger shown to users is a read projection, not an independent financial source of truth.

Financial events must be:

- Auditable
- Idempotent
- Traceable
- Reversible through explicit compensating entries
- Append-only where appropriate

Never silently mutate financial history.

Potential employee rewards remain subject to regulatory, contractual, employer-policy,
tax, and Sharia review.

## 10. REVENUE MODEL GUARDRAILS

Do not assume revenue based on a percentage of:

- Loan amount
- Financing principal
- Property value
- Transaction value

as the default commercial model.

Prioritize:

- Fixed platform fees
- SaaS subscriptions
- Usage-based fees
- Integration/API fees
- Fixed transaction service fees
- Advertising
- Premium analytics
- Enterprise services

Any percentage-based commission requires explicit:

- Business review
- Saudi regulatory review
- Sharia review
- Tax/accounting review

before adoption.

## 11. SAUDI REGULATORY GATE

For any feature involving:

- Financing application routing
- Matching customers with finance providers
- Financial eligibility
- Offer comparison
- Offer recommendation/ranking
- Forwarding customer financial information
- Digital financing brokerage
- Payments
- Employee financing incentives

do not assume regulatory permissibility.

Verify current requirements from the appropriate Saudi authority.

SAMA status of Hesba In's financing-intermediation activities must be treated as a formal Decision Gate until resolved.

## 12. REAL ESTATE REGULATORY MODEL

Differentiate:

- Ready Property
- Off-plan Property
- Other future transaction types

Do not apply off-plan requirements universally.

Where off-plan regulation applies, model required project licensing and escrow-related states.

Hesba In may orchestrate and track escrow references and events without assuming custody
or ownership of escrow funds.

## 13. PRIVACY & DATA GOVERNANCE

Privacy is a platform invariant, not a feature.

For sensitive data define:

Purpose
→ Legal Basis
→ Owner
→ Recipient
→ Consent where applicable
→ Retention
→ Deletion / Restriction
→ Auditability

Consent must be purpose-specific and auditable.

Implement data minimization.

Do not expose detailed financing records to developers unless explicitly permitted.

Developer-facing financing information should be provided through an approved
Eligibility Summary / Projection, not raw financing records.

## 14. MULTI-TENANCY

MVP:

Organization acts as the primary tenant boundary.

However, do not hard-code Organization == Tenant permanently.

Architecture must permit future hierarchy such as:

Tenant
→ Organization
→ Business Unit
→ Branch
→ Team / Project / SPV

All queries, files, conversations, events, and analytics must preserve tenant isolation.

## 15. AI DATA GOVERNANCE

Tenant data must never be used to train or improve models for competing tenants
without an approved governance basis.

No cross-tenant leakage.

AI outputs are advisory unless a workflow explicitly authorizes automated action.

Sensitive decisions must remain explainable and auditable.

## 16. INTEGRATION ARCHITECTURE

Integrations must be modeled as providers/adapters, not embedded permanently in core domain logic.

Examples:

IdentityVerificationProvider
- Nafath
- Future provider

PropertyInventoryProvider
- Hesba Native
- Developer API
- NHC / TechHub
- Batch Import

CreditDataProvider
- SIMAH
- Future approved provider

FinancingProviderAdapter
- Bank A
- Bank B
- Finance Company C

## 17. ARCHITECTURE PRINCIPLES

- Multi-tenant by design
- API-first where appropriate
- Event-driven for cross-domain processes
- Idempotent critical operations
- Immutable audit trail
- Least privilege
- Separation of duties
- Explicit state machines
- Point-in-time decision snapshots
- No hidden financial mutation
- No cross-domain shortcut that bypasses ownership

Deal Orchestration acts as the process coordinator.

Use Saga / Process Manager patterns where workflows span multiple aggregates or external systems.

## 18. FEATURE DESIGN FRAMEWORK

Every feature must be analyzed through:

Actor
→ Trigger
→ Preconditions
→ Workflow
→ State transitions
→ Data
→ Permissions
→ Integrations
→ Failure cases
→ Concurrency
→ Compliance
→ Audit
→ Notifications
→ SLA
→ Metrics

Then evaluate:

User Value
× Business Value
× Compliance Risk
× Complexity
× Cost
× Scalability
× Dependency Risk

Classify:

Must / Should / Could / Later

## 19. FAILURE-FIRST DESIGN

Do not design only the happy path.

For every critical workflow consider:

- Timeout
- Duplicate request
- Partial failure
- External API unavailable
- User abandons flow
- Bank does not respond
- Developer does not respond
- Reservation expires
- Document rejected
- Offer expires
- Consent withdrawn
- Integration returns conflicting data
- Payment fails
- Concurrent reservation
- Manual override
- Dispute

Define recovery and audit behavior.

## 20. PRODUCT OUTPUT STANDARD

Every approved product design should be transformable into:

PRD
→ Domain Model
→ User Stories
→ Acceptance Criteria
→ State Machines
→ Database
→ APIs
→ Permissions
→ UI
→ Automation
→ Observability
→ QA Tests

No feature is considered fully designed if it exists only as a UI description.

## 21. DECISION STATUS SYSTEM

Every major product decision should carry one status:

- CONFIRMED
- ASSUMPTION
- REGULATORY-GATE
- EXPERIMENT
- DEPRECATED
- REJECTED

Never present an assumption as a confirmed decision.

## 22. CONTINUITY RULE

Before proposing a major change:

1. Check existing project decisions.
2. If the proposal contradicts an approved decision, identify the conflict.
3. Explain why new evidence justifies reconsideration.
4. Show impact.
5. Record the new decision.
6. Mark the previous decision as superseded/deprecated where applicable.

Never silently reopen settled decisions.
