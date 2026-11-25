import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils/cn'
import { StatusBadge } from '../common/StatusBadge'
import { ConceptNote } from '../common/Prose'

/**
 * Interactive seven-stage diagnostic workflow.
 * Status labels come from content and must reflect evidence, not ambition.
 */
export function WorkflowRail({ steps = [], disclaimer, className = '' }) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const step = steps[active] || steps[0] || {}
  const count = steps.length || 1
  const progress = count > 1 ? (active / (count - 1)) * 100 : 0

  return (
    <div className={cn('', className)}>
      {/* Rail */}
      <div className="relative">
        <div className="absolute inset-x-0 top-[19px] h-px bg-hairline" aria-hidden="true" />
        <motion.div
          className="absolute left-0 top-[19px] h-px bg-gradient-to-r from-brand-cyan to-brand-teal"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        />

        <ol
          className="relative grid gap-1"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
          aria-label="Diagnostic workflow stages"
        >
          {steps.map((s, i) => {
            const isActive = i === active
            const isPast = i < active
            return (
              <li key={s.index || i} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive ? 'step' : undefined}
                  className={cn(
                    'relative flex h-10 w-10 items-center justify-center rounded-full border text-[0.7rem] font-medium tabular-nums transition-all duration-500',
                    isActive
                      ? 'border-brand-teal bg-navy-900 text-white shadow-[0_0_0_5px_rgba(36,198,177,0.12)]'
                      : isPast
                        ? 'border-brand-cyan/40 bg-white text-brand-cyan'
                        : 'border-hairline bg-white text-ink-muted hover:border-navy-900/25',
                  )}
                  aria-label={`Stage ${i + 1}: ${s.title}`}
                >
                  {s.index || String(i + 1).padStart(2, '0')}
                </button>
                <span
                  className={cn(
                    'mt-3 hidden max-w-[7.5rem] text-center text-[0.66rem] leading-tight tracking-tight transition-colors sm:block',
                    isActive ? 'text-ink' : 'text-ink-muted/70',
                  )}
                >
                  {s.title}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Detail */}
      <div className="mt-8 overflow-hidden rounded-xl border border-hairline bg-white">
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-start md:gap-10 md:p-8"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="label text-brand-cyan">{step.index || String(active + 1).padStart(2, '0')}</span>
              <StatusBadge status={step.status} />
            </div>
            <h3 className="display-sm mt-4 text-ink">{step.title}</h3>
            <p className="mt-3 max-w-xl text-[0.92rem] leading-relaxed text-ink-soft">{step.body}</p>
          </div>

          <div className="flex items-center gap-2 md:flex-col md:items-end">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActive((a) => Math.max(0, a - 1))}
                disabled={active === 0}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-navy-900/30 disabled:opacity-30"
                aria-label="Previous stage"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActive((a) => Math.min(count - 1, a + 1))}
                disabled={active === count - 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-navy-900/30 disabled:opacity-30"
                aria-label="Next stage"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="numeral text-[0.72rem] tabular-nums text-ink-muted md:mt-3">
              {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      </div>

      {disclaimer ? (
        <ConceptNote className="mt-4" variant="info">
          {disclaimer}
        </ConceptNote>
      ) : null}
    </div>
  )
}
