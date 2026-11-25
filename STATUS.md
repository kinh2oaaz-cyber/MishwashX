# STATUS — Mishawash X / Protirodh BioKit website + CMS

_Last updated: 2026-11-25_

Handoff document. Read this first in a new session instead of replaying the chat history.

---

## 1. What this project is

A complete marketing site + headless-ish CMS for **Mishawash X**, a Conrad Challenge 2026–2027
student team. Product: **Protirodh BioKit**, a CRISPR-Cas12a diagnostic platform **concept**.

Design brief: premium biomedical futurism — deep navy cinematic heroes, cyan/teal accents,
scientific motion, editorial restraint. 7 public pages + protected admin dashboard.

**Hard rule for anyone continuing this work:** the site must never claim results that do not exist.
No invented sensitivity/specificity, no validation claims, no partnerships, no team members, no
credentials, no NASA/Conrad endorsement, no fake download links. Every statistic on the site is
real and cited. All research milestones are seeded as `planned`.

---

## 2. Stack & where things live

| Concern | Where |
| --- | --- |
| Framework | React 19 + Vite 8 (`vite.config.js`) |
| Styles | Tailwind 4 via `@tailwindcss/vite`; tokens + utilities in `src/index.css` |
| Motion | Framer Motion 14, GSAP 3, Three.js (helix) |
| Icons | lucide-react |
| Routing | `react-router-dom` **HashRouter** (GitHub Pages safe) — configured in `src/App.jsx` |
| Data (local mode) | `localStorage` (content) + IndexedDB (media) |
| Data (production) | Supabase Postgres + Auth + Storage, RLS |
| Deploy | GitHub Actions → Pages (`.github/workflows/deploy.yml`) |

### Entry points
- `src/main.jsx` — mounts `<App/>` in StrictMode.
- `src/App.jsx` — HashRouter, ErrorBoundary, ContentProvider, AuthProvider, preloader gate,
  all routes (public tree nested in `PublicLayout`, admin tree under `AdminLayout`).
- `src/index.css` — the single source of design tokens and utility classes
  (`shell`, `display-*`, `label`, `lead`, `btn-*`, `card`, `prose-mx`, `admin-input`, `admin-label`,
  `admin-hint`, reduced-motion overrides). **Admin and public markup depend on these names.**

### Content layer (`src/content/`)
| File | Role |
| --- | --- |
| `seed.js` | Canonical copy for all 51 sections, site settings, 5 real team members, 5 planned milestones, 5 cited references, and 8 recognition photos. Documents intentionally empty until approved PDFs exist. |
| `schema.js` | Field schemas per section (`getSectionSchema`), `COLLECTIONS`, `PAGE_META_FIELDS`, `SECTION_LABELS`. Drives every admin form. |
| `normalize.js` | Shapes/merges seed + stored data. |
| `repository.local.js` | localStorage + IndexedDB adapter. Persists the whole content graph per `commit`. |
| `repository.supabase.js` | Postgres/Storage adapter. **Its table/column names are the contract for the SQL migration.** |
| `ContentProvider.jsx` | Public API: `content(page,key)`, `sectionsFor`, `getSection`, `updateSection`, `publishSection`, `publishPage`, `unpublishSection`, `reorderSections`, `updatePage`, `upsertRecord`, `deleteRecord`, `updateInquiry`, `deleteInquiry`, `uploadMedia`, `updateMedia`, `deleteMedia`, `resetContent`, `previewDrafts`/`setPreviewDrafts`, `saving`. |
| `AuthProvider.jsx` | Supabase PKCE sign-in/out, profile role → `isAdmin`, `mode` (`local` \| `supabase`), Local Studio session. |

### Route table
Public (nested in `src/components/layout/PublicLayout.jsx`):
`/` home · `/problem` · `/innovation` · `/research` · `/team` · `/impact` · `/resources` · `*` 404

