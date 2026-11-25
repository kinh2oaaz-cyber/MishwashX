import { Users } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { PageHero } from '../../components/sections/PageHero'
import { CtaSection } from '../../components/sections/CtaSection'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../../components/animations/Reveal'
import { Prose, ConceptNote } from '../../components/common/Prose'
import { EmptyState } from '../../components/common/EmptyState'
import { TeamCard } from '../../components/common/TeamCard'
import { TextLink } from '../../components/common/Button'
import { usePageMeta } from '../../hooks/usePageMeta'
import { assetUrl } from '../../lib/utils/assets'

/* --------------------------------- mission -------------------------------- */

function MissionSection({ data }) {
  return (
    <section className="bg-mist py-24 md:py-32">
      <div className="shell">
        <SectionHeading label={data.label} heading={data.heading} className="max-w-3xl" />

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline lg:grid-cols-2">
          <Reveal className="bg-white p-8 md:p-10">
            <span className="label text-brand-cyan">Mission</span>
            <p className="display-sm mt-5 text-ink">{data.mission}</p>
          </Reveal>
          <Reveal delay={0.1} className="bg-navy-900 p-8 text-white md:p-10">
            <span className="label text-brand-teal-soft">Vision</span>
            <p className="display-sm mt-5 text-white/90">{data.vision}</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(data.values || []).map((value, i) => (
            <RevealItem key={value.title}>
              <div className="h-full rounded-lg border border-hairline bg-white p-5 transition-colors hover:border-brand-cyan/30">
                <span className="numeral text-[0.62rem] tabular-nums text-brand-cyan/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-[0.88rem] font-semibold tracking-tight text-ink">{value.title}</h3>
                <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink-muted">{value.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* --------------------------------- members -------------------------------- */

function MembersSection({ data, team }) {
  const members = team.filter((m) => m.published)

  return (
    <section id="members" className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-2xl" />
          <Reveal delay={0.15}>
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-mist px-3.5 py-1.5 text-[0.65rem] uppercase tracking-[0.14em] text-ink-muted">
              <Users className="h-3 w-3" strokeWidth={1.8} />
              {members.length} {members.length === 1 ? 'profile' : 'profiles'}
            </span>
          </Reveal>
        </div>

        <div className="mt-12">
          {members.length ? (
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, i) => (
                <RevealItem key={member.id}>
                  <TeamCard member={member} index={i} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <EmptyState
              icon={Users}
              title={data.emptyTitle || 'Team profiles are being finalised.'}
              body={data.emptyBody}
              action={data.emptyAction}
            />
          )}
        </div>

        {data.emptyBody ? (
          <ConceptNote className="mt-6" variant="info">
            Member profiles are managed in the content system. Names, roles and biographies are
            published only when confirmed by the individual.
          </ConceptNote>
        ) : null}
      </div>
    </section>
  )
}

/* -------------------------------- principles ------------------------------- */

function PrinciplesSection({ data }) {
  return (
    <section className="border-t border-hairline bg-mist py-24 md:py-32">
      <div className="shell">
        <SectionHeading label={data.label} heading={data.heading} className="max-w-2xl" />
        <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2">
          {(data.items || []).map((item) => (
            <RevealItem key={item.index} className="group bg-white p-7 transition-colors hover:bg-mist/40 md:p-8">
              <div className="flex items-start gap-5">
                <span className="label shrink-0 pt-1 text-brand-cyan/60">{item.index}</span>
                <div>
                  <h3 className="display-sm text-ink">{item.title}</h3>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-ink-muted">{item.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export default function Team() {
  const { content, team, getPage } = useContent()
  const hero = content('team', 'hero', {})
  const page = getPage('team')

  usePageMeta({
    title: page?.seoTitle,
    description: page?.seoDescription,
    path: '/team',
  })

  const aside = hero.groupPhotoUrl ? (
    <Reveal delay={0.2}>
      <figure className="overflow-hidden rounded-xl border border-white/10">
        <img
          src={assetUrl(hero.groupPhotoUrl)}
          alt={hero.groupPhotoCaption || 'Mishawash X team'}
          className="aspect-[4/3] w-full object-cover"
        />
        {hero.groupPhotoCaption ? (
          <figcaption className="border-t border-white/10 bg-white/[0.03] px-4 py-2.5 text-[0.68rem] text-white/40">
            {hero.groupPhotoCaption}
          </figcaption>
        ) : null}
      </figure>
    </Reveal>
  ) : null

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        lead={hero.lead}
        note={hero.note}
        index="04"
        aside={aside}
      />
      <MissionSection data={content('team', 'mission', {})} />
      <MembersSection data={content('team', 'members', {})} team={team} />
      <PrinciplesSection data={content('team', 'principles', {})} />
      <CtaSection data={content('team', 'cta', {})} index="05" />
    </>
  )
}
