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

drop policy if exists "Public can read site content" on public.site_content;
drop policy if exists "Public can read pages" on public.pages;
drop policy if exists "Public can read projects" on public.projects;
drop policy if exists "Authenticated users can manage site content" on public.site_content;
drop policy if exists "Authenticated users can manage pages" on public.pages;
drop policy if exists "Authenticated users can manage projects" on public.projects;

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

insert into public.pages (id, name, slug)
values
  ('home', 'Home', 'home'),
  ('about', 'About', 'about'),
  ('projects', 'Projects', 'projects'),
  ('contact', 'Contact', 'contact')
on conflict (id) do nothing;

insert into public.projects (id, title, location, description, image)
values (
  'saninten-airbnb',
  'Saninten airbnb',
  'Bandung, West Java',
  'A quiet luxury retreat designed around climate, material warmth, and daily rituals.',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920'
)
on conflict (id) do nothing;
