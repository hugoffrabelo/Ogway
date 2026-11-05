'use client'

import { useEffect, useState, type ComponentType } from 'react'

/**
 * Carrega o objeto 3D (three.js + react-three-fiber + drei, ~180 KB gzip) só
 * em telas a partir de 1024px — abaixo disso ele nem aparece (o hero o
 * esconde com `hidden lg:block`), mas o import estático fazia o celular
 * baixar tudo assim mesmo. O import também espera o navegador ficar ocioso,
 * para não disputar banda com o texto e as fontes do primeiro carregamento.
 */
export function Shell3DLazy({ className }: { className?: string }) {
  const [Comp, setComp] = useState<ComponentType<{ className?: string }> | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    let cancelado = false
    const carregar = () => {
      if (!mq.matches || Comp) return
      const go = () =>
        import('@/components/shell-3d').then((m) => {
          if (!cancelado) setComp(() => m.Shell3D)
        })
      if ('requestIdleCallback' in window) window.requestIdleCallback(go, { timeout: 2500 })
      else setTimeout(go, 1200)
    }
    carregar()
    mq.addEventListener('change', carregar)
    return () => {
      cancelado = true
      mq.removeEventListener('change', carregar)
    }
  }, [Comp])

  return Comp ? <Comp className={className} /> : <div className={className} aria-hidden="true" />
}
