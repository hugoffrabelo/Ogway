import type { Metadata } from 'next'
import { url } from '@/lib/seo'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CONTACT_EMAIL } from '@/lib/contact'
import { PaginaAbertura } from '@/components/pagina-abertura'

export const metadata: Metadata = {
  alternates: { canonical: url('/privacidade') },
  title: 'Aviso de privacidade — Ogway',
  description:
    'Como a Ogway trata os dados pessoais enviados pelo formulário de contato e pela autoavaliação deste site.',
}

const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }
const NAVY = 'var(--lovisa-navy)'

// REVISAR ANTES DE PUBLICAR: prazo de retenção (12 meses) e o e-mail do
// encarregado (NEXT_PUBLIC_CONTACT_EMAIL) — ambos são compromissos públicos.
const ATUALIZADO_EM = '4 de novembro de 2026'

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_2fr] lg:gap-16">
      <h2
        className="text-xl leading-snug font-medium tracking-wide text-balance uppercase sm:text-2xl"
        style={{ ...headingFont, color: NAVY }}
      >
        {titulo}
      </h2>
      <div className="flex max-w-[66ch] flex-col gap-4 text-lg leading-relaxed text-foreground">{children}</div>
    </section>
  )
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main style={bodyFont}>
        <PaginaAbertura titulo="Aviso de privacidade" caminho={[{ nome: 'Início', href: '/' }]}>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-white/90 sm:text-xl">
            Como tratamos os dados que você envia por este site: o que coletamos, para quê, por
            quanto tempo e como exercer os seus direitos.
          </p>
          <p className="mt-4 text-white/80">Atualizado em {ATUALIZADO_EM}.</p>
        </PaginaAbertura>

        <div className="mx-auto flex max-w-6xl flex-col gap-14 px-6 py-20 lg:gap-20 lg:px-8 lg:py-28">

        <Secao titulo="Quem trata os seus dados">
          <p>
            A Ogway, representada por Hugo França, é a controladora dos dados enviados por este site
            e também quem responde como encarregado pelo tratamento de dados pessoais (LGPD, art. 41).
          </p>
          <p>
            Contato do encarregado:{' '}
            {CONTACT_EMAIL ? (
              <a className="underline underline-offset-2" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            ) : (
              <Link className="underline underline-offset-2" href="/#contato">
                formulário de contato
              </Link>
            )}
            .
          </p>
        </Secao>

        <Secao titulo="Quais dados e para quê">
          <p>
            Pelo formulário de contato: nome, e-mail, nome da clínica (opcional) e a mensagem que
            você escrever. Usamos esses dados só para responder ao seu contato e, se você quiser,
            preparar uma proposta.
          </p>
          <p>
            Pela autoavaliação: as respostas ficam só no seu navegador e não são enviadas, a menos
            que você peça o diagnóstico. Nesse caso recebemos as respostas, o resultado e os dados de
            contato que você informar (nome, e-mail, clínica e número de profissionais), para
            preparar o diagnóstico e falar com você.
          </p>
          <p>
            Base legal: procedimentos preliminares a um contrato, a pedido do titular (LGPD, art. 7º,
            V). Não pedimos dados de pacientes pelo formulário. Por favor, não os envie.
          </p>
          <p>
            Medição de audiência: quando ativa, usamos o Vercel Web Analytics, que não usa cookies e
            registra visitas de forma agregada, sem identificar você.
          </p>
        </Secao>

        <Secao titulo="Com quem compartilhamos">
          <p>
            Com ninguém para fins comerciais. Os dados passam apenas pelos serviços que operam este
            site e o envio do formulário (hospedagem, serviço de formulário e e-mail), que atuam
            como operadores e só os usam para prestar esse serviço.
          </p>
        </Secao>

        <Secao titulo="Por quanto tempo">
          <p>
            Pelo tempo necessário para responder. Contatos que não viram contrato são apagados em
            até 12 meses. Se você se tornar cliente, os dados passam a seguir o contrato.
          </p>
        </Secao>

        <Secao titulo="Seus direitos">
          <p>
            Você pode pedir a qualquer momento confirmação do tratamento, acesso, correção,
            eliminação, informação sobre compartilhamento e revogação do consentimento, quando ele
            for a base (LGPD, art. 18). Respondemos em até 15 dias. Se não ficar satisfeito, pode
            reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
          </p>
        </Secao>

        <p>
          <Link
            href="/"
            className="font-medium underline underline-offset-4 transition-colors hover:text-[var(--lovisa-camel)]"
          >
            Voltar para a página inicial
          </Link>
        </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
