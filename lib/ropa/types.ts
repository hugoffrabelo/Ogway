export type NivelRisco = 'baixo' | 'medio' | 'alto'

// Taxonomias compartilhadas (não são por tenant) — só leitura no front.
export interface BaseLegal {
  id: number
  tipo: string
  artigo: string
  descricao: string
}

export interface CategoriaDado {
  id: number
  nome: string
  sensivel: boolean
}

export interface CategoriaTitular {
  id: number
  nome: string
}

// Espelha apps/ropa/serializers.py OperadorSerializer.
export interface Operador {
  id: number
  nome: string
  servico: string
  dpa_assinado: boolean
  dpa_vencimento: string | null
  pais: string
  nivel_risco: NivelRisco
}

// Espelha apps/ropa/serializers.py AtividadeTratamentoSerializer.
export interface AtividadeTratamento {
  id: number
  nome: string
  finalidade: string
  base_legal: number
  categorias_dados: number[]
  categorias_titulares: number[]
  retencao: string
  nivel_risco: NivelRisco
  operadores: number[]
  transferencia_internacional: boolean
  ativo: boolean
}
