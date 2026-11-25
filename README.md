# Mishawash X — Protirodh BioKit

A production-quality website and content management system for **Mishawash X**, a student innovation team competing in the **Conrad Challenge 2026–2027** with **Protirodh BioKit**, a CRISPR-Cas12a diagnostic platform **concept**.

The site is designed as a premium biomedical-futurism publication: deep-navy cinematic heroes, restrained scientific motion, interactive mechanism diagrams, and an editorial system that makes the boundary between *proposed* and *demonstrated* impossible to miss.

> **Scientific status.** Protirodh BioKit has not been clinically validated, approved by any regulator, or made commercially available. Every visual is conceptual unless explicitly labelled otherwise. The seed content contains no invented results, sensitivity/specificity figures, partnerships, credentials or team members.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS 4 (design tokens in `src/index.css`) |
| Motion | Framer Motion + GSAP; Three.js for the DNA helix |
| Icons | Lucide |
| Routing | React Router 7, `HashRouter` (GitHub Pages safe) |
| Data | Supabase (Postgres, Auth, Storage) **or** browser-local fallback |
| Hosting | GitHub Pages + GitHub Actions |

### Two runtime modes

| | Local Studio (default) | Supabase (production) |
| --- | --- | --- |
| Content | `localStorage` | Postgres + RLS |
| Media | IndexedDB | Storage buckets |
| Admin access | Explicit local session — **not** a security boundary | Email/password + `profiles.role` |
| Enquiries | Stored in this browser | Inserted into `inquiries` |
| Use for | Design review, copy editing on one machine | The real public site |

The mode is selected automatically: if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present and valid, Supabase is used. Otherwise the app starts in Local Studio and says so in the admin.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
npm run preview      # preview the build on :4173
```

The content studio lives at an opaque path defined in `src/lib/utils/adminPath.js`
(`ADMIN_PATH`). With no Supabase configuration you will see the Local Studio notice and a password prompt.

To connect Supabase, copy `.env.example` to `.env`, add the two public keys, and follow **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**.

Deployment instructions for GitHub Pages are in **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

---

## Public routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Home | Cinematic introduction, problem preview, platform, research status |
| `/#/problem` | The Problem | Access gap, cited statistics, design implications |
| `/#/innovation` | Our Innovation | CRISPR mechanism, workflow, architecture, hardware, scope limits |
| `/#/research` | Research & Development | Method, milestone register, validation gates, open problems |
| `/#/team` | Our Team | Mission, real member profiles, operating principles |
| `/#/impact` | Impact & Vision | Potential impact with assumptions, access targets, roadmap |
| `/#/resources` | Resources & Contact | Document library, enquiry form, FAQ |

The secret path hosts the dashboard: overview, page editors, site settings, team, research, references, media, documents, enquiries, and draft preview. The old `/admin` route has been removed.

---

## Content integrity (non-negotiable)

These rules are enforced by editorial design, not just documented:

1. **No invented science.** The seed contains zero experimental results, accuracy claims, sensitivity/specificity values, or validation statements. All five research milestones are seeded as `planned`.
2. **Every statistic is cited.** Figures come from GLOBOCAN 2022, WHO, and the Lancet Commission on diagnostics, with links to the original publication in `scientific_references`.
3. **Status labels imply evidence.** `completed` and `validated` are only meaningful when an evidence URL is attached. The public timeline states plainly when nothing has been validated.
4. **Proposed ≠ demonstrated.** The innovation page separates *established*, *proposed* and *unproven*; workflow stages carry `proposed`, `in-development` or `demonstrated`.
5. **No invented people or files.** The five real team members are seeded from information supplied by the team; documents still render an honest empty state until approved PDFs exist.
6. **No endorsement claims.** Nothing implies NASA, Conrad, or any institution endorses the project.
7. **Illustrations are labelled.** The CRISPR animation, helix, architecture diagram and charts are marked conceptual and not to scale.

When editing content, keep these rules. The admin surfaces reminders next to the fields where they matter most.

---

## Architecture

```
src/
├─ App.jsx                     routes, loading gate, preloader
├─ main.jsx
├─ index.css                   design tokens, utilities, prose, admin inputs
├─ components/
│  ├─ animations/Reveal.jsx    scroll and text reveals, stagger groups
│  ├─ common/                  buttons, cards, status badge, empty state, forms
│  ├─ layout/                  header, footer, preloader, cursor, page transitions
│  ├─ scientific/              MolecularCanvas, HelixCanvas, CRISPR, workflow, architecture
│  └─ sections/                shared page hero and closing CTA
├─ content/
│  ├─ seed.js                  all initial copy, milestones and references
│  ├─ schema.js                field schemas that drive the admin editors
│  ├─ normalize.js             state shaping and merge helpers
│  ├─ repository.local.js      localStorage + IndexedDB adapter
│  ├─ repository.supabase.js   Postgres/Storage adapter
│  ├─ ContentProvider.jsx      content API, optimistic mutations, publishing
│  └─ AuthProvider.jsx         PKCE auth, profile role, Local Studio session
├─ hooks/                      page meta, overlays, media queries, magnetic buttons
├─ lib/                        Supabase client, IndexedDB, formatting, sanitising
└─ pages/                      7 public pages + admin dashboard
```

