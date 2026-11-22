# HESBA IN — QA & ACCEPTANCE CRITERIA REGISTRY
Version: 1.0

Purpose: Define the minimum quality, acceptance, regression, security, compliance, and failure-path criteria required before a Hesba In feature or workflow can be considered implementation-ready or release-ready.

This registry is governed by the Master Context, Decision Registry, Business Rules, Open Decisions, Compliance Matrix, ADR Registry, Domain Model, State Machines, Permissions Matrix, API/Data Contracts, Database Schema, and Workflow Registry.

---

# 1. QUALITY GATES

A feature is NOT complete because:
- the UI works,
- the API returns 200,
- the happy path passes,
- or the prototype looks correct.

A critical feature is complete only when the following are defined and tested:

Business Rule
→ State Machine
→ Permissions
→ Data Model
→ API Contract
→ Failure Cases
→ Audit
→ Metrics
→ Acceptance Criteria
→ Regression Tests

---

# 2. TEST LEVELS

## QA-L1 — Unit / Domain Tests
Validate:
- business rules
- invariants
- state transitions
- calculations
- authorization policies
- idempotency logic

## QA-L2 — Database Constraint Tests
Validate:
- unique/partial constraints
- foreign-key integrity
- tenant scoping
- concurrency guarantees
- append-only financial/audit behavior

## QA-L3 — API Contract Tests
Validate:
- request/response schemas
- authorization
- validation
- error contracts
- idempotency
- version compatibility

## QA-L4 — Integration Tests
Validate:
- provider adapters
- callbacks/webhooks
- retries
- timeouts
- reconciliation
- degraded provider behavior

## QA-L5 — Workflow / Saga Tests
Validate:
- cross-domain orchestration
- event sequencing
- compensation
- partial failure
- recovery
- duplicate delivery

## QA-L6 — End-to-End Tests
Validate:
real actor journeys across frontend + backend + integrations.

## QA-L7 — Security / Privacy Tests
Validate:
- tenant isolation
- field-level authorization
- sensitive-document access
- privilege escalation
- consent enforcement
- cross-tenant access controls

## QA-L8 — Compliance Acceptance
Validate:
implementation stays within the approved compliance/regulatory operating boundary.

REGULATORY-GATE items cannot pass this gate until formally resolved.

---

# 3. RELEASE SEVERITY

## P0 — Release Blocker
Examples:
- double booking
- cross-tenant data leak
- duplicate financial effect
- unauthorized financing-data exposure
- broken audit trail
- regulatory-gated feature enabled without approval

Release:
PROHIBITED.

## P1 — Critical
Examples:
- incorrect financing state
- incorrect selected offer
- lost document/history
- broken consent enforcement
- unrecoverable workflow failure

Release:
Requires fix before production unless formally risk-accepted by authorized owner.

## P2 — Major
Material functionality degraded but safe workaround exists.

## P3 — Minor
Low-risk defect with limited operational impact.

---

# 4. AC-001 — UNIT RESERVATION INTEGRITY

Related:
BR-001, BR-002
ADR-001
SM-002, SM-003
WF-003
DB-C-001

Acceptance Criteria:

AC-001.1
Given Unit = AVAILABLE,
when one valid reservation command succeeds,
then Unit becomes reserved/held according to policy
and exactly one active Reservation exists.

AC-001.2
Given two concurrent valid reservation requests for the same Unit,
when both execute,
then only one may succeed.

Expected:
- one successful reservation
- one domain conflict
- never two active reservations

AC-001.3
Retrying the same reservation command with the same Idempotency-Key
must not create a second Reservation.

AC-001.4
If reservation persistence fails before commit,
Unit must remain AVAILABLE.

AC-001.5
If notification fails after reservation commit,
Reservation remains valid and notification retries independently.

AC-001.6
Expired/released Reservation must restore Unit availability atomically when policy permits.

Release severity if failed:
P0.

---

# 5. AC-002 — LEAD → DEAL CONVERSION

Related:
SM-001
WF-001, WF-002

Acceptance Criteria:

AC-002.1
Qualified Lead can be converted exactly once idempotently.

AC-002.2
Conversion preserves:
- buyer identity/reference
- project/unit interest context
- assigned organization context
- authorized ChatThread history

AC-002.3
Repeated conversion request must return existing Deal or safe idempotent result.

AC-002.4
If Deal creation fails, Lead must not be falsely marked CONVERTED.

AC-002.5
LOST Lead cannot silently convert without approved reopen path.

---

# 6. AC-003 — FINANCING APPLICATION

Related:
BR-008 to BR-013
SM-005
WF-005, WF-006

