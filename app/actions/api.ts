const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://reconstruction-starring-birds-fig.trycloudflare.com"

export interface SpotifyUser {
  displayName: string;
  email: string;
  id: string;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  user?: SpotifyUser;
}

export interface SpotifyTrack {
  spotify_id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  uri?: string;
  preview_url?: string;
  image?: string;
  type?: 'track';
  relevance?: number;
  popularity?: number;
}

// Nuove interfacce per ricerca multi-tipo
export interface SpotifyArtist {
  spotify_id: string;
  name: string;
  image?: string;
  type: 'artist';
  genres: string[];
  followers: number;
  popularity: number;
  relevance: number;
}

export interface SpotifyAlbum {
  spotify_id: string;
  name: string;
  artist: string;
  image?: string;
  type: 'album';
  release_date?: string;
  total_tracks: number;
  relevance: number;
}

export interface SpotifyPlaylistResult {
  spotify_id: string;
  name: string;
  description: string;
  image?: string;
  type: 'playlist';
  owner: string;
  tracks_total: number;
  relevance: number;
}

export type SearchResultItem = SpotifyTrack | SpotifyArtist | SpotifyAlbum | SpotifyPlaylistResult;

// Nuove interfacce per dettagli artista e album
export interface ArtistDetails {
  id: string;
  name: string;
  image?: string;
  followers: number;
  popularity: number;
  genres: string[];
  external_url?: string;
}

export interface ArtistDetailsResponse {
  success: boolean;
  artist: ArtistDetails;
  topTracks: SpotifyTrack[];
  albums: AlbumSimple[];
  message?: string;
  error?: { message: string; status: number };
}

export interface AlbumSimple {
  id: string;
  name: string;
  image?: string;
  release_date: string;
  total_tracks: number;
  type: string;
  external_url?: string;
}

export interface AlbumDetails {
  id: string;
  name: string;
  artist: string;
  image?: string;
  release_date: string;
  total_tracks: number;
  genres: string[];
  popularity: number;
  type: string;
  external_url?: string;
  label?: string;
  copyright?: string;
}

export interface AlbumTrack {
  track_number: number;
  name: string;
  artist: string;
  duration: number;
  spotify_id: string;
  preview_url?: string;
  explicit: boolean;
  album: string;
  image?: string;
}

export interface AlbumDetailsResponse {
  success: boolean;
  album: AlbumDetails;
  tracks: AlbumTrack[];
  message?: string;
  error?: { message: string; status: number };
}

export interface SearchByType {
  tracks: SpotifyTrack[];
  artists: SpotifyArtist[];
  albums: SpotifyAlbum[];
  playlists: SpotifyPlaylistResult[];
}

export interface TotalFound {
  tracks: number;
  artists: number;
  albums: number;
  playlists: number;
}

export interface SearchResponse {
  // Compatibilità con versione precedente
  tracks: SpotifyTrack[];
  
  // Nuove proprietà per ricerca multi-tipo
  results?: SearchResultItem[];
  by_type?: SearchByType;
  total_found?: TotalFound;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string }[];
  owner: { display_name: string };
  tracks: { total: number };
}

export interface UserPlaylistsResponse {
  playlists: SpotifyPlaylist[];
}

export interface SpotifyPlaylistTrack {
  track: SpotifyTrack | null; // track can be null if it's a local file or unavailable
}

export interface PlaylistTracksResponse {
  items: SpotifyPlaylistTrack[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

// Nuove interfacce per raccomandazioni
export interface RecommendationResponse {
  success: boolean;
  tracks: SpotifyTrack[];
  message?: string;
}

export interface RecommendationOptions {
  seed_tracks?: string;
  seed_artists?: string; 
  seed_genres?: string;
  limit?: number;
}

// Helper per gestire le risposte fetch
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // Se il corpo non è JSON o è vuoto
      errorData = { message: response.statusText };
    }
    console.error("Errore API:", response.status, errorData);
    throw new Error(errorData?.error || errorData?.message || "Errore sconosciuto dal server");
  }

  // Controlla se la risposta ha contenuto
  const contentType = response.headers.get("content-type");
  
  // Se lo status è 204 No Content, restituisci un oggetto vuoto
  if (response.status === 204) {
    return {} as T;
  }
  
  // Se non è JSON, prova a leggere come testo per logout
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch (e) {
      // Per logout che restituisce testo semplice
      return text as unknown as T;
    }
  }

  // Altrimenti, leggi come JSON
  return response.json() as Promise<T>;
}

// --- Autenticazione ---

/**
 * Restituisce l'URL a cui reindirizzare l'utente per il login con Spotify.
 */
