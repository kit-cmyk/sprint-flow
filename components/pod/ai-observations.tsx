"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowRight } from "lucide-react"

interface Observation {
  id: string
  text: string
  category: "cycle-time" | "estimation" | "bottleneck"
  confidence: number
}

const observations: Observation[] = [
  {
    id: "1",
    text: "Cycle time increased 22% compared to 3-sprint average. Primary contributor: PR review latency (18.4h avg vs 12h target). Consider adding a dedicated reviewer or pairing protocol to reduce queue time.",
    category: "cycle-time",
    confidence: 94,
  },
  {
    id: "2",
    text: "3 tickets aging beyond 6 days indicate possible scope underestimation. Historical pattern shows similar stories were originally estimated at 3-5 story points but averaged 8+ story points actual effort.",
    category: "estimation",
    confidence: 88,
  },
  {
    id: "3",
    text: "QA backlog growing at 1.5 tickets/day while resolution rate is 0.8/day. At current trajectory, 12 story points will spill to Sprint 15. Recommend pre-allocating QA time for PROJ-345 (DB migration) which historically requires 2x review cycles.",
    category: "bottleneck",
    confidence: 91,
  },
]

function getCategoryStyles(category: Observation["category"]) {
  switch (category) {
    case "cycle-time":
      return { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Cycle Time" }
    case "estimation":
      return { bg: "bg-amber-500/10", text: "text-amber-400", label: "Estimation" }
    case "bottleneck":
      return { bg: "bg-sky-500/10", text: "text-sky-400", label: "Bottleneck" }
  }
}

export function AIObservations() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            AI Sprint Observations
          </h2>
          <p className="text-xs text-muted-foreground">
            Intelligent analysis from delivery telemetry
          </p>
        </div>
      </div>
      <Card className="overflow-hidden border-border bg-card">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <CardContent className="p-0">
          <div className="flex flex-col divide-y divide-border">
            {observations.map((obs) => {
              const styles = getCategoryStyles(obs.category)
              return (
                <div
                  key={obs.id}
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
                        {obs.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {obs.text}
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
