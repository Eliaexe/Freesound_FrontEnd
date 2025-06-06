// Tipi per la navigazione tra schermate
export type ViewType = 'home' | 'search' | 'artist' | 'album';

export interface CurrentView {
  type: ViewType;
  data?: any;
}

// Interfaces per playlist e album
export interface PlaylistItem {
  id: string
  name: string
  time: string
  color: string
}

export interface BaseAlbum {
  id: string
  title: string
  artist: string
  color: string
}

export interface EmojiAlbum extends BaseAlbum {
  iconType: "emoji"
  iconValue: string
}

export interface TextAlbum extends BaseAlbum {
  iconType: "text"
  iconValue: { main: string; sub: string; detail: string }
}

export type Album = EmojiAlbum | TextAlbum 