"use client"

import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Priority {
  title: string
  description: string
  category: string
}

const priorities: Priority[] = [
  {
    title: "Advanced Analytics Dashboard",
    description:
      "Complete the analytics module with interactive charts, data export, and scheduled reports.",
    category: "Feature",
  },
  {
    title: "Notification System",
    description:
      "Implement real-time notifications for key events including email and in-app delivery.",
    category: "Feature",
  },
  {
    title: "API Rate Limiting & Throttling",
    description:
      "Add rate limiting to public API endpoints for improved security and reliability.",
    category: "Infrastructure",
  },
  {
    title: "User Activity Audit Log",
    description:
      "Searchable log of all user actions for compliance and transparency requirements.",
    category: "Compliance",
  },
  {
    title: "Performance Benchmarking",
    description:
      "Establish performance baselines and automated regression detection across critical paths.",
    category: "Quality",
  },
]

function categoryColor(cat: string) {
  switch (cat) {
    case "Feature":
      return "bg-primary/10 text-primary"
    case "Infrastructure":
      return "bg-accent/10 text-accent"
    case "Compliance":
      return "bg-secondary text-secondary-foreground"
    case "Quality":
      return "bg-primary/10 text-primary"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function UpcomingPriorities() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Next Sprint Focus
      </h2>
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {priorities.map((p, i) => (
              <div
                key={p.title}
                className="flex items-start gap-4 px-6 py-5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                  {i + 1}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {p.title}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`border-0 text-xs ${categoryColor(p.category)}`}
                    >
                      {p.category}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
