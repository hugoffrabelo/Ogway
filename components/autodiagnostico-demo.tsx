'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Demonstração animada da autoavaliação (/autoavaliacao), feita em SVG + CSS
 * (não é vídeo: poucos KB, nítida em qualquer tela).
 *
 * Conceito: a colmeia da marca. Seis hexágonos — um por área avaliada —
 * cercam o hexágono central, como o casco do logo. A cada pergunta
 * respondida, o hexágono daquela área enche de camelo de baixo pra cima até
 * a nota dela; no fim, o central revela o nível de maturidade.
 *
 * Quatro clínicas fictícias se revezam (uma por volta, começando por uma
 * sorteada), cada uma com perguntas, respostas e nível diferentes, para a
 * demonstração não parecer um vídeo repetido. As perguntas vêm da
 * autoavaliação real (lib/autoavaliacao.ts) e a nota central é a média das
 * seis áreas, nas mesmas faixas de nível da autoavaliação.
 *
 * A pergunta da vez fica ACIMA da colmeia: quem rola a página lê a pergunta
 * antes de ver o hexágono encher.
 *
 * Acessibilidade: botão de pausar (movimento automático > 5 s — WCAG 2.2.2);
 * com prefers-reduced-motion mostra só o quadro final de um cenário; fora da
 * tela, para.
 */

const CAMEL = 'var(--lovisa-camel)'
const NAVY = 'var(--lovisa-navy)'

type Area = { pergunta: string; resposta: string; pct: number }
type Cenario = { clinica: string; nivel: string; areas: Area[] }

// Ordem das áreas = ordem dos hexágonos em POS.
const ROTULOS = ['Responsáveis', 'Dados', 'Pacientes', 'Descarte', 'Fornecedores', 'Segurança']

const CENARIOS: Cenario[] = [
  {
    clinica: 'Consultório de psicologia · 1 profissional',
    nivel: 'Inicial',
    areas: [
      { pergunta: 'Existe um encarregado nomeado?', resposta: 'Não', pct: 17 },
      { pergunta: 'A base legal de cada uso de dados está definida?', resposta: 'Não sei', pct: 13 },
      { pergunta: 'O paciente encontra o aviso de privacidade?', resposta: 'Em parte', pct: 33 },
      { pergunta: 'Exames enviados por WhatsApp são controlados?', resposta: 'Não', pct: 25 },
      { pergunta: 'Sabe se a agenda online guarda dados fora do Brasil?', resposta: 'Não sei', pct: 17 },
      { pergunta: 'Se houver um vazamento, sabe o que fazer?', resposta: 'Não', pct: 25 },
    ],
  },
  {
    clinica: 'Clínica odontológica · 6 dentistas',
    nivel: 'Em construção',
    areas: [
      { pergunta: 'Existe um encarregado nomeado?', resposta: 'Em parte', pct: 50 },
      { pergunta: 'A clínica sabe quais dados coleta e para quê?', resposta: 'Não sei', pct: 38 },
      { pergunta: 'O paciente encontra o aviso de privacidade?', resposta: 'Não', pct: 33 },
      { pergunta: 'Há prazo de guarda e descarte seguro?', resposta: 'Em parte', pct: 50 },
      { pergunta: 'Os contratos com fornecedores falam de LGPD?', resposta: 'Sim', pct: 50 },
      { pergunta: 'Cada pessoa usa login próprio no sistema?', resposta: 'Em parte', pct: 38 },
    ],
  },
  {
    clinica: 'Clínica médica · 15 profissionais',
    nivel: 'Estruturado',
    areas: [
      { pergunta: 'A política interna foi aprovada pela direção?', resposta: 'Sim', pct: 75 },
      { pergunta: 'Existe um ROPA atualizado no último ano?', resposta: 'Em parte', pct: 63 },
      { pergunta: 'Pedidos de cópia de dados têm prazo e registro?', resposta: 'Sim', pct: 67 },
      { pergunta: 'As fichas pedem só os dados necessários?', resposta: 'Em parte', pct: 50 },
      { pergunta: 'O laboratório parceiro tem cláusula de LGPD?', resposta: 'Sim', pct: 58 },
      { pergunta: 'O backup já foi testado?', resposta: 'Em parte', pct: 63 },
    ],
  },
  {
    clinica: 'Laboratório de análises · 30 pessoas',
    nivel: 'Avançado',
    areas: [
      { pergunta: 'Está claro quem decide sobre dados em cada área?', resposta: 'Sim', pct: 88 },
      { pergunta: 'Os tratamentos de alto risco têm RIPD?', resposta: 'Sim', pct: 75 },
      { pergunta: 'O consentimento pode ser retirado com facilidade?', resposta: 'Sim', pct: 83 },
      { pergunta: 'Há tabela de temporalidade e descarte seguro?', resposta: 'Em parte', pct: 75 },
      { pergunta: 'Os compartilhamentos com convênios são registrados?', resposta: 'Sim', pct: 83 },
      { pergunta: 'A equipe foi treinada nos últimos 12 meses?', resposta: 'Sim', pct: 75 },
    ],
  },
]

