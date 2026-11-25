import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  BookOpen,
  ChevronRight,
  FileText,
  FlaskConical,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react'
import { useAuth } from '../../content/AuthProvider'
import { useContent } from '../../content/ContentProvider'
import { BrandMark } from '../../components/common/Logo'
import { adminPath, ADMIN_LOGIN_PATH } from '../../lib/utils/adminPath'
import { ModeBadge, SavingIndicator } from './components/AdminUI'
import { cn } from '../../lib/utils/cn'
import { useScrollLock, useEscapeKey } from '../../hooks/useOverlay'

const NAV = [
  {
    group: 'Workspace',
    items: [
      { to: adminPath(), label: 'Overview', icon: LayoutDashboard, end: true },
      { to: adminPath('pages'), label: 'Pages', icon: Layers },
      { to: adminPath('settings'), label: 'Site settings', icon: Settings },
    ],
  },
  {
    group: 'Content',
    items: [
      { to: adminPath('team'), label: 'Team', icon: Users },
      { to: adminPath('research'), label: 'Research', icon: FlaskConical },
      { to: adminPath('references'), label: 'References', icon: BookOpen },
    ],
  },
  {
    group: 'Library',
    items: [
      { to: adminPath('media'), label: 'Media', icon: ImageIcon },
      { to: adminPath('documents'), label: 'Documents', icon: FileText },
      { to: adminPath('inquiries'), label: 'Inquiries', icon: Inbox },
    ],
  },
]

const TITLES = {
  [adminPath()]: 'Overview',
  [adminPath('pages')]: 'Pages',
  [adminPath('settings')]: 'Site settings',
  [adminPath('team')]: 'Team',
  [adminPath('research')]: 'Research',
  [adminPath('references')]: 'References',
  [adminPath('media')]: 'Media library',
  [adminPath('documents')]: 'Documents',
  [adminPath('inquiries')]: 'Enquiries',
}

export function AdminLayout() {
  const { isAdmin, loading, profile, user, signOut, mode } = useAuth()
  const { saving, settings } = useContent()
  const location = useLocation()
  const [drawer, setDrawer] = useState(false)

  useScrollLock(drawer)
  useEscapeKey(() => setDrawer(false), drawer)

  useEffect(() => {
    setDrawer(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  const title =
    TITLES[location.pathname] ||
    (location.pathname.startsWith(`${adminPath('pages')}/`) ? 'Edit page' : 'Content studio')

  useEffect(() => {
    document.title = `${title} · Admin · ${settings?.brand?.name || 'Mishawash X'}`
  }, [title, settings?.brand?.name])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist">
        <div className="flex flex-col items-center gap-4">
          <BrandMark brand={settings?.brand} size={44} />
          <p className="text-[0.75rem] uppercase tracking-[0.2em] text-ink-muted">Loading workspace</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return <Navigate to={ADMIN_LOGIN_PATH} replace state={{ from: location.pathname }} />

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-950 text-white">
      <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5">
        <Link to={adminPath()} className="flex items-center gap-2.5">
          <BrandMark brand={settings?.brand} size={30} />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[0.9rem] font-medium tracking-tight">
              {settings?.brand?.name || 'Mishawash X'}
            </span>
            <span className="mt-1 text-[0.5rem] uppercase tracking-[0.24em] text-white/35">
              Content studio
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setDrawer(false)}
          className="text-white/50 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin">
        {NAV.map((group) => (
          <div key={group.group} className="mb-5">
            <p className="px-2.5 pb-2 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white/25">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.8rem] transition-colors',
                        isActive
                          ? 'bg-white/[0.08] text-white'
                          : 'text-white/55 hover:bg-white/[0.04] hover:text-white/90',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn('h-3.5 w-3.5 transition-colors', isActive ? 'text-brand-teal' : 'text-white/40')}
                          strokeWidth={1.7}
                        />
                        <span className="flex-1">{item.label}</span>
                        {isActive ? <span className="h-1 w-1 rounded-full bg-brand-teal" /> : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.07] p-3">
        <div className="rounded-lg bg-white/[0.04] p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-teal/15 text-[0.62rem] font-semibold text-brand-teal-soft">
              {(profile?.fullName || user?.email || 'MX').slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.72rem] font-medium text-white/85">
                {profile?.fullName || user?.email?.split('@')[0] || 'Administrator'}
              </p>
              <p className="truncate text-[0.6rem] text-white/35">{user?.email || 'local session'}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <ModeBadge mode={mode} />
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1 text-[0.65rem] text-white/40 transition-colors hover:text-white"
            >
              <LogOut className="h-3 w-3" strokeWidth={1.8} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f8fa]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {drawer ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 w-[17rem] shadow-2xl">{sidebar}</aside>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#e2e9f0] bg-white/90 px-4 backdrop-blur-md md:px-6">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e9f0] text-ink-soft lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" strokeWidth={1.8} />
          </button>

          <div className="flex min-w-0 items-center gap-1.5 text-[0.78rem]">
            <Link to={adminPath()} className="text-ink-muted transition-colors hover:text-ink">
              Admin
            </Link>
            <ChevronRight className="h-3 w-3 text-ink-muted/40" />
            <span className="truncate font-medium text-ink">{title}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <SavingIndicator saving={saving} />
            <a
              href={`${import.meta.env.BASE_URL}#/`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg border border-[#e2e9f0] px-2.5 py-1.5 text-[0.72rem] text-ink-soft transition-colors hover:bg-[#f7fafc] sm:inline-flex"
            >
              View site
              <ExternalLink className="h-3 w-3" strokeWidth={1.8} />
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-[92rem] px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
