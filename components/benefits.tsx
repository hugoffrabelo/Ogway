const benefits = [
  {
    kicker: 'Paz de espírito',
    title: 'Você volta a dormir tranquilo.',
    body: 'Alguém sênior olhando pela proteção de dados da clínica todos os dias — não uma planilha esquecida numa gaveta, nem uma pendência que pesa na sua cabeça.',
  },
  {
    kicker: 'Prazos que não escapam',
    title: 'Nada importante passa batido.',
    body: 'Acompanhamos obrigações, respostas a pacientes e ajustes com antecedência. Você é avisado antes, com clareza, sem correria de última hora.',
  },
  {
    kicker: 'A confiança do paciente',
    title: 'O cuidado começa antes da consulta.',
    body: 'Quando um paciente entrega seus dados, ele entrega também sua confiança. Cuidamos para que essa confiança seja honrada em cada etapa.',
  },
]

export function Benefits() {
  return (
    <section
      id="o-servico"
      className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32"
      aria-labelledby="benefits-title"
    >
      <div className="max-w-2xl">
        <p className="mb-5 flex items-center gap-3 text-sm tracking-[0.2em] text-muted-foreground uppercase">
          <span className="h-px w-8 bg-accent" />
          O que muda
        </p>
        <h2
          id="benefits-title"
          className="font-serif text-3xl leading-tight font-semibold text-balance text-primary sm:text-4xl lg:text-5xl"
        >
          O que muda com um encarregado dedicado ao seu lado.
        </h2>
      </div>

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {benefits.map((item) => (
          <article
            key={item.kicker}
            className="glass-panel flex flex-col rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1 lg:p-10"
          >
            <span className="text-sm font-medium tracking-wide text-accent">
              {item.kicker}
            </span>
            <h3 className="mt-4 font-serif text-2xl leading-snug font-semibold text-primary">
              {item.title}
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
