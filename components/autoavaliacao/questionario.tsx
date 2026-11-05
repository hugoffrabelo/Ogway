'use client'

import Link from 'next/link'
import { useMemo, useRef, useState, type FormEvent } from 'react'
import {
  AREAS,
  OPCOES,
  TOTAL_PERGUNTAS,
  calcular,
  type Resposta,
  type Respostas,
} from '@/lib/autoavaliacao'
import { CONTACT_EMAIL, enviarLead } from '@/lib/contact'

const NAVY = 'var(--lovisa-navy)'
const CAMEL = 'var(--lovisa-camel)'
const headingFont = { fontFamily: 'var(--font-cinzel)' }

const btnPrimario =
  'inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium transition-[filter,transform] hover:brightness-105 active:translate-y-px focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
const btnSecundario =
  'inline-flex h-12 items-center justify-center rounded-full px-6 text-base font-medium text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:outline-none'

type Fase = { tipo: 'intro' } | { tipo: 'area'; i: number } | { tipo: 'resultado' }
type Envio = 'idle' | 'sending' | 'sent' | 'error'

export function Questionario() {
  const [fase, setFase] = useState<Fase>({ tipo: 'intro' })
  const [respostas, setRespostas] = useState<Respostas>({})
  const topo = useRef<HTMLDivElement>(null)

  const respondidas = Object.keys(respostas).length
  const resultado = useMemo(() => calcular(respostas), [respostas])

  function irPara(f: Fase) {
    setFase(f)
    // leva o foco ao começo da nova etapa (teclado e leitor de tela)
    requestAnimationFrame(() => {
      topo.current?.scrollIntoView({ block: 'start' })
      topo.current?.focus({ preventScroll: true })
    })
  }

  return (
    <div ref={topo} tabIndex={-1} className="scroll-mt-24 outline-none">
      {fase.tipo === 'intro' && <Intro onComecar={() => irPara({ tipo: 'area', i: 0 })} />}

      {fase.tipo === 'area' && (
        <EtapaArea
          i={fase.i}
          respostas={respostas}
          respondidas={respondidas}
          onResponder={(id, r) => setRespostas((prev) => ({ ...prev, [id]: r }))}
          onVoltar={() => irPara(fase.i === 0 ? { tipo: 'intro' } : { tipo: 'area', i: fase.i - 1 })}
          onAvancar={() =>
            irPara(fase.i === AREAS.length - 1 ? { tipo: 'resultado' } : { tipo: 'area', i: fase.i + 1 })
          }
        />
      )}

      {fase.tipo === 'resultado' && (
        <Resultado
          resultado={resultado}
          respostas={respostas}
          onRefazer={() => {
            setRespostas({})
            irPara({ tipo: 'intro' })
          }}
        />
      )}
    </div>
  )
}

