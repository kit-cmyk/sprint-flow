"use client"

import { ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Release {
  version: string
  date: string
  summary: string
  highlights: string[]
}

const releases: Release[] = [
  {
    version: "v2.14.3",
    date: "Feb 7, 2025",
    summary:
      "Performance patch with API optimizations and caching improvements.",
    highlights: [
      "22% faster API response times",
      "Improved caching layer",
    ],
  },
  {
    version: "v2.14.2",
    date: "Feb 5, 2025",
    summary:
      "Feature release with automated onboarding validation and CSV import.",
    highlights: [
      "Automated validation checks",
      "Bulk CSV data import",
    ],
  },
  {
    version: "v2.14.1",
    date: "Feb 3, 2025",
    summary: "Stability improvements and bug fixes from Sprint 13 feedback.",
    highlights: [
      "Resolved dashboard loading issues",
      "Improved error handling",
    ],
  },
  {
    version: "v2.13.0",
    date: "Jan 24, 2025",
    summary:
      "Major feature release including analytics module foundation and reporting updates.",
    highlights: [
      "Analytics module Phase 1",
      "Updated reporting engine",
      "New user preferences panel",
    ],
  },
  {
    version: "v2.12.0",
    date: "Jan 10, 2025",
    summary:
      "User management enhancements and security updates.",
    highlights: [
      "Role-based access control",
      "Two-factor authentication",
    ],
  },
]

export function ReleaseHistory() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Release History
      </h2>
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {releases.map((r) => (
              <div
                key={r.version}
                className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-start md:justify-between"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {r.version}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {r.date}
                    </span>
                    <Badge
                      variant="secondary"
                      className="border-0 bg-primary/10 text-xs text-primary"
                    >
                      Stable
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {r.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {r.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  Release Notes
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
