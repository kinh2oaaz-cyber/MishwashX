import { useEffect, useRef, useState } from 'react'
import {
  Bold,
  Eraser,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Underline,
} from 'lucide-react'
import { cn } from '../../../lib/utils/cn'

/**
 * Lightweight WYSIWYG editor for admin-authored rich text.
 * Content is stored as HTML and sanitised again at render time, so a
 * compromised editor cannot inject scripts into the public site.
 */
export function RichTextEditor({ value = '', onChange, minHeight = 150, placeholder = 'Write…' }) {
  const ref = useRef(null)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    if (!focused && ref.current.innerHTML !== (value || '')) {
      ref.current.innerHTML = value || ''
    }
  }, [value, focused])

  function sync() {
    if (ref.current) onChange(ref.current.innerHTML)
  }

  function exec(command, arg = null) {
    document.execCommand(command, false, arg)
    if (ref.current) ref.current.focus()
    sync()
  }

  function addLink() {
    const url = window.prompt('Link URL (https://…)')
    if (!url) return
    if (!/^https?:\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('mailto:')) {
      window.alert('Please enter a valid URL starting with https://')
      return
    }
    exec('createLink', url)
  }

  const tools = [
    { icon: Bold, label: 'Bold', action: () => exec('bold') },
    { icon: Italic, label: 'Italic', action: () => exec('italic') },
    { icon: Underline, label: 'Underline', action: () => exec('underline') },
    { icon: Heading2, label: 'Heading', action: () => exec('formatBlock', 'h2') },
    { icon: Heading3, label: 'Subheading', action: () => exec('formatBlock', 'h3') },
    { icon: List, label: 'Bullet list', action: () => exec('insertUnorderedList') },
    { icon: ListOrdered, label: 'Numbered list', action: () => exec('insertOrderedList') },
    { icon: Link2, label: 'Link', action: addLink },
    { icon: Eraser, label: 'Remove formatting', action: () => exec('removeFormat') },
  ]

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border bg-white transition-shadow',
        focused ? 'border-brand-cyan shadow-[0_0_0_3px_rgba(8,126,170,0.1)]' : 'border-[#d5e0ea]',
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#eef2f6] bg-[#fafcfe] px-1.5 py-1">
        {tools.map((tool, i) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={tool.action}
            className="flex h-7 w-7 items-center justify-center rounded text-ink-soft transition-colors hover:bg-white hover:text-ink hover:shadow-sm"
          >
            <tool.icon className="h-3.5 w-3.5" strokeWidth={1.9} />
          </button>
        ))}
        <span className="ml-auto pr-1 text-[0.6rem] uppercase tracking-[0.12em] text-ink-muted/50">
          HTML sanitised
        </span>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          sync()
        }}
        onInput={sync}
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
          sync()
        }}
        style={{ minHeight }}
        className="prose-mx max-w-none px-3 py-2.5 text-[0.85rem] outline-none empty:before:text-ink-muted/50 empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  )
}
