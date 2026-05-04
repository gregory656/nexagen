-- Run after the base NexaGen schema and seed data.

alter table dashboards enable row level security;
alter table content_items enable row level security;
alter table user_unlocks enable row level security;
alter table progress enable row level security;
alter table payments enable row level security;

create unique index if not exists payments_transaction_id_key
on payments (transaction_id)
where transaction_id is not null;

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
