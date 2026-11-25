import { ArrowUpRight, Camera } from 'lucide-react'
import { SectionHeading } from '../common/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../animations/Reveal'
import { ConceptNote } from '../common/Prose'
import { assetUrl } from '../../lib/utils/assets'

/**
 * Photographic record of the team's competitions, festivals and visits.
 * Images open at full size in a new tab so no card is a dead end.
 */
export function RecognitionGallery({ data }) {
  const items = data?.items || []
  if (!data?.heading || !items.length) return null

  return (
    <section className="border-t border-hairline bg-mist py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            label={data.label}
            heading={data.heading}
            body={data.body}
            className="max-w-3xl"
          />
          <Reveal delay={0.15}>
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-3.5 py-1.5 text-[0.7rem] text-ink-muted">
              <Camera className="h-3.5 w-3.5" strokeWidth={1.7} />
              {items.length} photographs
            </span>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <RevealItem key={item.image} className="h-full">
              <a
                href={assetUrl(item.image)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-white transition-colors duration-500 hover:border-brand-cyan/40"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-navy-950/5">
                  <img
                    src={assetUrl(item.image)}
                    alt={item.alt || item.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.opacity = '0' }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {item.year ? (
                    <span className="label text-brand-cyan/70">{item.year}</span>
                  ) : null}
                  <h3 className="mt-2 text-[0.9rem] font-semibold leading-snug tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[0.78rem] leading-relaxed text-ink-muted">
                    {item.context}
                  </p>
                </div>
              </a>
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
