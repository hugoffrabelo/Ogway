import { AREAS, TOTAL_PERGUNTAS } from '@/lib/autoavaliacao'

// Colmeia parada da abertura de /autoavaliacao: as 6 áreas avaliadas ao
// redor do hexágono central, na mesma geometria da animação da home
// (components/autodiagnostico-demo.tsx). Decorativa — a lista de áreas fica
// também em texto para leitores de tela.
const CAMEL = 'var(--lovisa-camel)'
const NAVY = 'var(--lovisa-navy)'

const R = 58
const GAP = 1.1
const W = Math.sqrt(3) * R * GAP
const POS: [number, number][] = [
  [200 - W / 2, 200 - 1.5 * R * GAP],
  [200 + W / 2, 200 - 1.5 * R * GAP],
  [200 + W, 200],
  [200 + W / 2, 200 + 1.5 * R * GAP],
  [200 - W / 2, 200 + 1.5 * R * GAP],
  [200 - W, 200],
]
const hex = (cx: number, cy: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2
    return `${(cx + R * Math.cos(a)).toFixed(1)},${(cy + R * Math.sin(a)).toFixed(1)}`
  }).join(' ')

// Rótulos curtos, na ordem das áreas em lib/autoavaliacao.ts.
const CURTO = ['Responsáveis', 'Dados', 'Pacientes', 'Descarte', 'Fornecedores', 'Segurança']
// alterna camelo cheio e contorno, como uma colmeia "meio preenchida"
const CHEIO = [true, false, true, false, true, false]

export function ColmeiaAreas() {
  return (
    <div>
      <ul className="sr-only">
        {AREAS.map((a) => (
          <li key={a.id}>{a.nome}</li>
        ))}
      </ul>
      <svg
        aria-hidden="true"
        viewBox="28 28 344 344"
        className="mx-auto block w-full max-w-[26rem]"
        style={{ fontFamily: 'var(--font-poppins)' }}
      >
        {POS.map(([x, y], i) => (
          <g key={CURTO[i]}>
            <polygon
              points={hex(x, y)}
              fill={CHEIO[i] ? CAMEL : 'rgba(255,255,255,0.04)'}
              stroke={CHEIO[i] ? CAMEL : 'rgba(255,255,255,0.4)'}
              strokeWidth={1.4}
            />
            <text
              x={x}
              y={y + 5}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight={500}
              fill={CHEIO[i] ? NAVY : 'white'}
            >
              {CURTO[i]}
            </text>
          </g>
        ))}
        <polygon points={hex(200, 200)} fill="white" stroke={CAMEL} strokeWidth={1.6} />
        <text x={200} y={203} textAnchor="middle" fontSize="30" fill={NAVY} style={{ fontFamily: 'var(--font-cinzel)' }}>
          {TOTAL_PERGUNTAS}
        </text>
        <text x={200} y={224} textAnchor="middle" fontSize="10" letterSpacing="0.08em" fill={NAVY} style={{ fontFamily: 'var(--font-cinzel)' }}>
          PERGUNTAS
        </text>
      </svg>
    </div>
  )
}
