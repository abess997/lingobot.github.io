# HESBA IN — UX / IA / USER FLOWS REGISTRY
Version: 1.0

Purpose: Define the approved information architecture, navigation model, role-based surfaces, and primary user flows for Hesba In without allowing screens to override domain, permissions, workflow, compliance, or open-decision constraints.

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
- PRD & Feature Specification Registry

Core rule:
UI reflects approved product/domain behavior.
UI does not create new business rules by itself.

---

# 1. UX PRINCIPLES

1. Buyer journey should remain simple, explicit, and low-friction.
2. Critical state must always be visible: current step, next action, owner, SLA/expected timing where applicable.
3. Eligibility must never be visually presented as final approval.
4. Sponsored content must be clearly distinguishable from objective status/comparison if enabled.
5. Sensitive financing data must not appear in developer-facing surfaces by default.
6. Cross-tenant data must never be discoverable through navigation/search.
7. Regulatory-gated features may be hidden, disabled, or marked unavailable until approved.
8. Error/recovery states are first-class UX, not afterthoughts.
9. Conversation continuity must survive Lead → Deal conversion.
10. Reservation availability shown to the user must reflect authoritative Unit state.

---

# 2. TOP-LEVEL INFORMATION ARCHITECTURE

## Buyer
- Home / Discovery
- Projects
- Project Detail
- Unit Detail
- Financing Calculator
- My Leads / Inquiries
- My Reservations
- My Deals
- Financing Applications
- Financing Offers
- Documents
- Messages
- Notifications
- Support
- Privacy / Consents
- Profile

## Developer Sales Agent
- Dashboard
- Lead Inbox
- CRM / Follow-ups
- Projects / Units
- Assigned Deals
- Financing Calculator
- Messages
- Tasks / SLA
- Wallet Projection if applicable
- Notifications

## Developer Organization Admin
- Dashboard
- Projects
- Units / Inventory
- Leads
- Deals
- Sales Team
- Storefront / Widget
- Analytics
- Subscription / Billing
- Licenses / Compliance Metadata
- Settings

## Finance Employee
- Dashboard
- Application Inbox
- Application Review
- Offers
- Documents
- Messages
- Tasks / SLA
- Wallet Projection if applicable
- Notifications

## Finance Organization Admin
- Dashboard
- Applications
- Offers
- Team / Assignment
- Provider Configuration
- SLA / Performance
- Analytics
- Subscription / Billing if applicable
- Settings

## Platform Admin
- Operations Dashboard
- Deal Operations
- Support / Disputes
- Compliance Operations
- Integration Operations
- Organizations / Tenants
- Audit / Privileged Access
- Billing / Platform Config
- Alerts

---

# 3. BUYER NAVIGATION

## IA-B01 — Discovery
Screens:
- Home
- Search / Filter
- Project List
- Project Detail
- Unit List
- Unit Detail

Primary CTA:
- Ask Developer
- Calculate Financing
- Reserve / Hold if allowed

Rules:
- Unit availability must be authoritative.
- Ready vs Off-plan project type must be visible where material.
- License/escrow/compliance information shown only where applicable and approved.

---

## IA-B02 — Financing Calculator
Screens:
- Calculator Input
- Indicative Result
- Save to Lead/Deal
- Start Financing Journey when permitted

Required UI:
- clear "indicative" label
- calculation timestamp
- expiry/source/version context where appropriate
- disclaimer that result is not final approval

Forbidden:
"Approved" visual language for a calculator/prequalification result unless provider-authoritative approval exists.

---

## IA-B03 — Lead / Inquiry
Screens:
- Inquiry Detail
- Developer Chat
- Project/Unit context
- Follow-up status

States visible:
NEW
ASSIGNED
CONTACTED
QUALIFIED
COLD
LOST
CONVERTED where relevant

Rule:
Buyer does not need a Deal merely to talk to Developer Sales Agent.

---

## IA-B04 — Reservation
Screens:
- Reservation Confirmation
- Reservation Status
- Expiry / Hold Timer if applicable
- Cancel / Release if authorized

Must show:
- Unit
- Reservation state
- created/expiry timestamps where relevant
- clear next action
- conflict/unavailable state if reservation loses concurrency race

OPEN:
Payment behavior and extension UI depend on OD-004 / OD-005.

---

## IA-B05 — Deal Tracker
Primary screen:
My Deal

Sections:
- Current stage
- Milestone timeline
- Next action
- Current owner
- SLA/expected-by
- Reservation summary
- Financing summary
- Selected offer
- Documents required
- Contract/completion
- Messages
- Support

Core principle:
Buyer should not need to call multiple parties just to know current deal status.

---

## IA-B06 — Financing Applications
Screens:
- Application List
- Application Detail
- Document Requirements
- Provider Status

