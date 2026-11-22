# HESBA IN — PERMISSIONS & ACCESS CONTROL MATRIX
Version: 1.0

Purpose: Define who may see, create, update, approve, and administer Hesba In data and workflows.
This registry is based on the current Master Context, Decision Registry, Business Rules, Compliance Matrix, ADR Registry, Domain Model, and State Machines.

## 1. Access-Control Model

Hesba In uses layered authorization:

1. Role-Based Access Control (RBAC)
2. Tenant-Based Access Control
3. Relationship-Based Access Control
4. Purpose-Based Access Control
5. Consent / lawful-basis checks where applicable
6. State-based restrictions
7. Regulatory-gate restrictions
8. Audit requirements

Rule:
A role alone never grants unrestricted access.

Default policy:
DENY unless explicitly allowed.

---

# 2. PRIMARY ROLES

## R-001 — Buyer
Scope:
Own profile, own leads, own reservations, own deals, own financing interactions,
own documents, own consent, own messages, own support requests.

Cannot:
- View other buyers
- View internal bank/developer notes
- View other tenants
- Modify authoritative financing decisions issued by provider
- Modify financial ledger
- Perform admin overrides

---

## R-002 — Developer Sales Agent
Scope:
Assigned leads/deals within own developer organization.

May:
- View assigned lead/contact information required for sales follow-up
- Communicate with assigned buyers
- Use financing calculator in approved mode
- View Unit/Project data available to organization
- View approved EligibilitySummary / limited financing projection
- Update sales/CRM stages within authority
- View own wallet projection if incentive model applies

Cannot:
- View raw detailed buyer financing records by default
- View unrelated buyers
- View other developer tenants
- View finance-provider internal notes
- Change bank approval/offer decisions
- Mutate financial ledger directly

---

## R-003 — Developer Organization Admin
Scope:
Own developer tenant/organization.

May:
- Manage organization users/roles within delegated limits
- Manage projects/units subject to applicable rules
- View organization-wide leads/deals
- View inventory/reservation status
- View approved financing summaries
- View organization analytics
- Manage storefront/widget configuration
- View subscription/invoices for own organization

Cannot:
- View raw buyer financing records by default
- View other tenants
- Access finance-provider internal data
- Modify financing approvals/offers
- Directly mutate ledger/audit history

---

## R-004 — Finance Employee
Scope:
Financing applications assigned/authorized to own finance organization.

May:
- View buyer financing data necessary for assigned financing application
- Request permitted documents
- Communicate with buyer when chat trigger is authorized
- Update FinancingApplication state within assigned authority
- Create/update financing offers within provider authority
- Record required review outcomes
- View own approved incentive projection if applicable

Cannot:
- View financing applications assigned exclusively to competing providers
- View developer internal CRM beyond necessary deal context
- View unrelated buyers
- Modify Unit availability
- Directly mutate financial ledger
- Activate prohibited incentive flows

Note:
Exact Buyer ↔ Finance Employee chat activation remains OPEN.

---

## R-005 — Finance Organization Admin
Scope:
Own finance-provider tenant/organization.

May:
- Manage finance employees/assignments
- View own organization's financing applications/offers
- View own performance/SLA analytics
- Manage provider-specific configuration/rules subject to governance
- Review own organization's relevant audit history
- View own subscription/invoices where applicable

Cannot:
- View competitors' financing applications/offers
- View unrelated developer tenant data
- Access buyer data without relationship/purpose authorization
- Override platform compliance controls

---

## R-006 — Platform Admin
Scope:
Operational platform administration.

May:
- Monitor platform workflows
- Handle support/disputes
- View scoped data necessary for operational support
- Perform approved manual interventions
- Review audit trails
- Manage platform configuration within delegated authority

Restrictions:
- Least privilege applies
- Sensitive access must be purpose-bound and audited
- Manual overrides require Actor, Reason, BeforeState, AfterState, Timestamp
- Admin access must not bypass regulatory or consent controls silently

Cannot by default:
- Edit posted financial history
- Create arbitrary financing approvals
- Bypass tenant isolation without explicit privileged support/admin scope

---

## R-007 — Super Admin
Scope:
Highest platform operational authority.

May:
- Manage platform-level roles/configuration
- Access cross-tenant operational data only where explicitly authorized
- Perform emergency/admin functions with full audit trail
- Manage tenant lifecycle and privileged access controls

Restrictions:
- Cross-tenant access must be exceptional, explicit, reasoned, and audited
- Cannot erase immutable audit/financial history
- Cannot convert REGULATORY-GATE behavior into approved production behavior by privilege alone

---

# 3. RESOURCE ACCESS MATRIX

Legend:
V = View
C = Create
U = Update
A = Approve/Select
M = Manage/Admin
L = Limited Projection Only
— = No default access
* = Conditional / relationship / purpose / consent / state dependent

