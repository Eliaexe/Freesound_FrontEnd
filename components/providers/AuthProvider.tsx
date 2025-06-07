'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, getMe, getLoginUrl, logoutUser } from '@/app/actions/api';

// Definiamo la forma del nostro contesto
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  recheckAuth: () => Promise<void>;
}

// Creiamo il contesto con un valore di default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Definiamo le props per il nostro Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserStatus = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      console.log('Nessuna sessione utente trovata, utente non loggato.');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const login = () => {
    window.location.href = getLoginUrl();
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const recheckAuth = async () => {
    setIsLoading(true);
    await checkUserStatus();
  };

  // I valori che vogliamo rendere disponibili a tutta l'app
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    recheckAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Infine, creiamo un hook custom per usare facilmente il nostro contesto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 