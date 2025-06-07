"use client";

import { useView } from '@/app/contexts/ViewContext';
import HomeView from './HomeView';
import { SearchView } from './SearchView';
import { ArtistView } from './ArtistView';
import { AlbumView } from './AlbumView';
import LoginView from '../login/login';
import { useState } from 'react';
import { Header } from '@/app/components/layout/Header';
import { Sidebar } from '../layout/Sidebar';
import { Player } from '@/app/components/player/Player';
import { PlaylistView } from '@/app/components/player/PlaylistView';
export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-row h-full overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          <ViewRenderer />
        </main>
      </div>
      <Player />
    </div>
  );
}

function ViewRenderer() {
  const { currentView } = useView();

  switch (currentView.type) {
    case 'home':
      return <HomeView />;
    case 'search':
      return <SearchView searchData={currentView.data} />;
    case 'artist':
      return <ArtistView artistId={currentView.data.artistId} />;
    case 'album':
      return <AlbumView albumId={currentView.data.albumId} />;
    case 'playlist':
      return <div className="p-4 lg:p-8">Playlist View (Work In Progress)</div>;
    case 'login':
      return <LoginView />;
    default:
      return <HomeView />;
  }
}
