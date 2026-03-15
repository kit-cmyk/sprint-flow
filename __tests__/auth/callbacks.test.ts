/**
 * Unit tests for JWT and session callback helpers — SF-6
 *
 * Verifies that user fields are correctly projected onto the token
 * and that the session is shaped as consumers expect.
 */

import { describe, it, expect } from "vitest"
import { buildJwtToken, buildSession } from "@/lib/auth-utils"
import type { AuthorizedUser } from "@/lib/auth-utils"

// ── Fixtures ─────────────────────────────────────────────────

const user: AuthorizedUser = {
  id: "user-1",
  name: "James Mitchell",
  email: "james@acme.com",
  avatar: "JM",
  globalRole: "org_admin",
  orgSlug: "acme-corp",
  orgId: "org-acme",
  assignedPodSlugs: [],
}

const superAdminUser: AuthorizedUser = {
  ...user,
  id: "user-sa",
  globalRole: "super_admin",
  orgSlug: null,
  orgId: null,
}

const productOwnerUser: AuthorizedUser = {
  ...user,
  id: "user-po",
  globalRole: "product_owner",
  orgSlug: "acme-corp",
  assignedPodSlugs: ["momentum-pod", "velocity-pod"],
}

const existingToken = { sub: "user-1", iat: 1234567890 }

// ── buildJwtToken ─────────────────────────────────────────────

describe("buildJwtToken()", () => {
  it("merges all AuthorizedUser fields onto the token", () => {
    const token = buildJwtToken(existingToken, user)

    expect(token.id).toBe("user-1")
    expect(token.avatar).toBe("JM")
    expect(token.globalRole).toBe("org_admin")
    expect(token.orgSlug).toBe("acme-corp")
    expect(token.orgId).toBe("org-acme")
    expect(token.assignedPodSlugs).toEqual([])
  })

  it("preserves existing token fields (sub, iat, etc.)", () => {
    const token = buildJwtToken(existingToken, user)

    expect(token.sub).toBe("user-1")
    expect(token.iat).toBe(1234567890)
  })

  it("sets orgSlug to null for super_admin", () => {
    const token = buildJwtToken(existingToken, superAdminUser)

    expect(token.orgSlug).toBeNull()
    expect(token.orgId).toBeNull()
  })

  it("includes assignedPodSlugs for product_owner", () => {
    const token = buildJwtToken(existingToken, productOwnerUser)

    expect(token.assignedPodSlugs).toEqual(["momentum-pod", "velocity-pod"])
  })

  it("returns the original token unchanged when user is null", () => {
    const token = buildJwtToken(existingToken, null)

    expect(token).toEqual(existingToken)
    expect(token.id).toBeUndefined()
    expect(token.globalRole).toBeUndefined()
  })

  it("returns the original token unchanged when user is undefined", () => {
    const token = buildJwtToken(existingToken, undefined)

    expect(token).toEqual(existingToken)
  })
})

// ── buildSession ──────────────────────────────────────────────

describe("buildSession()", () => {
  const tokenFromUser = buildJwtToken(existingToken, user) as Record<string, unknown>

  const baseSession = {
    user: { name: "James Mitchell", email: "james@acme.com", image: null },
    expires: "2099-01-01",
  }

  it("projects all token fields onto session.user", () => {
    const session = buildSession(baseSession, tokenFromUser)

    expect(session.user.id).toBe("user-1")
    expect(session.user.avatar).toBe("JM")
    expect(session.user.globalRole).toBe("org_admin")
    expect(session.user.orgSlug).toBe("acme-corp")
    expect(session.user.orgId).toBe("org-acme")
    expect(session.user.assignedPodSlugs).toEqual([])
  })

  it("preserves existing session.user fields (name, email)", () => {
    const session = buildSession(baseSession, tokenFromUser)

    expect(session.user.name).toBe("James Mitchell")
    expect(session.user.email).toBe("james@acme.com")
  })

  it("preserves top-level session fields (expires)", () => {
    const session = buildSession(baseSession, tokenFromUser)

    expect(session.expires).toBe("2099-01-01")
  })

  it("sets orgSlug to null for super_admin token", () => {
    const saToken = buildJwtToken(existingToken, superAdminUser) as Record<string, unknown>
    const session = buildSession(baseSession, saToken)

    expect(session.user.orgSlug).toBeNull()
    expect(session.user.orgId).toBeNull()
  })

  it("sets assignedPodSlugs on session for product_owner", () => {
    const poToken = buildJwtToken(existingToken, productOwnerUser) as Record<string, unknown>
    const session = buildSession(baseSession, poToken)

    expect(session.user.assignedPodSlugs).toEqual(["momentum-pod", "velocity-pod"])
    expect(session.user.globalRole).toBe("product_owner")
  })

  it("defaults assignedPodSlugs to [] when missing from token", () => {
    const tokenNoSlugs = { ...tokenFromUser, assignedPodSlugs: undefined }
    const session = buildSession(baseSession, tokenNoSlugs)

    expect(session.user.assignedPodSlugs).toEqual([])
  })

  it("defaults orgSlug to null when missing from token", () => {
    const tokenNoOrg = { ...tokenFromUser, orgSlug: undefined }
    const session = buildSession(baseSession, tokenNoOrg)

    expect(session.user.orgSlug).toBeNull()
  })
})
