import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="container rounded-2xl my-4 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 EnglishByEar. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
