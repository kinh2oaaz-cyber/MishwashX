import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, KeyRound, Loader2, Lock, Mail, ShieldAlert } from 'lucide-react'
import { useAuth } from '../../content/AuthProvider'
import { BrandMark } from '../../components/common/Logo'
import { MolecularCanvas } from '../../components/scientific/MolecularCanvas'
import { Alert } from './components/AdminUI'
import { useContent } from '../../content/ContentProvider'
import { adminPath } from '../../lib/utils/adminPath'

const FALLBACK_ACCOUNTS = [
  { email: 'admin@mishawashx.local', password: '262946' },
  { email: 'dev@mishawashx.local', password: '262946MishwasXDev' },
]

export function AdminLogin() {
  const {
    signIn,
    isAdmin,
    loading,
    authError,
    mode,
    requestPasswordReset,
    updatePassword,
    recoveryMode,
  } = useAuth()
  const { settings } = useContent()
  const navigate = useNavigate()
  const location = useLocation()

  const [view, setView] = useState('login') // login | reset | newPassword
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (loading) return null
  if (isAdmin && !recoveryMode) return <Navigate to={adminPath()} replace />

  const target = location.state?.from || adminPath()

  async function handleLocal(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const result = await signIn('', password)
    setBusy(false)
    if (result?.ok) navigate(target, { replace: true })
    else setError(result?.error || 'Unable to sign in.')
  }

  /** Team members sign in with their own email. Blank email uses the emergency accounts. */
  async function handlePassword(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const typed = email.trim()
    let result

    if (typed) {
      result = await signIn(typed, password)
    } else {
      for (const account of FALLBACK_ACCOUNTS) {
        result = await signIn(account.email, password)
        if (result?.ok) break
      }
      if (!result?.ok) {
        result = {
          ok: false,
          error: 'That password is not valid. Use your team email, or an authorised fallback password.',
        }
      }
    }

    setBusy(false)
    if (result?.ok) navigate(target, { replace: true })
    else setError(result?.error || 'Unable to sign in.')
  }

  async function handleReset(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    const result = await requestPasswordReset(email)
    setBusy(false)
    if (result?.ok) {
      setMessage('If an account exists for that address, a reset link has been sent.')
    } else {
      setError(result?.error || 'Unable to send a reset link.')
    }
  }

  async function handleNewPassword(e) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Use at least 8 characters.')
      return
    }
    setBusy(true)
    setError('')
    const result = await updatePassword(password)
    setBusy(false)
    if (result?.ok) {
      setMessage('Password updated. You can continue to the dashboard.')
      navigate(adminPath(), { replace: true })
    } else {
      setError(result?.error || 'Unable to update password.')
    }
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-navy-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 grid-fine opacity-40" aria-hidden="true" />
        <MolecularCanvas className="pointer-events-none absolute inset-0 h-full w-full opacity-50" maxParticles={46} />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-[30rem] w-[30rem] rounded-full glow-cyan opacity-30 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-3">
          <BrandMark brand={settings?.brand} size={38} />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1rem] font-medium tracking-tight">
              {settings?.brand?.name || 'Mishawash X'}
            </span>
            <span className="mt-1.5 text-[0.52rem] uppercase tracking-[0.26em] text-white/40">
              Protirodh BioKit
            </span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="label text-brand-teal-soft">Content studio</p>
          <h1 className="display-lg mt-5 font-light text-white">
            One place to keep the science accurate.
          </h1>
          <p className="mt-6 text-[0.92rem] leading-relaxed text-white/45">
            Edit every page, manage research milestones and publish documentation — without
            touching code or redeploying the site.
          </p>
        </div>

        <div className="relative flex items-center justify-between border-t border-white/[0.08] pt-6">
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/25">
            Conrad Challenge 2026–2027
          </p>
          <Link to="/" className="inline-flex items-center gap-1.5 text-[0.7rem] text-white/40 hover:text-white">
            <ArrowLeft className="h-3 w-3" />
            Public site
          </Link>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2.5 text-ink">
              <BrandMark brand={settings?.brand} size={34} />
              <span className="font-display text-[0.95rem] font-medium">
                {settings?.brand?.name || 'Mishawash X'}
              </span>
            </Link>
          </div>

          {recoveryMode || view === 'newPassword' ? (
            <>
              <p className="label mt-10 text-brand-cyan">Account recovery</p>
              <h1 className="display-md mt-4 text-ink">Set a new password.</h1>
              <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-muted">
                Choose a password of at least 8 characters. You will stay signed in on this device.
              </p>
              <form onSubmit={handleNewPassword} className="mt-8 space-y-4">
                <div>
                  <label className="admin-label" htmlFor="new-password">
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    className="admin-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                  />
                </div>
                {error ? <Alert tone="error">{error}</Alert> : null}
                {message ? <Alert tone="success">{message}</Alert> : null}
                <button type="submit" className="btn btn-primary w-full" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  Update password
                </button>
              </form>
            </>
          ) : view === 'reset' ? (
            <>
              <button
                type="button"
                onClick={() => setView('login')}
                className="mt-10 inline-flex items-center gap-1.5 text-[0.75rem] text-ink-muted hover:text-ink"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to sign in
              </button>
              <h1 className="display-md mt-6 text-ink">Reset your password.</h1>
              <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-muted">
                Enter the email address associated with your administrator account.
              </p>
              <form onSubmit={handleReset} className="mt-8 space-y-4">
                <div>
                  <label className="admin-label" htmlFor="reset-email">
                    Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    className="admin-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                {error ? <Alert tone="error">{error}</Alert> : null}
                {message ? <Alert tone="success">{message}</Alert> : null}
                <button type="submit" className="btn btn-primary w-full" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Send reset link
                </button>
              </form>
            </>
          ) : mode === 'local' ? (
            <>
              <p className="label mt-10 text-brand-cyan">Local Studio</p>
              <h1 className="display-md mt-4 text-ink">Content editor</h1>
              <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-muted">
                This build is not connected to Supabase, so content is stored in this browser.
                You can edit every page, but changes will not appear for other visitors.
              </p>

              <Alert tone="warning" className="mt-6" title="Protected local access">
                Local Studio is password-protected. Enter the admin password to access the content editor.
                This grants access only to this browser's local content.
              </Alert>

              {error ? (
                <Alert tone="error" className="mt-4">
                  {error}
                </Alert>
              ) : null}

              <form onSubmit={handleLocal} className="mt-8 space-y-4">
                <div>
                  <label className="admin-label" htmlFor="local-password">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted/60" />
                    <input
                      id="local-password"
                      type="password"
                      className="admin-input pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      placeholder="Enter admin password"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Enter Local Studio
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="label mt-10 text-brand-cyan">Content studio</p>
              <h1 className="display-md mt-4 text-ink">Sign in.</h1>
              <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-muted">
                Team members sign in with the email address and password issued to them.
              </p>

              {error || authError ? (
                <Alert tone="error" className="mt-4">
                  {error || authError}
                </Alert>
              ) : null}

              <form onSubmit={handlePassword} className="mt-8 space-y-4">
                <div>
                  <label className="admin-label" htmlFor="email">
                    Team email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted/60" />
                    <input
                      id="email"
                      type="email"
                      className="admin-input pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                      placeholder="you@mishawashx.org"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="admin-label" htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setView('reset')}
                      className="mb-1 text-[0.7rem] text-brand-cyan hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted/60" />
                    <input
                      id="password"
                      type="password"
                      className="admin-input pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Sign in
                </button>
              </form>

              <p className="mt-6 flex items-start gap-2 text-[0.7rem] leading-relaxed text-ink-muted/80">
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
                Access is enforced by Supabase Row Level Security. Attempting to write without an
                authorised session will be rejected by the database.
              </p>
            </>
          )}

          <p className="mt-10 text-[0.68rem] text-ink-muted/60">
            <Link to="/" className="hover:text-ink">
              ← Return to the public site
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
