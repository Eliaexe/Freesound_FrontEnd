import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Freesound - Music Streaming',
    short_name: 'Freesound',
    description: 'Ascolta musica gratis con Freesound - La tua esperienza musicale definitiva',
    start_url: '/',
    display: 'standalone',
    background_color: '#f97316',
    theme_color: '#f97316',
    categories: ['music', 'entertainment'],
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/screenshot1.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ]
  }
}