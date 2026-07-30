import { API_URL } from './api-url'

// Mesmo padrão de lib/auth/api.ts: busca um X-CSRFToken fresco antes de
// cada requisição que muda estado, em vez de fazer parsing de cookie no
// cliente.
async function getCsrfToken(): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/csrf/`, { credentials: 'include' })
  if (!res.ok) throw new Error('Não foi possível preparar a requisição (CSRF).')
  const data = (await res.json()) as { csrfToken: string }
  return data.csrfToken
}

async function apiMutate<T>(method: 'POST' | 'PATCH', path: string, body?: unknown): Promise<T> {
  const csrfToken = await getCsrfToken()
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let detail: string | undefined
    try {
      const data = (await res.json()) as { detail?: string }
      detail = data.detail
    } catch {
      // corpo não é JSON — segue com a mensagem genérica
    }
    throw new Error(detail || 'A requisição falhou.')
  }
  return res.json() as Promise<T>
}

// Mutações autenticadas, com sessão + CSRF — pra qualquer chamada que
// muda estado no backend (ex.: transições da máquina de estados de
// incidente, ou PATCH de status/resposta de solicitação).
export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiMutate<T>('POST', path, body)
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return apiMutate<T>('PATCH', path, body)
}
