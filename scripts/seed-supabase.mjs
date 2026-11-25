/**
 * Seed the live Supabase project with the site content from src/content/seed.js.
 *
 * Run with the service-role key (never put that key in .env or client code):
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { seedState } from '../src/content/seed.js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.')
  process.exit(1)
}

const db = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function check(res, label) {
  if (res.error) throw new Error(`${label}: ${res.error.message}`)
  return res.data
}

/* ------------------------------ admin users ------------------------------- */

async function ensureUser(email, password, fullName) {
  const { data: listed, error: listError } = await db.auth.admin.listUsers({ perPage: 1000 })
  if (listError) throw new Error(`listUsers: ${listError.message}`)
  const existing = listed.users.find((u) => u.email === email)

  let id
  if (existing) {
    id = existing.id
    const { error } = await db.auth.admin.updateUserById(id, { password, email_confirm: true })
    if (error) throw new Error(`updateUser ${email}: ${error.message}`)
  } else {
    const { data, error } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })
    if (error) throw new Error(`createUser ${email}: ${error.message}`)
    id = data.user.id
  }
  check(
    await db.from('profiles').upsert({ id, full_name: fullName, role: 'admin' }, { onConflict: 'id' }),
    `profile ${email}`,
  )
  console.log(`  admin ready: ${email}`)
  return id
}

/* -------------------------------- mappers -------------------------------- */

const toPage = (p) => ({
  slug: p.slug,
  title: p.title,
  nav_label: p.navLabel,
  seo_title: p.seoTitle,
  seo_description: p.seoDescription,
  status: p.status,
  sort_order: p.sortOrder,
})

const toSection = (s) => ({
  page_slug: s.pageSlug,
  section_key: s.key,
  kind: s.kind,
  sort_order: s.sortOrder,
  visible: s.visible,
  status: s.status,
  draft: s.draft,
  published: s.published,
})

const toTeam = (r) => ({
  name: r.name,
  role: r.role,
  responsibilities: r.responsibilities || '',
  bio: r.bio || '',
  contribution: r.contribution || '',
  photo_url: r.photoUrl || '',
  links: r.links || [],
  sort_order: r.sortOrder ?? 99,
  published: Boolean(r.published),
})

const toMilestone = (r) => ({
  title: r.title,
  description: r.description || '',
  phase: r.phase || '',
  status: r.status,
  period: r.period || '',
  date: r.date || null,
  evidence_url: r.evidenceUrl || '',
  evidence_label: r.evidenceLabel || '',
  sort_order: r.sortOrder ?? 99,
  published: Boolean(r.published),
})

const toReference = (r) => ({
  authors: r.authors,
  title: r.title,
  source: r.source || '',
  year: r.year || '',
  url: r.url || '',
  doi: r.doi || '',
  note: r.note || '',
  sort_order: r.sortOrder ?? 99,
  published: Boolean(r.published),
})

const toDocument = (r) => ({
  title: r.title,
  description: r.description || '',
  category: r.category || '',
  file_url: r.fileUrl || '',
  file_size: r.fileSize || 0,
  file_type: r.fileType || '',
  version: r.version || '1.0',
  sort_order: r.sortOrder ?? 99,
  published: Boolean(r.published),
})

/* ---------------------------------- run ----------------------------------- */

