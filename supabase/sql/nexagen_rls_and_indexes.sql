-- Run after the base NexaGen schema and seed data.

alter table dashboards enable row level security;
alter table content_items enable row level security;
alter table user_unlocks enable row level security;
alter table progress enable row level security;
alter table payments enable row level security;

create unique index if not exists payments_transaction_id_key
on payments (transaction_id);

create policy "Public can read dashboards"
on dashboards
for select
using (true);

create policy "Public can read content"
on content_items
for select
using (true);

create policy "Users can view their unlocks"
on user_unlocks
for select
using (auth.uid() = user_id);

create policy "Users can view their payments"
on payments
for select
using (auth.uid() = user_id);

create policy "Users can read their progress"
on progress
for select
using (auth.uid() = user_id);

create policy "Users can insert their progress"
on progress
for insert
with check (auth.uid() = user_id);

create policy "Users can update their progress"
on progress
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their progress"
on progress
for delete
using (auth.uid() = user_id);

-- Launch SaaS subscription system.

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  current_plan text default 'none',
  selected_dashboard text,
  selected_trial_language text,
  free_trial_used boolean default false,
  device_fingerprint text,
  created_at timestamp default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_name text,
  dashboard_access text[],
  language_access text[],
  status text default 'active',
  amount integer,
  starts_at timestamp default now(),
  expires_at timestamp,
  created_at timestamp default now()
);

create table if not exists payment_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  transaction_id text unique,
  plan_name text,
  amount integer,
  status text,
  created_at timestamp default now()
);

create table if not exists free_trials (
  id uuid primary key default gen_random_uuid(),
  device_fingerprint text unique,
  user_id uuid references auth.users(id),
  language text,
  dashboard text,
  expires_at timestamp,
  created_at timestamp default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamp default now()
);

alter table user_profiles enable row level security;
alter table subscriptions enable row level security;
alter table payment_logs enable row level security;
alter table free_trials enable row level security;
alter table newsletter_subscribers enable row level security;

create policy "Users view own profile"
on user_profiles
for select
using (auth.uid() = id);

create policy "Users insert own profile"
on user_profiles
for insert
with check (auth.uid() = id);

create policy "Users manage own profile"
on user_profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users view own subscriptions"
on subscriptions
for select
using (auth.uid() = user_id);

create policy "Users view own payment logs"
on payment_logs
for select
using (auth.uid() = user_id);

create policy "Users view own trials"
on free_trials
for select
using (auth.uid() = user_id);

create policy "Users create own trials"
on free_trials
for insert
with check (auth.uid() = user_id);

create policy "Anyone can subscribe to newsletter"
on newsletter_subscribers
for insert
with check (true);
