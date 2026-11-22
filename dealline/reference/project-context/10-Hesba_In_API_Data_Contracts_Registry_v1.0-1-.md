# HESBA IN — API & DATA CONTRACTS REGISTRY
Version: 1.0

Purpose: Define the approved conceptual API boundaries, commands, queries, events, and data-contract rules for Hesba In.
This registry is implementation-facing but remains technology-agnostic.

## Global Contract Rules

1. All protected API access must enforce server-side authorization.
2. Every tenant-scoped request must resolve Tenant/Organization context explicitly.
3. Critical commands must support idempotency.
4. CorrelationId / RequestId should be propagated across cross-domain workflows.
5. APIs must not expose fields merely because they exist in storage.
6. Developer-facing financing APIs return approved projections, not raw financing records.
7. External providers are accessed through adapters/providers.
8. REGULATORY-GATE endpoints may exist as interfaces/stubs but must not be production-enabled before resolution.
9. API versioning must support backward-compatible evolution.
10. Sensitive mutations must generate audit evidence.

Recommended common headers/context:
- Authorization
- X-Request-Id
- X-Correlation-Id
- Idempotency-Key for critical commands
- Tenant/Organization context derived securely, not trusted blindly from client input

---

# 1. IDENTITY & USER API

## API-001 — Get Current User
GET /v1/me

Returns:
UserId
DisplayName
Role(s)
OrganizationMemberships
AllowedCapabilities

Do not return unnecessary sensitive identity attributes.

## API-002 — Identity Verification Session
POST /v1/identity-verifications

Status: INTEGRATION DEPENDENT

Request:
provider
purpose

Response:
verificationId
provider
status
expiresAt
nextAction

Provider:
IdentityVerificationProvider

Rule:
Do not hard-code Nafath-specific fields into core user contract.

## API-003 — Identity Verification Result
GET /v1/identity-verifications/{verificationId}

Authorization:
Subject + approved operational/compliance actors only.

---

# 2. ORGANIZATION API

## API-010 — Organization Profile
GET /v1/organizations/{organizationId}

Tenant rules:
Caller must have permitted relationship unless information is public.

## API-011 — Organization Members
GET /v1/organizations/{organizationId}/members
POST /v1/organizations/{organizationId}/members

Authorization:
Organization Admin or privileged platform role.

Rule:
Organization Admin cannot grant Platform Admin/Super Admin.

---

# 3. PROJECT & INVENTORY API

## API-020 — Projects
GET /v1/projects
GET /v1/projects/{projectId}
POST /v1/projects
PATCH /v1/projects/{projectId}

Fields should include:
projectId
organizationId
projectType
status
publicMetadata
licenseSummary where applicable

## API-021 — Units
GET /v1/projects/{projectId}/units
GET /v1/units/{unitId}
POST /v1/projects/{projectId}/units
PATCH /v1/units/{unitId}

Core fields:
unitId
projectId
availabilityStatus
public/commercial attributes
version/concurrency token where used

Rule:
Do not allow arbitrary API mutation to bypass reservation integrity.

---

# 4. RESERVATION API

## API-030 — Create Reservation
POST /v1/units/{unitId}/reservations

Status: PARTIALLY CONFIRMED

Required:
Idempotency-Key

Request conceptual fields:
reservationPolicyVersion
buyerContext
paymentReference only if future policy permits

Response:
reservationId
unitId
status
holdStartedAt
expiresAt where applicable
dealId if created/linked

Hard invariant:
At most one active reservation per Unit.

Conflict:
If Unit already actively reserved, return a domain conflict such as HTTP 409.

## API-031 — Get Reservation
GET /v1/reservations/{reservationId}

## API-032 — Cancel / Release Reservation
POST /v1/reservations/{reservationId}/cancel
POST /v1/reservations/{reservationId}/release

Must:
Validate state + authority + project policy.
Audit transition.

## API-033 — Extend Reservation
POST /v1/reservations/{reservationId}/extend

Status: OPEN
Depends on OD-005.

