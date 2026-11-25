import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Inbox,
  Layers,
  Plus,
  Settings,
  Users,
} from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { AdminButton, Alert, AdminCard, PageHead, StatCard, StatusPill } from './components/AdminUI'
import { relativeTime } from '../../lib/utils/format'
import { SECTION_LABELS } from '../../content/schema'
import { adminPath } from '../../lib/utils/adminPath'

export function AdminOverview() {
  const {
    pages,
    sections,
    team,
    milestones,
    documents,
    researchDocuments,
    media,
    settings,
    needsSeed,
    seedDatabase,
    mode,
    inquiries,
  } = useContent()

  const publishedTeam = team.filter((m) => m.published)
  const publishedMilestones = milestones.filter((m) => m.published)
  const pending = useMemo(
    () =>
      sections.filter(
        (s) => s.status !== 'published' || JSON.stringify(s.draft) !== JSON.stringify(s.published),
      ),
    [sections],
  )
  const draftsOnly = sections.filter((s) => s.status !== 'published')
  const validated = milestones.filter((m) => m.status === 'validated')

  const recent = useMemo(
    () =>
      [...sections]
        .filter((s) => s.updatedAt)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 6),
    [sections],
  )

  const checks = [
    {
      ok: Boolean(settings?.contact?.email),
      label: 'Contact email configured',
      detail: settings?.contact?.email
        ? settings.contact.email
        : 'Add an address in Site settings → Contact.',
      to: adminPath('settings'),
    },
    {
      ok: publishedTeam.length > 0,
      label: 'Team profiles published',
      detail:
        publishedTeam.length > 0
          ? `${publishedTeam.length} profile${publishedTeam.length === 1 ? '' : 's'} live`
          : 'Add real members — do not invent names.',
      to: adminPath('team'),
    },
    {
      ok: documents.length + researchDocuments.length > 0,
      label: 'Documents released',
      detail:
        documents.length + researchDocuments.length > 0
          ? `${documents.length + researchDocuments.length} file(s) published`
          : 'Upload approved PDFs when available.',
      to: adminPath('documents'),
    },
    {
      ok: media.length > 0,
      label: 'Media library in use',
      detail: media.length > 0 ? `${media.length} asset(s)` : 'Upload project imagery or documents.',
      to: adminPath('media'),
    },
    {
      ok: true,
      label: 'Scientific integrity check',
      detail:
        validated.length === 0
          ? 'No milestone is marked validated — correct unless evidence is attached.'
          : `${validated.length} milestone(s) marked validated. Confirm evidence is attached.`,
      to: adminPath('research'),
    },
  ]

  return (
    <>
      <PageHead
        eyebrow="Mishawash X"
        title="Content overview"
        description="Everything published on the public site is managed from here. Changes to sections and records appear immediately after publishing."
        actions={
          <>
            <Link to={adminPath('pages/home')}>
              <AdminButton icon={Layers}>Edit homepage</AdminButton>
            </Link>
            <a href={`${import.meta.env.BASE_URL}#/`} target="_blank" rel="noopener noreferrer">
              <AdminButton variant="primary" icon={ArrowUpRight}>
                View site
              </AdminButton>
            </a>
          </>
        }
      />

      {needsSeed ? (
        <Alert
          tone="warning"
          title="Database is empty"
          className="mb-5"
          action={
            <AdminButton
              variant="primary"
              size="sm"
              onClick={async () => {
                await seedDatabase()
              }}
            >
              Import starter content
            </AdminButton>
          }
        >
          Your Supabase project is connected but contains no pages. Import the reviewed starter
          content to begin editing, then publish your own copy.
        </Alert>
      ) : null}

      {mode === 'local' ? (
        <Alert tone="info" className="mb-5" title="Running in Local Studio mode">
          Content is stored in this browser only. Nothing you change here affects other visitors.
          Connect Supabase (see SUPABASE_SETUP.md) to enable shared content, real authentication and
          media storage.
        </Alert>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Team members" value={publishedTeam.length} icon={Users} hint={`${team.length} total`} accent="cyan" />
        <StatCard
          label="Milestones"
          value={publishedMilestones.length}
          icon={FlaskConical}
          hint={`${milestones.filter((m) => m.status === 'in-progress').length} in progress`}
          accent="teal"
        />
        <StatCard
          label="Documents"
          value={documents.length + researchDocuments.length}
          icon={FileText}
          hint="public + research"
          accent="navy"
        />
        <StatCard label="Media assets" value={media.length} icon={ImageIcon} hint="images & files" accent="cyan" />
        <StatCard
          label="Unpublished changes"
          value={pending.length}
          icon={AlertTriangle}
          hint={`${draftsOnly.length} section(s) in draft`}
          accent="amber"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <AdminCard
          title="Recent content changes"
          description="Sections ordered by most recent edit."
          padded={false}
          actions={
            <Link to={adminPath('pages')}>
              <AdminButton size="sm">All pages</AdminButton>
            </Link>
          }
        >
          <ul className="divide-y divide-[#eef2f6]">
            {recent.map((section) => {
              const page = pages.find((p) => p.slug === section.pageSlug)
              const label = SECTION_LABELS[`${section.pageSlug}:${section.key}`] || section.key
              const isPublished = section.status === 'published'
              return (
                <li key={section.id}>
                  <Link
                    to={`${adminPath('pages')}/${section.pageSlug}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[#fafcfe]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#f1f5f9] text-[0.6rem] font-medium uppercase text-ink-muted">
                      {page?.navLabel?.slice(0, 2) || '—'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.8rem] font-medium text-ink">{label}</span>
                      <span className="block text-[0.68rem] text-ink-muted">
                        {page?.title || section.pageSlug} · {relativeTime(section.updatedAt)}
                      </span>
                    </span>
                    <StatusPill tone={isPublished ? 'green' : 'amber'}>
                      {isPublished ? 'Live' : 'Draft'}
                    </StatusPill>
                  </Link>
                </li>
              )
            })}
          </ul>
        </AdminCard>

        <div className="space-y-5">
          <AdminCard title="Content health" description="Outstanding setup items.">
            <ul className="space-y-3">
              {checks.map((check) => (
                <li key={check.label}>
                  <Link to={check.to} className="group flex items-start gap-2.5">
                    {check.ok ? (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal" strokeWidth={2} />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" strokeWidth={2} />
                    )}
                    <span className="min-w-0">
                      <span className="block text-[0.78rem] font-medium text-ink group-hover:text-brand-cyan">
                        {check.label}
                      </span>
                      <span className="block text-[0.7rem] leading-relaxed text-ink-muted">{check.detail}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </AdminCard>

          <AdminCard title="Quick actions">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Add team member', to: adminPath('team'), icon: Users },
                { label: 'Add milestone', to: adminPath('research'), icon: Plus },
                { label: 'Upload media', to: adminPath('media'), icon: ImageIcon },
                { label: 'Site settings', to: adminPath('settings'), icon: Settings },
                { label: 'References', to: adminPath('references'), icon: BookOpen },
                { label: 'Enquiries', to: adminPath('inquiries'), icon: Inbox },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex items-center gap-2 rounded-lg border border-[#eef2f6] px-3 py-2.5 text-[0.74rem] text-ink-soft transition-colors hover:border-[#d5e0ea] hover:bg-[#fafcfe] hover:text-ink"
                >
                  <action.icon className="h-3.5 w-3.5 text-brand-cyan" strokeWidth={1.7} />
                  {action.label}
                </Link>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <AdminCard title="Publishing">
          <div className="space-y-2.5">
            {pages.map((page) => (
              <div key={page.slug} className="flex items-center justify-between gap-3">
                <Link
                  to={`${adminPath('pages')}/${page.slug}`}
                  className="text-[0.78rem] text-ink-soft hover:text-brand-cyan"
                >
                  {page.title}
                </Link>
                <StatusPill tone={page.status === 'published' ? 'green' : 'amber'}>
                  {page.status}
                </StatusPill>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Research status" description="Evidence-linked labels only.">
          <div className="space-y-2">
            {['planned', 'in-progress', 'completed', 'validated'].map((status) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-[0.78rem] capitalize text-ink-soft">{status.replace('-', ' ')}</span>
                <span className="font-display text-[1rem] tabular-nums text-ink">
                  {milestones.filter((m) => m.status === status).length}
                </span>
              </div>
            ))}
          </div>
          <Link to={adminPath('research')} className="mt-4 inline-block text-[0.72rem] text-brand-cyan hover:underline">
            Manage research →
          </Link>
        </AdminCard>

        <AdminCard title="Enquiries" description="Messages from the contact form.">
          <p className="font-display text-[1.8rem] font-light leading-none text-ink tabular-nums">
            {inquiries.length}
          </p>
          <p className="mt-1 text-[0.72rem] text-ink-muted">
            {inquiries.length ? 'Stored securely and ready to review.' : 'No enquiries received yet.'}
          </p>
          <Link to={adminPath('inquiries')} className="mt-4 inline-block text-[0.72rem] text-brand-cyan hover:underline">
            Open inbox →
          </Link>
        </AdminCard>
      </div>
    </>
  )
}
