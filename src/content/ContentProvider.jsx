import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase/client'
import { createLocalRepository } from './repository.local'
import { createSupabaseRepository } from './repository.supabase'
import { deepMerge } from './normalize'
import { makeId } from '../lib/utils/format'

const ContentContext = createContext(null)

const EMPTY = {
  settings: null,
  pages: [],
  sections: [],
  team: [],
  milestones: [],
  references: [],
  documents: [],
  researchDocuments: [],
  media: [],
  inquiries: [],
}

export function ContentProvider({ children }) {
  const repo = useMemo(
    () => (isSupabaseConfigured ? createSupabaseRepository() : createLocalRepository()),
    [],
  )

  const [state, setState] = useState(null)
  const stateRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [previewDrafts, setPreviewDrafts] = useState(false)
  const [saving, setSaving] = useState(false)

  const setBoth = useCallback((next) => {
    stateRef.current = next
    setState(next)
  }, [])

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const loaded = await repo.load()
      setBoth(loaded)
      setStatus('ready')
    } catch (err) {
      setError(err.message || 'Unable to load content')
      setStatus('error')
    }
  }, [repo, setBoth])

  useEffect(() => {
    load()
  }, [load])

  /** Optimistic update with rollback on failure. */
  const apply = useCallback(
    async (updater, change) => {
      const prev = stateRef.current
      if (!prev) return
      const next = { ...updater(prev), updatedAt: new Date().toISOString() }
      setBoth(next)
      setSaving(true)
      try {
        await repo.commit(next, change)
      } catch (err) {
        setBoth(prev)
        setError(err.message || 'Save failed')
        throw err
      } finally {
        setSaving(false)
      }
      return next
    },
    [repo, setBoth],
  )

  /* ------------------------------- selectors ----------------------------- */

  const sectionsFor = useCallback(
    (pageSlug) => (state?.sections || []).filter((s) => s.pageSlug === pageSlug).sort((a, b) => a.sortOrder - b.sortOrder),
    [state],
  )

  const liveSections = useCallback(
    (pageSlug) =>
      sectionsFor(pageSlug).filter((s) => s.visible && s.status === 'published' && s.published),
    [sectionsFor],
  )

  const getSection = useCallback(
    (pageSlug, key) => (state?.sections || []).find((s) => s.pageSlug === pageSlug && s.key === key),
    [state],
  )

  /** Published content for a section, or draft content in preview mode. */
  const content = useCallback(
    (pageSlug, key, fallback = {}) => {
      const section = getSection(pageSlug, key)
      if (!section) return fallback
      if (previewDrafts) return section.draft ?? fallback
      return section.published ?? fallback
    },
    [getSection, previewDrafts],
  )

  const getPage = useCallback((slug) => state?.pages?.find((p) => p.slug === slug), [state])

  /* -------------------------------- mutations ---------------------------- */

  const updateSettings = useCallback(
    async (patch) => {
      const settings = deepMerge(stateRef.current.settings, patch)
      return apply((prev) => ({ ...prev, settings }), { type: 'settings', settings })
    },
    [apply],
  )

  const updatePage = useCallback(
    async (slug, patch) => {
      const page = { ...getPage(slug), ...patch }
      return apply(
        (prev) => ({ ...prev, pages: prev.pages.map((p) => (p.slug === slug ? page : p)) }),
        { type: 'page', page },
      )
    },
    [apply, getPage],
  )

  const updateSection = useCallback(
    async (pageSlug, key, patch) => {
      const existing = getSection(pageSlug, key)
      if (!existing) throw new Error('Section not found')
      const section = {
        ...existing,
        ...patch,
        draft: patch.draft ? { ...existing.draft, ...patch.draft } : existing.draft,
        updatedAt: new Date().toISOString(),
      }
      return apply(
        (prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.pageSlug === pageSlug && s.key === key ? section : s,
          ),
        }),
        { type: 'section', section },
      )
    },
    [apply, getSection],
  )

  const publishSection = useCallback(
    async (pageSlug, key) => {
      const existing = getSection(pageSlug, key)
      if (!existing) return
      const section = {
        ...existing,
        status: 'published',
        published: existing.draft,
        updatedAt: new Date().toISOString(),
      }
      return apply(
        (prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.pageSlug === pageSlug && s.key === key ? section : s,
          ),
        }),
        { type: 'section', section },
      )
    },
    [apply, getSection],
  )

  const unpublishSection = useCallback(
    async (pageSlug, key) => {
      const existing = getSection(pageSlug, key)
      if (!existing) return
      const section = { ...existing, status: 'draft', updatedAt: new Date().toISOString() }
      return apply(
        (prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.pageSlug === pageSlug && s.key === key ? section : s,
          ),
        }),
        { type: 'section', section },
      )
    },
    [apply, getSection],
  )

  const publishPage = useCallback(
    async (slug) => {
      const page = { ...getPage(slug), status: 'published' }
      const nextSections = stateRef.current.sections.map((s) =>
        s.pageSlug === slug
          ? { ...s, status: 'published', published: s.draft, updatedAt: new Date().toISOString() }
          : s,
      )
      const target = nextSections.filter((s) => s.pageSlug === slug)
      const next = await apply(
        (prev) => ({ ...prev, pages: prev.pages.map((p) => (p.slug === slug ? page : p)), sections: nextSections }),
        { type: 'sectionsOrder', sections: target },
      )
      await repo.commit(next, { type: 'page', page })
      return next
    },
    [apply, getPage, repo],
  )

  const reorderSections = useCallback(
    async (slug, orderedKeys) => {
      const all = sectionsFor(slug)
      const ordered = orderedKeys
        .map((key) => all.find((s) => s.key === key))
        .filter(Boolean)
      ordered.forEach((s, i) => {
        s.sortOrder = i + 1
      })
      return apply(
        (prev) => ({
          ...prev,
          sections: prev.sections
            .map((s) => (s.pageSlug === slug ? ordered.find((o) => o.key === s.key) || s : s))
            .sort((a, b) => a.sortOrder - b.sortOrder),
        }),
        { type: 'sectionsOrder', sections: ordered },
      )
    },
    [apply, sectionsFor],
  )

  const upsertRecord = useCallback(
    async (collection, record) => {
      const isNew = !record.id
      const withId = { ...record, id: record.id || makeId(), updatedAt: new Date().toISOString() }
      const list = stateRef.current[collection] || []
      const exists = list.some((r) => r.id === withId.id)
      const nextList = exists
        ? list.map((r) => (r.id === withId.id ? withId : r))
        : [...list, withId]
      return apply(
        (prev) => ({ ...prev, [collection]: nextList }),
        { type: 'record:upsert', collection, record: withId, isNew },
      )
    },
    [apply],
  )

  const deleteRecord = useCallback(
    async (collection, id) => {
      return apply(
        (prev) => ({ ...prev, [collection]: (prev[collection] || []).filter((r) => r.id !== id) }),
        { type: 'record:delete', collection, id },
      )
    },
    [apply],
  )

  const reorderRecords = useCallback(
    async (collection, orderedIds) => {
      const list = stateRef.current[collection] || []
      const ordered = orderedIds.map((id) => list.find((r) => r.id === id)).filter(Boolean)
      ordered.forEach((r, i) => {
        r.sortOrder = i + 1
      })
      return apply(
        (prev) => ({ ...prev, [collection]: ordered }),
        { type: 'record:order', collection, items: ordered },
      )
    },
    [apply],
  )

  /* --------------------------------- media ------------------------------- */

  const uploadMedia = useCallback(
    async (file, meta = {}) => {
      setSaving(true)
      try {
        const record = await repo.uploadMedia(file, meta)
        setBoth({ ...stateRef.current, media: [record, ...(stateRef.current.media || [])] })
        return record
      } catch (err) {
        setError(err.message || 'Upload failed')
        throw err
      } finally {
        setSaving(false)
      }
    },
    [repo, setBoth],
  )

  const updateMedia = useCallback(
    async (id, patch) => {
      const record = await repo.updateMedia(id, patch)
      setBoth({
        ...stateRef.current,
        media: stateRef.current.media.map((m) => (m.id === id ? record : m)),
      })
      return record
    },
    [repo, setBoth],
  )

  const deleteMedia = useCallback(
    async (id) => {
      const record = stateRef.current.media.find((m) => m.id === id)
      await repo.deleteMedia(record || { id })
      setBoth({ ...stateRef.current, media: stateRef.current.media.filter((m) => m.id !== id) })
    },
    [repo, setBoth],
  )

  /* ------------------------------- inquiries ----------------------------- */

  const submitInquiry = useCallback(
    async (payload) => {
      const record = {
        id: makeId(),
        ...payload,
        status: 'new',
        createdAt: new Date().toISOString(),
      }
      if (repo.mode === 'supabase') {
        await repo.createInquiry({
          name: payload.name,
          email: payload.email,
          organisation: payload.organisation,
          subject: payload.subject,
          message: payload.message,
        })
      } else {
        setBoth({ ...stateRef.current, inquiries: [record, ...(stateRef.current.inquiries || [])] })
      }
      return record
    },
    [repo, setBoth],
  )

  /* -------------------------------- admin ops ---------------------------- */

  const updateInquiry = useCallback(
    async (id, patch) => {
      const inquiries = (stateRef.current.inquiries || []).map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      )
      return apply((prev) => ({ ...prev, inquiries }), {
        type: 'inquiry:update',
        id,
        patch,
      })
    },
    [apply],
  )

  const deleteInquiry = useCallback(
    async (id) => {
      return apply(
        (prev) => ({ ...prev, inquiries: (prev.inquiries || []).filter((r) => r.id !== id) }),
        { type: 'inquiry:delete', id },
      )
    },
    [apply],
  )

  const seedDatabase = useCallback(async () => {
    if (repo.mode !== 'supabase') return
    await repo.seedDatabase(stateRef.current)
    await load()
  }, [repo, load])

  const resetContent = useCallback(async () => {
    const fresh = await repo.reset()
    setBoth(fresh)
    setStatus('ready')
  }, [repo, setBoth])

  const clearNotice = useCallback(() => setNotice(null), [])
  const clearError = useCallback(() => setError(null), [])

  const value = useMemo(
    () => ({
      mode: repo.mode,
      status,
      loading: status === 'loading',
      error,
      notice,
      setNotice,
      clearNotice,
      clearError,
      saving,
      state: state || EMPTY,
      settings: state?.settings || null,
      pages: state?.pages || [],
      sections: state?.sections || [],
      team: state?.team || [],
      milestones: state?.milestones || [],
      references: state?.references || [],
      documents: state?.documents || [],
      researchDocuments: state?.researchDocuments || [],
      media: state?.media || [],
      inquiries: state?.inquiries || [],
      needsSeed: Boolean(state?.needsSeed),
      previewDrafts,
      setPreviewDrafts,
      sectionsFor,
      liveSections,
      getSection,
      getPage,
      content,
      reload: load,
      updateSettings,
      updatePage,
      updateSection,
      publishSection,
      unpublishSection,
      publishPage,
      reorderSections,
      upsertRecord,
      deleteRecord,
      reorderRecords,
      uploadMedia,
      updateMedia,
      deleteMedia,
      submitInquiry,
      updateInquiry,
      deleteInquiry,
      seedDatabase,
      resetContent,
    }),
    [
      repo.mode,
      status,
      error,
      notice,
      saving,
      state,
      previewDrafts,
      sectionsFor,
      liveSections,
      getSection,
      getPage,
      content,
      load,
      updateSettings,
      updatePage,
      updateSection,
      publishSection,
      unpublishSection,
      publishPage,
      reorderSections,
      upsertRecord,
      deleteRecord,
      reorderRecords,
      uploadMedia,
      updateMedia,
      deleteMedia,
      submitInquiry,
      updateInquiry,
      deleteInquiry,
      seedDatabase,
      resetContent,
      clearNotice,
      clearError,
    ],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>')
  return ctx
}

/** Convenience: published content for one section. */
export function useSection(page, key, fallback = {}) {
  const { content } = useContent()
  return content(page, key, fallback)
}

/** Convenience: page meta record. */
export function usePageRecord(slug) {
  const { getPage } = useContent()
  return getPage(slug)
}
