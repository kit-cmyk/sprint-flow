"use client"

import Link from "next/link"
import { ArrowLeft, LogOut, User } from "lucide-react"
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
import type { DeveloperData } from "@/lib/developer-data"

export function DevHeader({
  dev,
  backSlug,
}: {
  dev: DeveloperData
  backSlug?: string
}) {
  const router = useRouter()

  const handleSignOut = () => {
    router.push("/login")
  }

  return (
    <header className="border-b border-border px-4 py-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Link href={backSlug ? `/pod/${backSlug}` : "/"}>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 border-border bg-secondary text-secondary-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Return to Pod View</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
              {dev.avatar}
            </div>
            <div>
              <h1 className="text-balance text-base font-semibold text-foreground md:text-lg">
                {dev.name}
              </h1>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{dev.role}</span>
                <span className="hidden text-border sm:inline">|</span>
                <span>{dev.currentSprint}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {dev.allocations.map((alloc) => (
              <Badge
                key={alloc.podName}
                variant="outline"
                className="border-border bg-secondary/50 text-secondary-foreground"
              >
                {alloc.podName} &ndash; {alloc.client}
              </Badge>
            ))}
          </div>
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
