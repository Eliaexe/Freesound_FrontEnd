import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

export interface SpotifyImage {
    url: string;
    height?: number;
    width?: number;
}

export interface User {
  display_name: string;
  email: string;
  id: string;
  images: SpotifyImage[];
}

const API_URL = "http://127.0.0.1:5501";

export function useUser() {
  const { data: user, error, isLoading, mutate } = useSWR<User>(`${API_URL}/api/me`, fetcher);

  const logout = async () => {
    try {
        await fetch(`${API_URL}/auth/logout`);
        mutate(undefined, false); // Pulisce i dati utente locali
    } catch (error) {
        console.error("Errore durante il logout:", error);
    }
  };

  return {
    user,
    isAuthenticated: !error && user && user.id,
    isLoading,
    isError: error,
    logout
  };
} 