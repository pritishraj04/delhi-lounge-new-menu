"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Check, AlertCircle } from "lucide-react"
import { parseFoodMenuCSV, parseBarMenuCSV, convertToMenuItems, convertToBarItems } from "@/utils/csv-parser"

interface CSVImportProps {
  onFoodMenuImport: (items: any[]) => void
  onBarMenuImport: (items: any[]) => void
  onClose: () => void
}

export function CSVImport({ onFoodMenuImport, onBarMenuImport, onClose }: CSVImportProps) {
  const [foodMenuFile, setFoodMenuFile] = useState<File | null>(null)
  const [barMenuFile, setBarMenuFile] = useState<File | null>(null)
  const [importStatus, setImportStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleFoodMenuFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoodMenuFile(e.target.files[0])
    }
  }

  const handleBarMenuFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBarMenuFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    setImportStatus("loading")
    setErrorMessage("")

    try {
      // Process food menu CSV if provided
      if (foodMenuFile) {
        const content = await foodMenuFile.text()
        const foodItems = parseFoodMenuCSV(content)
        const convertedItems = convertToMenuItems(foodItems)
        onFoodMenuImport(convertedItems)
      }

      // Process bar menu CSV if provided
      if (barMenuFile) {
        const content = await barMenuFile.text()
        const barItems = parseBarMenuCSV(content)
        const convertedItems = convertToBarItems(barItems)
        onBarMenuImport(convertedItems)
      }

      setImportStatus("success")

      // Close the import dialog after a short delay
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Import error:", error)
      setImportStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-playfair font-medium">Import Menu Data</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Food Menu CSV</h3>
            <p className="text-sm text-gray-500 mb-2">Required fields: category, title, description, metrics, image</p>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={handleFoodMenuFileChange}
                className="hidden"
                id="food-menu-csv"
              />
              <label
                htmlFor="food-menu-csv"
                className="flex-1 border border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {foodMenuFile ? (
                  <span className="text-sm font-medium">{foodMenuFile.name}</span>
                ) : (
                  <span className="text-sm text-gray-500">Click to select file</span>
                )}
              </label>
              {foodMenuFile && (
                <Button variant="ghost" size="icon" onClick={() => setFoodMenuFile(null)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Bar Menu CSV</h3>
            <p className="text-sm text-gray-500 mb-2">Required fields: category, title, description, price, image</p>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={handleBarMenuFileChange}
                className="hidden"
                id="bar-menu-csv"
              />
              <label
                htmlFor="bar-menu-csv"
                className="flex-1 border border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {barMenuFile ? (
                  <span className="text-sm font-medium">{barMenuFile.name}</span>
                ) : (
                  <span className="text-sm text-gray-500">Click to select file</span>
                )}
              </label>
              {barMenuFile && (
                <Button variant="ghost" size="icon" onClick={() => setBarMenuFile(null)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose} disabled={importStatus === "loading"}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={(!foodMenuFile && !barMenuFile) || importStatus === "loading" || importStatus === "success"}
              className="relative"
            >
              {importStatus === "loading" ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Importing...
                </span>
              ) : importStatus === "success" ? (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Imported
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

