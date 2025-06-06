"use client";

import { AlbumDetailsView } from '@/app/components/details/AlbumDetailsView';
import { usePlayer } from '@/app/contexts/PlayerContext';

export function AlbumView({ albumId }: { albumId: string }) {
    const { playTrack, currentTrack, isPlaying } = usePlayer();

    return (
        <AlbumDetailsView
            albumId={albumId}
            onPlayTrack={playTrack}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
        />
    )
} 