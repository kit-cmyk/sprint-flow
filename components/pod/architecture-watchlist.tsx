"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

type RiskLevel = "high" | "medium" | "low"
type StoryType = "cross-module" | "db-change" | "integration" | "refactor"

interface ArchStory {
  ticket: string
  title: string
  owner: string
  status: string
  riskLevel: RiskLevel
  type: StoryType
  requiresReview: boolean
}

const stories: ArchStory[] = [
  {
    ticket: "PROJ-330",
    title: "Migrate auth service to OAuth2",
    owner: "Sarah Chen",
    status: "In Progress",
    riskLevel: "high",
    type: "cross-module",
    requiresReview: true,
  },
  {
    ticket: "PROJ-345",
    title: "Database schema v3 migration",
    owner: "Marcus Rivera",
    status: "Code Review",
    riskLevel: "high",
    type: "db-change",
    requiresReview: true,
  },
  {
    ticket: "PROJ-358",
    title: "Payment gateway integration",
    owner: "Aisha Patel",
    status: "In Progress",
    riskLevel: "medium",
    type: "integration",
    requiresReview: true,
  },
  {
    ticket: "PROJ-370",
    title: "Refactor notification service",
    owner: "Jake Thompson",
    status: "To Do",
    riskLevel: "low",
    type: "refactor",
    requiresReview: false,
  },
]

function getRiskStyle(level: RiskLevel) {
  switch (level) {
    case "high":
      return "bg-red-500/15 text-red-400"
    case "medium":
      return "bg-amber-500/15 text-amber-400"
    case "low":
      return "bg-emerald-500/15 text-emerald-400"
  }
}

function getTypeStyle(type: StoryType) {
  switch (type) {
    case "cross-module":
      return { label: "Cross-Module", bg: "bg-purple-500/10", text: "text-purple-400" }
    case "db-change":
      return { label: "DB Change", bg: "bg-sky-500/10", text: "text-sky-400" }
    case "integration":
      return { label: "Integration", bg: "bg-amber-500/10", text: "text-amber-400" }
    case "refactor":
      return { label: "Refactor", bg: "bg-emerald-500/10", text: "text-emerald-400" }
  }
}

export function ArchitectureWatchlist() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
          <Shield className="h-4 w-4 text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Architecture Risk Stories
          </h2>
          <p className="text-xs text-muted-foreground">
            Flagged stories requiring elevated oversight
          </p>
        </div>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Ticket</th>
                  <th className="px-4 py-3 font-medium">Story</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-center">Type</th>
                  <th className="px-4 py-3 font-medium text-center">Risk</th>
                  <th className="px-4 py-3 font-medium text-center">Review</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => {
                  const typeStyle = getTypeStyle(story.type)
                  return (
                    <tr
                      key={story.ticket}
                      className="border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/50"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-medium text-foreground">
                          {story.ticket}
                        </span>
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-foreground">
                        {story.title}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {story.owner}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {story.status}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${typeStyle.bg} ${typeStyle.text}`}
                        >
                          {typeStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${getRiskStyle(story.riskLevel)}`}
                        >
                          {story.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {story.requiresReview ? (
                          <span className="text-xs font-semibold text-amber-400">Yes</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">No</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 p-3 md:hidden">
            {stories.map((story) => {
              const typeStyle = getTypeStyle(story.type)
              return (
                <div
                  key={story.ticket}
                  className="rounded-lg border border-border/50 bg-secondary/30 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium text-foreground">
                      {story.ticket}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${getRiskStyle(story.riskLevel)}`}
                    >
                      {story.riskLevel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{story.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{story.owner}</span>
                    <span className="text-border">|</span>
                    <span>{story.status}</span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${typeStyle.bg} ${typeStyle.text}`}
                    >
                      {typeStyle.label}
                    </span>
                    {story.requiresReview && (
                      <span className="text-[10px] font-semibold text-amber-400">
                        Review Required
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
