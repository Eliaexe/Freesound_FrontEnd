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
  onNavigateToPlaylist: (playlistId: string) => void;
}

export function SearchResultsView({ 
  searchResponse, 
  onPlayTrack, 
  currentTrack, 
  isPlaying, 
  onNavigateToArtist, 
  onNavigateToAlbum,
  onNavigateToPlaylist
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
      } else if (item.type === 'playlist') {
        onNavigateToPlaylist(item.spotify_id);
      }
    };

    // Badge per il tipo di risultato
    const getTypeBadge = (type: string) => {
      const badgeText = {
        track: 'Brano',
        artist: 'Artista',
        album: 'Album',
        playlist: 'Playlist'
      }[type] || type;

      return (
        <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-primary-foreground bg-primary/80 backdrop-blur-sm z-10">
          {badgeText}
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
        className={`relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-200 hover:scale-[1.03] bg-card ${
          isCurrentTrack ? 'ring-2 ring-primary' : ''
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
            backgroundColor: item.image ? 'transparent' : 'hsl(var(--muted))'
          }}
        >
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <CardContent className="relative z-10 p-3 flex flex-col h-full justify-between min-h-[180px] sm:min-h-[200px]">
          {/* Indicatore di riproduzione per tracce - parte superiore */}
          <div className="flex justify-end">
            {isCurrentTrack && (
              <div className="w-8 h-8 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Music className="w-4 h-4 text-primary-foreground animate-pulse" />
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
            <p className="text-xs text-white/80 truncate mb-1 drop-shadow-lg">
              {getSubtitle(item)}
            </p>
            
            <div className="text-xs text-white/70 font-mono truncate">
              {getExtraInfo(item)}
            </div>
          </div>
        </CardContent>
        
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    );
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">Risultati della Ricerca</h2>
        
        {searchResponse.total_found && (
          <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
            <span>Brani: {searchResponse.total_found.tracks}</span>
            <span>Artisti: {searchResponse.total_found.artists}</span>
            <span>Album: {searchResponse.total_found.albums}</span>
            <span>Playlist: {searchResponse.total_found.playlists}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
        {results.length > 0 ? (
          results.map(renderResultCard)
        ) : (
          tracks.map((track, index) => renderResultCard({...track, type: 'track'}, index))
        )}
      </div>
    </div>
  );
} 