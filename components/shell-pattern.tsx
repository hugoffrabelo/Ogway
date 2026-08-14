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
  const hexes: string[] = []

  // flat-top honeycomb
  const horiz = 1.5 * size
  const vert = Math.sqrt(3) * size

  for (let col = 0; col * horiz < width + size * 2; col++) {
    for (let row = 0; row * vert < height + size * 2; row++) {
      const cx = col * horiz
      const cy = row * vert + (col % 2 === 0 ? 0 : vert / 2)
      const pts: string[] = []
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i)
        const px = cx + size * Math.cos(angle)
        const py = cy + size * Math.sin(angle)
        pts.push(`${px.toFixed(2)},${py.toFixed(2)}`)
      }
      hexes.push(pts.join(' '))
    }
  }

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
      <g stroke={stroke} strokeWidth={1}>
        {hexes.map((points, i) => (
          <polygon key={i} points={points} />
        ))}
      </g>
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
