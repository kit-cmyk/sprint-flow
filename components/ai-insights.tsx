"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowRight } from "lucide-react"

interface Insight {
  id: string
  text: string
  category: "velocity" | "quality" | "capacity"
  confidence: number
}

const insights: Insight[] = [
  {
    id: "1",
    text: "Velocity dropped 18% in Momentum Pod \u2013 Client B due to increased PR review time (42h avg). Recommend adjusting WIP limits and pairing reviewers to reduce cycle time.",
    category: "velocity",
    confidence: 92,
  },
  {
    id: "2",
    text: "QA backlog trending upward in 2 pods (Velocity, Horizon). At current throughput, 34% of story points risk carryover next cycle. Suggest reallocating QA capacity from Apex Pod.",
    category: "quality",
    confidence: 87,
  },
  {
    id: "3",
    text: "Sarah Chen and Marcus Rivera are over-allocated (115% and 108% respectively). Historical data shows developer churn risk increases 3x when sustained above 100% for 2+ sprints.",
    category: "capacity",
    confidence: 94,
  },
]

function getCategoryStyles(category: Insight["category"]) {
  switch (category) {
    case "velocity":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        label: "Velocity",
      }
    case "quality":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        label: "Quality",
      }
    case "capacity":
      return {
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        label: "Capacity",
      }
  }
}

export function AIInsights() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              AI Delivery Insights
            </h2>
            <p className="text-xs text-muted-foreground">
              Automated observations from delivery telemetry
            </p>
          </div>
        </div>
      </div>
      <Card className="overflow-hidden border-border bg-card">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <CardContent className="p-0">
          <div className="flex flex-col divide-y divide-border">
            {insights.map((insight) => {
              const styles = getCategoryStyles(insight.category)
              return (
                <div
                  key={insight.id}
                  className="group flex items-start gap-3 p-4 transition-colors hover:bg-secondary/30"
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${styles.bg}`}
                  >
                    <Sparkles className={`h-3 w-3 ${styles.text}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles.bg} ${styles.text}`}
                      >
                        {styles.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {insight.text}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
