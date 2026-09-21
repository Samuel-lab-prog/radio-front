import { Link } from 'react-router-dom';
import type { NewsCard } from '@core/api/news';

export function NewsCards({ news }: { news: NewsCard[] }) {
  if (!news.length)
    return <p className="muted">Ainda não há notícias publicadas.</p>;
  return (
    <div className="grid">
      {news.map((item) => (
        <Link className="card" key={item.id} to={`/news/${item.slug}`}>
          <span className="tag">NOTÍCIAS</span>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
        </Link>
      ))}
    </div>
  );
}
