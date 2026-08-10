import React from 'react'
import Logo from './Logo'

export default function SplashScreen() {
    return (
        <div className="flex h-screen items-center justify-center">
            <Logo width={200} height={200} classChild={"animate-pulse"} />
        </div>
    )
}
