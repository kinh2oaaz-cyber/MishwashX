/**
 * The content studio lives at an opaque path rather than an obvious `/admin`.
 * Change it here and every route, redirect and sidebar link follows.
 */
export const ADMIN_PATH = '/mx-internal-3d8e1b'
export const ADMIN_ROUTE = ADMIN_PATH.replace(/^\//, '')
export const ADMIN_LOGIN_PATH = `${ADMIN_PATH}/login`
export const ADMIN_LOGIN_ROUTE = `${ADMIN_ROUTE}/login`

export function adminPath(suffix = '') {
  return suffix ? `${ADMIN_PATH}/${String(suffix).replace(/^\//, '')}` : ADMIN_PATH
}

export function isAdminPath(pathname = '') {
  return pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`)
}
