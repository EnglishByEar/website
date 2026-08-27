import { BarChart2, Headphones, Trophy } from 'lucide-react'
import React from 'react'
import Reveal from './reveal'

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
                {features.map((feature, i) => (
                    <Reveal
                        key={feature.title}
                        delay={i * 120}
                        className="group flex flex-col gap-4"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-card transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10">
                            <feature.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                        </p>
                    </Reveal>
                ))}
            </div>
        </section>
    )
}
