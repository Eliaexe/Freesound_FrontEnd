"use client";

import { useAuth } from '@/components/providers/AuthProvider';
import { useView } from '@/app/contexts/ViewContext';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function LoginView() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const { navigateToHome } = useView();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigateToHome();
    }
  }, [isAuthenticated, isLoading, navigateToHome]);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5501/auth/login');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-foreground">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-4">
      <h1 className="text-4xl font-bold text-foreground">Freesound</h1>
      <Button 
        onClick={handleLogin}
        className="px-8 py-6 text-lg"
      >
        Accedi con Spotify
      </Button>
    </div>
  );
}
