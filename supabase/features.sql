-- 이미 블로그 DB가 있을 때: schema.sql 대신 이 파일만 실행
-- 여러 번 실행해도 안전합니다.

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

alter table about_profile add column if not exists avatar_url text;

alter table posts add column if not exists category text not null default 'study';
alter table projects add column if not exists kind text not null default 'project';
alter table projects add column if not exists period text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'projects_kind_check') then
    alter table projects add constraint projects_kind_check check (kind in ('project', 'education'));
  end if;
end $$;

alter table about_profile enable row level security;

drop policy if exists "Public read about_profile" on about_profile;
create policy "Public read about_profile" on about_profile for select using (true);
drop policy if exists "Auth write about_profile" on about_profile;
create policy "Auth write about_profile" on about_profile for all using (auth.role() = 'authenticated');

-- 글 카테고리 (사이트에서 직접 관리)
create table if not exists post_categories (
  slug text primary key,
  label_ko text not null,
  label_en text not null,
  sort_order int not null default 0
);

alter table post_categories enable row level security;

drop policy if exists "Public read post_categories" on post_categories;
create policy "Public read post_categories" on post_categories for select using (true);
drop policy if exists "Auth write post_categories" on post_categories;
create policy "Auth write post_categories" on post_categories for all using (auth.role() = 'authenticated');

insert into post_categories (slug, label_ko, label_en, sort_order) values
  ('study', '스터디', 'Study', 0),
  ('devlog', '개발 일지', 'Dev log', 1),
  ('project', '프로젝트 회고', 'Project notes', 2),
  ('troubleshooting', '트러블슈팅', 'Troubleshooting', 3),
  ('etc', '기타', 'Other', 99)
on conflict (slug) do nothing;

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
