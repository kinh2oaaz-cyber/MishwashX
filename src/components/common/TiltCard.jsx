import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils/cn'

/**
 * Pointer-tracked 3D tilt with a moving highlight.
 * Disabled on touch devices and for reduced-motion users.
 */
export function TiltCard({ children, className = '', intensity = 6, glare = true }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const frame = useRef(0)

  const canHover =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches

  function onMove(e) {
    if (reduce || !canHover || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      if (!ref.current) return
      ref.current.style.transform = `perspective(900px) rotateX(${(0.5 - py) * intensity}deg) rotateY(${(px - 0.5) * intensity}deg)`
      ref.current.style.setProperty('--mx', `${px * 100}%`)
      ref.current.style.setProperty('--my', `${py * 100}%`)
    })
  }

  function onLeave() {
    if (!ref.current) return
    cancelAnimationFrame(frame.current)
    ref.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('relative transition-transform duration-500 ease-out will-change-transform', className)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
      {glare ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(36,198,177,0.10), transparent 70%)',
          }}
        />
      ) : null}
    </div>
  )
}
