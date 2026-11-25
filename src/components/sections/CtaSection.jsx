import { Reveal, TextReveal } from '../animations/Reveal'
import { Button } from '../common/Button'
import { MolecularCanvas } from '../scientific/MolecularCanvas'
import { BrandMark } from '../common/Logo'
import { useContent } from '../../content/ContentProvider'

/** Reusable closing call-to-action band. */
export function CtaSection({ data = {}, index = '07' }) {
  const { label, heading, body, primaryCta, secondaryCta } = data
  const { settings } = useContent()
  if (!heading) return null

  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-fine opacity-30" aria-hidden="true" />
      <MolecularCanvas
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        maxParticles={44}
        linkDistance={190}
        speed={0.22}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full glow-cyan opacity-40 blur-3xl"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal y={12} duration={0.7}>
            <div className="flex items-center justify-center gap-3 label text-brand-teal-soft">
              <span className="h-px w-7 bg-brand-teal/50" />
              {label || 'Next'}
              <span className="h-px w-7 bg-brand-teal/50" />
            </div>
          </Reveal>

          <TextReveal
            text={heading}
            className="display-lg mt-7 font-light text-white"
            delay={0.05}
          />

          {body ? (
            <Reveal delay={0.15}>
              <p className="mx-auto mt-7 max-w-2xl text-[1rem] leading-relaxed text-white/55">{body}</p>
            </Reveal>
          ) : null}

          <Reveal delay={0.25}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {primaryCta?.label ? (
                <Button to={primaryCta.to || '/resources#contact'} variant="teal" size="lg">
                  {primaryCta.label}
                </Button>
              ) : null}
              {secondaryCta?.label ? (
                <Button to={secondaryCta.to || '/research'} variant="ghostDark" size="lg" icon={false}>
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          </Reveal>
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-white/[0.08] pt-6">
          <BrandMark brand={settings?.brand} size={26} />
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/25">
            {settings?.brand?.name || 'Mishawash X'} · {index}
          </p>
        </div>
      </div>
    </section>
  )
}
