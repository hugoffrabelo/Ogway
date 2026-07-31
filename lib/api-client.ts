import { API_URL } from './api-url'

// Cliente tipado único (docs/frontend-cockpit-portal.md §6) — nenhuma
// tela deve chamar fetch solto. 401/403 são erros de negócio, não bugs:
// tipos distintos pra cada um, tratados de formas diferentes pela UI.

export class ApiAuthError extends Error {}
export class ApiPermissionError extends Error {}
// 400 do DRF: {"campo": ["msg", ...], "non_field_errors": [...]}
export class ApiValidationError extends Error {
  fields: Record<string, string[]>
  constructor(fields: Record<string, string[]>) {
    super('Erro de validação.')
    this.fields = fields
  }
}
export class ApiError extends Error {}

async function getCsrfToken(): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/csrf/`, { credentials: 'include' })
  if (!res.ok) throw new ApiError('Não foi possível preparar a requisição (CSRF).')
  const data = (await res.json()) as { csrfToken: string }
  return data.csrfToken
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  try {
    return await res.json()
  } catch {
    return undefined
  }
}

function normalizeValidationFields(body: unknown): Record<string, string[]> {
  const fields: Record<string, string[]> = {}
  if (body && typeof body === 'object') {
    for (const [chave, valor] of Object.entries(body as Record<string, unknown>)) {
      fields[chave] = Array.isArray(valor) ? valor.map(String) : [String(valor)]
    }
  }
  return fields
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  }

  const body = await parseJsonSafe(res)
  const detail =
    body && typeof body === 'object' && 'detail' in body
      ? String((body as { detail: unknown }).detail)
      : undefined

  if (res.status === 401) {
    throw new ApiAuthError(detail || 'Sessão expirada. Entre novamente.')
  }
  if (res.status === 403) {
    throw new ApiPermissionError(detail || 'Você não tem permissão para fazer isso.')
  }
  if (res.status === 400 && body && !detail) {
    throw new ApiValidationError(normalizeValidationFields(body))
  }
  throw new ApiError(detail || 'A requisição falhou.')
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { credentials: 'include' })
  return handleResponse<T>(res)
}

async function apiMutate<T>(
  method: 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown
): Promise<T> {
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
  return handleResponse<T>(res)
}

export const apiPost = <T,>(path: string, body?: unknown) => apiMutate<T>('POST', path, body)
export const apiPatch = <T,>(path: string, body?: unknown) => apiMutate<T>('PATCH', path, body)
export const apiDelete = <T,>(path: string) => apiMutate<T>('DELETE', path)

// `org` opcional em toda chamada tenant-scoped: ausente = auto-escopado
// (cliente_leitor), presente = cross-cliente (cockpit escolhendo a org).
export function comOrg(path: string, org?: number): string {
  return org ? `${path}?org=${org}` : path
}
