import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { cn } from '../../lib/utils/cn'

/**
 * Count-up figure. Parses an optional prefix and suffix from the source string
 * so that values such as "≈20.0M" animate without inventing precision.
 */
export function Counter({ value, className = '', duration = 1600 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()

  const match = String(value ?? '').match(/^([^\d]*)(\d+(?:\.\d+)?)([\s\S]*)$/)
  const prefix = match?.[1] ?? ''
  const target = match ? parseFloat(match[2]) : 0
  const suffix = match?.[3] ?? ''
  const decimals = match?.[2]?.includes('.') ? match[2].split('.')[1].length : 0

  const [display, setDisplay] = useState(reduce ? target : 0)

  useEffect(() => {
    if (!match) return
    if (reduce || !inView) {
      if (reduce) setDisplay(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(target * eased)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration, reduce, match])

  if (!match) return <span className={className}>{value}</span>

  return (
    <span ref={ref} className={cn('numeral tabular-nums', className)}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
