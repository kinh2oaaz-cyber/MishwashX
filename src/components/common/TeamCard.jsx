import { Link2 } from 'lucide-react'
import { Mark } from './Logo'
import { cn } from '../../lib/utils/cn'

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

/** Animated member profile card. Only rendered for real, supplied profiles. */
export function TeamCard({ member, index = 0 }) {
  const hasPhoto = Boolean(member.photoUrl)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-white transition-all duration-500 hover:border-brand-cyan/35 hover:shadow-[0_28px_60px_-38px_rgba(8,24,43,0.45)]">
      <div className="relative aspect-[4/3.4] overflow-hidden bg-navy-900">
        {hasPhoto ? (
          <img
            src={member.photoUrl}
            alt={member.name ? `Portrait of ${member.name}` : ''}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <div className="absolute inset-0 grid-fine opacity-30" aria-hidden="true" />
            <div className="absolute h-40 w-40 rounded-full glow-teal opacity-30 blur-2xl" aria-hidden="true" />
            <span className="relative font-display text-[2.6rem] font-light tracking-tight text-white/25">
              {initials(member.name) || <Mark size={40} className="text-white/30" />}
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-navy-950/60 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-white/60 backdrop-blur-sm">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="display-sm text-ink">{member.name}</h3>
        <p className="mt-1 text-[0.78rem] uppercase tracking-[0.14em] text-brand-cyan">{member.role}</p>

        {member.responsibilities ? (
          <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-soft">{member.responsibilities}</p>
        ) : null}

        {member.contribution ? (
          <div className="mt-4 border-t border-hairline pt-3">
            <p className="label text-ink-muted/60">Contribution</p>
            <p className="mt-1.5 text-[0.82rem] leading-relaxed text-ink-soft">{member.contribution}</p>
          </div>
        ) : null}

        {member.links?.length ? (
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
            {member.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[0.72rem] text-ink-muted transition-colors hover:text-brand-cyan"
              >
                <Link2 className="h-3 w-3" strokeWidth={1.8} />
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}

/** Compact member row used in previews. */
export function TeamRow({ member, className = '' }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-navy-900">
        {member.photoUrl ? (
          <img src={member.photoUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[0.7rem] font-medium text-white/50">
            {initials(member.name)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[0.86rem] font-medium text-ink">{member.name}</p>
        <p className="truncate text-[0.72rem] text-ink-muted">{member.role}</p>
      </div>
    </div>
  )
}
