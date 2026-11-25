import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/utils/cn'
import { Prose } from './Prose'

/** Accessible disclosure list used for FAQs and expandable research notes. */
export function Accordion({ items = [], className = '', dark = false }) {
  const [open, setOpen] = useState(0)
  const reduce = useReducedMotion()

  return (
    <div className={cn('divide-y', dark ? 'divide-white/10' : 'divide-hairline', className)}>
      {items.map((item, index) => {
        const isOpen = open === index
        const panelId = `acc-panel-${index}`
        const buttonId = `acc-button-${index}`
        return (
          <div key={item.q || index}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className={cn(
                  'flex w-full items-start justify-between gap-6 py-5 text-left transition-colors',
                  dark ? 'text-white hover:text-brand-teal-soft' : 'text-ink hover:text-brand-cyan',
                )}
              >
                <span className="display-sm max-w-2xl">{item.q}</span>
                <span
                  className={cn(
                    'mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-500',
                    dark ? 'border-white/20' : 'border-hairline',
                    isOpen && 'rotate-45',
                  )}
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pr-10">
                    <Prose html={item.a} dark={dark} className="max-w-2xl" />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
