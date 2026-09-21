import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type AuthClient } from '@core/session/auth-store';

export function RequireRole({ role }: { role: AuthClient['role'] }) {
  const client = useAuthStore((state) => state.client);
  const status = useAuthStore((state) => state.status);

  if (status === 'unknown' || status === 'loading')
    return <p className="muted">Carregando sessão…</p>;
  if (!client) return <Navigate replace to="/admin/login" />;
  if (client.role !== role) return <Navigate replace to="/" />;

  return <Outlet />;
}
