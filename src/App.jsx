import { useEffect, useState } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { Preloader } from './components/layout/Preloader'
import { PublicLayout } from './components/layout/PublicLayout'
import { ContentProvider, useContent } from './content/ContentProvider'
import { AuthProvider } from './content/AuthProvider'
import { BrandMark } from './components/common/Logo'
import { ADMIN_ROUTE, ADMIN_LOGIN_ROUTE, isAdminPath } from './lib/utils/adminPath'

import Home from './pages/Home'
import Problem from './pages/Problem'
import Innovation from './pages/Innovation'
import Research from './pages/Research'
import Team from './pages/Team'
import Impact from './pages/Impact'
import Resources from './pages/Resources'
import NotFound from './pages/NotFound'

import { AdminLogin } from './pages/Admin/Login'
import { AdminLayout } from './pages/Admin/AdminLayout'
import { AdminOverview } from './pages/Admin/Overview'
import { AdminPages } from './pages/Admin/Pages'
import { AdminPageEditor } from './pages/Admin/PageEditor'
import { AdminSettings } from './pages/Admin/Settings'
import { AdminTeam } from './pages/Admin/TeamManager'
import { AdminResearch } from './pages/Admin/ResearchManager'
import { AdminReferences } from './pages/Admin/ReferencesManager'
import { AdminMedia } from './pages/Admin/MediaManager'
import { AdminDocuments } from './pages/Admin/DocumentsManager'
import { AdminInquiries } from './pages/Admin/Inquiries'
import { AdminPreview } from './pages/Admin/Preview'

function LoadingScreen({ message = 'Loading content' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-mist">
      <BrandMark size={44} />
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ink-muted">{message}</p>
    </div>
  )
}

function LoadFailure({ message, onRetry }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-6">
      <div className="max-w-md text-center">
        <h1 className="display-md text-ink">Content could not be loaded.</h1>
        <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-muted">{message}</p>
        <button type="button" className="btn btn-primary mt-6" onClick={onRetry}>
          Try again
        </button>
      </div>
    </div>
  )
}

function Shell() {
  const location = useLocation()
  const { status, error, reload } = useContent()
  const isAdmin = isAdminPath(location.pathname)
  const [introDone, setIntroDone] = useState(isAdmin)

  // HashRouter keeps in-page anchors after a second '#' (e.g. #/resources#contact).
  useEffect(() => {
    if (!location.hash) return
    const id = decodeURIComponent(location.hash.slice(1))
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash, status])

  const settled = status === 'ready' || status === 'error'

  if (status === 'error') {
    return <LoadFailure message={error || 'An unknown error occurred.'} onRetry={reload} />
  }

  if (!settled) {
    return isAdmin || introDone ? <LoadingScreen /> : (
      <Preloader onComplete={() => setIntroDone(true)} />
    )
  }

  return (
    <>
      {!isAdmin && !introDone ? <Preloader onComplete={() => setIntroDone(true)} /> : null}

      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="problem" element={<Problem />} />
          <Route path="innovation" element={<Innovation />} />
          <Route path="research" element={<Research />} />
          <Route path="team" element={<Team />} />
          <Route path="impact" element={<Impact />} />
          <Route path="resources" element={<Resources />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path={ADMIN_LOGIN_ROUTE} element={<AdminLogin />} />
        <Route path={ADMIN_ROUTE} element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="pages/:slug" element={<AdminPageEditor />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="research" element={<AdminResearch />} />
          <Route path="references" element={<AdminReferences />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="preview/:slug" element={<AdminPreview />} />
        </Route>
      </Routes>
    </>
  )
}

export function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <ContentProvider>
          <AuthProvider>
            <Shell />
          </AuthProvider>
        </ContentProvider>
      </ErrorBoundary>
    </HashRouter>
  )
}
