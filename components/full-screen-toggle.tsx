"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"

export function FullScreenToggle() {
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange)
  }, [])

  const toggleFullScreen = () => {
    const elem = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void
      mozRequestFullScreen?: () => Promise<void> | void
      msRequestFullscreen?: () => Promise<void> | void
    }
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void> | void
      mozCancelFullScreen?: () => Promise<void> | void
      msExitFullscreen?: () => Promise<void> | void
    }
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch?.((err: any) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`)
        })
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen()
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen()
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen()
      } else {
        console.error('Fullscreen API is not supported')
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen()
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen()
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen()
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen()
      } else {
        console.error('Fullscreen API is not supported')
      }
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="fixed bottom-4 left-4">
      {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
    </Button>
  )
}

