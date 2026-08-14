import React from 'react'
import { CategoryCard } from './category-card'
import { grammarCategories } from "@/data/grammar/categories"
import Link from 'next/link';

export default function GrammarSection() {
    const featuredCategories = grammarCategories.slice(0, 3);

    return (
        <section id="featured" className="container relative px-4 py-12 sm:py-16">
            <div>
                <div className="mb-12 flex justify-between items-center gap-4 flex-col sm:flex-row">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">Grammar</h2>
                        <p className="text-foreground/70">
                            Start with these popular grammar categories to build a strong foundation.
                        </p>
                    </div>
                    <div className="text-center pt-6">
                        <Link
                            href="/grammar"
                            className="inline-flex items-center text-primary font-semibold hover:opacity-80 transition-opacity"
                        >
                            View All Topics →
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {featuredCategories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </section>
    )
}
