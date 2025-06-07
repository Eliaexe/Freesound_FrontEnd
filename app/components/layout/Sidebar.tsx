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
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background border-r border-border transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}
    >
      <div className="flex-shrink-0">
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4">
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Chiudi sidebar">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Header */}
        <div className="p-6 lg:p-8 pb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">Freesound</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-6 lg:px-8">
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 tracking-wide">Browse</h3>
          <nav className="space-y-1">
            <Button variant="secondary" className="w-full justify-start h-11 px-3">
              <HomeIcon className="w-5 h-5 mr-3" />
              Home
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start h-11 px-3 text-muted-foreground"
            >
              <ListMusic className="w-5 h-5 mr-3" /> 
              My Tracks (WIP)
            </Button>
          </nav>
        </div>
      </ScrollArea>

      {/* User Profile Footer */}
      <div className="p-6 lg:p-8 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">ST</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-medium text-sm truncate">Sound Traveler</p>
            <p className="text-muted-foreground text-xs truncate">Premium User</p>
          </div>
        </div>
      </div>
    </div>
  )
} 