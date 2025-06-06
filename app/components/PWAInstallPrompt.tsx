'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowPrompt(true)
    })

    // Controlla se l'app è già installata
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false)
      setInstallPrompt(null)
    })
  }, [])

  const installPWA = () => {
    if(installPrompt) {
      installPrompt.prompt()
      installPrompt.userChoice.then((choice: any) => {
        if(choice.outcome === 'accepted') {
          console.log('User ha installato la PWA')
        }
        setShowPrompt(false)
        setInstallPrompt(null)
      })
    }
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 lg:bottom-4 lg:left-auto lg:right-4 lg:w-80 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl z-50">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm mb-1">
            Installa Freesound
          </h3>
          <p className="text-white/70 text-xs mb-3">
            Installa l'app per un'esperienza musicale migliore e l'accesso offline
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={installPWA}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 h-7"
            >
              Installa
            </Button>
            <Button 
              onClick={dismissPrompt}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white text-xs px-3 py-1 h-7"
            >
              Non ora
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 