export function getLoginUrl(): string {
  return `${BACKEND_URL}/auth/login`;
}

/**
 * Effettua il logout dell'utente.
 * Richiede che i cookie di sessione siano inviati correttamente dal browser.
 */
export async function logoutUser(): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/auth/logout`, {
    method: "GET",
    credentials: "include", // Invia i cookie
  });
  // Logout potrebbe restituire testo semplice, non JSON.
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Errore API logout:", response.status, errorText);
    throw new Error(errorText || "Errore durante il logout");
  }
  return response.text();
}

/**
 * Controlla lo stato di autenticazione dell'utente.
 * Richiede che i cookie di sessione siano inviati correttamente dal browser.
 */
export async function getAuthStatus(): Promise<AuthStatus> {
  const response = await fetch(`${BACKEND_URL}/auth/status`, {
    method: "GET",
    credentials: "include", // Invia i cookie
  });
  return handleResponse<AuthStatus>(response);
}

// --- Ricerca ---

/**
 * Cerca tracce su Spotify.
 * @param query La stringa di ricerca.
 */
export async function searchTracks(query: string): Promise<SearchResponse> {
  const response = await fetch(`${BACKEND_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    credentials: "include",
  });
  return handleResponse<SearchResponse>(response);
}

// --- Streaming ---

/**
 * Costruisce l'URL per lo streaming di una traccia.
 * Questo URL può essere usato come src per un tag <audio>.
 * @param spotifyId ID della traccia Spotify.
 * @param title Titolo della traccia.
 * @param artist Artista della traccia.
 * @param durationMs Durata della traccia in millisecondi.
 */
export function getStreamUrl(spotifyId: string, title: string, artist: string, durationMs: number): string {
  const params = new URLSearchParams({
    title,
    artist,
    duration_ms: durationMs.toString(),
  });
  return `${BACKEND_URL}/stream/${spotifyId}?${params.toString()}`;
}

// --- Playlist ---

/**
 * Recupera le playlist dell'utente loggato da Spotify.
 * Richiede che l'utente sia autenticato e i cookie di sessione inviati.
 */
export async function getUserPlaylists(): Promise<UserPlaylistsResponse> {
  const response = await fetch(`${BACKEND_URL}/api/me/playlists`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<UserPlaylistsResponse>(response);
}

/**
 * Recupera le tracce di una specifica playlist da Spotify.
 * @param playlistId ID della playlist.
 * @param limit Numero massimo di tracce da restituire (default 50).
 * @param offset Indice da cui iniziare a restituire le tracce (per paginazione).
 * Richiede che l'utente sia autenticato e i cookie di sessione inviati.
 */
export async function getPlaylistTracks(
  playlistId: string,
  limit: number = 50,
  offset: number = 0
): Promise<PlaylistTracksResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString()
  });
  
  const response = await fetch(`${BACKEND_URL}/api/playlists/${playlistId}/tracks?${params}`, {
    method: 'GET',
    credentials: 'include',
  });
  
  return handleResponse<PlaylistTracksResponse>(response);
}

// --- Dettagli Artista e Album ---

/**
 * Recupera i dettagli di un artista da Spotify.
 * @param artistId ID dell'artista Spotify.
 */
export async function getArtistDetails(artistId: string): Promise<ArtistDetailsResponse> {
  const response = await fetch(`${BACKEND_URL}/api/artists/${artistId}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<ArtistDetailsResponse>(response);
}

/**
 * Recupera i dettagli di un album da Spotify.
 * @param albumId ID dell'album Spotify.
 */
export async function getAlbumDetails(albumId: string): Promise<AlbumDetailsResponse> {
  const response = await fetch(`${BACKEND_URL}/api/albums/${albumId}`, {
    method: 'GET',
    credentials: 'include',
  });
  
  return handleResponse<AlbumDetailsResponse>(response);
}

// Nuove funzioni per raccomandazioni e playlist
export async function getRecommendations(options: RecommendationOptions): Promise<RecommendationResponse> {
  const params = new URLSearchParams();
  
  if (options.seed_tracks) params.append('seed_tracks', options.seed_tracks);
  if (options.seed_artists) params.append('seed_artists', options.seed_artists);
  if (options.seed_genres) params.append('seed_genres', options.seed_genres);
  if (options.limit) params.append('limit', options.limit.toString());
  
  const response = await fetch(`${BACKEND_URL}/api/recommendations/playlists?${params}`, {
    method: 'GET',
    credentials: 'include',
  });
  
  return handleResponse<RecommendationResponse>(response);
}
