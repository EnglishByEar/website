import Link from 'next/link'
import { BookMarked, ArrowRight } from 'lucide-react'
import type { GrammarLesson } from '@/types/grammar'

interface LessonCardProps {
    lesson: GrammarLesson
    categorySlug: string
}

export function LessonCard({ lesson, categorySlug }: LessonCardProps) {
    const href = `${categorySlug}/${lesson.id}`

    return (
        <Link href={href}>
            <div className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary">
                <div className="flex gap-3">
                    <BookMarked className="h-5 w-5 flex-shrink-0 text-primary mt-1" />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {lesson.title}
                        </h3>
                        <p className="mt-1 text-sm text-foreground/60 line-clamp-2">
                            {lesson.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {lesson.signalWords && lesson.signalWords.slice(0, 2).map((word) => (
                                <span
                                    key={word}
                                    className="inline-block text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded"
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-foreground/50 group-hover:text-primary transition-colors mt-1" />
                </div>
            </div>
        </Link>
    )
}
