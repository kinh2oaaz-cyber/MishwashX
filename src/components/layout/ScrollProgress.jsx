import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin reading-progress indicator pinned to the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[110] h-[2px] origin-left bg-gradient-to-r from-brand-cyan via-brand-teal to-brand-teal-soft"
      style={{ scaleX }}
    />
  )
}
