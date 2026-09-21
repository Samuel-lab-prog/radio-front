import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@core/api/auth';
import { useAuthStore } from '@core/session/auth-store';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const setClient = useAuthStore((state) => state.setClient);
  const [error, setError] = useState<string>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    const fields = new FormData(event.currentTarget);
    try {
      const client = await authApi.login(
        String(fields.get('cpf')),
        String(fields.get('password')),
      );
      setClient(client);
      navigate('/admin/news');
    } catch {
      setError('CPF ou senha inválidos.');
    }
  }
  return (
    <main className="admin">
      <section className="panel">
        <span className="eyebrow">AURORA FM</span>
        <h1>Área administrativa</h1>
        <p className="muted">Entre com o CPF e a senha do administrador.</p>
        {error ? <p className="notice error">{error}</p> : null}
        <form className="form" onSubmit={submit}>
          <label>
            CPF
            <input name="cpf" required />
          </label>
          <label>
            Senha
            <input name="password" type="password" required />
          </label>
          <button className="primary" type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
