import useSWR from 'swr';
import { fetcher } from '@/lib/utils'; // Assumiamo che esista un fetcher helper

export interface User {
  displayName: string;
  email: string;
  id: string;
  // Potremmo aggiungere l'URL dell'avatar qui in futuro
}

interface UserStatus {
  isAuthenticated: boolean;
  user?: User;
}

const API_URL = "https://reconstruction-starring-birds-fig.trycloudflare.com/";

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<UserStatus>(`${API_URL}/auth/status`, fetcher);

  const logout = async () => {
    try {
        await fetch(`${API_URL}/auth/logout`);
        // Aggiorna lo stato locale per riflettere il logout senza attendere la revalidazione
        mutate({ isAuthenticated: false, user: undefined }, false);
    } catch (error) {
        console.error("Errore durante il logout:", error);
    }
  };

  return {
    user: data?.user,
    isAuthenticated: data?.isAuthenticated,
    isLoading,
    isError: error,
    logout
  };
} 