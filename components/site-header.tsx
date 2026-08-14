import { ShellMark, ShellPattern } from '@/components/shell-pattern'

const nav = [
  { label: 'O serviço', href: '#o-servico' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Por que a Ogway', href: '#diferenca' },
  { label: 'Pilares', href: '#pilares' },
  { label: 'Quem cuida', href: '#quem-cuida' },
]

// Cinzel/Poppins — mesma referência do Lovisa Malin usada em Pillars, ver
// components/pillars.tsx. Registradas em app/layout.tsx. NAVY vem de
// --lovisa-navy (app/tokens.css) — o wordmark precisa bater exatamente com
// o ShellMark ao lado (components/shell-pattern.tsx), não com --primary.
const cinzel = { fontFamily: 'var(--font-cinzel)' }
const poppins = { fontFamily: 'var(--font-poppins)' }
const NAVY = 'var(--lovisa-navy)'
const CAMEL = 'var(--lovisa-camel)'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 overflow-hidden border-b border-border/60 bg-background/85 backdrop-blur-md">
      <ShellPattern
        className="absolute inset-0 h-full w-full text-primary"
        opacity={0.05}
        size={22}
      />
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <a
          href="#topo"
          className="flex items-center gap-3 text-primary"
          aria-label="Ogway — página inicial"
        >
          <ShellMark className="h-8 w-8" />
          <span
            className="text-2xl leading-none font-medium tracking-wide uppercase"
            style={{ ...cinzel, color: NAVY }}
          >
            Ogway
          </span>
        </a>

        <nav className="hidden items-center gap-2 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="glass-panel rounded-full px-4 py-2 text-xs font-light tracking-wider text-muted-foreground uppercase transition-colors hover:text-primary"
              style={poppins}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contato"
          className="inline-flex h-10 shrink-0 items-center rounded-full px-6 text-sm font-medium tracking-wide shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-8px_rgba(189,160,120,0.7)] active:translate-y-0"
          style={{ ...poppins, backgroundColor: CAMEL, color: NAVY }}
        >
          Agende uma conversa
        </a>
      </div>
    </header>
  )
}
