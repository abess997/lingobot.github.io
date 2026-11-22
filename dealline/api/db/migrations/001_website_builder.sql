-- Deal Line: website builder backend
-- Times are timestamptz (UTC). Money is integer halalas + currency.
-- Tenant isolation: row level security keyed on the setting app.org_id,
-- set per transaction by the data layer. The app runs tenant queries as
-- the dealline_app role (not the table owner), so RLS always applies.

do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'dealline_app') then
    create role dealline_app nologin;
  end if;
end $$;

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create or replace function current_org() returns uuid language sql stable as $$
  select nullif(current_setting('app.org_id', true), '')::uuid
$$;

-- ---------- identity (not tenant-scoped) ----------
create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(email) and position('@' in email) > 1),
  password_hash text not null,
  name text not null check (char_length(name) between 1 and 120),
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index users_email_key on users (email);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index on sessions (user_id);

create table auth_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  purpose text not null check (purpose in ('verify_email','reset_password')),
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index on auth_tokens (user_id);

create table orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  -- رقم رخصة فال للمنشأة/الوسيط: يظهر في كل إعلان (اللائحة التنظيمية للتسويق والإعلانات العقارية)
  fal_license text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table memberships (
  org_id uuid not null references orgs(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index on memberships (user_id);

-- ---------- tenant-scoped ----------
create table sites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null unique references orgs(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]([a-z0-9-]{1,38}[a-z0-9])$'),
  title text not null check (char_length(title) between 1 and 80),
  tagline text check (char_length(tagline) <= 160),
  template text not null default 'classic' check (template in ('classic','modern','minimal')),
  logo_url text,
  theme jsonb not null default '{}',           -- {primary, accent, font} validated by the API
  seo jsonb not null default '{}',             -- {title, description, og_image}
  contact_phone text,
  contact_whatsapp text,
  contact_email text,
  published boolean not null default false,
  accept_deposits boolean not null default false,
  deposit_halalas integer check (deposit_halalas is null or deposit_halalas between 100 and 100000000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deposit_amount_when_on check (not accept_deposits or deposit_halalas is not null)
);

create table site_domains (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  site_id uuid not null references sites(id) on delete cascade,
  hostname text not null unique check (hostname = lower(hostname) and hostname ~ '^[a-z0-9.-]+\.[a-z]{2,}$'),
  verify_token text not null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
create index on site_domains (org_id);
create index on site_domains (site_id);

create table listings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  description text check (char_length(description) <= 5000),
  purpose text not null check (purpose in ('sale','rent')),
  property_type text not null check (property_type in
    ('apartment','villa','floor','land','building','office','shop','warehouse','other')),
  price_halalas bigint not null check (price_halalas >= 0),
  currency text not null default 'SAR' check (currency = 'SAR'),
  city text not null,
  district text,
  area_sqm numeric(12,2) check (area_sqm > 0),
  bedrooms smallint check (bedrooms between 0 and 50),
  bathrooms smallint check (bathrooms between 0 and 50),
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  images jsonb not null default '[]',
  -- ترخيص الإعلان العقاري المستقل (هيئة العقار) — شرط للنشر
  ad_license_number text,
  ad_license_expires_on date,
  status text not null default 'draft'
    check (status in ('draft','published','reserved','sold','archived')),
  show_on_site boolean not null default true,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_needs_ad_license check (
    status not in ('published','reserved')
    or (ad_license_number is not null and ad_license_expires_on is not null)
  )
);
create index on listings (org_id, status);
create index on listings (org_id, created_at desc);
create index on listings (created_by);

create table leads (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  site_id uuid references sites(id) on delete set null,
  listing_id uuid references listings(id) on delete set null,
  name text not null check (char_length(name) between 1 and 120),
  phone text not null,
  email text,
  message text check (char_length(message) <= 2000),
  source text not null default 'website' check (source in ('website','manual','whatsapp')),
  status text not null default 'new' check (status in ('new','contacted','qualified','won','lost')),
  assigned_to uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on leads (org_id, status, created_at desc);
create index on leads (listing_id);
create index on leads (site_id);
create index on leads (assigned_to);

create table reservations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  listing_id uuid not null references listings(id) on delete restrict,
  lead_id uuid references leads(id) on delete set null,
  amount_halalas integer not null check (amount_halalas > 0),
  currency text not null default 'SAR' check (currency = 'SAR'),
  provider text not null default 'moyasar' check (provider in ('moyasar')),
  provider_payment_id text unique,
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded','refund_due')),
  -- refund_due: paid, but the unit was already reserved by someone else (race). Owner refunds from Moyasar.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on reservations (org_id, created_at desc);
create index on reservations (listing_id);
create index on reservations (lead_id);
-- لا يُحجز العقار نفسه مرتين: حجز مدفوع واحد فقط لكل عقار
create unique index one_paid_reservation_per_listing on reservations (listing_id) where status = 'paid';

-- idempotency for payment webhooks (provider retries)
create table webhook_events (
  provider text not null,
  event_id text not null,
  type text not null,
  received_at timestamptz not null default now(),
  primary key (provider, event_id)
);

-- ---------- updated_at triggers ----------
do $$ declare t text; begin
  foreach t in array array['users','orgs','sites','listings','leads','reservations'] loop
    execute format('create trigger %I_updated before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- ---------- row level security ----------
do $$ declare t text; begin
  foreach t in array array['sites','site_domains','listings','leads','reservations'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy org_isolation on %I using (org_id = current_org()) with check (org_id = current_org())', t);
  end loop;
end $$;

grant usage on schema public to dealline_app;
grant select, insert, update, delete on all tables in schema public to dealline_app;
grant execute on function current_org() to dealline_app;
