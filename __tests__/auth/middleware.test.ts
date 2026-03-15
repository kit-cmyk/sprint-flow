/**
 * Unit tests for middleware RBAC logic — SF-6 + SF-7
 *
 * Tests the pure getRouteAccess() helper and resolveLoginRedirect().
 * No HTTP layer needed.
 */

import { describe, it, expect } from "vitest"
import { getRouteAccess, resolveLoginRedirect } from "@/lib/auth-utils"

// ── getRouteAccess ────────────────────────────────────────────

describe("getRouteAccess()", () => {

  // ── /super-admin ────────────────────────────────────────────

  it("allows super_admin on /super-admin", () => {
    expect(getRouteAccess("/super-admin", "super_admin")).toBe("allow")
  })

  it("allows super_admin on /super-admin/org/acme-corp", () => {
    expect(getRouteAccess("/super-admin/org/acme-corp", "super_admin")).toBe("allow")
  })

  it("allows super_admin on /super-admin/support", () => {
    expect(getRouteAccess("/super-admin/support", "super_admin")).toBe("allow")
  })

  it("redirects org_admin away from /super-admin", () => {
    expect(getRouteAccess("/super-admin", "org_admin")).toBe("redirect-home")
  })

  it("redirects product_owner away from /super-admin", () => {
    expect(getRouteAccess("/super-admin", "product_owner")).toBe("redirect-home")
  })

  it("redirects developer away from /super-admin", () => {
    expect(getRouteAccess("/super-admin", "developer")).toBe("redirect-home")
  })

  it("redirects unauthenticated (empty role) away from /super-admin", () => {
    expect(getRouteAccess("/super-admin", "")).toBe("redirect-home")
  })

  // ── /po ─────────────────────────────────────────────────────

  it("allows product_owner on /po", () => {
    expect(getRouteAccess("/po", "product_owner")).toBe("allow")
  })

  it("allows product_owner on /po/pod/momentum-pod", () => {
    expect(getRouteAccess("/po/pod/momentum-pod", "product_owner")).toBe("allow")
  })

  it("allows super_admin on /po (cross-role visibility)", () => {
    expect(getRouteAccess("/po", "super_admin")).toBe("allow")
  })

  it("redirects org_admin away from /po", () => {
    expect(getRouteAccess("/po", "org_admin")).toBe("redirect-home")
  })

  it("redirects developer away from /po", () => {
    expect(getRouteAccess("/po", "developer")).toBe("redirect-home")
  })

  // ── Unrestricted routes ──────────────────────────────────────

  it("returns no-constraint for / for any role", () => {
    expect(getRouteAccess("/", "org_admin")).toBe("no-constraint")
    expect(getRouteAccess("/", "developer")).toBe("no-constraint")
    expect(getRouteAccess("/", "super_admin")).toBe("no-constraint")
  })

  it("returns no-constraint for /developers", () => {
    expect(getRouteAccess("/developers", "developer")).toBe("no-constraint")
  })

  it("returns no-constraint for /settings for any authenticated user", () => {
    expect(getRouteAccess("/settings", "org_admin")).toBe("no-constraint")
  })

  it("does not match /super-admin-tools as a restricted route", () => {
    // Only exact prefix match or prefix + "/" — not substring
    expect(getRouteAccess("/super-admin-tools", "org_admin")).toBe("no-constraint")
  })

  it("does not match /portal as /po prefix", () => {
    expect(getRouteAccess("/portal", "org_admin")).toBe("no-constraint")
  })
})

// ── resolveLoginRedirect ──────────────────────────────────────

describe("resolveLoginRedirect()", () => {
  it("sends super_admin to /super-admin regardless of callbackUrl", () => {
    expect(resolveLoginRedirect("super_admin", "/")).toBe("/super-admin")
    expect(resolveLoginRedirect("super_admin", "/dashboard")).toBe("/super-admin")
    expect(resolveLoginRedirect("super_admin", "/login")).toBe("/super-admin")
  })

  it("sends product_owner to /po regardless of callbackUrl", () => {
    expect(resolveLoginRedirect("product_owner", "/")).toBe("/po")
    expect(resolveLoginRedirect("product_owner", "/login")).toBe("/po")
  })

  it("sends org_admin to callbackUrl", () => {
    expect(resolveLoginRedirect("org_admin", "/settings")).toBe("/settings")
    expect(resolveLoginRedirect("org_admin", "/developers")).toBe("/developers")
  })

  it("sends developer to callbackUrl", () => {
    expect(resolveLoginRedirect("developer", "/pod/momentum-pod")).toBe("/pod/momentum-pod")
  })

  it("sends org_admin to / when callbackUrl is /login (avoids redirect loop)", () => {
    expect(resolveLoginRedirect("org_admin", "/login")).toBe("/")
  })

  it("sends developer to / when callbackUrl is /login", () => {
    expect(resolveLoginRedirect("developer", "/login")).toBe("/")
  })
})
