import { cn } from '../../lib/utils/cn'
import { assetUrl } from '../../lib/utils/assets'

/** Mishawash X monogram — two crossing molecular strands forming an X. */
export function Mark({ className = '', size = 38 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id="mx-strand-a" x1="11" y1="11" x2="29" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#24C6B1" />
          <stop offset="1" stopColor="#087EAA" />
        </linearGradient>
        <linearGradient id="mx-strand-b" x1="29" y1="11" x2="11" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#087EAA" />
          <stop offset="1" stopColor="#24C6B1" />
        </linearGradient>
      </defs>
      <rect x="0.6" y="0.6" width="38.8" height="38.8" rx="11.4" stroke="currentColor" strokeOpacity="0.22" />
      <path
        d="M11 11C17 15 23 25 29 29"
        stroke="url(#mx-strand-a)"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M29 11C23 15 17 25 11 29"
        stroke="url(#mx-strand-b)"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx="11" cy="11" r="2.3" fill="#24C6B1" />
      <circle cx="29" cy="29" r="2.3" fill="#24C6B1" />
      <circle cx="29" cy="11" r="1.7" fill="#087EAA" />
      <circle cx="11" cy="29" r="1.7" fill="#087EAA" />
    </svg>
  )
}

/**
 * The project's actual logo asset, with the vector monogram as a fallback.
 * Use this wherever a brand mark is shown so the supplied logo appears
 * consistently across the public site and the content studio.
 */
export function BrandMark({ brand, size = 38, className = '' }) {
  const src = assetUrl(brand?.logoUrl || '/images/logo/mishawash-x-logo.jpg')
  return (
    <img
      src={src}
      alt="Mishawash X logo"
      width={size}
      height={size}
      className={cn('shrink-0 rounded-xl object-contain', className)}
    />
  )
}

export function Logo({ brand, compact = false, className = '' }) {
  const name = brand?.name || 'Mishawash X'
  const parts = name.split(' ')
  const last = parts.length > 1 ? parts.pop() : ''
  const first = parts.join(' ')

  return (
    <span className={cn('flex items-center gap-3', className)}>
      <BrandMark brand={brand} size={38} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.02rem] font-medium tracking-[-0.02em]">
          {first}
          {last ? (
            <>
              {' '}
              <span className="text-brand-teal-soft">{last}</span>
            </>
          ) : null}
        </span>
        {!compact ? (
          <span className="mt-[6px] text-[0.52rem] font-medium uppercase tracking-[0.26em] opacity-50">
            Protirodh BioKit
          </span>
        ) : null}
      </span>
    </span>
  )
}
