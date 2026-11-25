-- ============================================================================
--  MISHAWASH X — SUPABASE SCHEMA
--  Run this once in a new Supabase project (SQL Editor → New query → Run).
--  It creates every table, index, trigger and Row Level Security policy used by
--  the application, plus the public storage buckets.
--
--  Security model
--  • Anonymous visitors may read only published rows.
--  • Authenticated users with profiles.role in ('admin','editor') may write.
--  • The browser only ever holds the anon key. Never add a service-role key to
--    the front-end environment.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
--  HELPERS
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
--  PROFILES
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Editor check must be defined after public.profiles exists.
create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

revoke all on function public.is_editor() from public;
grant execute on function public.is_editor() to authenticated, anon;

alter table public.profiles enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_editor());

drop policy if exists "profiles admin write" on public.profiles;
create policy "profiles admin write"
  on public.profiles for update
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create a profile automatically for every new auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
--  GLOBAL SETTINGS
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  id text primary key default 'global',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "settings editor write" on public.site_settings;
create policy "settings editor write"
  on public.site_settings for all
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop trigger if exists settings_updated_at on public.site_settings;
create trigger settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
--  PAGES
-- ---------------------------------------------------------------------------

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  nav_label text,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('published', 'draft')),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists pages_status_idx on public.pages (status);
create index if not exists pages_sort_idx on public.pages (sort_order);

alter table public.pages enable row level security;

drop policy if exists "pages public read" on public.pages;
create policy "pages public read"
  on public.pages for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "pages editor write" on public.pages;
create policy "pages editor write"
  on public.pages for all
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop trigger if exists pages_updated_at on public.pages;
create trigger pages_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
--  PAGE SECTIONS
-- ---------------------------------------------------------------------------

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null references public.pages (slug) on delete cascade,
  section_key text not null,
  kind text not null default 'editorial',
  sort_order integer not null default 0,
  visible boolean not null default true,
  status text not null default 'draft' check (status in ('published', 'draft')),
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  updated_at timestamptz not null default now(),
  unique (page_slug, section_key)
);

create index if not exists page_sections_page_idx on public.page_sections (page_slug, sort_order);
create index if not exists page_sections_live_idx on public.page_sections (status, visible);

alter table public.page_sections enable row level security;

drop policy if exists "sections public read" on public.page_sections;
create policy "sections public read"
  on public.page_sections for select
  to anon
  using (status = 'published' and visible = true and published is not null);

-- Authenticated visitors may need the full set for preview; editors need drafts.
drop policy if exists "sections editor read" on public.page_sections;
create policy "sections editor read"
  on public.page_sections for select
  to authenticated
  using (public.is_editor());

drop policy if exists "sections editor write" on public.page_sections;
create policy "sections editor write"
  on public.page_sections for all
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop trigger if exists sections_updated_at on public.page_sections;
create trigger sections_updated_at
  before update on public.page_sections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
--  TEAM
-- ---------------------------------------------------------------------------

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  responsibilities text default '',
  bio text default '',
  contribution text default '',
  photo_url text default '',
  links jsonb not null default '[]'::jsonb,
  sort_order integer not null default 99,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_sort_idx on public.team_members (sort_order);
create index if not exists team_published_idx on public.team_members (published);

alter table public.team_members enable row level security;

drop policy if exists "team public read" on public.team_members;
create policy "team public read"
  on public.team_members for select
  to anon, authenticated
  using (published = true);

drop policy if exists "team editor write" on public.team_members;
create policy "team editor write"
  on public.team_members for all
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop trigger if exists team_updated_at on public.team_members;
create trigger team_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
--  RESEARCH MILESTONES
-- ---------------------------------------------------------------------------

