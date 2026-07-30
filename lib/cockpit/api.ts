import { API_URL } from '@/lib/api-url'
import type { ItemFila } from './types'

export async function fetchFilaHoje(): Promise<ItemFila[]> {
  const res = await fetch(`${API_URL}/api/cockpit/fila-hoje/`, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Não foi possível carregar a fila.')
  }
  return res.json()
}
