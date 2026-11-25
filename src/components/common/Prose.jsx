import { useMemo } from 'react'
import { FlaskConical, Info } from 'lucide-react'
import { safeRichText } from '../../lib/utils/sanitize'
import { cn } from '../../lib/utils/cn'

/** Renders admin-authored rich text after sanitisation. */
export function Prose({ html, className = '', dark = false }) {
  const clean = useMemo(() => safeRichText(html || ''), [html])
  if (!clean) return null
  return (
    <div
      className={cn('prose-mx', dark && 'prose-mx-dark', className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}

/**
 * Mandatory disclosure for scientific visuals.
 * Every diagram on this site that is not a photograph of real evidence carries
 * one of these labels.
 */
export function ConceptNote({ children, className = '', dark = false, variant = 'concept' }) {
  const Icon = variant === 'concept' ? FlaskConical : Info
  return (
    <p
      className={cn(
        'inline-flex items-start gap-2 text-[0.72rem] leading-relaxed tracking-wide',
        dark ? 'text-white/45' : 'text-ink-muted',
        className,
      )}
    >
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

/** Small technical badge. */
export function Tag({ children, tone = 'neutral', className = '' }) {
  const tones = {
    neutral: 'bg-navy-900/[0.05] text-ink-soft border-navy-900/10',
    cyan: 'bg-brand-cyan/8 text-brand-cyan border-brand-cyan/25',
    teal: 'bg-brand-teal/12 text-[#0d7d70] border-brand-teal/35',
    amber: 'bg-amber-500/10 text-amber-800 border-amber-600/25',
    slate: 'bg-white/6 text-white/70 border-white/15',
    dark: 'bg-navy-900 text-white border-navy-900',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em]',
        tones[tone] || tones.neutral,
        className,
      )}
    >
      {children}
    </span>
  )
}
