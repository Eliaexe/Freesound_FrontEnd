import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pause, Music } from "lucide-react"
import * as api from "../../actions/api"
import { formatDuration } from "../../utils/formatters"

interface SearchResultsViewProps {
  searchResponse: api.SearchResponse;
  onPlayTrack: (track: api.SpotifyTrack) => void;
  currentTrack: api.SpotifyTrack | null;
  isPlaying: boolean;
  onNavigateToArtist: (artistId: string) => void;
  onNavigateToAlbum: (albumId: string) => void;
}

export function SearchResultsView({ 
  searchResponse, 
  onPlayTrack, 
  currentTrack, 
  isPlaying, 
  onNavigateToArtist, 
  onNavigateToAlbum 
}: SearchResultsViewProps) {
  // Usa i nuovi risultati multi-tipo se disponibili, altrimenti fallback alle sole tracce
  const results = searchResponse.results || [];
  const tracks = searchResponse.tracks || [];
  
  if (results.length === 0 && tracks.length === 0) {
    return <p className="text-center text-white/70 mt-8">Nessun risultato trovato.</p>;
  }

  const renderResultCard = (item: api.SearchResultItem | api.SpotifyTrack, index: number) => {
    const itemKey = item.spotify_id || `${item.name}-${index}`;
    const isCurrentTrack = item.type === 'track' && currentTrack?.spotify_id === item.spotify_id;

    // Funzione per gestire il click
    const handleClick = () => {
      if (item.type === 'track') {
        onPlayTrack(item as api.SpotifyTrack);
      } else if (item.type === 'artist') {
        onNavigateToArtist(item.spotify_id);
      } else if (item.type === 'album') {
        onNavigateToAlbum(item.spotify_id);
      } else {
        // Per playlist potresti implementare navigazione o anteprima
        console.log(`Clicked on ${item.type}:`, item);
        // TODO: Implementa navigazione verso playlist
      }
    };

    // Badge per il tipo di risultato
    const getTypeBadge = (type: string) => {
      const badges = {
        track: { text: 'Brano', color: 'bg-green-500' },
        artist: { text: 'Artista', color: 'bg-blue-500' },
        album: { text: 'Album', color: 'bg-purple-500' },
        playlist: { text: 'Playlist', color: 'bg-orange-500' }
      };
      const badge = badges[type as keyof typeof badges] || { text: type, color: 'bg-gray-500' };
      return (
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white ${badge.color} z-10`}>
          {badge.text}
        </div>
      );
    };

    // Informazioni specifiche per tipo
    const getSubtitle = (item: api.SearchResultItem | api.SpotifyTrack) => {
      switch (item.type) {
        case 'artist':
          const artist = item as api.SpotifyArtist;
          return `${artist.followers.toLocaleString()} follower`;
        case 'album':
          const album = item as api.SpotifyAlbum;
          return `${album.artist} • ${album.total_tracks} brani`;
        case 'playlist':
          const playlist = item as api.SpotifyPlaylistResult;
          return `${playlist.owner} • ${playlist.tracks_total} brani`;
        case 'track':
        default:
          const track = item as api.SpotifyTrack;
          return track.artist || 'Artista sconosciuto';
      }
    };

    // Informazioni aggiuntive
    const getExtraInfo = (item: api.SearchResultItem | api.SpotifyTrack) => {
      switch (item.type) {
        case 'artist':
          const artist = item as api.SpotifyArtist;
          return artist.genres.slice(0, 2).join(', ') || 'Generi vari';
        case 'album':
          const album = item as api.SpotifyAlbum;
          return album.release_date ? new Date(album.release_date).getFullYear().toString() : '';
        case 'playlist':
          const playlist = item as api.SpotifyPlaylistResult;
          return playlist.description.slice(0, 50) + (playlist.description.length > 50 ? '...' : '');
        case 'track':
        default:
          const track = item as api.SpotifyTrack;
          return formatDuration(track.duration);
      }
    };

    return (
      <Card 
        key={itemKey}
        className={`relative overflow-hidden rounded-xl cursor-pointer group transition-all duration-300 hover:scale-105 ${
          isCurrentTrack ? 'ring-2 ring-orange-500' : ''
        }`}
        onClick={handleClick}
      >
        {/* Badge tipo */}
        {getTypeBadge(item.type || 'track')}
        
        {/* Background con immagine */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: item.image ? `url(${item.image})` : 'none',
            backgroundColor: item.image ? 'transparent' : '#8B5CF6'
          }}
        >
          {/* Overlay scuro per leggibilità */}
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all duration-300" />
          
          {/* Gradiente dal basso per migliore leggibilità del testo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        <CardContent className="relative z-10 p-3 lg:p-4 flex flex-col h-full justify-between min-h-[200px]">
          {/* Indicatore di riproduzione per tracce - parte superiore */}
          <div className="flex justify-end">
            {isCurrentTrack && (
              <div className="w-8 h-8 bg-orange-500/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Music className="w-4 h-4 text-white animate-pulse" />
                )}
              </div>
            )}
          </div>
          
          {/* Info risultato - parte inferiore */}
          <div className="text-white">
            <h3 className="font-bold text-sm lg:text-base leading-tight mb-1 overflow-hidden drop-shadow-lg" 
                style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
              {item.name || 'Titolo sconosciuto'}
            </h3>
            <p className="text-xs lg:text-sm text-white/90 truncate mb-1 drop-shadow-lg">
              {getSubtitle(item)}
            </p>
            
            {/* Info extra */}
            <div className="text-xs text-white/80 font-mono truncate">
              {getExtraInfo(item)}
            </div>
            
            {/* Score di rilevanza per debug (solo in dev) */}
            {process.env.NODE_ENV === 'development' && item.relevance && (
              <div className="text-xs text-yellow-400 mt-1">
                Score: {item.relevance}
              </div>
            )}
          </div>
        </CardContent>
        
        {/* Effetto hover */}
        <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    );
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-white mb-2">Risultati della Ricerca</h2>
        
        {/* Mostra totali se disponibili */}
        {searchResponse.total_found && (
          <div className="text-sm text-white/70 flex gap-4">
            <span>Brani: {searchResponse.total_found.tracks}</span>
            <span>Artisti: {searchResponse.total_found.artists}</span>
            <span>Album: {searchResponse.total_found.albums}</span>
            <span>Playlist: {searchResponse.total_found.playlists}</span>
          </div>
        )}
      </div>
      
      {/* Griglia responsive: 2 colonne mobile, 3 desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {/* Mostra i risultati multi-tipo se disponibili */}
        {results.length > 0 ? (
          results.map(renderResultCard)
        ) : (
          // Fallback per compatibilità: mostra solo le tracce
          tracks.map((track, index) => renderResultCard({...track, type: 'track'}, index))
        )}
      </div>
    </div>
  );
} 