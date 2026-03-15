/**
 * Unit tests for authorizeUser() — SF-6
 *
 * All Prisma and bcrypt calls are injected as mocks.
 * No database or real password hashing needed.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { authorizeUser } from "@/lib/auth-utils"
import type { UserRepository } from "@/lib/auth-utils"

// ── Fixtures ─────────────────────────────────────────────────

const HASH = "$2a$10$hashedpassword"

const baseUser = {
  id: "user-1",
  name: "James Mitchell",
  email: "james@acme.com",
  avatar: "JM",
  globalRole: "org_admin",
  passwordHash: HASH,
  memberships: [{ org: { id: "org-acme", slug: "acme-corp" } }],
  developer: null,
}

const superAdminUser = {
  ...baseUser,
  id: "user-sa",
  name: "System Admin",
  email: "superadmin@assembled.dev",
  avatar: "SA",
  globalRole: "super_admin",
  memberships: [],
  developer: null,
}

const productOwnerUser = {
  ...baseUser,
  id: "user-po",
  name: "Rachel Moore",
  email: "rachel@nexuslabs.io",
  avatar: "RM",
  globalRole: "product_owner",
  developer: {
    allocations: [
      { pod: { slug: "momentum-pod" } },
      { pod: { slug: "velocity-pod" } },
    ],
  },
}

function mockDb(returnValue: typeof baseUser | null): UserRepository {
  return {
    user: {
      findUnique: vi.fn().mockResolvedValue(returnValue),
    },
  }
}

const validCompare = vi.fn().mockResolvedValue(true)
const invalidCompare = vi.fn().mockResolvedValue(false)

// ── Tests ─────────────────────────────────────────────────────

describe("authorizeUser()", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Missing credentials ─────────────────────────────────────

  it("returns null when email is missing", async () => {
    const result = await authorizeUser({ password: "abc123" }, mockDb(baseUser), validCompare)
    expect(result).toBeNull()
  })

  it("returns null when password is missing", async () => {
    const result = await authorizeUser({ email: "james@acme.com" }, mockDb(baseUser), validCompare)
    expect(result).toBeNull()
  })

  it("returns null when both credentials are missing", async () => {
    const result = await authorizeUser({}, mockDb(baseUser), validCompare)
    expect(result).toBeNull()
  })

  // ── User not found ──────────────────────────────────────────

  it("returns null when user does not exist in the database", async () => {
    const result = await authorizeUser(
      { email: "nobody@example.com", password: "password123" },
      mockDb(null),
      validCompare
    )
    expect(result).toBeNull()
  })

  it("returns null when user has no passwordHash (e.g. OAuth-only account)", async () => {
    const userNoHash = { ...baseUser, passwordHash: null }
    const result = await authorizeUser(
      { email: "james@acme.com", password: "password123" },
      mockDb(userNoHash as any),
      validCompare
    )
    expect(result).toBeNull()
  })

  // ── Wrong password ──────────────────────────────────────────

  it("returns null when password is incorrect", async () => {
    const result = await authorizeUser(
      { email: "james@acme.com", password: "wrongpassword" },
      mockDb(baseUser),
      invalidCompare
    )
    expect(result).toBeNull()
  })

  // ── Successful auth ─────────────────────────────────────────

  it("returns user object on valid credentials", async () => {
    const result = await authorizeUser(
      { email: "james@acme.com", password: "password123" },
      mockDb(baseUser),
      validCompare
    )

    expect(result).not.toBeNull()
    expect(result!.id).toBe("user-1")
    expect(result!.email).toBe("james@acme.com")
    expect(result!.name).toBe("James Mitchell")
    expect(result!.avatar).toBe("JM")
    expect(result!.globalRole).toBe("org_admin")
  })

  it("includes orgSlug and orgId from primary membership", async () => {
    const result = await authorizeUser(
      { email: "james@acme.com", password: "password123" },
      mockDb(baseUser),
      validCompare
    )

    expect(result!.orgSlug).toBe("acme-corp")
    expect(result!.orgId).toBe("org-acme")
  })

  it("returns orgSlug as null for super_admin with no memberships", async () => {
    const result = await authorizeUser(
      { email: "superadmin@assembled.dev", password: "password123" },
      mockDb(superAdminUser),
      validCompare
    )

    expect(result!.globalRole).toBe("super_admin")
    expect(result!.orgSlug).toBeNull()
    expect(result!.orgId).toBeNull()
  })

  it("returns empty assignedPodSlugs for non-product_owner roles", async () => {
    const result = await authorizeUser(
      { email: "james@acme.com", password: "password123" },
      mockDb(baseUser),
      validCompare
    )

    expect(result!.assignedPodSlugs).toEqual([])
  })

  it("returns assignedPodSlugs from allocations for product_owner", async () => {
    const result = await authorizeUser(
      { email: "rachel@nexuslabs.io", password: "password123" },
      mockDb(productOwnerUser as any),
      validCompare
    )

    expect(result!.globalRole).toBe("product_owner")
    expect(result!.assignedPodSlugs).toEqual(["momentum-pod", "velocity-pod"])
  })

  it("returns empty assignedPodSlugs for product_owner with no developer profile", async () => {
    const poNoDev = { ...productOwnerUser, developer: null }
    const result = await authorizeUser(
      { email: "rachel@nexuslabs.io", password: "password123" },
      mockDb(poNoDev as any),
      validCompare
    )

    expect(result!.assignedPodSlugs).toEqual([])
  })

  it("uses empty string for avatar when DB avatar is null", async () => {
    const noAvatar = { ...baseUser, avatar: null as any }
    const result = await authorizeUser(
      { email: "james@acme.com", password: "password123" },
      mockDb(noAvatar),
      validCompare
    )

    expect(result!.avatar).toBe("")
  })

  // ── DB query shape ──────────────────────────────────────────

  it("queries by the provided email address", async () => {
    const db = mockDb(baseUser)
    await authorizeUser({ email: "james@acme.com", password: "password123" }, db, validCompare)

    expect(db.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "james@acme.com" } })
    )
  })

  it("passes the plain password to the compare function", async () => {
    await authorizeUser(
      { email: "james@acme.com", password: "mypassword" },
      mockDb(baseUser),
      validCompare
    )

    expect(validCompare).toHaveBeenCalledWith("mypassword", HASH)
  })
})
