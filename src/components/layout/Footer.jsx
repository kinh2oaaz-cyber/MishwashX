import { Link } from 'react-router-dom'
import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { BrandMark } from '../common/Logo'
import { Button } from '../common/Button'

export function Footer() {
  const { settings } = useContent()
  const brand = settings?.brand
  const footer = settings?.footer
  const contact = settings?.contact
  const socials = settings?.socials || []
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 grid-fine opacity-[0.35]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full glow-cyan opacity-30 blur-3xl"
        aria-hidden="true"
      />

      <div className="shell relative">
        {/* Top */}
        <div className="grid gap-14 border-b border-white/[0.08] py-16 lg:grid-cols-[1.35fr_1fr] lg:gap-20 lg:py-20">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark brand={brand} size={34} />
              <span className="label text-white/40">{brand?.name || 'Mishawash X'}</span>
            </div>
            <p className="display-md mt-7 max-w-xl font-light text-white/90">
              Diagnostics that reach further.
            </p>
            <p className="mt-5 max-w-lg text-[0.9rem] leading-relaxed text-white/45">
              {footer?.statement}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to="/resources#contact" variant="teal" size="sm" icon={false}>
                Collaborate with us
              </Button>
              <Button to="/research" variant="ghostDark" size="sm" icon>
                Research status
              </Button>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            {(footer?.columns || []).map((column) => (
              <div key={column.title}>
                <h2 className="label text-white/35">{column.title}</h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.to + link.label}>
                      <Link
                        to={link.to}
                        className="group inline-flex items-center gap-1.5 text-[0.87rem] text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                        <ArrowUpRight
                          className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-60"
                          strokeWidth={1.6}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="sm:col-span-2">
              <h2 className="label text-white/35">Contact</h2>
              <div className="mt-5 space-y-3 text-[0.87rem]">
                {contact?.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-brand-teal-soft"
                  >
                    <Mail className="h-3.5 w-3.5" strokeWidth={1.6} />
                    {contact.email}
                  </a>
                ) : (
                  <p className="flex items-start gap-2 text-white/35">
                    <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
                    <span>
                      Contact address not yet published.{' '}
                      <Link to="/resources#contact" className="text-white/55 underline underline-offset-4">
                        Send an enquiry
                      </Link>
                    </span>
                  </p>
                )}
                {contact?.location ? (
                  <p className="text-white/40">{contact.location}</p>
                ) : null}
                {socials.length ? (
                  <div className="flex flex-wrap gap-4 pt-2">
                    {socials.map((social) => (
                      <a
                        key={social.label + social.url}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.8rem] text-white/55 underline-offset-4 hover:text-white hover:underline"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div className="relative select-none overflow-hidden py-10" aria-hidden="true">
          <p className="whitespace-nowrap font-display text-[clamp(3rem,12vw,9rem)] font-light leading-none tracking-[-0.05em] text-white/[0.045]">
            MISHWASH X
          </p>
        </div>

        {/* Legal */}
        <div className="border-t border-white/[0.08] py-8">
          <p className="max-w-3xl text-[0.72rem] leading-relaxed text-white/30">
            {footer?.disclaimer}
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.72rem] text-white/30">
              © {year} {footer?.credits || 'Mishawash X'}
            </p>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-[0.72rem] text-white/30 transition-colors hover:text-white/70"
              >
                Back to top
                <ArrowUp className="h-3 w-3" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