Do not production-enable before extension policy is confirmed.

---

# 5. LEAD / CRM API

## API-040 — Create Lead
POST /v1/leads

Request:
buyerId or authenticated buyer
projectId and/or unitInterest
source
initialMessage optional

Response:
leadId
status
assignedAgentId if assigned

## API-041 — List / Get Leads
GET /v1/leads
GET /v1/leads/{leadId}

Scope:
Buyer own leads
Assigned developer sales actors
Developer organization authorized actors

## API-042 — Lead State Transition
POST /v1/leads/{leadId}/transitions

Request:
targetState
reason optional

Must enforce State Machine SM-001.

## API-043 — Convert Lead to Deal
POST /v1/leads/{leadId}/convert

Required:
Idempotency-Key

Result:
dealId
conversation continuity preserved.

---

# 6. DEAL API

## API-050 — Get Deal
GET /v1/deals/{dealId}

Response must be role-projected.

Buyer, Developer, Finance Provider, Admin may receive different fields.

## API-051 — Deal Timeline
GET /v1/deals/{dealId}/timeline

Projection only.
Source:
Deal/process/audit events.

## API-052 — Deal Transition
POST /v1/deals/{dealId}/transitions

Restricted:
Only authorized workflow actors/system.
Must enforce state machine.

Rule:
Do not expose a generic unrestricted "set status" endpoint.

---

# 7. FINANCING API

Status:
Core contracts confirmed conceptually; regulated routing/recommendation behavior remains subject to OD-001.

## API-060 — Create Financing Application
POST /v1/deals/{dealId}/financing-applications

Required:
Idempotency-Key

Request:
financeProviderId where routing model permits
consentReference / authorization context where required
decision-input snapshot reference

Response:
financingApplicationId
providerId
status
submittedAt

Rule:
FinancingApplication derives Unit context through Deal.

## API-061 — List Financing Applications
GET /v1/deals/{dealId}/financing-applications

Buyer:
Own applications.

Developer:
Do NOT return raw financing applications; use EligibilitySummary.

Finance Provider:
Only own provider applications.

## API-062 — Financing Application Detail
GET /v1/financing-applications/{applicationId}

Field-level projection required.

## API-063 — Financing Application Transition
POST /v1/financing-applications/{applicationId}/transitions

Request:
targetState
reason
providerDecisionReference where applicable

Must preserve decision snapshot/version.

## API-064 — Request Financing Documents
POST /v1/financing-applications/{applicationId}/document-requests

Authorization:
Authorized finance-provider actor/system.

---

# 8. FINANCING OFFER API

## API-070 — Create / Issue Offer
POST /v1/financing-applications/{applicationId}/offers

Authorization:
Authorized finance provider.

Core fields:
offerId
applicationId
providerId
status
monthlyPayment
term
downPayment
fees
totalCost or equivalent approved comparison fields
conditions
issuedAt
expiresAt
source
ruleSetVersion / provider reference where applicable

Note:
Exact commercial/financial display fields must follow final compliance/product rules.

## API-071 — List Buyer Offers
GET /v1/deals/{dealId}/financing-offers

Buyer:
May view own authorized offers.

Developer:
No raw offer details by default.

## API-072 — Select Financing Offer
POST /v1/financing-offers/{offerId}/select

Required:
Idempotency-Key

Must:
- Verify offer valid/ISSUED
- Verify buyer/authorized actor
- Ensure no competing current SELECTED offer
- Emit FinancingOfferSelected
- Update Deal orchestration
- Audit selection

## API-073 — Replace Selected Offer
POST /v1/financing-offers/{offerId}/replace-selected

Restricted:
Explicit workflow only.
Must preserve previous selection history.

---

# 9. ELIGIBILITY / CALCULATOR API

## API-080 — Financing Calculation
POST /v1/financing-calculations

Request conceptual:
income inputs
obligations inputs
property/deal context where permitted
provider/rule context

