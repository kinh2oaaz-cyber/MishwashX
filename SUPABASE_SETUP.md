# Supabase setup

This turns the site from **Local Studio** (browser-only editing) into a real CMS with a database,
authentication and file storage.

Everything here uses the Supabase dashboard plus the SQL in
[`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql) and
[`supabase/migrations/0002_grants.sql`](./supabase/migrations/0002_grants.sql).
If the Supabase CLI is linked to the project, `supabase db push --remote` applies both.

> Security model: anonymous visitors read **published** rows only. Signed-in users with
> `profiles.role` of `admin` or `editor` may write. The browser only ever holds the **anon** key.
> Row Level Security is the real boundary — not the UI.

---

## 1. Create the project

1. <https://supabase.com/dashboard> → **New project**.
2. Choose an organisation, name (e.g. `mishawash-x`), a strong database password, and the region
   closest to your audience.
3. Wait for provisioning (~2 minutes).

---

## 2. Run the migration

1. Dashboard → **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/migrations/0001_init.sql`.
3. **Run**. It is idempotent (`if not exists`, `drop policy if exists`), so re-running is safe.

This creates:

| Object | Purpose |
| --- | --- |
| `profiles` | User records + `role` (`admin` \| `editor` \| `viewer`) |
| `site_settings` | Single row, `id = 'global'`, JSON brand/nav/contact/SEO config |
| `pages` | One row per page: slug, nav label, SEO, status |
| `page_sections` | Draft + published JSON per section, `status`, `visible`, `sort_order` |
| `team_members` | Public team profiles (`published` flag, empty by design) |
| `research_milestones` | Timeline entries (`planned` \| `in-progress` \| `completed` \| `validated`) |
| `scientific_references` | Citation register |
| `resources` | Public document library |
| `research_documents` | Research document register |
| `media_assets` | Metadata for Storage uploads |
| `inquiries` | Contact form submissions |
| Buckets | `media` (public, images ≤ 6 MB) and `documents` (public, PDF ≤ 20 MB) |

It also creates `public.is_editor()`, `set_updated_at()` triggers, a new-user profile trigger, and
all RLS policies.

---

## 3. Get the API credentials

Dashboard → **Project Settings → API**:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

Put them in `.env` locally (copy `.env.example`) and as GitHub Actions **secrets** for the deploy
workflow. See [DEPLOYMENT.md](./DEPLOYMENT.md) §4.

```
VITE_SUPABASE_URL=https://abcdefghijkl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Never use the `service_role` key in the front end. It bypasses RLS.

---

## 4. Create the admin users

For this project the five team accounts and two emergency fallback accounts are provisioned by
script. Fill in the gitignored `security.txt`, then run locally:

```bash
SUPABASE_URL=https://<project-ref>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service-role-key> \
node scripts/provision-team.mjs
```

This creates each team member with their own strong password and promotes their profile to
`admin`. To do it manually: Dashboard → **Authentication → Users → Add user**, confirm the email,
then use the SQL in §5 to promote the profile.

---

## 5. Promote that user to admin

Dashboard → **SQL Editor**, run (replace the email):

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');

-- verify
select p.id, u.email, p.role
from public.profiles p
join auth.users u on u.id = p.id;
```

Until a profile has `admin` or `editor`, every write is rejected by RLS. The UI will still load
published content.

To grant a second editor:

```sql
update public.profiles set role = 'editor'
where id = (select id from auth.users where email = 'teammate@example.com');
```

---

## 6. Seed the database

Run the seed script once after a fresh migration. It writes site settings, all 7 pages and their
51 published sections, the five team members, milestones, references, and registers the shipped
images in the media library:

```bash
SUPABASE_URL=https://<project-ref>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service-role-key> \
node scripts/seed-supabase.mjs
```

It is safe to re-run: pages and sections are upserted, collection tables are replaced.
You can also populate sections by hand from the admin (Settings → Save, then Pages → Publish page).
Sign in at the secret path defined in `src/lib/utils/adminPath.js` — not `/admin`.

> Reminder: milestones are seeded as `planned`. Only change `status` to `completed` or `validated`
> when there is evidence, and attach `evidence_url` + `evidence_label` so the public page can cite it.

---

## 7. Storage

The migration creates both buckets and their policies. Verify under **Storage**:

- `media` — public, 6 MB limit, `image/jpeg|png|webp|avif`
- `documents` — public, 20 MB limit, `application/pdf`

If you need SVG uploads, add `image/svg+xml` to `allowed_mime_types` — but understand SVG can carry
scripts. The app sanitises rendering, but rasterising is safer for public assets.

Do not upload patient data, unpublished third-party material, or anything confidential: bucket reads
are public.

---

## 8. Auth configuration

Dashboard → **Authentication → URL Configuration**:

- **Site URL**: your deployed origin, e.g. `https://<user>.github.io/<repo>/`
- **Redirect URLs**: add the same origin (and `http://localhost:5173/` for local testing).

The app uses PKCE with `detectSessionInUrl: false` and manually exchanges the `?code=` parameter,
because `HashRouter` owns the fragment. Do not enable implicit flow.

Password recovery emails will therefore land on the site root with a `?code=` query string, which
the auth provider handles.

If email confirmation is on, new users must confirm before signing in. For a small team it is
simplest to create users from the dashboard (§4) rather than self-service signup.

---

## 9. Verify RLS

Run these in the SQL editor to confirm policies exist:

```sql
select tablename, policyname, cmd, roles
from pg_policies
where schemaname in ('public', 'storage')
order by tablename, policyname;
```

Expected highlights:

- `pages public read` → only `status = 'published'`.
- `sections public read` → `status = 'published' and visible = true and published is not null`.
- `inquiries public insert` → anyone may insert; only editors may select.
- `profiles read own` → a user sees their own row; editors see all.

Quick negative test: sign out, then in the browser console try
`supabase.from('inquiries').select()` — it must return no rows (or an error), never data.

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Admin stuck in Local Studio after adding env | Vite env only reads at build/dev start | Restart `npm run dev`, rebuild for deploy, verify secrets |
| Sign-in succeeds, writes fail | `profiles.role` is `viewer` | Run the promote statement (§5) |
| “new row violates row-level security” on enquiry insert | insert policy missing | Re-run migration |
| Upload fails with 403 | Not an editor, or MIME/size outside bucket limits | Check role and file |
| Password reset link shows a blank page | Redirect URL not allow-listed | Add the origin under URL Configuration |
| Drafts not visible in preview | `previewDrafts` requires an authenticated editor session | Sign in first |
| Duplicate profiles | Trigger ran twice | `on conflict (id) do nothing` handles it; check trigger exists |

---

## 11. Backups

Dashboard → **Database → Backups**. Free projects retain limited daily backups. Before large
content changes, or before a launch, export the content tables:

```sql
select jsonb_pretty(to_jsonb(p)) from public.page_sections p;
```

Keep a copy outside Supabase. The bundled seed in `src/content/seed.js` is the fallback if the
database is ever unreachable.
