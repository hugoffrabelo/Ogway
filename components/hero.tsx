import { ShellPattern } from '@/components/shell-pattern'
import { Shell3D } from '@/components/shell-3d'

export function Hero() {
  return (
    <section
      id="topo"
      className="relative overflow-hidden"
      aria-labelledby="hero-title"
    >
      <ShellPattern
        className="mesh-fade absolute inset-0 h-full w-full text-primary"
        opacity={0.06}
        size={54}
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
        <p className="rise-in rise-in-1 mb-8 flex items-center gap-3 text-sm tracking-[0.2em] text-muted-foreground uppercase">
          <span className="h-px w-8 bg-accent" />
          Encarregado de dados para a saúde
        </p>

        <h1
          id="hero-title"
          className="rise-in rise-in-2 max-w-4xl font-serif text-5xl leading-[1.05] font-semibold tracking-tight text-balance text-primary sm:text-6xl lg:text-7xl"
        >
          A tranquilidade de saber que os dados dos seus pacientes estão em boas
          mãos.
        </h1>

        <p className="rise-in rise-in-3 mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Um encarregado de proteção de dados dedicado à sua clínica — presente,
          humano e atento, para que você cuide das pessoas enquanto cuidamos da
          confiança delas.
        </p>

        <div className="rise-in rise-in-4 mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <a
            href="#contato"
            className="group inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-medium text-accent-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(196,162,76,0.7)] active:translate-y-0"
          >
            Agende uma conversa
          </a>
          <span className="text-sm text-muted-foreground">
            Conversa inicial sem compromisso, no seu tempo.
          </span>
        </div>
      </div>
    </section>
  )
}
