import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import SupabaseProvider from "@/components/supabase-provider"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'EnglishByEar - English Listening Practice',
  description:
    'EnglishByEar is a platform for practicing English listening skills with native speakers.',
  generator: 'realxein',
  keywords: [
    'english listening',
    'english practice',
    'english learning',
    'english conversation',
    'english speaking',
  ],

  openGraph: {
    title: 'EnglishByEar - English Listening Practice',
    description:
      'EnglishByEar is a platform for practicing English listening skills with native speakers.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EnglishByEar - English Listening Practice',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'EnglishByEar - English Listening Practice',
    description:
      'EnglishByEar is a platform for practicing English listening skills with native speakers.',
    images: ['/og-image.png'],
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ThemeProvider>
          <SupabaseProvider>
            {children}
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
