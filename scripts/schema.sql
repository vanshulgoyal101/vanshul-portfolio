-- Blog view-count schema for Supabase.
-- Apply with: node --env-file=.env scripts/db.mjs scripts/schema.sql
-- Idempotent: safe to run more than once.

-- 1. Counts table
create table if not exists public.blog_views (
  slug  text primary key,
  views integer not null default 0
);

-- 2. Lock it down, then allow anonymous *reads* only
alter table public.blog_views enable row level security;

drop policy if exists "Public can read view counts" on public.blog_views;
create policy "Public can read view counts"
  on public.blog_views for select
  to anon
  using (true);

-- 3. The only way anon can write is through this controlled function.
--    SECURITY DEFINER lets it upsert without granting anon direct write access.
create or replace function public.increment_blog_view(post_slug text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  insert into public.blog_views (slug, views)
    values (post_slug, 1)
  on conflict (slug)
    do update set views = public.blog_views.views + 1
  returning views into new_count;
  return new_count;
end;
$$;

grant execute on function public.increment_blog_view(text) to anon;
