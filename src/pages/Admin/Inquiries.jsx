import { useMemo, useState } from 'react'
import { Check, Copy, Download, Inbox, Mail, Search, Trash2 } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import {
  AdminButton,
  AdminCard,
  Alert,
  Modal,
  PageHead,
  StatusPill,
} from './components/AdminUI'
import { cn } from '../../lib/utils/cn'
import { formatDateTime, relativeTime } from '../../lib/utils/format'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'read', label: 'Read' },
  { key: 'archived', label: 'Archived' },
]

function inquiryName(record) {
  return record.name || record.email || 'Unknown sender'
}

export function AdminInquiries() {
  const { inquiries, mode, updateInquiry, deleteInquiry } = useContent()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const sorted = useMemo(
    () =>
      [...inquiries].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      ),
    [inquiries],
  )

  const filtered = sorted.filter((record) => {
    if (filter !== 'all' && (record.status || 'new') !== filter) return false
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return [record.name, record.email, record.organisation, record.subject, record.message]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q)
  })

  async function open(record) {
    setActive(record)
    setCopied(false)
    setError('')
    if ((record.status || 'new') === 'new' && updateInquiry) {
      try {
        await updateInquiry(record.id, { status: 'read' })
      } catch {
        /* reading status is cosmetic; ignore */
      }
    }
  }

  async function setStatus(record, status) {
    if (!updateInquiry) return
    try {
      await updateInquiry(record.id, { status })
      setActive((prev) => (prev && prev.id === record.id ? { ...prev, status } : prev))
    } catch (err) {
      setError(err.message || 'Unable to update this enquiry.')
    }
  }

  async function remove() {
    if (!confirmDelete || !deleteInquiry) return
    try {
      await deleteInquiry(confirmDelete.id)
      if (active?.id === confirmDelete.id) setActive(null)
      setConfirmDelete(null)
    } catch (err) {
      setError(err.message || 'Unable to delete this enquiry.')
    }
  }

  function exportCsv() {
    const rows = [
      ['Received', 'Name', 'Email', 'Organisation', 'Subject', 'Message', 'Status'],
      ...sorted.map((r) => [
        r.createdAt || '',
        r.name || '',
        r.email || '',
        r.organisation || '',
        r.subject || '',
        r.message || '',
        r.status || 'new',
      ]),
    ]
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`).join(','),
      )
      .join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mishawash-enquiries-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const newCount = sorted.filter((r) => (r.status || 'new') === 'new').length

  return (
    <>
      <PageHead
        eyebrow="Library"
        title="Enquiries"
        description="Messages sent through the public contact form."
        actions={
          sorted.length ? (
            <AdminButton icon={Download} onClick={exportCsv}>
              Export CSV
            </AdminButton>
          ) : null
        }
      />

      {mode === 'local' ? (
        <Alert tone="warning" className="mb-5" title="Local Studio inbox">
          In this mode, enquiries are stored in this browser only and appear for this device. They
          are never transmitted anywhere. Do not use this form to collect real personal data until
          Supabase is connected.
        </Alert>
      ) : null}

      {mode !== 'local' ? (
        <Alert tone="info" className="mb-5" title="Handling personal data">
          Enquiries contain personal information. Access is restricted to authenticated
          administrators by Row Level Security. Delete records you no longer need and never copy
          them into public content.
        </Alert>
      ) : null}

      <AdminCard padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef2f6] px-4 py-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => {
              const count =
                f.key === 'all'
                  ? sorted.length
                  : sorted.filter((r) => (r.status || 'new') === f.key).length
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-[0.7rem] transition-colors',
                    filter === f.key
                      ? 'border-navy-900 bg-navy-900 text-white'
                      : 'border-[#e2e9f0] bg-white text-ink-soft hover:border-[#c8d8e6]',
                  )}
                >
                  {f.label}
                  <span className={cn('ml-1.5 tabular-nums', filter === f.key ? 'text-white/50' : 'text-ink-muted/60')}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="relative w-full max-w-[14rem]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted/60" />
            <input
              className="admin-input pl-8 text-[0.76rem]"
              placeholder="Search enquiries…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {newCount ? (
          <div className="border-b border-[#eef2f6] bg-brand-cyan/[0.04] px-4 py-2 text-[0.7rem] text-[#075b7c]">
            {newCount} unread {newCount === 1 ? 'enquiry' : 'enquiries'}.
          </div>
        ) : null}

        {filtered.length ? (
          <ul className="divide-y divide-[#f1f5f9]">
            {filtered.map((record) => {
              const status = record.status || 'new'
              return (
                <li key={record.id}>
                  <div className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#fafcfe]">
                    <button type="button" onClick={() => open(record)} className="min-w-0 flex-1 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'truncate text-[0.82rem]',
                            status === 'new' ? 'font-semibold text-ink' : 'font-medium text-ink-soft',
                          )}
                        >
                          {inquiryName(record)}
                        </span>
                        {status === 'new' ? <StatusPill tone="cyan">New</StatusPill> : null}
                        {record.subject ? (
                          <span className="truncate text-[0.7rem] text-ink-muted">· {record.subject}</span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-[0.72rem] text-ink-muted">
                        {record.message}
                      </p>
                      <p className="mt-1 text-[0.64rem] text-ink-muted/60">
                        {record.email}
                        {record.organisation ? ` · ${record.organisation}` : ''}
                        {record.createdAt ? ` · ${relativeTime(record.createdAt)}` : ''}
                      </p>
                    </button>
                    <div className="flex shrink-0 items-center gap-1">
                      <a
                        href={`mailto:${record.email}?subject=${encodeURIComponent(
                          `Re: ${record.subject || 'Your enquiry to Mishawash X'}`,
                        )}`}
                        className="flex h-7 w-7 items-center justify-center rounded text-ink-muted transition-colors hover:bg-white hover:text-brand-cyan"
                        title="Reply by email"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(record)}
                        className="flex h-7 w-7 items-center justify-center rounded text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete enquiry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e2e9f0] bg-[#fafcfe]">
              <Inbox className="h-5 w-5 text-ink-muted/50" strokeWidth={1.5} />
            </span>
            <p className="mt-3 text-[0.85rem] font-medium text-ink">
              {query || filter !== 'all' ? 'No enquiries match this view.' : 'No enquiries yet.'}
            </p>
            <p className="mt-1 max-w-sm text-[0.76rem] leading-relaxed text-ink-muted">
              {query || filter !== 'all'
                ? 'Change the filter or clear the search field.'
                : 'Messages sent through the Resources contact form will appear here.'}
            </p>
          </div>
        )}
      </AdminCard>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? inquiryName(active) : 'Enquiry'}
        description={active?.createdAt ? formatDateTime(active.createdAt) : undefined}
        footer={
          <>
            {active ? (
              <>
                <AdminButton
                  onClick={() => setStatus(active, active.status === 'archived' ? 'read' : 'archived')}
                >
                  {active.status === 'archived' ? 'Restore' : 'Archive'}
                </AdminButton>
                <a href={`mailto:${active.email}`}>
                  <AdminButton variant="primary" icon={Mail}>
                    Reply
                  </AdminButton>
                </a>
              </>
            ) : null}
          </>
        }
      >
        {active ? (
          <>
            {error ? (
              <Alert tone="error" className="mb-4">
                {error}
              </Alert>
            ) : null}

            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ['Email', active.email],
                ['Organisation', active.organisation || '—'],
                ['Subject', active.subject || '—'],
                ['Status', active.status || 'new'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-[#eef2f6] px-3 py-2">
                  <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                    {label}
                  </dt>
                  <dd className="mt-0.5 break-words text-[0.8rem] text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 rounded-lg border border-[#eef2f6] bg-[#fafcfe] px-4 py-3">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[0.83rem] leading-relaxed text-ink-soft">
                {active.message}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <AdminButton
                size="sm"
                icon={copied ? Check : Copy}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(active.email || '')
                    setCopied(true)
                  } catch {
                    setError('Clipboard access was blocked by the browser.')
                  }
                }}
              >
                {copied ? 'Copied' : 'Copy email'}
              </AdminButton>
              <AdminButton
                size="sm"
                variant="quiet"
                onClick={() => setStatus(active, 'read')}
              >
                Mark as read
              </AdminButton>
            </div>
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete enquiry?"
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
          The enquiry from{' '}
          <strong className="text-ink">{confirmDelete ? inquiryName(confirmDelete) : ''}</strong>{' '}
          will be permanently removed. Export it first if you need a record.
        </p>
      </Modal>
    </>
  )
}
