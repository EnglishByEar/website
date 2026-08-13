import { notFound } from 'next/navigation'
import { LessonCard } from '@/components/lesson-card'
import { getCategoryBySlug } from '@/data/grammar/categories'
import { partsOfSpeechLessons } from '@/data/grammar/parts-of-speech'

export const metadata = {
    title: 'Parts of Speech - English By Ear',
    description: 'Learn nouns, pronouns, verbs, adjectives, adverbs, and other parts of speech.',
}

export default function PartsOfSpeechPage() {
    const category = getCategoryBySlug('parts-of-speech')
    if (!category) notFound()

    return (
        <>
            <main className="min-h-screen bg-background">
                <div className="px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Grammar section</p>
                            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">{category.title}</h1>
                            <p className="mt-4 max-w-2xl text-lg leading-7 text-foreground/70">
                                {category.description}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3 text-sm text-foreground/60">
                                <span className="rounded-full bg-secondary/50 px-3 py-1">{partsOfSpeechLessons.length} lessons</span>
                                <span className="rounded-full bg-secondary/50 px-3 py-1">Beginner friendly</span>
                                <span className="rounded-full bg-secondary/50 px-3 py-1">Examples included</span>
                            </div>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                            {partsOfSpeechLessons.map((lesson) => (
                                <LessonCard key={lesson.id} lesson={lesson} categorySlug="parts-of-speech" />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
