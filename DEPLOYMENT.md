# Deployment — GitHub Pages

The site is a static Vite build. GitHub Actions builds it and publishes `dist/` to Pages.

Because the app uses **`HashRouter`**, every route is a fragment of `index.html`
(`/#/problem`, `/#/innovation`, …). No 404 fallback or rewrite rule is needed — Pages will serve
`index.html` for every path.

---

## 1. Prerequisites

- Node 22 (see `.nvmrc`) for local builds.
- A GitHub repository. This folder is already initialised as a Git repository; add your remote before pushing.

```bash
git init
git add .
git commit -m "Mishawash X — Protirodh BioKit site"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

`.gitignore` excludes `node_modules/`, `dist/`, `.env*`, and `security.txt`. Never force-add those files.

---

## 2. Choose the base path

| Hosting shape | URL | `VITE_BASE_PATH` |
| --- | --- | --- |
| Project site | `https://<user>.github.io/<repo>/` | `/<repo>/` |
| User/org site | `https://<user>.github.io/` | `/` |
| Custom domain | `https://yourdomain.com/` | `/` |

The workflow defaults to `/<repo>/` automatically. To override, add a repository **variable**
`VITE_BASE_PATH` (Settings → Secrets and variables → Actions → **Variables**).

For local builds that must match production, put the same value in `.env`:

```
VITE_BASE_PATH=/mishawash-x/
```

---

## 3. Enable Pages

1. Push to `main`.
2. Repository → **Settings → Pages**.
3. **Source: GitHub Actions** (not “Deploy from a branch”).
4. The workflow `.github/workflows/deploy.yml` runs on every push to `main` and can also be
   triggered manually from the **Actions** tab (`workflow_dispatch`).
5. The deployed URL appears in the workflow’s `deploy` job and under Settings → Pages.

---

## 4. Supabase configuration (optional but required for a real CMS)

The site works without Supabase in **Local Studio** mode, but content then lives only in the
browser of whoever edits it — it will not appear for visitors. For a real site, complete
**[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**, then add two Actions **secrets**:

Repository → Settings → Secrets and variables → Actions → **Secrets**:

| Secret | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | the project’s **anon public** key |

**Never** add the `service_role` key. It bypasses RLS and must never reach a browser bundle.

Re-run the workflow after adding secrets (Actions → Deploy to GitHub Pages → Run workflow).

---

## 5. Post-deploy checklist

- [ ] `https://<site>/` loads; no console errors; preloader completes once.
- [ ] Navigate every page: Problem, Innovation, Research, Team, Impact, Resources.
- [ ] Open the secret admin path from `src/lib/utils/adminPath.js` — sign-in screen appears; Local Studio banner is **absent** (Supabase mode).
- [ ] Sign in with the admin account; dashboard loads; page editors load current content.
- [ ] Edit one section, save draft, preview, publish; confirm the public page changed.
- [ ] Submit a test enquiry; confirm it appears under the secret path's `/inquiries` screen.
- [ ] Upload a small image; confirm it renders from the Storage URL.
- [ ] Hard-refresh a deep link such as `/#/research` — it must load directly.
- [ ] Test at 390 px width and with **prefers-reduced-motion** enabled.

---

## 6. Replace placeholder URLs

Search the repo for `example.github.io` and update:

- `index.html` — `<link rel="canonical">`, Open Graph/Twitter image URLs.
- `public/robots.txt` — `Sitemap:` line.
- `public/sitemap.xml` — `<loc>` entries.
- `src/hooks/usePageMeta.js` — `SITE_URL` if present.

Keep `sitemap.xml` pointing at the single document plus fragment entries, since routing is `#`-based.

---

## 7. Custom domain

1. Settings → Pages → **Custom domain**, enter the domain.
2. Add a DNS record:
   - apex domain → `A` records to GitHub’s IPs, or `ALIAS`/`ANAME` if supported;
   - `www` → `CNAME` to `<user>.github.io`.
3. Enable **Enforce HTTPS** once the certificate is issued.
4. Set `VITE_BASE_PATH=/` and rebuild.
5. Add a `public/CNAME` file containing the domain (one line) so the build preserves it.

---

## 8. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Blank page, 404s on `/assets/*` | Wrong base path | Set `VITE_BASE_PATH=/<repo>/` and rebuild |
| Styles missing | Base path again — CSS is referenced with the base prefix | same as above |
| Admin says “Local Studio” after deploy | Supabase secrets not set on the repo, or build ran before they were added | Add secrets, re-run workflow |
| Sign-in succeeds but dashboard is read-only | `profiles.role` is `viewer` or missing | Run the promote statement in SUPABASE_SETUP.md §5 |
| Enquiries fail with `new row violates row-level security` | `inquiries` insert policy missing | Re-run the migration |
| Old content still shows after publishing | Browser cache | Hard refresh; content is fetched at load |

---

## 9. Rolling back

Pages deployments are immutable. Open **Actions → Deploy to GitHub Pages**, choose the last good
run, and re-run it. Alternatively `git revert` the offending commit and push.
