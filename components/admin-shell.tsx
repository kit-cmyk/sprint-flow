"use client"

import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
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
import { NotificationSheet } from "@/components/notification-sheet"

const CLIENT_ROUTES = ["/client-dashboard", "/client-login", "/login"]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isClientRoute = CLIENT_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  )

  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  // Derive initials from the session user's name
  const name = session?.user?.name ?? ""
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  if (isClientRoute) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationSheet variant="org-admin" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 rounded-full border-border bg-primary/10 p-0 text-xs font-bold text-primary hover:bg-primary/20"
                >
                  {initials}
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-foreground">{name}</span>
                  <span className="text-[11px] font-normal text-muted-foreground">{session?.user?.email ?? ""}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
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
