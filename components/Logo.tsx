import Image from 'next/image'
import React from 'react'

export default function Logo({ width = 50, height = 50 }: { width?: number, height?: number }) {
    return (
        <Image src="/images/logo.png" alt="EnglishByEar Logo" width={width} height={height} className="text-primary" />
    )
}
