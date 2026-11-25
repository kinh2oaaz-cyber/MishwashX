import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '../../lib/utils/cn'

const EASE = [0.16, 1, 0.3, 1]

/** One reporter construct: fluorophore, linker, quencher. */
function Reporter({ x, y, delay, cleaved, index }) {
  const drop = cleaved ? -26 - index * 4 : 0
  return (
    <motion.g initial={false} animate={{ x: 0, y: 0 }}>
      <motion.circle
        cx={x}
        cy={y}
        r="4.5"
        fill="#24C6B1"
        animate={
          cleaved
            ? { cy: y + drop, cx: x - 14, opacity: [0.4, 1, 0.85], r: [4.5, 6.5, 4] }
            : { cy: y, cx: x, opacity: 0.55, r: 4.5 }
        }
        transition={{ duration: 0.9, delay, ease: EASE }}
        filter="url(#mx-glow)"
      />
      <motion.line
        x1={x + 6}
        y1={y}
        x2={x + 34}
        y2={y}
        stroke="#8fa6ba"
        strokeWidth="1.6"
        animate={cleaved ? { x2: x + 22, opacity: 0.25 } : { x2: x + 34, opacity: 0.6 }}
        transition={{ duration: 0.6, delay }}
      />
      <motion.rect
        x={x + 34}
        y={y - 3}
        width="6"
        height="6"
        rx="1"
        fill="#0a1e34"
        stroke="#4d6b85"
        strokeWidth="0.8"
        animate={cleaved ? { x: x + 30, opacity: 0.35 } : { x: x + 34, opacity: 1 }}
        transition={{ duration: 0.6, delay }}
      />
    </motion.g>
  )
}

/**
 * Interactive CRISPR-Cas12a mechanism illustration.
 * Conceptual: it depicts published Cas12a behaviour, not our own data.
 */
