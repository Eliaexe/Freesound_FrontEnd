"use client";

import { ArtistDetailsView } from '@/app/components/details/ArtistDetailsView';
import { usePlayer } from '@/app/contexts/PlayerContext';
import { useView } from '@/app/contexts/ViewContext';

export function ArtistView({ artistId }: { artistId: string }) {
    const { playTrack, currentTrack, isPlaying } = usePlayer();
    const { navigateToAlbum } = useView();

    return (
        <ArtistDetailsView
            artistId={artistId}
            onPlayTrack={playTrack}
            onNavigateToAlbum={navigateToAlbum}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
        />
    )
} 