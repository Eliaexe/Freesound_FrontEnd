import { useState, useEffect } from "react"
import { Loader2, TrendingUp, Radio, Music, Disc3, Pause } from "lucide-react"
import * as api from "../../actions/api"
import { formatDuration } from "../../utils/formatters"
import { log } from "console";

interface ArtistDetailsViewProps {
  artistId: string;
  onPlayTrack: (track: api.SpotifyTrack) => void;
  onNavigateToAlbum: (albumId: string) => void;
  currentTrack: api.SpotifyTrack | null;
  isPlaying: boolean;
}

export function ArtistDetailsView({ 
  artistId, 
  onPlayTrack, 
  onNavigateToAlbum, 
  currentTrack, 
  isPlaying 
}: ArtistDetailsViewProps) {
  const [artistData, setArtistData] = useState<api.ArtistDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getArtistDetails(artistId);
        if (data.success) {
          console.log('data', data);
          setArtistData(data);
        } else {
          setError(data.message || 'Errore nel caricamento dei dettagli artista');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistDetails();
  }, [artistId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Loader2 className="w-8 h-8 text-primary animate-spin mr-3" />
        <span className="text-muted-foreground">Caricamento artista...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive mb-4">Errore: {error}</p>
      </div>
    );
  }

  if (!artistData) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Nessun dato disponibile per questo artista.</p>
      </div>
    );
  }

  const { artist, topTracks, albums } = artistData;

  return (
    <div className="p-4 lg:p-8 pb-32 lg:pb-8">
      {/* Header artista */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8">
        {/* Immagine artista */}
        <div className="w-48 h-48 lg:w-64 lg:h-64 mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-primary/20 flex-shrink-0">
          {artist.image ? (
            <img 
              src={artist.image} 
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
        
        {/* Info artista */}
        <div className="text-center lg:text-left flex-1">
          <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">{artist.name}</h1>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4 text-muted-foreground">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {artist.followers.toLocaleString()} follower
            </span>
            {artist.popularity > 0 && (
              <span className="flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Popolarità: {artist.popularity}%
              </span>
            )}
          </div>
          {artist.genres.length > 0 && (
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
              {artist.genres.slice(0, 5).map((genre, index) => (
                <span key={index} className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground">
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Brani popolari */}
      {topTracks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-4">Brani Popolari</h2>
          <div className="space-y-2">
            {topTracks.map((track, index) => {
              const isCurrentTrack = currentTrack?.spotify_id === track.spotify_id;
              return (
                <div 
                  key={track.spotify_id}
                  className={`flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all ${
                    isCurrentTrack ? 'bg-primary/20' : ''
                  }`}
                  onClick={() => onPlayTrack(track)}
                >
                  <span className="text-muted-foreground font-mono text-sm w-6 text-center">{index + 1}</span>
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {track.image ? (
                      <img src={track.image} alt={track.album} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-foreground font-medium truncate">{track.name}</h4>
                    <p className="text-muted-foreground text-sm truncate">{track.album}</p>
                  </div>
                  <span className="text-muted-foreground text-sm font-mono hidden sm:block">{formatDuration(track.duration)}</span>
                  {isCurrentTrack && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      {isPlaying ? (
                        <Pause className="w-3 h-3 text-primary-foreground" />
                      ) : (
                        <Music className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Album */}
      {albums.length > 0 && (
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-4">Album e Singoli</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {albums.map((album) => (
              <div
                key={album.id}
                className="aspect-square relative overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => onNavigateToAlbum(album.id)}
              >
                {album.image ? (
                  <img
                    src={album.image}
                    alt={album.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <Disc3 className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-white font-medium text-sm truncate">{album.name}</h4>
                  <div className="text-white/70 text-xs">
                    <span>{album.type === 'album' ? 'Album' : 'Singolo'}</span>
                    {album.release_date && (
                      <span> • {new Date(album.release_date).getFullYear()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 