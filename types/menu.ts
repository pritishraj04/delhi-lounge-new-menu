// Shared types for menu and bar items

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number | { full: number; half?: number };
  allergens?: string[];
  category: string;
  subCategory?: string;
  isChefSpecial?: boolean;
  isMustTry?: boolean;
  isVegan?: boolean;
  hasPortions?: boolean;
  enabled?: boolean;
  timeWindow?: { start: string; end: string };
}

export interface DrinkItem {
  id: number;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  description: string;
  image: string;
}

export interface SearchResult {
  id?: number | string;
  name: string;
  type: "Food Menu" | "Bar Menu" | "Upcoming Events";
  isVegan?: boolean;
  category?: string;
  subCategory?: string;
  image?: string;
  price?: number | { full: number; half?: number };
  allergens?: string[];
}

export interface Event {
  name: string;
  image: string;
}
