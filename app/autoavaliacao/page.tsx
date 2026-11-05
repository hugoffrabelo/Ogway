import type { Metadata } from 'next'
import { url } from '@/lib/seo'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PaginaAbertura } from '@/components/pagina-abertura'
import { Questionario } from '@/components/autoavaliacao/questionario'
import { ColmeiaAreas } from '@/components/autoavaliacao/colmeia-areas'
import { AREAS, TOTAL_PERGUNTAS } from '@/lib/autoavaliacao'

export const metadata: Metadata = {
  alternates: { canonical: url('/autoavaliacao') },
  title: 'Autoavaliação de LGPD para clínicas — Ogway',
  description:
    'Descubra em cinco minutos o nível de maturidade da sua clínica em proteção de dados. Gratuito, sem cadastro para ver o resultado.',
}

const CAMEL = 'var(--lovisa-camel)'
const NAVY = 'var(--lovisa-navy)'
const bodyFont = { fontFamily: 'var(--font-poppins)' }

export default function AutoavaliacaoPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main style={bodyFont}>
        <PaginaAbertura
          titulo={
            <>
              Como está sua <span style={{ color: CAMEL }}>clínica</span> na LGPD?
            </>
          }
          caminho={[{ nome: 'Início', href: '/' }]}
          lado={<ColmeiaAreas />}
        >
          <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-white/90 sm:text-xl">
            {TOTAL_PERGUNTAS} perguntas em {AREAS.length} áreas, na linguagem do dia a dia da
            clínica. Em cinco minutos você vê o nível de maturidade e a nota de cada área.
          </p>
          <p className="mt-4 max-w-[46ch] text-white/80">
            Gratuito. Suas respostas ficam só no seu navegador; nada é enviado, a menos que você
            peça o diagnóstico no final.
          </p>
          <a
            href="#questionario"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--lovisa-navy)] focus-visible:outline-none active:translate-y-0"
            style={{ backgroundColor: CAMEL, color: NAVY }}
          >
            Começar agora
          </a>
        </PaginaAbertura>

        <section id="questionario" aria-label="Questionário" className="px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-3xl rounded-2xl bg-card p-6 sm:p-10 lg:p-12">
            <Questionario />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
