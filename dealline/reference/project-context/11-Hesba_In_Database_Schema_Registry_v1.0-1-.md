# HESBA IN — DATABASE SCHEMA REGISTRY
Version: 1.0

Purpose: Define the approved conceptual database schema for Hesba In based on the current Domain Model, State Machines, Permissions, API Contracts, ADRs, Business Rules, and Compliance Gates.

This is a logical schema registry, not a final physical SQL design.
REGULATORY-GATE behavior must not be production-enabled merely because a table exists.

---

# 1. GLOBAL DATABASE PRINCIPLES

1. Multi-tenant by design.
2. Server-side tenant isolation.
3. Critical writes must be transactional and idempotent.
4. Immutable/append-oriented history for financial and audit records.
5. No duplicate source of truth.
6. State transitions must follow approved state machines.
7. Sensitive fields must support field-level access restrictions.
8. External provider identifiers must be stored separately from core internal IDs.
9. Use timestamps in UTC with timezone-aware application handling.
10. Use soft deletion only where legally/product appropriate; never use it to erase immutable history.
11. Every critical record should support correlation/audit traceability.
12. Schema evolution must preserve backward compatibility where practical.

Recommended common fields where applicable:
id
tenant_id / organization_id
created_at
updated_at
created_by
updated_by
version / row_version
status

---

# 2. TENANCY & IDENTITY

## TABLE: users
Purpose:
Core platform user identity.

Fields:
id
external_identity_ref optional
display_name
email optional
phone optional
account_status
created_at
updated_at

Sensitive identity attributes should be minimized and separated where practical.

---

## TABLE: organizations
Purpose:
MVP tenant boundary and participating organization.

Fields:
id
name
organization_type
capabilities
status
created_at
updated_at

organization_type examples:
developer
finance_provider
platform

---

## TABLE: organization_memberships
Purpose:
User membership and role assignment within an organization.

Fields:
id
organization_id
user_id
role_code
membership_status
valid_from
valid_to
created_at
updated_at

Constraints:
UNIQUE(organization_id, user_id, role_code) where appropriate.

---

## TABLE: platform_roles
Purpose:
Platform-level privileged roles.

Fields:
id
user_id
role_code
status
granted_by
granted_at
revoked_at

Examples:
platform_admin
super_admin

Rule:
Assignment/revocation must be audited.

---

# 3. PROJECT & INVENTORY

## TABLE: projects
Purpose:
Real-estate project.

Fields:
id
organization_id
name
project_type
status
external_source_type optional
external_source_id optional
public_metadata_json
created_at
updated_at

project_type:
READY
OFF_PLAN
OTHER

Index:
(organization_id, status)

---

## TABLE: units
Purpose:
Authoritative unit inventory record.

Fields:
id
organization_id
project_id
unit_code
availability_status
commercial_data_json
external_source_type optional
external_source_id optional
row_version
created_at
updated_at

Critical constraints:
UNIQUE(project_id, unit_code)

Rule:
Unit is the source of truth for availability.

---

## TABLE: reservations
Purpose:
Reservation history/state associated with a Unit.

Fields:
id
organization_id
unit_id
buyer_user_id
deal_id optional
status
policy_version
hold_started_at
expires_at optional
released_at optional
cancelled_at optional
confirmed_at optional
created_at
updated_at
idempotency_key

Critical invariant:
At most one ACTIVE reservation per unit.

Physical implementation must enforce this through an appropriate transactional constraint/locking strategy.

Recommended:
Partial unique index or equivalent on unit_id where status in active reservation states, depending on DB engine.

---

# 4. SALES & CRM

## TABLE: leads
Purpose:
Pre-deal buyer interest.

Fields:
id
organization_id
buyer_user_id
project_id optional
unit_id optional
assigned_sales_user_id optional
source
status
created_at
updated_at
converted_at optional
converted_deal_id optional

Indexes:
(organization_id, assigned_sales_user_id, status)
(buyer_user_id, status)

---

# 5. DEAL ORCHESTRATION

## TABLE: deals
Purpose:
Central business-process coordination record.

Fields:
id
organization_id
buyer_user_id
unit_id
reservation_id optional
status
current_selected_offer_id optional
created_at
updated_at
completed_at optional
cancelled_at optional
row_version

Rule:
Deal references Unit as approved coordination reference.
Financing entities must not independently redefine Unit truth.

---

## TABLE: deal_state_history
Purpose:
Immutable transition history.

Fields:
id
deal_id
previous_state
new_state
actor_user_id optional
actor_system optional
reason optional
correlation_id
occurred_at

Append-only.

---

## TABLE: process_instances
Purpose:
Saga / Process Manager state for cross-domain workflows.

