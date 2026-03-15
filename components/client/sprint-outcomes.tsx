"use client"

import {
  Package,
  Rocket,
  BarChart3,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const burndownData = [
  { day: "Day 1", remaining: 34 },
  { day: "Day 2", remaining: 31 },
  { day: "Day 3", remaining: 28 },
  { day: "Day 4", remaining: 24 },
  { day: "Day 5", remaining: 20 },
  { day: "Day 6", remaining: 16 },
  { day: "Day 7", remaining: 13 },
  { day: "Day 8", remaining: 9 },
  { day: "Day 9", remaining: 5 },
  { day: "Day 10", remaining: 2 },
]

const deliveredFeatures = [
  "Automated onboarding validation",
  "API performance optimizations",
  "Bulk import CSV support",
]

const deployments = [
  { date: "Feb 3", version: "v2.14.1" },
  { date: "Feb 5", version: "v2.14.2" },
  { date: "Feb 7", version: "v2.14.3" },
]

export function SprintOutcomes() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Sprint Outcomes
      </h2>
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Features Delivered */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Features Delivered
              </span>
            </div>
            <p className="mb-3 text-3xl font-bold text-foreground">3</p>
            <ul className="flex flex-col gap-1.5">
              {deliveredFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Deployments */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <Rocket className="h-4 w-4 text-accent" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Deployments
              </span>
            </div>
            <p className="mb-3 text-3xl font-bold text-foreground">3</p>
            <div className="flex flex-col gap-2">
              {deployments.map((d) => (
                <div
                  key={d.version}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground">
                    {d.date}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-foreground">
                      {d.version}
                    </span>
                    <Badge
                      variant="secondary"
                      className="border-0 bg-primary/10 text-xs text-primary"
                    >
                      Success
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Module Progress */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Module Progress
              </span>
            </div>
            <p className="mb-1 text-3xl font-bold text-foreground">70%</p>
            <p className="mb-3 text-sm text-muted-foreground">
              Analytics Module
            </p>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: "70%" }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Phase 2 of 3</span>
              <span>On Track</span>
            </div>
          </CardContent>
        </Card>

        {/* Burndown */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <BarChart3 className="h-4 w-4 text-accent" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Backlog Trend
              </span>
            </div>
            <div className="h-[120px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={burndownData}>
                  <defs>
                    <linearGradient
                      id="burndownGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(160, 51%, 49%)"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(160, 51%, 49%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(220, 13%, 90%)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "hsl(220, 10%, 46%)" }}
                    axisLine={false}
                    tickLine={false}
                    interval={2}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 13%, 90%)",
                      borderRadius: "8px",
                      fontSize: 12,
                      color: "hsl(220, 15%, 15%)",
                    }}
                    formatter={(value: number) => [
                      `${value} SP`,
                      "Remaining",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="remaining"
                    stroke="hsl(160, 51%, 49%)"
                    strokeWidth={2}
                    fill="url(#burndownGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
