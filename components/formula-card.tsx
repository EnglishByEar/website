import type { Formula } from '@/types/grammar'

interface FormulaCardProps {
    formula: Formula
}

export function FormulaCard({ formula }: FormulaCardProps) {
    return (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                Grammar Formula
            </h3>
            <div className="space-y-3">
                <div className="text-lg font-mono font-semibold text-foreground">
                    {formula.structure}
                </div>
                {formula.breakdown && (
                    <div className="border-t border-primary/20 pt-3">
                        <p className="text-sm text-foreground/70">{formula.breakdown}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
