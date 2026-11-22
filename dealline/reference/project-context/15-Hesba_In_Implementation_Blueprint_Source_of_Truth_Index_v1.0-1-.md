# HESBA IN — IMPLEMENTATION BLUEPRINT & SOURCE-OF-TRUTH INDEX
Version: 1.0

Purpose: Provide the final execution map for Hesba In: which documents govern which decisions, what must be read first, how conflicts are resolved, what remains open, and the order in which implementation should proceed.

This file is the closing index for the Hesba In Context Engineering Pack.

---

# 1. GOVERNING AUTHORITY ORDER

Use this precedence when documents conflict:

1. Latest explicit founder decision
2. Decision Registry
3. Master Context
4. Business Rules & Invariants
5. Approved ADRs
6. Domain Model
7. State Machines
8. Permissions & Access Control
9. API & Data Contracts
10. Database Schema
11. Workflow & Orchestration
12. QA & Acceptance Criteria
13. PRD & Feature Specification
14. UX / IA / User Flows
15. Legacy documents
16. Prototype

Rules:
- Do not silently overwrite a settled decision.
- If a newer decision supersedes an older one, mark the older item DEPRECATED/SUPERSEDED.
- ASSUMPTION and REGULATORY-GATE are not confirmed facts.
- Screens/prototypes never override domain/compliance decisions.

---

# 2. SOURCE-OF-TRUTH FILE INDEX

## SOT-001 — Master Context
File:
`01_Hesba_In_Master_Context_v2.0.md`

Owns:
- Product mission
- North-star principles
- Operating boundaries
- Architecture principles
- Saudi-market constraints
- Cross-cutting governance

Read first for:
"Why does Hesba In exist?"
"What are the immutable project principles?"

---

## SOT-002 — Decision Registry
File:
`02_Hesba_In_Decision_Registry_v1.0.md`

Owns:
- Explicit decisions
- Decision status
- Confirmed vs assumption vs regulatory gate
- Deprecated decisions
- Open decision references

Read first for:
"Was this already decided?"

---

## SOT-003 — Business Rules & Invariants
File:
`Hesba_In_Business_Rules_Invariants_Registry_v1.0.md`

Owns:
- Enforceable business rules
- Non-negotiable system invariants
- Critical domain constraints

Examples:
- One active reservation per Unit
- One current selected financing offer
- Eligibility ≠ Approval
- Wallet is projection
- Tenant isolation

Read first for:
"Can the system legally/technically allow this behavior?"

---

## SOT-004 — Open Decisions Resolution Register
File:
`Hesba_In_Open_Decisions_Resolution_Register_v1.0.md`

Owns:
- Unresolved founder/product/business/architecture questions
- Required evidence
- Resolution order
- Blocking dependencies

Read first for:
"Why is this feature still conditional/open?"

---

## SOT-005 — Compliance Matrix
File:
`Hesba_In_Compliance_Matrix_v1.0.md`

Owns:
- Regulatory/compliance mapping
- SAMA/REGA/PDPL/ZATCA gates
- Integration/access dependencies
- Sharia-related business guardrails

Read first for:
"Can this feature be activated in Saudi production?"

---

## SOT-006 — ADR Registry
File:
`Hesba_In_ADR_Registry_v1.0.md`

Owns:
- Architecture commitments
- Aggregate boundaries
- Adapter/provider pattern
- Saga/process manager
- Event/projection decisions
- Idempotency and audit principles

Read first for:
"How should this be architected?"

---

## SOT-007 — Domain Model Registry
File:
`Hesba_In_Domain_Model_Registry_v1.0.md`

Owns:
- Bounded contexts
- Aggregate roots
- Domain ownership
- Entity relationships
- Source-of-truth boundaries

Read first for:
"What entity/context owns this data?"

---

## SOT-008 — State Machines Registry
File:
`Hesba_In_State_Machines_Registry_v1.0.md`

Owns:
- Valid lifecycle states
- Legal transitions
- Terminal states
- Forbidden transitions

Read first for:
"Can this object move from state A to state B?"

---

## SOT-009 — Permissions & Access Control Matrix
File:
`Hesba_In_Permissions_Access_Control_Matrix_v1.0.md`

Owns:
- Role access
- Tenant access
- Relationship/purpose controls
- Sensitive field restrictions
- Admin/privileged controls

Read first for:
"Who can see/do this?"

---

## SOT-010 — API & Data Contracts Registry
File:
`Hesba_In_API_Data_Contracts_Registry_v1.0.md`

