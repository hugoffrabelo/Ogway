import Link from 'next/link'
import { ShellPattern } from '@/components/shell-pattern'
import { Reveal } from '@/components/reveal'
import { AutodiagnosticoDemo } from '@/components/autodiagnostico-demo'

// Antes: as 6 etapas da adequação em texto. Agora a home mostra a
// autoavaliação funcionando (animação em código) e leva para /autoavaliacao;
// as 6 etapas detalhadas ficam em /servicos/adequacao-lgpd-clinicas.
const NAVY = 'var(--lovisa-navy)'
const CAMEL = 'var(--lovisa-camel)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

export function HowItWorks() {
  return (
    <section
      id="autodiagnostico"
      className="relative overflow-hidden text-white"
      aria-labelledby="how-title"
      style={{ backgroundColor: NAVY, ...bodyFont }}
    >
      <ShellPattern className="absolute inset-0 h-full w-full text-white" opacity={0.06} size={60} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-8 lg:py-32">
        <Reveal>
          <h2
            id="how-title"
            className="text-3xl leading-tight font-medium tracking-wide text-balance uppercase sm:text-4xl lg:text-5xl"
            style={headingFont}
          >
            Como está sua <span style={{ color: CAMEL }}>clínica</span>?
          </h2>
          <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-white/90">
            Responda 20 perguntas e veja o nível de maturidade da clínica em
            cinco minutos. Gratuito.
          </p>
          <div className="mt-10 flex flex-col items-start gap-5">
            <Link
              href="/autoavaliacao"
              className="inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--lovisa-navy)] focus-visible:outline-none active:translate-y-0"
              style={{ backgroundColor: CAMEL, color: NAVY }}
            >
              Fazer minha autoavaliação
            </Link>
            <Link
              href="/servicos/adequacao-lgpd-clinicas"
              className="text-white/90 underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--lovisa-camel)]"
            >
              Ver as 6 etapas da adequação
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <AutodiagnosticoDemo />
        </Reveal>
      </div>
    </section>
  )
}