### Content model

- **`pages`** — slug, nav label, SEO fields, publication status.
- **`page_sections`** — one row per editable region. Each row stores `draft` and `published` JSON, plus `status` and `visible`.
- **Collections** — `team`, `milestones`, `references`, `documents`, `researchDocuments`, `media`, `inquiries`.
- **`site_settings`** — a single JSON document (brand, navigation, contact, announcement, footer, SEO).

Public pages read **published** content only. The admin can preview drafts, publish a single section, publish a whole page, hide a section, or unpublish without deleting anything.

### Publishing behaviour

1. Edits save to `draft` and never leak to the public site.
2. **Publish** copies `draft → published` for that section.
3. **Publish page** copies every section's draft at once.
4. **Hide** removes a section from the public page while keeping its content.
5. Collections use an explicit `published` boolean per record.

---

## Admin notes

- **Supabase mode** uses email/password with PKCE. Password reset and recovery links return through the query string (`?code=…`) so they do not collide with `HashRouter`.
- **Row Level Security** is the real boundary. The browser only holds the anon key. Administrator status comes from `profiles.role` (`admin` or `editor`).
- **Local Studio** is an explicit convenience session stored in `sessionStorage` and is password-protected with the emergency fallback passwords. It grants access only to this browser — it is not a security boundary. The login screen states this clearly, and enquiries warn that they are local-only.
- **Team accounts** sign in with their own email and the strong password recorded in the gitignored `security.txt`. Five accounts are provisioned with `scripts/provision-team.mjs`. The old fallback passwords remain available when the email field is left blank; rotate or remove them before a public launch. The opaque admin path is obscurity only — RLS and `profiles.role` are the real boundary.
- Rich text is sanitised on input and again at render time with DOMPurify; links are hardened.
- Media uploads are validated by MIME type and size (images ≤ 6 MB, PDFs ≤ 20 MB) in both modes.

---

## Design system

Brand tokens live at the top of `src/index.css`:

| Token | Value | Use |
| --- | --- | --- |
| `navy-950` | `#08182B` | Primary dark surface |
| `brand-cyan` | `#087EAA` | Links, accents |
| `brand-teal` | `#24C6B1` | Signal, active states |
| `mist` | `#F4F7FA` | Page background |

Type: **Manrope** for display, **Inter** for body, **Plus Jakarta Sans** for the wordmark. Utilities such as `display-xl`, `label`, `shell`, `numeral`, `prose-mx` and `btn-*` keep spacing and rhythm consistent.

Motion respects `prefers-reduced-motion` throughout: the preloader shortens, particle canvases pause, scroll transforms are removed, and reveals collapse to opacity changes. Canvas scenes pause when off-screen.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build locally |

### Admin scripts (service role — run locally only)

| Script | Purpose |
| --- | --- |
| `node scripts/seed-supabase.mjs` | Push all seed content and shipped images into Supabase |
| `node scripts/provision-team.mjs` | Create/update team auth accounts using `security.txt` |
| `node scripts/invite-team.mjs` | Send Supabase invitation emails to team members |

They require `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as environment variables.
See [docs/EMAIL_AND_NOTIFICATIONS_PLAN.md](./docs/EMAIL_AND_NOTIFICATIONS_PLAN.md) for the
planned enquiry-email delivery and custom invite templates.

No test runner is configured. Before publishing, walk the routes listed above, exercise the admin editors, and confirm the integrity checklist in the admin overview.

---

## Known limitations

- `public/og-image.svg` is an SVG. Some social platforms require a raster PNG; export a 1200×630 PNG if link previews matter and update the paths in `index.html` and `usePageMeta`.
- `public/robots.txt` and `public/sitemap.xml` contain `https://example.github.io/` placeholders. Replace them with your deployed origin.
- Enquiries rely on database RLS and a honeypot; there is no server-side rate limiting. For a high-traffic public launch, add an edge function or CAPTCHA.
- Local Studio is not encrypted and is not a substitute for a backend. Do not collect real personal data in that mode.

---

## Credits

Design and build for Mishawash X. Scientific references are cited in the site’s reference register and stored in `src/content/seed.js`. Conrad Challenge is a competition the team is entering; no endorsement is implied.
