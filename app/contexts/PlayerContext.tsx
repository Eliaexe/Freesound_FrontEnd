"use client";

import { createContext, useState, useRef, useContext, ReactNode, useEffect } from 'react';
import * as api from '@/app/actions/api';

// Tipi
interface PlayerState {
  currentTrack: api.SpotifyTrack | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  currentPlaylist: api.SpotifyTrack[];
  currentTrackIndex: number;
  isAutoplayEnabled: boolean;
  isLoadingPlaylist: boolean;
  showPlaylist: boolean;
}

interface PlayerActions {
  playTrack: (track: api.SpotifyTrack, playlist?: api.SpotifyTrack[]) => Promise<void>;
  playTrackFromPlaylist: (trackIndex: number) => void;
  togglePlayPause: () => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  toggleAutoplay: () => void;
  setShowPlaylist: (show: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayerContext = createContext< (PlayerState & PlayerActions) | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    volume: 1,
    duration: 0,
    currentTime: 0,
    currentPlaylist: [],
    currentTrackIndex: -1,
    isAutoplayEnabled: true,
    isLoadingPlaylist: false,
    showPlaylist: false,
  });

  const audioRef = useRef<HTMLAudioElement>(null!);

  const loadAndPlayAudio = (track: api.SpotifyTrack) => {
    if (audioRef.current) {
      const streamUrl = api.getStreamUrl(track.spotify_id, track.name, track.artist, track.duration);
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error("Errore riproduzione automatica:", e));
    }
  };

  const createAutoPlaylist = async (selectedTrack: api.SpotifyTrack) => {
    setState(s => ({ ...s, isLoadingPlaylist: true }));
    try {
      const recommendations = await api.getRecommendations({
        seed_tracks: selectedTrack.spotify_id,
        limit: 15,
      });
      const playlist = [selectedTrack, ...(recommendations.tracks || [])];
      setState(s => ({ ...s, currentPlaylist: playlist, currentTrackIndex: 0, isLoadingPlaylist: false }));
    } catch (error) {
      console.error('Errore creazione playlist automatica:', error);
      setState(s => ({ ...s, currentPlaylist: [selectedTrack], currentTrackIndex: 0, isLoadingPlaylist: false }));
    }
  };

  const playTrack = async (track: api.SpotifyTrack, playlist?: api.SpotifyTrack[]) => {
    setState(s => ({ ...s, currentTrack: track }));
    if (playlist) {
      const trackIndex = playlist.findIndex(t => t.spotify_id === track.spotify_id);
      setState(s => ({ ...s, currentPlaylist: playlist, currentTrackIndex: trackIndex >= 0 ? trackIndex : 0 }));
    } else {
      await createAutoPlaylist(track);
    }
    loadAndPlayAudio(track);
  };
  
  const playTrackFromPlaylist = (trackIndex: number) => {
    if (trackIndex >= 0 && trackIndex < state.currentPlaylist.length) {
      const track = state.currentPlaylist[trackIndex];
      setState(s => ({ ...s, currentTrack: track, currentTrackIndex: trackIndex }));
      loadAndPlayAudio(track);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setState(s => ({ ...s, isPlaying: !s.isPlaying }));
    }
  };

  const playNextTrack = () => {
    if (state.currentTrackIndex < state.currentPlaylist.length - 1) {
      const nextIndex = state.currentTrackIndex + 1;
      const nextTrack = state.currentPlaylist[nextIndex];
      setState(s => ({ ...s, currentTrack: nextTrack, currentTrackIndex: nextIndex }));
      loadAndPlayAudio(nextTrack);
    }
  };

  const playPreviousTrack = () => {
    if (state.currentTrackIndex > 0) {
      const prevIndex = state.currentTrackIndex - 1;
      const prevTrack = state.currentPlaylist[prevIndex];
      setState(s => ({ ...s, currentTrack: prevTrack, currentTrackIndex: prevIndex }));
      loadAndPlayAudio(prevTrack);
    }
  };

  const setVolume = (newVolume: number) => {
    if(audioRef.current) audioRef.current.volume = newVolume;
    setState(s => ({ ...s, volume: newVolume }));
  };

  const seek = (time: number) => {
    if(audioRef.current) audioRef.current.currentTime = time;
    setState(s => ({ ...s, currentTime: time }));
  };
  
  const toggleAutoplay = () => setState(s => ({...s, isAutoplayEnabled: !s.isAutoplayEnabled}));
  const setShowPlaylist = (show: boolean) => setState(s => ({...s, showPlaylist: show}));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setState(s => ({ ...s, isPlaying: true }));
    const onPause = () => setState(s => ({ ...s, isPlaying: false }));
    const onTimeUpdate = () => setState(s => ({ ...s, currentTime: audio.currentTime }));
    const onLoadedMetadata = () => setState(s => ({ ...s, duration: audio.duration }));
    const onEnded = () => {
        if(state.isAutoplayEnabled) playNextTrack();
        else setState(s => ({ ...s, isPlaying: false }));
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [state.isAutoplayEnabled, state.currentTrackIndex, state.currentPlaylist]);

  const value = {
    ...state,
    playTrack,
    playTrackFromPlaylist,
    togglePlayPause,
    playNextTrack,
    playPreviousTrack,
    setVolume,
    seek,
    toggleAutoplay,
    setShowPlaylist,
    audioRef,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}; 