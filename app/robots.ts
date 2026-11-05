import type { MetadataRoute } from 'next'
import { url } from '@/lib/seo'

export const dynamic = 'force-static'

// Atenção: no GitHub Pages sem domínio próprio, o Google só lê o robots.txt
// da raiz (hugoffrabelo.github.io/robots.txt), não o de /Ogway. Este arquivo
// passa a valer quando o site tiver domínio próprio — ver docs/SEO-pendencias.md.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/cockpit', '/portal', '/login'] }],
    sitemap: url('/sitemap.xml'),
  }
}