const media = (c: Cenario) => Math.round(c.areas.reduce((n, a) => n + a.pct, 0) / c.areas.length)

// Hexágonos de ponta para cima, como o ShellMark. Centro em (200,200).
const R = 58
const GAP = 1.1
const W = Math.sqrt(3) * R * GAP
const POS: [number, number][] = [
  [200 - W / 2, 200 - 1.5 * R * GAP], // em cima à esquerda
  [200 + W / 2, 200 - 1.5 * R * GAP], // em cima à direita
  [200 + W, 200], // direita
  [200 + W / 2, 200 + 1.5 * R * GAP], // embaixo à direita
  [200 - W / 2, 200 + 1.5 * R * GAP], // embaixo à esquerda
  [200 - W, 200], // esquerda
]
const hex = (cx: number, cy: number, r = R) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')

// Texto branco com contorno navy por baixo (paint-order): continua legível
// quando o enchimento camelo passa por trás dele (notas acima de ~55%).
const contorno = {
  paintOrder: 'stroke' as const,
  stroke: NAVY,
  strokeWidth: 3,
  strokeLinejoin: 'round' as const,
}

// Batidas de 900 ms: área i → 2i pergunta, 2i+1 resposta (enche).
// 12–17 resultado; 18 esvazia e entra a próxima clínica.
const BATIDA = 900
const TOTAL = 19
const FIM = 12

