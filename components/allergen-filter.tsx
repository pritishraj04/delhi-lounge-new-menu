"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FilterIcon, X, Check } from "lucide-react"

interface AllergenFilterProps {
  allergens: string[]
  selectedAllergens: string[]
  setSelectedAllergens: (allergens: string[]) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function AllergenFilter({
  allergens,
  selectedAllergens,
  setSelectedAllergens,
  isOpen,
  setIsOpen,
}: AllergenFilterProps) {
  const [localSelectedAllergens, setLocalSelectedAllergens] = useState<string[]>(selectedAllergens)

  useEffect(() => {
    setLocalSelectedAllergens(selectedAllergens)
  }, [selectedAllergens])

  const toggleAllergen = (allergen: string) => {
    if (localSelectedAllergens.includes(allergen)) {
      setLocalSelectedAllergens(localSelectedAllergens.filter((a) => a !== allergen))
    } else {
      setLocalSelectedAllergens([...localSelectedAllergens, allergen])
    }
  }

  const applyFilters = () => {
    setSelectedAllergens(localSelectedAllergens)
    setIsOpen(false)
  }

  const selectAll = () => {
    setLocalSelectedAllergens([...allergens])
  }

  const clearAll = () => {
    setLocalSelectedAllergens([])
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 text-white hover:bg-[#a02020] ${isOpen ? "bg-[#a02020]" : ""}`}
      >
        <FilterIcon className="text-gray-100 h-4 w-4" />
        <span className="text-xs text-gray-100 sm:text-sm whitespace-nowrap font-medium">Allergen Filter</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg w-64 z-50"
            >
              <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-[#8B0000] text-white rounded-t-lg">
                <h3 className="font-medium text-sm">Filter by Allergens</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-[#a02020]"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="text-gray-100 h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="max-h-60">
                <div className="p-2">
                  {allergens
                    .filter((allergen) => allergen.toLowerCase() !== "none")
                    .map((allergen) => (
                      <div
                        key={allergen}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                        onClick={() => toggleAllergen(allergen)}
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center mr-2 ${
                            localSelectedAllergens.includes(allergen)
                              ? "bg-[#8B0000] border-[#8B0000]"
                              : "border-gray-300"
                          }`}
                        >
                          {localSelectedAllergens.includes(allergen) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-sm text-gray-800">{allergen}</span>
                      </div>
                    ))}
                </div>
              </ScrollArea>

              <div className="p-3 border-t border-gray-100 flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAll}
                    className="text-xs text-gray-800 border-gray-300 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    className="text-xs text-gray-800 border-gray-300 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Clear All
                  </Button>
                </div>
                <Button size="sm" onClick={applyFilters} className="text-xs text-gray-100 bg-[#8B0000] hover:bg-[#a02020]">
                  Apply
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
