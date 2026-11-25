import { Boxes, Check, ExternalLink, Layers, X } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { PageHero } from '../../components/sections/PageHero'
import { CtaSection } from '../../components/sections/CtaSection'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../../components/animations/Reveal'
import { Prose, ConceptNote, Tag } from '../../components/common/Prose'
import { CrisprMechanism } from '../../components/scientific/CrisprMechanism'
import { WorkflowRail } from '../../components/scientific/WorkflowRail'
import { ArchitectureDiagram } from '../../components/scientific/ArchitectureDiagram'
import { StatusBadge } from '../../components/common/StatusBadge'
import { usePageMeta } from '../../hooks/usePageMeta'
import { cn } from '../../lib/utils/cn'
import { assetUrl } from '../../lib/utils/assets'

/* --------------------------------- overview -------------------------------- */

const TRI_TONES = [
  { label: 'Established', cls: 'border-brand-teal/40 bg-brand-teal/[0.04]', dot: 'bg-brand-teal' },
  { label: 'Proposed', cls: 'border-brand-cyan/35 bg-brand-cyan/[0.03]', dot: 'bg-brand-cyan' },
  { label: 'Unproven', cls: 'border-amber-500/30 bg-amber-500/[0.04]', dot: 'bg-amber-500' },
]

function OverviewSection({ data }) {
  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading label={data.label} heading={data.heading} />
        </div>
        <div>
          <Reveal>
            <Prose html={data.body} className="text-[1.02rem] leading-[1.78]" />
          </Reveal>
          {data.pullQuote ? (
            <Reveal delay={0.1}>
              <blockquote className="mt-9 border-l-2 border-brand-teal pl-6">
                <p className="display-sm text-ink">{data.pullQuote}</p>
              </blockquote>
            </Reveal>
          ) : null}

          <RevealGroup className="mt-10 grid gap-4">
            {(data.pillars || []).map((pillar, i) => {
              const tone = TRI_TONES[i] || TRI_TONES[1]
              return (
                <RevealItem key={pillar.title}>
                  <div className={cn('rounded-lg border p-5', tone.cls)}>
                    <div className="flex items-center gap-2.5">
                      <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} />
                      <span className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                        {pillar.title}
                      </span>
                    </div>
                    <p className="mt-2.5 text-[0.87rem] leading-relaxed text-ink-soft">{pillar.body}</p>
                  </div>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- crispr --------------------------------- */

function CrisprSection({ data }) {
  return (
    <section className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <SectionHeading label={data.label} heading={data.heading} className="max-w-2xl" />
          <Reveal delay={0.15}>
            <Prose html={data.body} className="text-[0.93rem] lg:pb-1" />
          </Reveal>
        </div>

        <div className="mt-14">
          <CrisprMechanism steps={data.steps} conceptNote={data.conceptNote} />
        </div>

        {data.references?.length ? (
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col gap-3 rounded-lg border border-hairline bg-mist/50 p-5 sm:flex-row sm:items-center sm:gap-6">
              <span className="label shrink-0 text-ink-muted/70">Mechanism sources</span>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {data.references.map((ref) => (
                  <a
                    key={ref.url}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-[0.76rem] text-ink-soft transition-colors hover:text-brand-cyan"
                  >
                    {ref.label}
                    <ExternalLink className="h-2.5 w-2.5 opacity-50" strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

/* --------------------------------- workflow -------------------------------- */

function WorkflowSection({ data }) {
  return (
    <section className="border-t border-hairline bg-mist py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <SectionHeading label={data.label} heading={data.heading} className="max-w-2xl" />
          <Reveal delay={0.15}>
            <div className="lg:pb-1">
              <p className="text-[0.92rem] leading-relaxed text-ink-soft">{data.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(data.statusLegend || []).map((legend) => (
                  <StatusBadge key={legend.key} status={legend.key} label={legend.label.split(' — ')[0]} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 rounded-xl border border-hairline bg-white p-6 md:p-10">
            <WorkflowRail steps={data.steps} disclaimer={data.disclaimer} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------- architecture ------------------------------ */

function ArchitectureSection({ data }) {
  return (
    <section className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-3xl" />
          <Reveal delay={0.2}>
            <Tag tone="cyan">
              <Layers className="h-3 w-3" strokeWidth={2} />
              Interactive
            </Tag>
          </Reveal>
        </div>
        <div className="mt-12">
          <ArchitectureDiagram components={data.components} note={data.note} />
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- hardware -------------------------------- */

function HardwareSection({ data }) {
  return (
    <section className="border-t border-hairline bg-mist py-24 md:py-32">
      <div className="shell">
        <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-3xl" />

        {data.assetNotice ? (
          <Reveal delay={0.1}>
            <div className="mt-8 flex items-start gap-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.05] px-4 py-3">
              <Boxes className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" strokeWidth={1.7} />
              <p className="text-[0.75rem] leading-relaxed text-amber-900/80">{data.assetNotice}</p>
            </div>
          </Reveal>
        ) : null}

        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(data.items || []).map((item) => (
            <RevealItem key={item.title} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-white transition-all duration-500 hover:border-brand-cyan/30 hover:shadow-[0_24px_50px_-40px_rgba(8,24,43,0.4)]">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-hairline bg-navy-950">
                  {item.imageUrl ? (
                    <img
                      src={assetUrl(item.imageUrl)}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="relative flex h-full flex-col items-center justify-center gap-2">
                      <div className="absolute inset-0 grid-fine opacity-30" aria-hidden="true" />
                      <div className="absolute h-24 w-24 rounded-full glow-cyan opacity-30 blur-2xl" aria-hidden="true" />
                      <Boxes className="relative h-5 w-5 text-white/25" strokeWidth={1.3} />
                      <span className="relative text-[0.58rem] uppercase tracking-[0.2em] text-white/30">
                        Asset pending
                      </span>
                      <span className="relative text-[0.58rem] text-white/20">Electric and engineering render</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="display-sm text-ink">{item.title}</h3>
                  <p className="mt-2.5 flex-1 text-[0.85rem] leading-relaxed text-ink-muted">{item.body}</p>
                  {item.specs?.length ? (
                    <dl className="mt-5 space-y-2 border-t border-hairline pt-4">
                      {item.specs.map((spec) => (
                        <div key={spec.label} className="flex items-baseline justify-between gap-4">
                          <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-ink-muted/70">{spec.label}</dt>
                          <dd className="text-[0.75rem] font-medium text-ink-soft">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* -------------------------------- boundaries ------------------------------- */

function BoundariesSection({ data }) {
  return (
    <section className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading label={data.label} heading={data.heading} body={data.body} />
        </div>
        <RevealGroup className="space-y-3">
          {(data.items || []).map((item, i) => {
            const text = typeof item === 'string' ? item : item.value
            return (
              <RevealItem key={i}>
                <div className="flex items-start gap-4 rounded-lg border border-hairline bg-mist/40 p-4 transition-colors hover:bg-mist">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink/15">
                    <X className="h-2.5 w-2.5 text-ink-soft" strokeWidth={2.4} />
                  </span>
                  <p className="text-[0.87rem] leading-relaxed text-ink-soft">{text}</p>
                </div>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export default function Innovation() {
  const { content, getPage } = useContent()
  const hero = content('innovation', 'hero', {})
  const page = getPage('innovation')

  usePageMeta({
    title: page?.seoTitle,
    description: page?.seoDescription,
    path: '/innovation',
  })

  const aside = (
    <Reveal delay={0.2}>
      <div className="rounded-xl border border-white/[0.1] bg-white/[0.035] p-6 backdrop-blur-sm">
        <p className="label text-white/35">Platform at a glance</p>
        <dl className="mt-5 space-y-4">
          {[
            ['Detection chemistry', 'CRISPR-Cas12a'],
            ['Format', 'Single-use cartridge'],
            ['Readout', 'Optical fluorescence'],
            ['Intended setting', 'Low-resource point of care'],
            ['Current stage', 'Concept & design'],
          ].map(([label, value]) => (
            <div key={label} className="border-t border-white/[0.08] pt-3 first:border-0 first:pt-0">
              <dt className="text-[0.6rem] uppercase tracking-[0.16em] text-white/30">{label}</dt>
              <dd className="mt-1 text-[0.85rem] text-white/80">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2">
          <span className="h-1 w-1 rounded-full bg-amber-400" />
          <span className="text-[0.65rem] text-amber-200/80">None of these are validated capabilities.</span>
        </div>
      </div>
    </Reveal>
  )

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        lead={hero.lead}
        note={hero.note}
        index="02"
        aside={aside}
      />
      <OverviewSection data={content('innovation', 'overview', {})} />
      <CrisprSection data={content('innovation', 'crispr', {})} />
      <WorkflowSection data={content('innovation', 'workflow', {})} />
      <ArchitectureSection data={content('innovation', 'architecture', {})} />
      <HardwareSection data={content('innovation', 'hardware', {})} />
      <BoundariesSection data={content('innovation', 'boundaries', {})} />
      <CtaSection data={content('innovation', 'cta', {})} index="03" />
    </>
  )
}
