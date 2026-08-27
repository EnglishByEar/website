import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { ArrowRight, Play } from 'lucide-react'

export default function HeroSection() {
    return (
        <section className="container relative flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center py-20 text-center">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Learn English by ear, one sentence at a time
                </div>

                <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                    Master English listening skills
                </h1>

                <p className="max-w-xl text-balance text-lg text-muted-foreground md:text-xl">
                    Practice listening to real English at your own pace, type what you hear,
                    and watch your comprehension grow over time.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Link href="/register">
                        <Button size="lg" className="w-full gap-2 sm:w-auto">
                            Get started
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/podcast">
                        <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                            <Play className="h-4 w-4" />
                            Listen to a podcast
                        </Button>
                    </Link>
                </div>

                <Waveform />
            </div>
        </section>
    )
}

function Waveform() {
    const bars = [
        18, 34, 52, 40, 68, 88, 60, 30, 46, 74, 96, 70, 44, 24, 54, 82, 62, 38,
        58, 90, 66, 42, 28, 50, 78, 100, 72, 48, 32, 20,
    ]

    return (
        <div
            className="mt-8 flex h-24 w-full max-w-2xl items-center justify-center gap-1.5"
            aria-hidden="true"
        >
            {bars.map((height, i) => (
                <div
                    key={i}
                    className="w-1.5 rounded-full bg-primary/60"
                    style={{
                        height: `${height}%`,
                        opacity: 0.35 + (height / 100) * 0.65,
                    }}
                />
            ))}
        </div>
    )
}