Acceptance Criteria:

AC-003.1
FinancingApplication references Deal, not an independent competing Unit truth.

AC-003.2
Application transitions only through valid state-machine transitions.

AC-003.3
PREQUALIFIED must be rendered/stored distinctly from APPROVED.

AC-003.4
Decision output preserves:
- InputsSnapshot
- RuleSetVersion
- OutputSnapshot
- CalculatedAt
- Source
- Expiry where applicable

AC-003.5
Finance provider may only access applications in its authorized scope.

AC-003.6
Developer-side users must not receive raw FinancingApplication data by default.

AC-003.7
Routing/intermediation flows remain disabled until relevant regulatory gate is approved.

Failed regulatory boundary:
P0.

---

# 7. AC-004 — PARALLEL FINANCING

Acceptance Criteria:

AC-004.1
One Deal can safely maintain multiple FinancingApplications.

AC-004.2
Each Finance Organization sees only its own provider application/offer scope.

AC-004.3
Provider A cannot retrieve Provider B's internal application or offer by changing an identifier.

AC-004.4
Parallel applications do not change Deal.Unit truth.

AC-004.5
Failure of one provider does not corrupt another provider's application.

---

# 8. AC-005 — OFFER SELECTION

Related:
SM-006
WF-008
DB-C-002

Acceptance Criteria:

AC-005.1
Only valid ISSUED, non-expired offer may be selected.

AC-005.2
One Deal may have at most one current SELECTED offer.

AC-005.3
Two concurrent selection requests cannot result in two selected offers.

AC-005.4
Selection emits FinancingOfferSelected exactly once economically.

AC-005.5
Previous selection replacement must be explicit and historically preserved.

AC-005.6
DRAFT, EXPIRED, WITHDRAWN offers cannot be selected.

Failure:
P0/P1 depending data exposure/economic impact.

---

# 9. AC-006 — FINANCING DATA PRIVACY

Related:
BR-014, BR-015
ADR-012
Permissions Matrix

Acceptance Criteria:

AC-006.1
Developer Sales Agent receives only EligibilitySummary/approved projection.

AC-006.2
Developer Organization Admin cannot access raw:
- income
- obligations
- credit data
- bank statements
- finance-provider internal notes
unless separately authorized by an approved policy.

AC-006.3
Finance Provider cannot access competitor records.

AC-006.4
Changing URL/API resource IDs must not bypass authorization.

AC-006.5
Field-level security must apply in backend/API serializer, not frontend only.

Failure:
P0.

---

# 10. AC-007 — TENANT ISOLATION

Related:
BR-019, BR-020
ADR-005, ADR-006

Required adversarial tests:

AC-007.1
User from Tenant A requests Tenant B Deal ID → DENY.

AC-007.2
Tenant A attempts Tenant B document download → DENY.

AC-007.3
Tenant A changes organizationId in request → server resolves authorization independently.

AC-007.4
Search/list endpoints cannot leak Tenant B records.

AC-007.5
Analytics/projections do not mix tenants.

AC-007.6
Platform privileged cross-tenant access produces privileged-access audit record.

Failure:
P0.

---

# 11. AC-008 — CONSENT & PURPOSE CONTROL

Acceptance Criteria:

AC-008.1
Consent record preserves Purpose, DataScope, Recipient, NoticeVersion, timestamps.

AC-008.2
Revocation does not delete historical evidence.

AC-008.3
Where withdrawal applies, future governed sharing is blocked after revocation.

AC-008.4
Revoked consent cannot become ACTIVE without a new grant event.

AC-008.5
Lawful-retention exceptions are handled as restricted retention, not silent access.

AC-008.6
Consent and KYC must not be treated as the same concept.

---

# 12. AC-009 — DOCUMENT SECURITY & VERSIONING

Acceptance Criteria:

AC-009.1
Document access requires document-specific authorization.

AC-009.2
Seeing a Deal alone does not automatically authorize all documents.

AC-009.3
Rejected/replaced document retains version lineage.

AC-009.4
New version does not overwrite previous immutable version metadata.

AC-009.5
Sensitive document access is auditable.

AC-009.6
Unauthorized guessed document ID → DENY.

---

# 13. AC-010 — FINANCIAL LEDGER

Related:
BR-021 to BR-024
ADR-003
SM-017
WF-013

Acceptance Criteria:

AC-010.1
POSTED Transaction cannot be silently edited/deleted.

AC-010.2
Correction creates reversal/adjustment/compensating entry.

AC-010.3
Retry with same Idempotency-Key produces no duplicate economic effect.

