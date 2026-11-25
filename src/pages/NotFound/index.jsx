import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { usePageMeta } from '../../hooks/usePageMeta'
import { MolecularCanvas } from '../../components/scientific/MolecularCanvas'
import { Button } from '../../components/common/Button'
import { Reveal } from '../../components/animations/Reveal'

export default function NotFound() {
  usePageMeta({ title: 'Page not found' })

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 grid-fine opacity-30 grid-mask" aria-hidden="true" />
      <MolecularCanvas className="pointer-events-none absolute inset-0 h-full w-full opacity-40" maxParticles={40} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full glow-cyan opacity-25 blur-3xl" />

      <div className="shell relative py-32 text-center">
        <Reveal y={10}>
          <p className="label text-brand-teal-soft">Error 404</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display-xl mt-6 font-light text-white/90">Signal lost.</h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-md text-[0.95rem] leading-relaxed text-white/50">
            This route does not exist — or the content it pointed to has been moved. The research
            continues elsewhere.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button to="/" variant="teal">
              Return home
            </Button>
            <Button to="/research" variant="ghostDark" icon={false}>
              Research status
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="mx-auto mt-16 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/[0.08] pt-6 text-[0.7rem] text-white/30">
            {[
              ['The Problem', '/problem'],
              ['Innovation', '/innovation'],
              ['Team', '/team'],
              ['Resources', '/resources'],
            ].map(([label, to]) => (
              <Link key={to} to={to} className="transition-colors hover:text-white/70">
                {label}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
