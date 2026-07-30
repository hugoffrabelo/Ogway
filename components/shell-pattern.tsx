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

/** A single small scute emblem, used as the brand mark. */
export function ShellMark({ className }: { className?: string }) {
  const size = 9
  const ring = (r: number, cxy: number) => {
    const pts: string[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 90)
      pts.push(
        `${(cxy + r * Math.cos(angle)).toFixed(2)},${(cxy + r * Math.sin(angle)).toFixed(2)}`,
      )
    }
    return pts.join(' ')
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn('h-6 w-6', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinejoin="round"
    >
      <polygon points={ring(11, 12)} />
      <polygon points={ring(6.5, 12)} />
      <line x1="12" y1="1" x2="12" y2="5.5" />
      <line x1="21.5" y1="6.5" x2="17.6" y2="8.8" />
      <line x1="21.5" y1="17.5" x2="17.6" y2="15.2" />
      <line x1="12" y1="23" x2="12" y2="18.5" />
      <line x1="2.5" y1="17.5" x2="6.4" y2="15.2" />
      <line x1="2.5" y1="6.5" x2="6.4" y2="8.8" />
    </svg>
  )
}
