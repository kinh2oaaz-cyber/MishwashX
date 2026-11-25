import { ExternalLink, Quote } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { PageHero } from '../../components/sections/PageHero'
import { CtaSection } from '../../components/sections/CtaSection'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../../components/animations/Reveal'
import { Prose, ConceptNote, Tag } from '../../components/common/Prose'
import { Counter } from '../../components/common/Counter'
import { TextLink } from '../../components/common/Button'
import { usePageMeta } from '../../hooks/usePageMeta'
import { cn } from '../../lib/utils/cn'

/* --------------------------------- context -------------------------------- */

function ContextSection({ data }) {
  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading label={data.label} heading={data.heading} />
        </div>
        <div>
          <Reveal>
            <Prose html={data.body} className="text-[1.02rem] leading-[1.78]" />
          </Reveal>
          {data.pullQuote ? (
            <Reveal delay={0.1}>
              <blockquote className="relative mt-10 border-l-2 border-brand-teal pl-6">
                <Quote className="absolute -left-[7px] -top-1 h-3 w-3 text-brand-teal" fill="currentColor" />
                <p className="display-sm text-ink">{data.pullQuote}</p>
              </blockquote>
            </Reveal>
          ) : null}
          <RevealGroup className="mt-12 space-y-px overflow-hidden rounded-xl border border-hairline bg-hairline">
            {(data.pillars || []).map((item, i) => (
              <RevealItem key={item.title} className="group bg-white p-6 transition-colors hover:bg-white/70 md:p-7">
                <div className="flex gap-5">
                  <span className="numeral shrink-0 pt-0.5 text-[0.7rem] tabular-nums text-brand-cyan/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-[0.95rem] font-semibold tracking-tight text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-[0.87rem] leading-relaxed text-ink-muted">{item.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- barriers ------------------------------- */

function BarriersSection({ data }) {
  return (
    <section className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell">
        <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-3xl" />

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-2">
          {(data.items || []).map((item, i) => (
            <RevealItem
              key={item.index}
              className={cn(
                'group relative bg-white p-7 transition-colors duration-500 hover:bg-mist/50 md:p-9',
                i === 0 && 'md:col-span-2',
              )}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3">
                    <span className="label text-brand-cyan/60">{item.index}</span>
                    <span className="h-px w-6 bg-hairline" />
                  </div>
                  <h3 className="display-sm mt-4 text-ink">{item.title}</h3>
                  <p className="mt-2.5 text-[0.88rem] leading-relaxed text-ink-soft">{item.body}</p>
                </div>
                <span className="numeral shrink-0 font-display text-[2.4rem] font-light leading-none text-hairline transition-colors duration-500 group-hover:text-brand-teal/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* -------------------------------- statistics ------------------------------ */

function StatisticsSection({ data }) {
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-navy-950 py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-fine opacity-25" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full glow-cyan opacity-25 blur-3xl"
        aria-hidden="true"
      />
      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading label={data.label} heading={data.heading} body={data.body} dark className="max-w-3xl" />
          <Reveal delay={0.2}>
            <Tag tone="slate">Peer-reviewed sources</Tag>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.09] md:grid-cols-2">
          {(data.stats || []).map((stat, i) => (
            <RevealItem key={stat.label} className="group relative bg-navy-950 p-7 transition-colors duration-500 hover:bg-navy-900 md:p-10">
              <span className="label text-white/25">{String(i + 1).padStart(2, '0')}</span>
              <div className="mt-5 flex items-baseline gap-1">
                {stat.prefix ? (
                  <span className="font-display text-[1.4rem] font-light text-brand-teal-soft">{stat.prefix}</span>
                ) : null}
                <Counter
                  value={stat.value}
                  className="font-display text-[clamp(2.6rem,5vw,4rem)] font-light leading-none text-white"
                />
              </div>
              <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-white/70">{stat.label}</p>
              {stat.detail ? (
                <p className="mt-3 max-w-md text-[0.8rem] leading-relaxed text-white/35">{stat.detail}</p>
              ) : null}
              <div className="mt-6 border-t border-white/[0.08] pt-4">
                <a
                  href={stat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-start gap-2 text-[0.72rem] leading-relaxed text-white/40 transition-colors hover:text-brand-teal-soft"
                >
                  <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={1.7} />
                  <span>
                    {stat.source}
                    {stat.year ? ` · ${stat.year}` : ''}
                  </span>
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <ConceptNote dark className="mt-6">
            {data.verificationNote}
          </ConceptNote>
        </Reveal>
      </div>
    </section>
  )
}

/* ----------------------------- early detection ---------------------------- */

const TONES = {
  high: { bar: 'bg-brand-teal', text: 'text-[#0c7c6f]', width: 'w-full', opacity: 'opacity-100' },
  mid: { bar: 'bg-brand-cyan', text: 'text-brand-cyan', width: 'w-2/3', opacity: 'opacity-80' },
  low: { bar: 'bg-[#9db0c2]', text: 'text-ink-muted', width: 'w-1/3', opacity: 'opacity-70' },
}

function EarlyDetectionSection({ data }) {
  return (
    <section className="border-t border-hairline bg-mist py-24 md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading label={data.label} heading={data.heading} body={data.body} />
          {data.link?.label ? (
            <Reveal delay={0.15}>
              <div className="mt-7">
                <TextLink href={data.link.to}>{data.link.label}</TextLink>
              </div>
            </Reveal>
          ) : null}
          {data.caveat ? (
            <Reveal delay={0.2}>
              <ConceptNote className="mt-8 max-w-md">{data.caveat}</ConceptNote>
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-xl border border-hairline bg-white p-6 md:p-8">
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-ink-muted">
                Stage at diagnosis
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-muted/50">
                Schematic
              </span>
            </div>

            <div className="mt-8 space-y-7">
              {(data.stages || []).map((stage, i) => {
                const tone = TONES[stage.tone] || TONES.mid
                return (
                  <div key={stage.stage}>
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-3">
                        <span className={cn('text-[0.68rem] font-medium uppercase tracking-[0.14em]', tone.text)}>
                          {stage.stage}
                        </span>
                        <span className="text-[0.85rem] font-medium text-ink">{stage.title}</span>
                      </div>
                      <span className="numeral text-[0.65rem] text-ink-muted/50">
                        0{3 - i}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-mist-deep">
                      <div
                        className={cn('h-full rounded-full transition-all duration-1000', tone.bar, tone.width)}
                        style={{ transitionDelay: `${i * 120}ms` }}
                      />
                    </div>
                    <p className="mt-2.5 text-[0.8rem] leading-relaxed text-ink-muted">{stage.body}</p>
                  </div>
                )
              })}
            </div>

            <p className="mt-8 border-t border-hairline pt-4 text-[0.68rem] leading-relaxed text-ink-muted/70">
              Bars indicate relative treatment intent, not survival percentages. No numerical outcome is implied.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------ implications ------------------------------ */

function ImplicationsSection({ data }) {
  return (
    <section className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell">
        <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-3xl" />

        <RevealGroup className="mt-14 divide-y divide-hairline border-y border-hairline">
          {(data.items || []).map((item, i) => (
            <RevealItem key={item.requirement}>
              <div className="group grid gap-3 py-6 transition-colors hover:bg-mist/40 md:grid-cols-[3rem_1fr_1.2fr] md:items-baseline md:gap-8 md:px-2">
                <span className="numeral text-[0.68rem] tabular-nums text-ink-muted/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[0.95rem] font-medium tracking-tight text-ink">{item.requirement}</h3>
                <p className="text-[0.85rem] leading-relaxed text-ink-muted">{item.rationale}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ------------------------------- references ------------------------------- */

function ReferencesSection({ references }) {
  const published = references.filter((r) => r.published)
  if (!published.length) return null

  return (
    <section className="border-t border-hairline bg-mist py-20 md:py-24">
      <div className="shell">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="label text-brand-cyan">References</span>
            <h2 className="display-md mt-4 text-ink">Sources cited on this page.</h2>
          </div>
          <span className="hidden text-[0.65rem] uppercase tracking-[0.16em] text-ink-muted/60 sm:block">
            {published.length} entries
          </span>
        </div>

        <ol className="mt-10 divide-y divide-hairline border-t border-hairline">
          {published.map((ref, i) => (
            <li key={ref.id}>
              <div className="grid gap-2 py-5 md:grid-cols-[2.5rem_1fr_auto] md:gap-6">
                <span className="numeral text-[0.7rem] tabular-nums text-ink-muted/50">
                  [{String(i + 1).padStart(2, '0')}]
                </span>
                <div>
                  <p className="text-[0.86rem] leading-relaxed text-ink">
                    <span className="font-medium">{ref.authors}</span>{' '}
                    <span className="text-ink-soft">{ref.title}.</span>{' '}
                    <span className="italic text-ink-muted">{ref.source}</span>
                    {ref.year ? `, ${ref.year}.` : ''}
                    {ref.doi ? <span className="text-ink-muted"> doi:{ref.doi}</span> : null}
                  </p>
                  {ref.note ? (
                    <p className="mt-1.5 text-[0.72rem] text-ink-muted/70">{ref.note}</p>
                  ) : null}
                </div>
                {ref.url ? (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 self-start text-[0.7rem] text-brand-cyan transition-colors hover:text-ink"
                  >
                    Source
                    <ExternalLink className="h-3 w-3" strokeWidth={1.8} />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export default function Problem() {
  const { content, references, getPage } = useContent()
  const hero = content('problem', 'hero', {})
  const page = getPage('problem')

  usePageMeta({
    title: page?.seoTitle,
    description: page?.seoDescription,
    path: '/problem',
  })

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        lead={hero.lead}
        note={hero.note}
        index="01"
      />
      <ContextSection data={content('problem', 'context', {})} />
      <BarriersSection data={content('problem', 'barriers', {})} />
      <StatisticsSection data={content('problem', 'statistics', {})} />
      <EarlyDetectionSection data={content('problem', 'early', {})} />
      <ImplicationsSection data={content('problem', 'implications', {})} />
      <ReferencesSection references={references} />
      <CtaSection data={content('problem', 'cta', {})} index="02" />
    </>
  )
}
