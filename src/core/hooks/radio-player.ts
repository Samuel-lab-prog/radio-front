import { createContext, useContext } from 'react';

export type RadioPlayerContextValue = {
	hasError: boolean;
	isLoading: boolean;
	isPlaying: boolean;
	play: () => Promise<void>;
	togglePlayback: () => Promise<void>;
	setVolume: (volume: number) => void;
	streamAvailable: boolean;
};

export const RadioPlayerContext = createContext<RadioPlayerContextValue | null>(
	null,
);

export function useRadioPlayer() {
	const context = useContext(RadioPlayerContext);
	if (!context)
		throw new Error('useRadioPlayer must be used within RadioPlayerProvider');
	return context;
}
