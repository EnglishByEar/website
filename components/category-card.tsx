import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { GrammarCategory } from '@/types/grammar'

interface CategoryCardProps {
    category: GrammarCategory
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`grammar/${category.slug}`}>
            <div className="group relative h-full overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary">
                <div className="flex flex-col gap-3">
                    <div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                            {category.title}
                        </h3>
                        <p className="mt-2 text-sm text-foreground/70 line-clamp-2">
                            {category.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <span className="inline-flex items-center rounded-full bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground">
                            {category.lessonCount} lessons
                        </span>
                        <ArrowRight className="h-4 w-4 text-foreground/50 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    )
}
