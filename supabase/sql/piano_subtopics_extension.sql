-- SUBTOPICS
create table if not exists subtopics (
  id uuid primary key default gen_random_uuid(),
  dashboard_id uuid references dashboards(id) on delete cascade,
  title text,
  description text,
  price integer default 100,
  is_locked boolean default true,
  created_at timestamp default now()
);

-- USER SUBTOPIC UNLOCKS
create table if not exists user_subtopic_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  subtopic_id uuid references subtopics(id) on delete cascade,
  created_at timestamp default now(),
  unique(user_id, subtopic_id)
);

-- LINK CONTENT TO SUBTOPICS
alter table content_items
add column if not exists subtopic_id uuid references subtopics(id) on delete cascade;

-- USER LEVEL
create table if not exists user_levels (
  user_id uuid primary key references auth.users(id),
  level text check (level in ('beginner','intermediate','pro')),
  created_at timestamp default now()
);

alter table subtopics enable row level security;
alter table user_subtopic_unlocks enable row level security;
alter table user_levels enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'subtopics' and policyname = 'Anyone can read subtopics') then
    create policy "Anyone can read subtopics" on subtopics for select using (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'user_subtopic_unlocks' and policyname = 'Users can read own subtopic unlocks') then
    create policy "Users can read own subtopic unlocks" on user_subtopic_unlocks for select using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'user_subtopic_unlocks' and policyname = 'Users can insert own subtopic unlocks') then
    create policy "Users can insert own subtopic unlocks" on user_subtopic_unlocks for insert with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'user_levels' and policyname = 'Users can read own level') then
    create policy "Users can read own level" on user_levels for select using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'user_levels' and policyname = 'Users can upsert own level') then
    create policy "Users can upsert own level" on user_levels for insert with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'user_levels' and policyname = 'Users can update own level') then
    create policy "Users can update own level" on user_levels for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;
