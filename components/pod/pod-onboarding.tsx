"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Phone,
  Search,
  FolderOpen,
  Network,
  ClipboardList,
  Rocket,
  Check,
  Circle,
} from "lucide-react"

const steps = [
  {
    id: "1",
    label: "Kickoff Call",
    description: "Set goals and communication channel with the team.",
    icon: Phone,
    completed: false,
  },
  {
    id: "2",
    label: "Product Discovery",
    description: "Deep dive into your product vision and requirements.",
    icon: Search,
    completed: false,
  },
  {
    id: "3",
    label: "Access",
    description: "Access and review existing technical assets.",
    icon: FolderOpen,
    completed: false,
  },
  {
    id: "4",
    label: "Architecture Review",
    description: "Architectural planning and technical feasibility review.",
    icon: Network,
    completed: false,
  },
  {
    id: "5",
    label: "Backlog Creation",
    description: "Build and prioritize the product backlog.",
    icon: ClipboardList,
    completed: false,
  },
  {
    id: "6",
    label: "Start Sprint",
    description: "Development begins with your first sprint cycle.",
    icon: Rocket,
    completed: false,
  },
]

export function PodOnboarding() {
  const [checklist, setChecklist] = useState(steps)

  const completedCount = checklist.filter((s) => s.completed).length
  const progressPct = (completedCount / checklist.length) * 100

  const toggleStep = (id: string) => {
    setChecklist((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        {/* Header */}
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Client Onboarding Checklist</h3>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Track and manage the onboarding progress for this project
          </p>
        </div>

        {/* Progress Summary */}
        <div className="border-b border-border bg-muted/20 px-5 py-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-2xl font-bold text-primary">
              {completedCount}/{checklist.length}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {completedCount === checklist.length
              ? "All onboarding steps completed!"
              : `${checklist.length - completedCount} step${checklist.length - completedCount !== 1 ? "s" : ""} remaining`}
          </p>
        </div>

        {/* Checklist Items */}
        <div className="divide-y divide-border">
        {checklist.map((step, index) => {
          const StepIcon = step.icon
          const isNext = !step.completed && checklist.slice(0, index).every((s) => s.completed)

          return (
            <div
              key={step.id}
              className={`px-5 py-4 transition-colors ${
                step.completed
                  ? "bg-emerald-500/5"
                  : isNext
                  ? "bg-primary/5"
                  : "hover:bg-muted/30"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    step.completed
                      ? "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600"
                      : "border-muted-foreground/30 bg-background hover:border-primary hover:bg-primary/10"
                  }`}
                  aria-label={step.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {step.completed ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <Circle className="h-3 w-3 text-muted-foreground/50" />
                  )}
                </button>

                {/* Icon */}
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    step.completed
                      ? "bg-emerald-500/15 text-emerald-600"
                      : isNext
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm font-medium ${
                        step.completed
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isNext && !step.completed && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                        Next
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      step.completed ? "text-muted-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      </CardContent>
    </Card>
  )
}
