"use client"

import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const router = useRouter()

  const handleSignOut = () => {
    router.push("/login")
  }

  return (
    <header className="flex flex-col gap-4 border-b border-border px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-primary"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
            <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
            <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
            <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground md:text-lg">
            Assembled Systems
          </h1>
          <p className="text-xs text-muted-foreground">
            Executive Delivery Control
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
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
    </header>
  )
}
