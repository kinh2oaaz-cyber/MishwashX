import { useEffect } from 'react'

const DEFAULTS = {
  title: 'Mishawash X — Protirodh BioKit',
  description:
    'Mishawash X is developing Protirodh BioKit, a portable CRISPR-Cas12a-based diagnostic platform concept exploring more accessible approaches to cancer screening.',
}

function setMeta(selector, attr, value) {
  if (!value) return
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const [key, val] = selector.replace(/^meta\[|\]$/g, '').split('=')
    el.setAttribute(key, val.replace(/["']/g, ''))
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

function setLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Per-page SEO. Updates title, description, Open Graph and Twitter tags, and
 * optionally injects page-level structured data.
 */
export function usePageMeta({ title, description, image, path, type = 'website', jsonLd } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Mishawash X` : DEFAULTS.title
    const desc = description || DEFAULTS.description

    document.title = fullTitle
    setMeta('meta[name="description"]', 'content', desc)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[property="og:type"]', 'content', type)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', desc)
    if (image) {
      setMeta('meta[property="og:image"]', 'content', image)
      setMeta('meta[name="twitter:image"]', 'content', image)
    }
    if (typeof window !== 'undefined') {
      const url = window.location.href.split('#')[0] + (path ? `#${path}` : '')
      setMeta('meta[property="og:url"]', 'content', url)
      setLink('canonical', url)
    }

    let script
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.pageJsonLd = 'true'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      if (script && script.parentNode) script.parentNode.removeChild(script)
    }
  }, [title, description, image, path, type, jsonLd])
}