AC-010.4
Wallet projection can be rebuilt from ledger history.

AC-010.5
Projection failure does not alter authoritative ledger result.

AC-010.6
No API permits direct arbitrary Wallet balance mutation.

Failure:
P0.

---

# 14. AC-011 — AUDIT TRAIL

Acceptance Criteria:

Critical actions must capture sufficient evidence including:
Actor
Action
Resource
Timestamp
Reason/Purpose where applicable
BeforeState
AfterState
CorrelationId

Must audit at minimum:
- role/permission changes
- privileged cross-tenant access
- consent
- reservation
- financing transitions
- offer selection
- document access where sensitive
- financial operations
- manual overrides
- admin interventions

AC-011.1
Normal user cannot modify/delete audit record.

AC-011.2
Manual override without required reason/evidence is rejected.

---

# 15. AC-012 — EXTERNAL CALLBACK IDEMPOTENCY

Related:
WF-016
DB integration_events_inbox

Acceptance Criteria:

AC-012.1
Same provider + external_event_id delivered multiple times creates one business effect.

AC-012.2
Malformed/unverified callback cannot mutate domain state.

AC-012.3
Unknown timeout state triggers reconciliation before dangerous resubmission.

AC-012.4
Provider outage does not corrupt internal source-of-truth state.

AC-012.5
Failed callback processing remains retryable/observable.

---

# 16. AC-013 — INVENTORY SYNC

Acceptance Criteria:

AC-013.1
External sync cannot silently overwrite active reservation integrity.

AC-013.2
Stale external availability must be detected/reconciled.

AC-013.3
External IDs map to stable internal entities.

AC-013.4
Duplicate sync event is safe.

AC-013.5
Material inventory state changes are auditable.

---

# 17. AC-014 — CHAT AUTHORIZATION

Acceptance Criteria:

AC-014.1
Only authorized thread participants may send/read messages.

AC-014.2
Lead → Deal conversion preserves authorized history.

AC-014.3
Closed/restricted thread behavior follows state machine.

AC-014.4
Buyer ↔ Finance Employee chat remains disabled/conditional until OD-003 is resolved.

AC-014.5
User cannot access another thread through guessed ID.

---

# 18. AC-015 — SUPPORT / DISPUTE

Acceptance Criteria:

AC-015.1
Ticket state transitions follow SM-012.

AC-015.2
Resolution affecting Deal or financial state must use explicit domain command.

AC-015.3
Support agent cannot directly mutate authoritative DB state as shortcut.

AC-015.4
Closed ticket reopens only through authorized transition.

AC-015.5
Resolution and evidence remain auditable.

---

# 19. AC-016 — REGULATORY-GATE ENFORCEMENT

Acceptance Criteria:

AC-016.1
Feature flag/configuration prevents unauthorized production activation of gated features.

Gated examples:
- unresolved SAMA intermediation/routing behavior
- bank employee cash/equivalent incentives
- unresolved paid reservation structure
- unauthorized SIMAH access
- unresolved sensitive finance recommendation/ranking behavior

AC-016.2
Admin/Super Admin permission alone cannot bypass regulatory gate.

AC-016.3
UI visibility does not constitute regulatory approval.

Failure:
P0.

---

# 20. AC-017 — OFF-PLAN / ESCROW

Status: CONDITIONAL

Acceptance Criteria:

AC-017.1
Project type determines whether escrow/license controls apply.

AC-017.2
Ready property workflow does not incorrectly require off-plan controls.

AC-017.3
Off-plan regulated workflow validates required project/license/escrow metadata before applicable actions.

AC-017.4
Hesba In system never represents itself as escrow-fund custodian unless separately approved.

AC-017.5
External escrow status/reference does not become internally invented payment truth.

---

# 21. AC-018 — BILLING / INVOICE

Status: CONDITIONAL

Acceptance Criteria:

AC-018.1
Issued invoice history is not silently overwritten.

AC-018.2
Corrections use proper adjustment/credit/debit workflow where applicable.

AC-018.3
PDF-only generation is not labelled compliant e-invoicing unless applicable ZATCA requirements are actually satisfied.

AC-018.4
Subscription suspension does not erase historical Deal/customer/audit records.

---

# 22. AC-019 — SLA / ESCALATION

Acceptance Criteria:

Every critical SLA record must support:
Owner
StartedAt
ExpectedBy
CompletedAt
Status
EscalationLevel

AC-019.1
Overdue SLA triggers configured escalation behavior.

AC-019.2
Duplicate escalation execution is idempotent.

AC-019.3
SLA projection can be rebuilt/reconciled from authoritative workflow events.

