"use client"

import { useEffect } from "react"

// Increment this version number to force a new cache clear/reload loop
const CACHE_VERSION = "v_2026_01_07_fix_1"

export function CacheCleaner() {
    useEffect(() => {
        // Check if we already cleared the cache for this version
        const hasCleared = localStorage.getItem(`cache_cleared_${CACHE_VERSION}`)

        if (!hasCleared) {
            console.log("Detecting new version. Cleaning caches and service workers...")

            const clearCache = async () => {
                try {
                    // 1. Unregister all service workers
                    if ("serviceWorker" in navigator) {
                        const registrations = await navigator.serviceWorker.getRegistrations()
                        for (const registration of registrations) {
                            await registration.unregister()
                            console.log("Service worker unregistered")
                        }
                    }

                    // 2. Clear all caches
                    if ("caches" in window) {
                        const cacheNames = await caches.keys()
                        await Promise.all(
                            cacheNames.map((name) => {
                                console.log(`Deleting cache: ${name}`)
                                return caches.delete(name)
                            })
                        )
                    }

                    // 3. Mark as cleared so we don't loop
                    localStorage.setItem(`cache_cleared_${CACHE_VERSION}`, "true")

                    // 4. Force reload to ensure fresh start
                    console.log("Reloading page...")
                    window.location.reload()
                } catch (error) {
                    console.error("Error clearing cache:", error)
                    // Even if error, mark as cleared to avoid infinite loop attempts
                    localStorage.setItem(`cache_cleared_${CACHE_VERSION}`, "true")
                }
            }

            clearCache()
        }
    }, [])

    return null
}
