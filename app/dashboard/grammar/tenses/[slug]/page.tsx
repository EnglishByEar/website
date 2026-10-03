import { FormulaCard } from '@/components/formula-card'
import { ExampleCard } from '@/components/example-card'
import { MistakeCard } from '@/components/mistake-card'
import { LessonCard } from '@/components/lesson-card'
import { getCategoryBySlug } from '@/data/grammar/categories'
import { getLessonBySlug, getLessonsByCategory } from '@/data/grammar/tenses'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface LessonPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: LessonPageProps) {
    const { slug } = await params
    const lesson = getLessonBySlug(slug)

    if (!lesson) {
        return {
            title: 'Lesson Not Found',
            description: 'The requested grammar lesson could not be found.',
        }
    }

    return {
        title: `${lesson.title} - English By Ear`,
        description: lesson.description,
    }
}

export function generateStaticParams() {
    const lessons = getLessonsByCategory('tenses')
    return lessons.map((lesson) => ({
        slug: lesson.id,
    }))
}

export default async function LessonPage({ params }: LessonPageProps) {
    const { slug } = await params
    const lesson = getLessonBySlug(slug)
    const category = getCategoryBySlug('tenses')

    if (!lesson || !category) {
        notFound()
    }

    const allLessons = getLessonsByCategory('tenses')
    const currentIndex = allLessons.findIndex((l) => l.id === lesson.id)
    const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    return (
        <>
            <main className="min-h-screen bg-background">
                <div className="px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-4xl">
                        <Link href="/dashboard/grammar/tenses" className="mb-8 inline-flex items-center text-sm font-medium text-primary hover:opacity-80">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to tenses
                        </Link>
                        <div className="mb-8 flex items-center gap-2 text-sm text-foreground/60">
                            <Link href="/dashboard/grammar" className="hover:text-foreground transition-colors">
                                Grammar
                            </Link>
                            <span>/</span>
                            <Link
                                href={`/dashboard/grammar/${category.slug}`}
                                className="hover:text-foreground transition-colors"
                            >
                                {category.title}
                            </Link>
                            <span>/</span>
                            <span className="text-foreground">{lesson.title}</span>
                        </div>

                        <div className="mb-12">
                            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                                {lesson.title}
                            </h1>
                            <p className="text-lg text-foreground/70">{lesson.description}</p>
                        </div>

                        <div className="space-y-12">
                            <section>
                                <FormulaCard formula={lesson.formula} />
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">Explanation</h2>
                                <div className="rounded-lg border border-border bg-card p-6">
                                    <p className="text-foreground/80 leading-relaxed">{lesson.explanation}</p>
                                </div>
                            </section>
                            {lesson.usage && (
                                <section>
                                    <h2 className="text-2xl font-bold text-foreground mb-4">When to Use It</h2>
                                    <div className="rounded-lg border border-border bg-card p-6">
                                        <p className="text-foreground/80">{lesson.usage}</p>
                                    </div>
                                </section>
                            )}

                            {lesson.signalWords && lesson.signalWords.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold text-foreground mb-4">Signal Words</h2>
                                    <div className="rounded-lg border border-border bg-card p-6">
                                        <div className="flex flex-wrap gap-3">
                                            {lesson.signalWords.map((word) => (
                                                <span
                                                    key={word}
                                                    className="inline-flex items-center rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            <section>
                                <ExampleCard examples={lesson.examples} />
                            </section>

                            <section>
                                <MistakeCard mistakes={lesson.commonMistakes} />
                            </section>
                        </div>

                        <div className="mt-16 border-t border-border pt-8">
                            <div className="grid grid-cols-2 gap-4">
                                {previousLesson ? (
                                    <Link href={`/dashboard/grammar/tenses/${previousLesson.id}`}>
                                        <button className="w-full flex items-center gap-2 rounded-lg border border-border bg-card p-4 text-left hover:border-primary hover:text-primary transition-colors">
                                            <ArrowLeft className="h-5 w-5" />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs text-foreground/60 mb-1">Previous</div>
                                                <div className="font-semibold line-clamp-1">{previousLesson.title}</div>
                                            </div>
                                        </button>
                                    </Link>
                                ) : (
                                    <div />
                                )}

                                {nextLesson ? (
                                    <Link href={`/dashboard/grammar/tenses/${nextLesson.id}`}>
                                        <button className="w-full flex items-center justify-end gap-2 rounded-lg border border-border bg-card p-4 text-right hover:border-primary hover:text-primary transition-colors">
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs text-foreground/60 mb-1">Next</div>
                                                <div className="font-semibold line-clamp-1">{nextLesson.title}</div>
                                            </div>
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    </Link>
                                ) : (
                                    <div />
                                )}
                            </div>
                        </div>

                        {lesson.relatedTopics && lesson.relatedTopics.length > 0 && (
                            <section className="mt-16 border-t border-border pt-12">
                                <h2 className="text-2xl font-bold text-foreground mb-6">Related Topics</h2>
                                <div className="space-y-3">
                                    {lesson.relatedTopics
                                        .map((id) => allLessons.find((l) => l.id === id))
                                        .filter(Boolean)
                                        .map((relatedLesson) =>
                                            relatedLesson ? (
                                                <LessonCard
                                                    key={relatedLesson.id}
                                                    lesson={relatedLesson}
                                                    categorySlug={category.slug}
                                                />
                                            ) : null,
                                        )}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}
