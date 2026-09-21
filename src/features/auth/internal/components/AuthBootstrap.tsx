import { useEffect, type ReactNode } from 'react';
import { authApi } from '@core/api/auth';
import { useAuthStore } from '@core/session/auth-store';

export function AuthBootstrap({ children }: { children: ReactNode }) {
	const setClient = useAuthStore((state) => state.setClient);
	const setStatus = useAuthStore((state) => state.setStatus);
	const status = useAuthStore((state) => state.status);

	useEffect(() => {
		if (status !== 'unknown') return;

		setStatus('loading');
		void authApi
			.me()
			.then(setClient)
			.catch(() => setClient(null));
	}, [setClient, setStatus, status]);

	return children;
}
