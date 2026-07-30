import { AlertOctagon, AlertTriangle, CheckCircle2, Circle, type LucideIcon } from 'lucide-react'

// Semântica de urgência do cockpit/portal — ver app/tokens.css (--status-*)
// e docs/frontend-cockpit-portal.md §3.2. Usado por StatusBadge, PrazoBadge
// e KpiCard. Regra: nunca só cor — todo consumidor deve exibir texto/ícone
// junto (StatusBadge e PrazoBadge já exigem `label` obrigatório).
export type StatusTom = 'ok' | 'atencao' | 'critico' | 'neutro'

interface StatusConfigEntry {
  icon: LucideIcon
  // Classes completas e estáticas (não interpoladas) — Tailwind precisa
  // ver a classe inteira no código-fonte pra incluí-la no build.
  badge: string
  texto: string
}

export const STATUS_CONFIG: Record<StatusTom, StatusConfigEntry> = {
  ok: {
    icon: CheckCircle2,
    badge: 'bg-status-ok/10 text-status-ok border-status-ok/30',
    texto: 'text-status-ok',
  },
  atencao: {
    icon: AlertTriangle,
    badge: 'bg-status-atencao/10 text-status-atencao border-status-atencao/30',
    texto: 'text-status-atencao',
  },
  critico: {
    icon: AlertOctagon,
    badge: 'bg-status-critico/10 text-status-critico border-status-critico/30',
    texto: 'text-status-critico',
  },
  neutro: {
    icon: Circle,
    badge: 'bg-status-neutro/10 text-status-neutro border-status-neutro/30',
    texto: 'text-status-neutro',
  },
}

function pluralDias(dias: number): string {
  return Math.abs(dias) === 1 ? 'dia útil' : 'dias úteis'
}

// Espelha a semântica do motor de prazos central (dias úteis, não dias
// corridos — CLAUDE.md, "Prazos de incidente"). O componente só formata;
// o cálculo em si vem da API.
export function tomPorPrazo(diasUteisRestantes: number): StatusTom {
  if (diasUteisRestantes <= 0) return 'critico'
  if (diasUteisRestantes <= 3) return 'atencao'
  return 'ok'
}

export function formatarPrazo(diasUteisRestantes: number): string {
  const dias = diasUteisRestantes
  if (dias < 0) return `${Math.abs(dias)} ${pluralDias(dias)} em atraso`
  if (dias === 0) return 'Vence hoje'
  return `${dias} ${pluralDias(dias)} restante${dias === 1 ? '' : 's'}`
}
