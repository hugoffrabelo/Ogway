import Link from 'next/link'
import { Shell3DLazy } from '@/components/shell-3d-lazy'

// Referência Lovisa Malin (paleta em app/tokens.css) + fontes registradas
// em app/layout.tsx — ver components/pillars.tsx pra mais contexto.
const NAVY = 'var(--lovisa-navy)'
const CAMEL = 'var(--lovisa-camel)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

export function Hero() {
  return (
    <section
      id="topo"
      className="relative overflow-hidden lg:bg-[var(--lovisa-navy)]"
      aria-labelledby="hero-title"
      style={bodyFont}
    >
      {/* a partir de lg a seção é navy e um triângulo creme cobre o canto
          superior direito — mesma hipotenusa de antes (do topo a 62% até o
          canto inferior direito), mas o texto fica sobre o fundo navy da
          própria seção, o que mantém a medição de contraste correta. Abaixo
          de lg o objeto 3D some e o fundo fica claro. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 hidden bg-background lg:block"
        style={{ clipPath: 'polygon(62% 0, 100% 0, 100% 100%)' }}
      />
      {/* listra bege colada na borda esquerda, por cima da faixa navy */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 z-0 hidden w-5 lg:block"
        style={{ backgroundColor: CAMEL }}
      />

      {/* 3D focal shell — layered accent, never competing with the copy */}
      <Shell3DLazy className="pointer-events-none absolute top-10 right-0 z-0 hidden h-[32rem] w-[38rem] lg:block" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-center px-6 pt-20 pb-24 lg:min-h-[44rem] lg:px-8 lg:py-28">
        <h1
          id="hero-title"
          className="max-w-3xl text-4xl leading-[1.02] font-medium tracking-[0.01em] text-balance text-primary uppercase sm:text-6xl lg:text-7xl lg:text-white"
          style={headingFont}
        >
          Você cuida das pessoas.
        </h1>

        <p className="mt-8 max-w-[34rem] text-xl leading-relaxed text-foreground sm:text-2xl lg:text-white/90">
          Nós cuidamos da confiança delas. Adequação à LGPD, encarregado de
          dados (DPO) e consultoria para clínicas de Porto Alegre e região, com
          quem entende de saúde.
        </p>

        <div className="rise-in rise-in-1 mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="/#contato"
            className="inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium transition-[filter,transform] duration-300 hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--lovisa-navy)] focus-visible:outline-none active:translate-y-0"
            style={{ backgroundColor: CAMEL, color: NAVY }}
          >
            Agende uma conversa
          </Link>
          <Link
            href="/autoavaliacao"
            className="text-base text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--lovisa-camel)] lg:text-white"
          >
            Ou faça a autoavaliação gratuita
          </Link>
        </div>
      </div>
    </section>
  )
}
