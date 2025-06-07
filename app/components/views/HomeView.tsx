"use client";

import { ContentCarousel } from '@/app/components/common/ContentCarousel';
import { usePlayer } from '@/app/contexts/PlayerContext';
import { useView } from '@/app/contexts/ViewContext';
import { SpotifyTrack, SearchResultItem } from '@/app/actions/api';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Music } from "lucide-react";

const API_URL = "http://127.0.0.1:5501";

interface HomeSection {
    title: string;
    items: SearchResultItem[];
}

interface HomeContent {
    [key: string]: HomeSection;
}

function CarouselSkeleton() {
    return (
        <div className="space-y-3 md:space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <div className="flex space-x-4 md:space-x-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-40 flex-shrink-0 md:w-48">
                        <Skeleton className="aspect-square w-full rounded-xl" />
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-3 w-2/3 mt-1" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function HomeView() {
    const { playTrack } = usePlayer();
    const { navigateToArtist, navigateToAlbum, navigateToPlaylist } = useView();
    const { data: homeContent, error, isLoading } = useSWR<HomeContent>(`${API_URL}/api/home/content`, fetcher, {
        revalidateOnFocus: false,
    });

    const handleItemClick = (item: SearchResultItem) => {
        if (item.type === 'track') {
            playTrack(item);
        } else if (item.type === 'artist') {
            navigateToArtist(item.spotify_id);
        } else if (item.type === 'album') {
            navigateToAlbum(item.spotify_id);
        } else if (item.type === 'playlist') {
            navigateToPlaylist(item.spotify_id);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 lg:p-8 space-y-12 pb-32 lg:pb-8">
                <CarouselSkeleton />
                <CarouselSkeleton />
                <CarouselSkeleton />
            </div>
        );
    }

    if (error) {
        return (
             <div className="p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Benvenuto in Freesound!</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Usa la barra di ricerca in alto per trovare la tua musica preferita.
                </p>
                <div className="mt-16 text-center">
                    <Music className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4"/>
                    <p className="text-muted-foreground/80">Effettua il login per vedere i tuoi contenuti.</p>
                </div>
            </div>
        );
    }
    
    const sections = [
        homeContent?.userPlaylists,
        homeContent?.topArtists,
        homeContent?.savedAlbums,
        homeContent?.topTracks
    ].filter((section): section is HomeSection => 
        !!section && 
        Array.isArray(section.items) && 
        section.items.length > 0
    );

    if (sections.length === 0) {
        return (
             <div className="p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Esplora</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Sembra che il tuo profilo sia un po' vuoto. Salva qualche album o playlist su Spotify per vederli qui!
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 space-y-12 pb-32 lg:pb-8">
            {sections.map(section => (
                <ContentCarousel 
                    key={section.title}
                    title={section.title}
                    items={section.items}
                    onItemClick={handleItemClick}
                />
            ))}
        </div>
    );
} 