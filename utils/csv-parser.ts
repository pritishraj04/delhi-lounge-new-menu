/**
 * Utility functions for parsing CSV data for menu items
 */

// Food Menu item interface based on CSV structure
export interface FoodMenuItem {
  id: number;
  category: string;
  subCategory?: string;
  name: string;
  description: string;
  metrics: {
    weight?: number;
    calories?: number;
    price?: number;
    portions: {
      full?: {
        price: number;
        calories?: number;
        weight?: number;
      };
      half?: {
        price: number;
        calories?: number;
        weight?: number;
      };
    };
  };
  image: string;
  isChefSpecial?: boolean;
  isMustTry?: boolean;
  isVegan?: boolean;
  allergens?: string[];
  enabled?: boolean;
  timeWindowStart?: string; // "HH:MM:SS" format
  timeWindowEnd?: string; // "HH:MM:SS" format
}

// Bar Menu item interface based on CSV structure
export interface BarMenuItem {
  id: number;
  category: string;
  subCategory?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  enabled?: boolean;
  timeWindowStart?: string; // "HH:MM:SS" format
  timeWindowEnd?: string; // "HH:MM:SS" format
}

/**
 * Parse CSV data for food menu items
 */
let uniqueIdCounter = 1; // Initialize a counter for unique numeric IDs

export function parseFoodMenuCSV(csvContent: string): FoodMenuItem[] {
  const lines = csvContent.split("\n");
  const headers = lines[0].split(",").map((header) => header.trim());

  // Create a map of header indices for easier access
  const headerMap = headers.reduce(
    (map, header, index) => {
      map[header] = index;
      return map;
    },
    {} as Record<string, number>,
  );

  const foodMenuItems: FoodMenuItem[] = [];

  // Start from index 1 to skip headers
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines

    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue; // Skip malformed lines

    try {
      const item: FoodMenuItem = {
        id: uniqueIdCounter++, // Use the counter to generate unique numeric IDs
        category: values[headerMap["category"]] || "Uncategorized",
        subCategory: values[headerMap["sub category"]] || undefined,
        name: values[headerMap["title"]] || `Item ${i}`,
        description: values[headerMap["description"]] || "",
        metrics: parseMetrics(values[headerMap["metrics"]] || ""),
        image: values[headerMap["image"]] || "/placeholder.svg",
        isChefSpecial:
          values[headerMap["chefSpecial"]]?.toLowerCase() === "true",
        isMustTry: values[headerMap["mustTry"]]?.toLowerCase() === "true",
        isVegan: values[headerMap["vegan"]]?.toLowerCase() === "true",
        allergens:
          values[headerMap["allergens"]]
            ?.split(";")
            .map((a) => a.trim())
            .filter(Boolean) || [],
        enabled: values[headerMap["enabled"]]?.toLowerCase() === "true",
        timeWindowStart: values[headerMap["timeWindowStart"]] || undefined,
        timeWindowEnd: values[headerMap["timeWindowEnd"]] || undefined,
      };

      foodMenuItems.push(item);
    } catch (error) {
      console.error(`Error parsing line ${i}:`, error);
      // Continue with next line
    }
  }

  return foodMenuItems;
}

/**
 * Parse CSV data for bar menu items
 */
export function parseBarMenuCSV(csvContent: string): BarMenuItem[] {
  const lines = csvContent.split("\n");
  const headers = lines[0].split(",").map((header) => header.trim());

  // Create a map of header indices for easier access
  const headerMap = headers.reduce(
    (map, header, index) => {
      map[header] = index;
      return map;
    },
    {} as Record<string, number>,
  );

  const barMenuItems: BarMenuItem[] = [];

  // Start from index 1 to skip headers
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines

    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue; // Skip malformed lines

    try {
      const item: BarMenuItem = {
        id: uniqueIdCounter++, // Use line number as ID for simplicity
        category: values[headerMap["category"]] || "Uncategorized",
        subCategory: values[headerMap["sub category"]] || undefined,
        name: values[headerMap["title"]] || `Item ${i}`,
        description: values[headerMap["description"]] || "",
        price: Number.parseFloat(values[headerMap["price"]]) || 0,
        image: values[headerMap["image"]] || "/placeholder.svg",
        enabled: values[headerMap["enabled"]]?.toLowerCase() === "true",
        timeWindowStart: values[headerMap["timeWindowStart"]] || undefined,
        timeWindowEnd: values[headerMap["timeWindowEnd"]] || undefined,
      };

      barMenuItems.push(item);
    } catch (error) {
      console.error(`Error parsing line ${i}:`, error);
      // Continue with next line
    }
  }

  return barMenuItems;
}

/**
 * Parse a CSV line considering quoted values that may contain commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Add the last value
  result.push(current.trim());

  return result;
}

/**
 * Parse metrics string into structured object
 * Supports both old and new formats:
 *
 * Old format: "weight:200g;kcal:350;full:12.99;half:7.99;full_kcal:350;half_kcal:175"
 * New format: "portion:full;full_weight:200g;full_cal:300kcal;full_price:$400;portion:half;half_weight:100g;half_cal:150kcal;half_price:$200"
 * Simple format: "weight:200ml;cal:120;price:$3.99"
 */
