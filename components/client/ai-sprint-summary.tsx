"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowDown, FileText } from "lucide-react"

export function AISprintSummary({ hasContent = true }: { hasContent?: boolean }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Sprint 14
            <span className="ml-3 inline-flex items-center gap-1.5 align-middle text-sm font-normal text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Week of Feb 17
            </span>
          </h2>
        </div>
        {hasContent && (
          <a
            href="#past-reports"
            className="flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            <ArrowDown className="h-3 w-3" />
            View Past Reports
          </a>
        )}
      </div>

      <Card className="relative overflow-hidden border-border bg-card shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent" />
        <CardContent className="p-6 md:p-8">
          {hasContent ? (
            <div 
              className="prose prose-sm max-w-none text-base leading-relaxed text-foreground prose-headings:text-foreground prose-h1:text-2xl prose-h2:text-xl prose-strong:text-foreground prose-em:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground md:text-lg"
              dangerouslySetInnerHTML={{
                __html: `<p>This sprint focused on enhancing the client onboarding workflow and
              improving API response performance. Three new features were
              successfully deployed, including automated validation checks and
              performance optimizations that reduced load time by 22%.</p>
            <p>The team also advanced the analytics module, bringing it to 70%
              completion. All committed items were delivered on schedule with zero
              production incidents.</p>`
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">No Summary Available Yet</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                The weekly sprint summary will be published here once the team completes their review. Check back soon for updates on this sprint's progress.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
