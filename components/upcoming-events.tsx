"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export interface Event {
  name: string
  image: string
}

interface UpcomingEventsProps {
  events: Event[]
  selectedEventName?: string | null
}

export function UpcomingEvents({ events, selectedEventName }: UpcomingEventsProps) {
  // Find the event that matches the selectedEventName, or use the first event as default
  const initialEvent = selectedEventName
    ? events.find((event) => event.name === selectedEventName) || events[0]
    : events[0]

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(initialEvent)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showDropdownOverlay, setShowDropdownOverlay] = useState(false)
  const [showDropdownContent, setShowDropdownContent] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [displayedEvent, setDisplayedEvent] = useState<Event | null>(selectedEvent)

  // Update selectedEvent when selectedEventName changes
  useEffect(() => {
    if (selectedEventName) {
      const event = events.find((event) => event.name === selectedEventName)
      if (event) {
        setSelectedEvent(event)
      }
    }
  }, [selectedEventName, events])

  // Handle dropdown visibility
  useEffect(() => {
    if (isDropdownOpen) {
      setShowDropdownOverlay(true)
      setTimeout(() => setShowDropdownContent(true), 50)
    } else {
      setShowDropdownContent(false)
      setTimeout(() => setShowDropdownOverlay(false), 300)
    }
  }, [isDropdownOpen])

  // Handle event transition
  useEffect(() => {
    if (selectedEvent !== displayedEvent) {
      setTransitioning(true)
      setTimeout(() => {
        setDisplayedEvent(selectedEvent)
        setTimeout(() => {
          setTransitioning(false)
        }, 50)
      }, 300)
    }
  }, [selectedEvent, displayedEvent])

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event)
    setIsDropdownOpen(false)
  }

  if (events.length === 0) return null

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#f9f7f3]">
      {/* Event selector dropdown */}
      <div className="relative z-10">
        <div className="bg-white shadow-md p-4">
          <Button
            variant="outline"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full justify-between border-gray-300 text-gray-800"
          >
            <span>{selectedEvent?.name || "Select an event"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </Button>

          {showDropdownOverlay && (
            <>
              <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-200 ${
                  showDropdownContent ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => setIsDropdownOpen(false)}
              />

              <div
                className={`absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto transition-all duration-300 ease-out ${
                  showDropdownContent ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-10 scale-95"
                }`}
              >
                <div className="p-1">
                  {events.map((event, index) => (
                    <div
                      key={index}
                      className={`p-3 hover:bg-gray-50 cursor-pointer rounded-md ${
                        selectedEvent?.name === event.name ? "bg-gray-50" : ""
                      }`}
                      onClick={() => handleEventSelect(event)}
                    >
                      <div className="font-medium text-gray-800">{event.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Event poster display - only the image, no headings or descriptions */}
      <div className="flex-1 overflow-hidden">
        {displayedEvent && (
          <div
            className={`h-full w-full transition-opacity duration-300 ${transitioning ? "opacity-0" : "opacity-100"}`}
          >
            <div className="relative w-full h-full">
              <Image
                src={displayedEvent.image || "/placeholder.svg?height=600&width=800"}
                alt={displayedEvent.name}
                fill
                className="object-contain"
                priority
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const imgElement = e.currentTarget as HTMLImageElement
                  imgElement.src = "/placeholder.svg?height=600&width=800"
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
