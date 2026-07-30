'use client'

import { useEffect, useRef } from 'react'

type Variant = 'light' | 'dark'

/**
 * A lightweight canvas 2D field of slow-drifting motes.
 * - `dark` variant: warm gold motes for navy sections.
 * - `light` variant: soft navy/gold motes for the sand canvas.
 * Respects prefers-reduced-motion, pauses when off-screen, and
 * handles DPR + resize. Purely decorative (aria-hidden).
 */
export function ParticleField({
  variant = 'dark',
  density = 0.00008,
  className,
}: {
  variant?: Variant
  density?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const colors =
      variant === 'dark'
        ? ['196, 162, 76', '241, 232, 216', '182, 198, 226']
        : ['30, 46, 69', '196, 162, 76']

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let visible = true

    type P = {
      x: number
      y: number
      r: number
      vx: number
      vy: number
      base: number
      phase: number
      speed: number
      color: string
    }
    let particles: P[] = []

    function build() {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.max(
        10,
        Math.min(70, Math.round(width * height * density)),
      )
      particles = Array.from({ length: count }, () => {
        const r = Math.random() * 1.6 + 0.4
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r,
          vx: (Math.random() - 0.5) * 0.12,
          vy: -(Math.random() * 0.14 + 0.03),
          base: Math.random() * 0.4 + 0.15,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.6 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
        }
      })
    }

    let t = 0
    function frame() {
      t += 0.016
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -4) {
          p.y = height + 4
          p.x = Math.random() * width
        }
        if (p.x < -4) p.x = width + 4
        if (p.x > width + 4) p.x = -4

        const twinkle = p.base + Math.sin(t * p.speed + p.phase) * 0.18
        const alpha = Math.max(0, Math.min(0.7, twinkle))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${p.base})`
        ctx.fill()
      }
    }

    function start() {
      if (reduce) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(frame)
    }
    function stop() {
      cancelAnimationFrame(raf)
    }

    build()
    if (reduce) drawStatic()
    else start()

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (reduce) return
        if (visible) start()
        else stop()
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    let resizeRaf = 0
    function onResize() {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(() => {
        build()
        if (reduce) drawStatic()
      })
    }
    window.addEventListener('resize', onResize)

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [variant, density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  )
}
