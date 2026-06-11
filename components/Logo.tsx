import Image from 'next/image'
import React from 'react'

export default function Logo() {
    return (
        <Image src="/images/logo.png" alt="EnglishByEar Logo" width={50} height={50} className="text-primary" />
    )
}
