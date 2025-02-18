"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MenuIcon,
  Milk,
  Wheat,
  Egg,
  Fish,
  NutIcon as Peanut,
  Star,
} from "lucide-react";
import { useSwipeable } from "react-swipeable";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: {
    full: number;
    half: number;
  };
  calories: {
    full: number;
    half: number;
  };
  allergens?: string[];
  category: string;
  isChefSpecial?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Tandoori Chicken",
    description:
      "Juicy chicken marinated in yogurt and spices, cooked in a tandoor",
    image: "/placeholder.svg",
    price: {
      full: 16.99,
      half: 9.99,
    },
    calories: {
      full: 450,
      half: 225,
    },
    allergens: ["Dairy"],
    category: "Appetizers",
    isChefSpecial: true,
  },
  {
    id: 2,
    name: "Butter Chicken",
    description: "Tender chicken in a creamy tomato sauce",
    image: "/placeholder.svg",
    price: {
      full: 18.99,
      half: 10.99,
    },
    calories: {
      full: 550,
      half: 275,
    },
    allergens: ["Dairy"],
    category: "Main Course",
  },
  {
    id: 3,
    name: "Palak Paneer",
    description: "Cottage cheese cubes in a creamy spinach sauce",
    image: "/placeholder.svg",
    price: {
      full: 15.99,
      half: 8.99,
    },
    calories: {
      full: 400,
      half: 200,
    },
    allergens: ["Dairy"],
    category: "Main Course",
  },
  {
    id: 4,
    name: "Gulab Jamun",
    description: "Deep-fried milk solids soaked in sugar syrup",
    image: "/placeholder.svg",
    price: {
      full: 6.99,
      half: 3.99,
    },
    calories: {
      full: 300,
      half: 150,
    },
    allergens: ["Dairy", "Nuts"],
    category: "Desserts",
  },
  {
    id: 5,
    name: "Mango Lassi",
    description: "Refreshing yogurt-based drink with mango pulp",
    image: "/placeholder.svg",
    price: {
      full: 4.99,
      half: 2.99,
    },
    calories: {
      full: 200,
      half: 100,
    },
    allergens: ["Dairy"],
    category: "Drinks",
  },
  ...Array(20)
    .fill(null)
    .map((_, index) => ({
      id: 100 + index,
      name: `Appetizer ${index + 1}`,
      description: `Delicious appetizer number ${index + 1}`,
      image: "/placeholder.svg",
      price: {
        full: 9.99,
        half: 5.99,
      },
      calories: {
        full: 300,
        half: 150,
      },
      category: "Appetizers",
    })),
];

const categories = ["All", "Appetizers", "Main Course", "Desserts", "Drinks"];

const allergenIcons = {
  Dairy: Milk,
  Gluten: Wheat,
  Eggs: Egg,
  Fish: Fish,
  Nuts: Peanut,
};

