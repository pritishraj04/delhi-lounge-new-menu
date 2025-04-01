"use client"

import { useState, useEffect, useRef } from "react"
import { Menu } from "@/components/menu"
import { Playfair_Display } from "next/font/google"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Search, MenuIcon, X, Leaf } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { FullScreenToggle } from "@/components/full-screen-toggle"
import { BubbleNotification } from "@/components/bubble-notification"
import { parseFoodMenuCSV, parseBarMenuCSV, convertToMenuItems, convertToBarItems } from "@/utils/csv-parser"
import { AllergenFilter } from "@/components/allergen-filter"
import Image from "next/image"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [veganOnly, setVeganOnly] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [isSearchOverlayVisible, setIsSearchOverlayVisible] = useState(false)

  // Allergen filter state
  const [allAllergens, setAllAllergens] = useState<string[]>([])
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([])
  const [isAllergenFilterOpen, setIsAllergenFilterOpen] = useState(false)

  // Update the initial state handling to ensure selectedItem is properly initialized
  useEffect(() => {
    const loadCSVData = async () => {
      setIsLoading(true)
      try {
        // Load food menu CSV
        const foodMenuResponse = await fetch("/sample-food-menu.csv")
        const foodMenuText = await foodMenuResponse.text()
        const foodItems = parseFoodMenuCSV(foodMenuText)
        const convertedFoodItems = convertToMenuItems(foodItems)

        // Set menu items
        setMenuItems(convertedFoodItems)

        // Load bar menu CSV
        const barMenuResponse = await fetch("/sample-bar-menu.csv")
        const barMenuText = await barMenuResponse.text()
        const barItems = parseBarMenuCSV(barMenuText)
        const convertedBarItems = convertToBarItems(barItems)

        // Set drink items
        setDrinkItems(convertedBarItems)

        // Set initial selected item only if we have items
        if (convertedFoodItems && convertedFoodItems.length > 0) {
          setSelectedItem(convertedFoodItems[0])
        }

        // Extract all unique allergens
        const allergenSet = new Set<string>()
        convertedFoodItems.forEach((item) => {
          if (item.allergens && Array.isArray(item.allergens)) {
            item.allergens.forEach((allergen) => allergenSet.add(allergen))
          }
        })

        const uniqueAllergens = Array.from(allergenSet)
        setAllAllergens(uniqueAllergens)
        setSelectedAllergens(uniqueAllergens) // All allergens selected by default

        // Remove notification on load
        // setNotificationMessage("Menu data loaded successfully")
      } catch (error) {
        console.error("Error loading CSV data:", error)
        setNotificationMessage("Error loading menu data")

        // Fallback to default data
        const loadDefaultData = async () => {
          try {
            const { menuItems: defaultMenuItems } = await import("@/components/menu")
            const { drinkItems: defaultDrinkItems } = await import("@/components/bar-menu")

            if (defaultMenuItems && defaultMenuItems.length > 0) {
              setMenuItems(defaultMenuItems)
              setSelectedItem(defaultMenuItems[0])

              // Extract allergens from default menu items
              const allergenSet = new Set<string>()
              defaultMenuItems.forEach((item) => {
                if (item.allergens && Array.isArray(item.allergens)) {
                  item.allergens.forEach((allergen) => allergenSet.add(allergen))
                }
              })

              const uniqueAllergens = Array.from(allergenSet)
              setAllAllergens(uniqueAllergens)
              setSelectedAllergens(uniqueAllergens)
            }

            if (defaultDrinkItems && defaultDrinkItems.length > 0) {
              setDrinkItems(defaultDrinkItems)
            }
          } catch (fallbackError) {
            console.error("Error loading fallback data:", fallbackError)
          }
        }

        loadDefaultData()
      } finally {
        setIsLoading(false)
      }
    }

    loadCSVData()
  }, [])

  // Update search results when search query changes
  useEffect(() => {
    if (searchQuery.length > 1) {
      // Search in food menu items
      const foodResults = menuItems
        .filter((item) => {
          // Apply vegan filter for food items if veganOnly is true
          if (veganOnly && !item.isVegan) return false

          // Apply allergen filter
          if (
            item.allergens &&
            item.allergens.some(
              (allergen) => !selectedAllergens.includes(allergen) && allergen.toLowerCase() !== "none",
            )
          ) {
            return false
          }

          const nameMatch = item.name?.toLowerCase().includes(searchQuery.toLowerCase())
          const descMatch = item.description?.toLowerCase().includes(searchQuery.toLowerCase())
          const categoryMatch = item.category?.toLowerCase().includes(searchQuery.toLowerCase())
          const subCategoryMatch = item.subCategory?.toLowerCase().includes(searchQuery.toLowerCase())

          return nameMatch || descMatch || categoryMatch || subCategoryMatch
        })
        .map((item) => ({ ...item, type: "Food Menu" }))

      // Search in drink items (no vegan filtering for bar menu)
      const drinkResults = drinkItems
        .filter((item) => {
          const nameMatch = item.name?.toLowerCase().includes(searchQuery.toLowerCase())
          const descMatch = item.description?.toLowerCase().includes(searchQuery.toLowerCase())
          const categoryMatch = item.category?.toLowerCase().includes(searchQuery.toLowerCase())
          const subCategoryMatch = item.subCategory?.toLowerCase().includes(searchQuery.toLowerCase())

          return nameMatch || descMatch || categoryMatch || subCategoryMatch
        })
        .map((item) => ({ ...item, type: "Bar Menu" }))

      setSearchResults([...foodResults, ...drinkResults])
    } else {
      setSearchResults([])
    }
  }, [searchQuery, menuItems, drinkItems, veganOnly, selectedAllergens])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
        setSearchFocused(false)
        setIsSearchOverlayVisible(false)
        setSearchQuery("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close search when allergen filter is opened
  useEffect(() => {
    if (isAllergenFilterOpen && isSearchOpen) {
      setIsSearchOpen(false)
      setSearchFocused(false)
      setIsSearchOverlayVisible(false)
      setSearchQuery("")
    }
  }, [isAllergenFilterOpen, isSearchOpen])

  const handleSearchItemClick = (item) => {
    setActiveMenu(item.type === "Food Menu" ? "food" : "bar")
    setSearchQuery("")
    setSearchResults([])
    setSelectedItem(item)
    setIsSearchOpen(false)
    setSearchFocused(false)
    setIsSearchOverlayVisible(false)
    setNotificationMessage(`Selected "${item.name}" from ${item.type}`)

    // Scroll to the selected item
    const itemElement = document.getElementById(`menu-item-${item.id}`)
    if (itemElement) {
      itemElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <main className={`h-[100dvh] flex flex-col ${playfair.variable} font-sans overflow-hidden`}>
      {/* Header with dark red background */}
      <header className="flex flex-col bg-[#8B0000] text-white">
        {/* Logo section */}
        <div className="flex justify-center items-center py-2">
          <div className="relative h-16 w-48">
            <Image src="/delhi-lounge-logo.png" alt="The Delhi Lounge" fill className="object-contain" priority />
          </div>
        </div>

        {/* Navigation section */}
        <div className="flex items-center justify-between p-3 border-t border-[#a02020]">
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                className={`text-sm whitespace-nowrap text-white hover:text-white hover:bg-[#a02020] ${activeMenu === "food" ? "bg-[#a02020] font-semibold" : ""}`}
                onClick={() => setActiveMenu("food")}
              >
                Food Menu
              </Button>
              <Button
                variant="ghost"
                className={`text-sm whitespace-nowrap text-white hover:text-white hover:bg-[#a02020] ${activeMenu === "bar" ? "bg-[#a02020] font-semibold" : ""}`}
                onClick={() => setActiveMenu("bar")}
              >
                Bar Menu
              </Button>
              <Separator orientation="vertical" className="h-6 bg-[#a02020]" />
              <Button
                variant="ghost"
                className={`text-sm whitespace-nowrap relative text-white hover:text-white hover:bg-[#a02020] ${activeMenu === "events" ? "bg-[#a02020] font-semibold" : ""}`}
                onClick={() => setActiveMenu("events")}
              >
                Upcoming Events
                <span className="absolute inset-0 border border-[#ffd700] rounded-md gold-shine"></span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Always show vegan toggle for food menu on mobile and desktop */}
            {activeMenu === "food" && (
              <div className="flex items-center gap-2 mr-2">
                <button
                  onClick={() => setVeganOnly(!veganOnly)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    veganOnly ? "bg-green-600" : "bg-gray-300"
                  } hover:${veganOnly ? "bg-green-500" : "bg-gray-400"}`}
                >
                  <span
                    className={`${
                      veganOnly ? "translate-x-6 bg-white" : "translate-x-1 bg-white"
                    } inline-block h-4 w-4 rounded-full transition-transform`}
                  />
                </button>
                <span className="text-xs sm:text-sm whitespace-nowrap text-white font-medium">Vegan Only</span>
              </div>
            )}

            {/* Allergen filter for food menu */}
            {activeMenu === "food" && (
              <AllergenFilter
                allergens={allAllergens}
                selectedAllergens={selectedAllergens}
                setSelectedAllergens={setSelectedAllergens}
                isOpen={isAllergenFilterOpen}
                setIsOpen={setIsAllergenFilterOpen}
              />
            )}

            {/* Redesigned search with macOS-style animation */}
            <div className="relative z-50" ref={searchRef}>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0, x: "-50%" }}
                    animate={{ width: "300px", opacity: 1, x: "-50%" }}
                    exit={{ width: 0, opacity: 0, x: "-50%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10"
                  >
                    <input
                      type="text"
                      placeholder="Search menu..."
                      className="w-full border border-gray-200 rounded-lg bg-white/95 backdrop-blur-sm text-sm py-2 px-4 focus:outline-none focus:ring-1 focus:ring-gray-300 shadow-md text-black"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => {
                        setSearchFocused(true)
                        setIsSearchOverlayVisible(true)
                      }}
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (!isAllergenFilterOpen) {
                    setIsSearchOpen(!isSearchOpen)
                    if (!isSearchOpen) {
                      setTimeout(() => {
                        setSearchFocused(true)
                        setIsSearchOverlayVisible(true)
                      }, 300)
                    } else {
                      setSearchFocused(false)
                      setIsSearchOverlayVisible(false)
                      setSearchQuery("")
                    }
                  }
                }}
                className={`text-white hover:text-white ${
                  isAllergenFilterOpen ? "opacity-50 cursor-not-allowed hover:bg-transparent" : "hover:bg-[#a02020]"
                }`}
                disabled={isAllergenFilterOpen}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-white hover:bg-[#a02020]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {isSearchOverlayVisible && !isAllergenFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => {
              setIsSearchOpen(false)
              setSearchFocused(false)
              setIsSearchOverlayVisible(false)
              setSearchQuery("")
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-50 bg-white"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-[#e0d9c8] bg-[#8B0000] text-white">
                <h2 className="text-xl font-playfair font-medium">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:bg-[#a02020]"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-lg mb-2 ${activeMenu === "food" ? "text-[#8B0000] font-semibold" : "text-[#7c7c7c]"}`}
                  onClick={() => {
                    setActiveMenu("food")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Food Menu
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-lg mb-2 ${activeMenu === "bar" ? "text-[#8B0000] font-semibold" : "text-[#7c7c7c]"}`}
                  onClick={() => {
                    setActiveMenu("bar")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Bar Menu
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-lg mb-2 ${activeMenu === "events" ? "text-[#8B0000] font-semibold" : "text-[#7c7c7c]"}`}
                  onClick={() => {
                    setActiveMenu("events")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Upcoming Events
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redesigned search results */}
      <AnimatePresence>
        {isSearchOpen && searchFocused && searchResults.length > 0 && !isAllergenFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-[100px] left-1/2 transform -translate-x-1/2 w-[300px] bg-white/95 backdrop-blur-sm shadow-lg rounded-lg mt-1 max-h-80 overflow-y-auto z-50"
          >
            {searchResults.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSearchItemClick(item)}
              >
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  {item.type}
                  {item.isVegan && (
                    <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
                      <Leaf className="w-3 h-3 mr-0.5" />
                      Vegan
                    </span>
                  )}
                </div>
                {item.subCategory && (
                  <div className="text-xs text-gray-400 italic">
                    {item.category} - {item.subCategory}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-4 border-[#8B0000] border-t-transparent rounded-full mb-4"></div>
            <p className="text-[#7c7c7c]">Loading menu data...</p>
          </div>
        </div>
      ) : (
        <>
          {activeMenu === "food" && (
            <Menu
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              menuItems={menuItems}
              veganOnly={veganOnly}
              selectedAllergens={selectedAllergens}
            />
          )}
          {activeMenu === "bar" && (
            <DynamicBarMenu selectedItem={selectedItem} setSelectedItem={setSelectedItem} drinkItems={drinkItems} />
          )}
          {activeMenu === "events" && (
            <div className="flex-1 flex items-center justify-center text-2xl text-[#7c7c7c]">
              Upcoming Events Coming Soon
            </div>
          )}
        </>
      )}

      <footer className="p-3 text-center bg-[#f9f7f3]">
        <p className="text-xs text-gray-500 italic">A gratuity of 18% will be added for parties of 5 or more.</p>
      </footer>
      <FullScreenToggle />
      {notificationMessage && <BubbleNotification message={notificationMessage} />}
    </main>
  )
}

