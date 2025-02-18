"use client"

import { useState, useEffect, useRef } from "react"
import { Menu } from "@/components/menu"
import { Playfair_Display } from "next/font/google"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { FullScreenToggle } from "@/components/full-screen-toggle"
import { BubbleNotification } from "@/components/bubble-notification"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

const DynamicBarMenu = dynamic(() => import("@/components/bar-menu").then((mod) => mod.BarMenu), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

export default function Page() {
  const [activeMenu, setActiveMenu] = useState<"food" | "bar" | "events">("food")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [drinkItems, setDrinkItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const { menuItems } = await import("@/components/menu")
        setMenuItems(menuItems)
      } catch (error) {
        console.error("Error loading menu items:", error)
      }
    }

    const loadDrinkItems = async () => {
      try {
        const { drinkItems } = await import("@/components/bar-menu")
        setDrinkItems(drinkItems)
      } catch (error) {
        console.error("Error loading drink items:", error)
      }
    }

    loadMenuItems()
    loadDrinkItems()
  }, [])

  useEffect(() => {
    if (searchQuery.length > 1) {
      const foodResults = menuItems
        .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((item) => ({ ...item, type: "Food Menu" }))

      const drinkResults = drinkItems
        .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((item) => ({ ...item, type: "Bar Menu" }))

      setSearchResults([...foodResults, ...drinkResults])
    } else {
      setSearchResults([])
    }
  }, [searchQuery, menuItems, drinkItems])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearchItemClick = (item) => {
    setActiveMenu(item.type === "Food Menu" ? "food" : "bar")
    setSearchQuery("")
    setSearchResults([])
    setSelectedItem(item)
    setIsSearchOpen(false)
    setNotificationMessage(`Selected "${item.name}" from ${item.type}`)

    // Scroll to the selected item
    const itemElement = document.getElementById(`menu-item-${item.id}`)
    if (itemElement) {
      itemElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  useEffect(() => {
    if (menuItems.length > 0 && !selectedItem) {
      setSelectedItem(menuItems[0])
    }
  }, [menuItems, selectedItem])

  return (
    <main className={`h-[100dvh] flex flex-col bg-[#f9f7f3] ${playfair.variable} font-sans overflow-hidden`}>
      <header className="flex items-center justify-between p-4 border-b border-[#e0d9c8]">
        <div className="flex items-center gap-4 overflow-x-auto">
          <h1 className="text-2xl font-playfair font-medium text-[#2c2c2c] whitespace-nowrap">The Delhi Lounge</h1>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className={`text-sm whitespace-nowrap ${activeMenu === "food" ? "text-[#ffd700] font-semibold" : "text-[#7c7c7c]"}`}
              onClick={() => setActiveMenu("food")}
            >
              Food Menu
            </Button>
            <Button
              variant="ghost"
              className={`text-sm whitespace-nowrap ${activeMenu === "bar" ? "text-[#ffd700] font-semibold" : "text-[#7c7c7c]"}`}
              onClick={() => setActiveMenu("bar")}
            >
              Bar Menu
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              className={`text-sm whitespace-nowrap relative ${activeMenu === "events" ? "text-[#ffd700] font-semibold" : "text-[#7c7c7c]"}`}
              onClick={() => setActiveMenu("events")}
            >
              Upcoming Events
              <span className="absolute inset-0 border border-[#ffd700] rounded-md gold-shine"></span>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 relative" ref={searchRef}>
          <AnimatePresence>
            {isSearchOpen && (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "200px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                type="text"
                placeholder="Search menu..."
                className="border-b border-[#e0d9c8] bg-transparent text-sm p-1 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
          </AnimatePresence>
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5 text-[#7c7c7c]" />
          </Button>
          <AnimatePresence>
            {isSearchOpen && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg mt-1 max-h-60 overflow-y-auto z-50"
              >
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSearchItemClick(item)}
                  >
                    <div>{item.name}</div>
                    <div className="text-sm text-gray-500">{item.type}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      {activeMenu === "food" && (
        <Menu selectedItem={selectedItem} setSelectedItem={setSelectedItem} menuItems={menuItems} />
      )}
      {activeMenu === "bar" && <DynamicBarMenu selectedItem={selectedItem} setSelectedItem={setSelectedItem} />}
      {activeMenu === "events" && (
        <div className="flex-1 flex items-center justify-center text-2xl text-[#7c7c7c]">
          Upcoming Events Coming Soon
        </div>
      )}
      <footer className="p-4 text-center">
        <p className="text-sm text-gray-500 italic">A gratuity of 18% will be added for parties of 5 or more.</p>
      </footer>
      <FullScreenToggle />
      {notificationMessage && <BubbleNotification message={notificationMessage} />}
    </main>
  )
}

