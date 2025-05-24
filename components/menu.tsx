"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MenuIcon, Milk, Wheat, Egg, Fish, NutIcon as Peanut, Star, Leaf } from "lucide-react"
import { useSwipeable } from "react-swipeable"

// Update the MenuItem interface to include isVegan
interface MenuItem {
  id: number
  name: string
  description: string
  image: string
  price: {
    full: number
    half: number
  }
  calories: {
    full: number
    half: number
  }
  weight?: {
    full: number
    half: number
  }
  allergens?: string[]
  category: string
  subCategory?: string
  isChefSpecial?: boolean
  isVegan?: boolean
  hasPortions?: boolean
}

// Add a type-safe way to access allergenIcons
const allergenIcons: Record<string, React.ComponentType<any>> = {
  Dairy: Milk,
  Gluten: Wheat,
  Eggs: Egg,
  Seafood: Fish,
  Nuts: Peanut,
}

// Update the formatPrice function to be more robust
const formatPrice = (price?: number): string => {
  if (price === undefined || price === null || isNaN(price)) return "N/A"
  return price.toFixed(2)
}

// Add a helper function to safely access nested properties
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

// In the Menu component function, add an additional prop for the vegan filter and allergen filter
export function Menu({
  selectedItem,
  setSelectedItem,
  menuItems,
  veganOnly = false,
  selectedAllergens = [],
}: {
  selectedItem: MenuItem | undefined
  setSelectedItem: (item: MenuItem | undefined) => void
  menuItems: MenuItem[]
  veganOnly?: boolean
  selectedAllergens?: string[]
}) {
  const [currentCategory, setCurrentCategory] = useState("All")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const [uniqueCategories, setUniqueCategories] = useState<{ category: string; subCategory?: string }[]>([])
  const [lastSelectedCategory, setLastSelectedCategory] = useState("All")

  // Auto-select "All" category when toggling Vegan Only
  useEffect(() => {
    // Only reset to "All" when toggling Vegan Only, not when changing allergen filters
    if (veganOnly) {
      setLastSelectedCategory(currentCategory)
      setCurrentCategory("All")
    }

    // Auto-select first vegan item when vegan toggle is enabled
    if (veganOnly && menuItems.length > 0) {
      const filteredItems = menuItems.filter((item) => {
        // Apply vegan filter
        if (!item.isVegan) return false

        // Apply allergen filter
        if (
          item.allergens &&
          item.allergens.some((allergen) => !selectedAllergens.includes(allergen) && allergen.toLowerCase() !== "none")
        ) {
          return false
        }

        return true
      })

      const firstFilteredItem = filteredItems[0]
      if (firstFilteredItem && (!selectedItem || !selectedItem.isVegan)) {
        setSelectedItem(firstFilteredItem)
      }
    }
  }, [veganOnly, selectedAllergens, menuItems, selectedItem, setSelectedItem])

  // Extract unique categories and format them with subcategories
  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      // Get unique category-subcategory combinations
      const categoryMap = new Map<string, Set<string | undefined>>()

      // Filter menu items based on current filters
      const filteredItems = menuItems.filter((item) => {
        // Apply vegan filter
        if (veganOnly && !item.isVegan) return false

        // Apply allergen filter
        if (
          item.allergens &&
          item.allergens.some((allergen) => !selectedAllergens.includes(allergen) && allergen.toLowerCase() !== "none")
        ) {
          return false
        }

        return true
      })

      filteredItems.forEach((item) => {
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
  }, [menuItems, veganOnly, selectedAllergens])

  const handleCategorySelect = (category: string, subCategory?: string) => {
    if (category === "All") {
      setCurrentCategory("All")
    } else {
      setCurrentCategory(`${category}${subCategory ? ` - ${subCategory}` : ""}`)
    }
    setIsCategoryOpen(false)
    setIsOverlayVisible(false)
  }

  useEffect(() => {
    if (selectedItem) {
      const item = menuItems.find((item) => item.id === selectedItem.id)
      if (item) {
        setSelectedItem(item)
      }
    }
  }, [selectedItem, setSelectedItem, menuItems])

  // Filter items based on category, vegan status, and allergens
  const filteredItems = menuItems.filter((item) => {
    // Apply vegan filter
    if (veganOnly && !item.isVegan) return false

    // Apply allergen filter
    if (
      item.allergens &&
      item.allergens.some((allergen) => !selectedAllergens.includes(allergen) && allergen.toLowerCase() !== "none")
    ) {
      return false
    }

    // Apply category filter
    if (currentCategory === "All") return true

    // Handle the new format "Category - SubCategory"
    if (currentCategory.includes(" - ")) {
      const [category, subCategory] = currentCategory.split(" - ")
      return item.category === category && item.subCategory === subCategory
    }

    // Handle just category
    return item.category === currentCategory
  })

  // Updated navigateItem function to respect filters and stay within category
  const navigateItem = (direction: "next" | "prev") => {
    if (!selectedItem) return

    // Get the current category constraint
    let categoryConstraint: string | undefined
    let subCategoryConstraint: string | undefined

    if (currentCategory !== "All" && currentCategory.includes(" - ")) {
      const [category, subCategory] = currentCategory.split(" - ")
      categoryConstraint = category
      subCategoryConstraint = subCategory
    } else if (currentCategory !== "All") {
      categoryConstraint = currentCategory
    }

    // Filter items based on constraints
    const eligibleItems = menuItems.filter((item) => {
      // Apply vegan filter if enabled
      if (veganOnly && !item.isVegan) return false

      // Apply allergen filter
      if (
        item.allergens &&
        item.allergens.some((allergen) => !selectedAllergens.includes(allergen) && allergen.toLowerCase() !== "none")
      ) {
        return false
      }

      // Apply category constraints if not "All"
      if (categoryConstraint) {
        if (subCategoryConstraint) {
          return item.category === categoryConstraint && item.subCategory === subCategoryConstraint
        }
        return item.category === categoryConstraint
      }

      return true
    })

    if (eligibleItems.length === 0) return

    // Find current index in eligible items
    const currentIndex = eligibleItems.findIndex((item) => item.id === selectedItem.id)

    // If item not found in eligible items, select first eligible item
    if (currentIndex === -1) {
      setSelectedItem(eligibleItems[0])
      return
    }

    // Calculate new index
    let newIndex
    if (direction === "next") {
      newIndex = (currentIndex + 1) % eligibleItems.length
    } else {
      newIndex = (currentIndex - 1 + eligibleItems.length) % eligibleItems.length
    }

    setSelectedItem(eligibleItems[newIndex])
  }

  // Fix the useSwipeable configuration by removing the invalid property
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigateItem("next"),
    onSwipedRight: () => navigateItem("prev"),
    trackMouse: true, // Removed preventDefaultTouchmoveEvent
  })

  // Format category display text
  const formatCategoryText = (category: string, subCategory?: string) => {
    if (!subCategory) return category
    return `${category} - ${subCategory}`
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#f9f7f3]">
      <div className="flex-grow-[0.95] overflow-hidden p-4">
        {/* Top display section */}
        <div className="h-full flex flex-col lg:flex-row overflow-hidden relative">
          <div className="flex-grow lg:flex-grow-[0.95] overflow-hidden relative mb-4 lg:mb-0 lg:mr-4">
            {/* Update the image section to show the vegan badge */}
            <motion.div
              {...swipeHandlers}
              className="relative h-full rounded-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              key={selectedItem?.id}
            >
              <Image
                src={selectedItem?.image || "/placeholder.svg"}
                alt={selectedItem?.name || "Selected item"}
                fill
                className="object-cover"
                priority={true} // Disable priority loading for non-critical images
                placeholder="blur" // Use a blur placeholder
                blurDataURL="/placeholder.svg" // Low-res placeholder image
              />
              {selectedItem?.isChefSpecial && (
                <div className="absolute top-2 right-2 z-10 bg-[#ffd700] text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Chef's Special
                </div>
              )}
              {selectedItem?.isVegan && (
                <div
                  className="absolute top-2 right-2 z-10 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center"
                  style={{ top: selectedItem.isChefSpecial ? "40px" : "8px" }}
                >
                  <Leaf className="w-4 h-4 mr-1" />
                  Vegan
                </div>
              )}
            </motion.div>
          </div>
          <div className="lg:flex-grow-[0.05] flex flex-col">
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              key={`title-${selectedItem?.id}`}
            >
              <h1 className="font-playfair text-2xl font-semibold mb-2">{selectedItem?.name || "Select an item"}</h1>
              <p className="text-sm text-[#7c7c7c] lg:max-w-sm">
                {selectedItem?.description || "Item description will appear here"}
              </p>
            </motion.div>
            <div className="mt-auto">
              <motion.div
                className="absolute top-4 left-4 lg:static lg:w-auto bg-white rounded-lg p-4 space-y-2 lg:space-y-3 shadow-lg overflow-hidden"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                key={`pricing-${selectedItem?.id}`}
              >
                <div className="relative">
                  {/* Pricing Section */}
                  {/* <h3 className="font-playfair font-medium text-base lg:text-lg mb-1 lg:mb-2 text-[#2c2c2c]">
                    Pricing
                  </h3>
                  {selectedItem?.hasPortions ? (
                    <div className="grid grid-cols-2 gap-1 lg:gap-2">
                      <div className="space-y-0 lg:space-y-1">
                        <div className="text-xs lg:text-sm text-[#7c7c7c]">Full</div>
                        <div className="font-medium text-xs lg:text-sm">
                          ${formatPrice(safelyGetValue(selectedItem, ["price", "full"], 0))}
                        </div>
                      </div>
                      <div className="space-y-0 lg:space-y-1">
                        <div className="text-xs lg:text-sm text-[#7c7c7c]">Half</div>
                        <div className="font-medium text-xs lg:text-sm">
                          ${formatPrice(safelyGetValue(selectedItem, ["price", "half"], 0))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-0 lg:space-y-1">
                      <div className="font-medium text-xs lg:text-sm">
                        ${formatPrice(safelyGetValue(selectedItem, ["price", "full"], 0))}
                      </div>
                    </div>
                  )}

                  <div className="my-2 border-t border-[#e0d9c8]"></div> */}

                  {/* Nutritional Info Section */}
                  <h3 className="font-playfair font-medium text-sm mb-1 text-[#2c2c2c]">Nutritional Info</h3>

                  {/* Weight Information */}
                  {selectedItem?.weight && (
                    <div className="mb-2">
                      <div className="text-xs text-[#7c7c7c] mb-1">Weight</div>
                      {selectedItem.hasPortions ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-xs">Full: {safelyGetValue(selectedItem, ["weight", "full"], 0)} g</div>
                          <div className="text-xs">Half: {safelyGetValue(selectedItem, ["weight", "half"], 0)} g</div>
                        </div>
                      ) : (
                        <div className="text-xs">{safelyGetValue(selectedItem, ["weight", "full"], 0)} g</div>
                      )}
                    </div>
                  )}

                  {/* Calories Information */}
                  <div className="mb-2">
                    <div className="text-xs text-[#7c7c7c] mb-1">Calories</div>
                    {selectedItem?.hasPortions ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs">
                          Full: {safelyGetValue(selectedItem, ["calories", "full"], 0)} kcal
                        </div>
                        <div className="text-xs">
                          Half: {safelyGetValue(selectedItem, ["calories", "half"], 0)} kcal
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs">{safelyGetValue(selectedItem, ["calories", "full"], 0)} kcal</div>
                    )}
                  </div>

                  {selectedItem?.allergens?.length && (
                    <>
                      <div className="my-2 border-t border-[#e0d9c8]"></div>
                      <h3 className="font-playfair font-medium text-sm mb-1 text-[#2c2c2c]">Allergens</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedItem.allergens
                          .filter((allergen) => allergen.toLowerCase() !== "none" || selectedItem.allergens?.length === 1)
                          .map((allergen) => {
                            const AllergenIcon = allergenIcons[allergen] || null
                            return (
                              <Badge key={allergen} variant="outline" className="text-xs py-0 px-1 flex items-center">
                                {AllergenIcon && <AllergenIcon className="w-3 h-3 mr-1" />}
                                {allergen}
                              </Badge>
                            )
                          })}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow-[0.05] overflow-hidden mt-4">
        {/* Bottom section */}
        <div className="h-full flex flex-col overflow-hidden">
          {/* Category Section */}
          <div className="bg-white shadow-md">
            <ScrollArea className="w-full" ref={categoryRef}>
              <div className="flex p-2 gap-2">
                {uniqueCategories.map(({ category, subCategory }, index) => (
                  <Button
                    key={`${category}-${subCategory || "none"}-${index}`} // Ensure uniqueness
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

          {/* Menu Items */}
          <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-full" style={{ touchAction: "pan-x" }}>
              <div className="flex gap-4 p-3 overflow-x-auto">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`} // Ensure uniqueness
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.0005 }}
                  >
                    <Card
                      className={`flex-shrink-0 w-[140px] h-full cursor-pointer transition-all ${
                        selectedItem?.id === item.id ? "ring-2 ring-[#8B0000]" : ""
                      }`}
                      onClick={() => setSelectedItem(item)}
                      id={`menu-item-${item.id}`}
                    >
                      <CardContent className="p-2 flex flex-col h-full justify-between">
                        <div>
                        <div className="aspect-square relative rounded-md overflow-hidden mb-2">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            placeholder="blur" // Use a blur placeholder
                            blurDataURL="/placeholder.svg" // Low-res placeholder image
                            priority={true} // Disable priority loading for non-critical images
                          />
                          {item.isChefSpecial && (
                            <div className="absolute top-1 right-1 bg-[#ffd700] rounded-full p-1">
                              <Star className="w-3 h-3 text-black" />
                            </div>
                          )}
                          {item.isVegan && (
                            <div
                              className="absolute top-1 right-1 bg-green-600 rounded-full p-1"
                              style={{ top: item.isChefSpecial ? "25px" : "4px" }}
                            >
                              <Leaf className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-medium text-[#2c2c2c]">{item.name}</div>
                        </div>
                        <div className="text-xs text-[#7c7c7c]">
                          {item?.hasPortions && `$${formatPrice(safelyGetValue(item, ["price", "half"], 0))} - `}
                          ${formatPrice(safelyGetValue(item, ["price", "full"], 0))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
      {/* Category Selection Button */}
      <div className="fixed bottom-4 right-4">
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => {
            setIsCategoryOpen(!isCategoryOpen)
            setIsOverlayVisible(!isCategoryOpen)
          }}
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle categories</span>
        </Button>
        <AnimatePresence>
          {isOverlayVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
              onClick={() => {
                setIsCategoryOpen(false)
                setIsOverlayVisible(false)
              }}
            />
          )}
          {/* Redesigned category menu with fixed header */}
          {isCategoryOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-lg min-w-72 max-h-96 overflow-hidden z-50"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

