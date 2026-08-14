import React from 'react'
import Pattern from './pattern'
import Logo from './Logo'
import Link from 'next/link'
import { Button } from './ui/button'

export default function HeroSection() {
    return (
        <section className="container py-16 md:py-24 lg:py-32 min-h-screen flex justify-center items-center">
            <Pattern />
            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
                <div className="flex flex-col items-center gap-4">
                    <p className="float-text"><Logo width={150} height={150} /></p>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                        Master English Listening Skills with EnglishByEar
                    </h1>
                </div>
                <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
                    Practice listening to English texts at your own pace and track your progress over time.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Link href="/register">
                        <Button size="lg" className="w-full sm:w-auto">
                            Get Started
                        </Button>
                    </Link>
                    <Link href="/about">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
