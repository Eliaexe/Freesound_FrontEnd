"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  HomeIcon,
  Search,
  Heart,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  MoreHorizontal,
  Settings,
  ChevronLeft,
  Music,
  Disc3,
  Radio,
  Calendar,
  TrendingUp,
  Menu,
  X,
  Loader2,
  ListMusic,
  ArrowLeft,
} from "lucide-react"

import * as api from "./actions/api"

// Interfaces
interface PlaylistItem {
  id: string
  name: string
  time: string
  color: string
}

interface BaseAlbum {
  id: string
  title: string
  artist: string
  color: string
}

interface EmojiAlbum extends BaseAlbum {
  iconType: "emoji"
  iconValue: string
}

interface TextAlbum extends BaseAlbum {
  iconType: "text"
  iconValue: { main: string; sub: string; detail: string }
}

type Album = EmojiAlbum | TextAlbum

const albumsData: Album[] = [
  { id: "album1", title: "Vocal Studies and Upro…", artist: "Prefuse 73", color: "bg-blue-500", iconType: "emoji", iconValue: "🎵" },
  { id: "album2", title: "Temples", artist: "Lonic", color: "bg-purple-600", iconType: "emoji", iconValue: "🏛️" },
  { id: "album3", title: "Earth Tones", artist: "Lenzman", color: "bg-teal-500", iconType: "emoji", iconValue: "🌍" },
  { id: "album4", title: "Kollections 06", artist: "VA", color: "bg-orange-500", iconType: "text", iconValue: { main: "06", sub: "Kollections", detail: "Summer in the USA" } },
  { id: "album5", title: "もうその", artist: "Nujabes", color: "bg-gray-700", iconType: "emoji", iconValue: "🎌" },
  { id: "album6", title: "Album Title", artist: "Artist Name", color: "bg-indigo-600", iconType: "emoji", iconValue: "💿" },
  { id: "album7", title: "Album Title", artist: "Artist Name", color: "bg-teal-500", iconType: "emoji", iconValue: "🎵" },
  { id: "album8", title: "Album Title", artist: "Artist Name", color: "bg-green-500", iconType: "emoji", iconValue: "💰" },
]

// Loading Component
function LoadingScreen() {
  return (
    <div className="h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <Music className="w-10 h-10 text-white animate-pulse" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
          <span className="text-white text-lg font-semibold">Loading Freesound...</span>
        </div>
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-white/60 rounded-full animate-pulse" style={{ width: "60%" }}></div>
        </div>
      </div>
    </div>
  )
}