export function Menu({
  selectedItem,
  setSelectedItem,
  menuItems,
}: {
  selectedItem: MenuItem | undefined;
  setSelectedItem: (item: MenuItem | undefined) => void;
  menuItems: MenuItem[];
}) {
  const [currentCategory, setCurrentCategory] = useState("All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (category: string) => {
    setCurrentCategory(category);
    setIsCategoryOpen(false);
  };

  useEffect(() => {
    if (selectedItem) {
      const item = menuItems.find((item) => item.id === selectedItem.id);
      if (item) {
        setSelectedItem(item);
      }
    }
  }, [selectedItem, setSelectedItem, menuItems]); // Added menuItems to dependencies

  useEffect(() => {
    const interval = setInterval(() => {
      const pricingSection = document.querySelector(".pricing-section");
      if (pricingSection) {
        pricingSection.classList.add("shine-effect");
        setTimeout(() => pricingSection.classList.remove("shine-effect"), 1000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredItems =
    currentCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === currentCategory);

  const navigateItem = (direction: "next" | "prev") => {
    const currentIndex = filteredItems.findIndex(
      (item) => item.id === selectedItem?.id
    );
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredItems.length;
    } else {
      newIndex =
        (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    }

    setSelectedItem(filteredItems[newIndex]);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigateItem("next"),
    onSwipedRight: () => navigateItem("prev"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-grow-[0.6] overflow-hidden">
        {/* Top display section */}
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex-grow overflow-hidden">
            <div
              {...swipeHandlers}
              className="relative h-full rounded-lg overflow-hidden"
            >
              <Image
                src={selectedItem?.image || "/placeholder.svg"}
                alt={selectedItem?.name || "Selected item"}
                fill
                className="object-cover"
                priority
              />
              {selectedItem?.isChefSpecial && (
                <div className="absolute top-2 right-2 bg-[#ffd700] text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Chef's Special
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 text-center">
            <h1 className="font-playfair text-2xl font-semibold mb-2 text-[#2c2c2c]">
              {selectedItem?.name || "Select an item"}
            </h1>
            <p className="text-sm text-[#7c7c7c]">
              {selectedItem?.description || "Item description will appear here"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-grow-[0.4] overflow-hidden mt-4">
        {/* Bottom section */}
        <div className="h-full flex flex-col overflow-hidden">
          {/* Right Column - Details */}
          <div className="mb-4">
            <div className="bg-white rounded-lg p-4 space-y-3 shadow-md relative overflow-hidden pricing-section">
              <div className="absolute opacity-10" />
              <div
                className="absolute inset-0 border border-[#ffd700] rounded-lg"
                style={{ boxShadow: "inset 0 0 10px rgba(255, 215, 0, 0.5)" }}
              />
              <div className="relative z-10">
                <h3 className="font-playfair font-medium text-lg mb-2 text-[#2c2c2c]">
                  Pricing
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="text-xs text-[#7c7c7c]">Full</div>
                    <div className="font-medium text-sm">
                      ${selectedItem?.price?.full?.toFixed(2) ?? "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-[#7c7c7c]">Half</div>
                    <div className="font-medium text-sm">
                      ${selectedItem?.price?.half?.toFixed(2) ?? "N/A"}
                    </div>
                  </div>
                </div>
                <div className="my-2 border-t border-[#e0d9c8]"></div>
                <h3 className="font-playfair font-medium text-sm mb-1 text-[#2c2c2c]">
                  Calories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="text-xs text-[#7c7c7c]">Full</div>
                    <div className="text-xs">
                      {selectedItem?.calories?.full || "N/A"} cal
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-[#7c7c7c]">Half</div>
                    <div className="text-xs">
                      {selectedItem?.calories?.half || "N/A"} cal
                    </div>
                  </div>
                </div>
                {selectedItem?.allergens && (
                  <>
                    <div className="my-2 border-t border-[#e0d9c8]"></div>
                    <h3 className="font-playfair font-medium text-sm mb-1 text-[#2c2c2c]">
                      Allergens
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.allergens.map((allergen) => {
                        const AllergenIcon = allergenIcons[allergen] || null;
                        return (
                          <Badge
                            key={allergen}
                            variant="outline"
                            className="text-xs py-0 px-1 flex items-center"
                          >
                            {AllergenIcon && (
                              <AllergenIcon className="w-3 h-3 mr-1" />
                            )}
                            {allergen}
                          </Badge>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Category Section */}
          <div className="bg-white shadow-md">
            <ScrollArea className="w-full" ref={categoryRef}>
              <div className="flex p-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      currentCategory === category ? "default" : "outline"
                    }
                    className="flex-shrink-0 text-sm py-1 px-3 rounded-full"
                    onClick={() => handleCategorySelect(category)}
                    data-category={category}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
          </div>

          {/* Menu Items */}
          <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex gap-4 p-3 overflow-x-auto">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className={`flex-shrink-0 w-[140px] cursor-pointer transition-all ${
                        selectedItem?.id === item.id
                          ? "ring-2 ring-[#ffd700]"
                          : ""
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <CardContent className="p-2">
                        <div className="aspect-square relative rounded-md overflow-hidden mb-2">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          {item.isChefSpecial && (
                            <div className="absolute top-1 right-1 bg-[#ffd700] rounded-full p-1">
                              <Star className="w-3 h-3 text-black" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-medium text-[#2c2c2c]">
                          {item.name}
                        </div>
                        <div className="text-xs text-[#7c7c7c]">
                          ${item.price?.full.toFixed(2) ?? "N/A"}
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
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle categories</span>
        </Button>
        <AnimatePresence>
          {isCategoryOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-4 w-48"
            >
              <h2 className="text-lg font-playfair font-medium text-[#2c2c2c] mb-2">
                Categories
              </h2>
              <div className="grid gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className="justify-start text-sm"
                    onClick={() => {
                      handleCategorySelect(category);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { menuItems };
