import { apiRequest } from '@core/http/client';

export type NewsStatus = 'DRAFT' | 'PUBLISHED';
export type News = {
	id: string;
	title: string;
	slug: string;
	summary: string;
	content: string;
	tags: string[];
	coverImageKey: string | null;
	coverImageAlt: string | null;
	status: NewsStatus;
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
};
export type NewsCard = Omit<News, 'content' | 'status'>;
export type NewsPage<TNews> = {
	news: TNews[];
	hasMore: boolean;
	nextCursor?: string;
};
export type NewsInput = {
	title: string;
	summary: string;
	content: string;
	tags: string[];
	coverImageKey: string | null;
	coverImageAlt: string | null;
};
export type CreateNewsInput = NewsInput & { status: NewsStatus };
export type NewsCoverUpload = {
	key: string;
	uploadUrl: string;
	fileUrl: string;
	fields: Record<string, string>;
};

export function getNewsCoverUrl(key: string | null | undefined) {
	if (!key) return undefined;
	const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL;
	return baseUrl ? `${baseUrl.replace(/\/$/, '')}/${key}` : undefined;
}

export const newsApi = {
	listPublic: () => apiRequest<NewsPage<NewsCard>>({ path: '/news/' }),
	getPublic: (slug: string) =>
		apiRequest<Omit<News, 'status'>>({ path: `/news/${slug}` }),
	listAdmin: (filters?: { status?: NewsStatus; search?: string }) =>
		apiRequest<NewsPage<News>>({
			path: '/admin/news/',
			query: filters,
		}),
	getAdmin: (id: string) => apiRequest<News>({ path: `/admin/news/${id}` }),
	create: (input: CreateNewsInput) =>
		apiRequest<News, CreateNewsInput>({
			path: '/admin/news/',
			method: 'POST',
			body: input,
		}),
	update: (id: string, input: Partial<NewsInput>) =>
		apiRequest<News, Partial<NewsInput>>({
			path: `/admin/news/${id}`,
			method: 'PATCH',
			body: input,
		}),
	publish: (id: string) =>
		apiRequest<News>({ path: `/admin/news/${id}/publish`, method: 'POST' }),
	unpublish: (id: string) =>
		apiRequest<News>({ path: `/admin/news/${id}/unpublish`, method: 'POST' }),
	remove: (id: string) =>
		apiRequest<News>({ path: `/admin/news/${id}`, method: 'DELETE' }),
	uploadCover: async (file: File) => {
		const upload = await apiRequest<
			NewsCoverUpload,
			{
				fileName: string;
				contentType: string;
				contentLength: number;
			}
		>({
			path: '/admin/files/upload-url',
			method: 'POST',
			body: {
				fileName: file.name,
				contentType: file.type,
				contentLength: file.size,
			},
		});
		const response = await fetch(upload.uploadUrl, {
			method: 'PUT',
			headers: { 'Content-Type': file.type },
			body: file,
		});
		if (!response.ok) throw new Error('Não foi possível enviar a capa.');
		return upload;
	},
};
