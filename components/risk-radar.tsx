"use client"

import React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  Users,
} from "lucide-react"

type AlertSeverity = "critical" | "warning"

interface RiskAlert {
  id: string
  severity: AlertSeverity
  message: string
  detail: string
  icon: React.ElementType
}

const alerts: RiskAlert[] = [
  {
    id: "1",
    severity: "critical",
    message: "2 Pods have blockers >24h",
    detail:
      "Horizon Pod and Velocity Pod have unresolved blockers exceeding the 24-hour SLA. Immediate escalation recommended.",
    icon: AlertTriangle,
  },
  {
    id: "2",
    severity: "warning",
    message: "1 Pod below 75% commitment reliability",
    detail:
      "Horizon Pod at 68% commitment reliability for Sprint 14. Pattern indicates scope creep or estimation issues.",
    icon: ShieldAlert,
  },
  {
    id: "3",
    severity: "warning",
    message: "QA backlog increasing in 3 pods",
    detail:
      "Velocity Pod, Forge Pod, and Horizon Pod show growing QA queues. Risk of sprint carryover in the next cycle.",
    icon: Clock,
  },
  {
    id: "4",
    severity: "critical",
    message: "Dev allocation exceeds 100% in 2 cases",
    detail:
      "Sarah Chen (115%) and Marcus Rivera (108%) are over-allocated across multiple pods. Context switching risk is high.",
    icon: Users,
  },
]

function getAlertStyles(severity: AlertSeverity) {
  if (severity === "critical") {
    return {
      bg: "bg-red-500/5 border-red-500/20 hover:bg-red-500/10",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      badge: "bg-red-500/15 text-red-400",
      badgeLabel: "Critical",
    }
  }
  return {
    bg: "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-400",
    badgeLabel: "Warning",
  }
}

export function RiskRadar() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Risk Radar
          </h2>
          <p className="text-xs text-muted-foreground">
            Active alerts requiring attention
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-xs font-medium text-red-400">
            {alerts.filter((a) => a.severity === "critical").length} Critical
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {alerts.map((alert) => {
          const styles = getAlertStyles(alert.severity)
          const IconComponent = alert.icon
          return (
            <Card
              key={alert.id}
              className={`border transition-colors ${styles.bg}`}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.iconBg}`}
                >
                  <IconComponent className={`h-4 w-4 ${styles.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {alert.message}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles.badge}`}
                    >
                      {styles.badgeLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {alert.detail}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
