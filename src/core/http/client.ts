export type ApiError = { statusCode: number; message: string; code: string };

type RequestOptions<TBody> = {
  path: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: TBody;
  query?: Record<string, string | number | undefined>;
};

function getCsrfToken() {
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('csrf_token='))
    ?.split('=')[1];
}

export async function apiRequest<TResponse, TBody = undefined>({
  path,
  method = 'GET',
  body,
  query,
}: RequestOptions<TBody>): Promise<TResponse> {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl) throw new Error('VITE_API_URL não está configurada');

  const url = new URL(`${baseUrl}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });
  const unsafe = method !== 'GET';
  const csrfToken = getCsrfToken();
  const response = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(unsafe && csrfToken ? { 'x-csrf-token': csrfToken } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload: unknown = response.headers
    .get('content-type')
    ?.includes('application/json')
    ? await response.json()
    : null;
  if (!response.ok) {
    const error = payload as Partial<ApiError> | null;
    throw {
      statusCode: response.status,
      message: error?.message ?? 'Não foi possível concluir a solicitação.',
      code: error?.code ?? 'INTERNAL_SERVER_ERROR',
    } satisfies ApiError;
  }
  return payload as TResponse;
}