Display:
- provider identity
- application state
- pending action
- requested documents
- timestamps
- indicative/prequalified/approved distinction

Do not show:
Internal provider notes not authorized for buyer.

---

## IA-B07 — Financing Offers
Screens:
- Offer List / Comparison
- Offer Detail
- Offer Selection Confirmation

Comparison fields may include:
- Provider
- Monthly payment
- Term
- Down payment
- Fees
- Total cost / approved comparable field
- Conditions
- Expiry

Rules:
- Issued ≠ Selected.
- Only one current selected offer.
- Expired/withdrawn offer cannot be selected.
- Ranking/sponsored ordering remains dependent on OD-008 / OD-001.

---

## IA-B08 — Buyer ↔ Finance Chat
Status: OPEN / CONDITIONAL

Screen:
Finance Conversation

Must be:
- application/deal scoped
- authorized
- auditable
- document-request capable

Activation trigger:
Depends on OD-003.

Do not hard-code one trigger into IA as final.

---

## IA-B09 — Documents
Screens:
- Document Vault
- Upload
- Version History
- Review Status
- Missing Documents

Important:
User sees only documents authorized for their own context.
Document state:
UPLOADED
PENDING_REVIEW
ACCEPTED
REJECTED
REPLACED
EXPIRED

---

## IA-B10 — Consent / Privacy
Screens:
- Active Consents
- Consent Detail
- Revoke Consent
- Data Subject Request
- Privacy Notice

Must show:
- purpose
- recipient
- data scope
- status
- granted date
- revoked/expiry where applicable

---

# 4. DEVELOPER SALES AGENT IA

## IA-DS01 — Dashboard
Widgets:
- New assigned leads
- Follow-ups due
- Qualified leads
- Active reservations
- Active deals
- SLA warnings
- Recent messages
- Quick financing calculator

Do not show:
Raw financing data.

---

## IA-DS02 — Lead Inbox
Columns/cards:
- Buyer
- Project/Unit
- Source
- Status
- Assigned time
- Last activity
- Next action
- SLA

Actions:
- Open lead
- Message buyer
- Update lead state
- Qualify
- Convert to Deal where allowed

---

## IA-DS03 — Lead Detail / Mini CRM
Sections:
- Buyer contact context
- Project/unit interest
- Conversation
- Activity timeline
- Qualification
- Tasks
- Notes where authorized
- Deal link after conversion

Rule:
Conversation history persists after conversion.

---

## IA-DS04 — Assigned Deals
Sections:
- Deal stage
- Reservation
- EligibilitySummary
- Documents readiness summary where permitted
- SLA
- Next action
- Messages

Do not expose:
- buyer raw income
- credit obligations
- competitor finance offers
- provider internal risk notes

---

## IA-DS05 — Quick Calculator
Optimized for:
- exhibitions
- events
- showroom
- live sales calls

Flow:
Inputs
→ Indicative Result
→ Save/Attach to Lead/Deal
→ optional follow-up action

Offline:
Not confirmed; depends on client architecture.

---

# 5. DEVELOPER ORGANIZATION ADMIN IA

## IA-DO01 — Executive Dashboard
KPIs:
- Leads
- Qualified leads
- Reservations
- Active deals
- Conversion rate
- Unit availability
- Completion rate
- SLA performance
- Agent performance
- Loss/cancellation reasons
- Financing summary projection

Privacy rule:
No raw financing files.

---

## IA-DO02 — Inventory
Screens:
- Projects
- Project Detail
- Units
- Unit Detail
- Availability
- Reservation state
- Sync status
- External source mapping
- Licenses / Escrow metadata where applicable

Critical:
Do not let inventory edit UI bypass active reservation integrity.

---

## IA-DO03 — Team Management
Screens:
- Members
- Roles
- Assignments
- Status
- Performance

Rule:
Developer Admin cannot grant Platform Admin / Super Admin.

---

## IA-DO04 — Storefront / Widget
Screens:
- Branding
- Project publishing
- Widget configuration
- Lead attribution
- Version/config status

Rules:
Widget cannot bypass core permissions, consent, reservation, or financing rules.

---

# 6. FINANCE EMPLOYEE IA

## IA-FE01 — Application Inbox
Cards/table:
- Buyer
- Deal reference
- Provider application state
- Missing documents
- SLA
- Last activity
- Assigned employee

Only own provider scope.

---

## IA-FE02 — Financing Review Workspace
Sections:
- Application Summary
- Buyer authorized financial data
- Deal/property context
- Documents
- Decision status
- Provider notes
- KYC/AML reference where applicable
- Valuation
- Offer creation
- Chat if active
- Audit/timeline summary

