"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { exchangeCode } from '@/lib/api';

export default function AuthCallbackPage() {
  const { isAuthenticated, isLoading, user, recheckAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [message, setMessage] = useState("Finalizzazione dell'autenticazione in corso...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Questa funzione viene eseguita solo una volta per scambiare il codice.
    const performExchange = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code || !state) {
        setError("Parametri di autenticazione mancanti. Impossibile procedere.");
        return;
      }

      try {
        await exchangeCode(code, state);
        // Se lo scambio va a buon fine, il backend ha impostato il cookie di sessione.
        // Ora dobbiamo dire alla nostra app di riverificare lo stato di autenticazione.
        await recheckAuth();
      } catch (err) {
        console.error("Errore durante lo scambio del codice:", err);
        setError("Si è verificato un errore durante la comunicazione con il server.");
      }
    };
    
    performExchange();
  }, []); // Eseguire solo una volta al mount

  useEffect(() => {
    // Questo effetto reagisce ai cambiamenti di stato (isLoading, isAuthenticated)
    // causati da recheckAuth.
    if (isLoading) {
      setMessage("Verifica in corso...");
      return;
    }

    if (error) {
      setMessage(`Autenticazione fallita: ${error}`);
      setTimeout(() => router.push('/'), 5000);
      return;
    }

    if (isAuthenticated && user) {
      setMessage(`Autenticazione riuscita! Ciao, ${user.display_name}. Verrai reindirizzato a breve...`);
      setTimeout(() => {
        router.push('/'); // Reindirizza alla homepage
      }, 3000);
    } else if (!isLoading) {
      // Se non stiamo più caricando ma non siamo autenticati, qualcosa è andato storto.
      setMessage("Autenticazione fallita. Non è stato possibile verificare la tua identità.");
      setTimeout(() => router.push('/'), 5000);
    }
  }, [isAuthenticated, isLoading, user, router, error]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'black',
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '20px',
      textAlign: 'center',
      padding: '20px'
    }}>
      <p>{message}</p>
    </div>
  );
}
