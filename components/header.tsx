import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'


export default function Header() {
    return (
        <header className="top-0 z-40 container rounded-2xl my-4 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl backdrop-saturate-150">
            <div className="flex h-16 items-center justify-between py-4 ">
                <div className="flex items-center">
                    <span className="text-base md:text-xl font-bold ">EnglishByEar</span>
                </div>
                <nav className="flex items-center gap-4">
                    <Link href="/podcast" className="hidden md:block">
                        <Button variant="outline">Podcast</Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline">Login</Button>
                    </Link>
                    <Link href="/register">
                        <Button>Sign Up</Button>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