Critical:
Finance employee cannot modify Unit availability.

---

## IA-FE03 — Document Request
Flow:
Select document type
→ Send request
→ Buyer uploads
→ Review
→ Accept / Reject
→ Continue application

---

## IA-FE04 — Offer Creation
Screen:
Offer Editor

Fields:
- monthly payment
- term
- down payment
- fees
- comparable total cost field where approved
- conditions
- expiry
- provider reference

Actions:
Draft
Issue
Withdraw

Selection:
Buyer-side explicit action; provider does not silently mark selected.

---

## IA-FE05 — Finance Chat
Status:
OPEN activation policy.

When enabled:
Thread must be Deal/Application scoped.
Cannot expose competitor data.

---

# 7. FINANCE ORGANIZATION ADMIN IA

## IA-FO01 — Dashboard
KPIs:
- Received applications
- Under review
- Documents pending
- Prequalified
- Approved
- Declined
- Offers issued
- Offers selected
- Approval turnaround
- SLA
- Employee workload

---

## IA-FO02 — Application Management
Screens:
- All own-provider applications
- Assignment
- Status
- SLA
- Escalations
- Employee workload

---

## IA-FO03 — Provider Configuration
Status: SHOULD / OD-006 dependent

Screens:
- Integration mode
- Provider IDs
- Rule versions
- API/manual/hybrid status
- SLA configuration
- Active/inactive

---

# 8. PLATFORM ADMIN IA

## IA-A01 — Operations Dashboard
Focus:
Monitor first, intervene only when required.

Widgets:
- Deal funnel
- stuck deals
- SLA breaches
- reservation conflicts
- provider outages
- callback failures
- document bottlenecks
- support/disputes
- manual overrides
- compliance alerts
- transaction/projection health

---

## IA-A02 — Deal Operations Console
Sections:
- Deal search
- current state
- buyer/developer/provider context
- timeline
- reservation
- financing summary
- integrations
- SLA
- documents
- support tickets
- audit
- approved intervention actions

Forbidden:
Direct raw DB edit control.

---

## IA-A03 — Support & Disputes
Screens:
- Queue
- Ticket detail
- Evidence
- Parties
- Escalation
- Resolution
- downstream command
- Audit

---

## IA-A04 — Compliance Operations
Screens:
- Regulatory gate status
- Consent review
- Data subject requests
- License status
- KYC/AML references where applicable
- Privileged access review
- Audit search

---

## IA-A05 — Integration Operations
Screens:
- Provider health
- Callback inbox
- Failed events
- Retry
- Reconciliation
- Mapping errors
- Inventory sync status
- Outbox state

---

# 9. PRIMARY USER FLOWS

## UF-001 — Buyer Inquiry
Project/Unit
→ Ask Developer
→ Create/Link Lead
→ Assigned Sales Agent
→ Chat
→ Qualified / Cold / Lost

---

## UF-002 — Lead to Deal
Qualified Lead
→ Start transaction
→ Reservation/approved trigger
→ Deal created
→ Conversation preserved
→ Deal Tracker begins

---

## UF-003 — Reservation
Unit Detail
→ Reserve
→ Confirm intent
→ Atomic availability check
→ Success OR Conflict
→ Reservation Status
→ Deal update
→ Expiry/Release if applicable

OPEN:
payment/hold specifics.

---

## UF-004 — Financing Calculator
Calculator
→ Inputs
→ Indicative Result
→ Save Snapshot
→ Attach to Lead/Deal
→ Start financing when permitted

---

## UF-005 — Financing Application
Deal
→ Financing CTA
→ Identity/Consent prerequisites
→ Provider selection/routing when approved
→ Application(s)
→ Review
→ Documents
→ Outcome

REGULATORY-GATED:
routing/intermediation details.

---

## UF-006 — Parallel Offers
Multiple Applications
→ Offers Issued
→ Offer Comparison
→ Offer Detail
→ Explicit Select
→ Confirmation
→ Deal OFFER_SELECTED

---

## UF-007 — Missing Documents
Application
→ Finance employee requests document
→ Buyer notified
→ Upload
→ Review
→ Accept / Reject
→ If rejected, replace
→ Continue application

---

## UF-008 — Contract to Completion
Selected Offer / approved non-financed path
→ Contracting
→ Required documents/payment/escrow references where applicable
→ Completion steps
→ Completion evidence
→ Deal COMPLETED
→ Financial/incentive evaluation only if approved

---

## UF-009 — Support / Dispute
Any eligible screen
→ Raise Ticket
→ Acknowledged
→ Review
→ Evidence
→ Resolution
→ Explicit downstream domain action if needed
→ Closed

---

# 10. GLOBAL UI STATES

Every critical screen should handle:

