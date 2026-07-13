import type { Metadata } from "next"
import {
  Cormorant_Garamond,
  Geist_Mono,
  Marck_Script,
  Spectral,
} from "next/font/google"
import { ClerkProvider } from "@/components/auth/clerk-provider"
import { SiteShell } from "@/components/layout/site-shell"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/lib/api/provider"
import "./globals.css"

const spectral = Spectral({
  variable: "--font-body",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
})

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
})

const marckScript = Marck_Script({
  variable: "--font-signature-source",
  subsets: ["cyrillic", "latin"],
  weight: "400",
})

const geistMono = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Miskatonic Lab",
  description:
    "Архив сыщиков, комнат, бросков и хроники событий для мистических расследований.",
  applicationName: "Miskatonic Lab",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`${spectral.variable} ${cormorantGaramond.variable} ${marckScript.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="theme-dark min-h-full flex flex-col">
        <ClerkProvider>
          <TooltipProvider>
            <QueryProvider>
              <SiteShell>{children}</SiteShell>
            </QueryProvider>
          </TooltipProvider>
        </ClerkProvider>
        <Toaster />
      </body>
    </html>
  )
}
