const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5501';

// Definizione del tipo User per coerenza
// Assicurati che corrisponda alla struttura dati ritornata da /api/me
export interface User {
  display_name: string;
  email: string;
  id: string;
  images: { url: string }[];
  // Aggiungi altri campi se necessario
}

// Un wrapper per le chiamate fetch per gestire errori e credenziali
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    // IMPORTANTE: Invia sempre i cookie di sessione
    credentials: 'include',
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      // ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Errore di rete o risposta non JSON' }));
    console.error(`Errore API per ${endpoint}:`, errorData);
    throw new Error(errorData.message || `Errore ${response.status}`);
  }

  // Se la risposta è 204 No Content, ritorna null invece di tentare il parsing
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Funzione per effettuare il login
export async function login(): Promise<string> {
  console.log('login');
  const data = await fetchApi('/auth/url');
  console.log('data', data);
  return data.url;
}

// Funzione per effettuare il logout
export async function logout() {
  // Il backend distrugge la sessione e pulisce il cookie httpOnly
  await fetchApi('/auth/logout', { method: 'POST' });
}

// Funzione per scambiare il codice di autorizzazione con i token di sessione
export async function exchangeCode(code: string, state: string): Promise<{ success: boolean; user: User }> {
  return fetchApi('/auth/exchange', {
    method: 'POST',
    body: JSON.stringify({ code, state }),
  });
}

// Funzione per ottenere i dati dell'utente loggato
export async function getMe(): Promise<User> {
  return fetchApi('/api/me');
} 