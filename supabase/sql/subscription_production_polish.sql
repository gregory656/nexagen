-- NexaGen subscription production polish.
-- This version is safe even when public.subscriptions does not exist yet.

create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  current_plan text default 'none',
  selected_dashboard text,
  selected_trial_language text,
  free_trial_used boolean default false,
  device_fingerprint text,
  created_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_name text,
  plan text,
  status text default 'active',
  active boolean default true,
  is_trial boolean default false,
  starts_at timestamptz default now(),
  started_at timestamptz default now(),
  expires_at timestamptz not null default (now() + interval '1 month'),
  dashboard_access text[] default array['programming']::text[],
  dashboards_access text[],
  language_access text[] default array['python','javascript','java','c','cpp','go','rust','php','swift','kotlin']::text[],
  allowed_languages text[],
  all_access boolean default false,
  amount integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.payment_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  transaction_id text unique,
  plan_name text,
  amount integer,
  status text,
  selected_dashboard text,
  language_access text[],
  invoice_id text,
  tracking_id text,
  created_at timestamptz default now()
);

create table if not exists public.free_trials (
  id uuid primary key default gen_random_uuid(),
  device_fingerprint text unique,
  user_id uuid references auth.users(id) on delete cascade,
  language text,
  dashboard text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

alter table public.subscriptions
  add column if not exists plan_name text,
  add column if not exists plan text,
  add column if not exists status text default 'active',
  add column if not exists active boolean default true,
  add column if not exists is_trial boolean default false,
  add column if not exists starts_at timestamptz default now(),
  add column if not exists started_at timestamptz default now(),
  add column if not exists expires_at timestamptz,
  add column if not exists dashboard_access text[],
  add column if not exists dashboards_access text[],
  add column if not exists language_access text[],
  add column if not exists allowed_languages text[],
  add column if not exists all_access boolean default false,
  add column if not exists amount integer default 0,
  add column if not exists created_at timestamptz default now();

alter table public.payment_logs
  add column if not exists selected_dashboard text,
  add column if not exists language_access text[],
  add column if not exists invoice_id text,
  add column if not exists tracking_id text;

update public.subscriptions
set
  plan_name = coalesce(plan_name, plan, 'starter'),
  plan = coalesce(plan, plan_name, 'starter'),
  status = coalesce(status, case when active is false then 'inactive' else 'active' end),
  active = coalesce(active, status = 'active', true),
  is_trial = coalesce(plan_name, plan) = 'free_trial'
    or exists (
      select 1
      from public.free_trials ft
      where ft.user_id = subscriptions.user_id
    ),
  dashboard_access = coalesce(
    dashboard_access,
    dashboards_access,
    case when coalesce(plan_name, plan) = 'pro' then array['all']::text[] else array['programming']::text[] end
  ),
  dashboards_access = coalesce(dashboards_access, dashboard_access),
  language_access = coalesce(
    language_access,
    allowed_languages,
    case
      when coalesce(plan_name, plan) = 'pro' then array['all']::text[]
      when coalesce(is_trial, false) then coalesce(allowed_languages, language_access, array['python']::text[])
      else array['python','javascript','java','c','cpp','go','rust','php','swift','kotlin']::text[]
    end
  ),
  allowed_languages = coalesce(allowed_languages, language_access),
  all_access = coalesce(all_access, false)
    or coalesce(plan_name, plan) = 'pro'
    or coalesce(dashboard_access, array[]::text[]) @> array['all']::text[]
    or coalesce(language_access, array[]::text[]) @> array['all']::text[],
  started_at = coalesce(started_at, starts_at, created_at, now()),
  starts_at = coalesce(starts_at, started_at, created_at, now()),
  expires_at = coalesce(expires_at, now() + interval '1 month'),
  created_at = coalesce(created_at, now())
where true;

update public.subscriptions s
set
  plan_name = 'free_trial',
  plan = 'free_trial',
  is_trial = true,
  all_access = false,
  dashboard_access = array['programming']::text[],
  dashboards_access = array['programming']::text[],
  language_access = array[coalesce((select ft.language from public.free_trials ft where ft.user_id = s.user_id order by ft.created_at desc limit 1), 'python')]::text[],
  allowed_languages = array[coalesce((select ft.language from public.free_trials ft where ft.user_id = s.user_id order by ft.created_at desc limit 1), 'python')]::text[],
  amount = 0
where exists (
  select 1
  from public.free_trials ft
  where ft.user_id = s.user_id
)
and not exists (
  select 1
  from public.payment_logs pl
  where pl.user_id = s.user_id
    and pl.status in ('complete','completed','success','paid')
);

with latest_paid as (
  select distinct on (user_id)
    user_id,
    case when plan_name = 'pro' then 'pro' else 'starter' end as plan_name,
    coalesce(amount, case when plan_name = 'pro' then 150 else 100 end) as amount
  from public.payment_logs
  where status in ('complete','completed','success','paid')
  order by user_id, created_at desc
)
update public.subscriptions s
set
  plan_name = latest_paid.plan_name,
  plan = latest_paid.plan_name,
  is_trial = false,
  active = true,
  status = 'active',
  amount = latest_paid.amount,
  all_access = latest_paid.plan_name = 'pro',
  dashboard_access = case when latest_paid.plan_name = 'pro' then array['all']::text[] else array['programming']::text[] end,
  dashboards_access = case when latest_paid.plan_name = 'pro' then array['all']::text[] else array['programming']::text[] end,
  language_access = case
    when latest_paid.plan_name = 'pro' then array['all']::text[]
    else array['python','javascript','java','c','cpp','go','rust','php','swift','kotlin']::text[]
  end,
  allowed_languages = case
    when latest_paid.plan_name = 'pro' then array['all']::text[]
    else array['python','javascript','java','c','cpp','go','rust','php','swift','kotlin']::text[]
  end
from latest_paid
where s.user_id = latest_paid.user_id
  and s.status = 'active';

alter table public.subscriptions
  alter column expires_at set not null;

alter table public.subscriptions
  alter column expires_at set default (now() + interval '1 month');

create index if not exists subscriptions_user_status_expires_idx
on public.subscriptions (user_id, status, expires_at desc);

create index if not exists subscriptions_user_active_expires_idx
on public.subscriptions (user_id, active, expires_at desc);

create unique index if not exists payment_logs_transaction_id_key
on public.payment_logs (transaction_id);

create or replace function public.nexagen_normalize_subscription_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.plan_name := coalesce(new.plan_name, new.plan, 'starter');
  new.plan := coalesce(new.plan, new.plan_name);
  new.status := coalesce(new.status, case when new.active is false then 'inactive' else 'active' end);
  new.active := coalesce(new.active, new.status = 'active');
  new.is_trial := coalesce(new.is_trial, new.plan_name = 'free_trial');

  new.dashboard_access := coalesce(
    new.dashboard_access,
    new.dashboards_access,
    case when new.plan_name = 'pro' then array['all']::text[] else array['programming']::text[] end
  );
  new.dashboards_access := coalesce(new.dashboards_access, new.dashboard_access);

  new.language_access := coalesce(
    new.language_access,
    new.allowed_languages,
    case
      when new.plan_name = 'pro' then array['all']::text[]
      when new.is_trial then coalesce(new.allowed_languages, new.language_access, array['python']::text[])
      else array['python','javascript','java','c','cpp','go','rust','php','swift','kotlin']::text[]
    end
  );
  new.allowed_languages := coalesce(new.allowed_languages, new.language_access);

  new.all_access := coalesce(new.all_access, false)
    or new.plan_name = 'pro'
    or new.dashboard_access @> array['all']::text[]
    or new.language_access @> array['all']::text[];

  if new.status = 'active' and new.active then
    update public.subscriptions
    set status = 'inactive', active = false
    where user_id = new.user_id
      and id <> new.id
      and status = 'active'
      and coalesce(active, true);
  end if;

  return new;
end;
$$;

drop trigger if exists subscriptions_single_active_before_insert on public.subscriptions;

create trigger subscriptions_single_active_before_insert
before insert on public.subscriptions
for each row
execute function public.nexagen_normalize_subscription_before_insert();

alter table public.user_profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_logs enable row level security;

drop policy if exists "Users view own profile" on public.user_profiles;
create policy "Users view own profile"
on public.user_profiles
for select
using (auth.uid() = id);

drop policy if exists "Users insert own profile" on public.user_profiles;
create policy "Users insert own profile"
on public.user_profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users manage own profile" on public.user_profiles;
create policy "Users manage own profile"
on public.user_profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users view own subscriptions" on public.subscriptions;
create policy "Users view own subscriptions"
on public.subscriptions
for select
using (auth.uid() = user_id);

drop policy if exists "Users view own payment logs" on public.payment_logs;
create policy "Users view own payment logs"
on public.payment_logs
for select
using (auth.uid() = user_id);
