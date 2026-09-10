-- Run this script in Supabase SQL Editor.

create table if not exists public.site_content (
  id text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id text primary key,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key,
  title text not null,
  location text not null,
  description text not null,
  image text,
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.pages enable row level security;
alter table public.projects enable row level security;

create policy "Public can read site content"
  on public.site_content for select using (true);

create policy "Public can read pages"
  on public.pages for select using (true);

create policy "Public can read projects"
  on public.projects for select using (true);

create policy "Authenticated users can manage site content"
  on public.site_content for all to authenticated using (true) with check (true);

create policy "Authenticated users can manage pages"
  on public.pages for all to authenticated using (true) with check (true);

create policy "Authenticated users can manage projects"
  on public.projects for all to authenticated using (true) with check (true);

insert into public.site_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;
