'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[100dvh] flex-col items-center justify-center bg-[#f9f7f3] p-4 text-center font-sans">
            <h2 className="mb-4 text-2xl font-bold text-[#8B0000]">Something went wrong!</h2>
            <p className="mb-6 text-gray-600">
                We apologize for the inconvenience. Please try again.
            </p>
            <div className="rounded-lg bg-red-50 p-4 mb-6 text-left max-w-md w-full overflow-auto max-h-40 border border-red-100">
                <p className="text-xs font-mono text-red-800">{error.message}</p>
            </div>
            <div className="flex gap-4">
                <Button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="bg-[#8B0000] hover:bg-[#a02020]"
                >
                    Try again
                </Button>
                <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                >
                    Reload Page
                </Button>
            </div>
        </div>
    )
}