Fields:
id
tenant_id
process_type
business_reference_type
business_reference_id
status
current_step
state_json
correlation_id
started_at
updated_at
completed_at optional

Rule:
Do not use process_instances as source of truth for domain-owned data.

---

# 6. FINANCING

## TABLE: financing_applications
Purpose:
One financing engagement for one Deal with one finance provider.

Fields:
id
tenant_id
deal_id
finance_organization_id
assigned_finance_user_id optional
status
provider_application_id optional
source_mode
submitted_at optional
received_at optional
expires_at optional
created_at
updated_at
row_version

source_mode examples:
API
MANUAL
RULES_ENGINE
HYBRID

Constraint:
No unit_id field as independent truth.

---

## TABLE: financing_decision_snapshots
Purpose:
Point-in-time reproducibility of calculator/eligibility/provider decisions.

Fields:
id
financing_application_id optional
deal_id optional
decision_type
inputs_snapshot_json
rule_set_version
output_snapshot_json
source
calculated_at
expires_at optional
created_at

Append-oriented.

---

## TABLE: financing_offers
Purpose:
Offer issued by a finance provider.

Fields:
id
financing_application_id
deal_id
finance_organization_id
provider_offer_id optional
status
monthly_payment optional
term_months optional
down_payment optional
fees_amount optional
total_cost_amount optional
pricing_data_json
conditions_json
issued_at
expires_at optional
selected_at optional
selected_by_user_id optional
created_at
updated_at

Critical invariant:
One Deal may have at most one currently SELECTED offer.

Recommended:
Partial unique index on deal_id where status = 'SELECTED', or equivalent enforcement.

---

## TABLE: financing_offer_state_history
Purpose:
Offer transition audit/history.

Fields:
id
financing_offer_id
previous_state
new_state
actor_user_id optional
reason optional
correlation_id
occurred_at

Append-only.

---

# 7. PRIVACY & CONSENT

## TABLE: consent_records
Purpose:
Auditable consent / authorization record where applicable.

Fields:
id
subject_user_id
tenant_id optional
purpose
data_scope_json
recipient_type
recipient_id
legal_basis optional
privacy_notice_version
status
granted_at
revoked_at optional
expires_at optional
created_at

Rule:
Do not overwrite historical consent terms.

---

## TABLE: data_subject_requests
Purpose:
Privacy rights request tracking.

Fields:
id
subject_user_id
request_type
status
submitted_at
identity_verified_at optional
completed_at optional
rejection_reason optional
created_at
updated_at

---

# 8. DOCUMENT MANAGEMENT

## TABLE: documents
Purpose:
Document metadata.

Fields:
id
tenant_id
owner_user_id optional
context_type
context_id
document_type
classification
current_version_id optional
status
created_at
updated_at

classification examples:
PUBLIC
INTERNAL
CONFIDENTIAL
SENSITIVE_PERSONAL
FINANCIAL_SENSITIVE
REGULATORY_RESTRICTED

---

## TABLE: document_versions
Purpose:
Immutable document version lineage.

Fields:
id
document_id
version_number
storage_object_key
checksum
mime_type
size_bytes
uploaded_by_user_id optional
status
created_at

Constraint:
UNIQUE(document_id, version_number)

---

## TABLE: document_reviews
Purpose:
Document review outcomes.

Fields:
id
document_version_id
reviewer_user_id
decision
reason optional
reviewed_at

Append-oriented.

---

# 9. COMMUNICATION

## TABLE: chat_threads
Purpose:
Authorized communication thread.

Fields:
id
tenant_id
context_type
context_id
status
created_at
updated_at
archived_at optional

context_type:
LEAD
DEAL

---

## TABLE: chat_participants
Purpose:
Explicit participant relationship.

Fields:
id
chat_thread_id
user_id
participant_role
joined_at
left_at optional
status

---

## TABLE: chat_messages
Purpose:
Message history.

Fields:
id
chat_thread_id
sender_user_id
message_type
body_text / content_ref
created_at
edited_at optional
deleted_for_policy_at optional

Rule:
Authorization must be checked per thread.
Do not expose messages solely by guessed IDs.

---

# 10. SUPPORT & DISPUTES

## TABLE: support_tickets
Purpose:
Support, complaint, escalation, dispute.

Fields:
id
tenant_id optional
deal_id optional
created_by_user_id
ticket_type
status
priority
subject
resolution_summary optional
created_at
updated_at
resolved_at optional
closed_at optional

---

## TABLE: support_ticket_events
Purpose:
Ticket transition/history.

Fields:
id
support_ticket_id
event_type
previous_state optional
new_state optional
actor_user_id optional
notes optional
occurred_at

Append-only.

---

# 11. FINANCIAL LEDGER

## TABLE: transactions
Purpose:
Authoritative financial ledger/event record.

