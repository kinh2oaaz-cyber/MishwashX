import { cn } from '../../lib/utils/cn'

const STATUS = {
  planned: { label: 'Planned', dot: 'bg-[#8aa0b4]', cls: 'border-[#cdd9e4] text-[#54687b] bg-white' },
  'in-progress': {
    label: 'In progress',
    dot: 'bg-brand-cyan',
    cls: 'border-brand-cyan/30 text-brand-cyan bg-brand-cyan/[0.06]',
    pulse: true,
  },
  completed: {
    label: 'Completed',
    dot: 'bg-brand-teal',
    cls: 'border-brand-teal/40 text-[#0c7c6f] bg-brand-teal/10',
  },
  validated: { label: 'Validated', dot: 'bg-white', cls: 'border-navy-900 text-white bg-navy-900' },
  proposed: { label: 'Proposed', dot: 'bg-[#8aa0b4]', cls: 'border-[#cdd9e4] text-[#54687b] bg-white' },
  'in-development': {
    label: 'In development',
    dot: 'bg-brand-cyan',
    cls: 'border-brand-cyan/30 text-brand-cyan bg-brand-cyan/[0.06]',
    pulse: true,
  },
  demonstrated: {
    label: 'Demonstrated',
    dot: 'bg-brand-teal',
    cls: 'border-brand-teal/40 text-[#0c7c6f] bg-brand-teal/10',
  },
  active: { label: 'Current', dot: 'bg-brand-teal', cls: 'border-brand-teal/40 text-[#0c7c6f] bg-brand-teal/10', pulse: true },
  next: { label: 'Next', dot: 'bg-brand-cyan', cls: 'border-brand-cyan/30 text-brand-cyan bg-brand-cyan/[0.06]' },
  future: { label: 'Future', dot: 'bg-[#8aa0b4]', cls: 'border-[#cdd9e4] text-[#54687b] bg-white' },
}

export function StatusBadge({ status = 'planned', label, className = '', dark = false }) {
  const config = STATUS[status] || STATUS.planned
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em]',
        dark ? 'border-white/20 bg-white/5 text-white/80' : config.cls,
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {config.pulse ? (
          <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-70', config.dot)} style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
        ) : null}
        <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', dark ? 'bg-brand-teal' : config.dot)} />
      </span>
      {label || config.label}
    </span>
  )
}
