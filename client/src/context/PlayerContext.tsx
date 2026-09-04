import React, { createContext, useContext, useState } from 'react';
import { Title, Episode, FastChannel, AdCreative, AdBreak } from '../types';
import { api } from '../services/api';

interface PlayerContextType {
  isPlaying: boolean;
  activeTitle: Title | null;
  activeEpisode: Episode | null;
  activeFastChannel: FastChannel | null;
  initialTimeSeconds: number;
  adBreaks: AdBreak[];
  isAdPlaying: boolean;
  currentAd: AdCreative | null;
  adSecondsRemaining: number;
  selectedQuality: string; // 'Auto', '1080p', '720p', etc.
  selectedSubtitle: string; // 'none', 'en', 'es', etc.
  selectedAudio: string;
  playTitle: (title: Title, episode?: Episode, startSeconds?: number) => Promise<void>;
  playFastChannel: (channel: FastChannel) => void;
  closePlayer: () => void;
  setSelectedQuality: (q: string) => void;
  setSelectedSubtitle: (s: string) => void;
  setSelectedAudio: (a: string) => void;
  setIsAdPlaying: (playing: boolean) => void;
  setCurrentAd: (ad: AdCreative | null) => void;
  setAdSecondsRemaining: (sec: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTitle, setActiveTitle] = useState<Title | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [activeFastChannel, setActiveFastChannel] = useState<FastChannel | null>(null);
  const [initialTimeSeconds, setInitialTimeSeconds] = useState<number>(0);
  const [adBreaks, setAdBreaks] = useState<AdBreak[]>([]);
  
  const [isAdPlaying, setIsAdPlaying] = useState<boolean>(false);
  const [currentAd, setCurrentAd] = useState<AdCreative | null>(null);
  const [adSecondsRemaining, setAdSecondsRemaining] = useState<number>(0);

  const [selectedQuality, setSelectedQuality] = useState<string>('Auto');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('en');
  const [selectedAudio, setSelectedAudio] = useState<string>('en-51');

  const playTitle = async (title: Title, episode?: Episode, startSeconds = 0) => {
    setActiveFastChannel(null);
    setActiveTitle(title);
    setActiveEpisode(episode || null);
    setInitialTimeSeconds(startSeconds);
    setIsPlaying(true);

    try {
      const res = await api.getAdBreaks(title.id);
      if (res.success) {
        setAdBreaks(res.breaks);
      }
    } catch (err) {
      console.error('Failed to load ad breaks', err);
    }
  };

  const playFastChannel = (channel: FastChannel) => {
    setActiveTitle(null);
    setActiveEpisode(null);
    setActiveFastChannel(channel);
    setInitialTimeSeconds(0);
    setAdBreaks([]);
    setIsPlaying(true);
  };

  const closePlayer = () => {
    setIsPlaying(false);
    setActiveTitle(null);
    setActiveEpisode(null);
    setActiveFastChannel(null);
    setIsAdPlaying(false);
    setCurrentAd(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        activeTitle,
        activeEpisode,
        activeFastChannel,
        initialTimeSeconds,
        adBreaks,
        isAdPlaying,
        currentAd,
        adSecondsRemaining,
        selectedQuality,
        selectedSubtitle,
        selectedAudio,
        playTitle,
        playFastChannel,
        closePlayer,
        setSelectedQuality,
        setSelectedSubtitle,
        setSelectedAudio,
        setIsAdPlaying,
        setCurrentAd,
        setAdSecondsRemaining,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
