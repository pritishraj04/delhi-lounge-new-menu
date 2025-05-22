import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"

// Define the expected structure for food menu items
interface FoodMenuItem {
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
  isChefSpecial: boolean
  isVegan: boolean
  hasPortions: boolean
}

// Helper function to parse boolean values
function parseBoolean(value: string): boolean {
  if (!value) return false

  const lowercaseValue = value.toLowerCase().trim()
  return lowercaseValue === "true" || lowercaseValue === "yes" || lowercaseValue === "1" || lowercaseValue === "y"
}

// Helper function to parse number values
function parseNumber(value: string): number | null {
  if (!value || value.trim() === "") return null

  const parsed = Number.parseFloat(value.trim())
  return isNaN(parsed) ? null : parsed
}

// Helper function to ensure directory exists
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

export async function POST() {
  try {
    // Define file paths
    const csvFilePath = path.join(process.cwd(), "scripts", "data", "food.csv")
    const outputDir = path.join(process.cwd(), "public", "data")
    const jsonFilePath = path.join(outputDir, "food-menu.json")

    // Check if CSV file exists
    if (!fs.existsSync(csvFilePath)) {
      return NextResponse.json({ message: "Food CSV file not found at scripts/data/food.csv" }, { status: 404 })
    }

    // Read CSV file
    const csvData = fs.readFileSync(csvFilePath, "utf8")

    // Parse CSV
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    // Transform CSV data to JSON format
    const menuItems: FoodMenuItem[] = records
      .filter((record: any) => record.title && record.category) // Skip rows without title or category
      .map((record: any, index: number) => {
        // Parse price
        const price = parseNumber(record.price) || 0

        // Parse calories
        const calories = parseNumber(record.calories) || 0

        // Parse weight (optional)
        const weight = parseNumber(record.weight)

        // Parse allergens
        const allergens = record.allergens
          ? record.allergens
              .split(";")
              .map((a: string) => a.trim())
              .filter((a: string) => a)
          : []

        // Create menu item
        return {
          id: index + 1,
          name: record.title,
          description: record.description || "",
          image: record.image || "/placeholder.svg?height=400&width=600",
          price: {
            full: price,
            half: 0, // No half portions in this simplified version
          },
          calories: {
            full: calories,
            half: 0, // No half portions in this simplified version
          },
          ...(weight !== null
            ? {
                weight: {
                  full: weight,
                  half: 0, // No half portions in this simplified version
                },
              }
            : {}),
          allergens: allergens.length > 0 ? allergens : ["None"],
          category: record.category,
          subCategory: record["sub category"] || undefined,
          isChefSpecial: parseBoolean(record.chefSpecial),
          isVegan: parseBoolean(record.vegan),
          hasPortions: false, // No portions in this simplified version
        }
      })

    // Ensure output directory exists
    ensureDirectoryExists(outputDir)

    // Write JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(menuItems, null, 2))

    // Return success response
    return NextResponse.json({
      message: `Food menu JSON generated successfully with ${menuItems.length} items`,
      count: menuItems.length,
    })
  } catch (error) {
    console.error("Error generating food menu JSON:", error)

    return NextResponse.json(
      { message: `Error generating food menu JSON: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
