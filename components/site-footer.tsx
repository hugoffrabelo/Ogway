import { ShellMark } from '@/components/shell-pattern'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-2.5 text-primary">
          <ShellMark className="h-6 w-6 text-accent" />
          <span className="font-serif text-2xl leading-none font-semibold tracking-tight">
            Ogway
          </span>
        </div>

        <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:items-end">
          <a
            href="mailto:contato@ogway.com.br"
            className="transition-colors hover:text-primary"
          >
            contato@ogway.com.br
          </a>
          <p>Encarregado de proteção de dados para a saúde</p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Ogway. Todos os direitos reservados.</p>
          <p>Feito com cuidado, para quem cuida.</p>
        </div>
      </div>
    </footer>
  )
}
