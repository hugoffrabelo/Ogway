import { BASE_PATH } from '@/lib/base-path'
import { Reveal } from '@/components/reveal'

// Mesma referência Lovisa Malin do Pillars/Benefits — fundo continua claro
// de propósito (entre Como funciona e Pillars, os dois já navy — três
// seções escuras seguidas ficaria pesado). Ver components/pillars.tsx.
// Aqui o fundo é a foto marmore_branco.webp sob um véu creme, então o
// texto é navy — a seção fica clara entre Como funciona e Pilares (navy).
const CAMEL = 'var(--lovisa-camel)'
const NAVY = 'var(--lovisa-navy)'
const highlight = { color: 'var(--lovisa-camel-ink)' }
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

const points = [
  {
    n: '01',
    title: 'Só saúde',
    body: 'Trabalhamos com clínicas, consultórios e laboratórios, nada além disso. Conhecemos prontuário, recepção e a sensibilidade de lidar com dado de saúde porque é o único setor que atendemos.',
  },
  {
    n: '02',
    title: 'Poucos clientes por vez',
    body: 'Atendemos um número limitado de clínicas, por escolha. Quando você entra em contato, fala com quem já conhece o histórico da sua clínica, não abre um chamado numa fila.',
  },
  {
    n: '03',
    title: 'Método, não modelo pronto',
    body: 'Cada projeto segue um roteiro de implementação baseado na ISO/IEC 27701, no NIST Privacy Framework e nos guias da ANPD, ajustado ao tamanho da clínica. Nada de documento genérico baixado da internet.',
  },
]

export function WhyDifferent() {
  return (
    <section
      id="diferenca"
      className="relative overflow-hidden"
      aria-labelledby="why-title"
      style={{ ...bodyFont, color: NAVY }}
    >
      {/* mármore como textura, sob um véu creme forte o bastante pra texto
          navy passar de 7:1 em qualquer veio */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BASE_PATH}/marmore_branco.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-background/85" />

      <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2
              id="why-title"
              className="text-3xl leading-tight font-medium tracking-wide text-balance uppercase sm:text-4xl lg:text-5xl"
              style={headingFont}
            >
              Por que a <span style={highlight}>Ogway</span>
            </h2>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-foreground">
              Não é generalismo de compliance. A proteção de dados de paciente
              exige um contexto que um painel genérico não tem.
            </p>
          </Reveal>

          <dl className="flex flex-col gap-12">
            {points.map((point, i) => (
              <Reveal key={point.title} delay={i * 90}>
                <dt
                  className="text-2xl leading-snug font-medium tracking-wide uppercase"
                  style={headingFont}
                >
                  {point.title}
                </dt>
                <dd className="mt-3 max-w-[60ch] leading-relaxed text-foreground">
                  {point.body}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