Admin (secret path from `src/lib/utils/adminPath.js`, currently `/mx-internal-3d8e1b`):
`<path>/login` · `<path>` overview · `<path>/pages` · `<path>/pages/:slug` · `<path>/settings` ·
`<path>/team` · `<path>/research` · `<path>/references` · `<path>/media` · `<path>/documents` ·
`<path>/inquiries` · `<path>/preview/:slug`. The old `/admin` routes were removed.

### Section keys per page (seed order)
- **home** — hero, statement, problem, innovation, technology, research, team, impact, recognition, cta
- **problem** — hero, context, barriers, statistics, early, implications, cta
- **innovation** — hero, overview, crispr, workflow, architecture, hardware, boundaries, cta
- **research** — hero, method, timeline, workstreams, validation, challenges, documents, cta
- **team** — hero, mission, members, principles, cta
- **impact** — hero, potential, access, roadmap, partnerships, responsible, recognition, cta
- **resources** — hero, documents, contact, faq, cta

### Publishing semantics (important)
- Public pages read **published** content unless `previewDrafts` is true.
- `updateSection(slug, key, { draft })` shallow-merges into `draft`.
- `publishSection` copies `draft → published`. **Save-then-publish order matters.**
- `visible: false` hides a section without deleting it. Collections use a `published` boolean.

---

## 3. Status: done vs remaining

### Done and verified
- `npm run build` **passes** (vite 8, 2686 modules, ~1.8 s).
  - Build output: `dist/` with vendor chunks split (react, motion, supabase, three, gsap).
- All 7 public pages + NotFound implemented with real section rendering.
- Full admin: login, overview, page list, page editor, generic collection manager, team,
  research, references, documents (tabbed public/research), media library, inquiries, draft preview.
- Local + Supabase repositories, content provider, auth provider.
- Scientific components: `MolecularCanvas`, `HelixCanvas`, `CrisprMechanism`, `WorkflowRail`,
  `ArchitectureDiagram` — all responsive to content length and reduced-motion aware.
- `public/favicon.svg`, `public/og-image.svg`, `public/robots.txt`, `public/sitemap.xml`.
- `supabase/migrations/0001_init.sql` — tables, indexes, triggers, RLS, storage buckets, first-admin note.
- `supabase/migrations/0002_grants.sql` — role grants required after a CLI migration push.
- `scripts/seed-supabase.mjs`, `scripts/provision-team.mjs`, `scripts/invite-team.mjs` — live-database setup helpers (service role, local only).
- `security.txt` (gitignored) — team emails/passwords, fallback passwords and Supabase keys.
- `docs/EMAIL_AND_NOTIFICATIONS_PLAN.md` — planned enquiry email delivery and custom auth emails.
- `.github/workflows/deploy.yml` — Pages build + deploy with `VITE_BASE_PATH` defaulting to `/<repo>/`.
- `.env.example`, `.gitignore`, `.nvmrc`, `README.md`.

### Remaining
1. **`DEPLOYMENT.md`** — ✅ written.
2. **`SUPABASE_SETUP.md`** — ✅ written.
3. **Runtime QA in a browser** — ✅ completed (see §3a).
4. **Fix bugs found in QA** — ✅ completed (see §3a).
5. Optional polish: rasterise OG image to PNG; replace `example.github.io` placeholders in
   `index.html`, `robots.txt`, `sitemap.xml`; `git init` + first commit.

### §3a QA results (2026-11-25)

Verified in Chromium against the dev server **and** the production build (`npm run preview`):

