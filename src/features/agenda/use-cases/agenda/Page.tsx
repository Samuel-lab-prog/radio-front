import { CalendarDays, Radio, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageMetadata } from '@core/components/PageMetadata';

export function AgendaPage() {
  return (
    <>
      <PageMetadata
        description="A programação da Gaivota FM está sendo preparada. Em breve, confira os horários e programas da rádio."
        title="Agenda"
      />
      <main className="mx-auto flex min-h-[calc(100vh-74px)] w-[calc(100%-2rem)] max-w-[1120px] items-center justify-center py-16 sm:py-24">
        <section className="relative w-full max-w-[760px] overflow-hidden rounded-[2rem] border border-[#dce5ef] bg-white px-6 py-12 text-center shadow-[0_22px_55px_rgb(16_33_59_/_8%)] sm:px-12 sm:py-16">
          <div className="absolute -right-16 -top-20 size-48 rounded-full bg-[#fff1c9]" />
          <div className="absolute -bottom-24 -left-16 size-48 rounded-full bg-[#ffe2df]" />
          <div className="relative">
            <span className="mx-auto mb-7 grid size-16 place-items-center rounded-2xl bg-[#132d4b] text-[#f4b832] shadow-[0_12px_24px_rgb(19_45_75_/_16%)]">
              <CalendarDays size={30} strokeWidth={1.8} />
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] text-[#f0645d]">
              <Sparkles size={14} /> EM BREVE
            </span>
            <h1 className="mx-auto mt-4 max-w-[14ch] text-[clamp(2.5rem,6vw,4.6rem)] font-black leading-[0.95] tracking-[-0.07em] text-[#10213b]">
              Nossa agenda está chegando.
            </h1>
            <p className="mx-auto mt-6 max-w-[48ch] text-[1.05rem] leading-[1.75] text-[#617a9d]">
              Estamos preparando a programação da Gaivota FM para você consultar
              os horários, programas e atrações da rádio em um só lugar.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                className="inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-[#f0645d] px-5 py-3.5 font-extrabold text-white shadow-[0_10px_20px_rgb(240_100_93_/_18%)] transition-transform hover:-translate-y-0.5 active:scale-[.98]"
                href="#live"
              >
                <Radio size={17} /> Ouça agora
              </a>
              <Link
                className="inline-flex min-h-11 items-center rounded-[10px] border border-[#cbd8e7] px-5 py-3.5 font-extrabold text-[#10213b] transition-colors hover:border-[#f0645d] hover:text-[#f0645d]"
                to="/"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
