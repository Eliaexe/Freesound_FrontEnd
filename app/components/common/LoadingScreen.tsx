import { Music, Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <Music className="w-10 h-10 text-white animate-pulse" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
          <span className="text-white text-lg font-semibold">Loading Freesound...</span>
        </div>
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-white/60 rounded-full w-full animate-pulse" />
        </div>
      </div>
    </div>
  )
} 