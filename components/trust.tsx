const signals = [
  {
    stat: 'LGPD',
    label: 'Prática dedicada à realidade de clínicas e consultórios',
  },
  {
    stat: 'Sigilo',
    label: 'Trato reservado, como se espera de quem cuida de saúde',
  },
  {
    stat: '1:1',
    label: 'Um ponto de contato humano, sempre a mesma pessoa',
  },
]

export function Trust() {
  return (
    <section
      className="border-y border-border bg-card"
      aria-label="Sinais de confiança"
    >
      <div className="mx-auto grid max-w-6xl gap-px overflow-hidden px-6 py-4 sm:grid-cols-3 lg:px-8">
        {signals.map((item) => (
          <div
            key={item.stat}
            className="flex flex-col items-start gap-1 px-2 py-8 sm:items-center sm:px-6 sm:text-center"
          >
            <span className="font-serif text-3xl font-semibold text-primary">
              {item.stat}
            </span>
            <span className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
