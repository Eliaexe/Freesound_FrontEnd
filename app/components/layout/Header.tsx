"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="flex items-center justify-between px-4 lg:px-8 py-3 bg-background/80 backdrop-blur-sm border-b border-border flex-shrink-0 h-16">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
          aria-label="Apri menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
        {shouldShowBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={navigateToHome}
            aria-label="Indietro"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="hidden lg:flex" aria-label="Navigazione fittizia">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        {getTopBarTitle() && (
          <h2 className="text-lg font-semibold text-foreground hidden sm:block">{getTopBarTitle()}</h2>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm md:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cerca brani, artisti..."
              className="w-full pl-10 pr-10"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              disabled={isSearching}
            />
            {searchQuery && !isSearching && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
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