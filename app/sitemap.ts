import type { MetadataRoute } from 'next'
import { PAGINAS } from '@/lib/paginas-servico'
import { url } from '@/lib/seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date()
  return [
    { url: url('/'), lastModified: agora, changeFrequency: 'monthly', priority: 1 },
    ...PAGINAS.map((p) => ({
      url: url(`/servicos/${p.slug}`),
      lastModified: agora,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    { url: url('/autoavaliacao'), lastModified: agora, changeFrequency: 'yearly', priority: 0.8 },
    { url: url('/privacidade'), lastModified: agora, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
