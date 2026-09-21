import { AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@core/api/auth';
import { PageMetadata } from '@core/components/PageMetadata';
import { useAuthStore } from '@core/session/auth-store';

export function AdminLoginPage() {
	const navigate = useNavigate();
	const setClient = useAuthStore((state) => state.setClient);
	const [loginState, setLoginState] = useState<
		'idle' | 'submitting' | 'success' | 'error'
	>('idle');
	const [message, setMessage] = useState<string>();

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (loginState === 'submitting') return;
		setLoginState('submitting');
		setMessage(undefined);
		const fields = new FormData(event.currentTarget);
		try {
			const client = await authApi.login(
				String(fields.get('cpf')),
				String(fields.get('password')),
			);
			setClient(client);
			setLoginState('success');
			setMessage('Login realizado. Redirecionando...');
			navigate('/admin/news');
		} catch (error) {
			setLoginState('error');
			setMessage(
				typeof error === 'object' &&
					error !== null &&
					'statusCode' in error &&
					error.statusCode === 401
					? 'CPF ou senha inválidos.'
					: 'Não foi possível conectar ao servidor. Tente novamente.',
			);
		}
	}
	return (
		<>
			<PageMetadata
				noIndex
				title='Área administrativa'
			/>
			<main className='mx-auto flex min-h-[calc(100vh-170px)] w-[calc(100%-2rem)] max-w-[720px] items-center px-0 py-8 pb-32 sm:py-16'>
				<section className='w-full rounded-2xl border border-[#e1e7ef] bg-white p-5 shadow-[0_10px_25px_rgb(16_33_59_/_4%)] sm:p-8'>
					<span className='text-xs font-black tracking-[0.18em] text-[#f4b832]'>
						GAIVOTA FM
					</span>
					<h1 className='mb-4 mt-3 text-[clamp(2.6rem,5vw,4rem)] font-black leading-none tracking-[-0.06em] text-[#10213b]'>
						Área administrativa
					</h1>
					<p className='max-w-[50ch] text-[1.08rem] leading-[1.65] text-[#617a9d]'>
						Entre com o CPF e a senha do administrador.
					</p>
					{message ? (
						<p
							aria-live='polite'
							className={`flex items-start gap-2 rounded-xl px-4 py-3 ${
								loginState === 'success'
									? 'bg-[#e5f6ef] text-[#176b48]'
									: 'bg-[#fdeaea] text-[#8e3434]'
							}`}
						>
							{loginState === 'success' ? (
								<CheckCircle2
									className='mt-0.5 shrink-0'
									size={18}
								/>
							) : (
								<AlertCircle
									className='mt-0.5 shrink-0'
									size={18}
								/>
							)}
							<span>{message}</span>
						</p>
					) : null}
					<form
						className='grid gap-4'
						onSubmit={submit}
					>
						<label className='grid gap-1.5 font-bold text-[#223a59]'>
							CPF ou e-mail
							<input
								className='w-full rounded-[10px] border border-[#cfd9e6] bg-[#fbfcfe] px-3 py-3 text-[#10213b] outline-none focus:border-[#f0645d] focus:ring-4 focus:ring-[#f0645d]/15'
								name='cpf'
								placeholder='000.000.001-91 ou seu e-mail'
								required
								autoComplete='username'
							/>
						</label>
						<label className='grid gap-1.5 font-bold text-[#223a59]'>
							Senha
							<input
								className='w-full rounded-[10px] border border-[#cfd9e6] bg-[#fbfcfe] px-3 py-3 text-[#10213b] outline-none focus:border-[#f0645d] focus:ring-4 focus:ring-[#f0645d]/15'
								name='password'
								required
								autoComplete='current-password'
								type='password'
							/>
						</label>
						<button
							aria-busy={loginState === 'submitting'}
							className='inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-0 bg-[#f0645d] px-[1.15rem] py-3.5 font-extrabold text-white shadow-[0_10px_20px_rgb(240_100_93_/_18%)] transition-transform hover:-translate-y-0.5 active:scale-[.98] disabled:cursor-wait disabled:opacity-75'
							disabled={loginState === 'submitting' || loginState === 'success'}
							type='submit'
						>
							{loginState === 'submitting' ? (
								<>
									<LoaderCircle
										className='animate-spin'
										size={18}
									/>
									Entrando...
								</>
							) : loginState === 'success' ? (
								<>
									<CheckCircle2 size={18} />
									Acesso confirmado
								</>
							) : (
								'Entrar'
							)}
						</button>
					</form>
				</section>
			</main>
		</>
	);
}