Owns:
- Conceptual commands/queries
- API boundaries
- Event contracts
- Integration ports
- Error contracts
- Data classifications

Read first for:
"How do services/clients exchange this data?"

---

## SOT-011 — Database Schema Registry
File:
`Hesba_In_Database_Schema_Registry_v1.0.md`

Owns:
- Logical tables
- Keys
- Constraints
- Indexes
- Append-only history rules
- Projection persistence
- Integration inbox/outbox

Read first for:
"How is this represented persistently?"

---

## SOT-012 — Workflow & Orchestration Registry
File:
`Hesba_In_Workflow_Orchestration_Registry_v1.0.md`

Owns:
- End-to-end workflows
- Saga/process coordination
- Retry/compensation
- SLA ownership
- Cross-domain event reactions

Read first for:
"How does the journey execute across domains?"

---

## SOT-013 — QA & Acceptance Criteria Registry
File:
`Hesba_In_QA_Acceptance_Criteria_Registry_v1.0.md`

Owns:
- Definition of Ready
- Definition of Done
- Release blockers
- Concurrency tests
- Security/privacy tests
- Acceptance criteria

Read first for:
"How do we prove this feature is safe and complete?"

---

## SOT-014 — PRD & Feature Specification Registry
File:
`Hesba_In_PRD_Feature_Specification_Registry_v1.0.md`

Owns:
- Feature scope
- MVP/Should/Could
- Actor goals
- Product requirements
- Feature dependencies
- Product metrics

Read first for:
"What are we actually building?"

---

## SOT-015 — UX / IA / User Flows Registry
File:
`Hesba_In_UX_IA_User_Flows_Registry_v1.0.md`

Owns:
- Navigation
- Screen families
- Actor surfaces
- User flows
- UX rules
- UI states

Read first for:
"What should the user see and do?"

---

# 3. REQUIRED READING ORDER BY TASK

## Product change
Read:
Decision Registry
→ Master Context
→ Business Rules
→ Open Decisions
→ Compliance Matrix
→ PRD
→ UX

## Architecture change
Read:
Decision Registry
→ Business Rules
→ ADR
→ Domain Model
→ State Machines
→ API
→ Database
→ Workflow

## Compliance-sensitive change
Read:
Decision Registry
→ Compliance Matrix
→ Open Decisions
→ Business Rules
→ Permissions
→ Workflow
→ PRD

## API/backend feature
Read:
Business Rules
→ Domain Model
→ State Machines
→ Permissions
→ API Contracts
→ Database
→ Workflow
→ QA

## Frontend/UX feature
Read:
PRD
→ UX
→ State Machines
→ Permissions
→ API Contracts
→ QA

## QA/test work
Read:
Business Rules
→ State Machines
→ Permissions
→ API
→ Database
→ Workflow
→ QA

---

# 4. CONFLICT RESOLUTION PROTOCOL

When two documents conflict:

Step 1:
Identify both conflicting statements.

Step 2:
Check whether one is:
- CONFIRMED
- ASSUMPTION
- REGULATORY-GATE
- PROPOSED
- DEPRECATED

Step 3:
Apply authority order.

Step 4:
If conflict remains unresolved:
Do not guess.
Create/open a decision item.

Step 5:
If founder decides:
- update Decision Registry first
- then update affected downstream registries
- mark superseded item DEPRECATED/SUPERSEDED

Never silently reconcile conflict inside implementation.

---

# 5. IMPLEMENTATION PHASE ORDER

## Phase 0 — Decision & Regulatory Closure
Priority:
BLOCKING

Resolve first where required:
- OD-001 SAMA operating boundary
- OD-002 Bank employee incentive model
- OD-004 Reservation paid/free structure
- OD-003 Buyer↔Finance chat trigger
- OD-007 Finance routing model
- OD-008 Offer ordering/ranking
- OD-009 Commercial fee model
- OD-006 Provider integration mode
- OD-005 Reservation duration
- OD-010 Client channel

Not every open item blocks every feature.
Use feature-level dependency mapping.

---

## Phase 1 — Platform Foundation
Build:
- User
- Organization
- Membership
- Roles
- Tenant isolation
- Authentication/authorization
- Audit
- Event/outbox/inbox infrastructure
- Feature flags / regulatory gates
- Observability

Exit criteria:
Tenant security + audit + idempotency foundation verified.

---

## Phase 2 — Real Estate Catalog & Inventory
Build:
- Projects
- Units
- Availability
- Project type
- License metadata
- Inventory adapter boundary
- Reservation constraint foundation

Exit criteria:
Unit source-of-truth stable.

---

