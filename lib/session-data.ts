export type SessionRole = "super-admin" | "admin" | "product-owner" | "developer"

export interface MockSession {
  name: string
  email: string
  initials: string
  role: SessionRole
  orgSlug: string | null
  assignedPodSlugs?: string[]
}

export const session: MockSession = {
  name: "System Admin",
  email: "superadmin@assembled.dev",
  initials: "SA",
  role: "super-admin",
  orgSlug: null,
}

export const poSession: MockSession = {
  name: "Rachel Moore",
  email: "rachel@acme.com",
  initials: "RM",
  role: "product-owner",
  orgSlug: "acme-corp",
  assignedPodSlugs: ["momentum-pod", "velocity-pod"],
}
