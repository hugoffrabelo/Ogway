'use client'

import { useState, type FormEvent } from 'react'
import { ShellPattern } from '@/components/shell-pattern'

// Mesma referência Lovisa Malin do resto da landing — ver components/pillars.tsx.
const CAMEL = 'var(--lovisa-camel)'
const NAVY = 'var(--lovisa-navy)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }
const bodyFont = { fontFamily: 'var(--font-poppins)' }

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Ponto de captura do lead. Conecte a um backend/CRM quando desejar.
    setSubmitted(true)
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
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-5 flex items-center gap-3 text-sm font-light tracking-[0.2em] text-white/60 uppercase">
            <span className="h-px w-8" style={{ backgroundColor: CAMEL }} />
            Vamos conversar
          </p>
          <h2
            id="contact-title"
            className="text-3xl leading-tight font-medium tracking-wide text-balance uppercase sm:text-4xl lg:text-5xl"
            style={headingFont}
          >
            Comece por uma <span style={{ color: CAMEL }}>conversa</span>{' '}
            tranquila.
          </h2>
          <p className="mt-6 max-w-md font-light leading-relaxed text-white/70">
            Conte um pouco sobre a sua clínica. Respondemos de forma pessoal,
            sem robôs e sem pressa, para entender como podemos ajudar.
          </p>
        </div>

        <div className="rounded-2xl bg-card p-8 text-card-foreground lg:p-10">
          {submitted ? (
            <div className="flex min-h-80 flex-col items-start justify-center">
              <span
                className="text-3xl font-medium uppercase"
                style={{ ...headingFont, color: NAVY }}
              >
                Obrigado.
              </span>
              <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
                Recebemos sua mensagem e retornaremos em breve, no seu tempo.
                Enquanto isso, respire — os dados da sua clínica estão prestes a
                ficar em boas mãos.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field id="nome" label="Nome" autoComplete="name" required />
              <Field
                id="email"
                label="E-mail"
                type="email"
                autoComplete="email"
                required
              />
              <Field
                id="clinica"
                label="Clínica ou consultório"
                autoComplete="organization"
              />
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
                  placeholder="Como podemos ajudar?"
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted-foreground/70 focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="mt-2 inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium transition-all hover:brightness-105 active:translate-y-px"
                style={{ backgroundColor: CAMEL, color: NAVY }}
              >
                Agende uma conversa
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Seus dados são tratados com o mesmo cuidado que pedimos para os
                seus pacientes.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  type = 'text',
  autoComplete,
  required,
}: {
  id: string
  label: string
  type?: string
  autoComplete?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: NAVY }}>
        {label}
        {required && <span style={{ color: CAMEL }}> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="h-12 w-full rounded-lg border border-border bg-background px-4 text-primary placeholder:text-muted-foreground/70 focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
      />
    </div>
  )
}
