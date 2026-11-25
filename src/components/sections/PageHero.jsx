import { motion, useReducedMotion } from 'framer-motion'
import { MolecularCanvas } from '../scientific/MolecularCanvas'
import { Reveal, TextReveal } from '../animations/Reveal'
import { ConceptNote } from '../common/Prose'
import { cn } from '../../lib/utils/cn'

/**
 * Inner-page hero. Every page opens on navy for a consistent cinematic entry.
 */
export function PageHero({
  eyebrow,
  heading,
  lead,
  note,
  aside,
  index,
  children,
  className = '',
}) {
  const reduce = useReducedMotion()

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-navy-950 pb-16 pt-[calc(68px+3.5rem)] text-white md:pb-24 md:pt-[calc(76px+5rem)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 grid-fine opacity-40 grid-mask" aria-hidden="true" />
      <MolecularCanvas
        className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
        maxParticles={54}
        linkDistance={170}
        speed={0.24}
      />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[32rem] w-[32rem] rounded-full glow-teal opacity-30 blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1.2 }}
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className={cn('grid gap-12', aside ? 'lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16' : '')}>
          <div>
            <Reveal y={10} duration={0.7}>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-brand-teal/60" />
                <span className="label text-brand-teal-soft">{eyebrow}</span>
                {index ? (
                  <span className="label ml-auto text-white/20 lg:ml-4">{index}</span>
                ) : null}
              </div>
            </Reveal>

            <TextReveal
              as="h1"
              text={heading}
              className="display-lg mt-7 max-w-3xl font-light text-white"
              delay={0.08}
            />

            {lead ? (
              <Reveal delay={0.18}>
                <p className="mt-7 max-w-2xl text-[1.02rem] leading-[1.72] text-white/60">{lead}</p>
              </Reveal>
            ) : null}

            {note ? (
              <Reveal delay={0.26}>
                <ConceptNote dark className="mt-6">
                  {note}
                </ConceptNote>
              </Reveal>
            ) : null}

            {children}
          </div>

          {aside ? <div className="relative">{aside}</div> : null}
        </div>
      </div>

      {!reduce ? (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950 to-transparent"
          aria-hidden="true"
        />
      ) : null}
    </section>
  )
}
