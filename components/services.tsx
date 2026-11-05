import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { ShellPattern } from '@/components/shell-pattern'

// "Como posso ajudar" organizado pela situação do visitante, não pelo nome
// do serviço: quem chega reconhece o próprio caso em uma frase e vai direto
// para a página do serviço. O detalhe (o que inclui, etapas, FAQ) fica nas
// páginas /servicos/* — aqui, uma linha por serviço.
//
// Layout (taste skill, references/layout.md §3): linhas com o caso no terço
// esquerdo e o serviço nos dois terços da direita, o mesmo corte em todas.
// O caso fica num bloco de cor da marca, alternando azul (navy) e dourado
// (camelo), ambos com o padrão de hexágonos sutil — campos de cor no lugar de
// ornamento, para a seção não parecer vazia.
//
// SERVICOS também alimenta o campo "O que você procura" do formulário de
// contato (components/contact.tsx), por isso mantém id/nome/pagina.
const NAVY = 'var(--lovisa-navy)'
const CAMEL = 'var(--lovisa-camel)'
const CAMEL_INK = 'var(--lovisa-camel-ink)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

type Fundo = 'navy' | 'camelo'

export const SERVICOS: {
  id: string
  caso: string
  nome: string
  resumo: string
  pagina: string
  fundo: Fundo
}[] = [
  {
    id: 'adequacao',
    caso: 'Nunca fiz a adequação',
    nome: 'Adequação completa',
    resumo: 'Monto o programa de privacidade da clínica do zero, em seis etapas.',
    pagina: '/servicos/adequacao-lgpd-clinicas',
    fundo: 'navy',
  },
  {
    id: 'encarregado',
    caso: 'Quero manter em dia',
    nome: 'Encarregado contínuo',
    resumo: 'Assumo o papel de DPO e mantenho tudo em dia, mês a mês.',
    pagina: '/servicos/dpo-porto-alegre',
    fundo: 'camelo',
  },
  {
    id: 'consultoria',
    caso: 'Tenho uma pendência',
    nome: 'Consultoria e adequação parcial',
    resumo: 'Resolvo uma frente só: o site, os contratos ou os sistemas.',
    pagina: '/servicos/consultoria-lgpd',
    fundo: 'navy',
  },
  {
    id: 'documentos',
    caso: 'Preciso de um documento',
    nome: 'Documentos avulsos',
    resumo: 'Política, ROPA, RIPD ou plano de incidentes, sob medida.',
    pagina: '/servicos/documentos-lgpd',
    fundo: 'camelo',
  },
]

// Contraste do texto sobre cada bloco: branco sobre navy ≥ 10:1; navy sobre
// camelo 4,6:1 (texto grande, acima de 24px).
function BlocoCaso({ fundo, children }: { fundo: Fundo; children: React.ReactNode }) {
  return (
    <div
      className="relative isolate flex min-h-[10rem] items-end overflow-hidden rounded-2xl p-6 lg:min-h-[12rem] lg:p-8"
      style={{ backgroundColor: fundo === 'camelo' ? CAMEL : NAVY, color: fundo === 'camelo' ? NAVY : 'white' }}
    >
      {/* camada de material: cresce levemente no hover da linha */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 transition-transform duration-700 ease-out group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
      >
        {fundo === 'navy' && (
          <ShellPattern className="h-full w-full text-white" opacity={0.12} size={34} />
        )}
        {fundo === 'camelo' && (
          <ShellPattern className="h-full w-full text-[var(--lovisa-navy)]" opacity={0.1} size={34} />
        )}
      </div>
      {children}
    </div>
  )
}

export function Services() {
  return (
    <section
      id="servicos"
      className="relative overflow-hidden bg-background py-24 lg:py-32"
      aria-labelledby="services-title"
      style={bodyFont}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-end lg:gap-16">
          <h2
            id="services-title"
            className="text-3xl leading-tight font-medium tracking-wide uppercase sm:text-4xl lg:text-5xl"
            style={{ ...headingFont, color: NAVY }}
          >
            Qual é o seu <span style={{ color: CAMEL_INK }}>caso</span>?
          </h2>
          <p className="max-w-[48ch] text-lg leading-relaxed text-foreground">
            Escolha a situação da sua clínica.{' '}
            <Link
              href="/autoavaliacao"
              className="font-medium underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--lovisa-camel-ink)]"
            >
              Não sabe? Faça a autoavaliação.
            </Link>
          </p>
        </Reveal>

        <ul className="mt-14 flex flex-col gap-5 lg:mt-20 lg:gap-6">
          {SERVICOS.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 70}>
              <Link
                href={s.pagina}
                className="group grid gap-5 rounded-2xl focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none lg:grid-cols-[1fr_2fr] lg:items-center lg:gap-16"
              >
                <BlocoCaso fundo={s.fundo}>
                  <h3
                    className="text-2xl leading-snug font-medium tracking-wide uppercase sm:text-3xl"
                    style={headingFont}
                  >
                    {s.caso}
                  </h3>
                </BlocoCaso>
                <div className="flex items-center justify-between gap-6">
                  <p className="leading-relaxed">
                    <span className="block text-lg font-medium" style={{ color: 'var(--lovisa-camel-text)' }}>
                      {s.nome}
                    </span>
                    <span className="mt-1 block text-lg text-foreground">{s.resumo}</span>
                  </p>
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-card text-xl transition-[transform,background-color,color] duration-300 group-hover:translate-x-1 group-hover:bg-[var(--lovisa-navy)] group-hover:text-white group-focus-visible:bg-[var(--lovisa-navy)] group-focus-visible:text-white"
                    style={{ color: NAVY }}
                  >
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