async function replaceAll(table, rows) {
  check(await db.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000'), `clear ${table}`)
  if (rows.length) check(await db.from(table).insert(rows), `insert ${table}`)
  console.log(`  ${table}: ${rows.length} row(s)`)
}

/** Shipped image assets shown in the admin media library. */
const localMedia = [
  { name: 'Mishawash X logo', folder: 'logo', url: '/images/logo/mishawash-x-logo.jpg', alt: 'Mishawash X logo', mime: 'image/jpeg', size: 26854 },
  { name: 'K M Faisal Shahriar', folder: 'team', url: '/images/team/faisal-shahriar.png', alt: 'Portrait of K M Faisal Shahriar', mime: 'image/png', size: 168320 },
  { name: 'Md Masraful Haque Oyone', folder: 'team', url: '/images/team/masraful-haque.png', alt: 'Portrait of Md Masraful Haque Oyone', mime: 'image/png', size: 134933 },
  { name: 'Tamim Iqbal', folder: 'team', url: '/images/team/tamim-iqbal.png', alt: 'Portrait of Tamim Iqbal', mime: 'image/png', size: 106051 },
  { name: 'Ahnaf Alam Zarif', folder: 'team', url: '/images/team/ahnaf-alam-zarif.jpg', alt: 'Ahnaf Alam Zarif receiving an award', mime: 'image/jpeg', size: 127320 },
  { name: 'Ahmed Mosaidul Mehran', folder: 'team', url: '/images/team/ahmed-mehran.jpg', alt: 'Portrait of Ahmed Mosaidul Mehran', mime: 'image/jpeg', size: 49119 },
  { name: '3ZERO Leadership Challenge', folder: 'achievements', url: '/images/achievements/3zero-leadership.png', alt: '3ZERO Leadership Challenge recognition', mime: 'image/png', size: 2869921 },
  { name: 'Al Khwarizmi Science Fest', folder: 'achievements', url: '/images/achievements/al-khwarizmi.png', alt: 'Al Khwarizmi Science Fest award', mime: 'image/png', size: 3390906 },
  { name: 'BGB Award', folder: 'achievements', url: '/images/achievements/bgb-award.png', alt: 'BGB Award, Dhaka', mime: 'image/png', size: 3016710 },
  { name: 'Educational Excellence — Dhaka Zilla', folder: 'achievements', url: '/images/achievements/educational-excellence-zilla.png', alt: 'Educational Excellence Support Scheme, Dhaka Zilla', mime: 'image/png', size: 3825730 },
  { name: 'Educational Excellence — Thana', folder: 'achievements', url: '/images/achievements/educational-excellence-thana.png', alt: 'Educational Excellence Support Scheme, Thana', mime: 'image/png', size: 4239517 },
  { name: 'GRIC international round', folder: 'achievements', url: '/images/achievements/gric-international.png', alt: 'GRIC international round', mime: 'image/png', size: 4592279 },
  { name: 'Innovation World Cup 2026', folder: 'achievements', url: '/images/achievements/innovation-world-cup.png', alt: 'Innovation World Cup 2026 recognition', mime: 'image/png', size: 5798902 },
  { name: 'Project visit at BCFCC', folder: 'achievements', url: '/images/achievements/pm-visit-bcfcc.png', alt: 'Prime Minister visiting the Mishawash X project at BCFCC', mime: 'image/png', size: 3599591 },
]

async function registerLocalMedia() {
  check(await db.from('media_assets').delete().like('url', '/images/%'), 'clear shipped media')
  const rows = localMedia.map((m) => ({
    name: m.name,
    folder: m.folder,
    url: m.url,
    alt_text: m.alt,
    caption: '',
    mime_type: m.mime,
    size_bytes: m.size,
  }))
  check(await db.from('media_assets').insert(rows), 'insert shipped media')
  console.log(`  media_assets: ${rows.length} shipped asset(s)`)
}

async function main() {
  console.log('Creating admin users…')
  await ensureUser('admin@mishawashx.local', '262946', 'Mishawash X Administrator')
  await ensureUser('dev@mishawashx.local', '262946MishwasXDev', 'Mishawash X Developer')

  console.log('Writing content…')
  check(
    await db.from('site_settings').upsert({ id: 'global', data: seedState.settings }),
    'site_settings',
  )
  console.log('  site_settings: 1 row')

  check(
    await db.from('pages').upsert(seedState.pages.map(toPage), { onConflict: 'slug' }),
    'pages',
  )
  console.log(`  pages: ${seedState.pages.length} row(s)`)

  check(
    await db
      .from('page_sections')
      .upsert(seedState.sections.map(toSection), { onConflict: 'page_slug,section_key' }),
    'page_sections',
  )
  console.log(`  page_sections: ${seedState.sections.length} row(s)`)

  await replaceAll('team_members', seedState.team.map(toTeam))
  await replaceAll('research_milestones', seedState.milestones.map(toMilestone))
  await replaceAll('scientific_references', seedState.references.map(toReference))
  await replaceAll('resources', seedState.documents.map(toDocument))
  await replaceAll('research_documents', seedState.researchDocuments.map(toDocument))
  await registerLocalMedia()

  console.log('Done. Content is live in Supabase.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
