-- /pdf 자료실: Supabase SQL Editor에서 실행 (features.sql 이후)

create table if not exists pdf_files (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  file_name text not null,
  file_url text not null,
  file_path text not null,
  file_size bigint,
  mime_type text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists pdf_files_updated_at on pdf_files;
create trigger pdf_files_updated_at
  before update on pdf_files
  for each row execute function update_updated_at();

alter table pdf_files enable row level security;

drop policy if exists "Public read pdf_files" on pdf_files;
create policy "Public read pdf_files" on pdf_files for select using (true);

drop policy if exists "Auth write pdf_files" on pdf_files;
create policy "Auth write pdf_files" on pdf_files for all using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

drop policy if exists "Public read documents" on storage.objects;
create policy "Public read documents" on storage.objects
  for select using (bucket_id = 'documents');

drop policy if exists "Auth upload documents" on storage.objects;
create policy "Auth upload documents" on storage.objects
  for insert with check (bucket_id = 'documents' and auth.role() = 'authenticated');

drop policy if exists "Auth update documents" on storage.objects;
create policy "Auth update documents" on storage.objects
  for update using (bucket_id = 'documents' and auth.role() = 'authenticated');

drop policy if exists "Auth delete documents" on storage.objects;
create policy "Auth delete documents" on storage.objects
  for delete using (bucket_id = 'documents' and auth.role() = 'authenticated');