| Area | Result |
| --- | --- |
| All 7 public routes + 404 | Render, correct `<title>`, **zero console errors**, no horizontal overflow |
| Home hero / announcement strip | Animates in, preloader completes once |
| Innovation | CRISPR stepper (4 stages), 7-stage workflow rail, conceptual labels present |
| Research | 5 planned milestones, "no milestone completed" banner, "no evidence attached" |
| Team | Honest empty member state, mission/vision/principles |
| Resources | Empty document states, FAQ accordion, enquiry validation + success |
| Admin auth | Local Studio entry, sign-out, protected redirect |
| Admin screens | Overview, Pages, Page editor, Settings, Team, Research, References, Media, Documents, Inquiries, Preview — all load clean |
| Draft → publish | Edited hero lead, saved draft, published, verified on public page, reverted |
| Collection CRUD | Created + deleted a test milestone (list + modal + confirm) |
| Enquiries | Submitted a test enquiry, saw it in the inbox, deleted it |
| Anchors | `/#/resources#contact` scrolls to the contact block |
| Production build | Assets + favicon load, admin works, no console errors |

### Fixes applied during QA

- `AdminLayout.jsx` — admin pages now set `document.title` and reset scroll on navigation.
- `PublicLayout.jsx` — route changes use instant scroll (CSS `scroll-smooth` was animating it).
- `Header.jsx` — scrolled bar is properly dark navy (was washed grey over light sections);
  mobile menu nav is scrollable on short viewports so all 7 links remain reachable.
- `Overview.jsx` — removed a no-op `onClick` that made a stat card a dead button.

### Known small issues (cosmetic, non-blocking)
- `public/og-image.svg` is SVG; some social platforms need a 1200×630 PNG.
- `robots.txt` / `sitemap.xml` / canonical URL still contain `https://example.github.io/`.
- No test runner configured; QA is manual.

---

## 4. Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/
npm run preview    # http://localhost:4173
```

---

## 5. Security model (do not weaken)

- Browser holds only the Supabase **anon** key. Never the service-role key.
- Real authorisation is **RLS + `profiles.role in ('admin','editor')`**.
- **Local Studio mode is password-protected** with the emergency fallback credentials, but it
  remains an explicit, clearly labelled convenience session in `sessionStorage`, not a security
  boundary. Keep the labels honest.
- **The opaque admin path is obscurity only** — RLS and `profiles.role` are the real boundary.
  Fallback passwords are hardcoded in the client bundle; rotate/remove them before a public launch.
- Rich text is sanitised with DOMPurify on input and render.
- Uploads validated by MIME + size (images ≤ 6 MB, PDFs ≤ 20 MB) in both modes.

---

## 6. Prompt for a new session

> Continue the **Mishawash X / Protirodh BioKit** website project in
> `C:\work station\SCIENCE PROJECT WEBSITE`.
>
> Start by reading `STATUS.md`, then `README.md`, then skim `src/App.jsx`,
> `src/content/ContentProvider.jsx` and `src/content/schema.js`. Do not re-derive architecture
> from scratch — it is documented.
>
> Current state: implementation, documentation and browser QA are complete. The production build
> passes and every public route and admin screen has been smoke-tested. Remaining work is
> deployment and optional polish only:
> (1) replace the `example.github.io` placeholders in `index.html`, `public/robots.txt`,
> `public/sitemap.xml` with the real origin once the repo exists;
> (2) optionally export a 1200×630 PNG Open Graph image;
> (3) `git init`, commit and push, then enable Pages (see `DEPLOYMENT.md`);
> (4) if connecting Supabase, follow `SUPABASE_SETUP.md` end to end and re-test the admin.
>
> Constraints that must not be broken: never invent scientific results, sensitivity/specificity
> figures, validation claims, partnerships, team members, credentials or statistics; keep all
> conceptual graphics labelled as conceptual; never claim NASA/Conrad endorsement; no fake
> download links; never put a Supabase service-role key in the front end; keep Local Studio
> clearly labelled as non-secure.

---

## 7. Answering "does the free plan end with this session?"

Provider quotas are per account/model and are **not** tied to a single chat session. A session
ending does not consume or reset a plan; hitting a model's usage limit does, and it usually resets
on that provider's own schedule (often daily). Because all work is on disk, switching to another
model or provider loses nothing — the repo, `STATUS.md` and the migration are the source of truth.
If a new model cannot hold the full history, start a fresh session in the same folder and paste
the prompt in §6.