Response:
calculationId
indicativeResult
monthlyPaymentEstimate
downPaymentEstimate
ruleSetVersion
calculatedAt
expiresAt
disclaimer/status

Rule:
Response MUST NOT represent final approval.

## API-081 — Eligibility Summary
GET /v1/deals/{dealId}/eligibility-summary

Projection:
Minimal approved financing status for developer-side actors.

Do not include:
raw income
credit obligations
credit report
provider internal risk notes
detailed financing file unless separately authorized.

---

# 10. CONSENT & PRIVACY API

## API-090 — Create / Grant Consent
POST /v1/consents

Request:
purpose
dataScope
recipient
noticeVersion
legalBasis where applicable

Response:
consentId
status
grantedAt

## API-091 — Revoke Consent
POST /v1/consents/{consentId}/revoke

Must:
- be auditable
- affect future governed sharing/access where applicable
- preserve legal retention rules

## API-092 — Get Consent
GET /v1/consents/{consentId}

Field visibility restricted by subject/purpose/authorized compliance actors.

## API-093 — Data Subject Request
POST /v1/data-subject-requests
GET /v1/data-subject-requests/{requestId}

Types:
access
correction
deletion/restriction where applicable

---

# 11. DOCUMENT API

## API-100 — Upload Document
POST /v1/documents

Request metadata:
documentType
contextType
contextId
purpose

Response:
documentId
version
status

Rule:
File access must be checked independently of Deal visibility.

## API-101 — Download/View Document
GET /v1/documents/{documentId}

Authorization:
Tenant + relationship + purpose + document type + consent/legal-basis where applicable.

Sensitive access should be audited.

## API-102 — Replace Document
POST /v1/documents/{documentId}/versions

Must preserve lineage/history.

## API-103 — Review Document
POST /v1/documents/{documentId}/review

Request:
decision ACCEPTED/REJECTED
reason

Authorization:
Authorized reviewer only.

---

# 12. CHAT API

## API-110 — Create/Get Chat Thread
POST /v1/chat-threads
GET /v1/chat-threads/{threadId}

Context:
Lead or Deal.

Rule:
Lead-to-Deal conversion preserves history.

## API-111 — Send Message
POST /v1/chat-threads/{threadId}/messages

Authorization:
Relationship/purpose/state based.

Buyer ↔ Finance Employee activation:
OPEN / depends on OD-003.

## API-112 — List Messages
GET /v1/chat-threads/{threadId}/messages

Must enforce participant authorization and tenant boundary.

---

# 13. SUPPORT / DISPUTE API

## API-120 — Create Support Ticket
POST /v1/support-tickets

## API-121 — Get / List Tickets
GET /v1/support-tickets/{ticketId}
GET /v1/support-tickets

## API-122 — Ticket Transition
POST /v1/support-tickets/{ticketId}/transitions

If resolution affects Deal/financial state:
Must create explicit downstream command/event + audit record.

---

# 14. FINANCIAL LEDGER API

## API-130 — Query Relevant Transactions
GET /v1/transactions

Highly restricted.

Buyer:
Only own relevant entries where applicable.

Organization:
Only own billing/authorized financial entries.

Admin:
Purpose-bound privileged access.

## API-131 — Post Financial Transaction
POST /v1/internal/transactions

Internal/privileged service boundary only.

Required:
Idempotency-Key
transactionType
amount/currency where applicable
subject/reference
correlationId
reason/source

Rule:
No ordinary UI actor directly edits ledger entries.

## API-132 — Reverse / Adjust Transaction
POST /v1/internal/transactions/{transactionId}/reverse
POST /v1/internal/transactions/{transactionId}/adjustments

Must:
Create new compensating records.
Never silently edit posted history.

## API-133 — Wallet Projection
GET /v1/wallet

Projection only.
Source: Transaction Ledger.

---

# 15. BILLING API

## API-140 — Subscription
GET /v1/organizations/{organizationId}/subscription
POST /v1/organizations/{organizationId}/subscription

Commercial behavior subject to final business model.

