"use client";

import { usePlayer } from '@/app/contexts/PlayerContext';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Music, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, ListMusic } from 'lucide-react';
import { formatTime } from '@/app/utils/formatters';
import { PlaylistView } from './PlaylistView';

export function Player() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    seek,
    togglePlayPause,
    playNextTrack,
    playPreviousTrack,
    currentPlaylist,
    currentTrackIndex,
    isAutoplayEnabled,
    toggleAutoplay,
    showPlaylist,
    setShowPlaylist
  } = usePlayer();

  if (!currentTrack) {
    return null; // Non mostrare nulla se non c'è una traccia
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 lg:p-6 z-50">
        <div className="flex items-center gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                {currentTrack.image ? (
                    <img src={currentTrack.image} alt={currentTrack.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <Music className="w-6 h-6 text-gray-400" />
                )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-white font-medium truncate">{currentTrack.name}</h4>
              <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-center gap-2 lg:gap-4 flex-1">
            <Button variant="ghost" size="icon" onClick={playPreviousTrack} disabled={currentTrackIndex === 0} className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50">
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={togglePlayPause} className="h-12 w-12 rounded-full bg-orange-500 hover:bg-orange-600">
              {isPlaying ? <Pause className="w-6 h-6" /> : <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNextTrack} disabled={currentTrackIndex >= currentPlaylist.length - 1} className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50">
              <SkipForward className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowPlaylist(true)} className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 lg:hidden">
              <ListMusic className="w-5 h-5" />
            </Button>
          </div>

          {/* Right side controls - Desktop only */}
          <div className="hidden lg:flex items-center gap-2 justify-end" style={{ flexBasis: '200px' }}>
             <Button variant="ghost" size="sm" onClick={toggleAutoplay} className={`h-10 w-10 rounded-full hover:bg-white/20 flex ${isAutoplayEnabled ? 'bg-orange-500/20 text-orange-400' : 'bg-white/10'}`}>
              <Repeat className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowPlaylist(true)} className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20">
              <ListMusic className="w-4 h-4" />
            </Button>
            <Volume2 className="w-4 h-4 text-gray-400" />
            <Slider value={[volume * 100]} onValueChange={(v) => setVolume(v[0] / 100)} max={100} step={1} className="w-24" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime * 1000)}</span>
          <Slider value={[currentTime]} onValueChange={(v) => seek(v[0])} max={duration} step={1} className="flex-1" />
          <span className="text-xs text-gray-400 w-10">{formatTime(duration * 1000)}</span>
        </div>
      </div>
      
      {showPlaylist && <PlaylistView />}
    </>
  );
} 