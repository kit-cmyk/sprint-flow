"use client"

import { TrendingUp, Clock, Rocket, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { InfoTooltip } from "@/components/ui/info-tooltip"

const metrics = [
  {
    label: "SP Delivered This Month",
    value: "24",
    subtitle: "+8 SP from last month",
    icon: Package,
    color: "text-primary" as const,
    bg: "bg-primary/10" as const,
    tip: "Total story points of completed user stories and features shipped to production this calendar month.",
  },
  {
    label: "Average Cycle Time",
    value: "3.2 days",
    subtitle: "Consistent delivery speed",
    icon: Clock,
    color: "text-accent" as const,
    bg: "bg-accent/10" as const,
    tip: "Average number of business days from when work begins on a feature to when it's deployed.",
  },
  {
    label: "Deployment Frequency",
    value: "3x / sprint",
    subtitle: "Regular release cadence",
    icon: Rocket,
    color: "text-primary" as const,
    bg: "bg-primary/10" as const,
    tip: "How often new features and updates are released to production each sprint.",
  },
  {
    label: "Cumulative SP Delivered",
    value: "142",
    subtitle: "Since project start",
    icon: TrendingUp,
    color: "text-accent" as const,
    bg: "bg-accent/10" as const,
    tip: "Total story points of features and user stories delivered since the project kicked off.",
  },
]

export function DeliveryMetrics() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Delivery Metrics
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <Card
              key={m.label}
              className="border-border bg-card shadow-sm"
            >
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${m.bg}`}
                  >
                    <Icon className={`h-4 w-4 ${m.color}`} />
                  </div>
                  <span className="flex items-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {m.label}
                    <InfoTooltip text={m.tip} />
                  </span>
                </div>
                <p className="text-3xl font-bold text-foreground">{m.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {m.subtitle}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
