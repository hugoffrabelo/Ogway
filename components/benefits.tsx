import { BASE_PATH } from '@/lib/base-path'
import { Reveal } from '@/components/reveal'

// Referência Lovisa Malin — CAMEL/NAVY vêm de --lovisa-camel/--lovisa-navy
// (app/tokens.css), não dos tokens --accent/--primary. Ver
// components/pillars.tsx pra mais contexto.
const CAMEL = 'var(--lovisa-camel)'
const NAVY = 'var(--lovisa-navy)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

const highlight = { color: 'var(--lovisa-camel-ink)' }

const benefits = [
  {
    kicker: 'vale-para-todas',
    title: (
      <>
        A <span style={highlight}>LGPD</span> vale para toda{' '}
        <span style={highlight}>clínica</span>.
      </>
    ),
    body: 'Dado de saúde é dado sensível, e tratá-lo é atividade de alto risco. Por isso a dispensa de encarregado para empresas pequenas não socorre a clínica: ela precisa de encarregado, base legal, canal com o paciente e segurança.',
  },
  {
    kicker: 'prazos',
    title: (
      <>
        Cada obrigação tem <span style={highlight}>uma data</span>.
      </>
    ),
    body: 'Pedido de paciente, comunicação de incidente, revisão de documentos: cada um tem prazo em lei ou em resolução da ANPD. Eu acompanho todos, sem correria de última hora.',
  },
  {
    kicker: 'fiscalizacao',
    title: (
      <>
        Se a <span style={highlight}>ANPD</span> pedir, a clínica tem o que{' '}
        <span style={highlight}>mostrar</span>.
      </>
    ),
    body: 'Registro das operações, políticas, aviso de privacidade e relatórios de impacto organizados e prontos, não numa pasta improvisada na hora do pedido.',
  },
]

export function Benefits() {
  return (
    <section
      id="o-servico"
      className="relative overflow-hidden py-24 lg:py-32"
      aria-labelledby="benefits-title"
      style={bodyFont}
    >
      {/* forma_fundo2.webp num recorte trapezoidal da borda direita até a
          metade da página — os cards continuam legíveis porque têm fundo
          sólido (bg-card) por cima da imagem. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 58% 100%)',
          backgroundImage: `url(${BASE_PATH}/forma_fundo2.webp)`,
          // 'auto' = tamanho nativo da imagem (1248x832), sem esticar —
          // nunca fica maior que os pixels originais, então não pixela.
          backgroundSize: 'auto',
          backgroundRepeat: 'no-repeat',
          // ancorada na direita, não centralizada — o recorte também
          // termina na borda direita, então a imagem precisa encostar ali
          // pra não sobrar vão vazio (tamanho nativo é menor que a seção).
          backgroundPosition: 'right center',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <h2
            id="benefits-title"
            className="text-3xl leading-tight font-medium tracking-wide text-balance uppercase sm:text-4xl lg:text-5xl"
            style={{ ...headingFont, color: NAVY }}
          >
            O que muda na sua <span style={highlight}>clínica</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-foreground">
            Com um encarregado dedicado ao seu lado, a LGPD deixa de ser uma
            pendência e vira rotina.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {benefits.map((item, i) => (
            <Reveal
              as="article"
              key={item.kicker}
              delay={i * 90}
              className="flex flex-col rounded-2xl bg-card p-8 lg:p-10"
            >
              <h3
                className="text-xl leading-snug font-medium tracking-wide uppercase sm:text-2xl"
                style={{ ...headingFont, color: NAVY }}
              >
                {item.title}
              </h3>
              <p className="mt-4 leading-relaxed text-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
