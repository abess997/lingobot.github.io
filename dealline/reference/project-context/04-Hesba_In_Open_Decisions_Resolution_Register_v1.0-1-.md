# HESBA IN — OPEN DECISIONS RESOLUTION REGISTER
Version: 1.0

Purpose: Track unresolved decisions, define required evidence, and prevent assumptions from becoming implementation facts.

## Resolution Rule
An OPEN item may become CONFIRMED only after:
1. Required evidence is collected.
2. Conflicts with existing decisions are checked.
3. Product/Business/Architecture/Compliance impact is reviewed.
4. Decision Registry and Business Rules are updated.
5. Superseded decisions are marked DEPRECATED.

## OD-001 — SAMA Regulatory Classification
Status: REGULATORY-GATE
Priority: BLOCKING
Question: What is the final regulatory classification of Hesba In's financing-related activities?
Affected: financing routing, bank matching, eligibility, offer aggregation/comparison, recommendation/ranking, customer financial-data sharing, commercial model, finance employee incentives.
Required evidence: current official SAMA requirements + formal Saudi legal/regulatory opinion + final operating model.
Resolution output: Approved Regulatory Operating Boundary.
Rule: Do not finalize regulated workflows before resolution.

## OD-002 — Bank Employee Incentive Model
Status: REGULATORY-GATE
Priority: HIGH
Question: Can Hesba In provide cash/equivalent rewards to employees of banks/finance companies, and under what structure?
Required review: regulatory, employer policy, conflict of interest, contract structure, tax/accounting, Sharia.
Current rule: Wallet/ledger infrastructure may exist; cash incentive activation is prohibited until resolved.

## OD-003 — Buyer ↔ Finance Employee Chat Trigger
Status: PRODUCT DECISION REQUIRED
Priority: HIGH
Confirmed: Buyer ↔ Developer Agent chat may occur before reservation.
Working assumption: Buyer ↔ Finance Employee chat starts after a qualified reservation/deal trigger.
Options:
A. After reservation
B. After financing application starts
C. After finance provider accepts assignment
D. Limited pre-reservation finance inquiry
Evaluate: user friction, privacy, spam/load, compliance, lead quality, SLA ownership.

## OD-004 — Reservation Hold vs Paid Reservation
Status: PRODUCT + REGULATORY DECISION REQUIRED
Priority: HIGH
Options:
A. Free temporary hold
B. Paid reservation
C. External payment reference
D. Different policy by project
Evaluate: developer contracts, refunds/cancellation, ready vs off-plan, payment/compliance scope, UX.
Invariant: Only one active reservation per Unit.

## OD-005 — Reservation Hold Duration
Status: BUSINESS RULE REQUIRED
Priority: HIGH
Do not hard-code a universal duration yet.
Preferred architecture: configurable by project/organization, with platform maximum where required.
Required fields:
HoldStartedAt
ExpiresAt
ExpiryPolicyVersion
ExtensionCount
ReleasedAt

## OD-006 — Finance Provider Integration Mode for MVP
Status: ARCHITECTURE DECISION REQUIRED
Priority: HIGH
Options:
A. Direct API
B. Manual finance-employee entry
C. Rules engine
D. Hybrid
Recommended MVP direction: Hybrid via FinancingProviderAdapter.
Final decision requires partner/API availability, cost, legal access, operational SLA, implementation effort.

## OD-007 — Finance Provider Selection / Routing
Status: PRODUCT DECISION REQUIRED
Priority: HIGH
Options:
A. Buyer selects providers
B. Platform routes to eligible providers
C. Broadcast to all contracted providers
D. Hybrid: platform suggests, buyer confirms
Recommended hypothesis: Hybrid — eligible shortlist + explicit buyer confirmation, subject to regulatory approval.
Must preserve consent, purpose limitation, audit trail, and no unauthorized data sharing.

## OD-008 — Financing Offer Ordering
Status: PRODUCT + COMPLIANCE DECISION REQUIRED
Priority: HIGH
Required separation: Objective comparison logic ≠ Sponsored placement.
Possible objective factors:
- Monthly payment
- Total financing cost
- Rate/APR equivalent where applicable
- Down payment
- Term
- Fees
- Eligibility/conditions
- Offer expiry
Sponsored content must be clearly identified and must not secretly change eligibility/approval logic.
Final ranking logic requires compliance review.

## OD-009 — Final Commercial Fee Model
Status: BUSINESS MODEL DECISION REQUIRED
Priority: HIGH
Actors:
- Developer
- Finance Provider
- Buyer
- Enterprise/API Partner
Confirmed guardrail: Do not default to percentage of loan principal, financing amount, property value, or transaction value.
Models to test:
- SaaS subscription
- Fixed platform/service fee
- Usage/API fee
- Enterprise integration fee
- Advertising/premium placement
- Premium analytics
Required before confirmation: unit economics, willingness-to-pay, tax/accounting, regulatory and Sharia review.

## OD-010 — MVP Client Application Channel
Status: PRODUCT / COST DECISION REQUIRED
Priority: MEDIUM
Options:
A. Native iOS + Android
B. Responsive Web
C. PWA
D. Responsive Web/PWA first, native later
Recommended MVP hypothesis: Responsive Web/PWA first unless validated native requirements exist.
Final decision requires prototype findings, user behavior, device-capability needs, budget, launch timeline.

## Resolution Order
1. OD-001 — SAMA Regulatory Classification
2. OD-002 — Bank Employee Incentives
3. OD-004 — Reservation Hold vs Paid Reservation
4. OD-003 — Finance Chat Trigger
5. OD-007 — Finance Provider Routing
6. OD-008 — Offer Ordering
7. OD-009 — Commercial Fee Model
8. OD-006 — MVP Integration Mode
9. OD-005 — Reservation Hold Duration
10. OD-010 — MVP Application Channel

Reason: regulatory/business-boundary decisions should precede detailed implementation choices.

## Update Requirement
When an item is resolved:
1. Change status to CONFIRMED.
2. Add Final Decision.
3. Add Decision Date.
4. Add Owner.
5. Add Evidence/Source.
6. Update `Hesba_In_Decision_Registry_v1.0.md`.
7. Update `Hesba_In_Business_Rules_Invariants_Registry_v1.0.md`.
8. Update affected PRD / Domain Model / ADR.
9. Mark superseded assumptions DEPRECATED.

Never delete historical decisions.
