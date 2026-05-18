-- Supabase SQL Editor에서 실행 (다국어 지원)
-- page_contents가 없으면 먼저 생성한 뒤, posts/projects에 영문 컬럼 추가

create table if not exists page_contents (
  slug text primary key,
  content text not null default '',
  content_en text not null default '',
  updated_at timestamptz not null default now()
);

alter table page_contents
  add column if not exists content_en text not null default '';

alter table posts
  add column if not exists title_en text,
  add column if not exists content_en text;

alter table projects
  add column if not exists name_en text,
  add column if not exists description_en text,
  add column if not exists role_en text,
  add column if not exists content_en text;

-- page_contents 트리거·RLS (최초 schema.sql 없이 테이블만 만든 경우)
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'page_contents_updated_at'
  ) then
    create trigger page_contents_updated_at
      before update on page_contents
      for each row execute function update_updated_at();
  end if;
exception
  when undefined_function then
    raise notice 'update_updated_at() 없음 — supabase/schema.sql 전체를 먼저 실행하세요.';
end $$;

alter table page_contents enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'page_contents' and policyname = 'Public read page_contents'
  ) then
    create policy "Public read page_contents" on page_contents for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where tablename = 'page_contents' and policyname = 'Auth write page_contents'
  ) then
    create policy "Auth write page_contents" on page_contents for all using (auth.role() = 'authenticated');
  end if;
end $$;
