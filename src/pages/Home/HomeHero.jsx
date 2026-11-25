import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Info } from 'lucide-react'
import { HelixCanvas } from '../../components/scientific/HelixCanvas'
import { MolecularCanvas } from '../../components/scientific/MolecularCanvas'
import { Button } from '../../components/common/Button'
import { Enter } from '../../components/animations/Reveal'
import { useContent } from '../../content/ContentProvider'

const EASE = [0.16, 1, 0.3, 1]

export function HomeHero() {
  const { content, settings } = useContent()
  const hero = content('home', 'hero', { titleLines: [] })
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const lines = hero.titleLines?.length ? hero.titleLines.map((l) => l.value || l) : []

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-navy-950 pb-10 pt-[calc(68px+4rem)] text-white md:pb-16 md:pt-[calc(76px+6rem)]"
    >
      {/* Atmosphere */}
      <motion.div className="pointer-events-none absolute inset-0" style={reduce ? undefined : { y: bgY }}>
        <div className="absolute inset-0 grid-fine opacity-[0.5] grid-mask" />
        <div className="absolute -left-40 top-0 h-[44rem] w-[44rem] rounded-full glow-cyan opacity-40 blur-3xl" />
        <div className="absolute -right-20 top-1/4 h-[34rem] w-[34rem] rounded-full glow-teal opacity-25 blur-3xl" />
        <MolecularCanvas
          className="absolute inset-0 h-full w-full opacity-60"
          maxParticles={80}
          linkDistance={165}
          speed={0.3}
        />
      </motion.div>

      <div className="shell relative">
        <motion.div
          style={reduce ? undefined : { y: contentY }}
          className="grid items-center gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-10"
        >
          {/* Copy */}
          <div className="relative z-10">
            <Enter delay={0.05}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-teal opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-teal" />
                  </span>
                  {hero.eyebrow}
                </span>
              </div>
            </Enter>

            <h1 className="display-xl mt-8 font-light">
              {lines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={reduce ? { opacity: 0 } : { y: '108%' }}
                    animate={reduce ? { opacity: 1 } : { y: '0%' }}
                    transition={{ duration: 1.15, delay: 0.14 + i * 0.11, ease: EASE }}
                  >
                    {i === lines.length - 1 ? (
                      <span className="text-gradient">{line}</span>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <Enter delay={0.5}>
              <p className="mt-8 max-w-xl text-[1.02rem] leading-[1.72] text-white/60 md:text-[1.06rem]">
                {hero.lead}
              </p>
            </Enter>

            <Enter delay={0.62}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {hero.primaryCta?.label ? (
                  <Button to={hero.primaryCta.to} variant="teal" size="lg">
                    {hero.primaryCta.label}
                  </Button>
                ) : null}
                {hero.secondaryCta?.label ? (
                  <Button to={hero.secondaryCta.to} variant="ghostDark" size="lg" icon={false}>
                    {hero.secondaryCta.label}
                  </Button>
                ) : null}
              </div>
            </Enter>

            {hero.statusNote ? (
              <Enter delay={0.74}>
                <div className="mt-9 flex max-w-lg items-start gap-3 rounded-lg border border-white/[0.09] bg-white/[0.025] px-4 py-3">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal-soft/80" strokeWidth={1.8} />
                  <p className="text-[0.72rem] leading-relaxed text-white/45">{hero.statusNote}</p>
                </div>
              </Enter>
            ) : null}
          </div>

          {/* 3D helix panel */}
          <div className="relative">
            <Enter delay={0.3} y={30}>
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.055] to-transparent">
                {/* corner ticks */}
                {[
                  'left-3 top-3 border-l border-t',
                  'right-3 top-3 border-r border-t',
                  'left-3 bottom-3 border-b border-l',
                  'right-3 bottom-3 border-b border-r',
                ].map((pos) => (
                  <span
                    key={pos}
                    className={`pointer-events-none absolute h-3 w-3 border-white/25 ${pos}`}
                    aria-hidden="true"
                  />
                ))}

                <div className="flex items-center justify-between px-5 pt-5">
                  <span className="text-[0.6rem] uppercase tracking-[0.22em] text-white/35">
                    Fig. 01 — dsDNA
                  </span>
                  <span className="text-[0.6rem] uppercase tracking-[0.22em] text-brand-teal-soft/70">
                    Structural model
                  </span>
                </div>

                <div className="relative h-[320px] md:h-[420px] lg:h-[460px]">
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-64 w-64 rounded-full glow-teal opacity-40 blur-3xl" />
                  </div>
                  <HelixCanvas height="100%" />
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3">
                  <span className="text-[0.6rem] uppercase tracking-[0.18em] text-white/25">
                    Conceptual · not to scale
                  </span>
                  <span className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-white/25">
                    <span className="h-1 w-1 rounded-full bg-brand-teal/70" />
                    Live render
                  </span>
                </div>
              </div>
            </Enter>

            {/* floating label */}
            <Enter delay={0.85}>
              <div className="absolute -bottom-5 -left-3 hidden rounded-lg border border-white/10 bg-navy-900/90 px-4 py-3 backdrop-blur-md md:block">
                <p className="text-[0.58rem] uppercase tracking-[0.2em] text-white/30">Platform</p>
                <p className="mt-1 text-[0.8rem] font-medium text-white/85">Protirodh BioKit</p>
              </div>
            </Enter>
          </div>
        </motion.div>

        {/* Markers */}
        <motion.div style={reduce ? undefined : { opacity: fade }} className="relative mt-16 md:mt-24">
          <div className="hairline-dark grid gap-6 pt-6 sm:grid-cols-3">
            {(hero.markers || []).map((m, i) => (
              <Enter key={m.label || i} delay={0.9 + i * 0.08}>
                <div className="flex items-baseline gap-3">
                  <span className="numeral text-[1.05rem] font-medium text-white/85">{m.value}</span>
                  <span className="text-[0.72rem] leading-tight text-white/35">{m.label}</span>
                </div>
              </Enter>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/25">
              {hero.markersNote}
            </p>
            <div className="hidden items-center gap-2 text-white/25 sm:flex">
              <span className="text-[0.6rem] uppercase tracking-[0.2em]">Scroll</span>
              <motion.span
                animate={reduce ? {} : { y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} />
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
