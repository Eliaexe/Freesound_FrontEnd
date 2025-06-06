# Freesound Frontend

## Struttura del Progetto

```
frontend/app/
├── actions/              # API e azioni del server
│   └── api.ts           # Client API per backend
├── components/          # Componenti React organizzati
│   ├── ui/             # Componenti UI di base (shadcn/ui)
│   ├── common/         # Componenti comuni riutilizzabili
│   │   └── LoadingScreen.tsx
│   ├── layout/         # Componenti di layout
│   │   └── Sidebar.tsx
│   ├── search/         # Componenti per la ricerca
│   │   └── SearchResultsView.tsx
│   ├── details/        # Componenti per visualizzazione dettagli
│   │   ├── ArtistDetailsView.tsx
│   │   └── AlbumDetailsView.tsx
│   ├── player/         # Componenti del player musicale
│   │   └── PlaylistView.tsx
│   └── index.ts        # Export centrali dei componenti
├── types/              # Definizioni TypeScript
│   └── index.ts        # Tipi globali dell'applicazione
├── utils/              # Funzioni di utilità
│   └── formatters.ts   # Formattazione date, durate, etc.
└── page.tsx            # Pagina principale dell'applicazione
```

## Componenti Principali

### Layout
- **Sidebar**: Navigazione laterale con menu e branding

### Common
- **LoadingScreen**: Schermata di caricamento con animazioni

### Search
- **SearchResultsView**: Visualizzazione risultati di ricerca con supporto multi-tipo (tracce, artisti, album, playlist)

### Details
- **ArtistDetailsView**: Pagina dettaglio artista con brani popolari e discografia
- **AlbumDetailsView**: Pagina dettaglio album con lista tracce

### Player
- **PlaylistView**: Vista a schermo intero della playlist corrente con controlli

## Tipi TypeScript

I tipi sono centralizzati in `types/index.ts` e includono:
- Tipi per la navigazione (`ViewType`, `CurrentView`)
- Interfacce per dati musicali (ereditate da `actions/api.ts`)

## Utilità

### Formatters
- `formatDuration`: Formatta durate da millisecondi a formato mm:ss
- `formatTime`: Formatta tempo da secondi a formato mm:ss

## Funzionalità Implementate

1. **Sistema di Playlist Automatiche**: Generazione automatica di playlist basate su raccomandazioni
2. **Navigazione Multi-Vista**: Home, Ricerca, Dettagli Artista/Album
3. **Player Audio Completo**: Controlli play/pause, traccia precedente/successiva, autoplay
4. **Ricerca Avanzata**: Supporto per ricerca di tracce, artisti, album e playlist
5. **UI Responsive**: Ottimizzata per desktop e mobile

## API Integration

Il sistema si interfaccia con il backend tramite `actions/api.ts` che fornisce:
- Autenticazione Spotify
- Ricerca multi-tipo
- Streaming audio
- Gestione playlist
- Raccomandazioni musicali

## Sviluppo

Per estendere l'applicazione:

1. **Nuovi Componenti**: Aggiungili nella cartella appropriata in `components/`
2. **Nuovi Tipi**: Definiscili in `types/index.ts`
3. **Nuove Utilità**: Aggiungile in `utils/`
4. **Export**: Aggiorna `components/index.ts` per nuovi componenti

La struttura modulare facilita la manutenzione e l'estensibilità del codice. 