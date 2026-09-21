import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { newsApi } from '@core/api/news';
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
      <main className="shell page">
        <p className="muted">Carregando…</p>
      </main>
    );
  if (query.isError || !query.data)
    return (
      <main className="shell page">
        <p className="notice error">Notícia não encontrada.</p>
        <p>
          <Link to="/news">Voltar para notícias</Link>
        </p>
      </main>
    );
  const news = query.data;
  return (
    <main className="shell page article">
      <Link className="tag" to="/news">
        ← NOTÍCIAS
      </Link>
      <h1>{news.title}</h1>
      <p className="muted">{news.summary}</p>
      {news.publishedAt ? (
        <p className="tag">
          PUBLICADA EM {new Date(news.publishedAt).toLocaleDateString('pt-BR')}
        </p>
      ) : null}
      <MarkdownContent className="article-content" content={news.content} />
    </main>
  );
}
