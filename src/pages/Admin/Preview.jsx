import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Monitor, Pencil, Smartphone, Tablet } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { AdminButton, PageHead, StatusPill } from './components/AdminUI'
import { cn } from '../../lib/utils/cn'
import { adminPath } from '../../lib/utils/adminPath'
import Home from '../Home'
import Problem from '../Problem'
import Innovation from '../Innovation'
import Research from '../Research'
import Team from '../Team'
import Impact from '../Impact'
import Resources from '../Resources'

const PAGES = {
  home: Home,
  problem: Problem,
  innovation: Innovation,
  research: Research,
  team: Team,
  impact: Impact,
  resources: Resources,
}

const DEVICES = [
  { key: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' },
  { key: 'tablet', label: 'Tablet', icon: Tablet, width: '820px' },
  { key: 'mobile', label: 'Mobile', icon: Smartphone, width: '390px' },
]

/**
 * Draft preview. Renders the real page component with previewDrafts enabled,
 * so unpublished copy can be reviewed in place without affecting visitors.
 */
export function AdminPreview() {
  const { slug = 'home' } = useParams()
  const { setPreviewDrafts, pages, getPage } = useContent()
  const [device, setDevice] = useState('desktop')

  useEffect(() => {
    setPreviewDrafts(true)
    return () => setPreviewDrafts(false)
  }, [setPreviewDrafts])

  const Page = PAGES[slug]
  const page = getPage(slug)
  const path = slug === 'home' ? '/' : `/${slug}`

  return (
    <>
      <PageHead
        eyebrow="Preview"
        title={page?.title || 'Page preview'}
        description="Draft content is shown below, including unpublished sections and records. Nothing here changes what visitors see."
        actions={
          <>
            <Link to={`${adminPath('pages')}/${slug}`}>
              <AdminButton icon={Pencil}>Edit this page</AdminButton>
            </Link>
            <a href={`${import.meta.env.BASE_URL}#${path}`} target="_blank" rel="noopener noreferrer">
              <AdminButton variant="primary" icon={ExternalLink}>
                Open live version
              </AdminButton>
            </a>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e2e9f0] bg-white px-3 py-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusPill tone="amber">Draft preview</StatusPill>
          <span className="text-[0.7rem] text-ink-muted">
            Includes unpublished edits. Records marked unpublished are excluded as they would be
            live.
          </span>
        </div>
        <div className="flex items-center gap-1">
          {DEVICES.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setDevice(item.key)}
              aria-pressed={device === item.key}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[0.7rem] transition-colors',
                device === item.key
                  ? 'bg-navy-900 text-white'
                  : 'text-ink-muted hover:bg-[#f4f7fa] hover:text-ink',
              )}
            >
              <item.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e2e9f0] bg-[#e9eef4] p-3 md:p-5">
        <div className="mx-auto overflow-hidden rounded-lg border border-[#d5e0ea] bg-white shadow-[0_20px_50px_-30px_rgba(8,24,43,0.4)] transition-[max-width] duration-500"
          style={{ maxWidth: DEVICES.find((d) => d.key === device)?.width }}
        >
          <div className="flex items-center gap-2 border-b border-[#e2e9f0] bg-[#fafcfe] px-3 py-2">
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-[#e2e9f0]" />
              <span className="h-2 w-2 rounded-full bg-[#e2e9f0]" />
              <span className="h-2 w-2 rounded-full bg-[#e2e9f0]" />
            </span>
            <span className="mx-auto truncate rounded bg-white px-3 py-0.5 text-[0.62rem] text-ink-muted ring-1 ring-[#eef2f6]">
              preview · {path}
            </span>
          </div>

          <div className="max-h-[75vh] overflow-y-auto">
            {Page ? <Page /> : (
              <div className="p-10 text-center text-[0.82rem] text-ink-muted">
                Unknown page. Choose a page from the Pages list.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ArrowLeft className="h-3.5 w-3.5 text-ink-muted" />
        <span className="text-[0.7rem] text-ink-muted">Jump to another page:</span>
        {pages.map((item) => (
          <Link
            key={item.slug}
            to={`${adminPath('preview')}/${item.slug}`}
            className={cn(
              'rounded-full border px-2.5 py-1 text-[0.68rem] transition-colors',
              item.slug === slug
                ? 'border-navy-900 bg-navy-900 text-white'
                : 'border-[#e2e9f0] bg-white text-ink-soft hover:border-[#c8d8e6]',
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </>
  )
}
