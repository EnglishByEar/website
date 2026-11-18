import React from 'react'
import MetalLogo from './metal-logo'

export default function SplashScreen() {
    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
            <MetalLogo width={100} height={100} classChild={"animate-pulse"} />
        </div>
    )
}
