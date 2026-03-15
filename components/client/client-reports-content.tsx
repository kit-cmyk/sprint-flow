"use client"

import Link from "next/link"
import { FileText, Calendar, ArrowRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

// Mock pulse check reports - these would come from the database
const pulseReports = [
  { 
    id: "pr-3", 
    title: "Week of Feb 10, 2025", 
    date: "Feb 14, 2025", 
    summary: "Sprint 14 progress update with 85% completion rate. Key milestones achieved in user authentication and dashboard improvements.",
    author: "Sarah Chen",
    status: "published"
  },
  { 
    id: "pr-2", 
    title: "Week of Feb 3, 2025", 
    date: "Feb 7, 2025", 
    summary: "Sprint 13 wrap-up featuring API integration completion and mobile responsiveness enhancements. Team velocity maintained at 42 SP.",
    author: "Alex Kim",
    status: "published"
  },
  { 
    id: "pr-1", 
    title: "Week of Jan 27, 2025", 
    date: "Jan 31, 2025", 
    summary: "Sprint 12 highlights including database optimization and new feature releases. Successfully delivered payment integration module.",
    author: "Sarah Chen",
    status: "published"
  },
]

export function ClientReportsContent() {
  return (
    <div className="h-screen overflow-y-auto bg-background">
      <div className="mx-auto max-w-6xl p-4 pb-20 md:p-6 md:pb-24 lg:p-8">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Pulse Check Reports
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Weekly updates and sprint summaries from your development team
            </p>
          </div>

        </div>

        {/* Reports List */}
        <div className="mt-6 space-y-4">
          {pulseReports.map((report) => (
            <Card key={report.id} className="border-border bg-card transition-colors hover:bg-muted/30">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-foreground">{report.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.date}
                        </span>
                        <span className="text-border">|</span>
                        <span>By {report.author}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {report.summary}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/client-dashboard/pulse/${report.id}`}
                    className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    View Report
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (when no reports) */}
        {pulseReports.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No Reports Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pulse check reports will appear here once your team publishes them.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
