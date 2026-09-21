import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@core/api/auth';
import { PageMetadata } from '@core/components/PageMetadata';
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
    <>
      <PageMetadata noIndex title="Área administrativa" />
      <main className="mx-auto flex min-h-[calc(100vh-170px)] w-[calc(100%-2rem)] max-w-[720px] items-center py-12 pb-32 sm:py-16">
        <section className="w-full rounded-2xl border border-[#e1e7ef] bg-white p-6 shadow-[0_10px_25px_rgb(16_33_59_/_4%)] sm:p-8">
          <span className="text-xs font-black tracking-[0.18em] text-[#f4b832]">
            GAIVOTA FM
          </span>
          <h1 className="mb-4 mt-3 text-[clamp(2.6rem,5vw,4rem)] font-black leading-none tracking-[-0.06em] text-[#10213b]">
            Área administrativa
          </h1>
          <p className="max-w-[50ch] text-[1.08rem] leading-[1.65] text-[#617a9d]">
            Entre com o CPF e a senha do administrador.
          </p>
          {error ? (
            <p className="rounded-xl bg-[#fdeaea] px-4 py-3 text-[#8e3434]">
              {error}
            </p>
          ) : null}
          <form className="grid gap-4" onSubmit={submit}>
            <label className="grid gap-1.5 font-bold text-[#223a59]">
              CPF ou e-mail
              <input
                className="w-full rounded-[10px] border border-[#cfd9e6] bg-[#fbfcfe] px-3 py-3 text-[#10213b] outline-none focus:border-[#f0645d] focus:ring-4 focus:ring-[#f0645d]/15"
                name="cpf"
                placeholder="000.000.001-91 ou admin@aurorafm.test"
                required
              />
            </label>
            <label className="grid gap-1.5 font-bold text-[#223a59]">
              Senha
              <input
                className="w-full rounded-[10px] border border-[#cfd9e6] bg-[#fbfcfe] px-3 py-3 text-[#10213b] outline-none focus:border-[#f0645d] focus:ring-4 focus:ring-[#f0645d]/15"
                name="password"
                required
                type="password"
              />
            </label>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border-0 bg-[#f0645d] px-[1.15rem] py-3.5 font-extrabold text-white shadow-[0_10px_20px_rgb(240_100_93_/_18%)] active:scale-[.98]"
              type="submit"
            >
              Entrar
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
