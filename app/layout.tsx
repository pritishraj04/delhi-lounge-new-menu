import type React from "react"
import { Inter, Playfair_Display } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme Color */}
        <meta name="theme-color" content="#8B0000" />
        <meta name="msapplication-TileColor" content="#8B0000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />

        {/* Apple Mobile Web App */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="The Delhi Lounge" />

        {/* Apple Splash Screens */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Mobile Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        {/* PWA Display */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="The Delhi Lounge" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-square70x70logo" content="/icons/icon-72x72.png" />
        <meta name="msapplication-square150x150logo" content="/icons/icon-152x152.png" />
        <meta name="msapplication-wide310x150logo" content="/icons/icon-384x384.png" />
        <meta name="msapplication-square310x310logo" content="/icons/icon-512x512.png" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>{children}</body>
    </html>
  )
}

import "./globals.css"

export const metadata = {
  title: "The Delhi Lounge",
  description: "The Delhi Lounge menu application. This application is design and developed at polardot.in",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "The Delhi Lounge",
  },
  icons: {
    icon: [
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
    generator: 'v0.dev'
}
