import { useCallback, useEffect, useRef } from 'react'

/**
 * Magnetic hover: the element drifts toward the pointer within a small radius,
 * then springs back on leave. Disabled for touch devices and reduced motion.
 */
export function useMagnetic({ strength = 0.32, max = 14, disabled = false } = {}) {
  const ref = useRef(null)
  const frame = useRef(0)
  const state = useRef({ x: 0, y: 0, tx: 0, ty: 0, active: false })

  const canHover =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const animate = useCallback(() => {
    const s = state.current
    s.x += (s.tx - s.x) * 0.16
    s.y += (s.ty - s.y) * 0.16
    if (ref.current) {
      ref.current.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`
    }
    if (Math.abs(s.tx - s.x) > 0.08 || Math.abs(s.ty - s.y) > 0.08) {
      frame.current = requestAnimationFrame(animate)
    } else {
      frame.current = 0
    }
  }, [])

  const start = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(animate)
  }, [animate])

  const onMouseMove = useCallback(
    (e) => {
      if (disabled || !canHover || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      const s = state.current
      s.tx = Math.max(-max, Math.min(max, dx * strength))
      s.ty = Math.max(-max, Math.min(max, dy * strength))
      start()
    },
    [disabled, canHover, max, strength, start],
  )

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return
    const s = state.current
    s.tx = 0
    s.ty = 0
    start()
  }, [start])

  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
