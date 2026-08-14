import { BarChart2, Headphones, Trophy } from 'lucide-react'
import React from 'react'

export default function FeatureSection() {
    return (
        <section className="px-4">
            <div className="container py-12 md:py-24 rounded-3xl lg:py-32 w-full">
                <div className="mx-auto grid items-center gap-12 py-12 lg:grid-cols-3">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Headphones className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Listen & Type</h3>
                        <p className="text-muted-foreground">
                            Listen to English texts and type what you hear to improve your comprehension
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <BarChart2 className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Track Progress</h3>
                        <p className="text-muted-foreground">
                            Monitor your improvement with detailed statistics and performance metrics
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Trophy className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Compete & Achieve</h3>
                        <p className="text-muted-foreground">
                            Join leaderboards and complete daily challenges to earn achievements
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
