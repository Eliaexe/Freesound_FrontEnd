"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  ChevronLeft,
  Music,
  Menu,
  X,
  Loader2,
  ListMusic,
  ArrowLeft,
} from "lucide-react"
import { PlayerProvider } from '@/app/contexts/PlayerContext';
import { ViewProvider } from '@/app/contexts/ViewContext';
import { Sidebar } from '@/app/components/layout/Sidebar';
import { Header } from '@/app/components/layout/Header';
import { Player } from '@/app/components/player/Player';
import { ViewRenderer } from '@/app/components/views/ViewRenderer';
import { LoadingScreen } from './components/common/LoadingScreen';

import * as api from "./actions/api"
import { CurrentView, ViewType } from "./types"
import { formatTime } from "./utils/formatters"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <PlayerProvider>
      <ViewProvider>
        <div className="h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 text-white flex flex-col overflow-hidden">
          
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          <div className="flex flex-1 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              <Header onToggleSidebar={() => setSidebarOpen(v => !v)} />
              
              <ScrollArea className="flex-1 overflow-hidden">
                <ViewRenderer />
              </ScrollArea>
            </div>
          </div>
          
          <Player />

        </div>
      </ViewProvider>
    </PlayerProvider>
  );
}
