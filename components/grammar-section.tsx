import React from 'react'
import { CategoryCard } from './category-card'
import { grammarCategories } from "@/data/grammar/categories"
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function GrammarSection() {
    const featuredCategories = grammarCategories.slice(0, 3)

    return (
        <section id="featured" className="container border-t border-border py-20 md:py-28">
            <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                <div className="max-w-lg">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Grammar essentials</h2>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                        Start with these popular grammar categories to build a strong foundation.
                    </p>
                </div>
                <Link
                    href="/grammar"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80"
                >
                    View all topics
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </section>
    )
}
