import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cinzel, Fraunces, Instrument_Sans, Poppins } from 'next/font/google'
import './globals.css'
import { SITE_URL, url } from '@/lib/seo'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
})

// Referência Lovisa Malin, sendo aplicada seção a seção pela landing (por
// enquanto: Pillars e o cabeçalho) — não substitui Fraunces/Instrument Sans
// nas partes que ainda não passaram por essa repaginação. Cinzel é a
// alternativa gratuita padrão pra Trajan Pro (fonte paga da Adobe usada no
// Figma de referência) — mesma inspiração em maiúsculas romanas
// inscricionais, sem depender de assinatura.
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-cinzel',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '500'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: 'DPO e LGPD para clínicas em Porto Alegre | Ogway',
    template: '%s',
  },
  description:
    'Encarregado de dados (DPO), adequação à LGPD e consultoria para clínicas e consultórios em Porto Alegre: políticas, mapeamento de dados, contratos, sites e sistemas.',
  applicationName: 'Ogway',
  authors: [{ name: 'Hugo França' }],
  alternates: { canonical: url('/') },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ogway',
    url: url('/'),
    title: 'DPO e LGPD para clínicas em Porto Alegre | Ogway',
    description:
      'Encarregado de dados, adequação à LGPD e consultoria para clínicas. Faça a autoavaliação gratuita em cinco minutos.',
    images: [{ url: url('/og.png'), width: 1200, height: 630, alt: 'Ogway — LGPD para clínicas' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f1e8d8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${instrument.variable} ${cinzel.variable} ${poppins.variable} bg-background`}
    >
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
