import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Custom desktop cursor: a precise dot plus a trailing ring that grows over
 * interactive elements. Disabled for touch and reduced-motion users, and the
 * native cursor is only hidden once the overlay is confirmed running.
 */
export function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || reduce) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.body.classList.add('mx-custom-cursor')
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...target }
    let raf = 0
    let visible = false

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      const interactive = e.target.closest?.('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]')
      ring.style.width = interactive ? '46px' : '26px'
      ring.style.height = interactive ? '46px' : '26px'
      ring.style.borderColor = interactive ? 'rgba(36,198,177,0.9)' : 'rgba(255,255,255,0.55)'
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
    }

    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.16
      ringPos.y += (target.y - ringPos.y) * 0.16
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    loop()

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.body.classList.remove('mx-custom-cursor')
    }
  }, [reduce])

  if (reduce) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[150] hidden lg:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-[5px] w-[5px] rounded-full bg-white opacity-0 mix-blend-difference transition-opacity duration-300"
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-[26px] w-[26px] rounded-full border border-white/55 opacity-0 transition-[width,height,border-color,opacity] duration-300"
        style={{ mixBlendMode: 'difference' }}
      />
    </div>
  )
}
