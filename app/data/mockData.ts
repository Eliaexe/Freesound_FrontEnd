import { SpotifyTrack, SpotifyArtist, SpotifyPlaylistResult, SpotifyAlbum } from '@/app/actions/api';

export const mockPlaylists: SpotifyPlaylistResult[] = [
  {
    spotify_id: '37i9dQZF1DXcBWIGoYBM5M',
    name: 'Today\'s Top Hits',
    description: 'The biggest songs of the moment.',
    image: 'https://i.scdn.co/image/ab67706f00000003b86133f8016422538c20b3dc',
    type: 'playlist',
    owner: 'Spotify',
    tracks_total: 50,
    relevance: 100
  },
  {
    spotify_id: '37i9dQZF1DX0XUfTFmNBRM',
    name: 'RapCaviar',
    description: 'New music from Post Malone, Gunna and Moneybagg Yo.',
    image: 'https://i.scdn.co/image/ab67706f00000003f4e64f8c8375e4776b297129',
    type: 'playlist',
    owner: 'Spotify',
    tracks_total: 50,
    relevance: 98
  },
  {
    spotify_id: '37i9dQZF1DX1lVhptIYRda',
    name: 'Viva Latino',
    description: 'The hottest Latin hits of the moment!',
    image: 'https://i.scdn.co/image/ab67706f00000003e3391d1a3c77d27e795f4699',
    type: 'playlist',
    owner: 'Spotify',
    tracks_total: 50,
    relevance: 95
  },
  {
    spotify_id: '37i9dQZF1DX4sWSpwq3LiO',
    name: 'Peaceful Piano',
    description: 'Relax and indulge with beautiful piano pieces',
    image: 'https://i.scdn.co/image/ab67706f00000003d6d2b696f17f41e0166297a1',
    type: 'playlist',
    owner: 'Spotify',
    tracks_total: 300,
    relevance: 90
  },
];

export const mockTracks: SpotifyTrack[] = [
  {
    spotify_id: '4iV5W9uYEdYUVa79Axb7Rh',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200000,
    image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'
  },
  {
    spotify_id: '7qiZfU4dY1lWllzX7mP3wj',
    name: 'As It Was',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    duration: 167000,
    image: 'https://i.scdn.co/image/ab67616d0000b273b46f740976543e3337b38426'
  },
  {
    spotify_id: '1Iq8oo9XkmmvCQiGOfORsE',
    name: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    album: 'F*CK LOVE 3: OVER YOU',
    duration: 141000,
    image: 'https://i.scdn.co/image/ab67616d0000b27341e31d6ea1d463360b359a19'
  },
];

export const mockArtists: SpotifyArtist[] = [
  {
    spotify_id: '6eUKZXaKkcviH0Ku9w2n3V',
    name: 'Ed Sheeran',
    image: 'https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a32ed6c',
    type: 'artist',
    genres: ['pop', 'singer-songwriter'],
    followers: 100000000,
    popularity: 95,
    relevance: 98
  },
  {
    spotify_id: '4oUHIQIBehM8Vg2wOKfGIm',
    name: 'Billie Eilish',
    image: 'https://i.scdn.co/image/ab6761610000e5eb3e68376918501615d62534c0',
    type: 'artist',
    genres: ['pop', 'electropop'],
    followers: 80000000,
    popularity: 92,
    relevance: 96
  },
  {
    spotify_id: '1uNFoZAHvoGpw090APEVWk',
    name: 'Post Malone',
    image: 'https://i.scdn.co/image/ab6761610000e5eb119293f2f09ef544c9b8f2b8',
    type: 'artist',
    genres: ['hip hop', 'pop rap'],
    followers: 60000000,
    popularity: 90,
    relevance: 94
  },
];

export const mockAlbums: SpotifyAlbum[] = [
  {
    spotify_id: '4aawyAB9vmqN3uQ7FjRGTy',
    name: 'After Hours',
    artist: 'The Weeknd',
    image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    type: 'album',
    release_date: '2020-03-20',
    total_tracks: 14,
    relevance: 99
  },
  {
    spotify_id: '7f6xPqyaolTiziKf5R5Z0c',
    name: 'SOUR',
    artist: 'Olivia Rodrigo',
    image: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a',
    type: 'album',
    release_date: '2021-05-21',
    total_tracks: 11,
    relevance: 97
  },
  {
    spotify_id: '2RdwB7b6joQ28eG1g21gpB',
    name: 'Montero',
    artist: 'Lil Nas X',
    image: 'https://i.scdn.co/image/ab67616d0000b273be8267331cb6da44d6a578a9',
    type: 'album',
    release_date: '2021-09-17',
    total_tracks: 15,
    relevance: 96
  }
]; 