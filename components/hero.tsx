import { ShellPattern } from '@/components/shell-pattern'
import { Shell3D } from '@/components/shell-3d'

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
      className="relative overflow-hidden"
      aria-labelledby="hero-title"
      style={bodyFont}
    >
      <ShellPattern
        className="mesh-fade absolute inset-0 h-full w-full text-primary"
        opacity={0.06}
        size={54}
      />

      {/* faixa navy: uma hipotenusa única, do topo (62% de largura) até o
          canto inferior direito, por trás do objeto 3D. Só a partir de lg,
          onde o objeto 3D também aparece; abaixo disso o texto não cabe
          dentro da faixa, então o mobile mantém o fundo claro original. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 hidden lg:block"
        style={{
          backgroundColor: NAVY,
          clipPath: 'polygon(0 0, 62% 0, 100% 100%, 0 100%)',
        }}
      />
      {/* listra bege colada na borda esquerda, por cima da faixa navy */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 z-0 hidden w-5 lg:block"
        style={{ backgroundColor: CAMEL }}
      />
      {/* very subtle warm glow so the mesh cells near the object catch light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 right-8 z-0 hidden h-96 w-96 rounded-full bg-accent/12 blur-3xl lg:block"
      />

      {/* 3D focal shell — layered accent, never competing with the copy */}
      <Shell3D className="pointer-events-none absolute top-4 right-0 z-0 hidden h-[32rem] w-[38rem] opacity-95 lg:block" />

      {/* soft vignette + shallow depth-of-field focus */}
      <div
        aria-hidden="true"
        className="hero-vignette pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-24 lg:px-8 lg:pt-28 lg:pb-32">
        <p
          className="rise-in rise-in-1 mb-8 flex items-center gap-3 text-sm font-light tracking-[0.2em] text-muted-foreground uppercase lg:text-white/60"
          style={bodyFont}
        >
          <span className="h-px w-8" style={{ backgroundColor: CAMEL }} />
          Encarregado de dados para saúde
        </p>

        <h1
          id="hero-title"
          className="rise-in rise-in-2 max-w-2xl text-5xl leading-[1.05] font-medium tracking-wide text-balance text-primary uppercase sm:text-6xl lg:text-7xl lg:text-white"
          style={headingFont}
        >
          Você cuida das <span style={{ color: CAMEL }}>pessoas</span>. Nós
          cuidamos da <span style={{ color: CAMEL }}>confiança</span> delas.
        </h1>

        <p
          className="rise-in rise-in-3 mt-8 max-w-xl font-light text-lg leading-relaxed text-muted-foreground lg:text-white/70"
          style={bodyFont}
        >
          Proteção de dados contínua para sua clínica, conduzida por quem
          entende de saúde.
        </p>

        <div className="rise-in rise-in-4 mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <a
            href="#contato"
            className="group inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(189,160,120,0.7)] active:translate-y-0"
            style={{ backgroundColor: CAMEL, color: NAVY }}
          >
            Agende uma conversa
          </a>
          <span
            className="text-sm text-muted-foreground lg:text-white/60"
            style={bodyFont}
          >
            Conversa inicial sem compromisso, no seu tempo.
          </span>
        </div>
      </div>
    </section>
  )
}