## API-141 — Invoices
GET /v1/invoices
GET /v1/invoices/{invoiceId}

Creation/integration behavior:
Subject to applicable ZATCA configuration.

Do not define PDF generation as equivalent to compliant e-invoicing.

---

# 16. LICENSE / COMPLIANCE API

## API-150 — Licenses
GET /v1/licenses
POST /v1/licenses
PATCH /v1/licenses/{licenseId}

Scopes:
Organization
Project
Actor where applicable

## API-151 — KYC / AML Check
POST /v1/financing-applications/{applicationId}/compliance-checks
GET /v1/compliance-checks/{checkId}

Status:
REGULATORY-GATE / provider-access dependent.

## API-152 — Valuation
POST /v1/financing-applications/{applicationId}/valuations
GET /v1/valuations/{valuationId}

---

# 17. ESCROW TRACKING API

## API-160 — Escrow Reference
GET /v1/projects/{projectId}/escrow
GET /v1/deals/{dealId}/escrow-status

Status:
CONDITIONAL.

Response may include:
escrowReference
status
paymentReferences
milestones

Rule:
This is tracking/reference data.
It must not imply Hesba In custody of funds.

Any payment-writing endpoint remains OPEN until OD-004 / compliance gates are resolved.

---

# 18. INTEGRATION CONTRACTS

## PORT-001 — IdentityVerificationProvider

Conceptual operations:
startVerification(subject, purpose)
getVerificationStatus(verificationId)
handleCallback(payload)

Must normalize provider-specific output into internal contract.

## PORT-002 — PropertyInventoryProvider

Operations:
listProjects()
listUnits(project)
getUnit(unitId)
syncInventory(cursor/version)
handleInventoryEvent(event)

Reconciliation required for conflicting/stale inventory.

## PORT-003 — CreditDataProvider

Operations conceptual only:
requestCreditData(authorizedContext)
getResult(requestId)

Status:
Access/legal/contractual gate.

## PORT-004 — FinancingProviderAdapter

Operations:
submitApplication(applicationSnapshot)
getApplicationStatus(providerApplicationId)
requestDocuments(...)
receiveOffer(...)
cancel/withdraw where supported
handleWebhook(event)
reconcile(...)

Implementation mode:
API / manual / hybrid according to provider capability.

---

# 19. EVENT CONTRACTS

All critical events should include:

eventId
eventType
eventVersion
occurredAt
aggregateType
aggregateId
tenantId where applicable
actor/system identity
correlationId
causationId
payload
schemaVersion

Events must be safe for at-least-once delivery where applicable.

## EVT-001 — LeadConverted
Payload:
leadId
dealId
buyerId
occurredAt

## EVT-002 — ReservationCreated
Payload:
reservationId
unitId
dealId optional
expiresAt optional
policyVersion

## EVT-003 — ReservationExpired
Payload:
reservationId
unitId
releasedAt

## EVT-004 — FinancingApplicationSubmitted
Payload:
applicationId
dealId
providerId
snapshotReference

## EVT-005 — FinancingApplicationStatusChanged
Payload:
applicationId
previousState
newState
providerReference
reason

## EVT-006 — FinancingOfferIssued
Payload:
offerId
applicationId
dealId
providerId
expiresAt

## EVT-007 — FinancingOfferSelected
Payload:
offerId
dealId
applicationId
providerId
selectedBy
selectedAt

## EVT-008 — ConsentGranted
Payload:
consentId
subjectId
purpose
recipient
scopeReference

## EVT-009 — ConsentRevoked
Payload:
consentId
subjectId
revokedAt

## EVT-010 — DocumentUploaded
Payload:
documentId
contextType
contextId
documentType
version

## EVT-011 — TransactionPosted
Payload:
transactionId
transactionType
subjectReference
amount/currency if applicable

## EVT-012 — TransactionReversed
Payload:
originalTransactionId
reversalTransactionId
reason

## EVT-013 — DealStatusChanged
Payload:
dealId
previousState
newState
reason

---

