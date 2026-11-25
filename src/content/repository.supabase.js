import { supabase, MEDIA_BUCKET, DOCUMENTS_BUCKET } from '../lib/supabase/client'
import { normalizeState } from './normalize'

/**
 * SUPABASE REPOSITORY
 * ---------------------------------------------------------------------------
 * Mirrors the local repository's interface. All writes rely on Row Level
 * Security: only an authenticated administrator can modify content. The anon
 * key in the browser cannot bypass these policies.
 *
 * Table mapping (camelCase app model  ->  snake_case column):
 *   team              -> team_members
 *   milestones        -> research_milestones
 *   references        -> scientific_references
 *   documents         -> resources
 *   researchDocuments -> research_documents
 *   inquiries         -> inquiries
 */

const TABLES = {
  team: 'team_members',
  milestones: 'research_milestones',
  references: 'scientific_references',
  documents: 'resources',
  researchDocuments: 'research_documents',
  inquiries: 'inquiries',
}

/* ----------------------------- row mappers ------------------------------- */

const fromPage = (r) => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  navLabel: r.nav_label,
  seoTitle: r.seo_title,
  seoDescription: r.seo_description,
  status: r.status,
  sortOrder: r.sort_order,
  updatedAt: r.updated_at,
})

const toPage = (p) => ({
  slug: p.slug,
  title: p.title,
  nav_label: p.navLabel,
  seo_title: p.seoTitle,
  seo_description: p.seoDescription,
  status: p.status,
  sort_order: p.sortOrder,
})

