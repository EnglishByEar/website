import { CategoryCard } from '@/components/category-card'
import { grammarCategories } from '@/data/grammar/categories'

export const metadata = {
    title: 'Grammar Topics - Grammar Hub',
    description: 'Explore all grammar topics including tenses, sentence structure, and more.',
}

export default function GrammarPage() {
    return (
        <>
            <main className="min-h-screen bg-background">
                <div className="px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-12">
                            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                                English Grammar Topics
                            </h1>
                            <p className="text-lg text-foreground/70">
                                Choose a topic below to start learning. Each category contains comprehensive lessons
                                with examples and explanations.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {grammarCategories.map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>
                    </div>
                </div>

                <footer className="border-t border-border px-4 py-8 text-center text-sm text-foreground/60">
                    <p>&copy; 2024 Grammar Hub. Learning English, one lesson at a time.</p>
                </footer>
            </main>
        </>
    )
}
