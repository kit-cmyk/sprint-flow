# Changelog

All notable changes to SprintFlow will be documented in this file.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Prisma ORM installed and configured with PostgreSQL / Supabase datasource (SF-9)
- `lib/prisma.ts` — PrismaClient global singleton for Next.js hot-reload safety (SF-9)
- `prisma/schema.prisma` — initial scaffold with datasource and generator blocks (SF-9)
- `.env.example` — documented environment variable template with DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, JIRA_CLIENT_ID (SF-9)
- `postinstall` script to auto-run `prisma generate` on install (SF-9)
- Full Prisma schema: Organization, User, Membership (SF-10)
- Full Prisma schema: Pod, Sprint, SprintTicket with JSON velocity/carryover history (SF-11)
- Full Prisma schema: Developer, Allocation, PR with JSON chart data fields (SF-12)
- Full Prisma schema: SupportTicket, TicketReply, AuditEvent (SF-13)
- Full Prisma schema: PulseReport, Team, TeamDeveloper, TeamPod (SF-14)
- `prisma/seed.ts` — full seed from all 6 mock lib files; 4 orgs, 14 users, 6 pods, 6 sprints, 76 sprint tickets, 3 developers, 9 allocations, 9 PRs, 9 support tickets, 18 audit events, 3 pulse reports, 2 teams (SF-15, SF-16)
- `.env.local` — local environment file with Supabase connection strings (SF-9)
- NextAuth.js v5 installed and configured with Credentials provider (SF-6)
- `auth.ts` — NextAuth config: bcrypt password verify, JWT strategy, session carries globalRole + orgSlug + assignedPodSlugs (SF-6)
- `app/api/auth/[...nextauth]/route.ts` — NextAuth route handler (SF-6)
- `middleware.ts` — redirects unauthenticated users to /login (SF-6)
- `types/next-auth.d.ts` — type augmentation for extended session fields (SF-6)
- `components/auth-provider.tsx` — client SessionProvider wrapper (SF-6)
- `app/login/page.tsx` — replaced mock auth with real signIn() + role-based redirect (SF-6)