- Loading
- Empty
- Success
- Validation error
- Permission denied
- Not found
- Conflict
- Expired
- Integration unavailable
- Retry available
- Partial/degraded mode
- Regulatory unavailable
- Manual review required

Critical example:
Reservation conflict should clearly say the Unit is no longer available and refresh authoritative availability.

---

# 11. UX SECURITY RULES

1. Hidden button ≠ authorization.
2. Backend policy is authoritative.
3. Cross-tenant IDs must never surface another tenant's data.
4. Developer UI must not contain raw financing fields by default.
5. Sensitive document downloads require fresh authorization check.
6. Platform admin cross-tenant access should visibly indicate privileged context.
7. High-risk manual actions require reason entry before execution.
8. Wallet is read-only projection to normal users.

---

# 12. UX COMPLIANCE RULES

## UX-C01 — Eligibility
Use:
"Indicative"
"Prequalified" only when appropriate

Do not use:
"Approved" unless authoritative approval exists.

## UX-C02 — Sponsored Content
If enabled:
Clearly label sponsored placement.
Do not visually disguise sponsored result as objective recommendation.

## UX-C03 — Off-Plan
Where applicable:
Show required project/license/escrow context according to approved compliance rules.

## UX-C04 — Consent
Consent action must clearly show purpose/recipient/scope.

## UX-C05 — Regulatory Gate
Do not display an enabled actionable control for an unresolved gated feature unless the environment is explicitly non-production/test and clearly marked.

---

# 13. RESPONSIVE / CLIENT CHANNEL

Buyer client architecture:
OPEN — OD-010.

Current design direction:
All core flows should be responsive-web compatible.

If PWA:
Navigation and offline behavior must not create stale reservation/financing truth.

If native later:
Reuse same API/domain/state/permission contracts.

Rule:
Client type must not redefine business behavior.

---

# 14. UX METRICS

Buyer:
- property view → inquiry
- inquiry → qualified
- qualified → reservation
- reservation → financing start
- application completion
- offer comparison engagement
- offer selection
- deal completion
- stage abandonment

Sales:
- lead response time
- lead qualification rate
- follow-up overdue
- reservation conversion

Finance:
- application pickup time
- document turnaround
- time to decision
- time to first offer

Operations:
- stuck-state frequency
- manual override frequency
- support ticket rate
- integration error exposure

---

# 15. UX OPEN ITEMS

UX-OPEN-001 — Buyer ↔ Finance chat activation
Depends on OD-003.

UX-OPEN-002 — Paid/free reservation UI
Depends on OD-004.

UX-OPEN-003 — Reservation countdown/extension
Depends on OD-005.

UX-OPEN-004 — Finance provider selection/routing screen
Depends on OD-007 and OD-001.

UX-OPEN-005 — Offer ordering/ranking/sponsored UI
Depends on OD-008 and OD-001.

UX-OPEN-006 — Final commercial billing surfaces
Depends on OD-009.

UX-OPEN-007 — Native vs Responsive Web/PWA navigation
Depends on OD-010.

UX-OPEN-008 — Bank employee incentive wallet/payout actions
Depends on OD-002.

---

# 16. FORBIDDEN UX PATTERNS

Do NOT:
- show "Approved" for calculator eligibility
- let screens define business states outside approved state machines
- create a reservation flow that assumes success before server confirmation
- show raw financing data to developer roles
- show competitor offers to finance providers
- let users edit Wallet balances
- expose generic "Change Status" dropdowns that bypass state transitions
- create Admin "Edit Anything" screens
- hide regulatory uncertainty behind enabled production buttons
- make UI cache the source of Unit availability truth
- lose conversation history during Lead → Deal conversion

---

# 17. DESIGN HANDOFF REQUIREMENTS

Every screen specification should include:

Screen ID
Actor
Purpose
Entry Points
Preconditions
Displayed Data
Allowed Actions
Permissions
Relevant State
Empty State
Error State
Loading State
Success State
Audit-sensitive Actions
Notifications
API Dependencies
Open Decisions
Acceptance Criteria

Screen design must reference the relevant PRD/SM/AC/API IDs.

---

# 18. UX GOVERNANCE

Before adding/changing a major screen or flow:

1. Check founder decision.
2. Check Decision Registry.
3. Check PRD.
4. Check Business Rules.
5. Check State Machines.
6. Check Permissions.
7. Check API/Data Contracts.
8. Check Workflow Registry.
9. Check QA Acceptance Criteria.
10. Check Compliance/Open Decisions.
11. Identify conflicts explicitly.
12. Never promote prototype behavior into a confirmed product rule without approval.

This registry defines UX/IA behavior only.
It does not independently authorize REGULATORY-GATE functionality.
