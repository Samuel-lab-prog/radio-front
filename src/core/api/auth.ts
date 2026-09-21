import { apiRequest } from '@core/http/client';
import type { AuthClient } from '@core/session/auth-store';

export const authApi = {
	login: (cpf: string, password: string) =>
		apiRequest<AuthClient, { cpf: string; password: string }>({
			path: '/auth/login',
			method: 'POST',
			body: { cpf, password },
		}),
	me: () => apiRequest<AuthClient>({ path: '/auth/me' }),
	logout: () =>
		apiRequest<{ message: string }>({ path: '/auth/logout', method: 'POST' }),
};
