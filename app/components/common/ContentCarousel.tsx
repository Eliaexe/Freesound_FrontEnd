"use client";

import { Play, Music } from 'lucide-react';
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
  if(item.type === 'album') cardDescription = item.artist;

  const getImageUrl = (item: SearchResultItem): string | undefined => {
    if (item.type === 'artist' && item.images && item.images.length > 0) {
      return item.images[0].url;
    }
    if ('image' in item) {
      return item.image;
    }
    return undefined;
  };

  const imageUrl = getImageUrl(item);

  const handleGeneralClick = () => {
    if(onClick) onClick(item);
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(isPlayable) onPlay(item as SpotifyTrack);
  }

  console.log('item', item);

  return (
    <div
      className="group relative w-40 flex-shrink-0 cursor-pointer md:w-48"
      onClick={handleGeneralClick}
    >
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-black/50 shadow-lg transition-shadow duration-300 group-hover:shadow-orange-500/30">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={cardTitle}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Music className="w-1/2 h-1/2 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
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
  items: SearchResultItem[];
  onItemClick: (item: SearchResultItem) => void;
}

export function ContentCarousel({ title, items, onItemClick }: ContentCarouselProps) {
  const getImageUrl = (item: SearchResultItem): string | undefined => {
    if (item.type === 'artist' && item.images && item.images.length > 0) {
      return item.images[0].url;
    }
    if ('image' in item) {
      return item.image;
    }
    return undefined;
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <h2 className="text-xl font-bold text-foreground px-2">{title}</h2>
      <div className="flex space-x-4 md:space-x-6 overflow-x-auto pb-4">
        {items.map((item, index) => {
          const imageUrl = getImageUrl(item);
          return (
            <div 
              key={`${item.spotify_id}-${index}`} 
              className="w-40 flex-shrink-0 md:w-48 space-y-2 cursor-pointer"
              onClick={() => onItemClick(item)}
            >
              <div className="aspect-square w-full rounded-xl bg-muted relative overflow-hidden">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Music className="w-1/2 h-1/2 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                {item.type === 'track' && (
                  <p className="text-sm text-muted-foreground truncate">{item.artist}</p>
                )}
                 {item.type === 'album' && (
                  <p className="text-sm text-muted-foreground truncate">{item.artist}</p>
                )}
                {item.type === 'artist' && item.genres?.[0] && (
                  <p className="text-xs text-muted-foreground truncate capitalize">{item.genres[0]}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
} 