import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { newsApi } from '@core/api/news';
import { PageMetadata } from '@core/components/PageMetadata';
import { MarkdownContent } from '../../internal/components/MarkdownContent';

export function NewsDetailsPage() {
	const slug = useParams().slug ?? '';
	const query = useQuery({
		queryKey: ['news', slug],
		queryFn: () => newsApi.getPublic(slug),
		enabled: Boolean(slug),
	});
	if (query.isPending)
		return (
			<>
				<PageMetadata title='Carregando notícia' />
				<main className='mx-auto w-[calc(100%-2rem)] max-w-[1120px] pb-24 pt-16'>
					<p className='text-[#617a9d]'>Carregando…</p>
				</main>
			</>
		);
	if (query.isError || !query.data)
		return (
			<>
				<PageMetadata
					description='A notícia solicitada não foi encontrada.'
					title='Notícia não encontrada'
				/>
				<main className='mx-auto w-[calc(100%-2rem)] max-w-[1120px] pb-24 pt-16'>
					<p className='rounded-xl bg-[#fdeaea] px-4 py-3 text-[#8e3434]'>
						Notícia não encontrada.
					</p>
					<p>
						<Link to='/news'>Voltar para notícias</Link>
					</p>
				</main>
			</>
		);
	const news = query.data;
	return (
		<>
			<PageMetadata
				description={news.summary}
				title={news.title}
			/>
			<main className='mx-auto w-[calc(100%-2rem)] max-w-[980px] pb-32 pt-20 sm:pt-24'>
				<Link
					className='text-xs font-black tracking-[0.08em] text-[#f0645d]'
					to='/news'
				>
					← NOTÍCIAS
				</Link>
				<h1 className='mb-7 mt-6 max-w-[22ch] text-[clamp(2.35rem,4.5vw,4rem)] font-black leading-[0.98] tracking-[-0.06em] text-[#10213b]'>
					{news.title}
				</h1>
				<p className='max-w-[58ch] text-[1.12rem] leading-[1.75] text-[#617a9d]'>
					{news.summary}
				</p>
				{(news.tags ?? []).length ? (
					<div className='my-7 flex flex-wrap gap-2'>
						{(news.tags ?? []).map((tag) => (
							<span
								className='rounded-full bg-[#eaf0f6] px-3 py-1 text-xs font-bold text-[#45617f]'
								key={tag}
							>
								#{tag}
							</span>
						))}
					</div>
				) : null}
				{news.publishedAt ? (
					<p className='mt-8 text-xs font-black tracking-[0.08em] text-[#f0645d]'>
						PUBLICADA EM{' '}
						{new Intl.DateTimeFormat('pt-BR', {
							dateStyle: 'short',
							timeStyle: 'short',
						}).format(new Date(news.publishedAt))}
					</p>
				) : null}
				<MarkdownContent
					className='article-content'
					content={news.content}
				/>
				<Link
					className='mt-12 inline-flex items-center gap-2 rounded-[10px] border border-[#cbd8e6] px-4 py-3 text-sm font-extrabold text-[#10213b] transition-colors hover:border-[#f0645d] hover:text-[#f0645d]'
					to='/news'
				>
					<span aria-hidden='true'>←</span> Voltar para notícias
				</Link>
			</main>
		</>
	);
}