| Resource | Buyer | Dev Sales Agent | Dev Org Admin | Finance Employee | Finance Org Admin | Platform Admin | Super Admin |
|---|---|---|---|---|---|---|---|
| Own User Profile | V/U | V/U own | V/U own | V/U own | V/U own | V* | M* |
| Other User Profile | — | V* assigned | V* own tenant | V* assigned | V* own tenant | V* support | M* audited |
| Organization | V limited | V own | M own | V own | M own | M* | M |
| Project | V public/eligible | V own | C/U/M own | V deal-related | V deal-related | M* | M |
| Unit | V | V own | C/U/M own | V deal-related | V deal-related | M* | M |
| Lead | C/V own | V/U assigned | V/U own tenant | — | — | V/U* | M* |
| Reservation | C/V own | V* assigned | V own tenant | V limited* | V limited* | V/U* | M* |
| Deal | V own | V/U assigned scope | V own tenant | V/U assigned financing scope | V own finance scope | V/U* | M* |
| FinancingApplication | V own | L | L | C/V/U assigned | V/U own tenant | V* support/compliance | M* restricted |
| FinancingOffer | V own | L approved summary | L approved summary | C/V/U own provider | V/U own tenant | V* | M* |
| EligibilitySummary | V own | V* | V* | V/U source scope | V/U source scope | V* | M* |
| Raw Financing Data | V own | — | — | V/U* assigned | V* own tenant | V* privileged | M* highly audited |
| Documents | C/V own | V* authorized | V* authorized | C/V* assigned | V* own tenant | V* support | M* audited |
| ChatThread | V own authorized | V/U assigned | V* oversight where allowed | V/U* authorized | V* oversight where allowed | V* support | M* audited |
| ConsentRecord | C/V/U own where applicable | — | — | V* status if needed | V* status if needed | V/U* compliance | M* |
| AuditLog | V limited own events | — | V* own tenant summary | V* own-scope events | V* own tenant | V/M* | M* |
| Transaction Ledger | V own relevant entries | — | V* org billing only | — | V* org billing only | V* finance/admin scope | M* |
| Wallet Projection | V own if applicable | V own | V* aggregate if permitted | V own if applicable | V* aggregate if permitted | V* | M* |
| Subscription | — | — | V/U own | — | V/U own if applicable | M | M |
| Invoice | V own buyer invoice if any | — | V own org | — | V own org | V/M | M |
| License | V public/needed | V own relevant | C/V/U own | V own relevant | C/V/U own | V/M* | M |
| KYC/AML Check | V limited result* | — | — | V/U* if authorized | V/U* own tenant | V* compliance | M* |
| Valuation | V own | L* | L* | V/U* assigned | V own tenant | V* | M* |
| SupportTicket | C/V own | C/V* related | V* own tenant | C/V* related | V* own tenant | C/V/U/M | M |
| DataSubjectRequest | C/V own | — | — | — | — | V/U/M compliance | M |
| EscrowReference | V own deal | V* deal | V* own project | V* deal | V* deal | V* | M* |

---

# 4. SENSITIVE DATA RULES

## AC-001 — Raw Financing Data
Status: CONFIRMED

Default:
Buyer + authorized Finance Provider actors only.

Developer-side users:
NO raw detailed access by default.

Developer view:
EligibilitySummary / approved limited projection only.

Exceptions:
Require explicit policy, purpose, legal basis/consent where applicable, and audit.

---

## AC-002 — Cross-Tenant Access
Status: CONFIRMED

Default:
DENY.

Platform Admin/Super Admin:
Only via explicit privileged scope for support, compliance, security, audit, or approved operational need.

Every privileged cross-tenant access should capture:
- Actor
- Tenant
- Resource
- Purpose
- Reason
- Timestamp
- Access outcome

---

## AC-003 — Document Access
Status: CONFIRMED

Documents must be authorized by:
Tenant
+ Relationship
+ Purpose
+ Document type
+ Deal/Application context
+ Consent/lawful basis where applicable.

Do not grant access just because a user can see the Deal.

---

## AC-004 — Consent Withdrawal
Status: CONFIRMED

When consent is revoked and withdrawal applies:
Future governed access/sharing must stop.

Existing legally retained records may remain restricted/retained where lawful.

---

## AC-005 — Audit Logs
Status: CONFIRMED

Audit records are not ordinary editable business records.

No normal actor may:
- delete
- rewrite
- conceal
historical audit events.

Administrative access is read/investigative except for system-managed metadata.

---

## AC-006 — Financial Ledger
Status: CONFIRMED

No user role may directly rewrite posted financial history.

Corrections:
Reversal / adjustment / compensating entry.

Wallet is a projection only.

---

# 5. ACTION AUTHORIZATION RULES

## ACT-001 — Create Reservation
Allowed:
Buyer or authorized staff acting within approved workflow.

Preconditions:
- Unit accessible
- Unit available
- No active reservation
- Reservation policy valid
- Required regulatory/project conditions satisfied

Must:
Be atomic and audited.

---

## ACT-002 — Select Financing Offer
Allowed:
Buyer or explicitly authorized workflow actor according to final product policy.

