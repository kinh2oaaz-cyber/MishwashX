import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured, siteBaseUrl } from '../lib/supabase/client'

const AuthContext = createContext(null)

const LOCAL_SESSION_KEY = 'mishawash-x:studio-session'

// Emergency fallback passwords. In Supabase mode these belong to the two
// master accounts; in Local Studio mode either one unlocks this browser.
const FALLBACK_PASSWORDS = ['262946', '262946MishwasXDev']

/**
 * Authentication
 * ---------------------------------------------------------------------------
 * Supabase mode  : real email/password authentication with PKCE. Administrator
 *                  status is read from the `profiles` table and enforced again
 *                  by Row Level Security on every write.
 * Local Studio   : no server exists, so there is nothing to authenticate
 *                  against. Access is an explicit, clearly-labelled session on
 *                  this browser only. It grants no access to any shared data
 *                  and is not a security boundary.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [recoveryMode, setRecoveryMode] = useState(false)
  const handledCode = useRef(false)

  const isLocal = !isSupabaseConfigured

  /* ------------------------------ local mode ----------------------------- */

  useEffect(() => {
    if (!isLocal) return
    try {
      const raw = sessionStorage.getItem(LOCAL_SESSION_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setSession(parsed)
        setProfile({ fullName: 'Local studio operator', role: 'admin' })
      }
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [isLocal])

  const enterLocalStudio = useCallback(async (password = '') => {
    if (!FALLBACK_PASSWORDS.includes(password)) {
      return { ok: false, error: 'Invalid password for admin access.' }
    }

    const localSession = { email: 'local-studio@this-browser', startedAt: new Date().toISOString() }
    sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(localSession))
    setSession(localSession)
    setProfile({ fullName: 'Local studio operator', role: 'admin' })
    return { ok: true }
  }, [])

  /* ---------------------------- supabase mode ---------------------------- */

  const loadProfile = useCallback(async (userId) => {
    if (!supabase || !userId) return null
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', userId)
      .maybeSingle()
    if (error) {
      // A missing profile row is not a fatal error — RLS still blocks writes.
      return null
    }
    return data
  }, [])

  useEffect(() => {
    if (isLocal || !supabase) return
    let active = true

    async function init() {
      // PKCE recovery / invite links arrive as ?code=...
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      if (code && !handledCode.current) {
        handledCode.current = true
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) setAuthError(error.message)
        const clean = window.location.pathname + window.location.hash
        window.history.replaceState({}, '', clean)
        if (!error) setRecoveryMode(true)
      }

      const { data } = await supabase.auth.getSession()
      if (!active) return
      setSession(data.session)
      if (data.session?.user) {
        setProfile(await loadProfile(data.session.user.id))
      }
      setLoading(false)
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      setSession(nextSession)
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true)
      if (nextSession?.user) {
        setProfile(await loadProfile(nextSession.user.id))
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [isLocal, loadProfile])

  const signIn = useCallback(
    async (email, password) => {
      setAuthError(null)
      if (isLocal) return enterLocalStudio()
      if (!supabase) return { ok: false, error: 'Supabase is not configured.' }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) {
        setAuthError(error.message)
        return { ok: false, error: error.message }
      }
      const p = await loadProfile(data.user?.id)
      if (!p || (p.role !== 'admin' && p.role !== 'editor')) {
        await supabase.auth.signOut()
        const message =
          'This account does not have administrator access. Contact the site owner to be granted a role.'
        setAuthError(message)
        return { ok: false, error: message }
      }
      setProfile(p)
      return { ok: true }
    },
    [enterLocalStudio, isLocal, loadProfile],
  )

  const signOut = useCallback(async () => {
    setAuthError(null)
    if (isLocal) {
      sessionStorage.removeItem(LOCAL_SESSION_KEY)
      setSession(null)
      setProfile(null)
      return
    }
    if (supabase) await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }, [isLocal])

  const requestPasswordReset = useCallback(
    async (email) => {
      setAuthError(null)
      if (isLocal) {
        return {
          ok: false,
          error: 'Password reset requires a connected Supabase project.',
        }
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${siteBaseUrl()}/`,
      })
      if (error) {
        setAuthError(error.message)
        return { ok: false, error: error.message }
      }
      return { ok: true }
    },
    [isLocal],
  )

  const updatePassword = useCallback(
    async (password) => {
      if (isLocal) return { ok: false, error: 'Not available in Local Studio mode.' }
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setAuthError(error.message)
        return { ok: false, error: error.message }
      }
      setRecoveryMode(false)
      return { ok: true }
    },
    [isLocal],
  )

  const value = useMemo(() => {
    const role = profile?.role
    return {
      mode: isLocal ? 'local' : 'supabase',
      session,
      user: session?.user ?? (isLocal ? session : null),
      profile,
      loading,
      authError,
      setAuthError,
      recoveryMode,
      setRecoveryMode,
      isAdmin: Boolean(session) && (isLocal || role === 'admin' || role === 'editor'),
      isOwner: Boolean(session) && (isLocal || role === 'admin'),
      signIn,
      signOut,
      requestPasswordReset,
      updatePassword,
      enterLocalStudio,
    }
  }, [
    isLocal,
    session,
    profile,
    loading,
    authError,
    recoveryMode,
    signIn,
    signOut,
    requestPasswordReset,
    updatePassword,
    enterLocalStudio,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
