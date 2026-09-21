import {
  ArrowRight,
  Headphones,
  HeartHandshake,
  MapPin,
  Mic2,
  Radio,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageMetadata } from '@core/components/PageMetadata';

const values = [
  {
    icon: HeartHandshake,
    title: 'Perto de verdade',
    description:
      'A gente fala com a cidade porque também faz parte dela. Cada história tem rosto, voz e lugar.',
  },
  {
    icon: Sparkles,
    title: 'Conteúdo que vibra',
    description:
      'Música, informação e boas conversas em uma programação feita para acompanhar o seu ritmo.',
  },
  {
    icon: Users,
    title: 'Uma comunidade',
    description:
      'Abrimos espaço para diferentes histórias, ideias e talentos que fazem a nossa região acontecer.',
  },
];

export function AboutPage() {
  return (
    <>
      <PageMetadata
        description="Conheça a Gaivota FM, a rádio local que aproxima Tramandaí de suas histórias, sua música e sua comunidade."
        title="Quem somos"
      />
      <main className="overflow-hidden">
        <section className="relative mx-auto grid w-[calc(100%-2rem)] max-w-[1120px] items-center gap-12 pb-20 pt-16 lg:grid-cols-[0.94fr_1.06fr] lg:gap-20 lg:pb-28 lg:pt-24">
          <div className="relative z-[1]">
            <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] text-[#f0645d]">
              <span className="h-px w-8 bg-[#f0645d]" /> A RÁDIO DA NOSSA CIDADE
            </span>
            <h1 className="mb-7 mt-5 max-w-[10ch] text-[clamp(3.7rem,7vw,6.25rem)] font-black leading-[0.92] tracking-[-0.075em] text-[#10213b]">
              Som que
              <br />
              <span className="text-[#f0645d]">fica perto.</span>
            </h1>
            <p className="max-w-[50ch] text-[1.08rem] leading-[1.75] text-[#617a9d]">
              A Gaivota FM nasceu para ser companhia nos seus dias: uma rádio
              local, viva e feita por pessoas que acreditam no poder de uma boa
              história.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                className="inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-[#f0645d] px-5 py-3.5 font-extrabold text-white shadow-[0_10px_20px_rgb(240_100_93_/_18%)] transition-transform hover:-translate-y-0.5 active:scale-[.98]"
                href="#live"
              >
                <Headphones size={17} /> Ouça agora
              </a>
              <Link
                className="inline-flex min-h-11 items-center gap-2 rounded-[10px] px-4 py-3.5 font-extrabold text-[#10213b] transition-colors hover:text-[#f0645d]"
                to="/news"
              >
                Conheça nossas notícias <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[390px] lg:min-h-[455px]">
            <div className="absolute right-0 top-0 h-[88%] w-[92%] rounded-[2.5rem] bg-[#132d4b] shadow-[0_24px_60px_rgb(16_33_59_/_14%)]" />
            <div className="absolute -right-10 top-[-3.5rem] size-56 rounded-full bg-[#e4ad3d] sm:size-72" />
            <div className="absolute bottom-0 left-0 size-52 rounded-full bg-[#f0645d] sm:size-64" />
            <div className="absolute left-[13%] top-[14%] size-28 rounded-full border border-white/15 sm:size-36" />
            <div className="absolute bottom-[18%] right-[17%] flex items-end gap-1.5 opacity-70">
              {[30, 48, 72, 42, 92, 58, 76, 38, 64].map((height, index) => (
                <span
                  className="w-1.5 rounded-full bg-[#f4b832]"
                  key={index}
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
            <div className="absolute left-[12%] top-[20%] grid size-20 place-items-center rounded-[1.5rem] bg-[#f6f8fc] text-[#10213b] shadow-[0_14px_25px_rgb(7_17_32_/_18%)] sm:size-24">
              <Radio size={42} strokeWidth={1.7} />
            </div>
            <div className="absolute bottom-[13%] left-[12%] max-w-[210px] rounded-2xl bg-white px-5 py-4 text-[#10213b] shadow-[0_14px_25px_rgb(7_17_32_/_18%)] sm:bottom-[14%] sm:left-[18%]">
              <span className="mb-1.5 flex items-center gap-2 text-[0.62rem] font-black tracking-[0.14em] text-[#f0645d]">
                <span className="size-2 rounded-full bg-[#f0645d] shadow-[0_0_0_5px_rgb(240_100_93_/_14%)]" />
                NO AR AGORA
              </span>
              <strong className="block text-lg leading-tight">
                Gaivota FM
              </strong>
              <span className="mt-1 block text-xs text-[#617a9d]">
                Música para o seu momento
              </span>
            </div>
            <div className="absolute right-[3%] top-[42%] flex -rotate-3 items-center gap-2 rounded-full bg-[#f4b832] px-4 py-2 text-xs font-black text-[#10213b] shadow-[0_10px_20px_rgb(7_17_32_/_15%)]">
              <Mic2 size={15} /> Voz local
            </div>
          </div>
        </section>

        <section className="border-y border-[#e5ebf2] bg-white">
          <div className="mx-auto grid w-[calc(100%-2rem)] max-w-[1120px] gap-10 py-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24 lg:py-24">
            <div>
              <span className="text-xs font-black tracking-[0.2em] text-[#f4b832]">
                NOSSA HISTÓRIA
              </span>
              <h2 className="mb-0 mt-3 max-w-[11ch] text-[clamp(2.5rem,4vw,4rem)] font-black leading-[0.95] tracking-[-0.065em] text-[#10213b]">
                Feita de gente para gente.
              </h2>
            </div>
            <div className="grid gap-5 text-[1.05rem] leading-[1.8] text-[#617a9d]">
              <p>
                A Gaivota FM acredita que uma rádio pode ser muito mais do que o
                som que toca no fundo. Ela pode informar sem afastar, divertir
                sem distrair e criar um ponto de encontro para quem vive a mesma
                cidade.
              </p>
              <p>
                Por isso, nossa programação mistura a trilha sonora dos seus
                dias com as notícias, os eventos e as vozes que fazem parte da
                nossa comunidade. Tudo com leveza, presença e aquele jeito bom
                de conversar de perto.
              </p>
              <blockquote className="mt-2 border-l-4 border-[#f0645d] pl-5 text-xl font-extrabold leading-[1.35] text-[#10213b]">
                “Quando a cidade se escuta, ela se reconhece.”
              </blockquote>
            </div>
          </div>
        </section>

        <section className="mx-auto w-[calc(100%-2rem)] max-w-[1120px] py-16 lg:py-24">
          <div className="mb-9 max-w-[540px]">
            <span className="text-xs font-black tracking-[0.2em] text-[#f0645d]">
              O QUE MOVE A GAIVOTA
            </span>
            <h2 className="mb-3 mt-3 text-[clamp(2.5rem,4vw,4rem)] font-black leading-[0.96] tracking-[-0.065em] text-[#10213b]">
              Uma frequência com propósito.
            </h2>
            <p className="text-[1.05rem] leading-[1.7] text-[#617a9d]">
              Cada escolha que fazemos começa com uma pergunta simples: isso
              aproxima as pessoas?
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {values.map(({ description, icon: Icon, title }) => (
              <article
                className="group rounded-[1.25rem] border border-[#dce5ef] bg-white p-6 shadow-[0_12px_30px_rgb(16_33_59_/_4%)] transition-all hover:-translate-y-1 hover:border-[#f4b832] hover:shadow-[0_18px_35px_rgb(16_33_59_/_9%)]"
                key={title}
              >
                <span className="mb-7 grid size-12 place-items-center rounded-xl bg-[#fff4d6] text-[#c58b13] transition-colors group-hover:bg-[#f4b832] group-hover:text-[#10213b]">
                  <Icon size={23} strokeWidth={2.2} />
                </span>
                <h3 className="mb-2 text-xl font-black text-[#10213b]">
                  {title}
                </h3>
                <p className="leading-[1.65] text-[#617a9d]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mb-16 w-[calc(100%-2rem)] max-w-[1120px] overflow-hidden rounded-[2rem] bg-[#132d4b] px-7 py-10 text-white shadow-[0_22px_50px_rgb(16_33_59_/_15%)] sm:px-12 sm:py-12 lg:mb-24 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="relative z-[1]">
            <span className="text-xs font-black tracking-[0.2em] text-[#f4b832]">
              VEM COM A GENTE
            </span>
            <h2 className="mb-2 mt-3 max-w-[14ch] text-[clamp(2.25rem,4vw,3.5rem)] font-black leading-[0.98] tracking-[-0.06em]">
              Tem sempre espaço para você no nosso dial.
            </h2>
            <p className="max-w-[48ch] leading-[1.65] text-[#b9c9dc]">
              Ligue o som, conte para alguém e faça parte das histórias que a
              Gaivota FM ajuda a colocar no ar.
            </p>
          </div>
          <div className="relative mt-8 shrink-0 lg:mt-0">
            <div className="absolute -right-8 -top-16 size-40 rounded-full bg-[#f0645d]/80" />
            <div className="relative grid size-32 place-items-center rounded-full border border-white/15 bg-[#193a5e] text-[#f4b832]">
              <MapPin size={48} strokeWidth={1.5} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
