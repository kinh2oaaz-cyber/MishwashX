import { cn } from '../../lib/utils/cn'
import { Reveal, TextReveal } from '../animations/Reveal'

/**
 * Editorial section header: technical label, large heading, optional lead.
 * Used across every public page for a consistent rhythm.
 */
export function SectionHeading({
  label,
  heading,
  body,
  align = 'left',
  dark = false,
  size = 'lg',
  className = '',
  headingClassName = '',
  children,
  animate = true,
}) {
  const HeadingTag = size === 'sm' ? 'h3' : 'h2'
  const headingClass = cn(
    size === 'lg' ? 'display-lg' : 'display-md',
    dark ? 'text-white' : 'text-ink',
    headingClassName,
  )

  return (
    <div className={cn(align === 'center' && 'text-center flex flex-col items-center', className)}>
      {label ? (
        <Reveal y={12} duration={0.7}>
          <div
            className={cn(
              'flex items-center gap-3 label',
              dark ? 'text-brand-teal-soft' : 'text-brand-cyan',
            )}
          >
            <span className={cn('h-px w-7', dark ? 'bg-brand-teal/60' : 'bg-brand-cyan/50')} />
            <span>{label}</span>
          </div>
        </Reveal>
      ) : null}

      {heading ? (
        animate ? (
          <TextReveal
            as={HeadingTag}
            text={heading}
            delay={0.05}
            className={cn('mt-5 max-w-4xl', headingClass)}
          />
        ) : (
          <HeadingTag className={cn('mt-5 max-w-4xl', headingClass)}>{heading}</HeadingTag>
        )
      ) : null}

      {body ? (
        <Reveal delay={0.12}>
          <p
            className={cn(
              'mt-6 max-w-2xl',
              dark ? 'text-white/65' : 'text-ink-soft',
              'text-[1.02rem] leading-[1.72]',
            )}
          >
            {body}
          </p>
        </Reveal>
      ) : null}

      {children}
    </div>
  )
}
