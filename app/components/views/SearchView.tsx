"use client";

import { SearchResultsView } from '@/app/components/search/SearchResultsView';
import { useView } from '@/app/contexts/ViewContext';
import { usePlayer } from '@/app/contexts/PlayerContext';

export function SearchView({ searchData }: { searchData: any }) {
    const { navigateToArtist, navigateToAlbum, navigateToPlaylist } = useView();
    const { playTrack, currentTrack, isPlaying } = usePlayer();

    if (!searchData) {
        return <div className="p-4 lg:p-8 text-center text-muted-foreground">Effettua una ricerca per vedere i risultati.</div>
    }

    const { results, query, error, isLoading } = searchData;

    if (error) {
        return <div className="p-4 lg:p-8 text-center text-destructive">Errore nella ricerca: {error.message}</div>
    }

    if (isLoading) {
        return <div className="p-4 lg:p-8 text-center text-muted-foreground">Caricamento...</div>
    }

    if (!results || (results.results?.length === 0 && results.tracks?.length === 0)) {
        return <div className="p-4 lg:p-8 text-center text-muted-foreground">Nessun risultato per "{query}".</div>
    }
    
    return (
        <SearchResultsView
            searchResponse={results}
            onPlayTrack={playTrack}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onNavigateToArtist={navigateToArtist}
            onNavigateToAlbum={navigateToAlbum}
            onNavigateToPlaylist={navigateToPlaylist}
        />
    )
} 