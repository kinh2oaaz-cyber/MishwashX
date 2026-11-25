import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Filter,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { PageHero } from '../../components/sections/PageHero'
import { CtaSection } from '../../components/sections/CtaSection'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../../components/animations/Reveal'
import { Prose, ConceptNote, Tag } from '../../components/common/Prose'
import { StatusBadge } from '../../components/common/StatusBadge'
import { EmptyState } from '../../components/common/EmptyState'
import { usePageMeta } from '../../hooks/usePageMeta'
import { cn } from '../../lib/utils/cn'
import { formatMonth } from '../../lib/utils/format'

/* -------------------------------- methodology ------------------------------ */

function MethodSection({ data }) {
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
              <blockquote className="mt-9 border-l-2 border-brand-teal pl-6">
                <p className="display-sm text-ink">{data.pullQuote}</p>
              </blockquote>
            </Reveal>
          ) : null}
          <RevealGroup className="mt-10 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-3">
            {(data.pillars || []).map((p) => (
              <RevealItem key={p.title} className="bg-white p-6">
                <ShieldCheck className="h-4 w-4 text-brand-cyan" strokeWidth={1.6} />
                <h3 className="mt-4 text-[0.9rem] font-semibold tracking-tight text-ink">{p.title}</h3>
                <p className="mt-2 text-[0.81rem] leading-relaxed text-ink-muted">{p.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- timeline -------------------------------- */

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'planned', label: 'Planned' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'validated', label: 'Validated' },
]

function TimelineSection({ data, milestones }) {
  const [filter, setFilter] = useState('all')
  const published = useMemo(
    () => milestones.filter((m) => m.published).sort((a, b) => a.sortOrder - b.sortOrder),
    [milestones],
  )
  const filtered = filter === 'all' ? published : published.filter((m) => m.status === filter)
  const counts = published.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1
    return acc
  }, {})
  const anyAdvanced = published.some((m) => m.status === 'completed' || m.status === 'validated')

  return (
    <section id="timeline" className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-3xl" />
          <Reveal delay={0.2}>
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-mist px-3 py-1.5">
              <Filter className="h-3 w-3 text-ink-muted" strokeWidth={1.8} />
              <span className="text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
                {published.length} milestones
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count = f.key === 'all' ? published.length : counts[f.key] || 0
            const active = filter === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.75rem] transition-all duration-300',
                  active
                    ? 'border-navy-900 bg-navy-900 text-white'
                    : 'border-hairline bg-white text-ink-soft hover:border-navy-900/25',
                )}
              >
                {f.label}
                <span className={cn('tabular-nums text-[0.65rem]', active ? 'text-white/50' : 'text-ink-muted/60')}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {!anyAdvanced ? (
          <Reveal delay={0.1}>
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.05] px-4 py-3">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" strokeWidth={1.8} />
              <p className="text-[0.75rem] leading-relaxed text-amber-900/80">{data.emptyNote}</p>
            </div>
          </Reveal>
        ) : null}

        <div className="relative mt-12">
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-hairline md:left-[calc(9rem+7px)]" aria-hidden="true" />

          <ol className="space-y-10">
            {filtered.map((m, i) => (
              <li key={m.id} className="relative">
                <div className="grid gap-4 md:grid-cols-[9rem_1fr] md:gap-8">
                  <div className="hidden pl-0 pt-1 md:block">
                    <p className="text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted/70">
                      {m.period || formatMonth(m.date)}
                    </p>
                    <p className="numeral mt-1 text-[0.65rem] text-ink-muted/40">{m.phase}</p>
                  </div>

                  <div className="relative pl-8 md:pl-0">
                    <span
                      className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center md:-left-[29px]"
                      aria-hidden="true"
                    >
                      <span
                        className={cn(
                          'h-[9px] w-[9px] rounded-full border-2 bg-white',
                          m.status === 'validated' || m.status === 'completed'
                            ? 'border-brand-teal'
                            : m.status === 'in-progress'
                              ? 'border-brand-cyan'
                              : 'border-[#b9c8d6]',
                        )}
                      />
                    </span>

                    <Reveal y={16} delay={i * 0.04}>
                      <div className="rounded-xl border border-hairline bg-white p-6 transition-colors hover:border-brand-cyan/30 md:p-7">
                        <div className="flex flex-wrap items-center gap-3">
                          <StatusBadge status={m.status} />
                          <span className="text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted/60 md:hidden">
                            {m.period || formatMonth(m.date)}
                          </span>
                        </div>
                        <h3 className="display-sm mt-3 text-ink">{m.title}</h3>
                        <Prose html={m.description} className="mt-2.5 max-w-2xl text-[0.88rem]" />

                        {m.evidenceUrl ? (
                          <a
                            href={m.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand-teal/30 bg-brand-teal/[0.06] px-3 py-1.5 text-[0.7rem] font-medium text-[#0c7c6f] transition-colors hover:bg-brand-teal/10"
                          >
                            <FileText className="h-3 w-3" strokeWidth={1.9} />
                            {m.evidenceLabel || 'View evidence'}
                            <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                          </a>
                        ) : (
                          <p className="mt-4 text-[0.68rem] uppercase tracking-[0.12em] text-ink-muted/50">
                            No evidence attached
                          </p>
                        )}
                      </div>
                    </Reveal>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {!filtered.length ? (
            <EmptyState
              title="No milestones with this status"
              body="No milestone currently carries this status. Status labels change only when evidence is recorded in the research register."
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- workstreams ------------------------------ */

function WorkstreamsSection({ data }) {
  return (
    <section className="border-t border-hairline bg-mist py-24 md:py-32">
      <div className="shell">
        <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-3xl" />
        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2">
          {(data.items || []).map((item) => (
            <RevealItem key={item.index} className="h-full">
              <article className="flex h-full flex-col rounded-xl border border-hairline bg-white p-7 transition-colors hover:border-brand-cyan/30">
                <div className="flex items-center justify-between">
                  <span className="label text-brand-cyan/60">{item.index}</span>
                  <span className="rounded-full border border-hairline px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted">
                    {item.status}
                  </span>
                </div>
                <h3 className="display-sm mt-4 text-ink">{item.title}</h3>
                <p className="mt-3 border-l border-brand-teal/40 pl-3 text-[0.85rem] italic leading-relaxed text-ink-soft">
                  {item.question}
                </p>
                <p className="mt-3 flex-1 text-[0.85rem] leading-relaxed text-ink-muted">{item.body}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* -------------------------------- validation ------------------------------- */

function ValidationSection({ data }) {
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-navy-950 py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-fine opacity-25" aria-hidden="true" />
      <div className="shell relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading label={data.label} heading={data.heading} body={data.body} dark />
          <Reveal delay={0.15}>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/[0.07] px-3.5 py-1.5">
              <span className="h-1 w-1 rounded-full bg-amber-400" />
              <span className="text-[0.65rem] uppercase tracking-[0.14em] text-amber-200/80">
                Pre-feasibility stage
              </span>
            </div>
          </Reveal>
        </div>

        <div className="relative">
          <div className="absolute bottom-6 left-[19px] top-2 w-px bg-white/10" aria-hidden="true" />
          <ol className="space-y-6">
            {(data.stages || []).map((stage, i) => (
              <li key={stage.index} className="relative pl-14">
                <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-navy-950 text-[0.65rem] font-medium tabular-nums text-brand-teal-soft">
                  {stage.index}
                </span>
                <div className="border-t border-white/[0.08] pt-3">
                  <h3 className="text-[0.98rem] font-medium text-white">{stage.title}</h3>
                  <p className="mt-1.5 text-[0.85rem] leading-relaxed text-white/50">{stage.body}</p>
                  <p className="mt-2.5 flex items-start gap-2 text-[0.72rem] leading-relaxed text-brand-teal-soft/70">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={2} />
                    {stage.gate}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {data.disclaimer ? (
            <ConceptNote dark className="mt-8 pl-14">
              {data.disclaimer}
            </ConceptNote>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- challenges ------------------------------- */

function ChallengesSection({ data }) {
  return (
    <section className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell">
        <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-3xl" />
        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {(data.items || []).map((item, i) => (
            <RevealItem key={item.title} className="group bg-white p-6 transition-colors hover:bg-mist/50">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-600/25 bg-amber-500/[0.07]">
                  <FlaskConical className="h-3 w-3 text-amber-700" strokeWidth={1.8} />
                </span>
                <span className="numeral text-[0.62rem] text-ink-muted/50">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-4 text-[0.92rem] font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-2 text-[0.83rem] leading-relaxed text-ink-muted">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* -------------------------------- documents -------------------------------- */

function DocumentsSection({ data, documents }) {
  const published = documents.filter((d) => d.published)

  return (
    <section className="border-t border-hairline bg-mist py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-2xl" />
          <Reveal delay={0.15}>
            <Tag tone="neutral">{published.length} released</Tag>
          </Reveal>
        </div>

        <div className="mt-12">
          {published.length ? (
            <ul className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-white">
              {published.map((doc) => (
                <li key={doc.id}>
                  <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-hairline bg-mist">
                        <FileText className="h-4 w-4 text-brand-cyan" strokeWidth={1.5} />
                      </span>
                      <div>
                        <h3 className="text-[0.92rem] font-medium text-ink">{doc.title}</h3>
                        <p className="mt-1 text-[0.8rem] text-ink-muted">{doc.description}</p>
                        <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted/60">
                          {doc.category} · v{doc.version} · {doc.fileType}
                        </p>
                      </div>
                    </div>
                    {doc.fileUrl ? (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost shrink-0 text-[0.78rem]"
                      >
                        Download
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </a>
                    ) : (
                      <span className="shrink-0 text-[0.7rem] text-ink-muted/50">File pending</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={FileText}
              title="No research documents released"
              body={data.emptyNote}
            />
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export default function Research() {
  const { content, milestones, researchDocuments, getPage } = useContent()
  const hero = content('research', 'hero', {})
  const page = getPage('research')

  usePageMeta({
    title: page?.seoTitle,
    description: page?.seoDescription,
    path: '/research',
  })

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        lead={hero.lead}
        note={hero.note}
        index="03"
      />
      <MethodSection data={content('research', 'method', {})} />
      <TimelineSection data={content('research', 'timeline', {})} milestones={milestones} />
      <WorkstreamsSection data={content('research', 'workstreams', {})} />
      <ValidationSection data={content('research', 'validation', {})} />
      <ChallengesSection data={content('research', 'challenges', {})} />
      <DocumentsSection data={content('research', 'documents', {})} documents={researchDocuments} />
      <CtaSection data={content('research', 'cta', {})} index="04" />
    </>
  )
}
