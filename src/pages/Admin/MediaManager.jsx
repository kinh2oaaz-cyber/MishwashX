import { useMemo, useRef, useState } from 'react'
import {
  Check,
  Copy,
  FileText,
  Image as ImageIcon,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
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
import { formatBytes, formatDateTime } from '../../lib/utils/format'
import { assetUrl } from '../../lib/utils/assets'

const FILTERS = [
  { key: 'all', label: 'All assets' },
  { key: 'image', label: 'Images' },
  { key: 'document', label: 'Documents' },
]

export function AdminMedia() {
  const { media, uploadMedia, updateMedia, deleteMedia, mode } = useContent()
  const inputRef = useRef(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [copied, setCopied] = useState('')
  const [dragging, setDragging] = useState(false)

  const selected = media.find((m) => m.id === selectedId) || null

  const filtered = useMemo(() => {
    let list = [...media].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    )
    if (filter === 'image') list = list.filter((m) => m.mime?.startsWith('image/'))
    if (filter === 'document') list = list.filter((m) => !m.mime?.startsWith('image/'))
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((m) =>
        [m.name, m.alt, m.caption, m.folder].filter(Boolean).join(' ').toLowerCase().includes(q),
      )
    }
    return list
  }, [media, filter, query])

  const totalBytes = media.reduce((sum, m) => sum + (m.size || 0), 0)

  async function handleFiles(files) {
    if (!files?.length) return
    setUploading(true)
    setError('')
    try {
      for (const file of Array.from(files)) {
        // Sequential uploads keep progress legible and avoid storage rate spikes.
        // eslint-disable-next-line no-await-in-loop
        const record = await uploadMedia(file, {
          folder: file.type.startsWith('image/') ? 'images' : 'documents',
        })
        setSelectedId(record.id)
      }
    } catch (err) {
      setError(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function copy(record) {
    try {
      await navigator.clipboard.writeText(record.url)
      setCopied(record.id)
      setTimeout(() => setCopied(''), 1800)
    } catch {
      setError('Clipboard access was blocked by the browser. Select the URL manually.')
    }
  }

  async function patchSelected(patch) {
    if (!selected) return
    try {
      await updateMedia(selected.id, patch)
    } catch (err) {
      setError(err.message || 'Unable to update this asset.')
    }
  }

  async function remove() {
    if (!confirmDelete) return
    try {
      await deleteMedia(confirmDelete.id)
      if (selectedId === confirmDelete.id) setSelectedId(null)
      setConfirmDelete(null)
    } catch (err) {
      setError(err.message || 'Unable to delete this asset.')
    }
  }

  return (
    <>
      <PageHead
        eyebrow="Library"
        title="Media library"
        description="Images and PDFs available to page editors and document records."
        actions={
          <>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,application/pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <AdminButton
              variant="primary"
              icon={Upload}
              loading={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Upload files
            </AdminButton>
          </>
        }
      />

      {mode === 'local' ? (
        <Alert tone="warning" className="mb-5" title="Browser-local storage">
          Files are saved in this browser’s IndexedDB. They are not uploaded anywhere and will not
          appear on the deployed site. Connect Supabase Storage before publishing real imagery.
          Images up to 6 MB, PDFs up to 20 MB.
        </Alert>
      ) : (
        <Alert tone="info" className="mb-5" title="Storage policy">
          Images up to 6 MB, PDFs up to 20 MB. Uploads are public once referenced, so remove
          anything confidential before uploading. Never upload patient data.
        </Alert>
      )}

      {error ? (
        <Alert tone="error" className="mb-5">
          {error}
        </Alert>
      ) : null}

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#e2e9f0] bg-white px-4 py-3">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-ink-muted">
            Assets
          </p>
          <p className="mt-1 font-display text-[1.5rem] font-light tabular-nums text-ink">
            {media.length}
          </p>
        </div>
        <div className="rounded-xl border border-[#e2e9f0] bg-white px-4 py-3">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-ink-muted">
            Total size
          </p>
          <p className="mt-1 font-display text-[1.5rem] font-light tabular-nums text-ink">
            {formatBytes(totalBytes)}
          </p>
        </div>
        <div className="rounded-xl border border-[#e2e9f0] bg-white px-4 py-3">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-ink-muted">
            Missing alt text
          </p>
          <p className="mt-1 font-display text-[1.5rem] font-light tabular-nums text-ink">
            {media.filter((m) => m.mime?.startsWith('image/') && !m.alt).length}
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'mb-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
          dragging
            ? 'border-brand-teal bg-brand-teal/[0.05]'
            : 'border-[#d5e0ea] bg-white hover:border-brand-cyan/40',
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-brand-cyan" />
            <p className="mt-2 text-[0.8rem] text-ink-muted">Uploading…</p>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5 text-ink-muted/50" strokeWidth={1.5} />
            <p className="mt-2 text-[0.8rem] font-medium text-ink">
              Drop files here, or{' '}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-brand-cyan underline-offset-2 hover:underline"
              >
                browse
              </button>
            </p>
            <p className="mt-1 text-[0.7rem] text-ink-muted">
              JPEG, PNG, WebP, AVIF, SVG or PDF · multiple files supported
            </p>
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_20rem] xl:items-start">
        <AdminCard padded={false}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef2f6] px-4 py-3">
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
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
                </button>
              ))}
            </div>
            <div className="relative w-full max-w-[14rem]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted/60" />
              <input
                className="admin-input pl-8 text-[0.76rem]"
                placeholder="Search library…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {filtered.length ? (
            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((asset) => {
                const isImage = asset.mime?.startsWith('image/')
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSelectedId(asset.id)}
                    className={cn(
                      'group overflow-hidden rounded-lg border bg-white text-left transition-all',
                      selectedId === asset.id
                        ? 'border-brand-cyan shadow-[0_0_0_3px_rgba(8,126,170,0.12)]'
                        : 'border-[#e2e9f0] hover:border-[#c8d8e6]',
                    )}
                  >
                    <div className="relative aspect-[4/3] bg-[#f4f7fa]">
                      {isImage ? (
                        <img
                          src={assetUrl(asset.url)}
                          alt={asset.alt || asset.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-1.5">
                          <FileText className="h-6 w-6 text-ink-muted/40" strokeWidth={1.4} />
                          <span className="text-[0.6rem] uppercase tracking-[0.12em] text-ink-muted/60">
                            {asset.mime?.includes('pdf') ? 'PDF' : 'File'}
                          </span>
                        </div>
                      )}
                      {!asset.alt && isImage ? (
                        <span className="absolute left-1.5 top-1.5 rounded bg-amber-500/90 px-1.5 py-0.5 text-[0.55rem] font-medium uppercase tracking-wide text-white">
                          No alt
                        </span>
                      ) : null}
                    </div>
                    <div className="p-2.5">
                      <p className="truncate text-[0.72rem] font-medium text-ink">{asset.name}</p>
                      <p className="mt-0.5 text-[0.62rem] text-ink-muted">
                        {formatBytes(asset.size)} · {asset.folder || 'general'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <ImageIcon className="h-5 w-5 text-ink-muted/40" strokeWidth={1.5} />
              <p className="mt-2 text-[0.82rem] font-medium text-ink">
                {query || filter !== 'all' ? 'No matching assets.' : 'The library is empty.'}
              </p>
              <p className="mt-1 max-w-sm text-[0.74rem] leading-relaxed text-ink-muted">
                Upload real project imagery or approved PDFs. Conceptual renders must be labelled as
                conceptual wherever they are used.
              </p>
            </div>
          )}
        </AdminCard>

        <div className="xl:sticky xl:top-24">
          {selected ? (
            <AdminCard
              title="Asset details"
              description={selected.name}
              actions={
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-[#f1f5f9]"
                  aria-label="Close details"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              }
            >
              <div className="overflow-hidden rounded-lg border border-[#eef2f6] bg-[#f4f7fa]">
                {selected.mime?.startsWith('image/') ? (
                  <img src={assetUrl(selected.url)} alt={selected.alt || ''} className="max-h-48 w-full object-contain" />
                ) : (
                  <div className="flex items-center justify-center py-10">
                    <FileText className="h-8 w-8 text-ink-muted/40" strokeWidth={1.3} />
                  </div>
                )}
              </div>

              <dl className="mt-3 space-y-2 text-[0.7rem]">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Type</dt>
                  <dd className="text-right text-ink-soft">{selected.mime || '—'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Size</dt>
                  <dd className="text-ink-soft">{formatBytes(selected.size)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Uploaded</dt>
                  <dd className="text-ink-soft">{formatDateTime(selected.createdAt)}</dd>
                </div>
              </dl>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="admin-label" htmlFor="asset-alt">
                    Alt text
                  </label>
                  <textarea
                    id="asset-alt"
                    rows={2}
                    className="admin-input resize-y text-[0.78rem]"
                    value={selected.alt || ''}
                    placeholder="Describe the image for screen readers"
                    onChange={(e) => patchSelected({ alt: e.target.value })}
                  />
                  <p className="admin-hint">Required for informative images. Leave empty only for decoration.</p>
                </div>

                <div>
                  <label className="admin-label" htmlFor="asset-caption">
                    Caption
                  </label>
                  <input
                    id="asset-caption"
                    className="admin-input text-[0.78rem]"
                    value={selected.caption || ''}
                    onChange={(e) => patchSelected({ caption: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label" htmlFor="asset-folder">
                    Folder
                  </label>
                  <input
                    id="asset-folder"
                    className="admin-input text-[0.78rem]"
                    value={selected.folder || ''}
                    onChange={(e) => patchSelected({ folder: e.target.value })}
                  />
                </div>

                <div>
                  <p className="admin-label">Public URL</p>
                  <div className="flex gap-1.5">
                    <input readOnly value={selected.url} className="admin-input font-mono text-[0.66rem]" />
                    <AdminButton
                      size="sm"
                      icon={copied === selected.id ? Check : Copy}
                      onClick={() => copy(selected)}
                    >
                      {copied === selected.id ? 'Copied' : 'Copy'}
                    </AdminButton>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-[#eef2f6] pt-4">
                <AdminButton
                  variant="danger"
                  icon={Trash2}
                  className="w-full"
                  onClick={() => setConfirmDelete(selected)}
                >
                  Delete asset
                </AdminButton>
              </div>
            </AdminCard>
          ) : (
            <AdminCard title="Selection">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ImageIcon className="h-5 w-5 text-ink-muted/40" strokeWidth={1.5} />
                <p className="mt-2 text-[0.78rem] font-medium text-ink">No asset selected</p>
                <p className="mt-1 text-[0.72rem] leading-relaxed text-ink-muted">
                  Choose an asset to edit its alt text, caption and folder, or copy its URL into a
                  page field.
                </p>
              </div>
            </AdminCard>
          )}

          <div className="mt-3 rounded-lg border border-[#e2e9f0] bg-white px-4 py-3">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-ink-muted">
              Integrity
            </p>
            <p className="mt-1.5 text-[0.72rem] leading-relaxed text-ink-muted">
              Do not upload stock photography of unrelated laboratories or devices, and never present
              a render as a photograph of working hardware. Keep conceptual visuals labelled.
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete asset?"
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
          <strong className="text-ink">{confirmDelete?.name}</strong> will be removed from storage.
          Any page or record still pointing at its URL will show a broken image or link.
        </p>
        <div className="mt-3">
          <StatusPill tone="amber">Check usage before deleting</StatusPill>
        </div>
      </Modal>
    </>
  )
}
