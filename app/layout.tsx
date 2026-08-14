import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cinzel, Fraunces, Instrument_Sans, Poppins } from 'next/font/google'
import './globals.css'

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
  title: 'Ogway — Encarregado de proteção de dados para clínicas',
  description:
    'DPO como serviço para clínicas e consultórios de saúde. Proteção de dados tratada como confiança e tranquilidade, com o cuidado de um consultor sênior dedicado.',
  generator: 'v0.app',
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
