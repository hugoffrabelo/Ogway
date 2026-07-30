import { ShellMark } from '@/components/shell-pattern'

const nav = [
  { label: 'O serviço', href: '#o-servico' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Por que a Ogway', href: '#diferenca' },
  { label: 'Quem cuida', href: '#quem-cuida' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <a
          href="#topo"
          className="flex items-center gap-2.5 text-primary"
          aria-label="Ogway — página inicial"
        >
          <ShellMark className="h-6 w-6 text-accent" />
          <span className="font-serif text-2xl leading-none font-semibold tracking-tight">
            Ogway
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contato"
          className="inline-flex h-9 items-center rounded-full border border-primary/20 px-4 text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent"
        >
          Agende uma conversa
        </a>
      </div>
    </header>
  )
}
