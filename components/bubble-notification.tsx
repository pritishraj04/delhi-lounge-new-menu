"use client"

import { useState, useEffect } from "react"

interface BubbleNotificationProps {
  message: string
  duration?: number
}

export function BubbleNotification({ message, duration = 3000 }: BubbleNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300) // Match the CSS transition duration
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!shouldRender) return null

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-full text-sm z-50 shadow-lg transition-all duration-300 ease-spring ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-80"
      }`}
    >
      {message}
    </div>
  )
}
