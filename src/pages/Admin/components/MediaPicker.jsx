import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { useContent } from '../../../content/ContentProvider'
import { AdminButton, Alert } from './AdminUI'
import { cn } from '../../../lib/utils/cn'
import { formatBytes } from '../../../lib/utils/format'

/**
 * Media library picker. Images are selected from the library, uploaded
 * directly, or referenced by URL. PDFs remain selectable for document fields.
 */
export function MediaPicker({ open, onClose, onSelect, accept = 'image', current = '' }) {
  const { media, uploadMedia, deleteMedia, mode } = useContent()
  const inputRef = useRef(null)
  const [url, setUrl] = useState(current || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const assets = media.filter((m) =>
    accept === 'image' ? m.mime?.startsWith('image/') : true,
  )

  async function handleFile(file) {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const record = await uploadMedia(file, { folder: accept === 'image' ? 'images' : 'documents' })
      setUrl(record.url)
      onSelect?.(record.url)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[170] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-2xl">
        <header className="flex items-center justify-between border-b border-[#eef2f6] px-5 py-4">
          <div>
            <h2 className="text-[0.95rem] font-semibold text-ink">Select media</h2>
            <p className="mt-0.5 text-[0.72rem] text-ink-muted">
              {mode === 'local'
                ? 'Files are stored in this browser (IndexedDB). Connect Supabase for shared storage.'
                : 'Files are stored in Supabase Storage and served from the CDN.'}
            </p>
          </div>
          <AdminButton onClick={onClose} size="sm">
            Close
          </AdminButton>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={accept === 'image' ? 'image/jpeg,image/png,image/webp,image/avif,image/svg+xml' : 'application/pdf,image/*'}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <AdminButton variant="primary" icon={Upload} loading={busy} onClick={() => inputRef.current?.click()}>
              Upload file
            </AdminButton>
            {mode === 'local' ? (
              <span className="text-[0.68rem] text-ink-muted">Images ≤ 6 MB · PDF ≤ 20 MB</span>
            ) : null}
          </div>

          {error ? (
            <Alert tone="error" className="mt-4">
              {error}
            </Alert>
          ) : null}

          <div className="mt-5">
            <label className="admin-label">Or paste an asset URL</label>
            <div className="flex gap-2">
              <input
                className="admin-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
              />
              <AdminButton
                variant="teal"
                onClick={() => {
                  if (url) {
                    onSelect?.(url)
                    onClose?.()
                  }
                }}
              >
                Use
              </AdminButton>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="admin-label mb-0">Library</p>
              <span className="text-[0.68rem] text-ink-muted">{assets.length} assets</span>
            </div>

            {assets.length ? (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {assets.map((asset) => (
                  <div key={asset.id} className="group relative overflow-hidden rounded-lg border border-[#e2e9f0]">
                    <button
                      type="button"
                      onClick={() => {
                        onSelect?.(asset.url)
                        onClose?.()
                      }}
                      className="block w-full"
                    >
                      <div className="aspect-[4/3] bg-[#f4f7fa]">
                        {asset.mime?.startsWith('image/') ? (
                          <img src={asset.url} alt={asset.alt || asset.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[0.7rem] text-ink-muted">
                            {asset.mime || 'file'}
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="truncate text-[0.7rem] font-medium text-ink">{asset.name}</p>
                        <p className="text-[0.62rem] text-ink-muted">{formatBytes(asset.size)}</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMedia(asset.id)}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-red-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                      aria-label={`Delete ${asset.name}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#d5e0ea] bg-[#fafcfe] py-12 text-center">
                {busy ? (
                  <Loader2 className="h-5 w-5 animate-spin text-brand-cyan" />
                ) : (
                  <ImagePlus className="h-5 w-5 text-ink-muted/50" strokeWidth={1.5} />
                )}
                <p className="mt-2 text-[0.78rem] text-ink-muted">No assets yet. Upload a file to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Image field with preview, picker and clear. */
export function ImageInput({ value, onChange, label }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-[#f4f7fa]',
            value ? 'border-[#d5e0ea]' : 'border-dashed border-[#cfdce8]',
          )}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-5 w-5 text-ink-muted/40" strokeWidth={1.4} />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <AdminButton size="sm" variant="ghost" icon={ImagePlus} onClick={() => setOpen(true)}>
            {value ? 'Replace image' : 'Choose image'}
          </AdminButton>
          {value ? (
            <AdminButton size="sm" variant="quiet" icon={Trash2} onClick={() => onChange('')}>
              Remove
            </AdminButton>
          ) : null}
          <p className="text-[0.66rem] leading-relaxed text-ink-muted">
            Use real project photography only. Conceptual renders must stay labelled as such.
          </p>
        </div>
      </div>
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(url) => onChange(url)}
        current={value}
      />
    </div>
  )
}
