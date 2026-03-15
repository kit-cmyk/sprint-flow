"use client"

import { Card, CardContent } from "@/components/ui/card"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { AlertTriangle } from "lucide-react"

interface PodAllocation {
  name: string
  percentage: number
  color: string
}

interface Developer {
  name: string
  role: string
  totalAllocation: number
  pods: PodAllocation[]
  contextSwitchIndex: number
  risk: "none" | "warning" | "critical"
}

const developers: Developer[] = [
  {
    name: "Sarah Chen",
    role: "Senior Engineer",
    totalAllocation: 115,
    pods: [
      { name: "Momentum", percentage: 50, color: "#34d399" },
      { name: "Velocity", percentage: 40, color: "#2dd4bf" },
      { name: "Atlas", percentage: 25, color: "#60a5fa" },
    ],
    contextSwitchIndex: 3.2,
    risk: "critical",
  },
  {
    name: "Marcus Rivera",
    role: "Full Stack Dev",
    totalAllocation: 108,
    pods: [
      { name: "Horizon", percentage: 60, color: "#f59e0b" },
      { name: "Forge", percentage: 48, color: "#a78bfa" },
    ],
    contextSwitchIndex: 2.8,
    risk: "critical",
  },
  {
    name: "Aisha Patel",
    role: "Backend Engineer",
    totalAllocation: 100,
    pods: [
      { name: "Apex", percentage: 60, color: "#34d399" },
      { name: "Atlas", percentage: 40, color: "#60a5fa" },
    ],
    contextSwitchIndex: 1.5,
    risk: "none",
  },
  {
    name: "Jake Thompson",
    role: "Frontend Dev",
    totalAllocation: 90,
    pods: [
      { name: "Momentum", percentage: 50, color: "#34d399" },
      { name: "Forge", percentage: 40, color: "#a78bfa" },
    ],
    contextSwitchIndex: 1.8,
    risk: "none",
  },
  {
    name: "Li Wei",
    role: "QA Lead",
    totalAllocation: 95,
    pods: [
      { name: "Velocity", percentage: 35, color: "#2dd4bf" },
      { name: "Horizon", percentage: 30, color: "#f59e0b" },
      { name: "Apex", percentage: 30, color: "#34d399" },
    ],
    contextSwitchIndex: 2.4,
    risk: "warning",
  },
  {
    name: "Emma Kowalski",
    role: "DevOps Engineer",
    totalAllocation: 80,
    pods: [
      { name: "Atlas", percentage: 40, color: "#60a5fa" },
      { name: "Forge", percentage: 40, color: "#a78bfa" },
    ],
    contextSwitchIndex: 1.2,
    risk: "none",
  },
]

function AllocationBar({ pods, total }: { pods: PodAllocation[]; total: number }) {
  const maxWidth = Math.max(total, 100)
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div className="flex h-full">
          {pods.map((pod, i) => (
            <div
              key={pod.name}
              className="h-full transition-all"
              style={{
                width: `${(pod.percentage / maxWidth) * 100}%`,
                backgroundColor: pod.color,
                opacity: 0.85 - i * 0.1,
                borderRight:
                  i < pods.length - 1 ? "1px solid hsl(var(--background))" : "none",
              }}
              title={`${pod.name}: ${pod.percentage}%`}
            />
          ))}
        </div>
        {total > 100 && (
          <div
            className="absolute top-0 h-full border-r-2 border-dashed border-red-400"
            style={{ left: `${(100 / maxWidth) * 100}%` }}
          />
        )}
      </div>
    </div>
  )
}

function getRiskStyles(risk: Developer["risk"]) {
  switch (risk) {
    case "critical":
      return "text-red-400"
    case "warning":
      return "text-amber-400"
    default:
      return "text-muted-foreground"
  }
}

export function CapacityAllocation() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Capacity Allocation Map
        </h2>
        <p className="text-xs text-muted-foreground">
          Developer utilization and context switching across pods
        </p>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Developer</th>
                  <th className="px-4 py-3 font-medium"><span className="flex items-center">Allocation<InfoTooltip text="Total time allocated across all pods. Over 100% means the developer is overcommitted." /></span></th>
                  <th className="px-4 py-3 font-medium min-w-[200px]">
                    Pod Distribution
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    <span className="flex items-center justify-center">Context Switch<InfoTooltip text="Measures how frequently a developer switches between pods. Above 2.5 indicates fragmentation risk." /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-center">Risk</th>
                </tr>
              </thead>
              <tbody>
                {developers.map((dev) => (
                  <tr
                    key={dev.name}
                    className="border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{dev.name}</p>
                        <p className="text-xs text-muted-foreground">{dev.role}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-semibold ${
                          dev.totalAllocation > 100
                            ? "text-red-400"
                            : "text-foreground"
                        }`}
                      >
                        {dev.totalAllocation}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        <AllocationBar pods={dev.pods} total={dev.totalAllocation} />
                        <div className="flex flex-wrap gap-2">
                          {dev.pods.map((pod) => (
                            <div
                              key={pod.name}
                              className="flex items-center gap-1 text-[10px] text-muted-foreground"
                            >
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: pod.color }}
                              />
                              {pod.name} {pod.percentage}%
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-sm font-medium ${
                          dev.contextSwitchIndex > 2.5
                            ? "text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {dev.contextSwitchIndex.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {dev.risk !== "none" ? (
                        <div className="flex items-center justify-center">
                          <AlertTriangle
                            className={`h-4 w-4 ${getRiskStyles(dev.risk)}`}
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 p-3 md:hidden">
            {developers.map((dev) => (
              <div
                key={dev.name}
                className="rounded-lg border border-border/50 bg-secondary/30 p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{dev.name}</p>
                    <p className="text-xs text-muted-foreground">{dev.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        dev.totalAllocation > 100
                          ? "text-red-400"
                          : "text-foreground"
                      }`}
                    >
                      {dev.totalAllocation}%
                    </span>
                    {dev.risk !== "none" && (
                      <AlertTriangle
                        className={`h-4 w-4 ${getRiskStyles(dev.risk)}`}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <AllocationBar pods={dev.pods} total={dev.totalAllocation} />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {dev.pods.map((pod) => (
                      <div
                        key={pod.name}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: pod.color }}
                        />
                        {pod.name} {pod.percentage}%
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    Context Switch:{" "}
                    <span
                      className={
                        dev.contextSwitchIndex > 2.5
                          ? "text-amber-400 font-medium"
                          : ""
                      }
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