const fromSection = (r) => ({
  id: r.id,
  pageSlug: r.page_slug,
  key: r.section_key,
  kind: r.kind,
  sortOrder: r.sort_order,
  visible: r.visible,
  status: r.status,
  draft: r.draft,
  published: r.published,
  updatedAt: r.updated_at,
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

const fromTeam = (r) => ({
  id: r.id,
  name: r.name,
  role: r.role,
  responsibilities: r.responsibilities || '',
  bio: r.bio || '',
  contribution: r.contribution || '',
  photoUrl: r.photo_url || '',
  links: r.links || [],
  sortOrder: r.sort_order,
  published: r.published,
  updatedAt: r.updated_at,
})

const toTeam = (r) => ({
  name: r.name,
  role: r.role,
  responsibilities: r.responsibilities,
  bio: r.bio,
  contribution: r.contribution,
  photo_url: r.photoUrl,
  links: r.links || [],
  sort_order: r.sortOrder ?? 99,
  published: Boolean(r.published),
})

const fromMilestone = (r) => ({
  id: r.id,
  title: r.title,
  description: r.description || '',
  phase: r.phase || '',
  status: r.status,
  period: r.period || '',
  date: r.date,
  evidenceUrl: r.evidence_url || '',
  evidenceLabel: r.evidence_label || '',
  sortOrder: r.sort_order,
  published: r.published,
  updatedAt: r.updated_at,
})

const toMilestone = (r) => ({
  title: r.title,
  description: r.description,
  phase: r.phase,
  status: r.status,
  period: r.period,
  date: r.date || null,
  evidence_url: r.evidenceUrl || '',
  evidence_label: r.evidenceLabel || '',
  sort_order: r.sortOrder ?? 99,
  published: Boolean(r.published),
})

const fromReference = (r) => ({
  id: r.id,
  authors: r.authors,
  title: r.title,
  source: r.source || '',
  year: r.year || '',
  url: r.url || '',
  doi: r.doi || '',
  note: r.note || '',
  sortOrder: r.sort_order,
  published: r.published,
})

const toReference = (r) => ({
  authors: r.authors,
  title: r.title,
  source: r.source,
  year: r.year,
  url: r.url,
  doi: r.doi,
  note: r.note,
  sort_order: r.sortOrder ?? 99,
  published: Boolean(r.published),
})

const fromDocument = (r) => ({
  id: r.id,
  title: r.title,
  description: r.description || '',
  category: r.category || '',
  fileUrl: r.file_url || '',
  fileSize: r.file_size || 0,
  fileType: r.file_type || '',
  version: r.version || '',
  sortOrder: r.sort_order,
  published: r.published,
  updatedAt: r.updated_at,
})

const toDocument = (r) => ({
  title: r.title,
  description: r.description,
  category: r.category,
  file_url: r.fileUrl,
  file_size: r.fileSize || 0,
  file_type: r.fileType,
  version: r.version,
  sort_order: r.sortOrder ?? 99,
  published: Boolean(r.published),
})

const fromInquiry = (r) => ({
  id: r.id,
  name: r.name || '',
  email: r.email || '',
  organisation: r.organisation || '',
  subject: r.subject || '',
  message: r.message || '',
  status: r.status || 'new',
  createdAt: r.created_at,
})

const fromMedia = (r) => ({
  id: r.id,
  name: r.name,
  folder: r.folder || 'general',
  alt: r.alt_text || '',
  caption: r.caption || '',
  mime: r.mime_type || '',
  size: r.size_bytes || 0,
  url: r.url || '',
  storagePath: r.storage_path || '',
  createdAt: r.created_at,
})

const MAPPERS = {
  team: { from: fromTeam, to: toTeam },
  milestones: { from: fromMilestone, to: toMilestone },
  references: { from: fromReference, to: toReference },
  documents: { from: fromDocument, to: toDocument },
  researchDocuments: { from: fromDocument, to: toDocument },
}

/* ------------------------------- helpers -------------------------------- */

function unwrap({ data, error }) {
  if (error) throw new Error(error.message)
  return data
}

function safeFileName(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .slice(-80)
}

const MAX_IMAGE_BYTES = 6 * 1024 * 1024
const MAX_DOC_BYTES = 20 * 1024 * 1024
const ALLOWED_IMAGES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const ALLOWED_DOCS = ['application/pdf']

export function createSupabaseRepository() {
  if (!supabase) throw new Error('Supabase is not configured')

  return {
    mode: 'supabase',

    async load() {
      const [
        settingsRes,
        pagesRes,
        sectionsRes,
        teamRes,
        msRes,
        refsRes,
        docsRes,
        rdocsRes,
        mediaRes,
        inquiriesRes,
      ] = await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 'global').maybeSingle(),
        supabase.from('pages').select('*').order('sort_order'),
        supabase.from('page_sections').select('*').order('sort_order'),
        supabase.from('team_members').select('*').order('sort_order'),
        supabase.from('research_milestones').select('*').order('sort_order'),
        supabase.from('scientific_references').select('*').order('sort_order'),
        supabase.from('resources').select('*').order('sort_order'),
        supabase.from('research_documents').select('*').order('sort_order'),
        supabase.from('media_assets').select('*').order('created_at', { ascending: false }),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      ])

      const settings = settingsRes.data?.data
      const pages = pagesRes.data || []
      const sections = sectionsRes.data || []

      const state = normalizeState({
        settings: settings || undefined,
        pages: pages.map(fromPage),
        sections: sections.map(fromSection),
        team: (teamRes.data || []).map(fromTeam),
        milestones: (msRes.data || []).map(fromMilestone),
        references: (refsRes.data || []).map(fromReference),
        documents: (docsRes.data || []).map(fromDocument),
        researchDocuments: (rdocsRes.data || []).map(fromDocument),
        media: (mediaRes.data || []).map(fromMedia),
        inquiries: (inquiriesRes.data || []).map(fromInquiry),
      })

      return { ...state, needsSeed: pages.length === 0 }
    },

    /** Write the current in-memory content into an empty database. */
    async seedDatabase(state) {
      unwrap(
        await supabase.from('site_settings').upsert({ id: 'global', data: state.settings }),
      )
      unwrap(await supabase.from('pages').upsert(state.pages.map(toPage), { onConflict: 'slug' }))
      unwrap(
        await supabase
          .from('page_sections')
          .upsert(state.sections.map(toSection), { onConflict: 'page_slug,section_key' }),
      )
      if (state.references.length) {
        unwrap(await supabase.from('scientific_references').insert(state.references.map(toReference)))
      }
      if (state.milestones.length) {
        unwrap(await supabase.from('research_milestones').insert(state.milestones.map(toMilestone)))
      }
    },

    async commit(state, change) {
      switch (change.type) {
        case 'settings':
          unwrap(
            await supabase
              .from('site_settings')
              .upsert({ id: 'global', data: change.settings, updated_at: new Date().toISOString() }),
          )
          break

        case 'page':
          unwrap(
            await supabase
              .from('pages')
              .upsert(toPage(change.page), { onConflict: 'slug' }),
          )
          break

        case 'section':
          unwrap(
            await supabase
              .from('page_sections')
              .upsert(toSection(change.section), { onConflict: 'page_slug,section_key' }),
          )
          break

        case 'sectionsOrder': {
          const rows = change.sections.map((s) => ({
            page_slug: s.pageSlug,
            section_key: s.key,
            kind: s.kind,
            sort_order: s.sortOrder,
            visible: s.visible,
            status: s.status,
            draft: s.draft,
            published: s.published,
          }))
          unwrap(
            await supabase
              .from('page_sections')
              .upsert(rows, { onConflict: 'page_slug,section_key' }),
          )
          break
        }

        case 'record:upsert': {
          const mapper = MAPPERS[change.collection]
          if (!mapper) throw new Error(`Unknown collection: ${change.collection}`)
          const table = TABLES[change.collection]
          const row = mapper.to(change.record)
          if (change.isNew) {
            unwrap(await supabase.from(table).insert(row))
          } else {
            unwrap(await supabase.from(table).update(row).eq('id', change.record.id))
          }
          break
        }

        case 'record:delete': {
          const table = TABLES[change.collection]
          unwrap(await supabase.from(table).delete().eq('id', change.id))
          break
        }

        case 'record:order': {
          const table = TABLES[change.collection]
          await Promise.all(
            change.items.map((item, index) =>
              supabase.from(table).update({ sort_order: index + 1 }).eq('id', item.id),
            ),
          )
          break
        }

        case 'inquiry':
          unwrap(await supabase.from('inquiries').insert(change.inquiry))
          break

        case 'inquiry:update':
          unwrap(
            await supabase.from('inquiries').update(change.patch).eq('id', change.id),
          )
          break

        case 'inquiry:delete':
          unwrap(await supabase.from('inquiries').delete().eq('id', change.id))
          break

        default:
          break
      }
    },

    async uploadMedia(file, meta = {}) {
      const isImage = ALLOWED_IMAGES.includes(file.type)
      const isDoc = ALLOWED_DOCS.includes(file.type)
      if (!isImage && !isDoc) {
        throw new Error('Unsupported file type. Upload JPEG, PNG, WebP, AVIF or PDF.')
      }
      const limit = isImage ? MAX_IMAGE_BYTES : MAX_DOC_BYTES
      if (file.size > limit) {
        throw new Error(`File is too large. Maximum size is ${Math.round(limit / 1024 / 1024)} MB.`)
      }

      const folder = meta.folder || (isImage ? 'images' : 'documents')
      const bucket = isDoc ? DOCUMENTS_BUCKET : MEDIA_BUCKET
      const path = `${folder}/${Date.now()}-${safeFileName(file.name)}`

      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
        contentType: file.type,
      })
      if (error) throw new Error(error.message)

      const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path)

      const row = {
        name: meta.name || file.name,
        storage_path: `${bucket}/${path}`,
        url: publicUrl.publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        folder,
        alt_text: meta.alt || '',
        caption: meta.caption || '',
      }
      const saved = unwrap(await supabase.from('media_assets').insert(row).select().single())
      return fromMedia(saved)
    },

    async updateMedia(id, patch) {
      const row = {}
      if (patch.name !== undefined) row.name = patch.name
      if (patch.alt !== undefined) row.alt_text = patch.alt
      if (patch.caption !== undefined) row.caption = patch.caption
      if (patch.folder !== undefined) row.folder = patch.folder
      const saved = unwrap(await supabase.from('media_assets').update(row).eq('id', id).select().single())
      return fromMedia(saved)
    },

    async deleteMedia(record) {
      if (record?.storagePath) {
        const [bucket, ...rest] = record.storagePath.split('/')
        await supabase.storage.from(bucket).remove([rest.join('/')])
      }
      unwrap(await supabase.from('media_assets').delete().eq('id', record.id))
    },

    async createInquiry(payload) {
      unwrap(await supabase.from('inquiries').insert(payload))
    },

    async listInquiries() {
      return unwrap(
        await supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      )
    },

    async reset() {
      throw new Error('Resetting a live database must be done from the Supabase dashboard.')
    },
  }
}
