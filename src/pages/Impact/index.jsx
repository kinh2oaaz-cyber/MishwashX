import { ArrowRight, Handshake, ShieldCheck } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { PageHero } from '../../components/sections/PageHero'
import { CtaSection } from '../../components/sections/CtaSection'
import { RecognitionGallery } from '../../components/sections/RecognitionGallery'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../../components/animations/Reveal'
import { ConceptNote, Tag } from '../../components/common/Prose'
import { StatusBadge } from '../../components/common/StatusBadge'
import { TextLink } from '../../components/common/Button'
import { usePageMeta } from '../../hooks/usePageMeta'
import { cn } from '../../lib/utils/cn'

/* -------------------------------- impact ---------------------------------- */

function PotentialSection({ data }) {
  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="shell">
        <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-3xl" />

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2">
          {(data.areas || []).map((area) => (
            <RevealItem key={area.index} className="h-full">
              <article className="flex h-full flex-col rounded-xl border border-hairline bg-white p-7 transition-colors hover:border-brand-cyan/30 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="label text-brand-cyan/60">{area.index}</span>
                  <Tag tone="teal">Potential</Tag>
                </div>
                <h3 className="display-sm mt-4 text-ink">{area.title}</h3>
                <p className="mt-2.5 flex-1 text-[0.88rem] leading-relaxed text-ink-soft">{area.body}</p>
                <div className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] px-3.5 py-2.5">
                  <p className="text-[0.6rem] uppercase tracking-[0.14em] text-amber-800/70">Condition</p>
                  <p className="mt-1 text-[0.78rem] leading-relaxed text-ink-soft">{area.assumption}</p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {data.disclaimer ? (
          <Reveal delay={0.1}>
            <ConceptNote className="mt-8">{data.disclaimer}</ConceptNote>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

/* -------------------------------- access ---------------------------------- */

function AccessSection({ data }) {
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-navy-950 py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-fine opacity-25" aria-hidden="true" />
      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <SectionHeading label={data.label} heading={data.heading} dark className="max-w-2xl" />
          <Reveal delay={0.15}>
            <p className="text-[0.95rem] leading-relaxed text-white/55 lg:pb-2">{data.body}</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.09] sm:grid-cols-2 lg:grid-cols-4">
          {(data.metrics || []).map((metric, i) => (
            <RevealItem key={metric.label} className="bg-navy-950 p-7">
              <span className="numeral text-[0.62rem] tabular-nums text-white/25">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-4 text-[0.6rem] uppercase tracking-[0.16em] text-white/35">{metric.label}</p>
              <p className="display-sm mt-2 text-white">{metric.target}</p>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-white/40">{metric.note}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-5 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.16em] text-amber-200/60">
            <span className="h-1 w-1 rounded-full bg-amber-400" />
            {data.caveat}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------- roadmap --------------------------------- */

function RoadmapSection({ data }) {
  return (
    <section className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell">
        <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-3xl" />

        <div className="mt-16">
          <div className="relative">
            <div className="absolute left-0 right-0 top-[13px] hidden h-px bg-hairline lg:block" aria-hidden="true" />
            <RevealGroup className="grid gap-10 lg:grid-cols-4 lg:gap-6">
              {(data.phases || []).map((phase) => (
                <RevealItem key={phase.phase} className="relative">
                  <div className="flex items-center gap-3 lg:block">
                    <span
                      className={cn(
                        'relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white',
                        phase.status === 'active'
                          ? 'border-brand-teal'
                          : phase.status === 'next'
                            ? 'border-brand-cyan'
                            : 'border-[#c3d1de]',
                      )}
                    >
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          phase.status === 'active'
                            ? 'bg-brand-teal'
                            : phase.status === 'next'
                              ? 'bg-brand-cyan'
                              : 'bg-[#c3d1de]',
                        )}
                      />
                    </span>
                    <span className="text-[0.65rem] uppercase tracking-[0.16em] text-ink-muted lg:mt-5 lg:block">
                      {phase.phase}
                    </span>
                    <span className="lg:hidden">
                      <StatusBadge status={phase.status} />
                    </span>
                  </div>

                  <div className="mt-3 border-t border-hairline pt-4 lg:mt-0">
                    <div className="hidden lg:block">
                      <StatusBadge status={phase.status} />
                    </div>
                    <h3 className="display-sm mt-3 text-ink">{phase.title}</h3>
                    <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted/60">
                      {phase.period}
                    </p>
                    <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-soft">{phase.body}</p>
                    <p className="mt-4 flex items-start gap-2 text-[0.73rem] leading-relaxed text-ink-muted">
                      <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-brand-cyan" strokeWidth={2} />
                      {phase.gate}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>

        {data.disclaimer ? (
          <Reveal delay={0.1}>
            <ConceptNote className="mt-12">{data.disclaimer}</ConceptNote>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

/* ------------------------------ partnerships ------------------------------- */

function PartnershipsSection({ data }) {
  return (
    <section className="border-t border-hairline bg-mist py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <SectionHeading label={data.label} heading={data.heading} body={data.body} />
          <Reveal delay={0.15}>
            <div className="mt-8 flex items-center gap-3 rounded-lg border border-dashed border-[#c8d6e3] bg-white/60 px-4 py-3">
              <Handshake className="h-4 w-4 shrink-0 text-ink-muted/50" strokeWidth={1.6} />
              <p className="text-[0.8rem] text-ink-muted">{data.emptyNote}</p>
            </div>
          </Reveal>
          {data.cta?.label ? (
            <Reveal delay={0.2}>
              <div className="mt-6">
                <TextLink to={data.cta.to}>{data.cta.label}</TextLink>
              </div>
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-xl border border-hairline bg-white p-7">
            <p className="label text-ink-muted/70">We are seeking expertise in</p>
            <ul className="mt-5 space-y-3">
              {(data.interests || []).map((item) => {
                const text = typeof item === 'string' ? item : item.value
                return (
                  <li key={text} className="flex items-start gap-3 border-t border-hairline pt-3 first:border-0 first:pt-0">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal" strokeWidth={2} />
                    <span className="text-[0.86rem] leading-relaxed text-ink-soft">{text}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------- responsible ------------------------------- */

function ResponsibleSection({ data }) {
  return (
    <section className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-3xl" />
          <Reveal delay={0.2}>
            <Tag tone="cyan">
              <ShieldCheck className="h-3 w-3" strokeWidth={2} />
              Commitments
            </Tag>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-3">
          {(data.items || []).map((item, i) => (
            <RevealItem key={item.title} className="group bg-white p-6 transition-colors hover:bg-mist/50">
              <span className="numeral text-[0.62rem] tabular-nums text-ink-muted/45">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-[0.9rem] font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-2 text-[0.83rem] leading-relaxed text-ink-muted">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export default function Impact() {
  const { content, getPage } = useContent()
  const hero = content('impact', 'hero', {})
  const page = getPage('impact')

  usePageMeta({
    title: page?.seoTitle,
    description: page?.seoDescription,
    path: '/impact',
  })

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        lead={hero.lead}
        note={hero.note}
        index="05"
      />
      <PotentialSection data={content('impact', 'potential', {})} />
      <AccessSection data={content('impact', 'access', {})} />
      <RoadmapSection data={content('impact', 'roadmap', {})} />
      <PartnershipsSection data={content('impact', 'partnerships', {})} />
      <ResponsibleSection data={content('impact', 'responsible', {})} />
      <RecognitionGallery data={content('impact', 'recognition', {})} />
      <CtaSection data={content('impact', 'cta', {})} index="07" />
    </>
  )
}
