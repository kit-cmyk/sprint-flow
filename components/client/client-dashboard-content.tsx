"use client"

import { useState } from "react"
import { ChevronDown, LayoutGrid } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SprintKanban } from "@/components/client/kanban-board-display"

// Mock available boards based on portal settings
interface Board {
  id: string
  name: string
  type: string
  enabled: boolean
}

const availableBoards: Board[] = [
  { id: "board-1", name: "AVI Product Backlog", type: "Scrum", enabled: true },
  { id: "board-2", name: "Design Board", type: "Kanban", enabled: true },
  { id: "board-3", name: "Infrastructure & DevOps", type: "Scrum", enabled: true },
]

export function ClientDashboardContent({ hasReports = true }: { hasReports?: boolean }) {
  // Filter to only show enabled boards
  const enabledBoards = availableBoards.filter((board) => board.enabled)
  const [activeBoard, setActiveBoard] = useState(enabledBoards[0]?.id || "")
  
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Task Tracking</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Momentum Pod &middot; Client A &middot; Sprint 14
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Board Switcher Dropdown */}
            {enabledBoards.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary">
                    <LayoutGrid className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="max-w-[160px] truncate">
                      {enabledBoards.find((b) => b.id === activeBoard)?.name ?? "Select Board"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  {enabledBoards.map((board) => (
                    <DropdownMenuItem
                      key={board.id}
                      onClick={() => setActiveBoard(board.id)}
                      className="flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-medium">{board.name}</span>
                        <span className="text-xs text-muted-foreground">{board.type}</span>
                      </div>
                      {activeBoard === board.id && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}


          </div>
        </div>

        {/* Active Board Content */}
        <div className="mt-6">
          {enabledBoards.length > 0 ? (
            enabledBoards.map((board) =>
              board.id === activeBoard ? (
                <SprintKanban key={board.id} boardName={board.name} boardType={board.type} />
              ) : null
            )
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
              <h3 className="text-lg font-semibold text-foreground">No Boards Available</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your team administrator hasn't enabled any boards for viewing yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
