/**
 * SprintFlow — NextAuth v5 Configuration (SF-6)
 * Credentials provider backed by Prisma + bcrypt.
 * JWT strategy — no database adapter needed for sessions.
 *
 * Business logic lives in lib/auth-utils.ts for testability.
 */

import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authorizeUser, buildJwtToken, buildSession } from "@/lib/auth-utils"
import type { AuthorizedUser } from "@/lib/auth-utils"

const config: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        return authorizeUser(credentials as Record<string, unknown>)
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      return buildJwtToken(
        token as Record<string, unknown>,
        user as AuthorizedUser | null
      ) as typeof token
    },

    session({ session, token }) {
      return buildSession(
        session as unknown as { user: Record<string, unknown> },
        token as Record<string, unknown>
      ) as typeof session
    },
  },

  pages: {
    signIn: "/login",
  },

  session: { strategy: "jwt" },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
