import { ShellMark, ShellPattern } from '@/components/shell-pattern'

// Mesma referência Lovisa Malin do cabeçalho — ver components/site-header.tsx.
const cinzel = { fontFamily: 'var(--font-cinzel)' }
const poppins = { fontFamily: 'var(--font-poppins)' }
const NAVY = 'var(--lovisa-navy)'

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      <ShellPattern
        className="absolute inset-0 h-full w-full text-primary"
        opacity={0.05}
        size={22}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <ShellMark className="h-8 w-8" />
          <span
            className="text-2xl leading-none font-medium tracking-wide uppercase"
            style={{ ...cinzel, color: NAVY }}
          >
            Ogway
          </span>
        </div>

        <p className="text-sm text-muted-foreground" style={poppins}>
          Encarregado de proteção de dados para a saúde
        </p>
      </div>
      <div className="relative border-t border-border/60">
        <div
          className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"
          style={poppins}
        >
          <p>© {new Date().getFullYear()} Ogway. Todos os direitos reservados.</p>
          <p>Feito com cuidado, para quem cuida.</p>
        </div>
      </div>
    </footer>
  )
}