# 20. STANDARD ERROR CONTRACT

Recommended conceptual structure:

error.code
error.message
error.details
requestId
correlationId

Examples:

AUTH_UNAUTHORIZED
AUTH_FORBIDDEN
TENANT_SCOPE_VIOLATION
RESOURCE_NOT_FOUND
INVALID_STATE_TRANSITION
UNIT_ALREADY_RESERVED
IDEMPOTENCY_CONFLICT
CONSENT_REQUIRED
CONSENT_REVOKED
REGULATORY_GATE_BLOCKED
PROVIDER_UNAVAILABLE
PROVIDER_TIMEOUT
VALIDATION_ERROR
DOCUMENT_ACCESS_DENIED
OFFER_EXPIRED
OFFER_ALREADY_SELECTED_CONFLICT

Do not leak internal sensitive details in client-facing errors.

---

# 21. DATA CLASSIFICATION CONTRACT

Recommended classes:

PUBLIC
INTERNAL
CONFIDENTIAL
SENSITIVE_PERSONAL
FINANCIAL_SENSITIVE
REGULATORY_RESTRICTED

Examples:

Project public description → PUBLIC
Developer internal CRM note → INTERNAL/CONFIDENTIAL
National ID → SENSITIVE_PERSONAL
Income/obligations → FINANCIAL_SENSITIVE
KYC/AML flags → REGULATORY_RESTRICTED

API serializers/projections must respect classification.

---

# 22. DATA OWNERSHIP & FIELD RULES

Unit availability:
Source = Inventory / Unit

Reservation:
Source = Unit aggregate reservation state

Deal status:
Source = Deal Orchestration

Financing decision:
Source = Financing provider/domain

Selected offer:
Source = Financing + explicit selection event

Wallet balance:
Projection from Transaction Ledger

Audit:
AuditLog

EligibilitySummary:
Projection from Financing

Notification:
Projection from events

Rule:
No API may create a second independently mutable source of truth.

---

# 23. API OPEN ITEMS

API-OPEN-001 — Paid reservation/payment endpoints
Depends on OD-004.

API-OPEN-002 — Reservation extension contract
Depends on OD-005.

API-OPEN-003 — Finance chat activation endpoint/rules
Depends on OD-003.

API-OPEN-004 — Finance-provider routing command
Depends on OD-007 + OD-001.

API-OPEN-005 — Offer ranking/recommendation API
Depends on OD-008 + OD-001.

API-OPEN-006 — Final finance integration mode/provider contracts
Depends on OD-006.

API-OPEN-007 — Bank employee incentive payout endpoint
Depends on OD-002.
Must remain disabled until resolved.

API-OPEN-008 — Final commercial billing contracts
Depends on OD-009.

---

# 24. FORBIDDEN API PATTERNS

Do NOT create:
- PATCH /deal { status: arbitraryValue } without transition rules.
- PATCH /wallet { balance: ... }.
- DELETE /posted-transactions/{id} to correct finance history.
- APIs that accept tenantId and trust it without authorization.
- Developer API returning raw financing application fields by default.
- A separate UnitId truth inside FinancingApplication that can conflict with Deal.
- Provider-specific Nafath/SIMAH/NHC/bank logic in core domain contracts.
- Non-idempotent reservation/payment/offer-selection commands.
- Generic Admin endpoint that bypasses all policies.
- Production endpoints for REGULATORY-GATE actions just because UI requires them.

---

# 25. CONTRACT GOVERNANCE

Before introducing/changing a material API or event:

1. Check Decision Registry.
2. Check Business Rules & Invariants.
3. Check ADR Registry.
4. Check Domain Model.
5. Check State Machines.
6. Check Permissions Matrix.
7. Check Compliance Matrix/Open Decisions.
8. Identify source-of-truth owner.
9. Define authorization + idempotency + audit + failure behavior.
10. Version the contract if compatibility may break.
11. Update QA acceptance tests.

This file is conceptual and does not authorize production implementation of REGULATORY-GATE behavior.
