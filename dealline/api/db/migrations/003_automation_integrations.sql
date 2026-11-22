-- Deal Line: automation (rules -> tasks / WhatsApp / email) and integrations
-- (WhatsApp Business Cloud API, outbound webhooks for Zapier/Make/n8n, public API keys).
-- Booking.com and Airbnb are out of scope by decision.

-- ---------- lead source tracking ----------
alter table leads drop constraint leads_source_check;
alter table leads add constraint leads_source_check check (source in ('website','manual','whatsapp','api'));
alter table leads add column source_channel text check (source_channel ~ '^[a-z0-9_-]{2,30}$'); -- snapchat, tiktok, google, x, referral, or custom
alter table leads add column utm_source text check (char_length(utm_source) <= 100);
alter table leads add column utm_medium text check (char_length(utm_medium) <= 100);
alter table leads add column utm_campaign text check (char_length(utm_campaign) <= 150);
create index on leads (org_id, source_channel);

-- ---------- event outbox (written in the same transaction as the change) ----------
create table events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  type text not null check (type ~ '^[a-z_]+\.[a-z_]+$'),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);
create index events_pending on events (created_at) where processed_at is null;
create index on events (org_id, created_at desc);

-- ---------- automation ----------
create table automation_rules (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  trigger text not null check (trigger in (
    'lead.created','listing.published','reservation.paid','deal.held','deal.contracted',
    'installment.due_soon','installment.overdue','whatsapp.received')),
  conditions jsonb not null default '{}',   -- {"lead.source_channel": "snapchat", "days": 3}
  actions jsonb not null,                    -- validated by the API
  active boolean not null default true,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on automation_rules (org_id, trigger) where active;
create index on automation_rules (created_by);

create table automation_runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  rule_id uuid not null references automation_rules(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  status text not null check (status in ('done','failed','skipped')),
  detail text,
  created_at timestamptz not null default now(),
  unique (rule_id, event_id)                 -- a rule runs once per event
);
create index on automation_runs (org_id, created_at desc);
create index on automation_runs (event_id);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text check (char_length(description) <= 2000),
  due_at timestamptz,
  assigned_to uuid references users(id) on delete set null,
  status text not null default 'open' check (status in ('open','done','cancelled')),
  related_type text check (related_type in ('lead','listing','deal','installment','reservation')),
  related_id uuid,
  rule_id uuid references automation_rules(id) on delete set null,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on tasks (org_id, status, due_at);
create index on tasks (assigned_to, status);
create index on tasks (rule_id);
create index on tasks (created_by);

-- ---------- WhatsApp Business (Cloud API) ----------
create table whatsapp_accounts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null unique references orgs(id) on delete cascade,
  phone_number_id text not null unique check (phone_number_id ~ '^[0-9]{5,30}$'),
  waba_id text check (waba_id ~ '^[0-9]{5,30}$'),
  display_phone text,
  access_token_enc text not null,            -- AES-256-GCM with SECRETS_KEY
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  direction text not null check (direction in ('in','out')),
  wa_message_id text unique,
  phone text not null,
  kind text not null default 'text' check (kind in ('text','template','other')),
  body text check (char_length(body) <= 4096),
  template_name text,
  status text not null check (status in ('queued','sent','delivered','read','failed','received')),
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on whatsapp_messages (org_id, phone, created_at desc);
create index on whatsapp_messages (lead_id, created_at);

-- ---------- outbound webhooks ----------
create table webhook_endpoints (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  url text not null check (url ~ '^https://' and char_length(url) <= 500),
  secret_enc text not null,
  event_types text[] not null check (cardinality(event_types) between 1 and 20),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index on webhook_endpoints (org_id) where active;

create table webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  endpoint_id uuid not null references webhook_endpoints(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','delivered','dead')),
  attempts smallint not null default 0,
  next_attempt_at timestamptz not null default now(),
  last_status integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (endpoint_id, event_id)
);
create index webhook_deliveries_due on webhook_deliveries (next_attempt_at) where status = 'pending';
create index on webhook_deliveries (org_id);
create index on webhook_deliveries (event_id);

-- ---------- public API keys ----------
create table api_keys (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  prefix text not null unique,               -- shown in the dashboard to tell keys apart
  key_hash text not null unique,             -- sha256 of the full key; the key itself is shown once
  scopes text[] not null check (scopes <@ array['listings:read','listings:write','leads:read','leads:write','projects:read']::text[]),
  created_by uuid references users(id) on delete set null,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index on api_keys (org_id);
create index on api_keys (created_by);

do $$ declare t text; begin
  foreach t in array array['automation_rules','tasks','whatsapp_accounts','whatsapp_messages','webhook_deliveries'] loop
    execute format('create trigger %I_updated before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
  foreach t in array array['events','automation_rules','automation_runs','tasks','whatsapp_accounts','whatsapp_messages',
                           'webhook_endpoints','webhook_deliveries','api_keys'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy org_isolation on %I using (org_id = current_org()) with check (org_id = current_org())', t);
  end loop;
end $$;

grant select, insert, update, delete on all tables in schema public to dealline_app;
