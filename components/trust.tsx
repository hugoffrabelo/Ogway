// Mesma referência Lovisa Malin do resto da landing — ver components/pillars.tsx.
const NAVY = 'var(--lovisa-navy)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

const signals = [
  {
    stat: '18',
    label: 'Pontos da LGPD que toda clínica precisa cumprir, verificados um a um.',
  },
  {
    stat: '0',
    label: 'Dado de paciente que sai da sua clínica sem necessidade — nem para nós.',
  },
  {
    stat: '1:1',
    label: 'Um ponto de contato humano, sempre a mesma pessoa.',
  },
]

export function Trust() {
  return (
    <section
      className="border-y border-border bg-card"
      aria-label="Sinais de confiança"
      style={bodyFont}
    >
      <div className="mx-auto grid max-w-6xl gap-px overflow-hidden px-6 py-4 sm:grid-cols-3 lg:px-8">
        {signals.map((item) => (
          <div
            key={item.stat}
            className="flex flex-col items-start gap-1 px-2 py-8 sm:items-center sm:px-6 sm:text-center"
          >
            <span
              className="text-3xl font-medium"
              style={{ ...headingFont, color: NAVY }}
            >
              {item.stat}
            </span>
            <span className="max-w-xs font-light text-sm leading-relaxed text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
