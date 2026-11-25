import { useEffect } from 'react'

/** Lock body scroll (modals, mobile nav, admin drawers). */
export function useScrollLock(locked = true) {
  useEffect(() => {
    if (!locked) return
    const original = document.body.style.overflow
    const paddingRight = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (paddingRight > 0) document.body.style.paddingRight = `${paddingRight}px`
    return () => {
      document.body.style.overflow = original
      document.body.style.paddingRight = ''
    }
  }, [locked])
}

/** Escape-key handler. */
export function useEscapeKey(handler, active = true) {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.key === 'Escape') handler()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handler, active])
}
