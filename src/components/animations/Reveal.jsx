import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Scroll-triggered entrance. The default motion is a clear, deliberate rise + fade;
 * `prefers-reduced-motion` removes the transform entirely.
 * Enhanced for more definitive, purposeful animations.
 */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  duration = 1.0,
  once = true,
  margin = '-80px',
  className = '',
  as = 'div',
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, margin }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  )
}

/** Stagger container for lists of cards. */
export function RevealGroup({ children, className = '', stagger = 0.1, delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className = '', y = 28 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.95, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Word-by-word mask reveal for editorial headings.
 * Words are wrapped so the glyphs rise out of an overflow-hidden line box.
 * Enhanced for more deliberate, definitive animation.
 */
export function TextReveal({
  text,
  className = '',
  delay = 0,
  stagger = 0.055,
  as = 'h2',
  once = true,
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.h2
  const words = String(text || '').split(/\s+/).filter(Boolean)

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-80px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.08em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '120%', opacity: 0 },
              show: { y: '0%', opacity: 1, transition: { duration: 1.0, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

/** Fade + rise on mount, used by hero elements with explicit delays. */
export function Enter({ children, delay = 0, y = 24, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