export function CrisprMechanism({ steps = [], conceptNote, className = '' }) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(!reduce)

  useEffect(() => {
    if (!playing || reduce || steps.length < 2) return
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 3600)
    return () => clearInterval(id)
  }, [playing, reduce, steps.length])

  const docked = step >= 1
  const activated = step >= 2
  const signalling = step >= 3

  const complexX = docked ? 320 : 150
  const complexY = docked ? 250 : 118
  const complexScale = docked ? 0.94 : 1

  return (
    <div className={cn('grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14', className)}>
      {/* Controls */}
      <div className="order-2 lg:order-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
            aria-label={playing ? 'Pause mechanism animation' : 'Play mechanism animation'}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
            aria-label="Restart mechanism animation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <span className="ml-1 text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">
            Step {step + 1} / {steps.length || 4}
          </span>
        </div>

        <ol className="mt-6 space-y-1">
          {steps.map((s, i) => {
            const active = i === step
            return (
              <li key={s.index || i}>
                <button
                  type="button"
                  onClick={() => {
                    setStep(i)
                    setPlaying(false)
                  }}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'group flex w-full gap-4 border-l py-3 pl-4 text-left transition-colors duration-300',
                    active
                      ? 'border-brand-teal bg-white/70'
                      : 'border-hairline hover:border-navy-900/30 hover:bg-white/40',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 text-[0.68rem] font-medium tabular-nums tracking-wider transition-colors',
                      active ? 'text-brand-cyan' : 'text-ink-muted/60',
                    )}
                  >
                    {s.index || String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1">
                    <span
                      className={cn(
                        'block text-[0.92rem] font-medium transition-colors',
                        active ? 'text-ink' : 'text-ink-soft',
                      )}
                    >
                      {s.title}
                    </span>
                    <AnimatePresence initial={false}>
                      {active ? (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="block overflow-hidden"
                        >
                          <span className="block pt-1.5 text-[0.83rem] leading-relaxed text-ink-muted">
                            {s.body}
                          </span>
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Illustration */}
      <div className="order-1 lg:order-2">
        <div className="relative overflow-hidden rounded-xl border border-hairline bg-gradient-to-br from-[#071a2e] to-[#0b2438]">
          <div className="absolute inset-0 grid-fine opacity-40" aria-hidden="true" />
          <svg
            viewBox="0 0 640 400"
            className="relative w-full"
            role="img"
            aria-label="Conceptual animation of Cas12a target recognition and collateral cleavage producing fluorescence"
          >
            <defs>
              <linearGradient id="mx-blob" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#12395a" />
                <stop offset="100%" stopColor="#0a1e34" />
              </linearGradient>
              <linearGradient id="mx-dna" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2b5878" />
                <stop offset="50%" stopColor="#24C6B1" />
                <stop offset="100%" stopColor="#2b5878" />
              </linearGradient>
              <filter id="mx-glow" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="3.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="mx-dots" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.7" fill="rgba(255,255,255,0.10)" />
              </pattern>
            </defs>

            <rect width="640" height="400" fill="url(#mx-dots)" />

            {/* Target DNA */}
            <g>
              <motion.path
                d="M40 300 C 120 288, 200 312, 280 300 S 440 288, 600 300"
                fill="none"
                stroke="url(#mx-dna)"
                strokeWidth="2"
                animate={{ opacity: docked ? 1 : 0.55 }}
                transition={{ duration: 0.8 }}
              />
              <motion.path
                d="M40 320 C 120 332, 200 308, 280 320 S 440 332, 600 320"
                fill="none"
                stroke="url(#mx-dna)"
                strokeWidth="2"
                animate={{ opacity: docked ? 1 : 0.55 }}
                transition={{ duration: 0.8 }}
              />
              {Array.from({ length: 19 }).map((_, i) => {
                const x = 56 + i * 29
                return (
                  <line
                    key={i}
                    x1={x}
                    y1="302"
                    x2={x + 2}
                    y2="318"
                    stroke={i >= 8 && i <= 11 ? '#24C6B1' : '#31597a'}
                    strokeWidth={i >= 8 && i <= 11 ? 2 : 1}
                    opacity={i >= 8 && i <= 11 ? 0.95 : 0.45}
                  />
                )
              })}
              <text x="40" y="352" fill="rgba(255,255,255,0.28)" fontSize="9" letterSpacing="2.2">
                TARGET DNA
              </text>
              <motion.rect
                x="288"
                y="286"
                width="120"
                height="50"
                rx="6"
                fill="none"
                stroke="#24C6B1"
                strokeWidth="1"
                strokeDasharray="4 4"
                animate={{ opacity: docked ? 0.75 : 0 }}
                transition={{ duration: 0.6 }}
              />
            </g>

            {/* Cas12a complex */}
            <motion.g
              animate={{ x: complexX, y: complexY, scale: complexScale }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <motion.g
                animate={
                  activated
                    ? { scale: [1, 1.05, 1], opacity: 1 }
                    : { scale: 1, opacity: 0.95 }
                }
                transition={
                  activated
                    ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.5 }
                }
              >
                <motion.path
                  d="M-52,-10 C-54,-44 -26,-60 2,-56 C32,-52 54,-30 50,0 C46,32 16,52 -12,46 C-40,40 -50,20 -52,-10 Z"
                  fill="url(#mx-blob)"
                  stroke={activated ? '#24C6B1' : '#2b5878'}
                  strokeWidth="1.4"
                  animate={{ strokeOpacity: activated ? 0.95 : 0.5 }}
                />
                {/* guide RNA */}
                <path
                  d="M-16,-18 q12,10 0,20 q-12,10 0,20 q12,10 2,16"
                  fill="none"
                  stroke="#7FC9E2"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <circle cx="-16" cy="-18" r="2.6" fill="#24C6B1" />
                <text x="0" y="72" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="9.5" letterSpacing="1.6">
                  Cas12a · guide RNA
                </text>
              </motion.g>
            </motion.g>

            {/* Reporters */}
            <g>
              <text x="404" y="52" fill="rgba(255,255,255,0.28)" fontSize="9" letterSpacing="2.2">
                REPORTER CONSTRUCTS
              </text>
              {[0, 1, 2, 3].map((i) => (
                <Reporter
                  key={i}
                  index={i}
                  x={412}
                  y={80 + i * 34}
                  delay={i * 0.16}
                  cleaved={activated}
                />
              ))}
            </g>

            {/* Signal bars */}
            <g>
              <motion.g animate={{ opacity: signalling ? 1 : 0 }} transition={{ duration: 0.7 }}>
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const h = [26, 44, 62, 78, 92, 108][i]
                  return (
                    <motion.rect
                      key={i}
                      x={432 + i * 18}
                      width="8"
                      rx="2"
                      fill={i > 3 ? '#24C6B1' : '#087EAA'}
                      initial={{ height: 0, y: 214 }}
                      animate={signalling ? { height: h, y: 214 - h } : { height: 0, y: 214 }}
                      transition={{ duration: 0.8, delay: 0.12 * i, ease: EASE }}
                      opacity={0.85}
                    />
                  )
                })}
                <line x1="424" y1="216" x2="548" y2="216" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                <text x="424" y="236" fill="rgba(255,255,255,0.3)" fontSize="9" letterSpacing="2">
                  FLUORESCENCE
                </text>
              </motion.g>
            </g>

            {/* Phase label */}
            <g>
              <text x="560" y="376" textAnchor="end" fill="rgba(255,255,255,0.22)" fontSize="8.5" letterSpacing="1.8">
                CONCEPTUAL ILLUSTRATION
              </text>
            </g>
          </svg>

          <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] px-4 py-3">
            <p className="text-[0.66rem] leading-tight text-white/35">{conceptNote}</p>
            <div className="flex gap-1.5" aria-hidden="true">
              {(steps.length ? steps : [0, 1, 2, 3]).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1 rounded-full transition-all duration-500',
                    i === step ? 'w-6 bg-brand-teal' : 'w-1.5 bg-white/20',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
