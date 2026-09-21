import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Headphones, Music2 } from 'lucide-react';
import { newsApi } from '@core/api/news';
import { PageMetadata } from '@core/components/PageMetadata';
import { useRadioPlayer } from '@core/hooks/radio-player';
import { NewsCards } from '@features/news/public';

export function HomePage() {
  const { hasError, isLoading, isPlaying, play } = useRadioPlayer();
  const query = useQuery({
    queryKey: ['news', 'public'],
    queryFn: newsApi.listPublic,
  });
  return (
    <>
      <PageMetadata
        description="Música, informação e histórias que conectam Tramandaí ao litoral norte. Ouça a Gaivota FM 98.1 ao vivo."
        title="Rádio ao vivo"
      />
      <main>
        <section className="mx-auto grid w-[calc(100%-2rem)] max-w-[1120px] grid-cols-1 items-center gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:py-20">
          <div>
            <span className="text-xs font-black tracking-[0.18em] text-[#f4b832]">
              SINTONIZE O SEU DIA
            </span>
            <h1 className="mb-6 mt-3 text-[clamp(3.8rem,7vw,6.4rem)] font-black leading-[0.94] tracking-[-0.075em] text-[#10213b]">
              Som que
              <br />
              <span className="text-[#f0645d]">faz sentido.</span>
            </h1>
            <p className="max-w-[50ch] text-[1.08rem] leading-[1.65] text-[#617a9d]">
              Informação, música e histórias que conectam você ao que realmente
              importa.
            </p>
            <button
              aria-label={
                isPlaying
                  ? 'Transmissão em reprodução'
                  : 'Reproduzir transmissão'
              }
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-[#f0645d] px-[1.15rem] py-3.5 font-extrabold text-white shadow-[0_10px_20px_rgb(240_100_93_/_18%)] transition-transform active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              onClick={() => void play()}
              type="button"
            >
              <Headphones size={17} />
              {hasError
                ? 'Tentar novamente'
                : isLoading
                  ? 'Conectando…'
                  : isPlaying
                    ? 'Ouvindo agora'
                    : 'Ouça agora'}
            </button>
          </div>
          <aside
            aria-label="Gaivota FM ao vivo"
            className="relative min-h-[300px] overflow-hidden rounded-[2rem] bg-[#132d4b] text-[#f7f9fc] lg:min-h-[350px]"
          >
            <div className="absolute -right-5 -top-[90px] size-[290px] rounded-full bg-[#e4ad3d]" />
            <div className="absolute -bottom-[90px] -left-[55px] size-[265px] rounded-full bg-[#f0645d]" />
            <Music2
              className="absolute left-[48%] top-1/3 -rotate-[14deg] text-[#f4f5f7]"
              size={104}
              strokeWidth={1.7}
            />
            <div className="absolute bottom-6 left-6 grid min-w-[130px] gap-1.5 rounded-[14px] bg-white px-4 py-3 text-[#10213b] shadow-[0_8px_18px_rgb(7_17_32_/_12%)]">
              <span className="inline-flex items-center gap-2 text-[0.6rem] font-black tracking-[0.12em] text-[#f0645d]">
                <span className="inline-block size-2 rounded-full bg-[#f0645d] shadow-[0_0_0_5px_rgb(240_100_93_/_16%)]" />{' '}
                NO AR AGORA
              </span>
              <strong className="text-base">Gaivota FM</strong>
            </div>
          </aside>
        </section>
        <section className="mx-auto w-[calc(100%-2rem)] max-w-[1120px] pb-20 pt-6">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black tracking-[0.18em] text-[#f0645d]">
                FIQUE POR DENTRO
              </span>
              <h2 className="mb-0 mt-2 text-[clamp(2rem,3vw,2.7rem)] font-black leading-none tracking-[-0.05em] text-[#10213b]">
                Últimas notícias
              </h2>
            </div>
            <Link className="font-extrabold text-[#f0645d]" to="/news">
              Ver tudo →
            </Link>
          </div>
          {query.isPending ? (
            <p className="text-[#617a9d]">Carregando notícias…</p>
          ) : null}
          {query.data ? <NewsCards news={query.data.news.slice(0, 3)} /> : null}
        </section>
      </main>
    </>
  );
}
