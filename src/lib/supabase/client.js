import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

/**
 * Supabase is optional at build time. When the two public environment
 * variables are absent the site runs in Local Studio mode: content is stored
 * in the browser, and the admin is a local editing environment.
 *
 * SECURITY: only the anon (public) key is ever used in the browser. Row Level
 * Security enforces that unauthenticated visitors can only read published
 * content. The service-role key must never be placed in this project.
 */
export const isSupabaseConfigured = Boolean(
  url &&
    anonKey &&
    /^https?:\/\//.test(url) &&
    !url.includes('your-project') &&
    !anonKey.includes('your-anon-key'),
)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        // PKCE keeps the auth callback in the query string, which avoids a
        // collision with HashRouter's use of the URL fragment.
        flowType: 'pkce',
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'mishawash-x-auth',
      },
      global: { headers: { 'x-application-name': 'mishawash-x-website' } },
    })
  : null

/** Absolute site base URL, respecting the GitHub Pages base path. */
export function siteBaseUrl() {
  if (typeof window === 'undefined') return ''
  const base = import.meta.env.BASE_URL || '/'
  return `${window.location.origin}${base}`.replace(/\/$/, '')
}

/** Storage bucket used by the media manager. */
export const MEDIA_BUCKET = 'media'
export const DOCUMENTS_BUCKET = 'documents'