function parseMetrics(metricsStr: string): FoodMenuItem["metrics"] {
  const metrics: FoodMenuItem["metrics"] = {
    portions: {},
  };

  if (!metricsStr) {
    // Default values if metrics string is empty
    metrics.portions = {
      full: { price: 0 },
    };
    return metrics;
  }

  const parts = metricsStr.split(";");
  let hasPortions = false;
  let currentPortion: "full" | "half" | null = null;

  for (const part of parts) {
    if (!part.trim()) continue;

    const [key, rawValue] = part.split(":").map((s) => s.trim());
    const value = rawValue ? rawValue.replace(/[$]/g, "") : "";

    // Handle portion indicator
    if (key === "portion") {
      if (value === "full" || value === "half") {
        currentPortion = value;
        hasPortions = true;
      }
      continue;
    }

    // Handle new format with portion-specific metrics
    if (key.startsWith("full_") || key.startsWith("half_")) {
      const portionType = key.startsWith("full_") ? "full" : "half";
      const metricType = key.substring(portionType.length + 1);

      if (!metrics.portions[portionType]) {
        metrics.portions[portionType] = { price: 0 };
      }

      if (metricType === "weight") {
        metrics.portions[portionType].weight = Number.parseInt(
          value.replace(/[^0-9]/g, ""),
        );
      } else if (metricType === "cal" || metricType === "calories") {
        metrics.portions[portionType].calories = Number.parseInt(
          value.replace(/[^0-9]/g, ""),
        );
      } else if (metricType === "price") {
        metrics.portions[portionType].price = Number.parseFloat(
          value.replace(/[^0-9.]/g, ""),
        );
      }

      hasPortions = true;
      continue;
    }

    // Handle old format keys
    if (key === "weight") {
      metrics.weight = Number.parseInt(value.replace(/[^0-9]/g, ""));
    } else if (key === "kcal" || key === "cal" || key === "calories") {
      metrics.calories = Number.parseInt(value.replace(/[^0-9]/g, ""));
    } else if (key === "price") {
      metrics.price = Number.parseFloat(value.replace(/[^0-9.]/g, ""));

      // If we have a single price and no portions, set it as the full portion price
      if (!hasPortions) {
        if (!metrics.portions.full) metrics.portions.full = { price: 0 };
        metrics.portions.full.price = metrics.price;
      }
    } else if (key === "full") {
      if (!metrics.portions.full) metrics.portions.full = { price: 0 };
      metrics.portions.full.price = Number.parseFloat(value);
      hasPortions = true;
    } else if (key === "half") {
      if (!metrics.portions.half) metrics.portions.half = { price: 0 };
      metrics.portions.half.price = Number.parseFloat(value);
      hasPortions = true;
    } else if (key === "full_kcal" || key === "full_cal") {
      if (!metrics.portions.full) metrics.portions.full = { price: 0 };
      metrics.portions.full.calories = Number.parseInt(value);
    } else if (key === "half_kcal" || key === "half_cal") {
      if (!metrics.portions.half) metrics.portions.half = { price: 0 };
      metrics.portions.half.calories = Number.parseInt(value);
    }
  }

  // Ensure we have at least an empty object for full portion
  if (!metrics.portions.full) metrics.portions.full = { price: 0 };

  // If we have calories but no portion-specific calories, distribute them
  if (metrics.calories && !metrics.portions.full.calories) {
    metrics.portions.full.calories = metrics.calories;

    if (metrics.portions.half && !metrics.portions.half.calories) {
      metrics.portions.half.calories = Math.floor(metrics.calories / 2);
    }
  }

  // If we have weight but no portion-specific weight, distribute it
  if (metrics.weight && !metrics.portions.full.weight) {
    metrics.portions.full.weight = metrics.weight;

    if (metrics.portions.half && !metrics.portions.half.weight) {
      metrics.portions.half.weight = Math.floor(metrics.weight / 2);
    }
  }

  return metrics;
}

/**
 * Convert FoodMenuItem to the existing MenuItem format
 */
export function convertToMenuItems(foodItems: FoodMenuItem[]): any[] {
  return foodItems.map((item) => {
    // Compose timeWindow object if both start and end are present
    let timeWindow = undefined;
    if (item.timeWindowStart && item.timeWindowEnd) {
      timeWindow = { start: item.timeWindowStart, end: item.timeWindowEnd };
    }
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      price: {
        full: item.metrics.portions.full?.price || item.metrics.price || 0,
        half: item.metrics.portions.half?.price || 0,
      },
      calories: {
        full:
          item.metrics.portions.full?.calories || item.metrics.calories || 0,
        half: item.metrics.portions.half?.calories || 0,
      },
      weight: {
        full: item.metrics.portions.full?.weight || item.metrics.weight || 0,
        half: item.metrics.portions.half?.weight || 0,
      },
      allergens: item.allergens,
      category: item.category,
      subCategory: item.subCategory,
      isChefSpecial: item.isChefSpecial,
      isMustTry: item.isMustTry,
      isVegan: item.isVegan,
      hasPortions:
        !!item.metrics.portions.half && item.metrics.portions.half.price > 0,
      enabled: item.enabled,
      timeWindow,
    };
  });
}

/**
 * Convert BarMenuItem to the existing DrinkItem format
 */
export function convertToBarItems(barItems: BarMenuItem[]): any[] {
  return barItems.map((item) => {
    // Compose timeWindow object if both start and end are present
    let timeWindow = undefined;
    if (item.timeWindowStart && item.timeWindowEnd) {
      timeWindow = { start: item.timeWindowStart, end: item.timeWindowEnd };
    }
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      subCategory: item.subCategory,
      image: item.image,
      enabled: item.enabled,
      timeWindow,
    };
  });
}
