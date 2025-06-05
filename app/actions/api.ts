const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5501";

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
}

export interface SearchResponse {
  tracks: SpotifyTrack[];
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
  // Se lo status è 204 No Content o se il content-type non è JSON, potrebbe non esserci corpo
  if (response.status === 204 || response.headers.get("content-type")?.includes("application/json") !== true) {
    // Per logout che risponde con testo o 200 OK senza corpo JSON significativo per il client
    if (response.ok && (response.status === 200 || response.status === 204)) {
        const text = await response.text();
        try {
            return JSON.parse(text) as T; // Prova a parsare se per caso fosse JSON
        } catch (e) {
             // @ts-ignore Non possiamo restituire stringa se T è un oggetto, ma per logout va bene
            return text as T;
        }
    }
     // @ts-ignore Non possiamo restituire undefined se T è un oggetto
    return undefined; 
  }
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
  const response = await fetch(`${BACKEND_URL}/spotify/playlists`, {
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
  limit?: number,
  offset?: number
): Promise<PlaylistTracksResponse> {
  const params = new URLSearchParams();
  if (limit !== undefined) {
    params.append("limit", limit.toString());
  }
  if (offset !== undefined) {
    params.append("offset", offset.toString());
  }
  
  let url = `${BACKEND_URL}/spotify/playlists/${playlistId}/tracks`;
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<PlaylistTracksResponse>(response);
}
