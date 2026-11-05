import { cn } from '@/lib/utils'

type ShellPatternProps = {
  className?: string
  /** stroke color, defaults to currentColor */
  stroke?: string
  /** hex size (circumradius) */
  size?: number
  width?: number
  height?: number
  opacity?: number
}

/**
 * A discreet abstract motif inspired by a tortoise-shell / scute tessellation.
 * Evokes shelter and longevity without any literal illustration.
 */
export function ShellPattern({
  className,
  stroke = 'currentColor',
  size = 48,
  width = 1200,
  height = 800,
  opacity = 1,
}: ShellPatternProps) {
  // Colmeia flat-top desenhada como <pattern>: um ladrilho de 3·size por
  // √3·size com 5 hexágonos (4 cantos + centro) que o navegador repete.
  // Antes eram centenas de <polygon> por seção (2.568 na home), duplicados
  // no payload de hidratação do Next — ~600 KB de HTML só de decoração.
  const vert = Math.sqrt(3) * size
  const tileW = 3 * size
  const hex = (cx: number, cy: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i
      return `${(cx + size * Math.cos(a)).toFixed(2)},${(cy + size * Math.sin(a)).toFixed(2)}`
    }).join(' ')
  const centros: [number, number][] = [
    [0, 0],
    [tileW, 0],
    [0, vert],
    [tileW, vert],
    [1.5 * size, vert / 2],
  ]
  // id determinístico (funciona em Server Component, sem useId): inclui a
  // classe porque a cor vem de currentColor — Pilares (branco) e Quem cuida
  // (navy) usam o mesmo size e não podem compartilhar o <pattern>.
  const chave = `${size}|${stroke}|${className ?? ''}`
  let h = 0
  for (let i = 0; i < chave.length; i++) h = (h * 31 + chave.charCodeAt(i)) >>> 0
  const id = `shell-${size}-${h.toString(36)}`

  return (
    <svg
      aria-hidden="true"
      className={cn('pointer-events-none select-none', className)}
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      style={{ opacity }}
    >
      <defs>
        <pattern id={id} width={tileW} height={vert.toFixed(2)} patternUnits="userSpaceOnUse">
          <g stroke={stroke} strokeWidth={1}>
            {centros.map(([x, y]) => (
              <polygon key={`${x}-${y}`} points={hex(x, y)} />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${id})`} />
    </svg>
  )
}

// Marca da Ogway definida pelo cliente (hexágono navy + cubo bicolor
// camelo/dourado) — cores fixas (--lovisa-* em app/tokens.css), não segue
// currentColor como o resto deste arquivo, porque é uma marca, não um
// ícone recolorável.
const MARK_NAVY = 'var(--lovisa-navy)'
const MARK_CAMEL_DARK = 'var(--lovisa-camel)'
const MARK_CAMEL_LIGHT = 'var(--lovisa-camel-light)'

/** A marca da Ogway: hexágono com um cubo bicolor no centro. */
export function ShellMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn('h-6 w-6', className)}
    >
      <polygon
        points="12,1.5 21.09,6.75 21.09,17.25 12,22.5 2.91,17.25 2.91,6.75"
        fill="none"
        stroke={MARK_NAVY}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <polygon points="12,7 16.33,9.5 16.33,14.5 12,17" fill={MARK_CAMEL_LIGHT} />
      <polygon points="12,7 7.67,9.5 7.67,14.5 12,17" fill={MARK_CAMEL_DARK} />
    </svg>
  )
}

/**
 * Variante monocromática da marca, seguindo os arquivos em
 * logos/logo_marcadagua/ (clara e escura) — usa currentColor, ao contrário
 * do ShellMark (que tem cor fixa), justamente pra servir de marca d'água
 * translúcida tanto sobre fundo escuro quanto claro.
 */
export function ShellWatermark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <polygon
        points="12,1.5 21.09,6.75 21.09,17.25 12,22.5 2.91,17.25 2.91,6.75"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <polygon
        points="12,7 16.33,9.5 16.33,14.5 12,17 7.67,14.5 7.67,9.5"
        fill="currentColor"
      />
    </svg>
  )
}