## Phase 3 — Lead / CRM / Communication
Build:
- Lead
- Assignment
- Developer Sales Agent CRM
- Buyer↔Developer chat
- Conversation continuity
- SLA/timeline

Exit criteria:
Lead→Deal conversion safe/idempotent.

---

## Phase 4 — Reservation & Deal Core
Build:
- Reservation
- Atomic concurrency controls
- Deal
- Deal state history
- Deal tracker
- Process Manager/Saga

Exit criteria:
Double-booking concurrency suite passes.

---

## Phase 5 — Consent / Documents / Privacy
Build:
- Consent
- Document vault
- Versioning
- Field-level authorization
- DataSubjectRequest
- Sensitive-access audit

Exit criteria:
Cross-tenant/document/privacy P0 tests pass.

---

## Phase 6 — Financing Foundation
Build:
- Calculator
- Decision snapshots
- FinancingApplication
- FinancingOffer
- Parallel financing data model
- EligibilitySummary
- FinancingProviderAdapter

Production routing:
Enable only within approved regulatory boundary.

Exit criteria:
Eligibility ≠ Approval enforced.
Provider isolation verified.

---

## Phase 7 — Offer Comparison & Selection
Build:
- Offer listing/comparison
- explicit selection
- one-selected-offer constraint
- expiry/withdrawal
- replacement history

Ranking/recommendation:
Enable only when OD-008/OD-001 allow.

Exit criteria:
Concurrent offer-selection test passes.

---

## Phase 8 — Finance Workspace
Build:
- Finance employee inbox
- review workspace
- documents
- offer issue
- SLA
- finance organization dashboard
- chat if approved

Exit criteria:
Provider data isolation verified.

---

## Phase 9 — Financial Ledger & Billing Foundation
Build:
- Transaction Ledger
- reversal/adjustment
- Wallet projection
- Subscription
- Invoice
- billing integrations

Employee payout:
Enable only after OD-002.

Exit criteria:
No direct wallet mutation.
Ledger rebuild/reversal tests pass.

---

## Phase 10 — Admin / Support / Operations
Build:
- Operations dashboard
- Deal console
- support/disputes
- integration monitoring
- compliance operations
- privileged-access tooling
- manual intervention via commands

Exit criteria:
No direct DB edit path for operational fixes.

---

## Phase 11 — Conditional Integrations
As approved/available:
- Nafath
- NHC/TechHub
- SIMAH/approved credit data
- Finance provider APIs
- ZATCA e-invoicing
- off-plan/escrow integrations

Use adapters.
Do not inject provider logic into core domain.

---

## Phase 12 — UX Hardening & Scale
Build:
- responsive refinement
- PWA/native if selected
- accessibility
- performance
- analytics
- operational automation
- partner widget
- advanced dashboards

---

# 6. DEFINITION OF IMPLEMENTATION-READY FEATURE

A feature is implementation-ready only if it has:

1. Confirmed purpose
2. Linked PRD
3. Linked Business Rules
4. State machine
5. Domain owner
6. Permissions
7. API/data contract
8. DB representation where needed
9. Workflow
10. Failure behavior
11. Audit requirements
12. Acceptance criteria
13. Compliance classification
14. Open decisions explicitly identified

If any critical item is missing:
Feature remains NOT READY.

---

# 7. CODING EXECUTION RULE

Before any code generation/change, the developer/AI should output:

Feature:
Relevant DEC IDs:
Relevant BR IDs:
Relevant ADR IDs:
Relevant Domain/SM IDs:
Relevant Permission rules:
Relevant API IDs:
Relevant DB constraints:
Relevant Workflow IDs:
Relevant QA criteria:
Compliance status:
Open dependencies:
Conflicts found:

Then implement.

This prevents context drift.

---

# 8. CHANGE IMPACT RULE

Any material change must update all affected downstream artifacts.

Example:
Founder changes reservation from free hold to paid reservation.

Required updates:
Decision Registry
→ Open Decisions
→ Business Rules
→ Compliance Matrix
→ ADR if architecture changes
→ Domain Model
→ State Machine
→ Permissions
→ API
→ DB
→ Workflow
→ QA
→ PRD
→ UX

Do not update only the screen or API.

---

# 9. REGULATORY-GATE EXECUTION RULE

For REGULATORY-GATE behavior:

Allowed before resolution:
- interface design
- provider abstraction
- feature flag
- non-production prototype
- test harness
- placeholder states
- configuration schema

Not allowed:
- production activation
- representing legal permissibility as confirmed
- automated payout/routing/recommendation based only on assumption

