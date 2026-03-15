/**
 * SprintFlow — Middleware (SF-6 + SF-7)
 * 1. Redirects unauthenticated users to /login.
 * 2. Enforces role-based route access server-side.
 *
 * RBAC logic lives in lib/auth-utils.ts for testability.
 */

import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { getRouteAccess } from "@/lib/auth-utils"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Public routes — no auth required
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/client-login") ||
    pathname.startsWith("/api/auth")

  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based access control — server-side gate
  if (isLoggedIn) {
    const globalRole = req.auth?.user?.globalRole ?? ""
    const result = getRouteAccess(pathname, globalRole)

    if (result === "redirect-home") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$).*)"],
}
