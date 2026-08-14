import { BASE_PATH } from '@/lib/base-path'

// Referência Lovisa Malin — CAMEL/NAVY vêm de --lovisa-camel/--lovisa-navy
// (app/tokens.css), não dos tokens --accent/--primary. Ver
// components/pillars.tsx pra mais contexto.
const CAMEL = 'var(--lovisa-camel)'
const NAVY = 'var(--lovisa-navy)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

const highlight = { color: CAMEL }

const benefits = [
  {
    kicker: 'Obrigação legal, resolvida',
    title: (
      <>
        A <span style={highlight}>LGPD</span> exige um{' '}
        <span style={highlight}>encarregado</span>.
      </>
    ),
    body: 'Nomeação formal, registrada e visível — o requisito que toda clínica de saúde precisa cumprir desde 2020, sem mais pendência em aberto.',
  },
  {
    kicker: 'Prazos da lei, sob controle',
    title: (
      <>
        Cada obrigação tem <span style={highlight}>uma data</span>.
      </>
    ),
    body: 'Resposta a pacientes, atualização de documentos, registro de incidentes — tudo dentro do prazo que a LGPD determina, sem correria de última hora.',
  },
  {
    kicker: 'Documentação que resiste a uma fiscalização',
    title: (
      <>
        Se a <span style={highlight}>ANPD</span> pedir, a clínica tem o que{' '}
        <span style={highlight}>mostrar</span>.
      </>
    ),
    body: 'Registro de tratamento, políticas, aviso de privacidade — organizados e prontos, não numa pasta improvisada na hora do pedido.',
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
      {/* forma_fundo2.jpg num recorte trapezoidal da borda direita até a
          metade da página — o card à direita continua legível porque
          glass-panel já tem seu próprio fundo translúcido, independente
          do que está atrás. É decoração atrás do conteúdo, que continua
          exatamente onde estava. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 58% 100%)',
          backgroundImage: `url(${BASE_PATH}/forma_fundo2.jpg)`,
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
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-3 text-sm font-light tracking-[0.2em] text-muted-foreground uppercase">
            <span className="h-px w-8" style={{ backgroundColor: CAMEL }} />
            O que muda
          </p>
          <h2
            id="benefits-title"
            className="text-3xl leading-tight font-medium tracking-wide text-balance uppercase sm:text-4xl lg:text-5xl"
            style={{ ...headingFont, color: NAVY }}
          >
            O que muda com um{' '}
            <span style={{ color: CAMEL }}>encarregado dedicado</span> ao seu
            lado?
          </h2>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {benefits.map((item) => (
            <article
              key={item.kicker}
              className="glass-panel flex flex-col rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1 lg:p-10"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--card) 85%, transparent)',
              }}
            >
              <span
                className="text-sm font-medium tracking-wide"
                style={{ color: CAMEL }}
              >
                {item.kicker}
              </span>
              <h3
                className="mt-4 text-2xl leading-snug font-medium tracking-wide uppercase"
                style={{ ...headingFont, color: NAVY }}
              >
                {item.title}
              </h3>
              <p className="mt-4 font-light leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
