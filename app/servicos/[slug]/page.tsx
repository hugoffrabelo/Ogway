import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SERVICOS } from '@/components/services'
import { BlocoCaso } from '@/components/bloco-caso'
import { PaginaAbertura, FaixaChamada } from '@/components/pagina-abertura'
import { Reveal } from '@/components/reveal'
import { ATENDIMENTO, PAGINAS } from '@/lib/paginas-servico'
import { jsonLd, schemaBreadcrumb, schemaFaq, schemaServico, url } from '@/lib/seo'

// Export estático (GitHub Pages): só as páginas listadas existem.
export const dynamicParams = false
export function generateStaticParams() {
  return PAGINAS.map((p) => ({ slug: p.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = PAGINAS.find((x) => x.slug === slug)
  if (!p) return {}
  const caminho = `/servicos/${p.slug}`
  return {
    title: p.titulo,
    description: p.descricao,
    alternates: { canonical: url(caminho) },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Ogway',
      url: url(caminho),
      title: p.titulo,
      description: p.descricao,
      images: [{ url: url('/og.png'), width: 1200, height: 630, alt: 'Ogway — LGPD para clínicas' }],
    },
  }
}

const NAVY = 'var(--lovisa-navy)'
const CAMEL = 'var(--lovisa-camel)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

// Layout (taste skill, layout.md §3): abertura navy como as seções da home;
// no corpo, título da seção no terço esquerdo e conteúdo nos dois terços da
// direita, o mesmo corte em todas as linhas; fecha com a faixa camelo e os
// outros serviços nos blocos azul/dourado da home.
export default async function PaginaServicoPage({ params }: Props) {
  const { slug } = await params
  const p = PAGINAS.find((x) => x.slug === slug)
  if (!p) notFound()
  const caminho = `/servicos/${p.slug}`
  const servico = SERVICOS.find((s) => s.pagina === caminho)
  const outros = SERVICOS.filter((s) => s.pagina !== caminho)

  return (
    <div className="min-h-svh bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            schemaServico(p.servicoSchema, p.descricao, caminho),
            schemaFaq(p.faq),
            schemaBreadcrumb([
              { nome: 'Início', path: '/' },
              { nome: 'Serviços', path: '/#servicos' },
              { nome: p.h1, path: caminho },
            ]),
          ]),
        }}
      />
      <SiteHeader />
      <main style={bodyFont}>
        <PaginaAbertura
          titulo={p.h1}
          caminho={[
            { nome: 'Início', href: '/' },
            { nome: 'Serviços', href: '/#servicos' },
          ]}
          lado={
            servico && (
              <BlocoCaso fundo={servico.fundo === 'navy' ? 'camelo' : servico.fundo} className="min-h-[13rem] p-8 lg:min-h-[17rem] lg:p-10">
                <div>
                  <p className="text-lg font-medium">Para quem diz:</p>
                  <p className="mt-2 text-3xl leading-tight font-medium tracking-wide uppercase lg:text-4xl" style={headingFont}>
                    “{servico.caso}”
                  </p>
                </div>
              </BlocoCaso>
            )
          }
        >
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-white/90 sm:text-xl">{p.intro}</p>
          <p className="mt-4 max-w-[52ch] text-white/80">{ATENDIMENTO}</p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/#contato"
              className="inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--lovisa-navy)] focus-visible:outline-none active:translate-y-0"
              style={{ backgroundColor: CAMEL, color: NAVY }}
            >
              Agende uma conversa
            </Link>
            <Link
              href="/autoavaliacao"
              className="text-white underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--lovisa-camel)]"
            >
              Faça a autoavaliação gratuita
            </Link>
          </div>
        </PaginaAbertura>

        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="flex flex-col gap-16 lg:gap-24">
            {p.secoes.map((s) => (
              <Reveal as="section" key={s.titulo} className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
                <h2
                  className="text-2xl leading-snug font-medium tracking-wide text-balance uppercase sm:text-3xl"
                  style={{ ...headingFont, color: NAVY }}
                >
                  {s.titulo}
                </h2>
                <div>
                  {s.paragrafos?.map((t) => (
                    <p key={t.slice(0, 24)} className="max-w-[62ch] text-lg leading-relaxed text-foreground [&+p]:mt-5">
                      {t}
                    </p>
                  ))}
                  {s.lista && (
                    <ul className={`grid gap-x-10 gap-y-4 sm:grid-cols-2 ${s.paragrafos ? 'mt-8' : ''}`}>
                      {s.lista.map((item) => (
                        <li key={item} className="flex gap-3 text-lg leading-relaxed text-foreground">
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px]"
                            style={{ backgroundColor: CAMEL }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            ))}

            <Reveal as="section" className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
              <h2
                className="text-2xl leading-snug font-medium tracking-wide uppercase sm:text-3xl"
                style={{ ...headingFont, color: NAVY }}
              >
                Perguntas frequentes
              </h2>
              <div className="flex flex-col gap-3">
                {p.faq.map((q) => (
                  <details key={q.p} className="group rounded-2xl bg-card px-6 py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium text-foreground focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                      {q.p}
                      <span
                        aria-hidden="true"
                        className="text-2xl leading-none transition-transform group-open:rotate-45"
                        style={{ color: 'var(--lovisa-camel-ink)' }}
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-4 max-w-[62ch] leading-relaxed text-foreground">{q.r}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <FaixaChamada
          titulo="Vamos conversar?"
          texto="Conte como a sua clínica funciona hoje. Respondemos com um caminho claro, sem compromisso."
        />

        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24" aria-labelledby="outros-servicos">
          <h2
            id="outros-servicos"
            className="text-2xl font-medium tracking-wide uppercase sm:text-3xl"
            style={{ ...headingFont, color: NAVY }}
          >
            Outros serviços
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {outros.map((o) => (
              <li key={o.id}>
                <Link
                  href={o.pagina}
                  className="group block rounded-2xl focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  <BlocoCaso fundo={o.fundo} className="min-h-[9rem] p-6">
                    <p className="text-xl leading-snug font-medium tracking-wide uppercase" style={headingFont}>
                      {o.caso}
                    </p>
                  </BlocoCaso>
                  <p className="mt-4 flex items-center justify-between gap-4 text-lg">
                    <span className="font-medium" style={{ color: 'var(--lovisa-camel-text)' }}>
                      {o.nome}
                    </span>
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                      style={{ color: NAVY }}
                    >
                      →
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
