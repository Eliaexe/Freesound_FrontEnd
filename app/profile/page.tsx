"use client";

import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { SpotifyArtist } from "../actions/api";
import { ContentCard } from "../components/common/ContentCarousel";
import { useView } from "../contexts/ViewContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function TopArtistsCarousel() {
    const { data: topArtists, error, isLoading } = useSWR<SpotifyArtist[]>(`${API_URL}/api/me/top/artists`, fetcher);
    const { navigateToArtist } = useView();

    if (isLoading) {
        return (
             <div className="flex space-x-4 md:space-x-6 overflow-x-scroll pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent md:mx-0 md:px-0">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-40 flex-shrink-0 md:w-48">
                        <Skeleton className="aspect-square w-full rounded-xl" />
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-3 w-2/3 mt-1" />
                    </div>
                ))}
            </div>
        )
    }

    if (error || !topArtists) {
        return <p className="text-white/70">Impossibile caricare i tuoi artisti preferiti.</p>
    }

    return (
        <div className="flex space-x-4 md:space-x-6 overflow-x-scroll pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent md:mx-0 md:px-0">
           {topArtists.map((artist) => (
               <ContentCard 
                    key={artist.spotify_id}
                    item={{...artist, type: 'artist'}}
                    onClick={() => navigateToArtist(artist.spotify_id)}
               />
           ))}
        </div>
    )
}


export default function ProfilePage() {
    const { user, isLoading, isAuthenticated } = useUser();

    if (isLoading) {
        return (
            <div className="p-4 lg:p-8 space-y-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="p-4 lg:p-8 text-center text-white">
                <h1 className="text-2xl font-bold mb-4">Accesso Richiesto</h1>
                <p>Effettua il login per visualizzare il tuo profilo.</p>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-8 space-y-12 pb-32 lg:pb-8">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 text-4xl">
                    <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-sm uppercase text-white/70 tracking-wider">Profilo</h2>
                    <h1 className="text-4xl md:text-6xl font-bold text-white">{user?.displayName}</h1>
                    <p className="text-white/80 mt-1">{user?.email}</p>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">I tuoi artisti preferiti</h2>
                <TopArtistsCarousel />
            </div>

            {/* Qui in futuro si potranno aggiungere altre sezioni: tracce preferite, statistiche, ecc. */}
        </div>
    )
} 