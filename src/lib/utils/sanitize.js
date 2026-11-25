import DOMPurify from 'dompurify'

/**
 * Sanitise admin-authored rich text before rendering.
 * Allows a conservative formatting subset — no scripts, no event handlers,
 * no iframes, no inline styles.
 */
const CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'a',
    'ul',
    'ol',
    'li',
    'h2',
    'h3',
    'h4',
    'blockquote',
    'code',
    'sup',
    'sub',
    'span',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
}

export function sanitizeHtml(html = '') {
  if (!html) return ''
  return DOMPurify.sanitize(String(html), CONFIG)
}

/**
 * Normalise links authored in rich text so external targets open safely.
 */
export function hardenLinks(html = '') {
  if (typeof document === 'undefined') return html
  const el = document.createElement('div')
  el.innerHTML = html
  el.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href') || ''
    if (/^https?:\/\//i.test(href)) {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
    }
  })
  return el.innerHTML
}

/** Sanitise + harden in one step. Use for every rich-text field. */
export function safeRichText(html = '') {
  return hardenLinks(sanitizeHtml(html))
}

/** Escape a string for safe interpolation into plain-text contexts. */
export function escapeText(value = '') {
  return String(value).replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
    }
  })
}
