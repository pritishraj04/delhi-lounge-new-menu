import fs from "fs"

// Helper function to parse boolean values
export function parseBoolean(value: string): boolean {
  if (!value) return false

  const lowercaseValue = value.toLowerCase().trim()
  return lowercaseValue === "true" || lowercaseValue === "yes" || lowercaseValue === "1" || lowercaseValue === "y"
}

// Helper function to parse number values
export function parseNumber(value: string): number | null {
  if (!value || value.trim() === "") return null

  const parsed = Number.parseFloat(value.trim())
  return isNaN(parsed) ? null : parsed
}

// Helper function to ensure directory exists
export function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}
