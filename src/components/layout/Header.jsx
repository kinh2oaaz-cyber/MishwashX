import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { cn } from '../../lib/utils/cn'
import { useScrollLock, useEscapeKey } from '../../hooks/useOverlay'
import { Logo } from '../common/Logo'
import { Button } from '../common/Button'

export function Header() {
  const { settings } = useContent()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useScrollLock(menuOpen)
  useEscapeKey(() => setMenuOpen(false), menuOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const links = settings?.nav?.links || []
  const cta = settings?.nav?.cta
  const announcement = settings?.announcement

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to.split('#')[0])
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-[100]">
        {/* Disclosure strip */}
        <AnimatePresence initial={false}>
          {announcement?.enabled && !scrolled ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-b border-white/[0.07] bg-navy-950"
            >
              <div className="shell flex items-center justify-center gap-3 py-2 text-center">
                <span className="hidden h-1 w-1 shrink-0 rounded-full bg-brand-teal sm:block" />
                <p className="text-[0.66rem] leading-tight tracking-[0.01em] text-white/55">
                  {announcement.text}
                </p>
                {announcement.linkTo ? (
                  <Link
                    to={announcement.linkTo}
                    className="hidden shrink-0 items-center gap-1 text-[0.66rem] font-medium text-brand-teal-soft hover:text-white sm:inline-flex"
                  >
                    {announcement.linkLabel || 'Learn more'}
                    <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                  </Link>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div
          className={cn(
            'transition-all duration-500',
            scrolled
              ? 'border-b border-white/[0.08] bg-navy-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-navy-950/88'
              : 'bg-transparent',
          )}
        >
          <div className="shell flex h-[68px] items-center justify-between gap-6 md:h-[76px]">
            <Link
              to="/"
              className="group relative z-10 text-white transition-opacity hover:opacity-90"
              aria-label="Mishawash X — home"
            >
              <Logo brand={settings?.brand} />
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors duration-300',
                    isActive(link.to) ? 'text-white' : 'text-white/55 hover:text-white/90',
                  )}
                >
                  {link.label}
                  {isActive(link.to) ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-brand-teal"
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : null}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {settings?.nav?.showCta && cta?.label ? (
                <div className="hidden md:block">
                  <Button to={cta.to} variant="teal" size="sm" icon={false} magnetic={false}>
                    {cta.label}
                  </Button>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 lg:hidden"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[120] flex flex-col bg-navy-950 text-white lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="pointer-events-none absolute inset-0 grid-fine opacity-40" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full glow-teal blur-3xl" aria-hidden="true" />

            <div className="relative flex h-[68px] items-center justify-between px-5">
              <Logo brand={settings?.brand} compact />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white"
                aria-label="Close menu"
              >
                <X className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </button>
            </div>

            <nav
              className="relative flex flex-1 flex-col justify-start gap-0.5 overflow-y-auto px-6 py-5"
              aria-label="Mobile"
            >
              {links.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.045, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-baseline justify-between border-b border-white/[0.07] py-3.5"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="label text-white/25">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-display text-[1.65rem] font-light tracking-[-0.03em] text-white/90 group-hover:text-brand-teal-soft">
                        {link.label}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white/25 group-hover:text-brand-teal-soft" strokeWidth={1.5} />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="relative shrink-0 px-6 pb-8">
              <Button to={cta?.to || '/resources#contact'} variant="teal" className="w-full" icon={false}>
                {cta?.label || 'Collaborate'}
              </Button>
              <p className="mt-5 text-[0.65rem] leading-relaxed text-white/30">
                {settings?.brand?.descriptor}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
