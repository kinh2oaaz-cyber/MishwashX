import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import { useContent } from '../../../content/ContentProvider'
import { COLLECTIONS } from '../../../content/schema'
import { FieldEditor } from '../components/FieldEditor'
import {
  AdminButton,
  AdminCard,
  Alert,
  Modal,
  PageHead,
  StatusPill,
} from '../components/AdminUI'
import { cn } from '../../../lib/utils/cn'
import { relativeTime } from '../../../lib/utils/format'

const PRIMARY_KEY = { team: 'name', references: 'authors', milestones: 'title' }

function primaryText(record, collection) {
  return record[PRIMARY_KEY[collection] || 'title'] || 'Untitled'
}

function secondaryText(record, collection) {
  if (collection === 'team') return record.role
  if (collection === 'milestones') return [record.phase, record.period].filter(Boolean).join(' · ')
  if (collection === 'references') return [record.source, record.year].filter(Boolean).join(' · ')
  return [record.category, record.fileType].filter(Boolean).join(' · ')
}

function clone(item) {
  return JSON.parse(JSON.stringify(item))
}

/**
 * Generic collection manager.
 * Renders a schema-driven list + editor for team, research, references and
 * document collections so behaviour stays consistent across the dashboard.
 */
export function CollectionManager({
  collection,
  eyebrow,
  title,
  description,
  notice,
  emptyTitle,
  emptyBody,
  addLabel,
  extraActions,
}) {
  const { [collection]: records, upsertRecord, deleteRecord, reorderRecords, saving } = useContent()
  const config = COLLECTIONS[collection]

  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [error, setError] = useState('')

  const sorted = useMemo(() => {
    const list = [...(records || [])].sort(
      (a, b) =>
        (a.sortOrder ?? 99) - (b.sortOrder ?? 99) ||
        primaryText(a, collection).localeCompare(primaryText(b, collection)),
    )
    if (!query.trim()) return list
    const q = query.trim().toLowerCase()
    return list.filter((r) =>
      [primaryText(r, collection), secondaryText(r, collection), r.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [records, collection, query])

  const publishedCount = (records || []).filter((r) => r.published).length

  function openNew() {
    setError('')
    setDraft(clone(config.defaultItem))
    setIsNew(true)
    setEditing('new')
  }

  function openExisting(record) {
    setError('')
    setDraft(clone(record))
    setIsNew(false)
    setEditing(record.id)
  }

  function close() {
    setEditing(null)
    setDraft(null)
    setError('')
  }

  async function save() {
    if (collection === 'team' && !draft.name?.trim()) {
      setError('A name is required.')
      return
    }
    if (collection !== 'team' && !draft.title?.trim() && !draft.authors?.trim()) {
      setError('A title is required.')
      return
    }
    try {
      await upsertRecord(collection, draft)
      close()
    } catch (err) {
      setError(err.message || 'Unable to save this record.')
    }
  }

  async function togglePublished(record) {
    try {
      await upsertRecord(collection, { ...record, published: !record.published })
    } catch (err) {
      setError(err.message || 'Unable to change publication state.')
    }
  }

  async function move(index, direction) {
    const target = index + direction
    if (target < 0 || target >= sorted.length) return
    const ids = sorted.map((r) => r.id)
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    await reorderRecords(collection, ids)
  }

  async function remove() {
    if (!confirmDelete) return
    try {
      await deleteRecord(collection, confirmDelete.id)
      setConfirmDelete(null)
      if (editing === confirmDelete.id) close()
    } catch (err) {
      setError(err.message || 'Unable to delete this record.')
    }
  }

  return (
    <>
      <PageHead
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <>
            {extraActions}
            <AdminButton variant="primary" icon={Plus} onClick={openNew}>
              {addLabel || `Add ${config.singular}`}
            </AdminButton>
          </>
        }
      />

      {notice ? (
        <Alert tone="info" className="mb-5">
          {notice}
        </Alert>
      ) : null}

      {error && !draft ? (
        <Alert tone="error" className="mb-5">
          {error}
        </Alert>
      ) : null}

      <AdminCard padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef2f6] px-4 py-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted/60" />
            <input
              className="admin-input pl-8 text-[0.78rem]"
              placeholder={`Search ${config.label.toLowerCase()}…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-[0.68rem] text-ink-muted">
            <StatusPill tone="green">{publishedCount} published</StatusPill>
            <span>{records.length} total</span>
          </div>
        </div>

        {sorted.length ? (
          <ul className="divide-y divide-[#f1f5f9]">
            {sorted.map((record, index) => (
              <li
                key={record.id}
                className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-[#fafcfe]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#f1f5f9] text-[0.62rem] font-medium tabular-nums text-ink-muted">
                  {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => openExisting(record)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-[0.82rem] font-medium text-ink">
                      {primaryText(record, collection)}
                    </span>
                    {collection === 'milestones' ? (
                      <StatusPill
                        tone={
                          record.status === 'validated'
                            ? 'green'
                            : record.status === 'completed'
                              ? 'cyan'
                              : record.status === 'in-progress'
                                ? 'amber'
                                : 'neutral'
                        }
                      >
                        {String(record.status || 'planned').replace('-', ' ')}
                      </StatusPill>
                    ) : null}
                    {!record.published ? <StatusPill tone="amber">Draft</StatusPill> : null}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.68rem] text-ink-muted">
                    {secondaryText(record, collection) || 'No description'}
                    {record.updatedAt ? ` · ${relativeTime(record.updatedAt)}` : ''}
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  {collection === 'milestones' && record.evidenceUrl ? (
                    <a
                      href={record.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-white hover:text-brand-cyan"
                      title="Open evidence"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="flex h-7 w-7 items-center justify-center rounded text-ink-muted transition-colors hover:bg-white hover:text-ink disabled:opacity-25"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === sorted.length - 1}
                    className="flex h-7 w-7 items-center justify-center rounded text-ink-muted transition-colors hover:bg-white hover:text-ink disabled:opacity-25"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublished(record)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[0.66rem] font-medium transition-colors',
                      record.published
                        ? 'text-[#0c7c6f] hover:bg-brand-teal/10'
                        : 'text-amber-700 hover:bg-amber-50',
                    )}
                    title={record.published ? 'Unpublish' : 'Publish'}
                  >
                    {record.published ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                    {record.published ? 'Live' : 'Draft'}
                  </button>
                  <button
                    type="button"
                    onClick={() => openExisting(record)}
                    className="flex h-7 w-7 items-center justify-center rounded text-ink-muted transition-colors hover:bg-white hover:text-ink"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(record)}
                    className="flex h-7 w-7 items-center justify-center rounded text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-14 text-center">
            <p className="text-[0.85rem] font-medium text-ink">
              {query ? 'No records match your search.' : emptyTitle || `No ${config.label.toLowerCase()} yet.`}
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-[0.76rem] leading-relaxed text-ink-muted">
              {query
                ? 'Try a different term, or clear the search field.'
                : emptyBody ||
                  `Use “Add ${config.singular}” to create the first entry. Nothing is published until you enable it.`}
            </p>
            {!query ? (
              <AdminButton variant="primary" icon={Plus} className="mt-5" onClick={openNew}>
                {addLabel || `Add ${config.singular}`}
              </AdminButton>
            ) : null}
          </div>
        )}
      </AdminCard>

      <Modal
        open={Boolean(editing)}
        onClose={close}
        title={isNew ? `New ${config.singular}` : `Edit ${config.singular}`}
        description="Saved changes are written immediately. Published records appear on the public site."
        wide
        footer={
          <>
            <AdminButton onClick={close}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={save} loading={saving}>
              {isNew ? 'Create' : 'Save changes'}
            </AdminButton>
          </>
        }
      >
        {draft ? (
          <>
            {error ? (
              <Alert tone="error" className="mb-4">
                {error}
              </Alert>
            ) : null}
            <div className="grid gap-1 sm:grid-cols-2 sm:[&>*]:col-span-1">
              {config.fields.map((field) => (
                <div
                  key={field.key}
                  className={cn(
                    field.type === 'richtext' ||
                      field.type === 'list' ||
                      field.type === 'textarea' ||
                      field.type === 'image'
                      ? 'sm:col-span-2'
                      : '',
                  )}
                >
                  <FieldEditor
                    field={field}
                    value={draft[field.key]}
                    onChange={(next) => setDraft((d) => ({ ...d, [field.key]: next }))}
                  />
                </div>
              ))}
            </div>

            {collection === 'milestones' ? (
              <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/[0.05] px-3.5 py-2.5">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                <p className="text-[0.72rem] leading-relaxed text-amber-900/80">
                  Only set “Completed” or “Validated” when the evidence URL points to a real,
                  reviewable artefact. The public timeline states plainly when nothing has been
                  validated.
                </p>
              </div>
            ) : null}
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title={`Delete ${config.singular}?`}
        footer={
          <>
            <AdminButton onClick={() => setConfirmDelete(null)}>Cancel</AdminButton>
            <AdminButton variant="danger" onClick={remove}>
              Delete permanently
            </AdminButton>
          </>
        }
      >
        <p className="text-[0.82rem] leading-relaxed text-ink-soft">
          <strong className="text-ink">
            {confirmDelete ? primaryText(confirmDelete, collection) : ''}
          </strong>{' '}
          will be removed. This cannot be undone.
        </p>
      </Modal>
    </>
  )
}
