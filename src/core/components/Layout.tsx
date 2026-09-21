import { LogIn, Volume2 } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { RadioPlayerProvider } from './RadioPlayerContext';
import { useRadioPlayer } from '../hooks/radio-player';

export function Layout() {
  return (
    <RadioPlayerProvider>
      <RadioPlayerControls />
    </RadioPlayerProvider>
  );
}

function RadioPlayerControls() {
  const {
    hasError,
    isLoading,
    isPlaying,
    setVolume,
    streamAvailable,
    togglePlayback,
  } = useRadioPlayer();

  return (
    <div className="min-h-screen bg-[#f5f7fa] pb-28 text-[#10213b]">
      <header className="bg-[#071120] text-[#f6f8fc]">
        <div className="mx-auto flex min-h-[74px] w-[calc(100%-2rem)] max-w-[1120px] flex-wrap items-center gap-x-10 gap-y-3 py-3">
          <Link className="flex min-h-11 items-center" to="/">
            <img
              alt="Gaivota FM 98.1 Tramandaí/RS"
              className="h-auto w-[clamp(8.5rem,24vw,12rem)] max-w-full"
              src="/gaivota-fm-logo.svg"
            />
          </Link>
          <nav
            aria-label="Navegação principal"
            className="order-3 flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 text-xs text-[#bfd0e6] sm:order-none sm:w-auto sm:gap-1 sm:text-sm"
          >
            <NavLink
              className={({ isActive }) =>
                `inline-flex min-h-10 shrink-0 items-center rounded-lg px-3 py-2 font-bold transition-colors ${isActive ? 'bg-white text-[#10213b] shadow-sm' : 'hover:bg-white/10 hover:text-white'}`
              }
              end
              to="/"
            >
              Início
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `inline-flex min-h-10 shrink-0 items-center rounded-lg px-3 py-2 font-bold transition-colors ${isActive ? 'bg-white text-[#10213b] shadow-sm' : 'hover:bg-white/10 hover:text-white'}`
              }
              to="/news"
            >
              Notícias
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `inline-flex min-h-10 shrink-0 items-center rounded-lg px-3 py-2 font-bold transition-colors ${isActive ? 'bg-white text-[#10213b] shadow-sm' : 'hover:bg-white/10 hover:text-white'}`
              }
              to="/about"
            >
              Quem somos
            </NavLink>
            <a
              className="inline-flex min-h-10 shrink-0 items-center rounded-lg px-3 py-2 font-bold transition-colors hover:bg-white/10 hover:text-white"
              href="#live"
            >
              Ao vivo
            </a>
            <a
              className="inline-flex min-h-10 shrink-0 items-center rounded-lg px-3 py-2 font-bold transition-colors hover:bg-white/10 hover:text-white"
              href="#agenda"
            >
              Agenda
            </a>
          </nav>
          <Link
            className="order-2 ml-auto inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#f4b832] px-3.5 py-2 text-xs font-black text-[#f4b832] transition-colors hover:bg-[#f4b832] hover:text-[#071120] sm:order-none sm:ml-auto"
            to="/admin/login"
          >
            <LogIn size={15} />
            Login
          </Link>
          <a
            className="order-2 inline-flex min-h-11 items-center gap-2 rounded-lg px-2.5 text-xs font-black tracking-[0.08em] text-[#f4b832] transition-colors hover:bg-white/10 sm:order-none"
            href="#live"
          >
            <span className="inline-block size-2 rounded-full bg-[#f0645d] shadow-[0_0_0_5px_rgb(240_100_93_/_16%)]" />{' '}
            AO VIVO
          </a>
        </div>
      </header>
      <Outlet />
      <aside
        className="fixed bottom-3 left-1/2 z-30 flex min-h-[66px] w-[calc(100%-1rem)] max-w-[650px] -translate-x-1/2 items-center gap-2 rounded-2xl bg-[#132d4b] px-3 py-2.5 text-white shadow-[0_16px_40px_rgb(7_17_32_/_25%)] sm:bottom-4 sm:w-[calc(100%-2rem)] sm:gap-4 sm:px-4"
        id="live"
      >
        <div className="grid min-w-0 flex-1 gap-1">
          <span className="inline-flex items-center gap-2 text-[0.6rem] font-black tracking-[0.12em] text-[#f0645d]">
            <span
              className={`inline-block size-2 rounded-full shadow-[0_0_0_5px_rgb(240_100_93_/_16%)] ${hasError ? 'bg-[#91a3b8]' : 'bg-[#f0645d]'}`}
            />{' '}
            {hasError ? 'SEM SINAL' : isLoading ? 'CONECTANDO' : 'AO VIVO'}
          </span>
          <small className="truncate text-[0.68rem] text-[#aebfd4]">
            Gaivota FM · Música para o seu momento
          </small>
        </div>
        <button
          aria-label={
            isPlaying ? 'Pausar transmissão' : 'Reproduzir transmissão'
          }
          className="grid size-11 shrink-0 place-items-center rounded-full border-0 bg-[#f4b832] text-base font-black text-[#10213b] transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!streamAvailable || isLoading}
          onClick={() => void togglePlayback()}
          type="button"
        >
          {isLoading ? '…' : isPlaying ? 'Ⅱ' : '▶'}
        </button>
        <Volume2 className="shrink-0" size={22} />
        <input
          aria-label="Volume"
          className="hidden h-1 w-20 accent-[#f4b832] sm:block"
          defaultValue="70"
          max="100"
          min="0"
          onChange={(event) => {
            setVolume(Number(event.currentTarget.value) / 100);
          }}
          type="range"
        />
      </aside>
    </div>
  );
}
