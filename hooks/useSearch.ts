import { useState, useEffect } from "react";

// Define the required types locally
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
  weight?: {
    full: number;
    half: number;
  };
  allergens?: string[];
  category: string;
  subCategory?: string;
  isChefSpecial?: boolean;
  isMustTry?: boolean;
  isVegan?: boolean;
  hasPortions?: boolean;
}

interface DrinkItem {
  id: number;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  description: string;
  image: string;
}

interface SearchResult {
  id?: number | string;
  name: string;
  type: "Food Menu" | "Bar Menu" | "Upcoming Events"; // Ensure type is one of the allowed values
  isVegan?: boolean; // Optional property
  category?: string; // Optional property
  subCategory?: string; // Optional property
  image?: string;
  price?: number | { full: number; half: number }; // Allow price as an object or a number
  calories?: number | { full: number; half: number }; // Allow calories as an object or a number
}

interface Event {
  name: string;
  image: string;
}

interface UseSearchParams {
  searchQuery: string;
  menuItems: MenuItem[];
  drinkItems: DrinkItem[];
  events: Event[];
  veganOnly: boolean;
  selectedAllergens: string[];
}

export function useSearch({
  searchQuery,
  menuItems,
  drinkItems,
  events,
  veganOnly,
  selectedAllergens,
}: UseSearchParams) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const foodResults = menuItems
        .filter((item) => {
          if (veganOnly && !item.isVegan) return false;
          if (
            item.allergens &&
            item.allergens.some((allergen: string) =>
              !selectedAllergens.includes(allergen) &&
              allergen.toLowerCase() !== "none"
            )
          ) {
            return false;
          }

          const nameMatch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
          const descMatch = item.description?.toLowerCase().includes(searchQuery.toLowerCase());
          const categoryMatch = item.category?.toLowerCase().includes(searchQuery.toLowerCase());
          const subCategoryMatch = item.subCategory?.toLowerCase().includes(searchQuery.toLowerCase());

          return nameMatch || descMatch || categoryMatch || subCategoryMatch;
        })
        .map((item) => ({ ...item, type: "Food Menu" } as SearchResult));

      const drinkResults = drinkItems
        .filter((item) => {
          const nameMatch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
          const descMatch = item.description?.toLowerCase().includes(searchQuery.toLowerCase());
          const categoryMatch = item.category?.toLowerCase().includes(searchQuery.toLowerCase());
          const subCategoryMatch = item.subCategory?.toLowerCase().includes(searchQuery.toLowerCase());

          return nameMatch || descMatch || categoryMatch || subCategoryMatch;
        })
        .map((item) => ({ ...item, type: "Bar Menu" } as SearchResult));

      const eventResults = events
        .filter((item) => {
          const nameMatch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
          return nameMatch;
        })
        .map((item) => ({ ...item, type: "Upcoming Events" } as SearchResult));

      setSearchResults([...foodResults, ...drinkResults, ...eventResults]);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, menuItems, drinkItems, veganOnly, selectedAllergens, events]);

  return searchResults;
}