export function AutodiagnosticoDemo() {
  // Um único contador de batidas: o tempo dentro da volta e o cenário saem
  // dele, sem efeito colateral dentro de setState.
  const [n, setN] = useState(0)
  // começa sempre no mesmo cenário no servidor (sem diferença de hidratação)
  // e sorteia no navegador
  const [inicio, setInicio] = useState(1)
  const [rodando, setRodando] = useState(true)
  const [reduzido, setReduzido] = useState(false)
  const [visivel, setVisivel] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInicio(Math.floor(Math.random() * CENARIOS.length))
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const aplicar = () => {
      setReduzido(mq.matches)
      if (mq.matches) setN(FIM + 3)
    }
    aplicar()
    mq.addEventListener('change', aplicar)
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.3 })
    if (ref.current) io.observe(ref.current)
    return () => {
      mq.removeEventListener('change', aplicar)
      io.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!rodando || reduzido || !visivel) return
    const id = window.setInterval(() => setN((v) => v + 1), BATIDA)
    return () => window.clearInterval(id)
  }, [rodando, reduzido, visivel])

  const t = n % TOTAL
  const cen = (inicio + Math.floor(n / TOTAL)) % CENARIOS.length
  const c = CENARIOS[cen]
  const total = media(c)
  const resultado = t >= FIM && t < TOTAL - 1
  const atual = Math.min(Math.floor(t / 2), c.areas.length - 1)
  // área já perguntada (rótulo acende) e já respondida (hexágono enche)
  const respondeu = (i: number) => t < TOTAL - 1 && t >= 2 * i
  const cheia = (i: number) => t < TOTAL - 1 && t >= 2 * i + 1
  const pct = resultado ? Math.min(total, Math.round(((t - FIM + 1) / 3) * total)) : 0
  const mostraResposta = t >= 2 * atual + 1

  return (
    <div ref={ref} className="relative">
      <p className="sr-only">
        Demonstração da autoavaliação: clínicas de exemplo respondem uma pergunta de cada uma das
        seis áreas e, no fim, veem o nível de maturidade e a nota de cada área.
      </p>

      {/* legenda EM CIMA da colmeia: clínica de exemplo, pergunta da vez e resposta */}
      <div aria-hidden="true" className="mx-auto min-h-[7.5rem] max-w-[26rem] text-center">
        <p key={`c-${cen}`} className="animate-in fade-in text-sm text-white/75 duration-500">
          Exemplo: {c.clinica}
        </p>
        {resultado ? (
          <p key={`fim-${cen}`} className="animate-in fade-in mt-3 text-lg leading-relaxed text-white duration-500">
            Nível de maturidade: <span style={{ color: CAMEL }}>{c.nivel}</span>
          </p>
        ) : (
          <p key={`${cen}-${atual}`} className="animate-in fade-in slide-in-from-top-1 mt-3 duration-500">
            <span className="block text-lg leading-snug text-white">{c.areas[atual].pergunta}</span>
            <span
              className="mt-2 inline-block rounded-full px-3 py-0.5 text-sm transition-opacity duration-300"
              style={{ backgroundColor: CAMEL, color: NAVY, opacity: mostraResposta ? 1 : 0 }}
            >
              {c.areas[atual].resposta}
            </span>
          </p>
        )}
      </div>

      <svg
        aria-hidden="true"
        viewBox="28 28 344 344"
        className="mx-auto mt-2 block w-full max-w-[26rem]"
        style={{ fontFamily: 'var(--font-poppins)' }}
      >
        <defs>
          {POS.map(([x, y], i) => (
            <clipPath key={i} id={`demo-hex-${i}`}>
              <polygon points={hex(x, y)} />
            </clipPath>
          ))}
        </defs>

        {POS.map(([x, y], i) => {
          const a = c.areas[i]
          const ativa = !resultado && atual === i && t < FIM
          return (
            <g key={ROTULOS[i]}>
              {/* enchimento: sobe de baixo até a nota da área */}
              <g clipPath={`url(#demo-hex-${i})`}>
                <rect
                  x={x - R}
                  y={y - R}
                  width={2 * R}
                  height={2 * R}
                  fill={CAMEL}
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'bottom',
                    transform: `scaleY(${cheia(i) ? a.pct / 100 : 0})`,
                    transition: 'transform 900ms cubic-bezier(0.22,1,0.36,1)',
                    opacity: 0.9,
                  }}
                />
              </g>
              <polygon
                points={hex(x, y)}
                fill="none"
                stroke={ativa ? CAMEL : 'rgba(255,255,255,0.35)'}
                strokeWidth={ativa ? 2.4 : 1.4}
                style={{ transition: 'stroke 300ms' }}
              />
              <text
                x={x}
                y={y - 24}
                textAnchor="middle"
                fontSize="11.5"
                fill="white"
                style={{ ...contorno, opacity: respondeu(i) || resultado ? 1 : 0.55, transition: 'opacity 400ms' }}
              >
                {ROTULOS[i]}
              </text>
              <text
                x={x}
                y={y - 7}
                textAnchor="middle"
                fontSize="13"
                fontWeight={500}
                fill="white"
                className="tabular-nums"
                style={{ ...contorno, opacity: cheia(i) ? 1 : 0, transition: 'opacity 400ms 300ms' }}
              >
                {a.pct}%
              </text>
            </g>
          )
        })}

        {/* hexágono central: progresso e, no fim, o resultado */}
        <polygon
          points={hex(200, 200)}
          fill={resultado ? CAMEL : 'rgba(255,255,255,0.06)'}
          stroke={CAMEL}
          strokeWidth={1.6}
          style={{ transition: 'fill 600ms' }}
        />
        <text
          x={200}
          y={resultado ? 202 : 206}
          textAnchor="middle"
          fontSize={resultado ? 28 : 22}
          fill={resultado ? NAVY : 'white'}
          style={{ fontFamily: 'var(--font-cinzel)', transition: 'fill 600ms' }}
          className="tabular-nums"
        >
          {resultado ? `${pct}%` : `${Math.min(atual + (cheia(atual) ? 1 : 0), 6)}/6`}
        </text>
        <text
          x={200}
          y={224}
          textAnchor="middle"
          fontSize="9.5"
          letterSpacing="0.06em"
          fill={NAVY}
          style={{ fontFamily: 'var(--font-cinzel)', opacity: resultado ? 1 : 0, transition: 'opacity 500ms 300ms' }}
        >
          {c.nivel.toUpperCase()}
        </text>
      </svg>

      {!reduzido && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setRodando((r) => !r)}
            className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-white/90 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            aria-pressed={!rodando}
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
              {rodando ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M4 2.5v11l9-5.5z" />}
            </svg>
            {rodando ? 'Pausar demonstração' : 'Continuar demonstração'}
          </button>
        </div>
      )}
    </div>
  )
}
