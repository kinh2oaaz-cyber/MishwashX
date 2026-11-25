import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BrandMark } from '../common/Logo'

/**
 * Initial loading experience.
 * A short, deliberate sequence: molecular field, mark reveal, progress readout,
 * then a curtain lift into the site. Target duration ≈1.8s.
 */
export function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const reduce = useReducedMotion()
  const completed = useRef(false)
  const canvasRef = useRef(null)

  /* ------------------------------ progress ------------------------------- */
  useEffect(() => {
    const duration = reduce ? 420 : 1750
    const start = performance.now()
    let raf = 0
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 2.2)
      setProgress(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setExiting(true)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  useEffect(() => {
    if (!exiting || completed.current) return
    completed.current = true
    const id = setTimeout(() => onComplete?.(), reduce ? 120 : 780)
    return () => clearTimeout(id)
  }, [exiting, onComplete, reduce])

  /* --------------------------- molecular field --------------------------- */
  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const particles = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
      r: Math.random() * 1.4 + 0.4,
    }))

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1
        const px = p.x * width
        const py = p.y * height
        ctx.beginPath()
        ctx.arc(px, py, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(36,198,177,0.45)'
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const qx = q.x * width
          const qy = q.y * height
          const dist = Math.hypot(px - qx, py - qy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(px, py)
            ctx.lineTo(qx, qy)
            ctx.strokeStyle = `rgba(8,126,170,${0.16 * (1 - dist / 130)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduce])

  const letters = 'MISHWASH X'.split('')

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-navy-950 text-white"
      initial={{ y: 0 }}
      animate={exiting ? { y: reduce ? 0 : '-100%', opacity: reduce ? 0 : 1 } : { y: 0 }}
      transition={{ duration: reduce ? 0.25 : 1.05, ease: [0.83, 0, 0.17, 1] }}
      aria-live="polite"
      aria-label="Loading Mishawash X"
    >
      {/* ambient light */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full glow-cyan opacity-60 blur-3xl" />
        <div className="absolute inset-0 grid-fine opacity-[0.55] grid-mask" />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" aria-hidden="true" />

      {/* rotating molecular rings */}
      {!reduce ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <motion.svg
            width="460"
            height="460"
            viewBox="0 0 460 460"
            className="opacity-[0.16]"
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="230" cy="230" r="180" fill="none" stroke="#24C6B1" strokeWidth="0.6" strokeDasharray="2 10" />
            <circle cx="230" cy="230" r="140" fill="none" stroke="#087EAA" strokeWidth="0.6" />
            <circle cx="230" cy="50" r="3" fill="#24C6B1" />
            <circle cx="370" cy="230" r="2" fill="#7FC9E2" />
          </motion.svg>
        </div>
      ) : null}

      {/* scanning line */}
      {!reduce ? (
        <motion.div
          className="pointer-events-none absolute left-0 h-px w-full scanline"
          initial={{ top: '18%', opacity: 0 }}
          animate={{ top: ['18%', '82%', '18%'], opacity: [0, 0.9, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      ) : null}

      {/* centre mark */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7"
        >
          <BrandMark size={54} />
        </motion.div>
        <div className="flex items-end gap-[0.02em] overflow-hidden">
          {letters.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              className="font-display text-[clamp(1.9rem,7vw,3.4rem)] font-light tracking-[0.02em]"
              initial={reduce ? { opacity: 0 } : { y: '110%', opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { y: '0%', opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.08 + i * 0.035, ease: [0.16, 1, 0.3, 1] }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </div>

        <motion.div
          className="mt-5 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          <span className="h-px w-8 bg-brand-teal/60" />
          <span className="label text-brand-teal-soft/80">Protirodh BioKit</span>
          <span className="h-px w-8 bg-brand-teal/60" />
        </motion.div>
      </div>

      {/* footer readout */}
      <div className="relative z-10 flex items-end justify-between px-6 pb-8 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="label text-white/35">Conrad Challenge 2026–2027</p>
          <p className="mt-2 text-[0.7rem] text-white/25">Biomedical Technology</p>
        </motion.div>

        <motion.div
          className="flex flex-col items-end gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <span className="label text-white/30">Initialising</span>
            <span className="numeral text-[0.8rem] tabular-nums text-white/70">
              {String(progress).padStart(3, '0')}
            </span>
          </div>
          <div className="h-px w-40 bg-white/10 md:w-56">
            <div
              className="h-px bg-gradient-to-r from-brand-cyan to-brand-teal transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
