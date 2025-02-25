"use client";

import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface DrinkItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

const drinkItems: DrinkItem[] = [
  {
    id: 1,
    name: "Old Monk Rum",
    price: 8.99,
    category: "Rum",
    image: "/menu-imgs/bar/tropic-city.jpg",
    description: "A dark rum with a strong, smooth flavor",
  },
  {
    id: 2,
    name: "Johnnie Walker Black Label",
    price: 12.99,
    category: "Whiskey",
    image: "/menu-imgs/bar/tropic-tingle.jpg",
    description: "A blend of whiskies, each aged for at least 12 years",
  },
  {
    id: 3,
    name: "Absolut Vodka",
    price: 9.99,
    category: "Vodka",
    image: "/menu-imgs/bar/turmeric-gin-old-fashioned.jpg",
    description: "A Swedish vodka made from winter wheat",
  },
  {
    id: 4,
    name: "Bombay Sapphire Gin",
    price: 10.99,
    category: "Gin",
    image: "/menu-imgs/bar/very-berry-sour.jpg",
    description: "A London dry gin with a distinctive blue bottle",
  },
  {
    id: 5,
    name: "Jose Cuervo Tequila",
    price: 11.99,
    category: "Tequila",
    image: "/menu-imgs/bar/imag.jpg",
    description: "A mixto tequila made from blue agave",
  },
  // Add more drink items here...
];

const categories = ["All", "Rum", "Whiskey", "Vodka", "Gin", "Tequila"];

export function BarMenu({ selectedItem }) {
  const [currentCategory, setCurrentCategory] = useState("All");
  const [highlightedItem, setHighlightedItem] = useState(null);

  useEffect(() => {
    if (selectedItem) {
      setHighlightedItem(selectedItem.id);
      setTimeout(() => setHighlightedItem(null), 3000);
    }
  }, [selectedItem]);

  const filteredDrinks =
    currentCategory === "All"
      ? drinkItems
      : drinkItems.filter((item) => item.category === currentCategory);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white shadow-md">
        <ScrollArea className="w-full">
          <div className="flex p-2 gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={currentCategory === category ? "default" : "outline"}
                className="flex-shrink-0 text-sm py-1 px-3 rounded-full"
                onClick={() => setCurrentCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredDrinks.map((drink) => (
            <div
              key={drink.id}
              className={`flex justify-between items-center py-2 border-b border-gray-200 transition-colors duration-300 ${
                highlightedItem === drink.id ? "bg-yellow-100" : ""
              }`}
            >
              <div>
                <span className="font-medium">{drink.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({drink.category})
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">
                  ${drink.price.toFixed(2)}
                </span>
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
                          src={drink.image}
                          alt={drink.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <DialogDescription>{drink.description}</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}

export { drinkItems };
