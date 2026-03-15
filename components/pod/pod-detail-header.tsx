"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { PodData } from "@/lib/pod-data"

// Mock sprint data
const sprints = [
  { id: 14, name: "Sprint 14", dateRange: "Jan 27 - Feb 7, 2025", current: true },
  { id: 13, name: "Sprint 13", dateRange: "Jan 13 - Jan 24, 2025", current: false },
  { id: 12, name: "Sprint 12", dateRange: "Dec 30 - Jan 10, 2025", current: false },
  { id: 11, name: "Sprint 11", dateRange: "Dec 16 - Dec 27, 2024", current: false },
]

function HealthGauge({ score, status }: { score: number; status: string }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const strokeColor =
    status === "healthy"
      ? "#34d399"
      : status === "watch"
        ? "#f59e0b"
        : "#ef4444"

  return (
    <div className="relative flex h-[140px] w-[140px] items-center justify-center">
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        className="-rotate-90"
        aria-label={`Health score: ${score} out of 100`}
        role="img"
      >
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Health
        </span>
      </div>
    </div>
  )
}

export function PodDetailHeader({ pod }: { pod: PodData }) {
  const [selectedSprint, setSelectedSprint] = useState(
    sprints.find((s) => s.current) || sprints[0]
  )

  return (
    <header className="border-b border-border px-4 py-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Command Center</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pod.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div>
            <h1 className="text-balance text-base font-semibold text-foreground md:text-lg">
              {pod.name} &ndash; {pod.client}
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>
                Day {pod.sprintDay} of {pod.totalDays}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 border-border bg-secondary text-secondary-foreground hover:bg-muted"
              >
                <span className="text-sm">{selectedSprint.name}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Select Sprint</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sprints.map((sprint) => (
                <DropdownMenuItem
                  key={sprint.id}
                  onClick={() => setSelectedSprint(sprint)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{sprint.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {sprint.dateRange}
                    </span>
                  </div>
                  {selectedSprint.id === sprint.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="scale-75 sm:scale-100">
            <HealthGauge score={pod.healthScore} status={pod.healthStatus} />
          </div>
        </div>
      </div>
    </header>
  )
}
