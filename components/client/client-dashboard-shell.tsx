"use client"

import { useRouter } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ClientSidebarContent } from "@/components/client/client-sidebar-content"
import { ThemeToggle } from "@/components/theme-toggle"
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

export function ClientDashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleSignOut = () => {
    router.push("/login")
  }

  return (
    <SidebarProvider>
      <ClientSidebarContent />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 rounded-full border-border bg-secondary p-0 hover:bg-muted"
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
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