Fields:
id
tenant_id optional
transaction_type
subject_type
subject_id
amount optional
currency optional
status
idempotency_key
correlation_id
source_reference optional
reverses_transaction_id optional
reason optional
posted_at optional
created_at

Critical constraints:
UNIQUE(idempotency_key) within appropriate scope.

Rule:
POSTED transactions are never silently rewritten/deleted.
Corrections use compensating/reversal transactions.

---

## TABLE: wallet_projection
Status: PROJECTION ONLY

Purpose:
Derived user-facing balance view.

Fields:
owner_type
owner_id
pending_amount
available_amount
paid_amount
reversed_amount
calculated_at
projection_version

Rule:
Never mutate independently as financial truth.
Must be rebuildable from transactions.

---

# 12. BILLING

## TABLE: subscriptions
Purpose:
Organization SaaS subscription.

Fields:
id
organization_id
plan_code
status
billing_cycle
starts_at
renews_at optional
ends_at optional
created_at
updated_at

---

## TABLE: invoices
Purpose:
Billing record.

Fields:
id
organization_id optional
buyer_user_id optional
subscription_id optional
invoice_number
status
currency
subtotal
tax_amount
total_amount
issued_at
due_at optional
paid_at optional
external_tax_invoice_ref optional
structured_invoice_ref optional
created_at

Rule:
Issued invoice correction uses credit/debit documents where applicable.
ZATCA behavior remains configuration/compliance dependent.

---

## TABLE: credit_notes
Fields:
id
invoice_id
credit_note_number
amount
reason
issued_at
external_reference optional

---

## TABLE: debit_notes
Fields:
id
invoice_id
debit_note_number
amount
reason
issued_at
external_reference optional

---

# 13. COMPLIANCE

## TABLE: licenses
Purpose:
Organization/project/actor license metadata.

Fields:
id
tenant_id optional
holder_type
holder_id
license_type
issuer
license_number
status
valid_from
valid_to
verification_reference optional
created_at
updated_at

Indexes:
(holder_type, holder_id, license_type)

---

## TABLE: compliance_checks
Purpose:
KYC/AML or other compliance checks.

Status:
REGULATORY-GATE / CONDITIONAL

Fields:
id
tenant_id
subject_user_id
financing_application_id optional
check_type
provider
provider_reference optional
status
risk_level optional
flags_json optional
initiated_at
completed_at optional
expires_at optional
created_at

Rule:
Highly restricted access.

---

## TABLE: valuations
Purpose:
Property valuation related to financing.

Fields:
id
financing_application_id
valuation_provider
provider_reference optional
valuation_amount
currency
status
requested_at
completed_at optional
expires_at optional
created_at

Unit context is resolved through Deal/FinancingApplication relationship.

---

# 14. ESCROW TRACKING

## TABLE: escrow_references
Status: CONDITIONAL

Purpose:
Track external escrow state where applicable.

Fields:
id
project_id
external_escrow_reference
status
provider
opened_at optional
closed_at optional
metadata_json
created_at
updated_at

Rule:
This table does not imply Hesba In custody.

---

## TABLE: escrow_events
Purpose:
External escrow status/payment/milestone references.

Fields:
id
escrow_reference_id
deal_id optional
event_type
external_reference optional
amount optional
currency optional
milestone_code optional
occurred_at
received_at
payload_hash optional

Append-oriented.

---

# 15. NOTIFICATIONS & PROJECTIONS

## TABLE: notifications
Status: PROJECTION

Fields:
id
user_id
tenant_id optional
notification_type
reference_type
reference_id
title
body
status
created_at
read_at optional

Rule:
Notification is not source of business truth.

---

## TABLE: sla_projection
Status: PROJECTION

Fields:
reference_type
reference_id
owner_user_id optional
owner_organization_id optional
started_at
expected_by
completed_at optional
sla_status
last_event_at

Derived from workflow/domain events.

---

# 16. AUDIT & SECURITY

## TABLE: audit_log
Purpose:
Immutable sensitive-action audit history.

Fields:
id
tenant_id optional
actor_user_id optional
actor_type
action
resource_type
resource_id
purpose optional
reason optional
before_state_json optional
after_state_json optional
request_id optional
correlation_id optional
ip/device metadata where legally/operationally appropriate
occurred_at

Rule:
Append-only.
Normal users cannot modify/delete records.

---

## TABLE: privileged_access_log
Purpose:
Cross-tenant/admin sensitive access tracking.

Fields:
id
actor_user_id
target_tenant_id
resource_type
resource_id
purpose
reason
access_result
correlation_id
occurred_at

---

# 17. INTEGRATION STATE

## TABLE: external_integrations
Purpose:
Configured provider integration per organization/platform.

Fields:
id
tenant_id optional
provider_type
provider_name
status
configuration_reference
created_at
updated_at

