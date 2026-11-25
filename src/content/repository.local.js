import { normalizeState } from './normalize'
import { seedState } from './seed'
import { mediaDb, fileToDataUrl } from '../lib/storage/idb'

const CONTENT_KEY = 'mishawash-x:content:v1'

const MAX_IMAGE_BYTES = 6 * 1024 * 1024
const MAX_DOC_BYTES = 20 * 1024 * 1024
const ALLOWED_IMAGES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
const ALLOWED_DOCS = ['application/pdf']

/**
 * LOCAL STUDIO MODE
 * ---------------------------------------------------------------------------
 * Content is persisted to localStorage, media blobs to IndexedDB.
 * This mode exists so the entire site and admin can be developed and reviewed
 * before a Supabase project is connected. It is NOT a multi-user backend and
 * must not be used to collect real personal data.
 */
export function createLocalRepository() {
  let mediaCache = []

  async function readMedia() {
    try {
      mediaCache = await mediaDb.all()
    } catch {
      mediaCache = []
    }
    return mediaCache
  }

  return {
    mode: 'local',

    async load() {
      let stored = null
      try {
        const raw = localStorage.getItem(CONTENT_KEY)
        if (raw) stored = JSON.parse(raw)
      } catch {
        stored = null
      }
      const state = normalizeState(stored)
      state.media = await readMedia()
      return state
    },

    async save(state) {
      const payload = { ...state, media: [] }
      try {
        localStorage.setItem(CONTENT_KEY, JSON.stringify(payload))
      } catch (err) {
        throw new Error(
          'Local storage is full. Remove unused media or connect a Supabase project for production content storage.',
          { cause: err },
        )
      }
    },

    /**
     * Local mode persists the whole content graph on every change. The
     * `change` argument is accepted for interface parity with Supabase.
     */
    async commit(state) {
      await this.save(state)
    },

    async reset() {
      localStorage.removeItem(CONTENT_KEY)
      try {
        await mediaDb.clear()
      } catch {
        /* ignore */
      }
      mediaCache = []
      return normalizeState(null)
    },

    async uploadMedia(file, meta = {}) {
      const isImage = ALLOWED_IMAGES.includes(file.type)
      const isDoc = ALLOWED_DOCS.includes(file.type)
      if (!isImage && !isDoc) {
        throw new Error('Unsupported file type. Upload JPEG, PNG, WebP, AVIF, SVG or PDF.')
      }
      const limit = isImage ? MAX_IMAGE_BYTES : MAX_DOC_BYTES
      if (file.size > limit) {
        throw new Error(`File is too large. Maximum size is ${Math.round(limit / 1024 / 1024)} MB.`)
      }
      const dataUrl = await fileToDataUrl(file)
      const record = {
        id: crypto.randomUUID ? crypto.randomUUID() : `media-${Date.now()}`,
        name: meta.name || file.name,
        folder: meta.folder || 'general',
        alt: meta.alt || '',
        caption: meta.caption || '',
        mime: file.type,
        size: file.size,
        url: dataUrl,
        storagePath: '',
        createdAt: new Date().toISOString(),
      }
      await mediaDb.put(record)
      mediaCache = [...mediaCache.filter((m) => m.id !== record.id), record]
      return record
    },

    async updateMedia(id, patch) {
      const existing = mediaCache.find((m) => m.id === id)
      if (!existing) throw new Error('Asset not found')
      const next = { ...existing, ...patch }
      await mediaDb.put(next)
      mediaCache = mediaCache.map((m) => (m.id === id ? next : m))
      return next
    },

    async deleteMedia(id) {
      await mediaDb.remove(id)
      mediaCache = mediaCache.filter((m) => m.id !== id)
    },
  }
}

export { CONTENT_KEY, MAX_IMAGE_BYTES, MAX_DOC_BYTES, ALLOWED_IMAGES, ALLOWED_DOCS }
export const localDefaults = () => normalizeState(seedState)
