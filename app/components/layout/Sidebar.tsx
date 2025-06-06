import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HomeIcon,
  ListMusic,
  Music,
  X,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col bg-black/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:w-72`}
    >
      <div className="flex-shrink-0">
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4">
          <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 rounded-full" aria-label="Chiudi sidebar">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Header */}
        <div className="p-6 lg:p-8 pb-6">
          <div className="flex items-center gap-3 mb-8 lg:mb-12">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold text-white">Freesound</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-6 lg:px-8">
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-400 mb-4 tracking-wide">Browse</h3>
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-white bg-white/10 h-12 px-4 rounded-xl">
              <HomeIcon className="w-5 h-5 mr-4" />
              Home
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 h-12 px-4 rounded-xl"
            >
              <ListMusic className="w-5 h-5 mr-4" /> 
              My Tracks (Placeholder)
            </Button>
          </nav>
        </div>
      </ScrollArea>

      {/* User Profile Footer */}
      <div className="p-6 lg:p-8 border-t border-white/10 bg-black/20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-orange-500 text-white font-semibold">ST</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">Sound Traveler</p>
            <p className="text-gray-400 text-xs truncate">Premium User</p>
          </div>
        </div>
      </div>
    </div>
  )
} 