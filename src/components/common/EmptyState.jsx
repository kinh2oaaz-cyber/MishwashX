import { cn } from '../../lib/utils/cn'
import { CircleDashed } from 'lucide-react'

/** Designed empty state. Used wherever real content has not been supplied. */
export function EmptyState({
  icon: Icon = CircleDashed,
  title,
  body,
  action,
  className = '',
  dark = false,
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-dashed p-8 md:p-12',
        dark ? 'border-white/15 bg-white/[0.02]' : 'border-[#c8d6e3] bg-white/60',
        className,
      )}
    >
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border',
            dark ? 'border-white/15 text-brand-teal-soft' : 'border-hairline text-brand-cyan',
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className={cn('display-sm', dark ? 'text-white' : 'text-ink')}>{title}</h3>
          <p className={cn('mt-2 max-w-xl text-[0.9rem] leading-relaxed', dark ? 'text-white/55' : 'text-ink-muted')}>
            {body}
          </p>
        </div>
        {action ? (
          <a
            href={action.to}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[0.8rem] font-medium transition-colors',
              dark
                ? 'border-white/20 text-white hover:bg-white/10'
                : 'border-navy-900/15 text-ink hover:bg-navy-900/5',
            )}
          >
            {action.label}
          </a>
        ) : null}
      </div>
    </div>
  )
}
