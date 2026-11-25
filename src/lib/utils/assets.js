/**
 * Resolve an image URL against the deployment base path.
 *
 * Content stored in Supabase uses root-relative paths such as
 * `/images/team/faisal-shahriar.png`. On a GitHub Pages project site the app is
 * served from `/<repo>/`, where that URL would point to the wrong place. This
 * helper prefixes the base path for local assets while leaving absolute URLs,
 * data URLs and already-prefixed paths untouched.
 */
export function assetUrl(path) {
  if (!path || typeof path !== 'string') return ''
  if (/^(https?:|data:|blob:|mailto:)/i.test(path)) return path

  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const trimmed = path.trim().replace(/^\/+/, '')

  if (!base) return `/${trimmed}`
  if (path.startsWith(`${base}/`)) return path
  return `${base}/${trimmed}`
}