Do not store secrets directly in plain fields.

---

## TABLE: external_entity_mappings
Purpose:
Map internal entities to provider identifiers.

Fields:
id
provider_type
provider_name
internal_entity_type
internal_entity_id
external_entity_id
tenant_id optional
created_at

Constraint:
Appropriate UNIQUE(provider_name, internal_entity_type, internal_entity_id)

---

## TABLE: integration_events_inbox
Purpose:
Idempotent ingestion of external callbacks/events.

Fields:
id
provider
external_event_id
event_type
payload_hash
status
received_at
processed_at optional
correlation_id optional

Constraint:
UNIQUE(provider, external_event_id)

---

## TABLE: integration_outbox
Purpose:
Reliable publication of internal events/integration commands.

Fields:
id
event_type
aggregate_type
aggregate_id
tenant_id optional
payload_json
status
created_at
published_at optional
attempt_count
last_error optional

---

# 18. CORE DATABASE CONSTRAINTS

DB-C-001:
One active reservation per Unit.

DB-C-002:
One currently selected FinancingOffer per Deal.

DB-C-003:
Unique idempotency protection for critical economic/business commands.

DB-C-004:
No independent wallet balance as source of truth.

DB-C-005:
No independent unit_id truth inside FinancingApplication.

DB-C-006:
All tenant-scoped entities must carry enforceable tenant/organization ownership or derive it unambiguously.

DB-C-007:
Financial and audit history is append-oriented.

DB-C-008:
External event inbox must prevent duplicate callback processing.

DB-C-009:
Document versions must preserve lineage.

DB-C-010:
State fields cannot be treated as free-form arbitrary status values; application/domain transitions must validate state machine.

---

# 19. RECOMMENDED INDEXES

High priority:

units(project_id, availability_status)
reservations(unit_id, status)
reservations(buyer_user_id, status)
leads(organization_id, assigned_sales_user_id, status)
deals(organization_id, status)
deals(buyer_user_id, status)
financing_applications(deal_id, finance_organization_id, status)
financing_offers(deal_id, status)
chat_threads(context_type, context_id)
documents(context_type, context_id)
transactions(subject_type, subject_id, created_at)
audit_log(resource_type, resource_id, occurred_at)
support_tickets(deal_id, status)
licenses(holder_type, holder_id, license_type, status)

All indexes must respect tenant-scoping patterns.

---

# 20. DATA RETENTION / DELETION FLAGS

Do not hard-code retention durations in this schema registry unless confirmed by compliance/legal policy.

Recommended metadata where needed:
retention_class
retention_until
legal_hold
restricted_at
archived_at
deletion_eligible_at

Never use deletion to erase:
- required financial history
- immutable audit evidence
- legally required records

---

# 21. OPEN SCHEMA ITEMS

DB-OPEN-001 — Reservation payment tables
Depends on OD-004.

DB-OPEN-002 — Reservation extension/hold policy fields
Depends on OD-005.

DB-OPEN-003 — Final finance routing tables/queues
Depends on OD-007 + OD-001.

DB-OPEN-004 — Sponsored offer/ranking persistence
Depends on OD-008.

DB-OPEN-005 — Employee incentive payout entities
Depends on OD-002.

DB-OPEN-006 — Final tax/e-invoicing technical fields
Depends on final ZATCA/tax design.

DB-OPEN-007 — Final native app/device session/security model
Depends on broader security/architecture decisions.

---

# 22. FORBIDDEN DATABASE PATTERNS

Do NOT:
- Store wallet balance as independently authoritative.
- Allow two active reservations for the same Unit.
- Allow two selected financing offers for one Deal.
- Duplicate Unit truth inside FinancingApplication.
- Use one giant generic status column without domain transition enforcement.
- Hard-delete posted financial transactions to fix mistakes.
- Hard-delete immutable audit logs.
- Store provider secrets directly in ordinary database columns.
- Trust client-supplied tenant_id without server-side authorization.
- Store all sensitive data in one unrestricted JSON blob.
- Let projections become sources of truth.
- Add REGULATORY-GATE tables/fields and treat their behavior as approved automatically.

---

# 23. SCHEMA GOVERNANCE

Before adding/changing a material table/field/index/constraint:

1. Check Decision Registry.
2. Check Business Rules & Invariants.
3. Check ADR Registry.
4. Check Domain Model.
5. Check State Machines.
6. Check Permissions Matrix.
7. Check API/Data Contracts.
8. Check Compliance Matrix/Open Decisions.
9. Identify authoritative owner/source of truth.
10. Define migration/backfill impact.
11. Define audit, tenant, security, and retention impact.
12. Update QA/database constraint tests.

This registry is conceptual and does not authorize production implementation of REGULATORY-GATE behavior.
