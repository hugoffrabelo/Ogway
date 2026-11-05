/**
 * SEO compartilhado: URL canônica, dados da empresa e JSON-LD (schema.org).
 *
 * NEXT_PUBLIC_SITE_URL é a URL pública sem barra no fim. Hoje o site está no
 * GitHub Pages (https://hugoffrabelo.github.io/Ogway); ao mudar para domínio
 * próprio, troque só a variável — canonical, sitemap e schema acompanham.
 */
import { CONTACT_EMAIL } from '@/lib/contact'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hugoffrabelo.github.io/Ogway').replace(/\/$/, '')

export const url = (path = '/') => `${SITE_URL}${path === '/' ? '/' : path}`

export const EMPRESA = {
  nome: 'Ogway',
  descricao:
    'Encarregado de dados (DPO), adequação à LGPD e consultoria em proteção de dados para clínicas, consultórios e laboratórios em Porto Alegre.',
  cidade: 'Porto Alegre',
  estado: 'RS',
  responsavel: 'Hugo França',
}

type Json = Record<string, unknown>

export function schemaEmpresa(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#empresa`,
    name: EMPRESA.nome,
    description: EMPRESA.descricao,
    url: url('/'),
    logo: url('/icon.svg'),
    image: url('/og.png'),
    ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
    // Sem endereço de rua: negócio de área de atendimento. Endereço inventado
    // ou de fachada é pior para SEO local do que nenhum.
    address: {
      '@type': 'PostalAddress',
      addressLocality: EMPRESA.cidade,
      addressRegion: EMPRESA.estado,
      addressCountry: 'BR',
    },
    areaServed: [
      { '@type': 'City', name: 'Porto Alegre' },
      { '@type': 'AdministrativeArea', name: 'Região Metropolitana de Porto Alegre' },
      { '@type': 'State', name: 'Rio Grande do Sul' },
      { '@type': 'Country', name: 'Brasil' },
    ],
    knowsAbout: [
      'LGPD',
      'Encarregado de proteção de dados (DPO)',
      'Proteção de dados na saúde',
      'ABNT NBR ISO/IEC 27701',
      'Registro das operações de tratamento (ROPA)',
      'Relatório de impacto à proteção de dados (RIPD)',
    ],
    founder: { '@id': `${SITE_URL}/#hugo` },
  }
}

export function schemaPessoa(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#hugo`,
    name: EMPRESA.responsavel,
    jobTitle: 'Encarregado de proteção de dados (DPO)',
    worksFor: { '@id': `${SITE_URL}/#empresa` },
    knowsAbout: ['LGPD', 'Proteção de dados', 'GRC', 'Segurança da informação'],
  }
}

export function schemaSite(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#site`,
    name: EMPRESA.nome,
    url: url('/'),
    inLanguage: 'pt-BR',
    publisher: { '@id': `${SITE_URL}/#empresa` },
  }
}

export function schemaFaq(perguntas: { p: string; r: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: perguntas.map((q) => ({
      '@type': 'Question',
      name: q.p,
      acceptedAnswer: { '@type': 'Answer', text: q.r },
    })),
  }
}

export function schemaServico(nome: string, descricao: string, path: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: nome,
    description: descricao,
    url: url(path),
    serviceType: nome,
    provider: { '@id': `${SITE_URL}/#empresa` },
    areaServed: { '@type': 'City', name: 'Porto Alegre' },
    audience: { '@type': 'Audience', audienceType: 'Clínicas, consultórios e laboratórios' },
  }
}

export function schemaBreadcrumb(itens: { nome: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nome,
      item: url(it.path),
    })),
  }
}

/** Serializa JSON-LD escapando "<" para não fechar o <script> por engano. */
export const jsonLd = (dados: Json | Json[]) => JSON.stringify(dados).replace(/</g, '\\u003c')
