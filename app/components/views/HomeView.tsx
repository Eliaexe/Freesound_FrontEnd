"use client";

import { ContentCarousel } from '@/app/components/common/ContentCarousel';
import { usePlayer } from '@/app/contexts/PlayerContext';
import { useView } from '@/app/contexts/ViewContext';
import { SpotifyTrack, SpotifyArtist, SpotifyPlaylistResult, SpotifyAlbum, SearchResultItem } from '@/app/actions/api';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type ContentItem = SearchResultItem;
const API_URL = "http://localhost:5501";

interface HomeSection {
    title: string;
    items: ContentItem[];
}

interface HomeContent {
    featuredPlaylists: HomeSection;
    topArtists?: HomeSection;
    // ... altre sezioni future
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
    const { navigateToArtist, navigateToAlbum } = useView();
    const { data: homeContent, error, isLoading } = useSWR<HomeContent>(`${API_URL}/api/home/content`, fetcher);

    const handleItemClick = (item: ContentItem) => {
        if (item.type === 'artist') {
            navigateToArtist(item.spotify_id);
        } else if (item.type === 'album') {
            navigateToAlbum(item.spotify_id);
        } else if (item.type === 'playlist') {
            console.log("Navigating to playlist:", item.name);
        }
    };

    const handleTrackPlay = (track: SpotifyTrack) => {
        playTrack(track);
    };

    if (isLoading) {
        return (
            <div className="p-4 lg:p-8 space-y-12 pb-32 lg:pb-8">
                <CarouselSkeleton />
                <CarouselSkeleton />
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-white">Errore nel caricamento dei contenuti. Riprova più tardi.</div>;
    }

    return (
        <div className="p-4 lg:p-8 space-y-12 pb-32 lg:pb-8">
            {homeContent?.featuredPlaylists && homeContent.featuredPlaylists.items.length > 0 && (
                <ContentCarousel 
                    title={homeContent.featuredPlaylists.title}
                    items={homeContent.featuredPlaylists.items}
                    onItemClick={handleItemClick}
                />
            )}

            {homeContent?.topArtists && homeContent.topArtists.items.length > 0 && (
                 <ContentCarousel
                    title={homeContent.topArtists.title}
                    items={homeContent.topArtists.items}
                    onItemClick={handleItemClick}
                />
            )}
        </div>
    );
} 