"use client";

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { SearchResultsView } from '@/app/components/search/SearchResultsView';
import { useView } from '@/app/contexts/ViewContext';
import { usePlayer } from '@/app/contexts/PlayerContext';

export function SearchView({ searchData }: { searchData?: any }) {
    const { navigateToHome, navigateToArtist, navigateToAlbum } = useView();
    const { playTrack, currentTrack, isPlaying } = usePlayer();

    if (!searchData) {
        return <div className="p-8 text-center text-white/80">Effettua una ricerca per vedere i risultati.</div>
    }

    const { results, query, error, isLoading } = searchData;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full p-8">
                <Loader2 className="w-8 h-8 text-white animate-spin mr-3" />
                <span className="text-white/80">Ricerca in corso...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <p className="text-red-400">Errore: {error.message}</p>
                <Button onClick={navigateToHome} variant="outline" className="mt-4 text-white border-white/50 hover:bg-white/10">
                    Torna alla Home
                </Button>
            </div>
        );
    }
    
    if (results && (results.results?.length > 0 || results.tracks?.length > 0)) {
        return (
            <SearchResultsView
                searchResponse={results}
                onPlayTrack={playTrack}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onNavigateToArtist={navigateToArtist}
                onNavigateToAlbum={navigateToAlbum}
            />
        )
    }
    
    return (
        <div className="text-center p-8">
            <p className="text-white/70">Nessun risultato per "{query}". Prova con termini diversi.</p>
            <Button onClick={navigateToHome} variant="outline" className="mt-4 text-white border-white/50 hover:bg-white/10">
                Torna alla Home
            </Button>
        </div>
    );
} 