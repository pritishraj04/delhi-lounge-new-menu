"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if device is iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if app is already installed (standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
    setIsStandalone(standalone)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Hide prompt after app is installed
    const handleAppInstalled = () => {
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
      }
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Hide for this session
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem("pwa-install-dismissed", "true")
    }
  }

  // Don't show if already installed, dismissed this session, or no prompt available
  const isDismissed = typeof window !== "undefined" && window.sessionStorage && window.sessionStorage.getItem("pwa-install-dismissed")
  if (isStandalone || isDismissed || (!showInstallPrompt && !isIOS)) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#8B0000] rounded-lg flex items-center justify-center mr-3">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Install Delhi Lounge</h3>
              <p className="text-sm text-gray-600">
                {isIOS ? "Add to Home Screen for quick access" : "Install app for better experience"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isIOS ? (
          <div className="text-sm text-gray-600 mb-3">
            <p>To install this app on your iOS device:</p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Tap the Share button in Safari</li>
              <li>Select "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </ol>
          </div>
        ) : (
          <Button
            onClick={handleInstallClick}
            className="w-full bg-[#8B0000] hover:bg-[#a02020] text-white"
            disabled={!deferredPrompt}
          >
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button>
        )}
      </div>
    </div>
  )
}