For Saudi regulatory matters:
Verify current official requirements before implementation or launch.

---

# 10. PROTOTYPE & LEGACY POLICY

Prototype:
Visual hypothesis only.

Legacy document:
Historical reference only unless promoted into an approved registry.

If prototype conflicts with:
Business Rule / State / Permission / Compliance / Decision

Then:
Prototype is wrong.

Never reverse-engineer settled product logic from old screens.

---

# 11. IMPLEMENTATION PACKAGE STRUCTURE

Recommended project-doc structure:

/00-governance
  Master Context
  Decision Registry
  Open Decisions

/01-compliance
  Compliance Matrix

/02-architecture
  ADR Registry
  Domain Model
  State Machines

/03-security
  Permissions Matrix

/04-contracts
  API & Data Contracts
  Database Schema

/05-workflows
  Workflow & Orchestration

/06-product
  PRD & Feature Specification
  UX / IA / User Flows

/07-quality
  QA & Acceptance Criteria

/08-index
  Implementation Blueprint & Source-of-Truth Index

---

# 12. CURRENT CRITICAL SYSTEM INVARIANTS

The implementation must never violate:

1. One active reservation per Unit.
2. Reservation is concurrency-safe.
3. One Deal may have multiple financing applications.
4. One Deal has at most one current selected financing offer.
5. Eligibility/prequalification is not final approval.
6. Financing decision snapshots are versioned/reproducible.
7. Developer users do not receive raw financing files by default.
8. Transaction Ledger is financial source of truth.
9. Wallet is projection only.
10. Posted financial history is corrected by compensating/reversal entries.
11. Tenant isolation is mandatory.
12. Cross-tenant privileged access is explicit and audited.
13. Consent is auditable and purpose-scoped.
14. External providers use adapters.
15. Critical commands/events are idempotent.
16. Sensitive manual overrides are audited.
17. Hesba In does not assume escrow custody.
18. Regulatory gates override technical convenience.
19. Prototype cannot redefine product truth.
20. Historical decisions are deprecated, not silently erased.

---

# 13. CURRENT BLOCKING / HIGH-RISK OPEN ITEMS

BLOCKING:
OD-001 — Final SAMA classification / operating boundary

HIGH:
OD-002 — Bank employee incentives
OD-003 — Buyer ↔ Finance chat trigger
OD-004 — Paid vs free reservation
OD-005 — Reservation duration
OD-006 — Finance provider integration mode
OD-007 — Finance routing model
OD-008 — Offer ranking/sponsorship
OD-009 — Commercial fee model

MEDIUM:
OD-010 — Native vs Responsive Web/PWA

These items remain unresolved until explicitly decided/evidenced.

---

# 14. FINAL SOURCE-OF-TRUTH BEHAVIOR FOR AI

When asked to propose/build/change Hesba In:

The AI must:
1. Search/read the relevant registry files.
2. Identify settled decisions.
3. Preserve CONFIRMED rules.
4. Flag any conflict.
5. Treat OPEN/REGULATORY-GATE as unresolved.
6. Avoid filling regulatory/legal gaps by assumption.
7. Produce implementation linked to registry IDs.
8. Update downstream documentation if a decision changes.

The AI must not:
- invent founder decisions
- assume regulatory approval
- use prototype as authority
- silently change business model
- silently alter financial/compliance behavior
- merge separate sources of truth
- bypass tenant/data-access controls

---

# 15. FINAL PROJECT READINESS STATUS

Context Engineering Pack:
COMPLETE — Version 1.0 baseline

What is complete:
- Governance
- Decision continuity
- Business invariants
- Open-decision control
- Compliance mapping
- Architecture decisions
- Domain model
- State machines
- Permissions
- API/data contracts
- Database schema
- Workflows
- QA acceptance criteria
- PRD/feature scope
- UX/IA/user flows
- Implementation/source-of-truth index

What is NOT automatically complete:
- Regulatory approvals
- Legal opinions
- Partner contracts
- Production integrations
- Final pricing
- Final design system
- Actual code
- Production QA
- Security penetration testing
- Launch readiness

The pack is now suitable to serve as the governing context layer for product design, engineering planning, AI-assisted implementation, QA, and future decision continuity.

---

# 16. GOVERNANCE CLOSING RULE

This document closes the initial Context Engineering Pack but does not freeze the product.

Future change process:

Founder Decision
→ Decision Registry
→ Impact Analysis
→ Update relevant registries
→ Deprecate superseded decisions
→ Implementation
→ QA
→ Release

Never modify multiple layers silently without updating the decision trail.
