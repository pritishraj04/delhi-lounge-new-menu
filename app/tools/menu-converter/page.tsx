"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function MenuConverterPage() {
  const [foodStatus, setFoodStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [barStatus, setBarStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [foodMessage, setFoodMessage] = useState("")
  const [barMessage, setBarMessage] = useState("")

  const generateFoodMenu = async () => {
    setFoodStatus("loading")
    try {
      const response = await fetch("/api/convert-menu/food", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate food menu")
      }

      setFoodStatus("success")
      setFoodMessage(data.message)
    } catch (error) {
      setFoodStatus("error")
      setFoodMessage(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  const generateBarMenu = async () => {
    setBarStatus("loading")
    try {
      const response = await fetch("/api/convert-menu/bar", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate bar menu")
      }

      setBarStatus("success")
      setBarMessage(data.message)
    } catch (error) {
      setBarStatus("error")
      setBarMessage(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Menu Converter Tool</h1>
      <p className="text-gray-600 mb-8">
        Generate JSON files from static CSV files stored in the scripts/data directory.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Food Menu Card */}
        <Card>
          <CardHeader>
            <CardTitle>Food Menu Converter</CardTitle>
            <CardDescription>Converts food.csv to food-menu.json</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Source: <code className="bg-gray-100 px-1 py-0.5 rounded">./scripts/data/food.csv</code>
              <br />
              Destination: <code className="bg-gray-100 px-1 py-0.5 rounded">./public/data/food-menu.json</code>
            </p>

            {foodStatus === "success" && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Success</AlertTitle>
                <AlertDescription className="text-green-600">{foodMessage}</AlertDescription>
              </Alert>
            )}

            {foodStatus === "error" && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-600">Error</AlertTitle>
                <AlertDescription className="text-red-600">{foodMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={generateFoodMenu} disabled={foodStatus === "loading"} className="w-full">
              {foodStatus === "loading" ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Generate Food Menu JSON"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Bar Menu Card */}
        <Card>
          <CardHeader>
            <CardTitle>Bar Menu Converter</CardTitle>
            <CardDescription>Converts bar.csv to bar-menu.json</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Source: <code className="bg-gray-100 px-1 py-0.5 rounded">./scripts/data/bar.csv</code>
              <br />
              Destination: <code className="bg-gray-100 px-1 py-0.5 rounded">./public/data/bar-menu.json</code>
            </p>

            {barStatus === "success" && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Success</AlertTitle>
                <AlertDescription className="text-green-600">{barMessage}</AlertDescription>
              </Alert>
            )}

            {barStatus === "error" && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-600">Error</AlertTitle>
                <AlertDescription className="text-red-600">{barMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={generateBarMenu} disabled={barStatus === "loading"} className="w-full">
              {barStatus === "loading" ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Generate Bar Menu JSON"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
