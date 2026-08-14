import { BASE_PATH } from '@/lib/base-path'

// Mesma referência Lovisa Malin do Pillars/Benefits — fundo continua claro
// de propósito (entre Como funciona e Pillars, os dois já navy — três
// seções escuras seguidas ficaria pesado). Ver components/pillars.tsx.
// Aqui o fundo é a foto marmore_branco.jpg (não a cor sólida --lovisa-navy),
// então o texto é branco com destaque pontual em camelo.
const CAMEL = 'var(--lovisa-camel)'
const highlight = { color: CAMEL }
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

const points = [
  {
    n: '01',
    title: 'Só saúde',
    body: 'Trabalhamos com clínicas, consultórios e laboratórios — nada além disso. Conhecemos prontuário, recepção e a sensibilidade de lidar com dado de saúde porque é o único setor com que trabalhamos.',
  },
  {
    n: '02',
    title: 'Poucos clientes por vez',
    body: 'Atendemos um número limitado de clínicas, por escolha. Quando você entra em contato, fala com quem já conhece o histórico da sua clínica — não abre um chamado numa fila.',
  },
  {
    n: '03',
    title: 'Especialistas em LGPD para saúde',
    body: 'Fazemos uma coisa com profundidade: manter clínicas em conformidade com a LGPD. Não é um módulo dentro de uma ferramenta genérica de compliance — é o único serviço que oferecemos.',
  },
]

export function WhyDifferent() {
  return (
    <section
      id="diferenca"
      className="relative overflow-hidden text-white"
      aria-labelledby="why-title"
      style={bodyFont}
    >
      {/* marmore_branco.jpg como fundo da seção inteira — véu escuro o
          bastante pra texto branco ler bem por cima */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${BASE_PATH}/marmore_branco.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-5 flex items-center gap-3 text-sm font-light tracking-[0.2em] text-white/60 uppercase">
              <span className="h-px w-8" style={{ backgroundColor: CAMEL }} />
              Por que a Ogway
            </p>
            <h2
              id="why-title"
              className="text-3xl leading-tight font-medium tracking-wide text-balance uppercase sm:text-4xl lg:text-5xl"
              style={headingFont}
            >
              Especialização em <span style={highlight}>saúde</span>, não
              generalismo de compliance.
            </h2>
            <p className="mt-6 max-w-md font-light leading-relaxed text-white/70">
              A proteção de dados de paciente exige contexto que um painel
              genérico não tem.
            </p>
          </div>

          <dl className="flex flex-col divide-y divide-white/15">
            {points.map((point) => (
              <div key={point.title} className="py-8 first:pt-0 last:pb-0">
                <span className="text-sm" style={{ ...headingFont, ...highlight }}>
                  {point.n}
                </span>
                <dt
                  className="mt-1 text-2xl leading-snug font-medium tracking-wide uppercase"
                  style={headingFont}
                >
                  {point.title}
                </dt>
                <dd className="mt-3 font-light leading-relaxed text-white/70">
                  {point.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
