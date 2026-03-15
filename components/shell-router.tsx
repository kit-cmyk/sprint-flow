"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminShell } from "@/components/admin-shell"
import { SuperAdminShell } from "@/components/super-admin/super-admin-shell"
import { ProductOwnerShell } from "@/components/po/product-owner-shell"

/**
 * Selects the correct UI shell based on:
 * 1. The current pathname (primary selector — a super_admin viewing /po gets PO shell)
 * 2. The session's globalRole (fallback for unknown paths)
 *
 * Security note: the actual access gate is in middleware.ts (server-side).
 * This component only controls the UI chrome.
 */
export function ShellRouter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const globalRole = session?.user?.globalRole ?? ""

  // Super-admin console paths always use the super-admin shell
  if (pathname === "/super-admin" || pathname.startsWith("/super-admin/")) {
    return <SuperAdminShell>{children}</SuperAdminShell>
  }

  // Product-owner paths use the PO shell
  if (pathname === "/po" || pathname.startsWith("/po/")) {
    return <ProductOwnerShell>{children}</ProductOwnerShell>
  }

  // For all other paths, use the role-appropriate default shell.
  // A product_owner who hasn't navigated to /po yet still gets PO chrome.
  if (globalRole === "super_admin") {
    return <SuperAdminShell>{children}</SuperAdminShell>
  }

  if (globalRole === "product_owner") {
    return <ProductOwnerShell>{children}</ProductOwnerShell>
  }

  return <AdminShell>{children}</AdminShell>
}
