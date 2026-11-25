import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import { cn } from '../../../lib/utils/cn'
import { useScrollLock, useEscapeKey } from '../../../hooks/useOverlay'

/* ------------------------------- containers ------------------------------- */

export function AdminCard({ title, description, actions, children, className = '', padded = true }) {
  return (
    <section className={cn('rounded-xl border border-[#e2e9f0] bg-white shadow-[0_1px_2px_rgba(8,24,43,0.03)]', className)}>
      {title || actions ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eef2f6] px-5 py-4">
          <div>
            {title ? <h2 className="text-[0.92rem] font-semibold tracking-tight text-ink">{title}</h2> : null}
            {description ? (
              <p className="mt-0.5 text-[0.75rem] leading-relaxed text-ink-muted">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </section>
  )
}

export function PageHead({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-cyan">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 font-display text-[1.55rem] font-medium tracking-[-0.03em] text-ink">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[0.82rem] leading-relaxed text-ink-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/* --------------------------------- stats ---------------------------------- */

export function StatCard({ label, value, icon: Icon, hint, accent = 'cyan', onClick }) {
  const tones = {
    cyan: 'text-brand-cyan bg-brand-cyan/[0.07] border-brand-cyan/15',
    teal: 'text-[#0c7c6f] bg-brand-teal/[0.09] border-brand-teal/20',
    navy: 'text-navy-900 bg-navy-900/[0.05] border-navy-900/10',
    amber: 'text-amber-700 bg-amber-500/[0.08] border-amber-500/20',
  }
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'flex flex-col items-start rounded-xl border border-[#e2e9f0] bg-white p-4 text-left shadow-[0_1px_2px_rgba(8,24,43,0.03)] transition-all',
        onClick && 'hover:border-[#c8d8e6] hover:shadow-[0_8px_24px_-16px_rgba(8,24,43,0.25)]',
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <span className="text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-ink-muted/80">
          {label}
        </span>
        {Icon ? (
          <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg border', tones[accent])}>
            <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
          </span>
        ) : null}
      </div>
      <span className="mt-3 font-display text-[1.8rem] font-light leading-none tracking-[-0.04em] text-ink tabular-nums">
        {value}
      </span>
      {hint ? <span className="mt-1.5 text-[0.68rem] text-ink-muted/80">{hint}</span> : null}
    </Tag>
  )
}

/* -------------------------------- controls -------------------------------- */

const BTN = {
  primary: 'bg-navy-900 text-white border-navy-900 hover:bg-navy-800',
  teal: 'bg-brand-teal text-[#04241f] border-brand-teal hover:bg-[#35d8c3]',
  ghost: 'bg-white text-ink border-[#d5e0ea] hover:border-[#b9cbdb] hover:bg-[#fafcfe]',
  danger: 'bg-white text-red-600 border-red-200 hover:bg-red-50',
  quiet: 'bg-transparent text-ink-soft border-transparent hover:bg-navy-900/5',
}

export function AdminButton({
  children,
  variant = 'ghost',
  size = 'md',
  icon: Icon,
  className = '',
  loading = false,
  ...props
}) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg border font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-2.5 py-1.5 text-[0.72rem]' : 'px-3.5 py-2 text-[0.78rem]',
        BTN[variant],
        className,
      )}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
      ) : Icon ? (
        <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
      ) : null}
      {children}
    </button>
  )
}

export function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-5 w-9 shrink-0 rounded-full border transition-colors',
          checked ? 'border-brand-teal bg-brand-teal' : 'border-[#cfdce8] bg-[#e8eef4]',
        )}
      >
        <span
          className={cn(
            'absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-all',
            checked ? 'left-[19px]' : 'left-[2px]',
          )}
        />
      </button>
      <span>
        <span className="block text-[0.8rem] font-medium text-ink">{label}</span>
        {hint ? <span className="mt-0.5 block text-[0.7rem] leading-relaxed text-ink-muted">{hint}</span> : null}
      </span>
    </label>
  )
}

export function StatusPill({ tone = 'neutral', children }) {
  const tones = {
    neutral: 'bg-[#f1f5f9] text-[#54687b] border-[#dfe7ef]',
    green: 'bg-brand-teal/10 text-[#0c7c6f] border-brand-teal/25',
    cyan: 'bg-brand-cyan/[0.07] text-brand-cyan border-brand-cyan/25',
    amber: 'bg-amber-500/10 text-amber-800 border-amber-500/25',
    red: 'bg-red-50 text-red-700 border-red-200',
    navy: 'bg-navy-900 text-white border-navy-900',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.1em]',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}

/* --------------------------------- alerts --------------------------------- */

export function Alert({ tone = 'info', title, children, action, className = '' }) {
  const tones = {
    info: 'border-brand-cyan/25 bg-brand-cyan/[0.05] text-[#075b7c]',
    warning: 'border-amber-500/30 bg-amber-500/[0.07] text-amber-900',
    error: 'border-red-200 bg-red-50 text-red-800',
    success: 'border-brand-teal/30 bg-brand-teal/[0.07] text-[#0c6d62]',
  }
  return (
    <div className={cn('flex flex-wrap items-start gap-3 rounded-lg border px-4 py-3', tones[tone], className)}>
      <div className="min-w-0 flex-1">
        {title ? <p className="text-[0.8rem] font-semibold">{title}</p> : null}
        <div className="text-[0.76rem] leading-relaxed opacity-90">{children}</div>
      </div>
      {action}
    </div>
  )
}

/* --------------------------------- modal ---------------------------------- */

export function Modal({ open, onClose, title, description, children, footer, wide = false }) {
  useScrollLock(open)
  useEscapeKey(onClose, open)

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[160] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl',
              wide ? 'sm:max-w-4xl' : 'sm:max-w-xl',
            )}
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#eef2f6] px-5 py-4">
              <div>
                <h2 className="text-[0.95rem] font-semibold tracking-tight text-ink">{title}</h2>
                {description ? <p className="mt-0.5 text-[0.75rem] text-ink-muted">{description}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-[#f1f5f9] hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer ? (
              <footer className="flex items-center justify-end gap-2 border-t border-[#eef2f6] bg-[#fafcfe] px-5 py-3.5">
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

/* --------------------------------- misc ----------------------------------- */

export function ModeBadge({ mode }) {
  return mode === 'supabase' ? (
    <StatusPill tone="green">
      <span className="h-1 w-1 rounded-full bg-brand-teal" />
      Supabase
    </StatusPill>
  ) : (
    <StatusPill tone="amber">
      <span className="h-1 w-1 rounded-full bg-amber-500" />
      Local Studio
    </StatusPill>
  )
}

export function SavingIndicator({ saving }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[0.7rem] transition-opacity duration-300',
        saving ? 'text-brand-cyan opacity-100' : 'text-ink-muted/50 opacity-0',
      )}
      aria-live="polite"
    >
      <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
      Saving
    </span>
  )
}

export function TableEmpty({ colSpan, children }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-[0.8rem] text-ink-muted">
        {children}
      </td>
    </tr>
  )
}
