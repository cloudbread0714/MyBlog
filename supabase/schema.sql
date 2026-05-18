-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null default '',
  tags text[] not null default '{}',
  thumbnail text,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists page_contents (
  slug text primary key,
  content text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null default '',
  stack text[] not null default '{}',
  role text not null default '',
  content text not null default '',
  images text[] not null default '{}',
  github_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at();

create trigger page_contents_updated_at
  before update on page_contents
  for each row execute function update_updated_at();

alter table posts enable row level security;
alter table page_contents enable row level security;
alter table projects enable row level security;

create policy "Public read posts" on posts for select using (true);
create policy "Auth write posts" on posts for all using (auth.role() = 'authenticated');

create policy "Public read projects" on projects for select using (true);
create policy "Auth write projects" on projects for all using (auth.role() = 'authenticated');

create policy "Public read page_contents" on page_contents for select using (true);
create policy "Auth write page_contents" on page_contents for all using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "Public read images" on storage.objects
  for select using (bucket_id = 'images');

create policy "Auth upload images" on storage.objects
  for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');

create policy "Auth update images" on storage.objects
  for update using (bucket_id = 'images' and auth.role() = 'authenticated');

create policy "Auth delete images" on storage.objects
  for delete using (bucket_id = 'images' and auth.role() = 'authenticated');
