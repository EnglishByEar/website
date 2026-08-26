import { LessonCard } from '@/components/lesson-card'
import { getCategoryBySlug } from '@/data/grammar/categories'
import { getLessonsByCategory } from '@/data/grammar/tenses'
import { notFound } from 'next/navigation'

export const metadata = {
    title: 'English Tenses - English By Ear',
    description: 'Master all English verb tenses with clear explanations and examples.',
}

export default function TensesPage() {
    const category = getCategoryBySlug('tenses')

    if (!category) {
        notFound()
    }

    const lessons = getLessonsByCategory('tenses')

    return (
        <>
            <main className="min-h-screen bg-background">
                <div className="px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Grammar section</p>
                            <h1 className="text-4xl font-bold text-foreground mb-4">{category.title}</h1>
                            <p className="text-lg text-foreground/70 mb-6">{category.description}</p>
                            <div className="inline-flex items-center rounded-full bg-secondary/50 px-4 py-2">
                                <span className="text-sm font-medium text-secondary-foreground">
                                    {lessons.length} lessons
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 gap-2 flex flex-col">
                            {lessons.map((lesson) => (
                                <LessonCard
                                    key={lesson.id}
                                    lesson={lesson}
                                    categorySlug={category.slug}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
