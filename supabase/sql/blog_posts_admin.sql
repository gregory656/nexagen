-- Blog dashboard posts.
-- Run this in Supabase SQL Editor after the existing NexaGen schema migrations.

create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'Learning',
  excerpt text not null,
  content text not null,
  image_url text,
  read_time_minutes integer not null default 4 check (read_time_minutes > 0),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz not null default now(),
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_published_at_idx
on public.blog_posts (status, published_at desc);

alter table public.blog_posts enable row level security;

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
on public.blog_posts
for select
using (
  status = 'published'
  and published_at <= now()
);

drop policy if exists "NexaGen admin can read all blog posts" on public.blog_posts;
create policy "NexaGen admin can read all blog posts"
on public.blog_posts
for select
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'gregorystephen2006@gmail.com');

drop policy if exists "NexaGen admin can create blog posts" on public.blog_posts;
create policy "NexaGen admin can create blog posts"
on public.blog_posts
for insert
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'gregorystephen2006@gmail.com');

drop policy if exists "NexaGen admin can update blog posts" on public.blog_posts;
create policy "NexaGen admin can update blog posts"
on public.blog_posts
for update
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'gregorystephen2006@gmail.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'gregorystephen2006@gmail.com');

drop policy if exists "NexaGen admin can delete blog posts" on public.blog_posts;
create policy "NexaGen admin can delete blog posts"
on public.blog_posts
for delete
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'gregorystephen2006@gmail.com');

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_blog_posts_updated_at();
