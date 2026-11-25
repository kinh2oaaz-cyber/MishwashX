import { useState } from 'react'
import { ArrowUpRight, Download, FileText, Mail, MapPin, MessageSquare, Timer } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { PageHero } from '../../components/sections/PageHero'
import { CtaSection } from '../../components/sections/CtaSection'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../../components/animations/Reveal'
import { EmptyState } from '../../components/common/EmptyState'
import { Accordion } from '../../components/common/Accordion'
import { ContactForm } from '../../components/common/ContactForm'
import { Tag } from '../../components/common/Prose'
import { usePageMeta } from '../../hooks/usePageMeta'
import { cn } from '../../lib/utils/cn'
import { formatBytes } from '../../lib/utils/format'

/* -------------------------------- documents -------------------------------- */

function DocumentsSection({ data, documents }) {
  const [category, setCategory] = useState('All')
  const published = documents.filter((d) => d.published)
  const categories = ['All', ...new Set(published.map((d) => d.category).filter(Boolean))]
  const filtered = category === 'All' ? published : published.filter((d) => d.category === category)

  return (
    <section id="documents" className="bg-mist py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading label={data.label} heading={data.heading} body={data.body} className="max-w-2xl" />
          <Reveal delay={0.15}>
            <Tag tone="neutral">{published.length} files released</Tag>
          </Reveal>
        </div>

        {published.length ? (
          <>
            <div className="mt-10 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  aria-pressed={category === cat}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-[0.75rem] transition-all duration-300',
                    category === cat
                      ? 'border-navy-900 bg-navy-900 text-white'
                      : 'border-hairline bg-white text-ink-soft hover:border-navy-900/25',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <RevealGroup className="mt-8 grid gap-4 md:grid-cols-2">
              {filtered.map((doc) => (
                <RevealItem key={doc.id} className="h-full">
                  <article className="group flex h-full flex-col rounded-xl border border-hairline bg-white p-6 transition-colors hover:border-brand-cyan/30">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-mist">
                        <FileText className="h-4 w-4 text-brand-cyan" strokeWidth={1.5} />
                      </span>
                      <span className="text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted/60">
                        {doc.fileType || 'PDF'} · v{doc.version || '1.0'}
                      </span>
                    </div>

                    <h3 className="display-sm mt-5 text-ink">{doc.title}</h3>
                    <p className="mt-2 flex-1 text-[0.85rem] leading-relaxed text-ink-muted">{doc.description}</p>

                    <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
                      <span className="text-[0.65rem] uppercase tracking-[0.12em] text-ink-muted/60">
                        {doc.category}
                        {doc.fileSize ? ` · ${formatBytes(doc.fileSize)}` : ''}
                      </span>
                      {doc.fileUrl ? (
                        <a
                          href={doc.fileUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-brand-cyan transition-colors hover:text-ink"
                        >
                          <Download className="h-3.5 w-3.5" strokeWidth={1.8} />
                          Download
                        </a>
                      ) : (
                        <span className="text-[0.7rem] text-ink-muted/50">File pending</span>
                      )}
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          </>
        ) : (
          <div className="mt-10">
            <EmptyState icon={FileText} title="The document library is empty" body={data.emptyNote} />
            {data.categories?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {data.categories.map((cat) => {
                  const text = typeof cat === 'string' ? cat : cat.value
                  return (
                    <span
                      key={text}
                      className="rounded-full border border-hairline bg-white px-3.5 py-1.5 text-[0.72rem] text-ink-muted"
                    >
                      {text}
                    </span>
                  )
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}

/* --------------------------------- contact --------------------------------- */

function ContactSection({ data, settings }) {
  const contact = settings?.contact || {}
  const socials = settings?.socials || []

  return (
    <section id="contact" className="border-t border-hairline bg-white py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading label={data.label} heading={data.heading} body={data.body} />

          <Reveal delay={0.15}>
            <dl className="mt-10 space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" strokeWidth={1.6} />
                <div>
                  <dt className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-muted/60">Email</dt>
                  {contact.email ? (
                    <dd>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-[0.9rem] text-ink transition-colors hover:text-brand-cyan"
                      >
                        {contact.email}
                      </a>
                    </dd>
                  ) : (
                    <dd className="text-[0.85rem] text-ink-muted">
                      Address not yet published — use the enquiry form.
                    </dd>
                  )}
                </div>
              </div>

              {contact.location ? (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" strokeWidth={1.6} />
                  <div>
                    <dt className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-muted/60">Location</dt>
                    <dd className="text-[0.9rem] text-ink">{contact.location}</dd>
                  </div>
                </div>
              ) : null}

              {contact.responseTime ? (
                <div className="flex items-start gap-3">
                  <Timer className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" strokeWidth={1.6} />
                  <div>
                    <dt className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-muted/60">Response</dt>
                    <dd className="max-w-xs text-[0.85rem] leading-relaxed text-ink-soft">
                      {contact.responseTime}
                    </dd>
                  </div>
                </div>
              ) : null}
            </dl>
          </Reveal>

          {contact.inquiryNote ? (
            <Reveal delay={0.2}>
              <p className="mt-8 rounded-lg border border-hairline bg-mist/60 p-4 text-[0.8rem] leading-relaxed text-ink-muted">
                {contact.inquiryNote}
              </p>
            </Reveal>
          ) : null}

          {socials.length ? (
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap gap-4">
                {socials.map((social) => (
                  <a
                    key={social.label + social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[0.8rem] text-ink-soft transition-colors hover:text-brand-cyan"
                  >
                    {social.label}
                    <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={0.1}>
          <ContactForm
            subjects={data.subjects}
            formNote={data.formNote}
            formTitle={data.formTitle}
          />
        </Reveal>
      </div>
    </section>
  )
}

/* ----------------------------------- faq ----------------------------------- */

function FaqSection({ data }) {
  return (
    <section className="border-t border-hairline bg-mist py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading label={data.label} heading={data.heading} />
          <Reveal delay={0.15}>
            <div className="mt-8 flex items-center gap-2 text-[0.75rem] text-ink-muted">
              <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span>Still unclear? Ask us directly.</span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Accordion items={data.items} />
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export default function Resources() {
  const { content, documents, settings, getPage } = useContent()
  const hero = content('resources', 'hero', {})
  const page = getPage('resources')

  usePageMeta({
    title: page?.seoTitle,
    description: page?.seoDescription,
    path: '/resources',
  })

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        lead={hero.lead}
        note={hero.note}
        index="06"
      />
      <DocumentsSection data={content('resources', 'documents', {})} documents={documents} />
      <ContactSection data={content('resources', 'contact', {})} settings={settings} />
      <FaqSection data={content('resources', 'faq', {})} />
      <CtaSection data={content('resources', 'cta', {})} index="07" />
    </>
  )
}
