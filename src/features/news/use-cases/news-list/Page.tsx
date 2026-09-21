import { useQuery } from '@tanstack/react-query';
import { newsApi } from '@core/api/news';
import { PageMetadata } from '@core/components/PageMetadata';
import { NewsCards } from '../../internal/components/NewsCards';

export function NewsListPage() {
	const query = useQuery({
		queryKey: ['news', 'public'],
		queryFn: newsApi.listPublic,
	});
	return (
		<>
			<PageMetadata
				description='As principais notícias, pessoas e acontecimentos de Tramandaí e do litoral norte, pela Gaivota FM.'
				title='Notícias'
			/>
			<main className='mx-auto min-h-[calc(100vh-74px)] w-[calc(100%-2rem)] max-w-[1120px] pb-24 pt-16'>
				<span className='text-xs font-black tracking-[0.18em] text-[#f0645d]'>
					JORNAL GAIVOTA
				</span>
				<h1 className='mb-7 mt-3 text-[clamp(3rem,5vw,4.5rem)] font-black leading-none tracking-[-0.06em] text-[#10213b]'>
					Notícias
				</h1>
				<p className='mb-1 max-w-none text-[1.15rem] leading-[1.65] text-[#617a9d]'>
					As histórias, pessoas e acontecimentos que movimentam nossa cidade.
				</p>
				{query.isPending ? (
					<p className='text-[#617a9d]'>Carregando notícias…</p>
				) : null}
				{query.isError ? (
					<p className='rounded-xl bg-[#fdeaea] px-4 py-3 text-[#8e3434]'>
						Não foi possível carregar as notícias.
					</p>
				) : null}
				{query.data ? <NewsCards news={query.data.news} /> : null}
			</main>
		</>
	);
}
