import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../../lib/utils/cn'
import { useMagnetic } from '../../hooks/useMagnetic'

const VARIANTS = {
  primary: 'btn btn-primary',
  teal: 'btn btn-teal',
  ghost: 'btn btn-ghost',
  ghostDark: 'btn btn-ghost-dark',
  quiet: 'btn bg-white/0 text-ink hover:bg-navy-900/5',
}

const SIZES = {
  sm: 'text-[0.8rem] px-4 py-2.5',
  md: '',
  lg: 'text-[0.95rem] px-7 py-4',
}

/**
 * Primary action element. Renders a router link, an external anchor or a
 * button depending on the target. Supports magnetic hover on desktop.
 */
export function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon = true,
  magnetic = true,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ariaLabel,
  ...rest
}) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic({ disabled: !magnetic || disabled })

  const classes = cn(VARIANTS[variant] || VARIANTS.primary, SIZES[size], disabled && 'opacity-50 pointer-events-none', className)

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {icon ? (
        <ArrowUpRight
          className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      ) : null}
    </>
  )

  const common = {
    className: cn('group', classes),
    onMouseMove,
    onMouseLeave,
    'aria-label': ariaLabel,
    ...rest,
  }

  let element
  if (to) {
    const isExternal = /^https?:\/\//i.test(to) || to.startsWith('mailto:')
    element = isExternal ? (
      <a href={to} target="_blank" rel="noopener noreferrer" {...common}>
        {inner}
      </a>
    ) : (
      <Link to={to} {...common}>
        {inner}
      </Link>
    )
  } else if (href) {
    element = (
      <a href={href} target="_blank" rel="noopener noreferrer" {...common}>
        {inner}
      </a>
    )
  } else {
    element = (
      <button type={type} onClick={onClick} disabled={disabled} {...common}>
        {inner}
      </button>
    )
  }

  if (!magnetic) return element

  return (
    <span ref={ref} className="inline-block will-change-transform">
      {element}
    </span>
  )
}

/** Text link with an animated underline and optional arrow. */
export function TextLink({ to, href, children, className = '', dark = false, arrow = true }) {
  const cls = cn(
    'link-underline group text-[0.9rem] font-medium',
    dark ? 'text-white/80 hover:text-white' : 'text-ink hover:text-brand-cyan',
    className,
  )
  const content = (
    <>
      {children}
      {arrow ? (
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.8}
        />
      ) : null}
    </>
  )

  if (href || /^https?:\/\//i.test(to || '')) {
    return (
      <a href={href || to} target="_blank" rel="noopener noreferrer" className={cls}>
        {content}
      </a>
    )
  }
  return (
    <Link to={to} className={cls}>
      {content}
    </Link>
  )
}
