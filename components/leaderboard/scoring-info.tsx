import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ACCURACY_BONUS_TIERS, BASE_POINTS_PER_EXERCISE } from "@/lib/leaderboard/config"

export function ScoringInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How scoring works</CardTitle>
        <CardDescription>Understanding the leaderboard ranking system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium">Base score</h4>
            <p className="text-sm text-muted-foreground">
              Each completed exercise gives you {BASE_POINTS_PER_EXERCISE} points
            </p>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Accuracy bonus</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {ACCURACY_BONUS_TIERS.map((t) => (
                <div key={t.minAccuracy}>
                  Over {t.minAccuracy}% average accuracy: +{t.bonus} points per exercise
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="border-t pt-4 text-sm text-muted-foreground">
          <strong>Example:</strong> 10 exercises at 90% average accuracy = (10 × 10) + (10 × 15) = 250 points
        </p>
      </CardContent>
    </Card>
  )
}