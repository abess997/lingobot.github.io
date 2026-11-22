-- Deal Line: off-plan sales (البيع على الخارطة)
-- Journey: lead -> hold -> reserved -> contracted -> handed over,
-- with exceptions: cancelled, defaulted, transferred.
-- Buyer money goes to the project's escrow account (Wafi). Deal Line does not collect it;
-- it records each bank transfer (amount, date, reference) against an installment.

create table projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  description text check (char_length(description) <= 5000),
  city text not null,
  district text,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  images jsonb not null default '[]',
  -- Wafi off-plan sales license for the project
  wafi_license_number text,
  -- escrow account the buyers pay into
  escrow_bank text,
  escrow_iban text check (escrow_iban is null or escrow_iban ~ '^SA[0-9]{22}$'),
  -- REGA ad license (same rule as listings)
  ad_license_number text,
  ad_license_expires_on date,
  progress_pct numeric(5,2) not null default 0 check (progress_pct between 0 and 100),
  expected_handover_on date,
  status text not null default 'draft' check (status in ('draft','selling','sold_out','completed','archived')),
  show_on_site boolean not null default true,
  hold_days smallint not null default 3 check (hold_days between 1 and 30),
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint selling_needs_licenses check (
    status not in ('selling','sold_out')
    or (wafi_license_number is not null and escrow_iban is not null
        and ad_license_number is not null and ad_license_expires_on is not null)
  )
);
create index on projects (org_id, status);
create index on projects (created_by);

-- each consultant's progress report (the basis for milestone installments)
create table project_progress (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  pct numeric(5,2) not null check (pct between 0 and 100),
  report_ref text not null check (char_length(report_ref) between 1 and 120),
  reported_on date not null,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on project_progress (project_id, reported_on desc);
create index on project_progress (org_id);

create table units (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  code text not null check (char_length(code) between 1 and 30),
  unit_type text not null check (unit_type in ('apartment','villa','townhouse','floor','office','shop','other')),
  building text,
  floor smallint check (floor between -5 and 200),
  area_sqm numeric(10,2) not null check (area_sqm > 0),
  bedrooms smallint check (bedrooms between 0 and 20),
  price_halalas bigint not null check (price_halalas > 0),
  status text not null default 'available'
    check (status in ('available','held','reserved','sold','handed_over','blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, code)
);
create index on units (org_id, status);
create index on units (project_id, status);

create table payment_plans (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (project_id, name)
);
create index on payment_plans (org_id);

-- one plan step. Shares are basis points (10000 = 100%); the API makes them add up to exactly 10000.
create table payment_plan_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  plan_id uuid not null references payment_plans(id) on delete cascade,
  seq smallint not null check (seq between 1 and 60),
  label text not null check (char_length(label) between 1 and 80),
  share_bp integer not null check (share_bp between 1 and 10000),
  trigger text not null check (trigger in ('on_booking','on_contract','after_days','at_progress','on_handover')),
  days_after_contract integer check (days_after_contract between 1 and 3650),
  at_progress_pct numeric(5,2) check (at_progress_pct > 0 and at_progress_pct <= 100),
  unique (plan_id, seq),
  constraint trigger_params check (
    (trigger = 'after_days') = (days_after_contract is not null)
    and (trigger = 'at_progress') = (at_progress_pct is not null)
  )
);
create index on payment_plan_items (org_id);

create table offplan_deals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  unit_id uuid not null references units(id) on delete restrict,
  plan_id uuid not null references payment_plans(id) on delete restrict,
  lead_id uuid references leads(id) on delete set null,
  buyer_name text not null check (char_length(buyer_name) between 1 and 120),
  buyer_phone text not null,
  buyer_email text,
  price_halalas bigint not null check (price_halalas > 0),  -- locked at hold time
  status text not null default 'held'
    check (status in ('held','reserved','contracted','handed_over','cancelled','defaulted','transferred')),
  hold_expires_at timestamptz,
  contract_ref text,
  contract_signed_on date,
  handed_over_on date,
  transferred_from uuid references offplan_deals(id) on delete set null,
  sales_rep uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contract_fields check (status not in ('contracted','handed_over') or (contract_ref is not null and contract_signed_on is not null))
);
create index on offplan_deals (org_id, status);
create index on offplan_deals (unit_id);
create index on offplan_deals (plan_id);
create index on offplan_deals (lead_id);
create index on offplan_deals (sales_rep);
create index on offplan_deals (transferred_from);
-- a unit can only be in one open deal at a time (the double-sale guard)
create unique index one_open_deal_per_unit on offplan_deals (unit_id)
  where status in ('held','reserved','contracted','handed_over','defaulted');

create table installments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  deal_id uuid not null references offplan_deals(id) on delete cascade,
  seq smallint not null,
  label text not null,
  amount_halalas bigint not null check (amount_halalas >= 0),
  trigger text not null check (trigger in ('on_booking','on_contract','after_days','at_progress','on_handover')),
  days_after_contract integer,
  at_progress_pct numeric(5,2),
  due_on date,                       -- null until its trigger happens
  paid_halalas bigint not null default 0 check (paid_halalas >= 0),
  status text not null default 'scheduled'
    check (status in ('scheduled','due','overdue','paid','waived','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (deal_id, seq)
);
create index on installments (org_id, status, due_on);
create index on installments (deal_id);

-- each transfer into the escrow account, as reported by the bank statement
create table escrow_receipts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  installment_id uuid not null references installments(id) on delete restrict,
  amount_halalas bigint not null check (amount_halalas > 0),
  received_on date not null,
  bank_ref text not null check (char_length(bank_ref) between 3 and 80),
  recorded_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (org_id, bank_ref)               -- the same transfer cannot be counted twice
);
create index on escrow_receipts (installment_id);
create index on escrow_receipts (recorded_by);

-- audit trail for every state change, exceptions included
create table deal_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  deal_id uuid not null references offplan_deals(id) on delete cascade,
  type text not null,
  note text check (char_length(note) <= 1000),
  actor uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index on deal_events (deal_id, created_at);
create index on deal_events (org_id);
create index on deal_events (actor);

alter table leads add column project_id uuid references projects(id) on delete set null;
alter table leads add column unit_id uuid references units(id) on delete set null;
create index on leads (project_id);
create index on leads (unit_id);

do $$ declare t text; begin
  foreach t in array array['projects','units','offplan_deals','installments'] loop
    execute format('create trigger %I_updated before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
  foreach t in array array['projects','project_progress','units','payment_plans','payment_plan_items',
                           'offplan_deals','installments','escrow_receipts','deal_events'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy org_isolation on %I using (org_id = current_org()) with check (org_id = current_org())', t);
  end loop;
end $$;

grant select, insert, update, delete on all tables in schema public to dealline_app;
