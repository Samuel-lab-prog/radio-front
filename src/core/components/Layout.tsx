import { LogIn, Menu, Volume2, X } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
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
            className={`order-3 w-full flex-col gap-1 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1 text-xs text-[#bfd0e6] transition-[max-height,opacity,transform] duration-200 ease-out sm:order-none sm:flex sm:max-h-none sm:w-auto sm:flex-row sm:items-center sm:overflow-visible sm:text-sm sm:opacity-100 sm:transform-none sm:pointer-events-auto ${menuOpen ? 'pointer-events-auto flex max-h-80 translate-y-0 opacity-100' : 'pointer-events-none flex max-h-0 -translate-y-2 opacity-0'}`}
            id="main-navigation"
          >
            <NavLink
              className={({ isActive }) =>
                `inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 py-2 font-bold transition-colors sm:min-h-10 ${isActive ? 'bg-white text-[#10213b] shadow-sm' : 'hover:bg-white/10 hover:text-white'}`
              }
              onClick={() => setMenuOpen(false)}
              end
              to="/"
            >
              Início
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 py-2 font-bold transition-colors sm:min-h-10 ${isActive ? 'bg-white text-[#10213b] shadow-sm' : 'hover:bg-white/10 hover:text-white'}`
              }
              onClick={() => setMenuOpen(false)}
              to="/news"
            >
              Notícias
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 py-2 font-bold transition-colors sm:min-h-10 ${isActive ? 'bg-white text-[#10213b] shadow-sm' : 'hover:bg-white/10 hover:text-white'}`
              }
              onClick={() => setMenuOpen(false)}
              to="/about"
            >
              Quem somos
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 py-2 font-bold transition-colors sm:min-h-10 ${isActive ? 'bg-white text-[#10213b] shadow-sm' : 'hover:bg-white/10 hover:text-white'}`
              }
              onClick={() => setMenuOpen(false)}
              to="/agenda"
            >
              Agenda
            </NavLink>
          </nav>
          <Link
            className="order-2 ml-auto inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#f4b832] px-3.5 py-2 text-xs font-black text-[#f4b832] transition-colors hover:bg-[#f4b832] hover:text-[#071120] sm:order-none sm:ml-auto"
            to="/admin/login"
          >
            <LogIn size={15} />
            Login
          </Link>
          <button
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className={`order-2 grid size-11 place-items-center rounded-lg border border-white/15 text-[#f6f8fc] transition-[background-color,transform] duration-200 hover:bg-white/10 sm:hidden ${menuOpen ? 'rotate-90' : 'rotate-0'}`}
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
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
