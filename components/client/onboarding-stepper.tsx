"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Phone,
  Search,
  FolderOpen,
  Network,
  ClipboardList,
  Rocket,
  Check,
  ListChecks,
} from "lucide-react"

const steps = [
  {
    label: "Kickoff Call",
    description: "Set goals and communication channel with the team.",
    icon: Phone,
  },
  {
    label: "Product Discovery",
    description: "Deep dive into your product vision and requirements.",
    icon: Search,
  },
  {
    label: "Access",
    description: "Access and review existing technical assets.",
    icon: FolderOpen,
  },
  {
    label: "Architecture Review",
    description: "Architectural planning and technical feasibility review.",
    icon: Network,
  },
  {
    label: "Backlog Creation",
    description: "Build and prioritize the product backlog.",
    icon: ClipboardList,
  },
  {
    label: "Start Sprint",
    description: "Development begins with your first sprint cycle.",
    icon: Rocket,
  },
]

// Simulated: steps 0-4 are complete, step 5 is active
const currentStep = 5

export function OnboardingChecklistTrigger() {
  return (
    <DialogTrigger asChild>
      <button
        type="button"
        className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[hsl(220,10%,42%)] transition-colors hover:bg-[hsl(210,15%,95%)] hover:text-[hsl(220,15%,15%)] w-full"
      >
        <ListChecks className="h-[18px] w-[18px]" />
        Onboarding
        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-[hsl(160,51%,42%)]">
          {Math.min(currentStep, steps.length)}/{steps.length}
        </span>
      </button>
    </DialogTrigger>
  )
}

export function OnboardingChecklistDialog() {
  const [open, setOpen] = useState(false)
  const completedCount = Math.min(currentStep, steps.length)
  const progressPct = (completedCount / steps.length) * 100

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <OnboardingChecklistTriggerInline setOpen={setOpen} />
      <DialogContent className="max-w-md border-[hsl(220,13%,87%)] bg-white p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-[hsl(220,13%,90%)] px-6 pb-4 pt-6">
            <DialogTitle className="text-lg font-bold text-[hsl(220,15%,15%)]">
              Onboarding Checklist
            </DialogTitle>
            <DialogDescription className="sr-only">
              Complete onboarding steps for your client portal
            </DialogDescription>
          <p className="mt-0.5 text-sm text-[hsl(220,10%,46%)]">
            {completedCount === steps.length
              ? "All steps completed!"
              : `${completedCount} of ${steps.length} steps completed`}
          </p>
          {/* Progress bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[hsl(210,15%,93%)]">
            <div
              className="h-full rounded-full bg-[hsl(160,51%,42%)] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <ul className="flex flex-col gap-1">
            {steps.map((step, i) => {
              const isComplete = i < currentStep
              const isActive = i === currentStep
              const StepIcon = step.icon

              return (
                <li
                  key={step.label}
                  className={`flex items-start gap-3 rounded-xl px-3 py-3 transition-colors ${
                    isActive
                      ? "bg-[hsl(160,51%,42%)]/5 ring-1 ring-[hsl(160,51%,42%)]/20"
                      : ""
                  }`}
                >
                  {/* Checkbox circle */}
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      isComplete
                        ? "border-[hsl(160,51%,42%)] bg-[hsl(160,51%,42%)] text-white"
                        : isActive
                        ? "border-[hsl(160,51%,42%)] bg-white text-[hsl(160,51%,42%)]"
                        : "border-[hsl(220,13%,82%)] bg-white text-transparent"
                    }`}
                  >
                    {isComplete ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    ) : isActive ? (
                      <div className="h-2 w-2 rounded-full bg-[hsl(160,51%,42%)]" />
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <StepIcon
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isComplete
                            ? "text-[hsl(160,51%,42%)]"
                            : isActive
                            ? "text-[hsl(160,51%,36%)]"
                            : "text-[hsl(220,10%,68%)]"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold leading-tight ${
                          isComplete
                            ? "text-[hsl(220,10%,42%)] line-through decoration-[hsl(220,10%,75%)]"
                            : isActive
                            ? "text-[hsl(220,15%,15%)]"
                            : "text-[hsl(220,10%,55%)]"
                        }`}
                      >
                        {step.label}
                      </span>
                      {isActive && (
                        <span className="rounded-full bg-[hsl(160,51%,42%)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[hsl(160,51%,36%)]">
                          Current
                        </span>
                      )}
                    </div>
                    <p
                      className={`mt-0.5 text-xs leading-relaxed ${
                        isComplete ? "text-[hsl(220,10%,65%)]" : "text-[hsl(220,10%,50%)]"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="border-t border-[hsl(220,13%,90%)] px-6 py-4">
          <p className="text-center text-xs text-[hsl(220,10%,55%)]">
            Questions about a step? Reach out to your project lead.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* Inline trigger used inside the Dialog — separated to avoid nesting Dialog providers */
function OnboardingChecklistTriggerInline({
  setOpen,
}: {
  setOpen: (v: boolean) => void
}) {
  return (
    <DialogTrigger asChild>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[hsl(220,10%,42%)] transition-colors hover:bg-[hsl(210,15%,95%)] hover:text-[hsl(220,15%,15%)] w-full"
      >
        <ListChecks className="h-[18px] w-[18px]" />
        Onboarding
        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-[hsl(160,51%,42%)]">
          {Math.min(currentStep, steps.length)}/{steps.length}
        </span>
      </button>
    </DialogTrigger>
  )
}
