"use client"

import { useState, useEffect } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Info, MenuIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"

interface DrinkItem {
  id: number
  name: string
  price: number
  category: string
  subCategory?: string
  description: string
  image: string
}

// Safe number formatter to prevent toFixed errors
const formatPrice = (price?: number): string => {
  if (price === undefined || price === null || isNaN(price)) return "N/A"
  return price.toFixed(2)
}

// Add this near the top of the file, after the formatPrice function
const safelyGetValue = (obj: any, path: string[], defaultValue: any = "N/A") => {
  try {
    let current = obj
    for (const key of path) {
      if (current === undefined || current === null) return defaultValue
      current = current[key]
    }
    return current === undefined || current === null ? defaultValue : current
  } catch (e) {
    return defaultValue
  }
}

const drinkItems: DrinkItem[] = []

// Explicitly type the props for BarMenu
interface BarMenuProps {
  selectedItem: DrinkItem | null
  setSelectedItem: (item: DrinkItem | null) => void
  drinkItems: DrinkItem[]
}

export function BarMenu({ selectedItem, setSelectedItem, drinkItems }: BarMenuProps) {
  const [currentCategory, setCurrentCategory] = useState("All")
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null)
  const [uniqueCategories, setUniqueCategories] = useState<{ category: string; subCategory?: string }[]>([])
  const [items, setItems] = useState<DrinkItem[]>(drinkItems.length > 0 ? drinkItems : [])
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const [showCategoryContent, setShowCategoryContent] = useState(false)
  const [itemsVisible, setItemsVisible] = useState(false)

  // For CSS transitions
  useEffect(() => {
    setItemsVisible(true)
  }, [])

  // Handle category modal visibility
  useEffect(() => {
    if (isCategoryOpen) {
      setIsOverlayVisible(true)
      setTimeout(() => setShowCategoryContent(true), 50)
    } else {
      setShowCategoryContent(false)
      setTimeout(() => setIsOverlayVisible(false), 300)
    }
  }, [isCategoryOpen])

  // Extract unique categories and format them with subcategories
  useEffect(() => {
    if (items && items.length > 0) {
      // Get unique category-subcategory combinations
      const categoryMap = new Map<string, Set<string | undefined>>()

      items.forEach((item) => {
        if (!categoryMap.has(item.category)) {
          categoryMap.set(item.category, new Set())
        }
        categoryMap.get(item.category)?.add(item.subCategory)
      })

      // Create formatted category list
      const formattedCategories: { category: string; subCategory?: string }[] = []

      // Add "All" category first
      formattedCategories.push({ category: "All" })

      // Add other categories with their subcategories
      categoryMap.forEach((subCategories, category) => {
        if (subCategories.size <= 1 && (subCategories.has(undefined) || subCategories.has(""))) {
          // If category has no subcategories or only undefined/empty subcategory
          formattedCategories.push({ category })
        } else {
          // Add each subcategory as a separate entry
          subCategories.forEach((subCategory) => {
            if (subCategory) {
              formattedCategories.push({ category, subCategory })
            } else {
              // Add the main category without subcategory
              formattedCategories.push({ category })
            }
          })
        }
      })

      setUniqueCategories(formattedCategories)
    }
  }, [items])

  useEffect(() => {
    if (selectedItem) {
      setHighlightedItem(selectedItem.id) // Now correctly typed
      setTimeout(() => setHighlightedItem(null), 3000)
    }
  }, [selectedItem])

  // Format category display text
  const formatCategoryText = (category: string, subCategory?: string) => {
    if (!subCategory) return category
    return `${category} - ${subCategory}`
  }

  // Add a category selection modal function
  const handleCategorySelect = (category: string, subCategory?: string) => {
    if (category === "All") {
      setCurrentCategory("All")
    } else {
      setCurrentCategory(`${category}${subCategory ? ` - ${subCategory}` : ""}`)
    }
    setIsCategoryOpen(false)
    setIsOverlayVisible(false)
  }

  // Filter items based on category and subcategory
  const filteredDrinks = items.filter((item) => {
    if (currentCategory === "All") return true

    // Handle the new format "Category - SubCategory"
    if (currentCategory.includes(" - ")) {
      const [category, subCategory] = currentCategory.split(" - ")
      return item.category === category && item.subCategory === subCategory
    }

    // Handle just category
    return item.category === currentCategory
  })

  // Update the return statement to include the mobile menu button and modal
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f9f7f3]" id="bar-menu-container">
      <div className="bg-white shadow-md">
        <ScrollArea className="w-full">
          <div className="flex p-2 gap-2">
            {uniqueCategories.map(({ category, subCategory }) => (
              <Button
                key={`${category}${subCategory ? `-${subCategory}` : ""}`}
                variant={
                  currentCategory === (category === "All" ? "All" : formatCategoryText(category, subCategory))
                    ? "default"
                    : "outline"
                }
                className="flex-shrink-0 text-sm py-1 px-3 rounded-full"
                onClick={() => handleCategorySelect(category, subCategory)}
              >
                {category === "All" ? "All" : formatCategoryText(category, subCategory)}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredDrinks.map((drink, index) => (
            <div
              key={drink.id}
              className={`transition-all duration-300 opacity-0 translate-y-5 ${itemsVisible ? "opacity-100 translate-y-0" : ""}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div
                className={`flex justify-between items-center py-2 border-b border-gray-200 transition-colors duration-300 ${
                  highlightedItem === drink.id ? "bg-yellow-100" : ""
                }`}
                onClick={() => setSelectedItem(drink)}
                id={`menu-item-${drink.id}`}
              >
                <div>
                  <span className="font-medium">{drink.name}</span>
                  {drink.subCategory && (
                    <span className="text-xs text-gray-400 ml-1 italic">({drink.subCategory})</span>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">${formatPrice(safelyGetValue(drink, ["price"], 0))}</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{drink.name}</DialogTitle>
                        <div className="relative w-full aspect-video mb-4">
                          <Image
                            src={drink.image || "/placeholder.svg?height=300&width=500"}
                            alt={drink.name}
                            fill
                            className="object-cover rounded-md"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const imgElement = e.currentTarget as HTMLImageElement
                              imgElement.src = "/placeholder.svg?height=300&width=500"
                            }}
                          />
                        </div>
                        <DialogDescription>{drink.description}</DialogDescription>
                        {drink.subCategory && (
                          <div className="mt-2 text-sm text-gray-500">
                            Category: {drink.category} - {drink.subCategory}
                          </div>
                        )}
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar />
      </ScrollArea>

      {/* Category Selection Button */}
      <div className="fixed bottom-4 right-4">
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => {
            setIsCategoryOpen(!isCategoryOpen)
            setIsOverlayVisible(!isCategoryOpen)
          }}
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle categories</span>
        </Button>

        {isOverlayVisible && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
              showCategoryContent ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
              setIsCategoryOpen(false)
              setIsOverlayVisible(false)
            }}
          />
        )}

        {isCategoryOpen && (
          <div
            className={`absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-lg min-w-72 max-h-96 overflow-hidden z-50 transition-all duration-300 ease-out ${
              showCategoryContent ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-95"
            }`}
          >
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 z-10">
              <h2 className="text-xl font-playfair font-medium text-[#2c2c2c]">Category</h2>
            </div>
            <ScrollArea className="max-h-80 overflow-y-auto">
              <div className="p-2">
                {uniqueCategories.map(({ category, subCategory }, index) => (
                  <div key={`${category}${subCategory ? `-${subCategory}` : ""}`}>
                    <Button
                      variant="ghost"
                      className="justify-start text-base w-full py-3 rounded-none hover:bg-gray-50"
                      onClick={() => {
                        handleCategorySelect(category, subCategory)
                        setIsCategoryOpen(false)
                      }}
                    >
                      {category === "All" ? "All" : formatCategoryText(category, subCategory)}
                    </Button>
                    {index < uniqueCategories.length - 1 && <div className="h-px bg-gray-100 mx-3" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}

export { drinkItems }
