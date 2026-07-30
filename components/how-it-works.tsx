import { ShellPattern } from '@/components/shell-pattern'

const steps = [
  {
    n: '01',
    title: 'Uma conversa para entender',
    body: 'Começamos ouvindo. Como a clínica funciona, o que preocupa, onde os dados dos pacientes passam. Sem formulários frios, sem jargão.',
  },
  {
    n: '02',
    title: 'Um plano no seu ritmo',
    body: 'Organizamos o que precisa de atenção e cuidamos do essencial primeiro. Cada passo é explicado em português claro, no tempo da sua equipe.',
  },
  {
    n: '03',
    title: 'Presença que continua',
    body: 'Seguimos ao seu lado como encarregado: acompanhando prazos, respondendo pacientes e ajustando o que muda ao longo do tempo.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-primary text-primary-foreground"
      aria-labelledby="how-title"
    >
      <ShellPattern
        className="absolute inset-0 h-full w-full text-primary-foreground"
        opacity={0.06}
        size={60}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-primary-foreground/60">
            <span className="h-px w-8 bg-accent" />
            Como funciona
          </p>
          <h2
            id="how-title"
            className="font-serif text-3xl leading-tight font-semibold text-balance sm:text-4xl lg:text-5xl"
          >
            Três passos calmos, do primeiro contato ao cuidado contínuo.
          </h2>
        </div>

        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step) => (
            <li key={step.n} className="border-t border-primary-foreground/15 pt-6">
              <span className="font-serif text-2xl text-accent">{step.n}</span>
              <h3 className="mt-4 font-serif text-2xl leading-snug font-semibold">
                {step.title}
              </h3>
              <p className="mt-4 leading-relaxed text-primary-foreground/70">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
