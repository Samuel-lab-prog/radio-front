import { apiRequest } from '@core/http/client';

export type NewsStatus = 'DRAFT' | 'PUBLISHED';
export type News = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
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
};
export type CreateNewsInput = NewsInput & { status: NewsStatus };

export const newsApi = {
  listPublic: () => apiRequest<NewsPage<NewsCard>>({ path: '/news' }),
  getPublic: (slug: string) =>
    apiRequest<Omit<News, 'status'>>({ path: `/news/${slug}` }),
  listAdmin: (filters?: { status?: NewsStatus; search?: string }) =>
    apiRequest<NewsPage<News>>({
      path: '/admin/news',
      query: filters,
    }),
  getAdmin: (id: string) => apiRequest<News>({ path: `/admin/news/${id}` }),
  create: (input: CreateNewsInput) =>
    apiRequest<News, CreateNewsInput>({
      path: '/admin/news',
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
};
