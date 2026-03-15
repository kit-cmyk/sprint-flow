"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

type WipStatus = "over" | "healthy"

interface DeveloperWip {
  name: string
  activeTickets: number
  wipLimit: number
  status: WipStatus
  contextSwitchIndex: number
}

const wipData: DeveloperWip[] = [
  { name: "Sarah Chen", activeTickets: 5, wipLimit: 3, status: "over", contextSwitchIndex: 3.2 },
  { name: "Marcus Rivera", activeTickets: 4, wipLimit: 3, status: "over", contextSwitchIndex: 2.8 },
  { name: "Aisha Patel", activeTickets: 2, wipLimit: 3, status: "healthy", contextSwitchIndex: 1.2 },
  { name: "Jake Thompson", activeTickets: 3, wipLimit: 3, status: "healthy", contextSwitchIndex: 1.6 },
  { name: "Li Wei", activeTickets: 3, wipLimit: 4, status: "healthy", contextSwitchIndex: 1.9 },
]

export function WipControl() {
  const overCount = wipData.filter((d) => d.status === "over").length

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Work-in-Progress Control
          </h2>
          <p className="text-xs text-muted-foreground">
            Developer WIP limits and context switching
          </p>
        </div>
        {overCount > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1">
            <AlertTriangle className="h-3 w-3 text-red-400" />
            <span className="text-xs font-medium text-red-400">
              {overCount} Over Limit
            </span>
          </div>
        )}
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Developer</th>
                  <th className="px-4 py-3 font-medium text-center">Active Tickets</th>
                  <th className="px-4 py-3 font-medium text-center">WIP Limit</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                  <th className="px-4 py-3 font-medium text-center">Context Switch</th>
                </tr>
              </thead>
              <tbody>
                {wipData.map((dev) => (
                  <tr
                    key={dev.name}
                    className={`border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/50 ${
                      dev.status === "over" ? "bg-red-500/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {dev.name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-semibold ${
                          dev.status === "over" ? "text-red-400" : "text-foreground"
                        }`}
                      >
                        {dev.activeTickets}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      {dev.wipLimit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {dev.status === "over" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-red-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          Over
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Healthy
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-medium ${
                          dev.contextSwitchIndex > 2.5
                            ? "text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {dev.contextSwitchIndex.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 p-3 md:hidden">
            {wipData.map((dev) => (
              <div
                key={dev.name}
                className={`rounded-lg border p-3 ${
                  dev.status === "over"
                    ? "border-red-500/20 bg-red-500/5"
                    : "border-border/50 bg-secondary/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{dev.name}</span>
                  {dev.status === "over" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      Over
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      Healthy
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    Active:{" "}
                    <span
                      className={`font-semibold ${
                        dev.status === "over" ? "text-red-400" : "text-foreground"
                      }`}
                    >
                      {dev.activeTickets}
                    </span>
                    /{dev.wipLimit}
                  </span>
                  <span>
                    Context Switch:{" "}
                    <span
                      className={`font-medium ${
                        dev.contextSwitchIndex > 2.5 ? "text-amber-400" : ""
                      }`}
                    >
                      {dev.contextSwitchIndex.toFixed(1)}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
