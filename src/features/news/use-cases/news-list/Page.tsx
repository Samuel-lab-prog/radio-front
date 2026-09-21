import { useQuery } from '@tanstack/react-query';
import { newsApi } from '@core/api/news';
import { NewsCards } from '../../internal/components/NewsCards';

export function NewsListPage() {
  const query = useQuery({
    queryKey: ['news', 'public'],
    queryFn: newsApi.listPublic,
  });
  return (
    <main className="shell page">
      <span className="eyebrow">ATUALIZAÇÕES</span>
      <h1>Notícias da Aurora</h1>
      {query.isPending ? <p className="muted">Carregando notícias…</p> : null}
      {query.isError ? (
        <p className="notice error">Não foi possível carregar as notícias.</p>
      ) : null}
      {query.data ? <NewsCards news={query.data.news} /> : null}
    </main>
  );
}
