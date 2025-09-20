"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export interface Event {
  name: string;
  image: string;
}

interface UpcomingEventsProps {
  events: Event[];
  selectedEventName?: string | null;
}

export function UpcomingEvents({
  events,
  selectedEventName,
}: UpcomingEventsProps) {
  // Find the event that matches the selectedEventName, or use the first event as default
  const initialEvent = selectedEventName
    ? events.find((event) => event.name === selectedEventName) || events[0]
    : events[0];

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(
    initialEvent,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Update selectedEvent when selectedEventName changes
  useEffect(() => {
    if (selectedEventName) {
      const event = events.find((event) => event.name === selectedEventName);
      if (event) {
        setSelectedEvent(event);
      }
    }
  }, [selectedEventName, events]);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setIsDropdownOpen(false);
  };

  if (events.length === 0) return null;

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
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </Button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
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
                        <div className="font-medium text-gray-800">
                          {event.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Event poster display - only the image, no headings or descriptions */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedEvent && (
            <motion.div
              key={selectedEvent.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <div className="relative w-full h-full">
                <Image
                  src={selectedEvent.image || "/placeholder.svg"}
                  alt={selectedEvent.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
