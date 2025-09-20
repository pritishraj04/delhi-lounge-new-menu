import { useState, useEffect } from "react";
import type { MenuItem, DrinkItem, SearchResult, Event } from "../types/menu";

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
            item.allergens.some(
              (allergen: string) =>
                !selectedAllergens.includes(allergen) &&
                allergen.toLowerCase() !== "none",
            )
          ) {
            return false;
          }

          const nameMatch = item.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
          const descMatch = item.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
          const categoryMatch = item.category
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
          const subCategoryMatch = item.subCategory
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

          return nameMatch || descMatch || categoryMatch || subCategoryMatch;
        })
        .map((item) => ({ ...item, type: "Food Menu" }) as SearchResult);

      const drinkResults = drinkItems
        .filter((item) => {
          const nameMatch = item.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
          const descMatch = item.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
          const categoryMatch = item.category
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
          const subCategoryMatch = item.subCategory
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

          return nameMatch || descMatch || categoryMatch || subCategoryMatch;
        })
        .map((item) => ({ ...item, type: "Bar Menu" }) as SearchResult);

      const eventResults = events
        .filter((item) => {
          const nameMatch = item.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
          return nameMatch;
        })
        .map((item) => ({ ...item, type: "Upcoming Events" }) as SearchResult);

      setSearchResults([...foodResults, ...drinkResults, ...eventResults]);
    } else {
      setSearchResults([]);
    }
  }, [
    searchQuery,
    menuItems,
    drinkItems,
    veganOnly,
    selectedAllergens,
    events,
  ]);

  return searchResults;
}
