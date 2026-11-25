import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from 'lucide-react'
import { AdminButton, Toggle } from './AdminUI'
import { RichTextEditor } from './RichTextEditor'
import { ImageInput } from './MediaPicker'
import { cn } from '../../../lib/utils/cn'

const TITLE_KEYS = ['title', 'name', 'q', 'value', 'label', 'requirement', 'stage', 'index', 'phase']

function itemTitle(item, index) {
  if (typeof item === 'string') return item || `Item ${index + 1}`
  for (const key of TITLE_KEYS) {
    if (typeof item?.[key] === 'string' && item[key].trim()) return item[key]
  }
  return `Item ${index + 1}`
}

function blankItem(field) {
  if (field.simple) return ''
  if (field.defaultItem) return JSON.parse(JSON.stringify(field.defaultItem))
  const obj = {}
  ;(field.fields || []).forEach((sub) => {
    obj[sub.key] = sub.type === 'list' ? [] : sub.type === 'boolean' ? false : ''
  })
  return obj
}

/**
 * Schema-driven field renderer. Supports nested groups and repeatable lists,
 * so an administrator can restructure content without code changes.
 */
export function FieldEditor({ field, value, onChange, depth = 0 }) {
  switch (field.type) {
    case 'textarea':
      return (
        <FieldShell field={field}>
          <textarea
            rows={field.rows || 4}
            className="admin-input resize-y"
            value={value ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </FieldShell>
      )

    case 'richtext':
      return (
        <FieldShell field={field}>
          <RichTextEditor value={value ?? ''} onChange={onChange} />
        </FieldShell>
      )

    case 'url':
      return (
        <FieldShell field={field}>
          <input
            className="admin-input font-mono text-[0.78rem]"
            value={value ?? ''}
            placeholder={field.placeholder || 'https://… or /route'}
            onChange={(e) => onChange(e.target.value)}
          />
        </FieldShell>
      )

    case 'image':
      return (
        <FieldShell field={field}>
          <ImageInput value={value ?? ''} onChange={onChange} label={field.label} />
        </FieldShell>
      )

    case 'boolean':
      return (
        <div className="py-1.5">
          <Toggle checked={Boolean(value)} onChange={onChange} label={field.label} hint={field.hint} />
        </div>
      )

    case 'select':
      return (
        <FieldShell field={field}>
          <select className="admin-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
            {(field.options || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>
      )

    case 'number':
      return (
        <FieldShell field={field}>
          <input
            type="number"
            className="admin-input"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </FieldShell>
      )

    case 'group':
      return (
        <FieldShell field={field}>
          <div className="grid gap-3 rounded-lg border border-[#eef2f6] bg-[#fafcfe] p-3 sm:grid-cols-2">
            {(field.fields || []).map((sub) => (
              <FieldEditor
                key={sub.key}
                field={sub}
                value={value?.[sub.key]}
                depth={depth + 1}
                onChange={(next) => onChange({ ...(value || {}), [sub.key]: next })}
              />
            ))}
          </div>
        </FieldShell>
      )

    case 'list':
      return <ListField field={field} value={value} onChange={onChange} depth={depth} />

    case 'text':
    default:
      return (
        <FieldShell field={field}>
          <input
            className="admin-input"
            value={value ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </FieldShell>
      )
  }
}

function FieldShell({ field, children }) {
  return (
    <div className="py-1.5">
      {field.type !== 'boolean' ? (
        <label className="admin-label">
          {field.label}
          {field.required ? <span className="ml-0.5 text-brand-cyan">*</span> : null}
        </label>
      ) : null}
      {children}
      {field.hint ? <p className="admin-hint">{field.hint}</p> : null}
    </div>
  )
}

function ListField({ field, value, onChange, depth }) {
  const items = Array.isArray(value) ? value : []
  const [openItems, setOpenItems] = useState(() => new Set([0]))

  function toggle(index) {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function update(index, next) {
    const copy = [...items]
    copy[index] = next
    onChange(copy)
  }

  function remove(index) {
    onChange(items.filter((_, i) => i !== index))
  }

  function move(index, direction) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const copy = [...items]
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
    onChange(copy)
  }

  function duplicate(index) {
    const copy = [...items]
    copy.splice(index + 1, 0, JSON.parse(JSON.stringify(items[index])))
    onChange(copy)
  }

  function add() {
    onChange([...items, blankItem(field)])
    setOpenItems((prev) => new Set(prev).add(items.length))
  }

  return (
    <div className="py-1.5">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="admin-label mb-0">{field.label}</span>
          <span className="ml-2 text-[0.66rem] text-ink-muted/70">{items.length} items</span>
        </div>
        <AdminButton size="sm" variant="ghost" icon={Plus} onClick={add}>
          Add
        </AdminButton>
      </div>
      {field.hint ? <p className="admin-hint mb-2 mt-0">{field.hint}</p> : null}

      <div className="space-y-2">
        {items.map((item, index) => {
          const open = openItems.has(index)
          return (
            <div key={index} className="overflow-hidden rounded-lg border border-[#e2e9f0] bg-white">
              <div className="flex items-center gap-2 bg-[#fafcfe] px-2.5 py-1.5">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white text-[0.6rem] font-medium tabular-nums text-ink-muted ring-1 ring-[#e2e9f0]">
                    {index + 1}
                  </span>
                  <span className="truncate text-[0.76rem] font-medium text-ink-soft">
                    {itemTitle(item, index)}
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-0.5">
                  <IconBtn label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                    <ChevronUp className="h-3 w-3" />
                  </IconBtn>
                  <IconBtn label="Move down" onClick={() => move(index, 1)} disabled={index === items.length - 1}>
                    <ChevronDown className="h-3 w-3" />
                  </IconBtn>
                  <IconBtn label="Duplicate" onClick={() => duplicate(index)}>
                    <Copy className="h-3 w-3" />
                  </IconBtn>
                  <IconBtn label="Delete" onClick={() => remove(index)} danger>
                    <Trash2 className="h-3 w-3" />
                  </IconBtn>
                  <IconBtn label={open ? 'Collapse' : 'Expand'} onClick={() => toggle(index)}>
                    <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
                  </IconBtn>
                </div>
              </div>

              {open ? (
                <div className="grid gap-1 border-t border-[#eef2f6] px-3 py-2 sm:grid-cols-2 sm:[&>*]:col-span-1">
                  {field.simple ? (
                    <div className="sm:col-span-2">
                      <textarea
                        rows={2}
                        className="admin-input resize-y text-[0.8rem]"
                        value={typeof item === 'string' ? item : item?.value ?? ''}
                        onChange={(e) => update(index, e.target.value)}
                      />
                    </div>
                  ) : (
                    (field.fields || []).map((sub) => (
                      <div
                        key={sub.key}
                        className={cn(sub.type === 'richtext' || sub.type === 'list' || sub.type === 'textarea' || sub.type === 'image' ? 'sm:col-span-2' : '')}
                      >
                        <FieldEditor
                          field={sub}
                          value={item?.[sub.key]}
                          depth={depth + 1}
                          onChange={(next) => update(index, { ...item, [sub.key]: next })}
                        />
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          )
        })}

        {!items.length ? (
          <button
            type="button"
            onClick={add}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#d5e0ea] bg-[#fafcfe] py-6 text-[0.76rem] text-ink-muted transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
          >
            <Plus className="h-3.5 w-3.5" />
            Add the first {field.itemLabel || 'item'}
          </button>
        ) : null}
      </div>
    </div>
  )
}

function IconBtn({ children, label, onClick, disabled, danger }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded text-ink-muted transition-colors disabled:opacity-25',
        danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-white hover:text-ink hover:shadow-sm',
      )}
    >
      {children}
    </button>
  )
}
