'use client'

import { useEffect, useRef, useState } from 'react'
import { BASE_PATH } from '@/lib/base-path'

/**
 * Vídeo de apresentação dos serviços (fonte: motion/apresentacao.html,
 * gravado em public/video/apresentacao.mp4 — ver motion/README.md).
 *
 * Peso: o arquivo só é baixado quando o vídeo chega perto da tela
 * (preload="none" + src atribuído no IntersectionObserver); fora da tela,
 * pausa. Acessibilidade: mudo, com botão de pausar (movimento > 5 s,
 * WCAG 2.2.2); com prefers-reduced-motion não toca sozinho — mostra o
 * quadro final e um botão para assistir; o conteúdo também está em texto.
 */
export function VideoApresentacao() {
  const ref = useRef<HTMLVideoElement>(null)
  const [carregar, setCarregar] = useState(false)
  const [tocando, setTocando] = useState(false)
  const [reduzido, setReduzido] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduzido(mq.matches)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCarregar(true)
          if (!mq.matches && v.dataset.pausadoPeloUsuario !== '1') v.play().catch(() => {})
        } else {
          v.pause()
        }
      },
      { rootMargin: '200px 0px', threshold: 0.25 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  function alternar() {
    const v = ref.current
    if (!v) return
    setCarregar(true)
    if (v.paused) {
      v.dataset.pausadoPeloUsuario = '0'
      v.play().catch(() => {})
    } else {
      v.dataset.pausadoPeloUsuario = '1'
      v.pause()
    }
  }

  return (
    <figure className="relative">
      <div className="relative aspect-video overflow-hidden rounded-2xl" style={{ backgroundColor: 'var(--lovisa-navy)' }}>
        <video
          ref={ref}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          poster={`${BASE_PATH}/video/apresentacao-poster.jpg`}
          aria-describedby="video-apresentacao-desc"
          onPlay={() => setTocando(true)}
          onPause={() => setTocando(false)}
        >
          {carregar && <source src={`${BASE_PATH}/video/apresentacao.mp4`} type="video/mp4" />}
        </video>
        <button
          type="button"
          onClick={alternar}
          className="absolute right-4 bottom-4 inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--lovisa-navy)] focus-visible:outline-none"
          style={{ backgroundColor: 'var(--lovisa-camel)', color: 'var(--lovisa-navy)' }}
          aria-pressed={!tocando}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
            {tocando ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M4 2.5v11l9-5.5z" />}
          </svg>
          {tocando ? 'Pausar vídeo' : reduzido ? 'Assistir ao vídeo' : 'Continuar vídeo'}
        </button>
      </div>
      <figcaption id="video-apresentacao-desc" className="sr-only">
        Vídeo sem som apresentando os quatro serviços da Ogway: adequação completa, em seis
        etapas; encarregado contínuo, mês a mês; consultoria pontual para site, contratos ou
        sistemas; e documentos avulsos como política, ROPA, RIPD e plano de incidentes.
      </figcaption>
    </figure>
  )
}
