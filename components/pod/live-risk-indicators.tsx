"use client"

import { Card, CardContent } from "@/components/ui/card"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import {
  Ban,
  Clock,
  GitPullRequest,
  Layers,
  Bug,
  Undo2,
  RotateCcw,
} from "lucide-react"

type RiskLevel = "green" | "yellow" | "red"

interface RiskIndicator {
  label: string
  value: number
  threshold: { yellow: number; red: number }
  icon: React.ElementType
}

function getRiskLevel(value: number, threshold: { yellow: number; red: number }): RiskLevel {
  if (value >= threshold.red) return "red"
  if (value >= threshold.yellow) return "yellow"
  return "green"
}

function getRiskStyles(level: RiskLevel) {
  switch (level) {
    case "red":
      return {
        border: "border-red-500/30",
        bg: "bg-red-500/5",
        iconBg: "bg-red-500/10",
        iconColor: "text-red-400",
        valueColor: "text-red-400",
        dot: "bg-red-500",
      }
    case "yellow":
      return {
        border: "border-amber-500/30",
        bg: "bg-amber-500/5",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-400",
        valueColor: "text-amber-400",
        dot: "bg-amber-500",
      }
    case "green":
      return {
        border: "border-emerald-500/20",
        bg: "bg-card",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
        valueColor: "text-foreground",
        dot: "bg-emerald-500",
      }
  }
}

const indicators: (RiskIndicator & { tip: string })[] = [
  {
    label: "Blockers >24h",
    value: 2,
    threshold: { yellow: 1, red: 2 },
    icon: Ban,
    tip: "Number of active blocker tickets unresolved for more than 24 hours.",
  },
  {
    label: "Tickets Aging >5d",
    value: 3,
    threshold: { yellow: 2, red: 4 },
    icon: Clock,
    tip: "Tickets that have been in progress for over 5 days without moving forward.",
  },
  {
    label: "PRs Waiting >36h",
    value: 4,
    threshold: { yellow: 2, red: 3 },
    icon: GitPullRequest,
    tip: "Pull requests awaiting review for more than 36 hours, creating delivery bottlenecks.",
  },
  {
    label: "WIP Violations",
    value: 1,
    threshold: { yellow: 1, red: 2 },
    icon: Layers,
    tip: "Team Pod members exceeding their work-in-progress ticket limit, risking context switching.",
  },
  {
    label: "QA Backlog Growth",
    value: 3,
    threshold: { yellow: 2, red: 5 },
    icon: Bug,
    tip: "Number of tickets entering QA faster than they are being verified and closed.",
  },
  {
    label: "Return to Dev",
    value: 2,
    threshold: { yellow: 1, red: 3 },
    icon: Undo2,
    tip: "Tickets that were in QA but moved back to Dev due to defects or incomplete implementation.",
  },
  {
    label: "Return to Refinement",
    value: 1,
    threshold: { yellow: 1, red: 2 },
    icon: RotateCcw,
    tip: "Tickets that were in Ready for Dev status but returned to Refinement due to unclear requirements or scope changes.",
  },
]

export function LiveRiskIndicators() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Live Risk Indicators
        </h2>
        <p className="text-xs text-muted-foreground">
          Real-time attention signals for this sprint
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {indicators.map((indicator) => {
          const level = getRiskLevel(indicator.value, indicator.threshold)
          const styles = getRiskStyles(level)
          const Icon = indicator.icon

          return (
            <Card
              key={indicator.label}
              className={`cursor-pointer border transition-colors ${styles.border} ${styles.bg} hover:bg-secondary/50`}
            >
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${styles.iconColor}`} />
                </div>
                <span
                  className={`text-2xl font-bold ${styles.valueColor}`}
                >
                  {indicator.value}
                </span>
                <span className="flex items-center justify-center gap-0.5 text-[11px] leading-tight text-muted-foreground">
                  {indicator.label}
                  <InfoTooltip text={indicator.tip} />
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
