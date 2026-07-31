import { apiDelete, apiGet, apiPatch, apiPost, comOrg } from '@/lib/api-client'
import type {
  AtividadeTratamento,
  BaseLegal,
  CategoriaDado,
  CategoriaTitular,
  Operador,
} from './types'

// Taxonomias compartilhadas — não são por tenant, sem ?org=.
export const fetchBasesLegais = () => apiGet<BaseLegal[]>('/api/ropa/bases-legais/')
export const fetchCategoriasDados = () => apiGet<CategoriaDado[]>('/api/ropa/categorias-dados/')
export const fetchCategoriasTitulares = () =>
  apiGet<CategoriaTitular[]>('/api/ropa/categorias-titulares/')

// Operador e AtividadeTratamento são tenant-scoped — `org` obrigatório
// no cockpit (cross-cliente).
export const fetchOperadores = (org: number) =>
  apiGet<Operador[]>(comOrg('/api/ropa/operadores/', org))

export type OperadorInput = Omit<Operador, 'id'>

export const criarOperador = (org: number, dados: OperadorInput) =>
  apiPost<Operador>(comOrg('/api/ropa/operadores/', org), dados)

export const atualizarOperador = (id: number, org: number, dados: Partial<OperadorInput>) =>
  apiPatch<Operador>(comOrg(`/api/ropa/operadores/${id}/`, org), dados)

export const excluirOperador = (id: number, org: number) =>
  apiDelete<void>(comOrg(`/api/ropa/operadores/${id}/`, org))

export const fetchAtividades = (org: number) =>
  apiGet<AtividadeTratamento[]>(comOrg('/api/ropa/atividades/', org))

export type AtividadeTratamentoInput = Omit<AtividadeTratamento, 'id'>

export const criarAtividade = (org: number, dados: AtividadeTratamentoInput) =>
  apiPost<AtividadeTratamento>(comOrg('/api/ropa/atividades/', org), dados)

export const atualizarAtividade = (
  id: number,
  org: number,
  dados: Partial<AtividadeTratamentoInput>
) => apiPatch<AtividadeTratamento>(comOrg(`/api/ropa/atividades/${id}/`, org), dados)

export const excluirAtividade = (id: number, org: number) =>
  apiDelete<void>(comOrg(`/api/ropa/atividades/${id}/`, org))
