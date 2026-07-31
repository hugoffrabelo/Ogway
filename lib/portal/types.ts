// Espelha apps/portal/services.py dashboard().
export interface DashboardData {
  nota_lgpd: {
    basico: number | null
    intermediario: number | null
    avancado: number | null
  }
  incidentes_abertos: number
  solicitacoes_pendentes: number
  riscos_pendentes_decisao: number
  operadores_dpa_vencendo: number
  tasks_atrasadas: number
}

export type Probabilidade = 'baixa' | 'media' | 'alta'
export type Impacto = 'baixo' | 'medio' | 'alto'
export type NivelRisco = 'baixo' | 'medio' | 'alto' | 'critico'

// Espelha apps/riscos/serializers.py RiscoSerializer.
export interface Risco {
  id: number
  titulo: string
  descricao: string
  atividade: number | null
  probabilidade: Probabilidade
  impacto: Impacto
  nivel: NivelRisco
  status: 'identificado' | 'em_tratamento' | 'mitigado' | 'aceito'
  responsavel: number | null
  accountable: string
  consultados: string
  informados: string
  pendente_decisao_cliente: boolean
  criado_em: string
  atualizado_em: string
}

// Espelha apps/documentos/serializers.py DocumentoSerializer. O portal só
// recebe estado='publicado' (filtrado no backend, não só na UI).
export interface Documento {
  id: number
  titulo: string
  tipo: string
  versao: string
  estado: 'rascunho' | 'revisao' | 'aprovado' | 'publicado'
  aprovado_por: number | null
  aprovado_em: string | null
  proxima_revisao: string | null
  arquivo: string | null
  criado_em: string
  atualizado_em: string
}

// Espelha apps/linhagem/services.py mapa() — grafo pronto pra layout via
// dagre/elk. Chave do nó é "Tipo:id" (ex.: "FonteColeta:3").
export interface MapaLinhagem {
  nos: Record<
    string,
    {
      tipo: 'FonteColeta' | 'Repositorio' | 'Operador'
      nome: string
      // Só presente pra nós Operador (a API omite a chave pros demais
      // tipos, não manda null).
      sem_dpa?: boolean | null
    }
  >
  arestas: {
    origem: string
    destino: string
    sensivel: boolean
    internacional: boolean
  }[]
}

// Espelha apps/processos/serializers.py DiagramaProcessoSerializer.
export interface DiagramaProcesso {
  id: number
  atividade: number
  titulo: string
  xml_bpmn: string
  versao: string
  validado_em: string | null
  inconsistencias: string[]
  valido: boolean
  criado_em: string
  atualizado_em: string
}
