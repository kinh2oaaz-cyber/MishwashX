import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Layers,
  Save,
  Send,
} from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { PAGE_META_FIELDS, getSectionSchema } from '../../content/schema'
import { FieldEditor } from './components/FieldEditor'
import {
  AdminButton,
  AdminCard,
  Alert,
  Modal,
  PageHead,
  StatusPill,
} from './components/AdminUI'
import { cn } from '../../lib/utils/cn'
import { relativeTime } from '../../lib/utils/format'
import { adminPath } from '../../lib/utils/adminPath'

function clone(value) {
  return JSON.parse(JSON.stringify(value ?? {}))
}

export function AdminPageEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const {
    getPage,
    sectionsFor,
    getSection,
    updatePage,
    updateSection,
    publishSection,
    publishPage,
    unpublishSection,
    reorderSections,
    setPreviewDrafts,
    saving,
  } = useContent()

  const page = getPage(slug)
  const sections = useMemo(() => sectionsFor(slug), [sectionsFor, slug])

  const [active, setActive] = useState('page')
  const [meta, setMeta] = useState(() => clone(page))
  const [sectionDraft, setSectionDraft] = useState(null)
  const [savedFlash, setSavedFlash] = useState('')
  const [error, setError] = useState('')
  const [confirmPublishAll, setConfirmPublishAll] = useState(false)

  const activeSection = active === 'page' ? null : getSection(slug, active)
  const schema = activeSection ? getSectionSchema(slug, activeSection.key) : null
  const readSection = useRef(getSection)
  readSection.current = getSection

  /* Reset editors when the target changes. */
  useEffect(() => {
    setMeta(clone(page))
  }, [slug, page?.updatedAt]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (active === 'page') {
      setSectionDraft(null)
      return
    }
    const section = readSection.current(slug, active)
    setSectionDraft(clone(section?.draft))
    setError('')
    // Re-initialising only when the active section changes keeps unsaved edits
    // intact while visibility toggles update the shared content state.
  }, [active, slug])

  useEffect(() => {
    if (!savedFlash) return
    const id = setTimeout(() => setSavedFlash(''), 2200)
    return () => clearTimeout(id)
  }, [savedFlash])

  if (!page) {
    return (
      <>
        <PageHead title="Page not found" description="This page no longer exists in the content model." />
        <AdminButton onClick={() => navigate(adminPath('pages'))}>Back to pages</AdminButton>
      </>
    )
  }

  const metaDirty = JSON.stringify(meta) !== JSON.stringify(page)
  const sectionDirty =
    activeSection && JSON.stringify(sectionDraft) !== JSON.stringify(activeSection.draft)

  async function saveMeta() {
    setError('')
    try {
      await updatePage(slug, meta)
      setSavedFlash('Page details saved.')
    } catch (err) {
      setError(err.message || 'Unable to save page details.')
    }
  }

  async function saveSection() {
    if (!activeSection) return
    setError('')
    try {
      await updateSection(slug, activeSection.key, { draft: sectionDraft })
      setSavedFlash('Draft saved.')
      return true
    } catch (err) {
      setError(err.message || 'Unable to save this section.')
      return false
    }
  }

  async function publish() {
    if (!activeSection) return
    setError('')
    try {
      if (sectionDirty) await updateSection(slug, activeSection.key, { draft: sectionDraft })
      await publishSection(slug, activeSection.key)
      setSavedFlash('Section published.')
    } catch (err) {
      setError(err.message || 'Unable to publish this section.')
    }
  }

  async function toggleVisible() {
    if (!activeSection) return
    try {
      await updateSection(slug, activeSection.key, { visible: !activeSection.visible })
    } catch (err) {
      setError(err.message || 'Unable to change visibility.')
    }
  }

  async function moveSection(index, direction) {
    const target = index + direction
    if (target < 0 || target >= sections.length) return
    const ids = sections.map((s) => s.key)
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    await reorderSections(slug, ids)
  }

  const path = page.slug === 'home' ? '/' : `/${page.slug}`

  return (
    <>
      <PageHead
        eyebrow={`Pages · ${page.title}`}
        title={page.title}
        description="Edit each section, preview with drafts visible, then publish when the copy is verified."
        actions={
          <>
            <Link to={adminPath('pages')}>
              <AdminButton icon={Layers}>All pages</AdminButton>
            </Link>
            <Link to={`${adminPath('preview')}/${slug}`} onClick={() => setPreviewDrafts(true)}>
              <AdminButton icon={Eye}>Preview</AdminButton>
            </Link>
            <AdminButton variant="primary" icon={Send} onClick={() => setConfirmPublishAll(true)}>
              Publish page
            </AdminButton>
          </>
        }
      />

      {savedFlash ? (
        <Alert tone="success" className="mb-4">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5" /> {savedFlash}
          </span>
        </Alert>
      ) : null}

      {error ? (
        <Alert tone="error" className="mb-4">
          {error}
        </Alert>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[15rem_1fr] lg:items-start">
        {/* Section navigator */}
        <div className="space-y-3 lg:sticky lg:top-24">
          <AdminCard padded={false}>
            <div className="border-b border-[#eef2f6] px-3.5 py-2.5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Page structure
              </p>
            </div>
            <nav className="max-h-[60vh] overflow-y-auto p-2">
              <button
                type="button"
                onClick={() => setActive('page')}
                className={cn(
                  'mb-1 flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors',
                  active === 'page' ? 'bg-navy-900 text-white' : 'text-ink-soft hover:bg-[#f4f7fa]',
                )}
              >
                <FileText
                  className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', active === 'page' ? 'text-brand-teal' : 'text-ink-muted/60')}
                  strokeWidth={1.8}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.76rem] font-medium">Page details</span>
                  <span
                    className={cn(
                      'block text-[0.64rem]',
                      active === 'page' ? 'text-white/45' : 'text-ink-muted/70',
                    )}
                  >
                    Title, navigation & SEO
                  </span>
                </span>
              </button>

              <p className="px-2.5 pb-1 pt-2 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-ink-muted/70">
                Sections
              </p>

              {sections.map((section, index) => {
                const isActive = active === section.key
                const isLive = section.status === 'published'
                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => setActive(section.key)}
                    className={cn(
                      'group mb-0.5 flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors',
                      isActive ? 'bg-navy-900 text-white' : 'text-ink-soft hover:bg-[#f4f7fa]',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[0.55rem] font-medium tabular-nums',
                        isActive ? 'bg-white/10 text-white/70' : 'bg-[#f1f5f9] text-ink-muted',
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.76rem] font-medium">
                        {getSectionSchema(slug, section.key).label}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5">
                        <span
                          className={cn(
                            'h-1 w-1 rounded-full',
                            isLive ? 'bg-brand-teal' : 'bg-amber-400',
                          )}
                        />
                        <span
                          className={cn(
                            'text-[0.6rem]',
                            isActive ? 'text-white/45' : 'text-ink-muted/70',
                          )}
                        >
                          {isLive ? 'Live' : 'Draft'}
                          {!section.visible ? ' · hidden' : ''}
                        </span>
                      </span>
                    </span>
                  </button>
                )
              })}
            </nav>
          </AdminCard>

          <div className="rounded-lg border border-[#e2e9f0] bg-white px-3.5 py-3">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-ink-muted">
              Public route
            </p>
            <code className="mt-1 block text-[0.72rem] text-ink-soft">{path}</code>
            <a
              href={`${import.meta.env.BASE_URL}#${path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[0.68rem] text-brand-cyan hover:underline"
            >
              Open live page
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>

        {/* Editor */}
        <div>
          {active === 'page' ? (
            <AdminCard
              title="Page details"
              description="Metadata used for navigation and search engines."
              actions={
                <AdminButton
                  variant="primary"
                  size="sm"
                  icon={Save}
                  onClick={saveMeta}
                  disabled={!metaDirty}
                  loading={saving}
                >
                  Save
                </AdminButton>
              }
            >
              <div className="grid gap-1 sm:grid-cols-2 sm:[&>*]:col-span-1">
                {PAGE_META_FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className={cn(field.type === 'textarea' ? 'sm:col-span-2' : '')}
                  >
                    <FieldEditor
                      field={field}
                      value={meta?.[field.key]}
                      onChange={(next) => setMeta((prev) => ({ ...prev, [field.key]: next }))}
                    />
                  </div>
                ))}
              </div>

              {metaDirty ? (
                <p className="mt-4 text-[0.7rem] text-amber-700">Unsaved changes to page details.</p>
              ) : null}

              <div className="mt-5 border-t border-[#eef2f6] pt-4">
                <p className="text-[0.72rem] leading-relaxed text-ink-muted">
                  Setting the page status to draft removes it from navigation and search. Individual
                  sections can still be published or hidden independently.
                </p>
              </div>
            </AdminCard>
          ) : activeSection ? (
            <AdminCard
              padded={false}
              title={
                <span className="flex flex-wrap items-center gap-2">
                  {schema.label}
                  <StatusPill tone={activeSection.status === 'published' ? 'green' : 'amber'}>
                    {activeSection.status === 'published' ? 'Published' : 'Draft'}
                  </StatusPill>
                  {!activeSection.visible ? <StatusPill tone="neutral">Hidden</StatusPill> : null}
                </span>
              }
              description={`Last updated ${relativeTime(activeSection.updatedAt)} · section key “${activeSection.key}”`}
              actions={
                <>
                  <AdminButton
                    size="sm"
                    icon={activeSection.visible ? EyeOff : Eye}
                    onClick={toggleVisible}
                  >
                    {activeSection.visible ? 'Hide' : 'Show'}
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="quiet"
                    icon={ArrowUp}
                    aria-label="Move section up"
                    onClick={() => moveSection(sections.indexOf(activeSection), -1)}
                    disabled={sections.indexOf(activeSection) === 0}
                  />
                  <AdminButton
                    size="sm"
                    variant="quiet"
                    icon={ArrowDown}
                    aria-label="Move section down"
                    onClick={() => moveSection(sections.indexOf(activeSection), 1)}
                    disabled={sections.indexOf(activeSection) === sections.length - 1}
                  />
                  <AdminButton
                    size="sm"
                    icon={Save}
                    onClick={saveSection}
                    disabled={!sectionDirty}
                    loading={saving}
                  >
                    Save draft
                  </AdminButton>
                  <AdminButton size="sm" variant="primary" icon={Send} onClick={publish}>
                    Publish
                  </AdminButton>
                </>
              }
            >
              <div className="border-b border-[#eef2f6] bg-[#fafcfe] px-5 py-2.5">
                <p className="text-[0.7rem] leading-relaxed text-ink-muted">
                  {activeSection.status === 'published'
                    ? 'Editing saves a draft. The live page keeps the published version until you press Publish.'
                    : 'This section is not live. Saving keeps it in draft; publishing makes it visible.'}
                  {sectionDirty ? (
                    <span className="ml-1 font-medium text-amber-700">You have unsaved changes.</span>
                  ) : null}
                </p>
              </div>

              <div className="px-5 py-4">
                {schema.fields.length ? (
                  <div className="grid gap-1 sm:grid-cols-2 sm:[&>*]:col-span-1">
                    {schema.fields.map((field) => (
                      <div
                        key={field.key}
                        className={cn(
                          field.type === 'richtext' ||
                            field.type === 'list' ||
                            field.type === 'textarea' ||
                            field.type === 'image' ||
                            field.type === 'boolean' ||
                            field.type === 'group'
                            ? 'sm:col-span-2'
                            : '',
                        )}
                      >
                        <FieldEditor
                          field={field}
                          value={sectionDraft?.[field.key]}
                          onChange={(next) =>
                            setSectionDraft((prev) => ({ ...prev, [field.key]: next }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert tone="warning">
                    No field schema is registered for this section. It may be a structural section
                    rendered directly by the page component.
                  </Alert>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eef2f6] bg-[#fafcfe] px-5 py-3">
                <div className="flex items-center gap-2 text-[0.68rem] text-ink-muted">
                  {activeSection.published ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-brand-teal" />
                      A published version exists
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-amber-400" />
                      Never published
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {activeSection.status === 'published' ? (
                    <AdminButton
                      size="sm"
                      variant="quiet"
                      onClick={() => unpublishSection(slug, activeSection.key)}
                    >
                      Unpublish
                    </AdminButton>
                  ) : null}
                  <Link to={`${adminPath('preview')}/${slug}`} onClick={() => setPreviewDrafts(true)}>
                    <AdminButton size="sm" icon={Eye}>
                      Preview drafts
                    </AdminButton>
                  </Link>
                </div>
              </div>
            </AdminCard>
          ) : (
            <AdminCard>
              <Alert tone="warning">This section could not be found. Reload the page.</Alert>
            </AdminCard>
          )}
        </div>
      </div>

      <Modal
        open={confirmPublishAll}
        onClose={() => setConfirmPublishAll(false)}
        title="Publish the whole page?"
        description="Every section on this page becomes public at its current draft content."
        footer={
          <>
            <AdminButton onClick={() => setConfirmPublishAll(false)}>Cancel</AdminButton>
            <AdminButton
              variant="primary"
              icon={Send}
              onClick={async () => {
                try {
                  await publishPage(slug)
                  setConfirmPublishAll(false)
                  setSavedFlash('All sections published.')
                } catch (err) {
                  setError(err.message || 'Unable to publish the page.')
                  setConfirmPublishAll(false)
                }
              }}
            >
              Publish all sections
            </AdminButton>
          </>
        }
      >
        <p className="text-[0.82rem] leading-relaxed text-ink-soft">
          This copies the draft of every section on <strong className="text-ink">{page.title}</strong>{' '}
          to the published version. Before doing so, confirm that no claim, statistic or status label
          overstates what the team has actually demonstrated.
        </p>
        <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-muted">
          Sections marked hidden stay hidden. Individual sections can still be unpublished
          afterwards.
        </p>
      </Modal>
    </>
  )
}
