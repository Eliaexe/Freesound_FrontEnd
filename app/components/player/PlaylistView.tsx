"use client";

import { usePlayer } from '@/app/contexts/PlayerContext';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Music, Play, Pause, Repeat } from "lucide-react";
import { formatDuration } from '@/app/utils/formatters';

export function PlaylistView() {
  const {
    currentPlaylist,
    currentTrackIndex,
    isPlaying,
    isAutoplayEnabled,
    setShowPlaylist,
    playTrackFromPlaylist,
    toggleAutoplay,
    currentTrack
  } = usePlayer();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex flex-col p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <h2 className="text-2xl lg:text-3xl font-bold text-white">In Riproduzione</h2>
        <div className="flex items-center gap-4">
          <Button
            variant={isAutoplayEnabled ? "secondary" : "ghost"}
            onClick={toggleAutoplay}
            className={`rounded-full gap-2 ${isAutoplayEnabled ? "bg-orange-500/80 text-white" : "text-gray-400"}`}
          >
            <Repeat className="w-5 h-5" />
            <span className="hidden sm:inline">Auto-play {isAutoplayEnabled ? "On" : "Off"}</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowPlaylist(false)} className="h-10 w-10 rounded-full bg-white/10 text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Track List */}
      <ScrollArea className="flex-1 -mx-4">
        <div className="px-4">
          {currentPlaylist.map((track, index) => {
            const isActive = track.spotify_id === currentTrack?.spotify_id;
            return (
              <div
                key={`${track.spotify_id}-${index}`}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`}
                onClick={() => playTrackFromPlaylist(index)}
              >
                <div className="w-12 h-12 bg-gray-800 rounded-md flex-shrink-0 relative">
                  {track.image ? (
                    <img src={track.image} alt={track.name} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <Music className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                  {isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white" />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${isActive ? 'text-orange-400' : 'text-white'}`}>{track.name}</p>
                  <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                </div>
                <span className="text-sm text-gray-400 hidden sm:block">{formatDuration(track.duration)}</span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
} 