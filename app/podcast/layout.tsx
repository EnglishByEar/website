import type React from "react"
import type { Metadata } from "next"
import { Headphones } from "lucide-react"
import Footer from "@/components/footer"



export const metadata: Metadata = {
  title: "EnglishByEar - English Listening Practice",
  description: "Practice your English listening skills with EnglishByEar"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EnglishByEar Podcast</span>
          </div>
        </div>
      </header>
      {children}
      <Footer />

    </>
  )
}
