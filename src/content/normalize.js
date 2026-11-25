import { seedState, seedSections, seedPages } from './seed'

const clone = (value) => JSON.parse(JSON.stringify(value))

export function deepMerge(base, override) {
  if (!override || typeof override !== 'object' || Array.isArray(override)) return override ?? base
  const out = { ...base }
  Object.keys(override).forEach((key) => {
    const b = base?.[key]
    const o = override[key]
    out[key] = b && typeof b === 'object' && !Array.isArray(b) ? deepMerge(b, o) : o
  })
  return out
}

/**
 * Guarantee that stored content always has the shape the app expects.
 * New seed sections are appended automatically so that adding a section in
 * code never leaves an existing installation without it.
 */
export function normalizeState(raw) {
  const base = clone(seedState)
  if (!raw || typeof raw !== 'object') return base

  const storedSections = Array.isArray(raw.sections) ? raw.sections : []
  const byKey = new Map(storedSections.map((s) => [`${s.pageSlug}:${s.key}`, s]))

  const sections = seedSections.map((seedSection) => {
    const existing = byKey.get(`${seedSection.pageSlug}:${seedSection.key}`)
    if (!existing) return clone(seedSection)
    byKey.delete(`${seedSection.pageSlug}:${seedSection.key}`)
    return {
      ...seedSection,
      ...existing,
      draft: existing.draft ?? seedSection.draft,
      published: existing.published ?? seedSection.published,
      sortOrder: existing.sortOrder ?? seedSection.sortOrder,
    }
  })

  // Preserve any custom sections an administrator has created.
  byKey.forEach((value) => sections.push(value))

  const storedPages = Array.isArray(raw.pages) ? raw.pages : []
  const pageMap = new Map(storedPages.map((p) => [p.slug, p]))
  const pages = seedPages.map((seedPage) => ({ ...seedPage, ...(pageMap.get(seedPage.slug) || {}) }))
  pageMap.forEach((value, slug) => {
    if (!seedPages.some((p) => p.slug === slug)) pages.push(value)
  })

  return {
    version: seedState.version,
    settings: deepMerge(base.settings, raw.settings || {}),
    pages,
    sections: sections.sort((a, b) => a.sortOrder - b.sortOrder),
    team: Array.isArray(raw.team) ? raw.team : [],
    milestones: Array.isArray(raw.milestones) ? raw.milestones : [],
    references: Array.isArray(raw.references) ? raw.references : [],
    documents: Array.isArray(raw.documents) ? raw.documents : [],
    researchDocuments: Array.isArray(raw.researchDocuments) ? raw.researchDocuments : [],
    media: Array.isArray(raw.media) ? raw.media : [],
    inquiries: Array.isArray(raw.inquiries) ? raw.inquiries : [],
    updatedAt: raw.updatedAt || base.updatedAt,
  }
}

/** Collections stored in the state, mapped to their storage keys. */
export const COLLECTION_KEYS = ['team', 'milestones', 'references', 'documents', 'researchDocuments', 'inquiries']
