import { useState, useEffect } from "react"
import { Loader2, Calendar, ListMusic, Music, Disc3, Pause } from "lucide-react"
import * as api from "../../actions/api"
import { formatDuration } from "../../utils/formatters"

interface AlbumDetailsViewProps {
  albumId: string;
  onPlayTrack: (track: api.SpotifyTrack) => void;
  currentTrack: api.SpotifyTrack | null;
  isPlaying: boolean;
}

export function AlbumDetailsView({ albumId, onPlayTrack, currentTrack, isPlaying }: AlbumDetailsViewProps) {
  const [albumData, setAlbumData] = useState<api.AlbumDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getAlbumDetails(albumId);
        if (data.success) {
          setAlbumData(data);
        } else {
          setError(data.message || 'Errore nel caricamento dei dettagli album');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [albumId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Loader2 className="w-8 h-8 text-white animate-spin mr-3" />
        <span className="text-white/80">Caricamento album...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400 mb-4">Errore: {error}</p>
      </div>
    );
  }

  if (!albumData) {
    return (
      <div className="text-center p-8">
        <p className="text-white/70">Nessun dato disponibile per questo album.</p>
      </div>
    );
  }

  const { album, tracks } = albumData;
  const totalDuration = tracks.reduce((sum, track) => sum + track.duration, 0);

  return (
    <div className="p-4 lg:p-8 pb-32 lg:pb-8">
      {/* Header album */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8">
        {/* Immagine album */}
        <div className="w-48 h-48 lg:w-64 lg:h-64 mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 shadow-2xl">
          {album.image ? (
            <img 
              src={album.image} 
              alt={album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Disc3 className="w-16 h-16 text-white/70" />
            </div>
          )}
        </div>
        
        {/* Info album */}
        <div className="text-center lg:text-left flex-1">
          <p className="text-white/80 text-sm uppercase tracking-wider mb-2">
            {album.type === 'album' ? 'Album' : 'Singolo'}
          </p>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">{album.name}</h1>
          <p className="text-xl text-white/90 mb-4">{album.artist}</p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4 text-white/80">
            {album.release_date && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(album.release_date).getFullYear()}
              </span>
            )}
            <span className="flex items-center gap-2">
              <ListMusic className="w-4 h-4" />
              {album.total_tracks} brani
            </span>
            <span className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              {formatDuration(totalDuration)}
            </span>
          </div>
          
          {album.genres.length > 0 && (
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
              {album.genres.slice(0, 3).map((genre, index) => (
                <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/90">
                  {genre}
                </span>
              ))}
            </div>
          )}
          
          {album.label && (
            <p className="text-white/60 text-sm">
              {album.label}
            </p>
          )}
        </div>
      </div>

      {/* Lista tracce */}
      <div>
        <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">Tracce</h2>
        <div className="space-y-1">
          {tracks.map((track) => {
            const isCurrentTrack = currentTrack?.spotify_id === track.spotify_id;
            // Converti AlbumTrack in SpotifyTrack per compatibilità con player
            const spotifyTrack: api.SpotifyTrack = {
              spotify_id: track.spotify_id,
              name: track.name,
              artist: track.artist,
              album: track.album,
              duration: track.duration,
              image: track.image,
              type: 'track',
              preview_url: track.preview_url
            };
            
            return (
              <div 
                key={track.spotify_id}
                className={`flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all ${
                  isCurrentTrack ? 'bg-orange-500/20' : ''
                }`}
                onClick={() => onPlayTrack(spotifyTrack)}
              >
                <span className="text-white/70 font-mono text-sm w-8 text-center">{track.track_number}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{track.name}</h4>
                  <p className="text-white/70 text-sm">{track.artist}</p>
                </div>
                {track.explicit && (
                  <span className="px-2 py-1 bg-gray-600 rounded text-xs text-white/90 hidden sm:inline-block">E</span>
                )}
                <span className="text-white/70 text-sm font-mono hidden sm:block">{formatDuration(track.duration)}</span>
                {isCurrentTrack && (
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    {isPlaying ? (
                      <Pause className="w-3 h-3 text-white" />
                    ) : (
                      <Music className="w-3 h-3 text-white" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 