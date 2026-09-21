import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { getNewsCoverUrl, type NewsCard } from '@core/api/news';

export function NewsCards({ news }: { news: NewsCard[] }) {
	if (!news.length)
		return <p className='text-[#617a9d]'>Ainda não há notícias publicadas.</p>;
	return (
		<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
			{news.map((item) => (
				<Link
					className='group block overflow-hidden rounded-2xl border border-[#e1e7ef] bg-white shadow-[0_10px_25px_rgb(16_33_59_/_4%)] transition hover:-translate-y-1 hover:shadow-[0_18px_32px_rgb(16_33_59_/_10%)]'
					key={item.id}
					to={`/news/${item.slug}`}
				>
					<div className='relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#173b5d] to-[#f0b637] text-[#fff8e7]'>
						{getNewsCoverUrl(item.coverImageKey) ? (
							<img
								alt={item.coverImageAlt || ''}
								className='absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]'
								src={getNewsCoverUrl(item.coverImageKey)}
							/>
						) : (
							<div className='absolute inset-0 grid place-items-center'>
								<Newspaper
									aria-hidden='true'
									size={38}
									strokeWidth={1.6}
								/>
							</div>
						)}
					</div>
					<div className='px-5 pb-5 pt-4'>
						<time
							className='text-xs text-[#7890ae]'
							dateTime={item.publishedAt ?? item.createdAt}
						>
							{new Intl.DateTimeFormat('pt-BR', {
								dateStyle: 'short',
								timeStyle: 'short',
							}).format(new Date(item.publishedAt ?? item.createdAt))}
						</time>
						<h3 className='mb-2 mt-3 text-[1.16rem] font-extrabold leading-tight text-[#10213b]'>
							{item.title}
						</h3>
						<p className='mb-0 leading-[1.45] text-[#617a9d]'>{item.summary}</p>
						{(item.tags ?? []).length ? (
							<div className='mt-3 flex flex-wrap gap-1.5'>
								{(item.tags ?? []).map((tag) => (
									<span
										className='rounded-full bg-[#eaf0f6] px-2.5 py-1 text-xs font-bold text-[#45617f]'
										key={tag}
									>
										#{tag}
									</span>
								))}
							</div>
						) : null}
					</div>
				</Link>
			))}
		</div>
	);
}
