import { BarChart2, Headphones, Trophy } from 'lucide-react'
import React from 'react'

const features = [
    {
        icon: Headphones,
        title: 'Listen & type',
        description:
            'Listen to English texts and type what you hear to sharpen your comprehension.',
    },
    {
        icon: BarChart2,
        title: 'Track progress',
        description:
            'Monitor your improvement with detailed statistics and performance metrics.',
    },
    {
        icon: Trophy,
        title: 'Compete & achieve',
        description:
            'Join leaderboards and complete daily challenges to earn achievements.',
    },
]

export default function FeatureSection() {
    return (
        <section className="container border-t border-border py-20 md:py-28">
            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
                {features.map((feature) => (
                    <div key={feature.title} className="flex flex-col gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-card">
                            <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