AC-019.4
Exact SLA durations remain configurable unless separately confirmed.

---

# 23. AC-020 — FAILURE-FIRST REQUIREMENTS

Every critical workflow must have tests for:

- validation failure
- permission denial
- duplicate request
- concurrency conflict
- timeout
- external provider outage
- malformed callback
- partial failure
- retry
- compensation/reversal
- expired state
- user abandonment where relevant
- manual intervention
- cross-tenant attack attempt

A feature missing relevant failure-path tests is not production-ready.

---

# 24. SECURITY TEST SUITE — MINIMUM

Required:
1. Broken Object Level Authorization tests
2. Broken Function Level Authorization tests
3. Cross-tenant enumeration tests
4. Sensitive-field response leakage tests
5. Privilege escalation tests
6. Document access bypass tests
7. Replay/idempotency abuse tests
8. Rate/abuse protection tests where relevant
9. Session/token invalidation tests
10. Admin privileged-access audit tests

---

# 25. CONCURRENCY TEST SUITE — MINIMUM

Must simulate:

C-001
Two buyers reserve same Unit simultaneously.

Expected:
1 winner, 1 safe conflict.

C-002
Two selection requests choose different offers simultaneously.

Expected:
Exactly 1 current selected offer.

C-003
Same financial command sent concurrently with same Idempotency-Key.

Expected:
One economic effect.

C-004
Duplicate provider webhook arrives concurrently.

Expected:
One business effect.

---

# 26. DATA INTEGRITY TEST SUITE

Verify periodically:

- no Unit with >1 active reservation
- no Deal with >1 current selected offer
- no orphan FinancingApplication without valid Deal
- no Wallet projection inconsistent with ledger beyond defined projection lag
- no cross-tenant ownership mismatch
- no document version lineage gaps
- no duplicate external-event processing
- no missing critical audit event for sensitive transitions

Violations should generate operational alerts.

---

# 27. OBSERVABILITY ACCEPTANCE

Every critical workflow should expose:

Metrics:
success_count
failure_count
latency
retry_count
timeout_count
conflict_count
manual_override_count

Structured logs:
correlationId
workflow/process
aggregateId
tenant context where permitted
provider
result/error code

Tracing:
Recommended for cross-service/integration workflows.

Never log unnecessary sensitive personal/financial payloads.

---

# 28. QA OPEN ITEMS

QA-OPEN-001
Final SAMA operating-boundary acceptance tests.
Depends on OD-001.

QA-OPEN-002
Finance employee incentive payout tests.
Depends on OD-002.

QA-OPEN-003
Buyer ↔ Finance chat activation tests.
Depends on OD-003.

QA-OPEN-004
Paid/free reservation payment acceptance tests.
Depends on OD-004.

QA-OPEN-005
Reservation duration/extension acceptance tests.
Depends on OD-005.

QA-OPEN-006
Provider-specific integration contract tests.
Depends on OD-006.

QA-OPEN-007
Finance routing tests.
Depends on OD-007.

QA-OPEN-008
Offer ranking/sponsored placement tests.
Depends on OD-008.

QA-OPEN-009
Final commercial billing tests.
Depends on OD-009.

QA-OPEN-010
Native/PWA-specific client acceptance tests.
Depends on OD-010.

---

# 29. DEFINITION OF READY

A feature may enter implementation when:

- product purpose is clear
- relevant decisions are CONFIRMED or explicitly gated
- business rules are linked
- state machine exists
- data/domain ownership exists
- permissions exist
- API/data contract exists
- workflow exists
- failure paths are defined
- acceptance criteria exist
- unresolved regulatory gates are identified

---

# 30. DEFINITION OF DONE

A critical feature is DONE only when:

1. Code implemented.
2. Domain/unit tests pass.
3. DB constraints tested.
4. API contract tests pass.
5. Permission/security tests pass.
6. Workflow failure/retry tests pass.
7. Audit verified.
8. Metrics/logging verified.
9. Acceptance criteria pass.
10. No unresolved P0/P1 defects.
11. Regulatory/compliance gates satisfied where required.
12. Documentation/source registries updated.

---

# 31. QA GOVERNANCE

When a decision, rule, state, permission, API, schema, or workflow changes:

1. Identify affected QA acceptance criteria.
2. Update/add regression cases.
3. Preserve deprecated behavior history where materially relevant.
4. Re-run impacted integration/E2E/security suites.
5. Do not accept UI-only testing for backend/domain invariants.
6. Never mark a REGULATORY-GATE feature production-ready without the required approval evidence.
