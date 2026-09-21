import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { newsApi } from '@core/api/news';
import { NewsCards } from '@features/news/public';

export function HomePage() {
  const query = useQuery({
    queryKey: ['news', 'public'],
    queryFn: newsApi.listPublic,
  });
  return (
    <main>
      <section className="shell hero">
        <div>
          <span className="eyebrow">SINTONIZE SUA CIDADE</span>
          <h1>A trilha sonora do seu agora.</h1>
          <p>
            Informação, música e cultura em uma rádio feita para acompanhar cada
            momento do seu dia.
          </p>
          <Link className="primary" to="/news">
            Ver notícias
          </Link>
        </div>
        <aside className="player">
          <span className="tag">NO AR AGORA</span>
          <strong>
            Aurora FM
            <br />
            Sua frequência de sempre.
          </strong>
          <button type="button">
            <Play size={16} fill="currentColor" /> Ouvir ao vivo
          </button>
        </aside>
      </section>
      <section className="shell section">
        <div className="section-head">
          <h2>O que acontece por aqui</h2>
          <Link className="tag" to="/news">
            VER TODAS →
          </Link>
        </div>
        {query.isPending ? <p className="muted">Carregando notícias…</p> : null}
        {query.data ? <NewsCards news={query.data.news.slice(0, 3)} /> : null}
      </section>
    </main>
  );
}
