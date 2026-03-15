/**
 * NextAuth type augmentation — extends Session, User, and JWT with SprintFlow fields.
 * SF-6
 */

import { DefaultSession, DefaultJWT } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      avatar: string
      globalRole: string          // "super_admin" | "org_admin" | "product_owner" | "developer"
      orgSlug: string | null      // null for super_admin
      orgId: string | null
      assignedPodSlugs: string[]  // populated for product_owner
    } & DefaultSession["user"]
  }

  // Augment User so authorize()'s return value is fully typed
  interface User {
    avatar: string
    globalRole: string
    orgSlug: string | null
    orgId: string | null
    assignedPodSlugs: string[]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    avatar: string
    globalRole: string
    orgSlug: string | null
    orgId: string | null
    assignedPodSlugs: string[]
  }
}
