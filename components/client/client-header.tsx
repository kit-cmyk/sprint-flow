"use client"

import { Download, CalendarDays, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function ClientHeader() {
  const router = useRouter()

  const handleSignOut = () => {
    router.push("/login")
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">A</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                Momentum Pod
              </h1>
              <p className="text-sm text-muted-foreground">Client A</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="secondary"
            className="gap-1.5 border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Sprint 14
          </Badge>
          <span className="text-xs text-muted-foreground">
            Jan 27 - Feb 7, 2025
          </span>
          <Button size="sm" className="gap-2">
            <Download className="h-3.5 w-3.5" />
            Download Sprint Report
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 rounded-full border-border bg-secondary p-0 hover:bg-muted"
              >
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
