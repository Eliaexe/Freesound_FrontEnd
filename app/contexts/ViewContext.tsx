"use client";

import { createContext, useState, useContext, ReactNode } from 'react';

// Tipi
export type ViewType = 'home' | 'search' | 'artist' | 'album' | 'playlist' | 'login';

export interface View {
  type: ViewType;
  data?: any; // Dati specifici per la vista (es. artistId)
}

interface ViewContextType {
  currentView: View;
  navigateTo: (view: View) => void;
  navigateToHome: () => void;
  navigateToArtist: (artistId: string) => void;
  navigateToAlbum: (albumId: string) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<View>({ type: 'home' });

  const navigateTo = (view: View) => {
    setCurrentView(view);
  };

  const navigateToHome = () => {
    setCurrentView({ type: 'home' });
  };

  const navigateToArtist = (artistId: string) => {
    setCurrentView({ type: 'artist', data: { artistId } });
  };
    
  const navigateToAlbum = (albumId: string) => {
    setCurrentView({ type: 'album', data: { albumId } });
  };

  const navigateToLogin = () => {
    setCurrentView({ type: 'login' });
  };

  const value = {
    currentView,
    navigateTo,
    navigateToHome,
    navigateToArtist,
    navigateToAlbum,
    navigateToLogin
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}; 