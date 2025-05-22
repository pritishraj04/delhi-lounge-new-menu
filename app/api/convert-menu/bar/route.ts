import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"

// Define the expected structure for bar menu items
interface DrinkItem {
  id: number
  name: string
  price: number
  category: string
  subCategory?: string
  description: string
  image: string
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
    const csvFilePath = path.join(process.cwd(), "scripts", "data", "bar.csv")
    const outputDir = path.join(process.cwd(), "public", "data")
    const jsonFilePath = path.join(outputDir, "bar-menu.json")

    // Check if CSV file exists
    if (!fs.existsSync(csvFilePath)) {
      return NextResponse.json({ message: "Bar CSV file not found at scripts/data/bar.csv" }, { status: 404 })
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
    const drinkItems: DrinkItem[] = records
      .filter((record: any) => record.title && record.category) // Skip rows without title or category
      .map((record: any, index: number) => {
        // Parse price
        const price = parseNumber(record.price) || 0

        // Create drink item
        return {
          id: index + 1,
          name: record.title,
          price: price,
          category: record.category,
          subCategory: record["sub category"] || undefined,
          description: record.description || "",
          image: record.image || "/placeholder.svg?height=300&width=500",
        }
      })

    // Ensure output directory exists
    ensureDirectoryExists(outputDir)

    // Write JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(drinkItems, null, 2))

    // Return success response
    return NextResponse.json({
      message: `Bar menu JSON generated successfully with ${drinkItems.length} items`,
      count: drinkItems.length,
    })
  } catch (error) {
    console.error("Error generating bar menu JSON:", error)

    return NextResponse.json(
      { message: `Error generating bar menu JSON: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
