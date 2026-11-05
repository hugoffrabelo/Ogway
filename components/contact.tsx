'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { ShellPattern } from '@/components/shell-pattern'
import { Reveal } from '@/components/reveal'
import { CONTACT_EMAIL, enviarLead } from '@/lib/contact'
import { SERVICOS } from '@/components/services'

// Mesma referência Lovisa Malin do resto da landing — ver components/pillars.tsx.
const CAMEL = 'var(--lovisa-camel)'
const NAVY = 'var(--lovisa-navy)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

type Status = 'idle' | 'sending' | 'sent' | 'error'

function montarMailto(dados: Record<string, string>) {
  return {
    assunto: `Conversa sobre LGPD — ${dados.clinica || dados.nome}`,
    corpo: [
      dados.mensagem,
      '',
      `Nome: ${dados.nome}`,
      `E-mail: ${dados.email}`,
      dados.clinica ? `Clínica: ${dados.clinica}` : '',
      dados.interesse ? `Interesse: ${dados.interesse}` : '',
    ]
      .filter((l) => l !== '')
      .join('\n'),
  }
}

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [viaMailto, setViaMailto] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    // honeypot: campo invisível que só robô preenche
    if (form.get('empresa_site')) {
      setStatus('sent')
      return
    }
    const dados = {
      nome: String(form.get('nome') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      clinica: String(form.get('clinica') ?? '').trim(),
      interesse: String(form.get('interesse') ?? '').trim(),
      mensagem: String(form.get('mensagem') ?? '').trim(),
    }
    setStatus('sending')
    try {
      const como = await enviarLead({ origem: 'contato', ...dados }, montarMailto(dados))
      setViaMailto(como === 'mailto')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="contato"
      className="relative overflow-hidden text-white"
      aria-labelledby="contact-title"
      style={{ backgroundColor: NAVY, ...bodyFont }}
    >
      <ShellPattern
        className="absolute inset-0 h-full w-full text-white"
        opacity={0.06}
        size={52}
      />
      <div className="relative mx-auto grid max-w-6xl gap-16 px-6 py-24 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-32">
        <Reveal>
          <h2
            id="contact-title"
            className="text-3xl leading-tight font-medium tracking-wide text-balance uppercase sm:text-4xl lg:text-5xl"
            style={headingFont}
          >
            Comece por uma conversa
          </h2>
          <p className="mt-6 max-w-[60ch] text-lg font-light leading-relaxed text-white/90">
            Conte um pouco sobre a sua clínica. Respondemos pessoalmente, sem robôs
            e sem pressa, para entender como podemos ajudar.
          </p>
          {CONTACT_EMAIL && (
            <p className="mt-6 font-light text-white/90">
              Prefere e-mail?{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--lovisa-camel)]"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          )}
        </Reveal>

        <Reveal delay={90} className="rounded-2xl bg-card p-8 text-card-foreground lg:p-10">
          {status === 'sent' ? (
            <div
              className="flex min-h-80 flex-col items-start justify-center"
              role="status"
              aria-live="polite"
            >
              <span
                className="text-3xl font-medium uppercase"
                style={{ ...headingFont, color: NAVY }}
              >
                Obrigado.
              </span>
              <p className="mt-4 max-w-sm leading-relaxed text-foreground">
                {viaMailto
                  ? 'Abrimos o seu e-mail com a mensagem pronta. É só enviar por lá.'
                  : 'Recebemos sua mensagem e respondemos em até dois dias úteis.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate={false}>
              <Field id="nome" label="Nome" autoComplete="name" required />
              <Field
                id="email"
                label="E-mail"
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                required
              />
              <Field
                id="clinica"
                label="Clínica ou consultório"
                autoComplete="organization"
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="interesse" className="text-sm font-medium" style={{ color: NAVY }}>
                  O que você procura
                </label>
                <select
                  id="interesse"
                  name="interesse"
                  defaultValue=""
                  className="h-12 w-full rounded-lg border border-border bg-background px-4 text-primary focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
                >
                  <option value="">Ainda não sei, quero conversar</option>
                  {SERVICOS.map((s) => (
                    <option key={s.id} value={s.nome}>
                      {s.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="mensagem"
                  className="text-sm font-medium"
                  style={{ color: NAVY }}
                >
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows={4}
                  placeholder="Ex.: somos uma clínica com 3 dentistas e queremos entender o que falta…"
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
                />
              </div>
              {/* honeypot anti-spam, fora da tela e fora da ordem de tabulação */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="empresa_site">Não preencha este campo</label>
                <input id="empresa_site" name="empresa_site" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {status === 'error' && (
                <p role="alert" className="rounded-lg bg-[var(--status-critico)]/10 px-4 py-3 text-sm text-foreground">
                  Não consegui enviar agora.{' '}
                  {CONTACT_EMAIL ? (
                    <>
                      Escreva direto para{' '}
                      <a className="font-medium underline" href={`mailto:${CONTACT_EMAIL}`}>
                        {CONTACT_EMAIL}
                      </a>{' '}
                      ou tente de novo em instantes.
                    </>
                  ) : (
                    'Tente de novo em instantes.'
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-2 inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium transition-[filter,transform] hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-px disabled:cursor-wait disabled:opacity-70"
                style={{ backgroundColor: CAMEL, color: NAVY }}
              >
                {status === 'sending' ? 'Enviando…' : 'Agendar uma conversa'}
              </button>
              <p className="text-center text-sm text-foreground/80">
                Usamos seus dados só para responder a este contato. Detalhes no{' '}
                <Link href="/privacidade" className="underline underline-offset-2">
                  aviso de privacidade
                </Link>
                .
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  type = 'text',
  autoComplete,
  inputMode,
  spellCheck,
  required,
}: {
  id: string
  label: string
  type?: string
  autoComplete?: string
  inputMode?: 'email' | 'text'
  spellCheck?: boolean
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: NAVY }}>
        {label}
        {required && (
          <span style={{ color: CAMEL }} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        spellCheck={spellCheck}
        required={required}
        className="h-12 w-full rounded-lg border border-border bg-background px-4 text-primary placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
      />
    </div>
  )
}