function Intro({ onComecar }: { onComecar: () => void }) {
  return (
    <div>
      <p className="max-w-[60ch] text-lg leading-relaxed text-foreground">
        São {TOTAL_PERGUNTAS} perguntas em {AREAS.length} áreas, em linguagem do dia a dia da
        clínica. Leva uns cinco minutos. No fim você vê o nível de maturidade da clínica e a nota de
        cada área.
      </p>
      <ul className="mt-8 flex flex-col gap-3 text-foreground">
        {AREAS.map((a) => (
          <li key={a.id} className="flex gap-3 leading-relaxed">
            <span aria-hidden="true" className="mt-[0.6em] h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: CAMEL }} />
            <span>
              <strong className="font-medium">{a.nome}.</strong> {a.descricao}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-8 max-w-[60ch] leading-relaxed text-foreground/80">
        Suas respostas ficam só no seu navegador. Nada é enviado, a menos que você peça o
        diagnóstico no final.
      </p>
      <button type="button" onClick={onComecar} className={`${btnPrimario} mt-10`} style={{ backgroundColor: CAMEL, color: NAVY }}>
        Começar a autoavaliação
      </button>
    </div>
  )
}

function EtapaArea({
  i,
  respostas,
  respondidas,
  onResponder,
  onVoltar,
  onAvancar,
}: {
  i: number
  respostas: Respostas
  respondidas: number
  onResponder: (id: string, r: Resposta) => void
  onVoltar: () => void
  onAvancar: () => void
}) {
  const area = AREAS[i]
  const completa = area.perguntas.every((p) => respostas[p.id])
  const ultima = i === AREAS.length - 1

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-foreground/80">
        <span>
          Área {i + 1} de {AREAS.length}
        </span>
        <span className="tabular-nums">
          {respondidas} de {TOTAL_PERGUNTAS} respondidas
        </span>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-label="Progresso da autoavaliação"
        aria-valuemin={0}
        aria-valuemax={TOTAL_PERGUNTAS}
        aria-valuenow={respondidas}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${(respondidas / TOTAL_PERGUNTAS) * 100}%`, backgroundColor: CAMEL }}
        />
      </div>

      <h2 className="mt-12 text-2xl leading-snug font-medium tracking-wide uppercase sm:text-3xl" style={{ ...headingFont, color: NAVY }}>
        {area.nome}
      </h2>
      <p className="mt-3 text-lg text-foreground">{area.descricao}</p>

      <div className="mt-10 flex flex-col gap-10">
        {area.perguntas.map((p) => (
          <fieldset key={p.id} className="min-w-0">
            <legend className="text-lg leading-relaxed font-medium text-foreground">{p.texto}</legend>
            <p className="mt-2 max-w-[62ch] leading-relaxed text-foreground/80">{p.ajuda}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {OPCOES.map((o) => {
                const marcado = respostas[p.id] === o.valor
                return (
                  <label
                    key={o.valor}
                    className={`flex h-12 cursor-pointer items-center justify-center rounded-full px-4 text-base transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--lovisa-navy)] has-[:focus-visible]:ring-offset-2 ${
                      marcado ? 'font-medium text-white' : 'bg-card text-foreground hover:bg-secondary'
                    }`}
                    style={marcado ? { backgroundColor: NAVY } : undefined}
                  >
                    <input
                      type="radio"
                      name={p.id}
                      value={o.valor}
                      checked={marcado}
                      onChange={() => onResponder(p.id, o.valor)}
                      className="sr-only"
                    />
                    {o.rotulo}
                  </label>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={onVoltar} className={btnSecundario}>
          Voltar
        </button>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={onAvancar}
            disabled={!completa}
            className={btnPrimario}
            style={{ backgroundColor: CAMEL, color: NAVY }}
          >
            {ultima ? 'Ver meu resultado' : 'Próxima área'}
          </button>
          {!completa && <span className="text-sm text-foreground/80">Responda todas as perguntas desta área para seguir.</span>}
        </div>
      </div>
    </div>
  )
}

type ResultadoCalc = ReturnType<typeof calcular>

function relatorio(resultado: ResultadoCalc, respostas: Respostas) {
  const rotulo = (r?: Resposta) => OPCOES.find((o) => o.valor === r)?.rotulo ?? '—'
  return [
    `Nível: ${resultado.nivel.nome} (${resultado.geral}%)`,
    ...resultado.areas.map((a) => `- ${a.nome}: ${a.pct}%`),
    '',
    'Respostas:',
    ...AREAS.flatMap((a) =>
      a.perguntas.map((p) => `[${rotulo(respostas[p.id])}] (P${p.prioridade}) ${p.texto} — ${p.ref}`),
    ),
  ].join('\n')
}

function Resultado({
  resultado,
  respostas,
  onRefazer,
}: {
  resultado: ResultadoCalc
  respostas: Respostas
  onRefazer: () => void
}) {
  const [envio, setEnvio] = useState<Envio>('idle')
  const [viaMailto, setViaMailto] = useState(false)
  const criticas = resultado.lacunas.filter((l) => l.prioridade === 3).length

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (f.get('empresa_site')) {
      setEnvio('sent')
      return
    }
    const dados = {
      origem: 'autoavaliacao',
      nome: String(f.get('nome') ?? '').trim(),
      email: String(f.get('email') ?? '').trim(),
      clinica: String(f.get('clinica') ?? '').trim(),
      profissionais: String(f.get('profissionais') ?? ''),
      nivel: resultado.nivel.nome,
      pontuacao: `${resultado.geral}%`,
      lacunas: String(resultado.lacunas.length),
      lacunas_criticas: String(criticas),
      relatorio: relatorio(resultado, respostas),
    }
    setEnvio('sending')
    try {
      const como = await enviarLead(dados, {
        assunto: `Autoavaliação LGPD — ${dados.clinica || dados.nome} (${dados.nivel}, ${dados.pontuacao})`,
        corpo: [
          `Nome: ${dados.nome}`,
          `E-mail: ${dados.email}`,
          `Clínica: ${dados.clinica}`,
          `Profissionais: ${dados.profissionais}`,
          '',
          dados.relatorio,
        ].join('\n'),
      })
      setViaMailto(como === 'mailto')
      setEnvio('sent')
    } catch {
      setEnvio('error')
    }
  }

  return (
    <div>
      <p className="text-lg text-foreground">Nível de maturidade da sua clínica</p>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-2" aria-live="polite">
        <span className="text-5xl font-medium tracking-wide uppercase sm:text-6xl" style={{ ...headingFont, color: NAVY }}>
          {resultado.nivel.nome}
        </span>
        <span className="text-3xl tabular-nums" style={{ ...headingFont, color: CAMEL }}>
          {resultado.geral}%
        </span>
      </p>
      <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-foreground">{resultado.nivel.texto}</p>

      <h2 className="mt-14 text-xl font-medium tracking-wide uppercase sm:text-2xl" style={{ ...headingFont, color: NAVY }}>
        Nota por área
      </h2>
      <dl className="mt-6 flex flex-col gap-5">
        {resultado.areas.map((a) => (
          <div key={a.id}>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-foreground">{a.nome}</dt>
              <dd className="font-medium tabular-nums text-foreground">{a.pct}%</dd>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
              <div className="h-full rounded-full" style={{ width: `${Math.max(a.pct, 2)}%`, backgroundColor: a.pct >= 50 ? NAVY : CAMEL }} />
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-14 rounded-2xl p-8 text-white lg:p-10" style={{ backgroundColor: NAVY }}>
        <p className="text-2xl leading-snug font-medium tracking-wide uppercase sm:text-3xl" style={headingFont}>
          {resultado.lacunas.length === 0 ? (
            'Nenhuma lacuna nas respostas'
          ) : (
            <>
              <span style={{ color: CAMEL }} className="tabular-nums">
                {resultado.lacunas.length}
              </span>{' '}
              {resultado.lacunas.length === 1 ? 'ponto de atenção' : 'pontos de atenção'}
            </>
          )}
        </p>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-white/90">
          {criticas > 0
            ? `${criticas} ${criticas === 1 ? 'deles envolve' : 'deles envolvem'} exigências diretas da LGPD. `
            : ''}
          {resultado.naoSei > 0
            ? `Em ${resultado.naoSei} ${resultado.naoSei === 1 ? 'pergunta' : 'perguntas'} a resposta foi "não sei", o que já é um sinal a investigar. `
            : ''}
          No diagnóstico eu analiso cada ponto com você, priorizo pelo risco e entrego o plano de ação.
        </p>
      </div>

      <h2 id="pedir-diagnostico" className="mt-14 text-xl font-medium tracking-wide uppercase sm:text-2xl" style={{ ...headingFont, color: NAVY }}>
        Receber o diagnóstico
      </h2>
      {envio === 'sent' ? (
        <p role="status" className="mt-4 max-w-[60ch] text-lg leading-relaxed text-foreground">
          {viaMailto
            ? 'Abrimos o seu e-mail com o resultado pronto. É só enviar por lá.'
            : 'Recebi seu resultado. Respondo em até dois dias úteis para combinarmos a conversa.'}
        </p>
      ) : (
        <form onSubmit={enviar} className="relative mt-6 grid max-w-2xl gap-5 sm:grid-cols-2" aria-labelledby="pedir-diagnostico">
          <Campo id="aa-nome" name="nome" label="Nome" autoComplete="name" required />
          <Campo id="aa-email" name="email" label="E-mail" type="email" autoComplete="email" required />
          <Campo id="aa-clinica" name="clinica" label="Clínica ou consultório" autoComplete="organization" required />
          <div className="flex flex-col gap-2">
            <label htmlFor="aa-prof" className="text-sm font-medium" style={{ color: NAVY }}>
              Profissionais na clínica
            </label>
            <select
              id="aa-prof"
              name="profissionais"
              defaultValue="1 a 5"
              className="h-12 w-full rounded-lg border border-border bg-background px-4 text-primary focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
            >
              <option>1 a 5</option>
              <option>6 a 20</option>
              <option>21 a 50</option>
              <option>Mais de 50</option>
            </select>
          </div>
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="aa-hp">Não preencha este campo</label>
            <input id="aa-hp" name="empresa_site" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <label className="flex gap-3 leading-relaxed text-foreground sm:col-span-2">
            <input type="checkbox" required className="mt-1.5 h-4 w-4 shrink-0 accent-[var(--lovisa-navy)]" />
            <span>
              Autorizo o envio das minhas respostas e contato para receber o diagnóstico, conforme o{' '}
              <Link href="/privacidade" className="underline underline-offset-2">
                aviso de privacidade
              </Link>
              .
            </span>
          </label>
          {envio === 'error' && (
            <p role="alert" className="rounded-lg bg-[var(--status-critico)]/10 px-4 py-3 text-foreground sm:col-span-2">
              Não consegui enviar agora.{' '}
              {CONTACT_EMAIL ? (
                <>
                  Escreva para{' '}
                  <a className="font-medium underline" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                  </a>{' '}
                  ou tente de novo.
                </>
              ) : (
                'Tente de novo em instantes.'
              )}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <button type="submit" disabled={envio === 'sending'} className={btnPrimario} style={{ backgroundColor: CAMEL, color: NAVY }}>
              {envio === 'sending' ? 'Enviando…' : 'Quero o diagnóstico'}
            </button>
            <button type="button" onClick={onRefazer} className={btnSecundario}>
              Refazer a autoavaliação
            </button>
          </div>
        </form>
      )}

      <p className="mt-12 max-w-[62ch] text-sm leading-relaxed text-foreground/80">
        Resultado orientativo, calculado só a partir das suas respostas. Não é diagnóstico nem
        parecer jurídico. As perguntas foram inspiradas nos controles da ABNT NBR ISO/IEC 27701 e nos
        requisitos da LGPD.
      </p>
    </div>
  )
}

function Campo({
  id,
  name,
  label,
  type = 'text',
  autoComplete,
  required,
}: {
  id: string
  name: string
  label: string
  type?: string
  autoComplete?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: NAVY }}>
        {label}
        {required && <span aria-hidden="true" style={{ color: CAMEL }}> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        spellCheck={type === 'email' ? false : undefined}
        className="h-12 w-full rounded-lg border border-border bg-background px-4 text-primary focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
      />
    </div>
  )
}
