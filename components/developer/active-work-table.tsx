"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import type { DeveloperData, ActiveTicket } from "@/lib/developer-data"

function getStatusStyle(status: ActiveTicket["status"]) {
  switch (status) {
    case "in-progress":
      return "bg-sky-500/15 text-sky-400"
    case "in-review":
      return "bg-purple-500/15 text-purple-400"
    case "qa":
      return "bg-amber-500/15 text-amber-400"
    case "blocked":
      return "bg-red-500/15 text-red-400"
  }
}

function getStoryTypeStyle(type: ActiveTicket["storyType"]) {
  switch (type) {
    case "feature":
      return "bg-emerald-500/10 text-emerald-400"
    case "bug":
      return "bg-red-500/10 text-red-400"
    case "chore":
      return "bg-muted text-muted-foreground"
    case "spike":
      return "bg-sky-500/10 text-sky-400"
  }
}

function getRiskStyle(risk: ActiveTicket["riskLevel"]) {
  switch (risk) {
    case "low":
      return { dot: "bg-emerald-400", text: "text-emerald-400" }
    case "medium":
      return { dot: "bg-amber-400", text: "text-amber-400" }
    case "high":
      return { dot: "bg-red-400", text: "text-red-400" }
  }
}

function hasRiskFlag(ticket: ActiveTicket) {
  return (
    ticket.daysInProgress > 5 ||
    (ticket.daysInProgress > 2 && !ticket.prLinked) ||
    (ticket.blocked && ticket.daysInProgress > 1)
  )
}

export function ActiveWorkTable({ dev }: { dev: DeveloperData }) {
  const projects = Array.from(new Set(dev.tickets.map((t) => t.project)))
  const [filter, setFilter] = useState<string>("all")

  const filtered =
    filter === "all"
      ? dev.tickets
      : dev.tickets.filter((t) => t.project === filter)

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Active Work Detail
          </h2>
          <p className="text-xs text-muted-foreground">
            All in-flight tickets across assigned pods
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <Button
            variant="outline"
            size="sm"
            className={`h-7 px-2.5 text-xs ${
              filter === "all"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          {projects.map((proj) => (
            <Button
              key={proj}
              variant="outline"
              size="sm"
              className={`h-7 px-2.5 text-xs ${
                filter === proj
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
              onClick={() => setFilter(proj)}
            >
              {proj.replace(" Pod", "")}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Ticket ID</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-center">
                    Days In Progress
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    Blocked
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    PR Linked
                  </th>
                  <th className="px-4 py-3 font-medium text-center">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket) => {
                  const risk = getRiskStyle(ticket.riskLevel)
                  const flagged = hasRiskFlag(ticket)
                  return (
                    <tr
                      key={ticket.ticketId}
                      className={`border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/50 ${
                        flagged ? "bg-red-500/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`font-mono text-sm font-medium ${
                            flagged ? "text-red-400" : "text-foreground"
                          }`}
                        >
                          {ticket.ticketId}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {ticket.project}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${getStoryTypeStyle(ticket.storyType)}`}
                        >
                          {ticket.storyType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${getStatusStyle(ticket.status)}`}
                        >
                          {ticket.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-semibold ${
                            ticket.daysInProgress > 5
                              ? "text-red-400"
                              : ticket.daysInProgress > 3
                                ? "text-amber-400"
                                : "text-foreground"
                          }`}
                        >
                          {ticket.daysInProgress}d
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {ticket.blocked ? (
                          <span className="text-xs font-semibold text-red-400">
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {ticket.prLinked ? (
                          <span className="text-xs font-semibold text-emerald-400">
                            Yes
                          </span>
                        ) : (
                          <span
                            className={`text-xs ${
                              ticket.daysInProgress > 2
                                ? "font-semibold text-amber-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            No
                            {ticket.daysInProgress > 2 && " (late)"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${risk.dot}`}
                          />
                          <span
                            className={`text-[11px] font-semibold capitalize ${risk.text}`}
                          >
                            {ticket.riskLevel}
                          </span>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 p-3 md:hidden">
            {filtered.map((ticket) => {
              const risk = getRiskStyle(ticket.riskLevel)
              const flagged = hasRiskFlag(ticket)
              return (
                <div
                  key={ticket.ticketId}
                  className={`rounded-lg border p-3 ${
                    flagged
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-border/50 bg-secondary/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-sm font-medium ${
                        flagged ? "text-red-400" : "text-foreground"
                      }`}
                    >
                      {ticket.ticketId}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${risk.dot}`}
                      />
                      <span
                        className={`text-[10px] font-semibold capitalize ${risk.text}`}
                      >
                        {ticket.riskLevel}
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ticket.project}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold capitalize ${getStoryTypeStyle(ticket.storyType)}`}
                    >
                      {ticket.storyType}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${getStatusStyle(ticket.status)}`}
                    >
                      {ticket.status.replace("-", " ")}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        ticket.daysInProgress > 5
                          ? "text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {ticket.daysInProgress}d
                    </span>
                    {ticket.blocked && (
                      <span className="text-[10px] font-semibold text-red-400">
                        Blocked
                      </span>
                    )}
                    {!ticket.prLinked && ticket.daysInProgress > 2 && (
                      <span className="text-[10px] font-semibold text-amber-400">
                        No PR
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
