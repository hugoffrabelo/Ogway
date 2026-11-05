import { Reveal } from '@/components/reveal'

const NAVY = 'var(--lovisa-navy)'
const CAMEL = 'var(--lovisa-camel-ink)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

// Respostas revisadas contra a LGPD e as resoluções da ANPD citadas. Ao
// mudar alguma, confira a fonte — é a página que mais atrai pergunta de
// fiscal e de concorrente.
export const PERGUNTAS = [
  {
    p: 'Minha clínica é obrigada a ter um encarregado?',
    r: 'Na prática, sim. A Resolução CD/ANPD nº 2/2022 dispensa os agentes de pequeno porte de nomear encarregado, mas a dispensa não vale para quem faz tratamento de alto risco. Clínica trata dado de saúde, que é dado sensível, e esse tratamento pode afetar de forma significativa os direitos dos pacientes. É o retrato do alto risco descrito no art. 4º da resolução. Por isso a clínica não deve contar com a dispensa.',
  },
  {
    p: 'Posso contratar só uma parte?',
    r: 'Pode. A consultoria parcial resolve uma frente específica (site, contratos ou sistemas), e os documentos avulsos atendem quem precisa de uma política, um mapeamento ou um relatório de impacto. Se depois quiser o programa completo, nada do que foi feito se perde.',
  },
  {
    p: 'Quanto tempo leva a adequação completa?',
    r: 'Depende do tamanho da clínica e do que já existe. O diagnóstico, na terceira etapa, mostra exatamente o que falta e vira um plano com prazos. Você sabe o cronograma antes de qualquer implementação começar.',
  },
  {
    p: 'Vou precisar mostrar prontuários?',
    r: 'Não. O mapeamento é feito a partir da descrição dos processos: quem coleta, onde guarda, com quem compartilha. Quando for preciso ver um sistema, olhamos juntos, na clínica, sem copiar nada. Tudo sob contrato com cláusula de confidencialidade.',
  },
  {
    p: 'E se acontecer um vazamento?',
    r: 'Existe um plano de resposta pronto antes disso. Avaliamos o risco aos pacientes e, quando houver risco ou dano relevante, comunicamos a ANPD e os titulares no prazo da Resolução CD/ANPD nº 15/2024.',
  },
]

export function Faq() {
  return (
    <section
      id="duvidas"
      className="bg-card py-24 lg:py-32"
      aria-labelledby="faq-title"
      style={bodyFont}
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <Reveal>
          <h2
            id="faq-title"
            className="text-3xl leading-tight font-medium tracking-wide uppercase sm:text-4xl lg:text-5xl"
            style={{ ...headingFont, color: NAVY }}
          >
            Dúvidas <span style={{ color: CAMEL }}>comuns</span>
          </h2>
          <p className="mt-6 max-w-[36ch] text-lg leading-relaxed text-foreground">
            O que as clínicas mais perguntam antes da primeira conversa.
          </p>
        </Reveal>

        <div className="flex flex-col gap-3">
          {PERGUNTAS.map((q, i) => (
            <Reveal key={q.p} delay={i * 60}>
              <details className="group rounded-2xl bg-background px-6 py-5 open:pb-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:ring-offset-4 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                  {q.p}
                  <span
                    aria-hidden="true"
                    className="mt-1 text-2xl leading-none transition-transform group-open:rotate-45"
                    style={{ color: CAMEL }}
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[62ch] leading-relaxed text-foreground">{q.r}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
