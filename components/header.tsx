import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import Logo from './Logo'

export default function Header() {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/0 backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Logo width={28} height={28} />
                    <span className="text-base font-bold md:text-lg">EnglishByEar</span>
                </Link>
                <nav className="flex items-center gap-2 sm:gap-3">
                    <Link href="/podcast" className="hidden md:block">
                        <Button variant="ghost">Podcast</Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/register">
                        <Button>Sign up</Button>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
