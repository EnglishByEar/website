interface QuizProgressProps {
    round: number
    current: number
    total: number
}

export function QuizProgress({ round, current, total }: QuizProgressProps) {
    return (
        <div className="mb-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/60">{`Round ${round} \u00B7 Quiz`}</span>
                <span className="text-sm font-medium text-foreground/60">
                    {current} / {total}
                </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary/50">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(current / total) * 100}%` }}
                />
            </div>
        </div>
    )
}
