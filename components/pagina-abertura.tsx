import Link from 'next/link'
import { ShellPattern } from '@/components/shell-pattern'

// Abertura das subpáginas (serviços, autoavaliação, privacidade): faixa navy
// com o padrão de hexágonos, como as seções navy da home. Caminho de volta
// opcional, título branco e o conteúdo da abertura; `lado` ocupa a coluna da
// direita no desktop (bloco, colmeia...).
const headingFont = { fontFamily: 'var(--font-cinzel)' }

export function PaginaAbertura({
  titulo,
  caminho,
  children,
  lado,
}: {
  titulo: React.ReactNode
  caminho?: { nome: string; href: string }[]
  children?: React.ReactNode
  lado?: React.ReactNode
}) {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: 'var(--lovisa-navy)', fontFamily: 'var(--font-poppins)' }}
    >
      <ShellPattern className="absolute inset-0 h-full w-full text-white" opacity={0.06} size={58} />
      <div
        className={`relative mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-20 lg:px-8 lg:pt-20 lg:pb-24 ${
          lado ? 'lg:grid-cols-[1.25fr_1fr] lg:gap-20' : ''
        }`}
      >
        <div>
          {caminho && (
            <nav aria-label="Você está em" className="text-white/80">
              <ol className="flex flex-wrap gap-x-2">
                {caminho.map((c, i) => (
                  <li key={c.href}>
                    <Link href={c.href} className="underline-offset-4 transition-colors hover:text-white hover:underline">
                      {c.nome}
                    </Link>
                    {i < caminho.length - 1 && <span aria-hidden="true"> / </span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1
            className="mt-6 max-w-[18ch] text-4xl leading-[1.08] font-medium tracking-wide text-balance uppercase sm:text-5xl lg:text-6xl"
            style={headingFont}
          >
            {titulo}
          </h1>
          {children}
        </div>
        {lado && <div>{lado}</div>}
      </div>
    </section>
  )
}

// Faixa de chamada no fim das páginas de serviço: camelo, com o texto em
// navy (4,6:1, só texto grande) e o botão navy.
export function FaixaChamada({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--lovisa-camel)', color: 'var(--lovisa-navy)', fontFamily: 'var(--font-poppins)' }}
    >
      <ShellPattern className="absolute inset-0 h-full w-full text-[var(--lovisa-navy)]" opacity={0.08} size={46} />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
        <div>
          <h2
            className="text-3xl leading-tight font-medium tracking-wide uppercase sm:text-4xl"
            style={headingFont}
          >
            {titulo}
          </h2>
          <p className="mt-3 max-w-[48ch] text-lg font-medium leading-relaxed">{texto}</p>
        </div>
        <Link
          href="/#contato"
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full px-8 text-base font-medium text-white transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--lovisa-camel)] focus-visible:outline-none active:translate-y-0"
          style={{ backgroundColor: 'var(--lovisa-navy)' }}
        >
          Agende uma conversa
        </Link>
      </div>
    </section>
  )
}
