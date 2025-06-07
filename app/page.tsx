"use client"

import { useAuth } from '@/components/providers/AuthProvider';
import { Dashboard } from '@/app/components/views/ViewRenderer';
import { useView } from '@/app/contexts/ViewContext';
import { useEffect } from 'react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { currentView, navigateToHome, navigateToLogin } = useView();

  useEffect(() => {
    // Gestisce la navigazione basata sullo stato di autenticazione
    if (!isLoading) {
      if (isAuthenticated && currentView.type === 'login') {
        // Se l'utente si è autenticato dalla LoginView, vai alla HomeView
        navigateToHome();
      } else if (!isAuthenticated && currentView.type !== 'login') {
        // Se l'utente non è autenticato e non è nella LoginView, vai alla LoginView
        navigateToLogin();
      }
    }
  }, [isAuthenticated, isLoading, currentView.type, navigateToHome, navigateToLogin]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-black text-white">
        <p className="text-center">Caricamento in corso...</p>
      </div>
    );
  }

  return <Dashboard />;
}
