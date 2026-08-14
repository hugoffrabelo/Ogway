import { ShellPattern } from '@/components/shell-pattern'

// Mesma referência Lovisa Malin do resto da landing — ver components/pillars.tsx.
const CAMEL = 'var(--lovisa-camel)'
const NAVY = 'var(--lovisa-navy)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

export function About() {
  return (
    <section
      id="quem-cuida"
      className="relative overflow-hidden py-24 lg:py-32"
      aria-labelledby="about-title"
      style={bodyFont}
    >
      <ShellPattern
        className="absolute inset-0 h-full w-full text-primary"
        opacity={0.06}
        size={58}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 flex items-center gap-3 text-sm font-light tracking-[0.2em] text-muted-foreground uppercase">
            <span className="h-px w-8" style={{ backgroundColor: CAMEL }} />
            Quem cuida
          </p>

          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-medium text-white"
              style={{ ...headingFont, backgroundColor: NAVY }}
            >
              H
            </div>
            <div>
              <p
                id="about-title"
                className="text-lg font-medium tracking-wide uppercase"
                style={{ ...headingFont, color: NAVY }}
              >
                Hugo França
              </p>
              <p className="text-sm text-muted-foreground">
                Encarregado de Dados · Ogway
              </p>
            </div>
          </div>

          <p className="mt-8 font-light leading-relaxed text-muted-foreground">
            Sou especialista em proteção de dados, com trabalho consistente
            em GRC e segurança da informação no setor financeiro. A saúde
            entrou na minha trajetória por um caminho mais pessoal: cresci
            vendo meu pai administrar uma clínica, e cheguei a cursar alguns
            anos de graduação na área da saúde antes de migrar para dados.
            Esse é o encontro que sustenta a Ogway. Rigor técnico de quem vem
            do compliance financeiro, aplicado a um setor que conheço de
            dentro.
          </p>
          <p className="mt-6 font-light leading-relaxed text-muted-foreground">
            Acompanho pessoalmente cada clínica sob minha responsabilidade:
            sem central de atendimento, sem revezamento de analista. Quando
            você precisa de algo, fala comigo.
          </p>
        </div>
      </div>
    </section>
  )
}
