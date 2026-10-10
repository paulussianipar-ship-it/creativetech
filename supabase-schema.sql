-- ============================================================
--  Paul Design & IT Solution — Schema Supabase
--  Jalankan di Supabase SQL Editor.
--
--  Catatan:
--    * Gunakan command + shift + enter / Run untuk mengeksekusi.
--    * Tabel `profiles` ditautkan ke auth.users via trigger.
--    * Semua query lewat anon key hanya bisa membaca data publik;
--      RLS membatasi tulis ke pemilik / admin.
-- ============================================================

-- ─────────────────────────── ENUM ───────────────────────────
create type public.user_role as enum ('admin', 'editor', 'user');
create type public.user_status as enum ('active', 'inactive');
create type public.project_status as enum ('published', 'draft', 'archived');
create type public.audit_action as enum ('create', 'update', 'delete', 'upload', 'login', 'logout');

-- ─────────────────────────── PROFILES ───────────────────────
-- Profil pengguna; id merujuk auth.users.id.
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null default '',
  email       text not null,
  role        public.user_role not null default 'user',
  status      public.user_status not null default 'active',
  avatar_url  text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Buat profil otomatis saat pengguna mendaftar.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────── PROJECTS ───────────────────────
-- projects.images menyimpan array { path, url, name }
-- untuk gambar yang diunggah ke Storage bucket `project-images`.
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  category    text not null default 'other',
  status      public.project_status not null default 'draft',
  description text default '',
  content     text default '',          -- HTML dari rich text editor
  image_url   text,                     -- URL sampul
  images      jsonb not null default '[]'::jsonb,
  client      text,
  featured    boolean not null default false,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─────────────────────────── CONTENT ────────────────────────
-- CMS key-value per section (home/about/contact/services).
create table public.content (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,     -- 'home' | 'about' | ...
  value       jsonb not null default '{}'::jsonb,
  updated_by  uuid references public.profiles (id) on delete set null,
  updated_at  timestamptz not null default now()
);

-- ─────────────────────────── SETTINGS ───────────────────────
-- Kolom memakai snake_case (konvensi SQL). Aplikasi (src/lib/api.js)
-- memetakan ke camelCase (siteName, contactEmail, dst.) saat
-- fetchSettings / saveSettings — lihat SETTINGS_FIELDS_MAP.
create table public.settings (
  id                 uuid primary key default gen_random_uuid(),
  site_name          text not null default 'Paul Design & IT Solution',
  tagline            text default '',
  contact_email      text default '',
  default_language   text not null default 'id',
  maintenance_mode   boolean not null default false,
  allow_registration boolean not null default false,
  items_per_page     integer not null default 10,
  updated_at         timestamptz not null default now()
);

-- Isi baris pengaturan awal.
insert into public.settings (id, site_name) values (gen_random_uuid(), 'Paul Design & IT Solution')
on conflict do nothing;

-- ─────────────────────── CONTACT MESSAGES ───────────────────
-- Pesan dari formulir kontak publik. Siapa pun boleh mengirim,
-- hanya staff yang boleh membaca & mengelola.
create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  topic       text,
  message     text not null default '',
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────── AUDIT LOG ──────────────────────
create table public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_email text,
  action      public.audit_action not null,
  entity      text not null,            -- 'user' | 'project' | 'content' | 'settings'
  entity_id   text,
  description text,
  created_at  timestamptz not null default now()
);

-- Perbarui updated_at secara otomatis.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
create trigger trg_settings_updated_at before update on public.settings
  for each row execute function public.set_updated_at();

-- ─────────────────────────── RLS ────────────────────────────
-- Aktifkan Row Level Security di setiap tabel.
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.content  enable row level security;
alter table public.settings enable row level security;
alter table public.audit_logs enable row level security;
alter table public.contact_messages enable row level security;

-- Helper: apakah user saat ini admin/editor?
create or replace function public.is_staff()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
      and status = 'active'
  );
$$;

-- PROFILES
-- Semua orang boleh melihat daftar pengguna (untuk dropdown publik),
-- tapi pembaruan dibatasi: pemilik sendiri atau staff.
create policy "read_profiles_public"
  on public.profiles for select using (true);

create policy "update_own_profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "staff_manage_profiles"
  on public.profiles for all
  using (public.is_staff())
  with check (public.is_staff());

-- Hanya staff yang boleh menghapus, dan tidak bisa menghapus admin lain.
create policy "staff_delete_profiles"
  on public.profiles for delete
  using (public.is_staff() and role <> 'admin');

-- PROJECTS
-- Publik hanya membaca yang ter-publish.
create policy "read_published_projects"
  on public.projects for select
  using (status = 'published');

create policy "staff_read_all_projects"
  on public.projects for select
  using (public.is_staff());

create policy "staff_write_projects"
  on public.projects for insert
  with check (public.is_staff());

create policy "staff_update_projects"
  on public.projects for update
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff_delete_projects"
  on public.projects for delete
  using (public.is_staff());

-- CONTENT & SETTINGS
-- Publik boleh membaca konten halaman & pengaturan umum.
create policy "read_content_public"
  on public.content for select using (true);
create policy "staff_write_content"
  on public.content for all
  using (public.is_staff())
  with check (public.is_staff());

create policy "read_settings_public"
  on public.settings for select using (true);
create policy "staff_write_settings"
  on public.settings for all
  using (public.is_staff())
  with check (public.is_staff());

-- AUDIT LOG
-- Hanya staff yang boleh membaca log; sistem menulis via service/anon
-- dari sisi aplikasi (insert diperbolehkan untuk anon karena endpoint
-- aplikasi yang memanggil).
create policy "staff_read_audit"
  on public.audit_logs for select
  using (public.is_staff());
create policy "app_write_audit"
  on public.audit_logs for insert
  with check (true);

-- CONTACT MESSAGES
-- Publik (anon) boleh mengirim pesan; hanya staff yang boleh membaca,
-- menandai dibaca, atau menghapusnya.
create policy "public_submit_contact"
  on public.contact_messages for insert
  with check (true);

create policy "staff_read_contact"
  on public.contact_messages for select
  using (public.is_staff());

create policy "staff_update_contact"
  on public.contact_messages for update
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff_delete_contact"
  on public.contact_messages for delete
  using (public.is_staff());

-- ─────────────────────── STORAGE ────────────────────────────
-- Buat bucket lewat Dashboard → Storage.
--   Bucket name: project-images
--   Privacy   : public
--
-- Lalu jalankan CLI berikut (atau terapkan via Dashboard → SQL):
--   insert into storage.buckets (id, name, public) values
--     ('project-images', 'project-images', true);
--
-- Policy untuk membaca gambar publik:
create policy "read_project_images"
  on storage.objects for select using (
    bucket_id = 'project-images'
  );

-- Policy menulis/update/delete: hanya staff.
create or replace function public.is_staff_or_file_owner()
returns boolean language sql stable as $$
  select public.is_staff()
      or (storage.foldername(name))[1] = auth.uid()::text;
$$;

create policy "staff_upload_project_images"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and public.is_staff());

create policy "staff_update_project_images"
  on storage.objects for update
  using (bucket_id = 'project-images' and public.is_staff());

create policy "staff_delete_project_images"
  on storage.objects for delete
  using (bucket_id = 'project-images' and public.is_staff());