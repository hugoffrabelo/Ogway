import { Reveal } from '@/components/reveal'
import { ShellPattern, ShellWatermark } from '@/components/shell-pattern'

/**
 * Cores (--lovisa-navy/--lovisa-camel em app/tokens.css) e fontes da
 * referência Lovisa Malin Hotel — as fontes (Cinzel Medium, alternativa
 * gratuita da Trajan Pro 3 paga da Adobe; Poppins Light) são registradas
 * em app/layout.tsx, confirmadas pelo cliente no painel de texto do
 * Figma. As cores ficam num token à parte de --primary/--accent porque
 * esses são compartilhados com cockpit/portal (contraste AA já validado
 * lá) — --lovisa-* não muda com o tema, de propósito.
 */
const NAVY = 'var(--lovisa-navy)'
const CAMEL = 'var(--lovisa-camel)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

export function Pillars() {
  return (
    <section
      id="pilares"
      className="relative overflow-hidden py-24 text-white lg:py-32"
      style={{ backgroundColor: NAVY, ...bodyFont }}
      aria-labelledby="pillars-title"
    >
      {/* a textura de hexágonos abre um "vão" no canto onde a marca fica,
          pra não embolar as duas malhas de linha uma na outra */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            'radial-gradient(38% 42% at 90% 8%, transparent 62%, black 100%)',
          maskImage:
            'radial-gradient(38% 42% at 90% 8%, transparent 62%, black 100%)',
        }}
      >
        <ShellPattern
          className="h-full w-full text-white"
          opacity={0.06}
          size={58}
        />
      </div>
      <ShellWatermark className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 text-white/10 lg:h-[22rem] lg:w-[22rem]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <p className="mb-10 flex items-center gap-3 text-sm font-light tracking-[0.2em] text-white/60 uppercase">
            <span className="h-px w-8" style={{ backgroundColor: CAMEL }} />
            Nossos pilares
          </p>

          <h2
            id="pillars-title"
            className="flex flex-wrap items-center gap-x-5 gap-y-8 uppercase tracking-wide"
            style={headingFont}
          >
            <span
              className="text-3xl font-medium sm:text-4xl lg:text-5xl"
              style={{ color: CAMEL }}
            >
              Confiança,
            </span>
            <span className="text-4xl leading-none font-medium sm:text-5xl lg:text-7xl">
              cuidado contínuo
            </span>
            <span className="text-3xl font-medium sm:text-4xl lg:text-5xl">
              de quem entende
            </span>
            <span
              className="text-4xl leading-none font-medium sm:text-5xl lg:text-7xl"
              style={{ color: CAMEL }}
            >
              saúde,
            </span>
            <span className="text-3xl font-medium sm:text-4xl lg:text-5xl">
              presença
            </span>
            <span className="text-4xl leading-none font-medium sm:text-5xl lg:text-7xl">
              humana
            </span>
            <span
              className="text-3xl font-medium sm:text-4xl lg:text-5xl"
              style={{ color: CAMEL }}
            >
              de perto.
            </span>
          </h2>
        </Reveal>

        <Reveal
          delay={100}
          className="mt-16 flex flex-col items-start gap-8 border-t border-white/15 pt-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md font-light leading-relaxed text-white/70">
            Isso não é um slogan — é como organizamos o trabalho todo mês:
            perto o suficiente pra conhecer sua clínica pelo nome, técnico o
            suficiente pra levar a LGPD a sério.
          </p>
          <a
            href="#contato"
            className="group inline-flex h-12 shrink-0 items-center justify-center rounded-full px-8 text-base font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(189,160,120,0.7)] active:translate-y-0"
            style={{ backgroundColor: CAMEL, color: NAVY }}
          >
            Agende uma conversa
          </a>
        </Reveal>
      </div>
    </section>
  )
}
