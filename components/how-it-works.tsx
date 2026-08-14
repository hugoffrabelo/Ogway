import { ShellPattern } from '@/components/shell-pattern'

// Mesma referência Lovisa Malin do Pillars — ver components/pillars.tsx.
const CAMEL = 'var(--lovisa-camel)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

const highlight = { color: CAMEL }

const steps = [
  {
    n: '01',
    title: (
      <>
        Uma conversa para <span style={highlight}>entender</span>
      </>
    ),
    body: 'Começamos ouvindo. Em 20 minutos, mapeamos onde os dados dos pacientes passam e avaliamos 40 pontos de controle exigidos pela lei. Sem formulários frios, sem jargão — você sai com um score claro de onde a clínica está.',
  },
  {
    n: '02',
    title: (
      <>
        Um plano no seu <span style={highlight}>ritmo</span>
      </>
    ),
    body: 'Priorizamos o que a LGPD exige primeiro: nomeação formal do encarregado, mapeamento de dados, documentos obrigatórios e canal para pacientes. Cada passo é explicado em português claro, no tempo da sua equipe.',
  },
  {
    n: '03',
    title: (
      <>
        <span style={highlight}>Conformidade</span> que continua
      </>
    ),
    body: 'Prazos legais acompanhados, respostas a pacientes dentro do prazo que a lei determina, documentação sempre pronta para uma fiscalização. Você não pensa mais nisso — nós pensamos.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-primary text-white"
      aria-labelledby="how-title"
      style={{ backgroundColor: 'var(--lovisa-navy)', ...bodyFont }}
    >
      <ShellPattern
        className="absolute inset-0 h-full w-full text-white"
        opacity={0.06}
        size={60}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-3 text-sm font-light tracking-[0.2em] text-white/60 uppercase">
            <span className="h-px w-8" style={{ backgroundColor: CAMEL }} />
            Como funciona
          </p>
          <h2
            id="how-title"
            className="text-3xl leading-tight font-medium tracking-wide text-balance uppercase sm:text-4xl lg:text-5xl"
            style={headingFont}
          >
            Três passos calmos, do primeiro contato à{' '}
            <span style={highlight}>conformidade contínua</span> com a{' '}
            <span style={highlight}>LGPD</span>.
          </h2>
        </div>

        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step) => (
            <li key={step.n} className="border-t border-white/15 pt-6">
              <span
                className="text-2xl"
                style={{ ...headingFont, color: CAMEL }}
              >
                {step.n}
              </span>
              <h3
                className="mt-4 text-2xl leading-snug font-medium tracking-wide uppercase"
                style={headingFont}
              >
                {step.title}
              </h3>
              <p className="mt-4 font-light leading-relaxed text-white/70">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
