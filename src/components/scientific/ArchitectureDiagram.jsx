import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight, HelpCircle } from 'lucide-react'
import { cn } from '../../lib/utils/cn'
import { ConceptNote } from '../common/Prose'

/**
 * Interactive system architecture explorer.
 * Nodes are selectable; the detail panel explains function and open questions.
 */
export function ArchitectureDiagram({ components = [], note, className = '' }) {
  const [active, setActive] = useState(components[0]?.id || null)
  const reduce = useReducedMotion()
  const current = components.find((c) => c.id === active) || components[0]

  return (
    <div className={cn('', className)}>
      {/* Rail */}
      <div className="no-scrollbar -mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
        <div className="flex min-w-max items-center gap-1.5">
          {components.map((c, i) => {
            const isActive = c.id === current?.id
            return (
              <div key={c.id || i} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActive(c.id)}
                  aria-pressed={isActive}
                  className={cn(
                    'group relative flex min-w-[7.2rem] flex-col items-start gap-1 rounded-lg border px-3.5 py-3 text-left transition-all duration-400',
                    isActive
                      ? 'border-navy-900 bg-navy-900 text-white shadow-[0_18px_40px_-28px_rgba(8,24,43,0.9)]'
                      : 'border-hairline bg-white text-ink hover:border-brand-cyan/40 hover:shadow-[0_14px_34px_-30px_rgba(8,24,43,0.5)]',
                  )}
                >
                  <span
                    className={cn(
                      'text-[0.6rem] font-medium tabular-nums tracking-[0.16em]',
                      isActive ? 'text-brand-teal-soft' : 'text-ink-muted/60',
                    )}
                  >
                    {c.index}
                  </span>
                  <span className="text-[0.82rem] font-medium leading-tight">{c.short || c.title}</span>
                </button>
                {i < components.length - 1 ? (
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0 text-ink-muted/35"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail */}
      <div className="mt-6 overflow-hidden rounded-xl border border-hairline bg-white">
        <motion.div
          key={current?.id}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid md:grid-cols-[1.4fr_1fr]"
        >
          <div className="p-6 md:p-8">
            <span className="label text-brand-cyan">{current?.index}</span>
            <h3 className="display-sm mt-3 text-ink">{current?.title}</h3>
            <p className="mt-3 max-w-lg text-[0.92rem] leading-relaxed text-ink-soft">{current?.body}</p>
          </div>
          <div className="border-t border-hairline bg-[#fbfdff] p-6 md:border-l md:border-t-0 md:p-8">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-3.5 w-3.5 text-amber-600" strokeWidth={1.8} />
              <span className="label text-amber-700/80">Open question</span>
            </div>
            <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-soft">{current?.open}</p>
          </div>
        </motion.div>
      </div>

      {note ? (
        <ConceptNote className="mt-4" variant="info">
          {note}
        </ConceptNote>
      ) : null}
    </div>
  )
}
