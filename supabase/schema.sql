-- 최초 1회: 빈 Supabase 프로젝트에 실행
-- 이미 테이블이 있으면 schema.sql 전체 대신 features.sql 만 실행하세요.

create extension if not exists "uuid-ossp";

create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  title_en text,
  content text not null default '',
  content_en text,
  tags text[] not null default '{}',
  category text not null default 'study',
  thumbnail text,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists about_profile (
  id int primary key default 1 check (id = 1),
  languages text[] not null default '{}',
  frontend text[] not null default '{}',
  backend_database text[] not null default '{}',
  cloud_infra text[] not null default '{}',
  currently_learning text[] not null default '{}',
  github_url text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

create table if not exists page_contents (
  slug text primary key,
  content text not null default '',
  content_en text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  name_en text,
  description text not null default '',
  description_en text,
  stack text[] not null default '{}',
  role text not null default '',
  role_en text,
  content text not null default '',
  content_en text,
  images text[] not null default '{}',
  github_url text,
  featured boolean not null default false,
  kind text not null default 'project',
  period text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 기존 DB에 컬럼만 추가 (테이블이 이미 있을 때)
alter table posts add column if not exists title_en text;
alter table posts add column if not exists content_en text;
alter table posts add column if not exists category text not null default 'study';
alter table page_contents add column if not exists content_en text not null default '';
alter table projects add column if not exists name_en text;
alter table projects add column if not exists description_en text;
alter table projects add column if not exists role_en text;
alter table projects add column if not exists content_en text;
alter table projects add column if not exists kind text not null default 'project';
alter table projects add column if not exists period text;
alter table about_profile add column if not exists avatar_url text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'projects_kind_check') then
    alter table projects add constraint projects_kind_check check (kind in ('project', 'education'));
  end if;
end $$;

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_updated_at on posts;
create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

drop trigger if exists projects_updated_at on projects;
create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at();

drop trigger if exists page_contents_updated_at on page_contents;
create trigger page_contents_updated_at
  before update on page_contents
  for each row execute function update_updated_at();

alter table posts enable row level security;
alter table about_profile enable row level security;
alter table page_contents enable row level security;
alter table projects enable row level security;

drop policy if exists "Public read posts" on posts;
create policy "Public read posts" on posts for select using (true);
drop policy if exists "Auth write posts" on posts;
create policy "Auth write posts" on posts for all using (auth.role() = 'authenticated');

drop policy if exists "Public read projects" on projects;
create policy "Public read projects" on projects for select using (true);
drop policy if exists "Auth write projects" on projects;
create policy "Auth write projects" on projects for all using (auth.role() = 'authenticated');

drop policy if exists "Public read about_profile" on about_profile;
create policy "Public read about_profile" on about_profile for select using (true);
drop policy if exists "Auth write about_profile" on about_profile;
create policy "Auth write about_profile" on about_profile for all using (auth.role() = 'authenticated');

drop policy if exists "Public read page_contents" on page_contents;
create policy "Public read page_contents" on page_contents for select using (true);
drop policy if exists "Auth write page_contents" on page_contents;
create policy "Auth write page_contents" on page_contents for all using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "Public read images" on storage.objects;
create policy "Public read images" on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists "Auth upload images" on storage.objects;
create policy "Auth upload images" on storage.objects
  for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');

drop policy if exists "Auth update images" on storage.objects;
create policy "Auth update images" on storage.objects
  for update using (bucket_id = 'images' and auth.role() = 'authenticated');

drop policy if exists "Auth delete images" on storage.objects;
create policy "Auth delete images" on storage.objects
  for delete using (bucket_id = 'images' and auth.role() = 'authenticated');

insert into about_profile (id, languages, frontend, backend_database, cloud_infra, currently_learning, github_url)
values (
  1,
  array['TypeScript', 'JavaScript'],
  array['React', 'Next.js', 'Tailwind CSS'],
  array['Node.js', 'Supabase', 'PostgreSQL'],
  array['Vercel'],
  array[]::text[],
  'https://github.com/cloudbread0714'
)
on conflict (id) do nothing;
