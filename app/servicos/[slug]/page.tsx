import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
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

export default async function PaginaServicoPage({ params }: Props) {
  const { slug } = await params
  const p = PAGINAS.find((x) => x.slug === slug)
  if (!p) notFound()
  const caminho = `/servicos/${p.slug}`
  const outras = PAGINAS.filter((x) => x.slug !== p.slug)

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
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-20 lg:pt-24">
          <nav aria-label="Você está em" className="text-foreground/80">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="underline-offset-4 hover:underline">
                  Início
                </Link>
                <span aria-hidden="true"> / </span>
              </li>
              <li>
                <Link href="/#servicos" className="underline-offset-4 hover:underline">
                  Serviços
                </Link>
              </li>
            </ol>
          </nav>

          <h1
            className="mt-8 text-3xl leading-tight font-medium tracking-wide text-balance uppercase sm:text-5xl"
            style={{ ...headingFont, color: NAVY }}
          >
            {p.h1}
          </h1>
          <p className="mt-8 text-xl leading-relaxed text-foreground">{p.intro}</p>
          <p className="mt-4 leading-relaxed text-foreground/80">{ATENDIMENTO}</p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/#contato"
              className="inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium transition-[filter,transform] hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-px"
              style={{ backgroundColor: CAMEL, color: NAVY }}
            >
              Agende uma conversa
            </Link>
            <Link
              href="/autoavaliacao"
              className="text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--lovisa-camel)]"
            >
              Faça a autoavaliação gratuita
            </Link>
          </div>

          {p.secoes.map((s) => (
            <section key={s.titulo} className="mt-16">
              <h2
                className="text-2xl leading-snug font-medium tracking-wide uppercase sm:text-3xl"
                style={{ ...headingFont, color: NAVY }}
              >
                {s.titulo}
              </h2>
              {s.paragrafos?.map((t) => (
                <p key={t.slice(0, 24)} className="mt-5 text-lg leading-relaxed text-foreground">
                  {t}
                </p>
              ))}
              {s.lista && (
                <ul className="mt-6 flex flex-col gap-3">
                  {s.lista.map((item) => (
                    <li key={item} className="flex gap-3 text-lg leading-relaxed text-foreground">
                      <span
                        aria-hidden="true"
                        className="mt-[0.65em] h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: CAMEL }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="mt-16">
            <h2
              className="text-2xl leading-snug font-medium tracking-wide uppercase sm:text-3xl"
              style={{ ...headingFont, color: NAVY }}
            >
              Perguntas frequentes
            </h2>
            <div className="mt-6 flex flex-col gap-3">
              {p.faq.map((q) => (
                <details key={q.p} className="group rounded-2xl bg-card px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium text-foreground focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                    {q.p}
                    <span aria-hidden="true" className="text-2xl leading-none transition-transform group-open:rotate-45" style={{ color: CAMEL }}>
                      +
                    </span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-foreground">{q.r}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-card py-16" aria-labelledby="outros-servicos">
          <div className="mx-auto max-w-3xl px-6">
            <h2
              id="outros-servicos"
              className="text-xl font-medium tracking-wide uppercase sm:text-2xl"
              style={{ ...headingFont, color: NAVY }}
            >
              Outros serviços
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {outras.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/servicos/${o.slug}`}
                    className="text-lg text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--lovisa-camel)]"
                  >
                    {o.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
