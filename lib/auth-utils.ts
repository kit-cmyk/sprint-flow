/**
 * Pure auth helper functions — dependency-injectable so they can be unit-tested
 * without a real database or bcrypt call.
 * SF-6
 */

import bcrypt from "bcryptjs"
import { prisma as defaultPrisma } from "@/lib/prisma"

// ── Types ────────────────────────────────────────────────────

export interface AuthorizedUser {
  id: string
  name: string
  email: string
  avatar: string
  globalRole: string
  orgSlug: string | null
  orgId: string | null
  assignedPodSlugs: string[]
}

// Minimal Prisma interface required by authorizeUser — makes mocking simple
export interface UserRepository {
  user: {
    findUnique: (args: {
      where: { email: string }
      include: {
        memberships: { where: { status: string }; include: { org: { select: { id: true; slug: true } } }; take: number }
        developer: { include: { allocations: { include: { pod: { select: { slug: true } } } } } }
      }
    }) => Promise<{
      id: string
      name: string
      email: string
      avatar: string | null
      globalRole: string
      passwordHash: string | null
      memberships: { org: { id: string; slug: string } }[]
      developer: { allocations: { pod: { slug: string } }[] } | null
    } | null>
  }
}

// ── authorize ────────────────────────────────────────────────

/**
 * Validates credentials against the database.
 * Returns null on any failure — never throws.
 * Accepts an injectable `db` so tests can pass a mock.
 */
export async function authorizeUser(
  credentials: Record<string, unknown>,
  db: UserRepository = defaultPrisma as unknown as UserRepository,
  compare: (plain: string, hash: string) => Promise<boolean> = bcrypt.compare.bind(bcrypt)
): Promise<AuthorizedUser | null> {
  const email = credentials?.email as string | undefined
  const password = credentials?.password as string | undefined

  if (!email || !password) return null

  const user = await db.user.findUnique({
    where: { email },
    include: {
      memberships: {
        where: { status: "active" },
        include: { org: { select: { id: true, slug: true } } },
        take: 1,
      },
      developer: {
        include: {
          allocations: { include: { pod: { select: { slug: true } } } },
        },
      },
    },
  })

  if (!user?.passwordHash) return null

  const valid = await compare(password, user.passwordHash)
  if (!valid) return null

  const primaryMembership = user.memberships[0] ?? null

  const assignedPodSlugs =
    user.globalRole === "product_owner"
      ? (user.developer?.allocations.map((a) => a.pod.slug) ?? [])
      : []

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? "",
    globalRole: user.globalRole,
    orgSlug: primaryMembership?.org.slug ?? null,
    orgId: primaryMembership?.org.id ?? null,
    assignedPodSlugs,
  }
}

// ── login redirect ────────────────────────────────────────────

/**
 * Determines where to send a user after a successful login based on their role.
 */
export function resolveLoginRedirect(globalRole: string, callbackUrl: string): string {
  if (globalRole === "super_admin") return "/super-admin"
  if (globalRole === "product_owner") return "/po"
  return callbackUrl === "/login" ? "/" : callbackUrl
}

// ── RBAC route check ──────────────────────────────────────────

export const ROLE_ROUTES: Array<{ prefix: string; allowed: string[] }> = [
  { prefix: "/super-admin", allowed: ["super_admin"] },
  { prefix: "/po",          allowed: ["product_owner", "super_admin"] },
]

export type RouteAccessResult = "allow" | "redirect-home" | "no-constraint"

/**
 * Pure function that decides whether a given role may access a given path.
 * Used by middleware — extracted here for testability.
 */
export function getRouteAccess(pathname: string, globalRole: string): RouteAccessResult {
  for (const { prefix, allowed } of ROLE_ROUTES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return allowed.includes(globalRole) ? "allow" : "redirect-home"
    }
  }
  return "no-constraint"
}

// ── JWT / session callbacks ───────────────────────────────────

/** Merges authorized user fields into the JWT token (first sign-in only). */
export function buildJwtToken(
  token: Record<string, unknown>,
  user?: AuthorizedUser | null
): Record<string, unknown> {
  if (!user) return token
  return {
    ...token,
    id: user.id,
    avatar: user.avatar,
    globalRole: user.globalRole,
    orgSlug: user.orgSlug,
    orgId: user.orgId,
    assignedPodSlugs: user.assignedPodSlugs,
  }
}

/** Projects token fields onto the session user object. */
export function buildSession<S extends { user: Record<string, unknown> }>(
  session: S,
  token: Record<string, unknown>
): S {
  return {
    ...session,
    user: {
      ...session.user,
      id: token.id,
      avatar: token.avatar,
      globalRole: token.globalRole,
      orgSlug: token.orgSlug ?? null,
      orgId: token.orgId ?? null,
      assignedPodSlugs: token.assignedPodSlugs ?? [],
    },
  }
}
