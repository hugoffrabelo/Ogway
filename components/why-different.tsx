const points = [
  {
    title: 'Só saúde, de verdade',
    body: 'Vivemos o dia a dia de clínicas e consultórios. Entendemos prontuário, recepção, laboratório e a delicadeza de lidar com informação de saúde.',
  },
  {
    title: 'Atendimento próximo e boutique',
    body: 'Poucos clientes por vez, por escolha. Você fala com quem conhece a sua clínica pelo nome — não com um ticket em uma fila.',
  },
  {
    title: 'Especialistas em encarregado',
    body: 'Fazemos uma coisa com profundidade: ser o encarregado da sua clínica. Não somos uma ferramenta genérica de compliance com tudo dentro.',
  },
]

export function WhyDifferent() {
  return (
    <section
      id="diferenca"
      className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32"
      aria-labelledby="why-title"
    >
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-5 flex items-center gap-3 text-sm tracking-[0.2em] text-muted-foreground uppercase">
            <span className="h-px w-8 bg-accent" />
            Por que a Ogway
          </p>
          <h2
            id="why-title"
            className="font-serif text-3xl leading-tight font-semibold text-balance text-primary sm:text-4xl lg:text-5xl"
          >
            Não somos mais uma plataforma. Somos gente ao seu lado.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            A proteção de dados na saúde pede sensibilidade, contexto e presença
            — coisas que nenhum painel resolve sozinho.
          </p>
        </div>

        <dl className="flex flex-col divide-y divide-border">
          {points.map((point) => (
            <div key={point.title} className="py-8 first:pt-0 last:pb-0">
              <dt className="font-serif text-2xl font-semibold text-primary">
                {point.title}
              </dt>
              <dd className="mt-3 leading-relaxed text-muted-foreground">
                {point.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
