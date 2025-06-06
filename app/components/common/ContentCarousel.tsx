"use client";

import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpotifyTrack, SpotifyArtist, SpotifyPlaylistResult, SpotifyAlbum, SearchResultItem } from '@/app/actions/api';

type ContentItem = SearchResultItem;

interface ContentCardProps {
  item: ContentItem;
  onPlay?: (item: SpotifyTrack) => void;
  onClick?: (item: ContentItem) => void;
}

export function ContentCard({ item, onPlay, onClick }: ContentCardProps) {
  const isPlayable = item.type === 'track' && onPlay;
  const cardTitle = item.name;
  let cardDescription = '';
  if(item.type === 'track') cardDescription = item.artist;
  if(item.type === 'artist') cardDescription = 'Artista';
  if(item.type === 'playlist') cardDescription = item.description || `Di ${item.owner}`;

  const handleGeneralClick = () => {
    if(onClick) onClick(item);
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(isPlayable) onPlay(item as SpotifyTrack);
  }

  return (
    <div
      className="group relative w-40 flex-shrink-0 cursor-pointer md:w-48"
      onClick={handleGeneralClick}
    >
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-black/50 shadow-lg transition-shadow duration-300 group-hover:shadow-orange-500/30">
        <img
          src={item.image || '/placeholder.svg'}
          alt={cardTitle}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isPlayable && (
            <div 
                className="absolute bottom-2 right-2 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-orange-500 text-white opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                onClick={handlePlayClick}
            >
                <Play className="ml-1 h-6 w-6" />
            </div>
        )}
      </div>
      <div className="mt-2 md:mt-3">
        <h4 className="truncate font-semibold text-white text-sm md:text-base">{cardTitle}</h4>
        <p className="truncate text-xs text-white/70 md:text-sm">{cardDescription}</p>
      </div>
    </div>
  );
}

interface ContentCarouselProps {
  title: string;
  items: ContentItem[];
  onItemPlay?: (item: SpotifyTrack) => void;
  onItemClick?: (item: ContentItem) => void;
}

export function ContentCarousel({ title, items, onItemPlay, onItemClick }: ContentCarouselProps) {
  return (
    <div className="space-y-3 md:space-y-4 overflow-x-scroll ">
      <h2 className="text-xl md:text-2xl font-bold text-white px-4 md:px-0">{title}</h2>
      <div className="flex space-x-4 md:space-x-6 overflow-x-scroll pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent md:mx-0 md:px-0">
        {items.map((item) => (
          <ContentCard 
            key={item.spotify_id} 
            item={item} 
            onPlay={onItemPlay}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
} 