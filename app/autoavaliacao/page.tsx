import type { Metadata } from 'next'
import { url } from '@/lib/seo'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Questionario } from '@/components/autoavaliacao/questionario'

export const metadata: Metadata = {
  alternates: { canonical: url('/autoavaliacao') },
  title: 'Autoavaliação de LGPD para clínicas — Ogway',
  description:
    'Descubra em cinco minutos o nível de maturidade da sua clínica em proteção de dados. Gratuito, sem cadastro para ver o resultado.',
}

const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

export default function AutoavaliacaoPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-20 lg:py-28" style={bodyFont}>
        <h1
          className="text-3xl leading-tight font-medium tracking-wide text-balance uppercase sm:text-5xl"
          style={{ ...headingFont, color: 'var(--lovisa-navy)' }}
        >
          Como está a sua clínica na LGPD?
        </h1>
        <div className="mt-10">
          <Questionario />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
