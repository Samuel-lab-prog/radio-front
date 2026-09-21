import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { RadioPlayerContext } from '../hooks/radio-player';

export function RadioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamUrl = import.meta.env.VITE_RADIO_STREAM_URL;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.7;
  }, []);

  async function play() {
    const audio = audioRef.current;
    if (!audio || !streamUrl || !audio.paused) return;

    setHasError(false);
    setIsLoading(true);
    try {
      await audio.play();
    } catch {
      setIsLoading(false);
      setHasError(true);
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) await play();
    else audio.pause();
  }

  function setVolume(volume: number) {
    if (audioRef.current) audioRef.current.volume = volume;
  }

  return (
    <RadioPlayerContext.Provider
      value={{
        hasError,
        isLoading,
        isPlaying,
        play,
        setVolume,
        streamAvailable: Boolean(streamUrl),
        togglePlayback,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        onError={() => {
          setIsLoading(false);
          setIsPlaying(false);
          setHasError(true);
        }}
        onPause={() => {
          setIsLoading(false);
          setIsPlaying(false);
        }}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onWaiting={() => setIsLoading(true)}
        preload="none"
        src={streamUrl || undefined}
      />
    </RadioPlayerContext.Provider>
  );
}
