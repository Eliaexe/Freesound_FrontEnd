"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Search, Menu, ChevronLeft, ArrowLeft, X } from "lucide-react";
import { useView } from '@/app/contexts/ViewContext';
import * as api from "@/app/actions/api";
import { UserNav } from '@/components/common/UserNav';

interface HeaderProps {
  onToggleSidebar: () => void;
  // Potremmo passare altri dati se necessario
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { currentView, navigateTo, navigateToHome } = useView();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await api.searchTracks(searchQuery);
      navigateTo({ type: 'search', data: { results, query: searchQuery } });
    } catch (error) {
      console.error("Search error:", error);
      navigateTo({ type: 'search', data: { error, query: searchQuery } });
    } finally {
      setIsSearching(false);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    navigateToHome();
  };

  const getTopBarTitle = () => {
    switch (currentView.type) {
      case 'artist': return 'Artista';
      case 'album': return 'Album';
      case 'playlist': return 'Playlist';
      case 'search': return 'Risultati Ricerca';
      default: return '';
    }
  };

  const shouldShowBackButton = currentView.type !== 'home';

  return (
    <div className="flex items-center justify-between px-4 lg:px-8 py-4 lg:py-6 bg-black/20 backdrop-blur-xl border-b border-white/10 flex-shrink-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-full bg-white/10 lg:hidden"
          onClick={onToggleSidebar}
          aria-label="Apri menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
        {shouldShowBackButton ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-full bg-white/10"
            onClick={navigateToHome}
            aria-label="Indietro"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full bg-white/10 hidden lg:flex" aria-label="Navigazione">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        {getTopBarTitle() && (
          <h2 className="text-lg font-semibold text-white hidden sm:block">{getTopBarTitle()}</h2>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm md:max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/50" />
            <input
              type="search"
              placeholder="Cerca brani, artisti..."
              className="w-full h-9 md:h-10 pl-9 md:pl-10 pr-10 py-2 bg-white/10 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full p-0 text-white/70 hover:text-white"
                onClick={clearSearch}
                aria-label="Cancella ricerca"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
        <UserNav />
      </div>
    </div>
  );
} 