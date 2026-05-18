-- 기존 Supabase 프로젝트에 이 파일을 SQL Editor에서 실행하세요.

create table if not exists page_contents (
  slug text primary key,
  content text not null default '',
  updated_at timestamptz not null default now()
);

create trigger page_contents_updated_at
  before update on page_contents
  for each row execute function update_updated_at();

alter table page_contents enable row level security;

create policy "Public read page_contents" on page_contents for select using (true);
create policy "Auth write page_contents" on page_contents for all using (auth.role() = 'authenticated');
