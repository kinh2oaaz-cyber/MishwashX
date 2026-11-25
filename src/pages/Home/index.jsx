import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  CircleDashed,
  Dna,
  FlaskConical,
  Microscope,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { HomeHero } from './HomeHero'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Reveal, RevealGroup, RevealItem, TextReveal } from '../../components/animations/Reveal'
import { Button, TextLink } from '../../components/common/Button'
import { Counter } from '../../components/common/Counter'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Prose, ConceptNote } from '../../components/common/Prose'
import { TiltCard } from '../../components/common/TiltCard'
import { EmptyState } from '../../components/common/EmptyState'
import { TeamCard, TeamRow } from '../../components/common/TeamCard'
import { CtaSection } from '../../components/sections/CtaSection'
import { RecognitionGallery } from '../../components/sections/RecognitionGallery'
import { usePageMeta } from '../../hooks/usePageMeta'
import { formatMonth } from '../../lib/utils/format'

/* ------------------------------- statement -------------------------------- */

function StatementSection({ data }) {
  if (!data?.heading) return null
  return (
    <section className="relative overflow-hidden bg-mist py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading label={data.label} heading={data.heading} />
          <Reveal delay={0.2}>
            <div className="mt-10 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-white">
                <Dna className="h-4 w-4 text-brand-cyan" strokeWidth={1.6} />
              </span>
              <p className="text-[0.78rem] text-ink-muted">
                Concept-stage research programme
              </p>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <Prose html={data.body} className="text-[1.02rem] leading-[1.78]" />
          </Reveal>

          {data.pullQuote ? (
            <Reveal delay={0.1}>
              <blockquote className="relative mt-10 border-l-2 border-brand-teal pl-6">
                <p className="display-sm text-ink">{data.pullQuote}</p>
              </blockquote>
            </Reveal>
          ) : null}

          <RevealGroup className="mt-12 grid overflow-hidden rounded-xl border border-hairline bg-white sm:grid-cols-3 sm:divide-x sm:divide-hairline">
            {(data.pillars || []).map((pillar, i) => (
              <RevealItem key={pillar.title} className="group relative p-6 transition-colors hover:bg-mist/60">
                <span className="label text-brand-cyan/70">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-[0.95rem] font-semibold tracking-tight text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-muted">{pillar.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- problem -------------------------------- */

function ProblemSection({ data }) {
  if (!data?.heading) return null
  return (
    <section className="relative border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <SectionHeading label={data.label} heading={data.heading} className="max-w-2xl" />
          <Reveal delay={0.15}>
            <div className="lg:pb-2">
              <p className="text-[0.95rem] leading-relaxed text-ink-soft">{data.body}</p>
              {data.link?.label ? (
                <div className="mt-5">
                  <TextLink to={data.link.to}>{data.link.label}</TextLink>
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-3">
          {(data.stats || []).map((stat, i) => (
            <RevealItem key={stat.label} className="group relative bg-white p-7 md:p-9">
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(320px circle at 50% 0%, rgba(36,198,177,0.07), transparent 70%)',
                }}
                aria-hidden="true"
              />
              <div className="relative">
                <Counter
                  value={`${stat.value}`}
                  className="text-[clamp(2.2rem,4vw,3.3rem)] font-light leading-none text-ink"
                />
                <p className="mt-4 max-w-[22ch] text-[0.86rem] leading-relaxed text-ink-soft">
                  {stat.label}
                </p>
                <p className="mt-5 flex items-center gap-2 text-[0.63rem] uppercase tracking-[0.16em] text-ink-muted/70">
                  <span className="h-1 w-1 rounded-full bg-brand-teal" />
                  {stat.source}
                </p>
              </div>
            </RevealItem>
          ))}
        </div>

        {data.statsNote ? (
          <Reveal delay={0.1}>
            <ConceptNote className="mt-5">{data.statsNote}</ConceptNote>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

/* -------------------------------- innovation ------------------------------ */

function InnovationSection({ data }) {
  if (!data?.heading) return null
  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-fine opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[38rem] w-[38rem] rounded-full glow-teal opacity-20 blur-3xl"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <SectionHeading label={data.label} heading={data.heading} dark className="max-w-2xl" />
          <Reveal delay={0.15}>
            <div className="lg:pb-2">
              <p className="text-[0.95rem] leading-relaxed text-white/55">{data.body}</p>
              {data.link?.label ? (
                <div className="mt-5">
                  <TextLink to={data.link.to} dark>
                    {data.link.label}
                  </TextLink>
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>

        <div className="relative mt-16">
          <div className="absolute inset-x-0 top-5 hidden h-px bg-white/10 md:block" aria-hidden="true" />
          <RevealGroup className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            {(data.stages || []).map((stage) => (
              <RevealItem key={stage.step} className="group relative">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-navy-900 text-[0.65rem] font-medium tabular-nums text-brand-teal-soft transition-colors duration-500 group-hover:border-brand-teal/60 group-hover:bg-brand-teal/10">
                  {stage.step}
                </div>
                <h3 className="mt-5 text-[0.95rem] font-medium tracking-tight text-white">{stage.title}</h3>
                <p className="mt-2 max-w-[26ch] text-[0.82rem] leading-relaxed text-white/45">{stage.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {data.disclaimer ? (
          <Reveal delay={0.1}>
            <ConceptNote dark className="mt-12">
              {data.disclaimer}
            </ConceptNote>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

/* ------------------------------- technology -------------------------------- */

const TECH_ICONS = [Dna, Microscope, FlaskConical, ShieldCheck]

function TechnologySection({ data }) {
  if (!data?.heading) return null
  return (
    <section className="border-t border-hairline bg-mist py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          label={data.label}
          heading={data.heading}
          body={data.body}
          className="max-w-3xl"
        />

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2">
          {(data.items || []).map((item, i) => {
            const Icon = TECH_ICONS[i % TECH_ICONS.length]
            return (
              <RevealItem key={item.title}>
                <TiltCard className="h-full">
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-white p-7 transition-colors duration-500 hover:border-brand-cyan/30 md:p-8">
                    <div className="flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-hairline bg-mist text-brand-cyan transition-colors duration-500 group-hover:border-brand-cyan/30 group-hover:bg-white">
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span className="label text-ink-muted/50">{item.index}</span>
                    </div>

                    <h3 className="display-sm mt-6 text-ink">{item.title}</h3>
                    <p className="mt-3 flex-1 text-[0.88rem] leading-relaxed text-ink-muted">{item.body}</p>

                    <div className="mt-6 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-brand-teal" />
                      <span className="text-[0.62rem] uppercase tracking-[0.16em] text-ink-muted/80">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

/* --------------------------------- research -------------------------------- */

function ResearchSection({ data, milestones }) {
  if (!data?.heading) return null
  const published = milestones.filter((m) => m.published).slice(0, 4)
  const counts = milestones.reduce(
    (acc, m) => {
      if (m.status === 'validated') acc.validated += 1
      else if (m.status === 'completed') acc.completed += 1
      else if (m.status === 'in-progress') acc.progress += 1
      else acc.planned += 1
      return acc
    },
    { planned: 0, progress: 0, completed: 0, validated: 0 },
  )

  return (
    <section className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading label={data.label} heading={data.heading} body={data.body} />
          {data.link?.label ? (
            <Reveal delay={0.15}>
              <div className="mt-7">
                <Button to={data.link.to} variant="ghost" size="sm" icon>
                  {data.link.label}
                </Button>
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline">
              {[
                ['Planned', counts.planned],
                ['In progress', counts.progress],
                ['Completed', counts.completed],
                ['Validated', counts.validated],
              ].map(([label, value]) => (
                <div key={label} className="bg-white px-5 py-4">
                  <dt className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-muted/70">{label}</dt>
                  <dd className="numeral mt-1 text-[1.5rem] font-light text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-hairline bg-mist/50">
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
              <span className="text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted">
                Research register
              </span>
              <span className="flex items-center gap-2 text-[0.65rem] text-ink-muted">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-brand-teal opacity-50" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-brand-teal" />
                </span>
                Live
              </span>
            </div>

            {published.length ? (
              <ol className="divide-y divide-hairline">
                {published.map((m) => (
                  <li key={m.id}>
                    <Link
                      to="/research"
                      className="group flex items-start gap-4 px-6 py-5 transition-colors hover:bg-white"
                    >
                      <span className="mt-1 w-16 shrink-0 text-[0.63rem] uppercase tracking-[0.12em] text-ink-muted/70">
                        {m.period || formatMonth(m.date)}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[0.88rem] font-medium leading-snug text-ink group-hover:text-brand-cyan">
                          {m.title}
                        </span>
                        <span className="mt-2 block">
                          <StatusBadge status={m.status} />
                        </span>
                      </span>
                      <ArrowUpRight
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-ink-muted/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.6}
                      />
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="p-6">
                <EmptyState
                  title="No milestones published"
                  body="Research milestones will appear here once they are published through the research register."
                />
              </div>
            )}

            <div className="border-t border-hairline bg-white px-6 py-4">
              <p className="text-[0.68rem] leading-relaxed text-ink-muted/80">
                No milestone has been marked validated. Validation requires attached evidence.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ----------------------------------- team ---------------------------------- */

function TeamSection({ data, team }) {
  if (!data?.heading) return null
  const members = team.filter((m) => m.published)

  return (
    <section className="border-t border-hairline bg-mist py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <SectionHeading label={data.label} heading={data.heading} className="max-w-2xl" />
          <Reveal delay={0.15}>
            <div className="lg:pb-2">
              <p className="text-[0.95rem] leading-relaxed text-ink-soft">{data.body}</p>
              {data.link?.label ? (
                <div className="mt-5">
                  <TextLink to={data.link.to}>{data.link.label}</TextLink>
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>

        <div className="mt-14">
          {members.length ? (
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {members.slice(0, 3).map((member, i) => (
                <RevealItem key={member.id}>
                  <TeamCard member={member} index={i} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <Reveal>
              <div className="relative overflow-hidden rounded-xl border border-hairline bg-white">
                <div className="grid items-center gap-8 p-8 md:grid-cols-[auto_1fr] md:p-12">
                  <div className="relative mx-auto flex h-28 w-28 items-center justify-center md:mx-0">
                    <div className="absolute inset-0 rounded-full border border-dashed border-[#c9d7e3]" />
                    <div className="absolute inset-3 rounded-full border border-hairline bg-mist" />
                    <Users className="relative h-7 w-7 text-brand-cyan/70" strokeWidth={1.4} />
                  </div>
                  <div>
                    <h3 className="display-sm text-ink">
                      {data.emptyTitle || 'Team profiles are being finalised.'}
                    </h3>
                    <p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-ink-soft">
                      {data.emptyBody}
                    </p>
                    {data.emptyAction?.label ? (
                      <div className="mt-5">
                        <TextLink to={data.emptyAction.to}>{data.emptyAction.label}</TextLink>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-hairline bg-mist/60 px-8 py-4 md:px-12">
                  {['Molecular biology', 'Hardware design', 'Scientific communication'].map((area) => (
                    <span key={area} className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.14em] text-ink-muted/70">
                      <span className="h-1 w-1 rounded-full bg-brand-teal" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- impact --------------------------------- */

function ImpactSection({ data }) {
  if (!data?.heading) return null
  return (
    <section className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <SectionHeading label={data.label} heading={data.heading} className="max-w-2xl" />
          <Reveal delay={0.15}>
            <div className="lg:pb-2">
              <p className="text-[0.95rem] leading-relaxed text-ink-soft">{data.body}</p>
              {data.link?.label ? (
                <div className="mt-5">
                  <TextLink to={data.link.to}>{data.link.label}</TextLink>
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3">
          {(data.items || []).map((item, i) => (
            <RevealItem key={item.title}>
              <div className="group relative h-full overflow-hidden rounded-xl border border-hairline bg-mist/40 p-7 transition-colors duration-500 hover:border-brand-teal/30 hover:bg-white">
                <span className="numeral text-[0.7rem] tabular-nums text-brand-cyan/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="display-sm mt-4 text-ink">{item.title}</h3>
                <p className="mt-2 text-[0.86rem] leading-relaxed text-ink-soft">{item.body}</p>
                <ArrowRight
                  className="mt-6 h-4 w-4 text-ink-muted/40 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-brand-cyan"
                  strokeWidth={1.5}
                />
              </div>
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

/* ----------------------------------- page ---------------------------------- */

export default function Home() {
  const { content, milestones, team, getPage } = useContent()
  const page = getPage('home')

  usePageMeta({
    title: null,
    description: page?.seoDescription,
    path: '/',
  })

  const cta = content('home', 'cta', {})

  return (
    <>
      <HomeHero />
      <StatementSection data={content('home', 'statement', {})} />
      <ProblemSection data={content('home', 'problem', {})} />
      <InnovationSection data={content('home', 'innovation', {})} />
      <TechnologySection data={content('home', 'technology', {})} />
      <ResearchSection data={content('home', 'research', {})} milestones={milestones} />
      <TeamSection data={content('home', 'team', {})} team={team} />
      <ImpactSection data={content('home', 'impact', {})} />
      <RecognitionGallery data={content('home', 'recognition', {})} />
      <CtaSection data={cta} index="08" />
    </>
  )
}
