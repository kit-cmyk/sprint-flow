"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, AlertTriangle, ArrowRight } from "lucide-react"
import type { DeveloperData } from "@/lib/developer-data"

export function RiskSignals({ dev }: { dev: DeveloperData }) {
  if (dev.riskSignals.length === 0) {
    return (
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Delivery Risk Signals
            </h2>
            <p className="text-xs text-muted-foreground">
              No active risk signals detected
            </p>
          </div>
        </div>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center justify-center p-8">
            <p className="text-sm text-emerald-400">
              All clear -- no delivery risks detected this sprint.
            </p>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Delivery Risk Signals
          </h2>
          <p className="text-xs text-muted-foreground">
            Intelligent analysis from workload telemetry
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1">
          <AlertTriangle className="h-3 w-3 text-red-400" />
          <span className="text-xs font-medium text-red-400">
            {dev.riskSignals.length} signal
            {dev.riskSignals.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <Card className="overflow-hidden border-border bg-card">
        <div className="h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
        <CardContent className="p-0">
          <div className="flex flex-col divide-y divide-border">
            {dev.riskSignals.map((signal, index) => (
              <div
                key={index}
                className="group flex items-start gap-3 p-4 transition-colors hover:bg-secondary/30"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-red-500/10">
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                </div>
                <p className="min-w-0 flex-1 text-sm leading-relaxed text-foreground/90">
                  {signal}
                </p>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
