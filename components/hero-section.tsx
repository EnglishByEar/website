import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { ArrowRight, Play } from 'lucide-react'


const messages = [
    "Learn English by ear, one sentence at a time",
    "Practice real conversations, not just grammar rules",
    "Build fluency with everyday listening",
];


export default function HeroSection() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="container relative flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center py-20 text-center">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <div
                    className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground overflow-hidden"
                    style={{ animationDelay: "1ms" }}
                >
                    <span className="animate-pulse-ring h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span key={index} className="animate-slide-text inline-block">
                        {messages[index]}
                    </span>
                </div>

                <h1 className="py-4 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl silver-text-shine">
                    Master English listening skills
                </h1>

                <p className="animate-fade-up max-w-xl text-balance text-lg text-muted-foreground md:text-xl" style={{ animationDelay: '240ms' }}>
                    Practice listening to real English at your own pace, type what you hear,
                    and watch your comprehension grow over time.
                </p>

                <div className="animate-fade-up flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '360ms' }}>
                    <Link href="/register">
                        <Button size="lg" className="group w-full gap-2 sm:w-auto">
                            Get started
                            <ArrowRight className="arrow-nudge h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/podcast">
                        <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                            <Play className="h-4 w-4" />
                            Listen to a podcast
                        </Button>
                    </Link>
                </div>

                <div className="animate-fade-up w-full" style={{ animationDelay: '480ms' }}>
                    <Waveform />
                </div>
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
                    className="animate-wave w-1.5 rounded-full bg-primary/60"
                    style={{
                        height: `${height}%`,
                        opacity: 0.35 + (height / 100) * 0.65,
                        animationDelay: `${(i % 10) * 0.09}s`,
                        animationDuration: `${1.2 + (i % 5) * 0.15}s`,
                    }}
                />
            ))}
        </div>
    )
}