Must:
- reference valid issued offer
- enforce one selected offer
- create FinancingOfferSelected event
- audit actor/time
- preserve prior offers

---

## ACT-003 — Update Financing Decision
Allowed:
Authorized finance-provider actor/system only.

Developer:
Cannot approve/decline financing.

Platform Admin:
Cannot fabricate provider approval.

---

## ACT-004 — Manual Override
Allowed:
Privileged Admin/Super Admin or other explicitly delegated role.

Required:
Actor
Reason
BeforeState
AfterState
Timestamp
AuditEvent

High-risk overrides may require dual approval in future.

---

## ACT-005 — View Buyer Financial Information
Allowed only when:
1. Actor has authorized role.
2. Actor belongs to authorized tenant.
3. Actor has relationship to the Deal/Application.
4. Purpose is valid.
5. Consent/lawful basis permits access where applicable.
6. Record state permits access.
7. Regulatory gate does not prohibit workflow.

All conditions are cumulative.

---

## ACT-006 — Employee Incentive Payout
Status: REGULATORY-GATE

No permission should enable cash/equivalent payout to finance employees until OD-002 is resolved.

Architecture may expose:
Pending/disabled incentive projection
without enabling payout.

---

# 6. ADMINISTRATION & SEPARATION OF DUTIES

## SoD-001 — Financial Operations
Recommended:
Actor who creates/initiates a sensitive financial adjustment should not be the sole approver where material.

## SoD-002 — Role Administration
Organization Admin:
May administer roles only within own organization and within roles delegated by platform.

Cannot grant:
Platform Admin / Super Admin.

## SoD-003 — Platform Privileged Roles
Platform Admin and Super Admin assignment/revocation must be restricted, logged, and preferably approval-controlled.

## SoD-004 — Compliance Review
High-risk compliance outcomes should not be freely overwritten by general operational roles.

---

# 7. AUTHORIZATION EVALUATION ORDER

For every protected request evaluate:

1. Authentication
2. Account status
3. Role
4. Tenant
5. Organization membership
6. Resource relationship/assignment
7. Purpose
8. Consent/lawful basis where applicable
9. Resource state
10. Regulatory/compliance gate
11. Field-level restrictions
12. Audit requirement

If any mandatory check fails:
DENY.

---

# 8. FIELD-LEVEL SECURITY

Examples of fields requiring restricted access:

Buyer:
- National ID / identity attributes
- Income
- Employer
- Salary
- Credit obligations
- Credit data
- Bank statements
- Financing documents

Financing:
- Provider internal notes
- Risk/decision details
- KYC/AML flags
- Rule snapshots

Platform:
- Audit metadata
- Security/admin notes
- Internal dispute investigation

Rule:
API responses must apply field-level authorization.
Do not rely on frontend hiding.

---

# 9. OPEN PERMISSION ITEMS

AC-OPEN-001 — Exact Buyer ↔ Finance Employee chat activation
Depends on OD-003.

AC-OPEN-002 — Who may initiate/extend/cancel paid reservation
Depends on OD-004 / OD-005.

AC-OPEN-003 — Who chooses finance providers and authorizes routing
Depends on OD-007.

AC-OPEN-004 — Sponsored offer visibility/ranking permissions
Depends on OD-008.

AC-OPEN-005 — Final finance employee incentive visibility/payout permissions
Depends on OD-002.

AC-OPEN-006 — Exact privileged access required by final SAMA operating model
Depends on OD-001.

---

# 10. FORBIDDEN ACCESS PATTERNS

Do not allow:

- Developer actor viewing raw buyer financing file by default.
- Finance provider viewing competitor offers/applications.
- User querying resources from another tenant by changing an ID.
- Frontend-only permission enforcement.
- Admin silent access to sensitive data.
- Direct Wallet balance editing.
- Direct posted Transaction rewriting.
- Revoked consent being ignored for future governed access.
- Generic "Admin can do everything" authorization.
- Prototype screens defining permissions by themselves.
- Regulatory-gated action becoming accessible only because a role has a button.

---

# 11. IMPLEMENTATION REQUIREMENTS

Authorization must be enforced:
- Server-side
- API-side
- Data-query scope
- File/document retrieval layer
- Event/command handling
- Admin tools

Recommended authorization context:
UserId
Role(s)
TenantId
OrganizationId
Relationship/Assignment
Purpose
ResourceId
ResourceState
Consent/LegalBasis result
PrivilegeLevel
CorrelationId

Sensitive access should produce audit evidence.

---

# 12. GOVERNANCE

When permissions change:

1. Identify affected role/resource/action.
2. Check Decision Registry.
3. Check Business Rules.
4. Check Compliance Matrix.
5. Check ADR + Domain Model + State Machines.
6. Record material decision if new authority is introduced.
7. Update API authorization tests.
8. Update UI visibility only after backend policy is defined.
9. Preserve prior rationale when superseded.

No new sensitive permission may be introduced silently.
