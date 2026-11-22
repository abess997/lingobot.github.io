# HESBA IN — COMPLIANCE MATRIX
Version: 1.0
Market: Saudi Arabia

Purpose: Map regulatory/compliance authorities and external control domains to Hesba In features, identify blocking gates, and prevent implementation from assuming legal permissibility.

> This file is a product/compliance control register, not legal advice.
> Current official requirements must be re-verified before implementation or launch.

---

## 1. SAMA — Saudi Central Bank

Status: REGULATORY-GATE
Priority: BLOCKING

Relevant Hesba In areas:
- Financing application routing
- Matching buyers with finance providers
- Finance aggregation/comparison
- Eligibility/prequalification logic
- Finance-offer ranking/recommendation
- Customer financial-data forwarding
- Commercial arrangements with finance providers
- Finance employee incentives

Current control:
Do NOT assume Hesba In is outside SAMA scope merely because it does not lend money.

Evidence:
SAMA licenses entities for finance aggregation services delivered through electronic platforms connecting clients and finance companies and offering customized financing solutions.

Required before finalizing:
- Formal regulatory classification of Hesba In operating model
- Permitted vs licensed activities boundary
- Contract/data-sharing model
- Final rules for recommendation/ranking and incentives

Implementation rule:
No REGULATORY-GATE feature becomes production-confirmed before OD-001 is resolved.

Official sources:
- https://www.sama.gov.sa/en-us/mediacenter/news/pages/news-834.aspx
- https://sama.gov.sa/en-US/Supervision/LicenseEntities/pages/financelicencedentities.aspx

---

## 2. REGA — Real Estate General Authority

Status: CONDITIONAL REGULATORY REQUIREMENTS
Priority: HIGH

Relevant areas:
- Developer/project onboarding
- Project/unit publication
- Off-plan marketing
- Reservation
- Reservation payments
- Escrow references
- Real-estate brokerage/marketing
- Project licensing

Core rule:
Ready-property and off-plan workflows must be separated.

For regulated off-plan projects:
- Applicable project/marketing licenses must be verified.
- Required reservation amounts must follow applicable escrow rules.
- Hesba In must not model itself as owner/custodian of escrow funds unless formally authorized.
- Off-plan reservation/payment workflows must be license-aware.

Important verified point:
REGA's implementing regulations state that where reservation fees are collected during the marketing-license period, they are limited to 5% of unit value and must be deposited into the designated escrow account.

Implementation controls:
ProjectType
LicenseType
LicenseNumber
LicenseStatus
LicenseExpiry
EscrowReference
EscrowStatus
ReservationPaymentMode

Official sources:
- https://rega.gov.sa/en/laws-and-decisions/regulations-and-by-laws/rules/law-of-selling-and-leasing-off-plan-real-estate-projects/
- https://rega.gov.sa/en/laws-and-decisions/regulations-and-by-laws/regulations/implementing-regulations-of-the-off-plan-sale-and-lease-of-real-estate-projects-law/
- https://rega.gov.sa/en/rega-services/platforms/wafi-off-plan-sales-and-lease/

---

## 3. SDAIA / PDPL — Personal Data Protection

Status: CONFIRMED PLATFORM-WIDE CONTROL
Priority: CRITICAL

Relevant areas:
- Identity data
- Financial data
- Credit-related data
- Documents
- Chat
- Consent
- Analytics
- AI
- Data sharing with banks/developers
- Retention/deletion
- Data-subject requests

Core controls:
- Data minimization
- Purpose limitation
- Lawful basis
- Consent where applicable
- Consent auditability
- Controlled disclosure
- Retention governance
- Data-subject rights
- Role/tenant/purpose-based access
- No unnecessary exposure of financing data to developers

Implementation requirements for sensitive fields:
Purpose
LegalBasis
Owner
Recipient
Retention
Restriction/DeletionPolicy
Auditability

Consent record should preserve:
Purpose
DataScope
Recipient
GrantedAt
RevokedAt
PrivacyNoticeVersion

Verified principle:
Official SDAIA guidance/FAQ states collection should be limited to the minimum personal data necessary for specified purposes.

Official sources:
- https://dgp.sdaia.gov.sa/wps/portal/pdp/knowledgecenter/
- https://dgp.sdaia.gov.sa/wps/portal/pdp/knowledgecenter/details/PDPL/

---

## 4. ZATCA — E-Invoicing / Tax

Status: CONDITIONAL COMPLIANCE
Priority: HIGH

Relevant areas:
- SaaS subscriptions
- Fixed platform/service fees
- API/integration fees
- Advertising/premium services
- Enterprise invoices
- Credit/debit adjustments

Core control:
If Hesba In issues invoices subject to Saudi e-invoicing requirements, the invoicing architecture must support FATOORAH-compliant structured electronic invoicing according to the applicable phase/requirements.

Do not treat:
PDF invoice == compliant e-invoice.

Architecture should support:
Invoice
CreditNote
DebitNote
Tax fields
Immutable invoice reference
Integration-ready structured data
Audit trail

Tax treatment of each revenue stream must be reviewed separately.

Official sources:
- https://zatca.gov.sa/en/E-Invoicing/Pages/default.aspx
- https://zatca.gov.sa/en/E-Invoicing/Introduction/Guidelines/Pages/default.aspx
- https://zatca.gov.sa/en/RulesRegulations/Taxes/Pages/E-invoicingbylaw.aspx