create table if not exists public.research_milestones (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  phase text default '',
  status text not null default 'planned'
    check (status in ('planned', 'in-progress', 'completed', 'validated')),
  period text default '',
  date date,
  evidence_url text default '',
  evidence_label text default '',
  sort_order integer not null default 99,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists milestones_sort_idx on public.research_milestones (sort_order);
create index if not exists milestones_status_idx on public.research_milestones (status);

alter table public.research_milestones enable row level security;

drop policy if exists "milestones public read" on public.research_milestones;
create policy "milestones public read"
  on public.research_milestones for select
  to anon, authenticated
  using (published = true);

drop policy if exists "milestones editor write" on public.research_milestones;
create policy "milestones editor write"
  on public.research_milestones for all
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop trigger if exists milestones_updated_at on public.research_milestones;
create trigger milestones_updated_at
  before update on public.research_milestones
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
--  SCIENTIFIC REFERENCES
-- ---------------------------------------------------------------------------

create table if not exists public.scientific_references (
  id uuid primary key default gen_random_uuid(),
  authors text not null default '',
  title text not null default '',
  source text default '',
  year text default '',
  url text default '',
  doi text default '',
  note text default '',
  sort_order integer not null default 99,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists references_sort_idx on public.scientific_references (sort_order);

alter table public.scientific_references enable row level security;

drop policy if exists "references public read" on public.scientific_references;
create policy "references public read"
  on public.scientific_references for select
  to anon, authenticated
  using (published = true);

drop policy if exists "references editor write" on public.scientific_references;
create policy "references editor write"
  on public.scientific_references for all
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop trigger if exists references_updated_at on public.scientific_references;
create trigger references_updated_at
  before update on public.scientific_references
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
--  DOCUMENTS (public resources + research documents share a shape)
-- ---------------------------------------------------------------------------

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  category text default '',
  file_url text default '',
  file_size bigint not null default 0,
  file_type text default '',
  version text default '1.0',
  sort_order integer not null default 99,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.research_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  category text default '',
  file_url text default '',
  file_size bigint not null default 0,
  file_type text default '',
  version text default '1.0',
  sort_order integer not null default 99,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resources_sort_idx on public.resources (sort_order);
create index if not exists research_documents_sort_idx on public.research_documents (sort_order);

alter table public.resources enable row level security;
alter table public.research_documents enable row level security;

drop policy if exists "resources public read" on public.resources;
create policy "resources public read"
  on public.resources for select
  to anon, authenticated
  using (published = true);

drop policy if exists "resources editor write" on public.resources;
create policy "resources editor write"
  on public.resources for all
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists "research docs public read" on public.research_documents;
create policy "research docs public read"
  on public.research_documents for select
  to anon, authenticated
  using (published = true);

drop policy if exists "research docs editor write" on public.research_documents;
create policy "research docs editor write"
  on public.research_documents for all
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop trigger if exists resources_updated_at on public.resources;
create trigger resources_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();

drop trigger if exists research_documents_updated_at on public.research_documents;
create trigger research_documents_updated_at
  before update on public.research_documents
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
--  MEDIA
-- ---------------------------------------------------------------------------

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  folder text not null default 'general',
  alt_text text default '',
  caption text default '',
  mime_type text default '',
  size_bytes bigint not null default 0,
  url text not null default '',
  storage_path text default '',
  created_at timestamptz not null default now()
);

create index if not exists media_created_idx on public.media_assets (created_at desc);

alter table public.media_assets enable row level security;

drop policy if exists "media public read" on public.media_assets;
create policy "media public read"
  on public.media_assets for select
  to anon, authenticated
  using (true);

drop policy if exists "media editor write" on public.media_assets;
create policy "media editor write"
  on public.media_assets for all
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

-- ---------------------------------------------------------------------------
--  INQUIRIES
-- ---------------------------------------------------------------------------

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text default '',
  subject text default '',
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now(),
  constraint inquiries_message_length check (char_length(message) between 10 and 8000),
  constraint inquiries_email_shape check (position('@' in email) > 1)
);

create index if not exists inquiries_created_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

alter table public.inquiries enable row level security;

-- Anyone may submit an enquiry; nobody anonymous may read one back.
drop policy if exists "inquiries public insert" on public.inquiries;
create policy "inquiries public insert"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "inquiries editor read" on public.inquiries;
create policy "inquiries editor read"
  on public.inquiries for select
  to authenticated
  using (public.is_editor());

drop policy if exists "inquiries editor update" on public.inquiries;
create policy "inquiries editor update"
  on public.inquiries for update
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists "inquiries editor delete" on public.inquiries;
create policy "inquiries editor delete"
  on public.inquiries for delete
  to authenticated
  using (public.is_editor());

-- ---------------------------------------------------------------------------
--  STORAGE BUCKETS
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 6291456,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('documents', 'documents', true, 20971520,
    array['application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media bucket public read" on storage.objects;
create policy "media bucket public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('media', 'documents'));

drop policy if exists "media bucket editor insert" on storage.objects;
create policy "media bucket editor insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('media', 'documents') and public.is_editor());

drop policy if exists "media bucket editor update" on storage.objects;
create policy "media bucket editor update"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('media', 'documents') and public.is_editor())
  with check (bucket_id in ('media', 'documents') and public.is_editor());

drop policy if exists "media bucket editor delete" on storage.objects;
create policy "media bucket editor delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('media', 'documents') and public.is_editor());

-- ---------------------------------------------------------------------------
--  FIRST ADMIN
--  After creating a user in Authentication → Users, promote them:
--
--    update public.profiles set role = 'admin'
--    where id = (select id from auth.users where email = 'you@example.com');
--
--  Then sign in at /#/admin. The dashboard is unusable until a profile has an
--  admin or editor role; RLS rejects every write otherwise.
-- ---------------------------------------------------------------------------