// Sidebar Component
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-black/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:w-72`}
    >
      {/* Mobile Close Button */}
      <div className="lg:hidden absolute top-4 right-4">
        <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 rounded-full" aria-label="Chiudi sidebar">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Header */}
      <div className="p-6 lg:p-8 pb-6">
        <div className="flex items-center gap-3 mb-8 lg:mb-12">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
          <span className="text-xl font-semibold text-white">Freesound</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-6 lg:px-8">
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-400 mb-4 tracking-wide">Browse</h3>
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-white bg-white/10 h-12 px-4 rounded-xl">
              <HomeIcon className="w-5 h-5 mr-4" />
              Home
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 h-12 px-4 rounded-xl"
            >
              <ListMusic className="w-5 h-5 mr-4" /> 
              My Tracks (Placeholder)
            </Button>
          </nav>
        </div>
      </ScrollArea>
    </div>
  )
}

// Componente per visualizzare i risultati della ricerca
interface SearchResultsViewProps {
  tracks: api.SpotifyTrack[];
  onPlayTrack: (track: api.SpotifyTrack) => void;
  currentTrack: api.SpotifyTrack | null;
  isPlaying: boolean;
}

function SearchResultsView({ tracks, onPlayTrack, currentTrack, isPlaying }: SearchResultsViewProps) {
  if (tracks.length === 0) {
    return <p className="text-center text-white/70 mt-8">Nessun risultato trovato.</p>;
  }

  const formatDuration = (duration: number | undefined | string): string => {
    if (!duration || isNaN(Number(duration))) {
      return "--:--";
    }
    const totalSeconds = Math.floor(Number(duration) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4 lg:mb-6">Risultati della Ricerca</h2>
      
      {/* Griglia responsive: 2 colonne mobile, 3 desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {tracks.map((track, index) => {
          const trackKey = track.spotify_id || `${track.name}-${track.artist}-${index}`;
          const isCurrentTrack = currentTrack?.spotify_id === track.spotify_id;
          
          return (
            <Card 
              key={trackKey}
              className={`relative overflow-hidden rounded-xl cursor-pointer aspect-square group transition-all duration-300 hover:scale-105 ${
                isCurrentTrack ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => onPlayTrack(track)}
            >
              {/* Background con immagine */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: track.image ? `url(${track.image})` : 'none',
                  backgroundColor: track.image ? 'transparent' : '#8B5CF6'
                }}
              >
                {/* Overlay scuro per leggibilità */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all duration-300" />
                
                {/* Gradiente dal basso per migliore leggibilità del testo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              <CardContent className="relative z-10 p-3 lg:p-4 flex flex-col h-full justify-between">
                {/* Indicatore di riproduzione - parte superiore */}
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
                
                {/* Info traccia - parte inferiore */}
                <div className="text-white">
                  <h3 className="font-bold text-sm lg:text-base leading-tight mb-1 overflow-hidden drop-shadow-lg" 
                      style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                    {track.name || 'Titolo sconosciuto'}
                  </h3>
                  <p className="text-xs lg:text-sm text-white/90 truncate mb-2 drop-shadow-lg">
                    {track.artist || 'Artista sconosciuto'}
                  </p>
                  
                  {/* Durata */}
                  <div className="text-xs text-white/80 font-mono">
                    {formatDuration(track.duration)}
                  </div>
                </div>
              </CardContent>
              
              {/* Effetto hover */}
              <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Stati per la ricerca
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<api.SpotifyTrack[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Stato per la traccia corrente (per il player)
  const [currentTrack, setCurrentTrack] = useState<api.SpotifyTrack | null>(null)
  
  // Stato per l'audio player
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Funzione di test per le API
    const testApiFunctions = async () => {
      console.log("--- INIZIO TEST API ---");

      // Test getLoginUrl
      console.log("Login URL:", api.getLoginUrl());

      // Test getStreamUrl
      console.log(
        "Esempio Stream URL:",
        api.getStreamUrl("testSpotifyId123", "Traccia Prova", "Artista Prova", 200000)
      );

      // Test getAuthStatus
      try {
        const authStatus = await api.getAuthStatus();
        console.log("Stato Autenticazione:", authStatus);

        // Procedi con i test che richiedono autenticazione solo se l'utente è autenticato
        if (authStatus.isAuthenticated) {
          // Test getUserPlaylists
          try {
            const playlistsResponse = await api.getUserPlaylists();
            console.log("Playlist Utente:", playlistsResponse);

            if (playlistsResponse.playlists && playlistsResponse.playlists.length > 0) {
              const firstPlaylistId = playlistsResponse.playlists[0].id;
              // Test getPlaylistTracks
              try {
                const tracksResponse = await api.getPlaylistTracks(firstPlaylistId, 5);
                console.log(`Tracce della prima playlist (${firstPlaylistId}):`, tracksResponse);
              } catch (error) {
                console.error("Errore getPlaylistTracks:", error);
              }
            }
          } catch (error) {
            console.error("Errore getUserPlaylists:", error);
          }
        } else {
          console.warn("Utente non autenticato, alcuni test API verranno saltati (getUserPlaylists, getPlaylistTracks).");
        }
      } catch (error) {
        console.error("Errore getAuthStatus:", error);
        console.warn("Errore getAuthStatus, i test dipendenti (getUserPlaylists, getPlaylistTracks) potrebbero fallire o essere saltati.");
      }

      // Test searchTracks
      try {
        const searchResults = await api.searchTracks("Daft Punk");
        console.log("Risultati Ricerca per 'Daft Punk':", searchResults);
      } catch (error) {
        console.error("Errore searchTracks:", error);
      }
      
      // Test logoutUser (mettilo alla fine o commentalo se interferisce con altri test)
      // Nota: il logout invaliderà la sessione per le chiamate successive.
      /* 
      try {
        console.log("Tentativo di Logout...");
        const logoutResult = await api.logoutUser();
        console.log("Risultato Logout:", logoutResult);
        // Dopo il logout, getAuthStatus dovrebbe restituire isAuthenticated: false
        const statusAfterLogout = await api.getAuthStatus();
        console.log("Stato Autenticazione dopo il logout:", statusAfterLogout);
      } catch (error) {
        console.error("Errore logoutUser:", error);
      }
      */

      console.log("--- FINE TEST API ---");
    };

    if (process.env.NODE_ENV === 'development') { // Esegui solo in sviluppo
        testApiFunctions();
    }

    return () => clearTimeout(timer)
  }, [])

  const handleSearchSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    setShowSearchResults(true); // Mostra l'area risultati (anche se vuota o in caricamento)
    try {
      const results = await api.searchTracks(searchQuery);
      console.log("Struttura completa risultati:", JSON.stringify(results, null, 2));
      console.log("Prima traccia dettagli:", results.tracks[0]);
      setSearchResults(results.tracks);
    } catch (error) {
      console.error("Errore durante la ricerca:", error);
      setSearchError(error instanceof Error ? error.message : "Errore sconosciuto");
      setSearchResults([]); // Pulisci i risultati in caso di errore
    } finally {
      setIsSearching(false);
    }
  };
  
  const handlePlayTrack = (track: api.SpotifyTrack) => {
    setCurrentTrack(track);
    
    // Ferma l'audio precedente se esistente
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    
    // Crea nuovo elemento audio per lo streaming
    const streamUrl = api.getStreamUrl(track.spotify_id, track.name, track.artist, track.duration);
    const audio = new Audio(streamUrl);
    
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = (e) => {
      console.error('Errore riproduzione audio:', e);
      setIsPlaying(false);
    };
    
    setAudioRef(audio);
    
    // Avvia la riproduzione
    audio.play().catch(error => {
      console.error('Errore avvio riproduzione:', error);
    });
    
    console.log("Playing track:", track);
  };

  const togglePlayPause = () => {
    if (audioRef && currentTrack) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play().catch(error => {
          console.error('Errore toggle play:', error);
        });
      }
    }
  };

  // Cleanup audio quando il componente si smonta
  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.src = '';
      }
    };
  }, [audioRef]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setShowSearchResults(false);
    setSearchError(null);
  };

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 text-white flex flex-col overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 lg:px-8 py-4 lg:py-6 bg-black/20 backdrop-blur-xl border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-full bg-white/10 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Apri menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full bg-white/10 hidden lg:flex" aria-label="Indietro">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Barra di Ricerca */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input 
                  type="search" 
                  placeholder="Cerca brani, artisti..."
                  className="w-full h-10 pl-10 pr-4 py-2 bg-white/10 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                 {searchQuery && (
                    <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full p-0 text-white/70 hover:text-white"
                        onClick={clearSearch} // Cambiato per cancellare la ricerca e tornare indietro
                        aria-label="Cancella ricerca"
                    >
                        <X className="w-4 h-4"/>
                    </Button>
                )}
              </div>
            </form>

            <div className="flex items-center gap-3 lg:gap-6">
              <Avatar className="w-8 h-8 lg:w-9 lg:h-9">
                <AvatarImage src="/placeholder.svg?height=36&width=36" />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">Sandro</span>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full" aria-label="Altre opzioni">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Main Content Area with Custom Scrollbar */}
          <ScrollArea className="flex-1 overflow-hidden">
            {showSearchResults ? (
              isSearching ? (
                <div className="flex justify-center items-center h-full p-8">
                  <Loader2 className="w-8 h-8 text-white animate-spin mr-3" /> 
                  <span className="text-white/80">Ricerca in corso...</span>
                </div>
              ) : searchError ? (
                <div className="text-center p-8">
                  <p className="text-red-400">Errore: {searchError}</p>
                  <Button onClick={clearSearch} variant="outline" className="mt-4 text-white border-white/50 hover:bg-white/10">
                     Torna alla Home
                  </Button>
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <SearchResultsView tracks={searchResults} onPlayTrack={handlePlayTrack} currentTrack={currentTrack} isPlaying={isPlaying} />
              ) : (
                 <div className="text-center p-8">
                    <p className="text-white/70">Nessun risultato per "{searchQuery}". Prova con termini diversi.</p>
                    <Button onClick={clearSearch} variant="outline" className="mt-4 text-white border-white/50 hover:bg-white/10">
                        Torna alla Home
                    </Button>
                </div>
              )
            ) : (
              // Contenuto Home Semplificato
              <div className="p-4 lg:p-8 pb-32 lg:pb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">Benvenuto in Freesound!</h1>
                <p className="text-white/80 text-lg mb-6">
                  Usa la barra di ricerca in alto per trovare la tua musica preferita.
                </p>
                {/* Featured Playlist e Albums Grid RIMOSSE */}
                {/* Esempio: Mostra un messaggio o contenuto minimale */}
                <div className="mt-12 text-center">
                    <Music className="w-16 h-16 text-white/30 mx-auto mb-4"/>
                    <p className="text-white/60">Esplora e ascolta.</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Bottom Player - Fixed */}
      <div className="h-20 lg:h-24 bg-black/95 backdrop-blur-xl border-t border-white/10 px-4 lg:px-8 flex items-center justify-between flex-shrink-0">
        {/* Current Track Info */}
        <div className="flex items-center gap-3 lg:gap-5 flex-1 min-w-0">
          {currentTrack ? (
            <>
              {currentTrack.image ? (
                <Avatar className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl flex-shrink-0">
                    <AvatarImage 
                      src={currentTrack.image} 
                      alt={currentTrack.album || 'Album cover'}
                      onError={(e) => {
                        console.log('Errore caricamento immagine player:', currentTrack.image);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <AvatarFallback className="text-sm">
                      {currentTrack.name ? currentTrack.name.substring(0,1).toUpperCase() : 'M'}
                    </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-pink-500 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Music className="text-white text-lg lg:text-xl" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm lg:text-base font-semibold text-white mb-1 truncate">
                  {currentTrack.name}
                </h4>
                <p className="text-xs lg:text-sm text-white/70 truncate">
                  {currentTrack.artist}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full flex-shrink-0" aria-label="Aggiungi ai preferiti">
                <Heart className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-700 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                <Music className="text-white/50 text-lg lg:text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm lg:text-base font-semibold text-white/50 mb-1 truncate">Nessuna traccia</h4>
                <p className="text-xs lg:text-sm text-white/30 truncate">Seleziona un brano</p>
              </div>
            </>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 lg:gap-3 flex-1 max-w-md mx-4">
          <div className="flex items-center gap-4 lg:gap-6">
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full hidden sm:flex" aria-label="Shuffle" disabled={!currentTrack}>
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 lg:h-10 lg:w-10 rounded-full" aria-label="Traccia precedente" disabled={!currentTrack}>
              <SkipBack className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
            <Button 
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all"
                aria-label={isPlaying ? "Pausa" : "Play"}
                disabled={!currentTrack}
                onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 lg:w-6 lg:h-6" />
              ) : (
                <Music className="w-5 h-5 lg:w-6 lg:h-6" />
              )}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 lg:h-10 lg:w-10 rounded-full" aria-label="Traccia successiva" disabled={!currentTrack}>
              <SkipForward className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full hidden sm:flex" aria-label="Ripeti" disabled={!currentTrack}>
              <Repeat className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 lg:gap-3 w-full">
            <span className="text-xs text-white/70 font-medium hidden sm:block">{currentTrack ? "0:00" : "-"}</span>
            <Slider defaultValue={[0]} max={100} step={1} className="flex-1" disabled={!currentTrack} />
            <span className="text-xs text-white/70 font-medium hidden sm:block">
                {currentTrack && currentTrack.duration ? 
                  `${Math.floor(Number(currentTrack.duration) / 60000)}:${(Math.floor(Number(currentTrack.duration) / 1000) % 60).toString().padStart(2, '0')}` 
                  : "-"}
            </span>
          </div>
        </div>

        {/* Volume Controls - Desktop Only */}
        <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full" aria-label="Impostazioni">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full" aria-label="Volume">
            <Volume2 className="w-4 h-4" />
          </Button>
          <Slider defaultValue={[75]} max={100} step={1} className="w-28" />
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full" aria-label="Altre opzioni">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
