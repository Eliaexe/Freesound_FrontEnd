"use client";

import { useView } from '@/app/contexts/ViewContext';
import HomeView from './HomeView';
import { SearchView } from './SearchView';
import { ArtistView } from './ArtistView';
import { AlbumView } from './AlbumView';
import { LoginView } from './LoginView';
export function ViewRenderer() {
  const { currentView } = useView();

  switch (currentView.type) {
    case 'home':
      return <HomeView />;
    case 'search':
      return <SearchView searchData={currentView.data} />;
    case 'artist':
      return <ArtistView artistId={currentView.data.artistId} />;
    case 'album':
      return <AlbumView albumId={currentView.data.albumId} />;
    case 'playlist':
      return <div>Playlist View (Work In Progress)</div>;
    case 'login':
      return <LoginView />;
    default:
      return <HomeView />;
  }
}

// Creazione dei file placeholder per le viste
// HomeView.tsx
// export function HomeView() {
//     return (
//         <div className="p-4 lg:p-8">
//             <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">Benvenuto in Freesound!</h1>
//             <p className="text-white/80 text-lg mb-6">
//                 Usa la barra di ricerca in alto per trovare la tua musica preferita.
//             </p>
//             <div className="mt-12 text-center">
//                 <Music className="w-16 h-16 text-white/30 mx-auto mb-4"/>
//                 <p className="text-white/60">Esplora e ascolta.</p>
//             </div>
//         </div>
//     );
// }

// SearchView.tsx
// export function SearchView({ searchData }: { searchData: any }) {
//     if (!searchData) {
//         return <div className="p-8 text-center text-white/80">Effettua una ricerca per vedere i risultati.</div>
//     }

//     const { results, query, error } = searchData;

//     if (error) {
//         return <div className="p-8 text-center text-red-400">Errore nella ricerca: {error.message}</div>
//     }
    
//     // Qui andrebbe SearchResultsView, ma per ora teniamolo semplice
//     return (
//         <div className="p-4 lg:p-8">
//             <h1 className="text-2xl font-bold text-white mb-6">Risultati per "{query}"</h1>
//             <pre className="text-xs bg-black/20 p-4 rounded-md overflow-auto">{JSON.stringify(results, null, 2)}</pre>
//         </div>
//     )
// }

// ArtistView.tsx
// export function ArtistView({ artistId }: { artistId: string }) {
//     // Qui andrà la logica per fetchare i dati dell'artista
//     return (
//         <div className="p-4 lg:p-8">
//             <h1 className="text-3xl font-bold">Dettagli Artista: {artistId}</h1>
//             {/* ... Dettagli ... */}
//         </div>
//     )
// }

// AlbumView.tsx
// export function AlbumView({ albumId }: { albumId: string }) {
//     // Qui andrà la logica per fetchare i dati dell'album
//     return (
//         <div className="p-4 lg:p-8">
//             <h1 className="text-3xl font-bold">Dettagli Album: {albumId}</h1>
//             {/* ... Dettagli ... */}
//         </div>
//     )
// }

// PlaylistView.tsx (la vista principale, non il popup)
// export function PlaylistView({ playlistId }: { playlistId: string }) { ... } 