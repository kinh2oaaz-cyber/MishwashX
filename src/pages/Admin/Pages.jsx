import { Link } from 'react-router-dom'
import { ArrowUpRight, Eye, Pencil, Plus } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { AdminButton, AdminCard, PageHead, StatusPill } from './components/AdminUI'
import { relativeTime } from '../../lib/utils/format'
import { adminPath } from '../../lib/utils/adminPath'

export function AdminPages() {
  const { pages, sectionsFor, previewDrafts, setPreviewDrafts } = useContent()

  return (
    <>
      <PageHead
        eyebrow="Content"
        title="Pages"
        description="Every public page is composed of editable sections. Changes are saved as drafts until you publish."
        actions={
          <a href={`${import.meta.env.BASE_URL}#/`} target="_blank" rel="noopener noreferrer">
            <AdminButton icon={ArrowUpRight}>View public site</AdminButton>
          </a>
        }
      />

      <AdminCard padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left">
            <thead>
              <tr className="border-b border-[#eef2f6] text-[0.62rem] uppercase tracking-[0.12em] text-ink-muted">
                <th className="px-5 py-2.5 font-semibold">Page</th>
                <th className="px-5 py-2.5 font-semibold">Route</th>
                <th className="px-5 py-2.5 font-semibold">Sections</th>
                <th className="px-5 py-2.5 font-semibold">Status</th>
                <th className="px-5 py-2.5 font-semibold">Updated</th>
                <th className="px-5 py-2.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {pages.map((page) => {
                const pageSections = sectionsFor(page.slug)
                const drafts = pageSections.filter((s) => s.status !== 'published').length
                return (
                  <tr key={page.slug} className="transition-colors hover:bg-[#fafcfe]">
                    <td className="px-5 py-3.5">
                      <Link
                        to={`${adminPath('pages')}/${page.slug}`}
                        className="text-[0.84rem] font-medium text-ink hover:text-brand-cyan"
                      >
                        {page.title}
                      </Link>
                      <p className="text-[0.68rem] text-ink-muted">{page.seoTitle}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <code className="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-[0.7rem] text-ink-soft">
                        /{page.slug === 'home' ? '' : page.slug}
                      </code>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[0.8rem] tabular-nums text-ink-soft">{pageSections.length}</span>
                      {drafts ? (
                        <span className="ml-2 text-[0.66rem] text-amber-700">{drafts} draft</span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill tone={page.status === 'published' ? 'green' : 'amber'}>
                        {page.status}
                      </StatusPill>
                    </td>
                    <td className="px-5 py-3.5 text-[0.72rem] text-ink-muted">
                      {relativeTime(page.updatedAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <Link to={`${adminPath('pages')}/${page.slug}`}>
                          <AdminButton size="sm" icon={Pencil}>
                            Edit
                          </AdminButton>
                        </Link>
                        <Link
                          to={`${adminPath('preview')}/${page.slug}`}
                          onClick={() => setPreviewDrafts(true)}
                        >
                          <AdminButton size="sm" variant="quiet" icon={Eye}>
                            Preview
                          </AdminButton>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <AdminCard title="How publishing works">
          <ol className="space-y-2 text-[0.76rem] leading-relaxed text-ink-muted">
            <li><strong className="text-ink">1.</strong> Edit a section — it saves as a draft automatically.</li>
            <li><strong className="text-ink">2.</strong> Preview with drafts visible.</li>
            <li><strong className="text-ink">3.</strong> Publish the section, or publish all at once.</li>
          </ol>
        </AdminCard>
        <AdminCard title="Section visibility">
          <p className="text-[0.76rem] leading-relaxed text-ink-muted">
            Hiding a section removes it from the public page without deleting its content. This is
            useful for sections that are not ready to be shown, such as hardware imagery awaiting
            real assets.
          </p>
        </AdminCard>
        <AdminCard title="Integrity reminder">
          <p className="text-[0.76rem] leading-relaxed text-ink-muted">
            Status labels — including “validated” — must reflect evidence you can attach. The
            public site states plainly when no milestone has been validated.
          </p>
        </AdminCard>
      </div>
    </>
  )
}