---

## 5. Nafath — Identity Integration

Status: INTEGRATION / ACCESS DEPENDENCY
Priority: HIGH

Relevant areas:
- Identity verification
- Account onboarding
- KYC readiness

Control:
Nafath must be modeled as an IdentityVerificationProvider, not hard-coded into the core domain.

Before production:
- Confirm eligibility to integrate
- Confirm integration channel/provider
- Confirm contractual/technical requirements
- Confirm fallback/retry behavior
- Confirm what identity attributes may be stored

Architecture:
IdentityVerificationProvider
→ Nafath
→ Future approved provider

---

## 6. SIMAH — Credit Data Integration

Status: INTEGRATION + REGULATORY/CONTRACTUAL GATE
Priority: HIGH

Relevant areas:
- Credit-related eligibility
- Credit obligations
- Prequalification
- Financing decisions

Control:
Do not assume direct SIMAH access is available to Hesba In.

Before production:
- Confirm legal/contractual access
- Confirm which actor is authorized to request data
- Confirm customer authorization/consent requirements
- Confirm permitted storage/retention
- Confirm whether data is consumed by Hesba In or only by finance providers

Architecture:
CreditDataProvider
→ SIMAH / approved channel
→ Future approved provider

---

## 7. NHC / TechHub

Status: INTEGRATION DEPENDENCY
Priority: MEDIUM-HIGH

Relevant areas:
- Project synchronization
- Unit inventory
- Reservation/update events
- Developer project data

Control:
NHC/TechHub is an integration target, not a core-domain dependency.

Architecture:
PropertyInventoryProvider
→ Hesba Native
→ Developer API
→ NHC/TechHub
→ Batch Import

Before production:
- Confirm partner eligibility/access
- Confirm API/data contracts
- Define source-of-truth ownership
- Define reconciliation behavior
- Define stale/conflicting inventory handling

---

## 8. Sharia Review

Status: BUSINESS MODEL GATE
Priority: HIGH

Relevant areas:
- Revenue model
- Percentage-based commissions
- Financing-related fees
- Employee incentives
- Any fee linked to financing principal

Confirmed guardrail:
Percentage-based financing/loan revenue is NOT the default Hesba In model.

Before adopting percentage-based commercial arrangements:
- Business review
- Saudi regulatory review
- Sharia review
- Tax/accounting review

Preferred candidates:
- SaaS subscriptions
- Fixed platform/service fees
- Usage/API fees
- Enterprise integration fees
- Advertising
- Premium analytics

---

# FEATURE → COMPLIANCE MAP

| Feature | SAMA | REGA | PDPL | ZATCA | Integration Gate |
|---|---|---|---|---|---|
| Buyer onboarding | Review | — | Critical | — | Nafath |
| Financing calculator | Review if decisioning/routing | — | High | — | Bank rules |
| Prequalification | Gate | — | Critical | — | Credit/provider access |
| Parallel financing | Gate | — | Critical | — | Finance providers |
| Offer comparison/ranking | Gate | — | High | — | Finance providers |
| Developer storefront | — | License-aware | Medium | Subscription billing | NHC/API |
| Unit inventory | — | Project-type aware | Low | — | NHC/API |
| Reservation | Possible payment impact | High for off-plan | High | Possible | Payment/provider |
| Escrow tracking | — | Critical where applicable | Medium | — | Bank/REGA refs |
| Buyer↔Bank chat | Gate depending workflow | — | Critical | — | — |
| Document vault | — | — | Critical | — | — |
| Employee incentives | Gate | — | High | Tax review | Employer policy |
| SaaS invoicing | — | — | Medium | Critical | ZATCA solution |
| AI/analytics | Potential if used in finance decisions | — | Critical | — | Model governance |

---

# RELEASE GATES

## Gate G1 — Financing Regulatory Boundary
Owner: Founder + Saudi legal/regulatory counsel
Blocks:
Production financing routing, aggregation, recommendation, and finance-employee incentive model.

## Gate G2 — Off-Plan Reservation / Escrow
Owner: Product + Legal/REGA compliance
Blocks:
Paid off-plan reservation workflows until exact project/license/escrow rules are mapped.

## Gate G3 — Data Governance
Owner: Privacy/Compliance
Blocks:
Production use of sensitive financial/identity data until purpose, access, consent/lawful basis, retention and audit controls are defined.

## Gate G4 — Revenue & Invoicing
Owner: Finance/Tax
Blocks:
Production invoicing until revenue-stream tax treatment and applicable FATOORAH requirements are configured.

## Gate G5 — External Data Access
Owner: Partnerships + Compliance
Blocks:
Nafath/SIMAH/NHC production features until access, contracts, API rights and data handling are confirmed.

---

# UPDATE RULE

Before implementing any compliance-sensitive feature:

1. Identify affected authority/gate.
2. Verify current official source.
3. Record evidence and date checked.
4. Update related Decision Registry item.
5. Update Business Rule/Invariants if needed.
6. Update Open Decision if a gate is resolved.
7. Update PRD/API/Data Model.
8. Preserve old decision history as DEPRECATED when superseded.

Never convert a REGULATORY-GATE into CONFIRMED based only on an AI interpretation.
