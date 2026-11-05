import Link from 'next/link'
import { ShellMark } from '@/components/shell-pattern'
import { MobileMenu } from '@/components/mobile-menu'

// Links com "/#âncora" via next/link: funcionam na home e também em
// /privacidade, e o basePath do GitHub Pages (/Ogway) é aplicado sozinho.
const nav = [
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Autoavaliação', href: '/#autodiagnostico' },
  { label: 'Por que a Ogway', href: '/#diferenca' },
  { label: 'Quem cuida', href: '/#quem-cuida' },
  { label: 'Dúvidas', href: '/#duvidas' },
]

// Cinzel/Poppins — mesma referência do Lovisa Malin usada em Pillars, ver
// components/pillars.tsx. Registradas em app/layout.tsx. NAVY vem de
// --lovisa-navy (app/tokens.css) — o wordmark precisa bater exatamente com
// o ShellMark ao lado (components/shell-pattern.tsx), não com --primary.
const cinzel = { fontFamily: 'var(--font-cinzel)' }
const poppins = { fontFamily: 'var(--font-poppins)' }
const NAVY = 'var(--lovisa-navy)'
const CAMEL = 'var(--lovisa-camel)'

const ctaClass =
  'inline-flex h-10 shrink-0 items-center rounded-full px-5 text-sm font-medium tracking-wide transition-[filter,transform] hover:brightness-105 active:translate-y-px focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:ring-offset-2 focus-visible:outline-none sm:px-6'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background" style={poppins}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 lg:px-8">
        <Link
          href="/#topo"
          className="flex items-center gap-3 text-primary"
          aria-label="Ogway — página inicial"
        >
          <ShellMark className="h-8 w-8" />
          <span
            className="text-2xl leading-none font-medium tracking-wide uppercase"
            style={{ ...cinzel, color: NAVY }}
            translate="no"
          >
            Ogway
          </span>
        </Link>

        <nav aria-label="Seções" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] text-foreground transition-colors hover:text-[var(--lovisa-camel)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/#contato" className={ctaClass} style={{ backgroundColor: CAMEL, color: NAVY }}>
            <span className="sm:hidden">Conversar</span>
            <span className="hidden sm:inline">Agende uma conversa</span>
          </Link>

          <MobileMenu items={nav} />
        </div>
      </div>
    </header>
  )
}
