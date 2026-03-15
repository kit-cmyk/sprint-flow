/**
 * SprintFlow — Database Seed
 * SF-15: Seed all mock data (orgs, users, pods, sprints, developers, tickets, support, pulse)
 * SF-16: Seed mock user accounts (super-admin + org-admin)
 *
 * Run: pnpm prisma db seed
 * Safe to re-run — uses upsert/deleteMany for idempotency.
 */

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// Pre-hash "password123" — change before production
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync("password123", 10)

async function main() {
  console.log("🌱 Seeding SprintFlow database...")

  // ── Wipe in dependency order ──────────────────────────────
  await prisma.teamPod.deleteMany()
  await prisma.teamDeveloper.deleteMany()
  await prisma.team.deleteMany()
  await prisma.pulseReport.deleteMany()
  await prisma.auditEvent.deleteMany()
  await prisma.ticketReply.deleteMany()
  await prisma.supportTicket.deleteMany()
  await prisma.pR.deleteMany()
  await prisma.sprintTicket.deleteMany()
  await prisma.allocation.deleteMany()
  await prisma.sprint.deleteMany()
  await prisma.pod.deleteMany()
  await prisma.membership.deleteMany()
  await prisma.developer.deleteMany()
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  // ─────────────────────────────────────────────────────────
  // SF-10: Organizations
  // ─────────────────────────────────────────────────────────
  console.log("  → Organizations")

  const acme = await prisma.organization.create({
    data: {
      id: "org-acme",
      slug: "acme-corp",
      name: "Acme Corp",
      logoInitials: "AC",
      plan: "Enterprise",
      status: "active",
      seats: 20,
      seatsUsed: 18,
      mrr: 4800,
      createdAt: new Date("2024-01-15"),
      adminEmail: "admin@acme.com",
    },
  })

  const nexus = await prisma.organization.create({
    data: {
      id: "org-nexus",
      slug: "nexus-labs",
      name: "Nexus Labs",
      logoInitials: "NX",
      plan: "Business",
      status: "active",
      seats: 10,
      seatsUsed: 7,
      mrr: 1800,
      createdAt: new Date("2024-03-08"),
      adminEmail: "ops@nexuslabs.io",
    },
  })

  const orbital = await prisma.organization.create({
    data: {
      id: "org-orbital",
      slug: "orbital-systems",
      name: "Orbital Systems",
      logoInitials: "OS",
      plan: "Starter",
      status: "trial",
      seats: 5,
      seatsUsed: 3,
      mrr: 0,
      createdAt: new Date("2025-01-20"),
      adminEmail: "hello@orbital.dev",
    },
  })

  const pinecrest = await prisma.organization.create({
    data: {
      id: "org-pinecrest",
      slug: "pinecrest-digital",
      name: "Pinecrest Digital",
      logoInitials: "PD",
      plan: "Business",
      status: "suspended",
      seats: 8,
      seatsUsed: 6,
      mrr: 1200,
      createdAt: new Date("2023-11-02"),
      adminEmail: "dev@pinecrest.com",
    },
  })

  // ─────────────────────────────────────────────────────────
  // SF-16: Users (auth accounts — seed passwords are "password123")
  // ─────────────────────────────────────────────────────────
  console.log("  → Users")

  const uSuperAdmin = await prisma.user.create({
    data: {
      id: "user-superadmin",
      name: "System Admin",
      email: "superadmin@assembled.dev",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "SA",
      globalRole: "super_admin",
    },
  })

  const uJames = await prisma.user.create({
    data: {
      id: "user-james",
      name: "James Mitchell",
      email: "james@acme.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "JM",
      globalRole: "org_admin",
    },
  })

  const uSarah = await prisma.user.create({
    data: {
      id: "user-sarah",
      name: "Sarah Chen",
      email: "sarah@acme.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "SC",
      globalRole: "developer",
    },
  })

  const uAlex = await prisma.user.create({
    data: {
      id: "user-alex",
      name: "Alex Rivera",
      email: "alex@acme.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "AR",
      globalRole: "developer",
    },
  })

  await prisma.user.create({
    data: {
      id: "user-emily",
      name: "Emily Torres",
      email: "emily@acme.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "ET",
      globalRole: "developer",
    },
  })

  await prisma.user.create({
    data: {
      id: "user-david",
      name: "David Kim",
      email: "david@acme.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "DK",
      globalRole: "developer",
    },
  })

  await prisma.user.create({
    data: {
      id: "user-nina",
      name: "Nina Patel",
      email: "nina@nexuslabs.io",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "NP",
      globalRole: "org_admin",
    },
  })

  await prisma.user.create({
    data: {
      id: "user-chris",
      name: "Chris Wong",
      email: "chris@nexuslabs.io",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "CW",
      globalRole: "developer",
    },
  })

  await prisma.user.create({
    data: {
      id: "user-rachel",
      name: "Rachel Moore",
      email: "rachel@nexuslabs.io",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "RM",
      globalRole: "product_owner",
    },
  })

  await prisma.user.create({
    data: {
      id: "user-liam",
      name: "Liam Foster",
      email: "liam@orbital.dev",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "LF",
      globalRole: "org_admin",
    },
  })

  await prisma.user.create({
    data: {
      id: "user-priya",
      name: "Priya Sharma",
      email: "priya@orbital.dev",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "PS",
      globalRole: "developer",
    },
  })

  await prisma.user.create({
    data: {
      id: "user-tom",
      name: "Tom Hayes",
      email: "tom@pinecrest.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "TH",
      globalRole: "org_admin",
    },
  })

  await prisma.user.create({
    data: {
      id: "user-linda",
      name: "Linda Cruz",
      email: "linda@pinecrest.com",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "LC",
      globalRole: "developer",
    },
  })

  const uMarcus = await prisma.user.create({
    data: {
      id: "user-marcus",
      name: "Marcus Johnson",
      email: "marcus@assembled.dev",
      passwordHash: DEFAULT_PASSWORD_HASH,
      avatar: "MJ",
      globalRole: "developer",
    },
  })

  // ─────────────────────────────────────────────────────────
  // SF-10: Memberships
  // ─────────────────────────────────────────────────────────
  console.log("  → Memberships")

  // acme-corp members
  await prisma.membership.createMany({
    data: [
      { userId: "user-james", orgId: acme.id, role: "admin", status: "active", lastActive: "2 min ago" },
      { userId: "user-sarah", orgId: acme.id, role: "scrum_master", status: "active", lastActive: "1 hr ago" },
      { userId: "user-alex", orgId: acme.id, role: "developer", status: "active", lastActive: "3 hrs ago" },
      { userId: "user-emily", orgId: acme.id, role: "client_viewer", status: "active", lastActive: "1 day ago" },
      { userId: "user-david", orgId: acme.id, role: "developer", status: "invited", lastActive: "Pending" },
    ],
  })

  // nexus-labs members
  await prisma.membership.createMany({
    data: [
      { userId: "user-nina", orgId: nexus.id, role: "admin", status: "active", lastActive: "5 min ago" },
      { userId: "user-chris", orgId: nexus.id, role: "developer", status: "active", lastActive: "2 hrs ago" },
      { userId: "user-rachel", orgId: nexus.id, role: "scrum_master", status: "active", lastActive: "30 min ago" },
    ],
  })

  // orbital-systems members
  await prisma.membership.createMany({
    data: [
      { userId: "user-liam", orgId: orbital.id, role: "admin", status: "active", lastActive: "10 min ago" },
      { userId: "user-priya", orgId: orbital.id, role: "developer", status: "invited", lastActive: "Pending" },
    ],
  })

  // pinecrest-digital members
  await prisma.membership.createMany({
    data: [
      { userId: "user-tom", orgId: pinecrest.id, role: "admin", status: "disabled", lastActive: "15 days ago" },
      { userId: "user-linda", orgId: pinecrest.id, role: "developer", status: "disabled", lastActive: "15 days ago" },
    ],
  })

  // ─────────────────────────────────────────────────────────
  // SF-11: Pods
  // ─────────────────────────────────────────────────────────
  console.log("  → Pods")

  const SPRINT_START = new Date("2025-02-10")
  const SPRINT_END = new Date("2025-02-21")

  const podMomentum = await prisma.pod.create({
    data: { id: "pod-momentum", slug: "momentum-pod", name: "Momentum Pod", client: "Client A", orgId: acme.id, healthScore: 92, healthStatus: "healthy" },
  })
  const podVelocity = await prisma.pod.create({
    data: { id: "pod-velocity", slug: "velocity-pod", name: "Velocity Pod", client: "Client B", orgId: acme.id, healthScore: 74, healthStatus: "watch" },
  })
  const podApex = await prisma.pod.create({
    data: { id: "pod-apex", slug: "apex-pod", name: "Apex Pod", client: "Client E", orgId: acme.id, healthScore: 95, healthStatus: "healthy" },
  })
  const podAtlas = await prisma.pod.create({
    data: { id: "pod-atlas", slug: "atlas-pod", name: "Atlas Pod", client: "Client C", orgId: nexus.id, healthScore: 88, healthStatus: "healthy" },
  })
  const podForge = await prisma.pod.create({
    data: { id: "pod-forge", slug: "forge-pod", name: "Forge Pod", client: "Client F", orgId: nexus.id, healthScore: 78, healthStatus: "watch" },
  })
  const podHorizon = await prisma.pod.create({
    data: { id: "pod-horizon", slug: "horizon-pod", name: "Horizon Pod", client: "Client D", orgId: orbital.id, healthScore: 61, healthStatus: "at_risk" },
  })

  // ─────────────────────────────────────────────────────────
  // SF-11: Sprints
  // ─────────────────────────────────────────────────────────
  console.log("  → Sprints")

  const sprintMomentum = await prisma.sprint.create({
    data: {
      id: "sprint-momentum-14",
      podId: podMomentum.id,
      name: "Sprint 14",
      startDate: SPRINT_START,
      endDate: SPRINT_END,
      sprintDay: 6,
      totalDays: 10,
      isCurrent: true,
      completion: 72,
      expectedCompletion: 60,
      blockers: 0,
      carryoverRisk: 8,
      velocityDirection: "up",
      committedSP: 38, committedTasks: 12,
      inProgressSP: 11, inProgressTasks: 3,
      remainingSP: 6, remainingTasks: 2,
      doneSP: 21, doneTasks: 7,
      remainingCapacitySP: 18,
      storiesRemaining: 5,
      qaQueueCount: 2,
      velocityHistory: [
        { sprint: "Sprint 9", sp: 28 }, { sprint: "Sprint 10", sp: 32 },
        { sprint: "Sprint 11", sp: 30 }, { sprint: "Sprint 12", sp: 35 },
        { sprint: "Sprint 13", sp: 33 }, { sprint: "Sprint 14", sp: 38 },
      ],
      carryoverHistory: [
        { sprint: "S9", pct: 18 }, { sprint: "S10", pct: 14 },
        { sprint: "S11", pct: 10 }, { sprint: "S12", pct: 12 },
        { sprint: "S13", pct: 9 }, { sprint: "S14", pct: 8 },
      ],
    },
  })

  const sprintVelocity = await prisma.sprint.create({
    data: {
      id: "sprint-velocity-14",
      podId: podVelocity.id,
      name: "Sprint 14",
      startDate: SPRINT_START,
      endDate: SPRINT_END,
      sprintDay: 6, totalDays: 10, isCurrent: true,
      completion: 55, expectedCompletion: 60,
      blockers: 2, carryoverRisk: 22,
      velocityDirection: "down",
      committedSP: 34, committedTasks: 14,
      inProgressSP: 8, inProgressTasks: 3,
      remainingSP: 10, remainingTasks: 5,
      doneSP: 16, doneTasks: 6,
      remainingCapacitySP: 13, storiesRemaining: 9, qaQueueCount: 5,
      velocityHistory: [
        { sprint: "Sprint 9", sp: 35 }, { sprint: "Sprint 10", sp: 32 },
        { sprint: "Sprint 11", sp: 28 }, { sprint: "Sprint 12", sp: 25 },
        { sprint: "Sprint 13", sp: 27 }, { sprint: "Sprint 14", sp: 24 },
      ],
      carryoverHistory: [
        { sprint: "S9", pct: 12 }, { sprint: "S10", pct: 18 },
        { sprint: "S11", pct: 24 }, { sprint: "S12", pct: 20 },
        { sprint: "S13", pct: 22 }, { sprint: "S14", pct: 22 },
      ],
    },
  })

  await prisma.sprint.create({
    data: {
      id: "sprint-atlas-14",
      podId: podAtlas.id,
      name: "Sprint 14",
      startDate: SPRINT_START, endDate: SPRINT_END,
      sprintDay: 6, totalDays: 10, isCurrent: true,
      completion: 68, expectedCompletion: 60,
      blockers: 1, carryoverRisk: 12,
      velocityDirection: "up",
      committedSP: 30, committedTasks: 10,
      inProgressSP: 7, inProgressTasks: 2,
      remainingSP: 5, remainingTasks: 2,
      doneSP: 18, doneTasks: 6,
      remainingCapacitySP: 16, storiesRemaining: 6, qaQueueCount: 3,
      velocityHistory: [
        { sprint: "Sprint 9", sp: 20 }, { sprint: "Sprint 10", sp: 24 },
        { sprint: "Sprint 11", sp: 22 }, { sprint: "Sprint 12", sp: 26 },
        { sprint: "Sprint 13", sp: 28 }, { sprint: "Sprint 14", sp: 30 },
      ],
      carryoverHistory: [
        { sprint: "S9", pct: 20 }, { sprint: "S10", pct: 16 },
        { sprint: "S11", pct: 18 }, { sprint: "S12", pct: 14 },
        { sprint: "S13", pct: 11 }, { sprint: "S14", pct: 12 },
      ],
    },
  })

  await prisma.sprint.create({
    data: {
      id: "sprint-horizon-14",
      podId: podHorizon.id,
      name: "Sprint 14",
      startDate: SPRINT_START, endDate: SPRINT_END,
      sprintDay: 6, totalDays: 10, isCurrent: true,
      completion: 38, expectedCompletion: 60,
      blockers: 3, carryoverRisk: 35,
      velocityDirection: "down",
      committedSP: 28, committedTasks: 15,
      inProgressSP: 6, inProgressTasks: 3,
      remainingSP: 14, remainingTasks: 8,
      doneSP: 8, doneTasks: 4,
      remainingCapacitySP: 8, storiesRemaining: 12, qaQueueCount: 7,
      velocityHistory: [
        { sprint: "Sprint 9", sp: 30 }, { sprint: "Sprint 10", sp: 28 },
        { sprint: "Sprint 11", sp: 22 }, { sprint: "Sprint 12", sp: 18 },
        { sprint: "Sprint 13", sp: 20 }, { sprint: "Sprint 14", sp: 16 },
      ],
      carryoverHistory: [
        { sprint: "S9", pct: 15 }, { sprint: "S10", pct: 22 },
        { sprint: "S11", pct: 30 }, { sprint: "S12", pct: 38 },
        { sprint: "S13", pct: 32 }, { sprint: "S14", pct: 35 },
      ],
    },
  })

  await prisma.sprint.create({
    data: {
      id: "sprint-apex-14",
      podId: podApex.id,
      name: "Sprint 14",
      startDate: SPRINT_START, endDate: SPRINT_END,
      sprintDay: 6, totalDays: 10, isCurrent: true,
      completion: 80, expectedCompletion: 60,
      blockers: 0, carryoverRisk: 5,
      velocityDirection: "up",
      committedSP: 36, committedTasks: 11,
      inProgressSP: 5, inProgressTasks: 2,
      remainingSP: 3, remainingTasks: 1,
      doneSP: 28, doneTasks: 8,
      remainingCapacitySP: 21, storiesRemaining: 3, qaQueueCount: 1,
      velocityHistory: [
        { sprint: "Sprint 9", sp: 25 }, { sprint: "Sprint 10", sp: 28 },
        { sprint: "Sprint 11", sp: 32 }, { sprint: "Sprint 12", sp: 30 },
        { sprint: "Sprint 13", sp: 34 }, { sprint: "Sprint 14", sp: 36 },
      ],
      carryoverHistory: [
        { sprint: "S9", pct: 10 }, { sprint: "S10", pct: 8 },
        { sprint: "S11", pct: 6 }, { sprint: "S12", pct: 7 },
        { sprint: "S13", pct: 5 }, { sprint: "S14", pct: 5 },
      ],
    },
  })

  await prisma.sprint.create({
    data: {
      id: "sprint-forge-14",
      podId: podForge.id,
      name: "Sprint 14",
      startDate: SPRINT_START, endDate: SPRINT_END,
      sprintDay: 6, totalDays: 10, isCurrent: true,
      completion: 58, expectedCompletion: 60,
      blockers: 1, carryoverRisk: 20,
      velocityDirection: "stable",
      committedSP: 30, committedTasks: 13,
      inProgressSP: 9, inProgressTasks: 4,
      remainingSP: 7, remainingTasks: 3,
      doneSP: 14, doneTasks: 6,
      remainingCapacitySP: 12, storiesRemaining: 8, qaQueueCount: 4,
      velocityHistory: [
        { sprint: "Sprint 9", sp: 30 }, { sprint: "Sprint 10", sp: 30 },
        { sprint: "Sprint 11", sp: 28 }, { sprint: "Sprint 12", sp: 32 },
        { sprint: "Sprint 13", sp: 29 }, { sprint: "Sprint 14", sp: 30 },
      ],
      carryoverHistory: [
        { sprint: "S9", pct: 22 }, { sprint: "S10", pct: 18 },
        { sprint: "S11", pct: 24 }, { sprint: "S12", pct: 16 },
        { sprint: "S13", pct: 21 }, { sprint: "S14", pct: 20 },
      ],
    },
  })

  // ─────────────────────────────────────────────────────────
  // SF-11: Sprint Tickets
  // ─────────────────────────────────────────────────────────
  console.log("  → Sprint Tickets")

  await prisma.sprintTicket.createMany({
    data: [
      // Momentum Pod — Sprint 14
      { id: "MOM-101", title: "User auth flow redesign", assigneeName: "Sarah Chen", storyPoints: 5, status: "done", sprintId: sprintMomentum.id },
      { id: "MOM-102", title: "Dashboard analytics API", assigneeName: "Alex Kim", storyPoints: 3, status: "done", sprintId: sprintMomentum.id },
      { id: "MOM-103", title: "Notification service setup", assigneeName: "Sarah Chen", storyPoints: 3, status: "done", sprintId: sprintMomentum.id },
      { id: "MOM-104", title: "Profile settings page", assigneeName: "Jake Lee", storyPoints: 2, status: "done", sprintId: sprintMomentum.id },
      { id: "MOM-105", title: "Data export CSV feature", assigneeName: "Alex Kim", storyPoints: 3, status: "done", sprintId: sprintMomentum.id },
      { id: "MOM-106", title: "Role-based access control", assigneeName: "Sarah Chen", storyPoints: 3, status: "done", sprintId: sprintMomentum.id },
      { id: "MOM-107", title: "Email template builder", assigneeName: "Jake Lee", storyPoints: 2, status: "done", sprintId: sprintMomentum.id },
      { id: "MOM-108", title: "Search indexing optimization", assigneeName: "Alex Kim", storyPoints: 5, status: "in_progress", sprintId: sprintMomentum.id },
      { id: "MOM-109", title: "Webhook integration layer", assigneeName: "Sarah Chen", storyPoints: 3, status: "in_progress", sprintId: sprintMomentum.id },
      { id: "MOM-110", title: "Billing page UI refresh", assigneeName: "Jake Lee", storyPoints: 3, status: "in_progress", sprintId: sprintMomentum.id },
      { id: "MOM-111", title: "API rate limiting setup", assigneeName: "Alex Kim", storyPoints: 3, status: "remaining", sprintId: sprintMomentum.id },
      { id: "MOM-112", title: "Onboarding wizard v2", assigneeName: "Jake Lee", storyPoints: 3, status: "remaining", sprintId: sprintMomentum.id },

      // Velocity Pod — Sprint 14
      { id: "VEL-201", title: "Checkout flow migration", assigneeName: "Priya Patel", storyPoints: 3, status: "done", sprintId: sprintVelocity.id },
      { id: "VEL-202", title: "Inventory sync engine", assigneeName: "Tom Garcia", storyPoints: 3, status: "done", sprintId: sprintVelocity.id },
      { id: "VEL-203", title: "Product catalog cache", assigneeName: "Priya Patel", storyPoints: 2, status: "done", sprintId: sprintVelocity.id },
      { id: "VEL-204", title: "Order tracking page", assigneeName: "Nina Shah", storyPoints: 3, status: "done", sprintId: sprintVelocity.id },
      { id: "VEL-205", title: "Payment retry logic", assigneeName: "Tom Garcia", storyPoints: 2, status: "done", sprintId: sprintVelocity.id },
      { id: "VEL-206", title: "Shipping label generator", assigneeName: "Nina Shah", storyPoints: 3, status: "done", sprintId: sprintVelocity.id },
      { id: "VEL-207", title: "Cart persistence layer", assigneeName: "Priya Patel", storyPoints: 3, status: "in_progress", sprintId: sprintVelocity.id },
      { id: "VEL-208", title: "Discount engine rules", assigneeName: "Tom Garcia", storyPoints: 3, status: "in_progress", sprintId: sprintVelocity.id },
      { id: "VEL-209", title: "Returns portal UI", assigneeName: "Nina Shah", storyPoints: 2, status: "in_progress", sprintId: sprintVelocity.id },
      { id: "VEL-210", title: "Supplier API integration", assigneeName: "Priya Patel", storyPoints: 2, status: "remaining", sprintId: sprintVelocity.id },
      { id: "VEL-211", title: "Warehouse routing logic", assigneeName: "Tom Garcia", storyPoints: 3, status: "remaining", sprintId: sprintVelocity.id },
      { id: "VEL-212", title: "Review moderation system", assigneeName: "Nina Shah", storyPoints: 2, status: "remaining", sprintId: sprintVelocity.id },
      { id: "VEL-213", title: "Bulk order upload tool", assigneeName: "Priya Patel", storyPoints: 1, status: "remaining", sprintId: sprintVelocity.id },
      { id: "VEL-214", title: "Tax calculation service", assigneeName: "Tom Garcia", storyPoints: 2, status: "remaining", sprintId: sprintVelocity.id },

      // Atlas Pod — Sprint 14
      { id: "ATL-301", title: "Map rendering engine v2", assigneeName: "Liam Brooks", storyPoints: 5, status: "done", sprintId: "sprint-atlas-14" },
      { id: "ATL-302", title: "Geolocation search API", assigneeName: "Eva Martinez", storyPoints: 3, status: "done", sprintId: "sprint-atlas-14" },
      { id: "ATL-303", title: "Route optimization algo", assigneeName: "Liam Brooks", storyPoints: 3, status: "done", sprintId: "sprint-atlas-14" },
      { id: "ATL-304", title: "Location bookmarks sync", assigneeName: "Ryan Torres", storyPoints: 2, status: "done", sprintId: "sprint-atlas-14" },
      { id: "ATL-305", title: "Offline map caching", assigneeName: "Eva Martinez", storyPoints: 3, status: "done", sprintId: "sprint-atlas-14" },
      { id: "ATL-306", title: "POI data enrichment", assigneeName: "Ryan Torres", storyPoints: 2, status: "done", sprintId: "sprint-atlas-14" },
      { id: "ATL-307", title: "Traffic layer overlay", assigneeName: "Liam Brooks", storyPoints: 5, status: "in_progress", sprintId: "sprint-atlas-14" },
      { id: "ATL-308", title: "ETA prediction model", assigneeName: "Eva Martinez", storyPoints: 2, status: "in_progress", sprintId: "sprint-atlas-14" },
      { id: "ATL-309", title: "Address autocomplete v3", assigneeName: "Ryan Torres", storyPoints: 3, status: "remaining", sprintId: "sprint-atlas-14" },
      { id: "ATL-310", title: "Map annotation tools", assigneeName: "Liam Brooks", storyPoints: 2, status: "remaining", sprintId: "sprint-atlas-14" },

      // Horizon Pod — Sprint 14
      { id: "HOR-401", title: "Event streaming setup", assigneeName: "Maya Johnson", storyPoints: 2, status: "done", sprintId: "sprint-horizon-14" },
      { id: "HOR-402", title: "Message queue consumer", assigneeName: "Derek Wong", storyPoints: 3, status: "done", sprintId: "sprint-horizon-14" },
      { id: "HOR-403", title: "Schema registry config", assigneeName: "Lia Fernandez", storyPoints: 1, status: "done", sprintId: "sprint-horizon-14" },
      { id: "HOR-404", title: "Dead letter queue handler", assigneeName: "Maya Johnson", storyPoints: 2, status: "done", sprintId: "sprint-horizon-14" },
      { id: "HOR-405", title: "Stream partitioning logic", assigneeName: "Derek Wong", storyPoints: 2, status: "in_progress", sprintId: "sprint-horizon-14" },
      { id: "HOR-406", title: "Consumer group rebalance", assigneeName: "Lia Fernandez", storyPoints: 2, status: "in_progress", sprintId: "sprint-horizon-14" },
      { id: "HOR-407", title: "Replay mechanism v2", assigneeName: "Maya Johnson", storyPoints: 2, status: "in_progress", sprintId: "sprint-horizon-14" },
      { id: "HOR-408", title: "Batch processing pipeline", assigneeName: "Derek Wong", storyPoints: 3, status: "remaining", sprintId: "sprint-horizon-14" },
      { id: "HOR-409", title: "Monitoring dashboard", assigneeName: "Lia Fernandez", storyPoints: 2, status: "remaining", sprintId: "sprint-horizon-14" },
      { id: "HOR-410", title: "Alert routing rules", assigneeName: "Maya Johnson", storyPoints: 1, status: "remaining", sprintId: "sprint-horizon-14" },
      { id: "HOR-411", title: "Throughput benchmarks", assigneeName: "Derek Wong", storyPoints: 2, status: "remaining", sprintId: "sprint-horizon-14" },
      { id: "HOR-412", title: "Data retention policies", assigneeName: "Lia Fernandez", storyPoints: 2, status: "remaining", sprintId: "sprint-horizon-14" },
      { id: "HOR-413", title: "Cross-region replication", assigneeName: "Maya Johnson", storyPoints: 2, status: "remaining", sprintId: "sprint-horizon-14" },
      { id: "HOR-414", title: "Backpressure handling", assigneeName: "Derek Wong", storyPoints: 1, status: "remaining", sprintId: "sprint-horizon-14" },
      { id: "HOR-415", title: "Idempotency key service", assigneeName: "Lia Fernandez", storyPoints: 2, status: "remaining", sprintId: "sprint-horizon-14" },

      // Apex Pod — Sprint 14
      { id: "APX-501", title: "ML model serving layer", assigneeName: "Chris Nakamura", storyPoints: 5, status: "done", sprintId: "sprint-apex-14" },
      { id: "APX-502", title: "Feature store pipeline", assigneeName: "Anna Kowalski", storyPoints: 3, status: "done", sprintId: "sprint-apex-14" },
      { id: "APX-503", title: "Training data ETL", assigneeName: "Chris Nakamura", storyPoints: 3, status: "done", sprintId: "sprint-apex-14" },
      { id: "APX-504", title: "A/B experiment framework", assigneeName: "Raj Mehta", storyPoints: 5, status: "done", sprintId: "sprint-apex-14" },
      { id: "APX-505", title: "Model versioning system", assigneeName: "Anna Kowalski", storyPoints: 3, status: "done", sprintId: "sprint-apex-14" },
      { id: "APX-506", title: "Inference caching layer", assigneeName: "Chris Nakamura", storyPoints: 3, status: "done", sprintId: "sprint-apex-14" },
      { id: "APX-507", title: "Metrics collection SDK", assigneeName: "Raj Mehta", storyPoints: 3, status: "done", sprintId: "sprint-apex-14" },
      { id: "APX-508", title: "Real-time predictions API", assigneeName: "Anna Kowalski", storyPoints: 3, status: "done", sprintId: "sprint-apex-14" },
      { id: "APX-509", title: "Drift detection alerts", assigneeName: "Chris Nakamura", storyPoints: 3, status: "in_progress", sprintId: "sprint-apex-14" },
      { id: "APX-510", title: "Model rollback mechanism", assigneeName: "Raj Mehta", storyPoints: 2, status: "in_progress", sprintId: "sprint-apex-14" },
      { id: "APX-511", title: "Shadow mode testing", assigneeName: "Anna Kowalski", storyPoints: 3, status: "remaining", sprintId: "sprint-apex-14" },

      // Forge Pod — Sprint 14
      { id: "FRG-601", title: "CI/CD pipeline refactor", assigneeName: "Omar Hussein", storyPoints: 3, status: "done", sprintId: "sprint-forge-14" },
      { id: "FRG-602", title: "Container orchestration", assigneeName: "Sam Rivera", storyPoints: 2, status: "done", sprintId: "sprint-forge-14" },
      { id: "FRG-603", title: "Secrets management vault", assigneeName: "Tina Park", storyPoints: 3, status: "done", sprintId: "sprint-forge-14" },
      { id: "FRG-604", title: "Log aggregation service", assigneeName: "Omar Hussein", storyPoints: 2, status: "done", sprintId: "sprint-forge-14" },
      { id: "FRG-605", title: "Auto-scaling policies", assigneeName: "Sam Rivera", storyPoints: 2, status: "done", sprintId: "sprint-forge-14" },
      { id: "FRG-606", title: "Blue-green deploy setup", assigneeName: "Tina Park", storyPoints: 2, status: "done", sprintId: "sprint-forge-14" },
      { id: "FRG-607", title: "Infra cost monitoring", assigneeName: "Omar Hussein", storyPoints: 3, status: "in_progress", sprintId: "sprint-forge-14" },
      { id: "FRG-608", title: "Service mesh config", assigneeName: "Sam Rivera", storyPoints: 2, status: "in_progress", sprintId: "sprint-forge-14" },
      { id: "FRG-609", title: "Canary release tooling", assigneeName: "Tina Park", storyPoints: 2, status: "in_progress", sprintId: "sprint-forge-14" },
      { id: "FRG-610", title: "Dependency vulnerability scan", assigneeName: "Omar Hussein", storyPoints: 2, status: "in_progress", sprintId: "sprint-forge-14" },
      { id: "FRG-611", title: "Chaos testing framework", assigneeName: "Sam Rivera", storyPoints: 3, status: "remaining", sprintId: "sprint-forge-14" },
      { id: "FRG-612", title: "Backup rotation policy", assigneeName: "Tina Park", storyPoints: 2, status: "remaining", sprintId: "sprint-forge-14" },
      { id: "FRG-613", title: "Network policy hardening", assigneeName: "Omar Hussein", storyPoints: 2, status: "remaining", sprintId: "sprint-forge-14" },
    ],
  })

  // ─────────────────────────────────────────────────────────
  // SF-12: Developers
  // ─────────────────────────────────────────────────────────
  console.log("  → Developers")

  const devAlex = await prisma.developer.create({
    data: {
      id: "dev-alex",
      slug: "alex-rivera",
      name: "Alex Rivera",
      role: "Backend Developer",
      avatar: "AR",
      userId: uAlex.id,
      currentSprint: "Sprint 14",
      totalAllocation: 95,
      activeTickets: 5, wipLimit: 3, wipStatus: "over_limit",
      prsOpen: 3, prsWaitingReview: 2, avgPrReviewTime: 42,
      blockersOwned: 2, longestBlockedHours: 36,
      contextSwitchIndex: 3.2, activeProjectsCount: 3,
      throughputThisSprint: 11, throughput3SprintAvg: 21,
      prsOpenedThisSprint: 6, prsMerged: 3, avgTimeToMerge: 28, reviewsDone: 4,
      cycleTimeHistory: [
        { sprint: "Sprint 11", devTime: 2.1, teamAvg: 2.4 },
        { sprint: "Sprint 12", devTime: 2.3, teamAvg: 2.2 },
        { sprint: "Sprint 13", devTime: 2.8, teamAvg: 2.5 },
        { sprint: "Sprint 14", devTime: 3.6, teamAvg: 2.6 },
      ],
      ticketAging: [
        { range: "0-2 days", count: 2, color: "#34d399" },
        { range: "3-5 days", count: 1, color: "#f59e0b" },
        { range: "6+ days", count: 2, color: "#ef4444" },
      ],
      riskSignals: [
        "2 tickets aging beyond 6 days -- possible scope underestimation.",
        "PR review latency 42h exceeds 24h threshold.",
        "High context switching across 3 projects (index: 3.2).",
        "WIP count (5) exceeds limit (3) -- delivery predictability at risk.",
        "Blocked ticket FRG-034 has no linked PR after 6 days in progress.",
      ],
    },
  })

  const devSarah = await prisma.developer.create({
    data: {
      id: "dev-sarah",
      slug: "sarah-chen",
      name: "Sarah Chen",
      role: "Full Stack Developer",
      avatar: "SC",
      userId: uSarah.id,
      currentSprint: "Sprint 14",
      totalAllocation: 80,
      activeTickets: 3, wipLimit: 3, wipStatus: "healthy",
      prsOpen: 2, prsWaitingReview: 1, avgPrReviewTime: 18,
      blockersOwned: 1, longestBlockedHours: 12,
      contextSwitchIndex: 1.8, activeProjectsCount: 2,
      throughputThisSprint: 18, throughput3SprintAvg: 18,
      prsOpenedThisSprint: 5, prsMerged: 4, avgTimeToMerge: 14, reviewsDone: 7,
      cycleTimeHistory: [
        { sprint: "Sprint 11", devTime: 1.8, teamAvg: 2.4 },
        { sprint: "Sprint 12", devTime: 1.6, teamAvg: 2.2 },
        { sprint: "Sprint 13", devTime: 2.0, teamAvg: 2.5 },
        { sprint: "Sprint 14", devTime: 2.1, teamAvg: 2.6 },
      ],
      ticketAging: [
        { range: "0-2 days", count: 2, color: "#34d399" },
        { range: "3-5 days", count: 1, color: "#f59e0b" },
        { range: "6+ days", count: 0, color: "#ef4444" },
      ],
      riskSignals: ["1 blocked ticket on Velocity Pod pending client response."],
    },
  })

  const devMarcus = await prisma.developer.create({
    data: {
      id: "dev-marcus",
      slug: "marcus-johnson",
      name: "Marcus Johnson",
      role: "Frontend Developer",
      avatar: "MJ",
      userId: uMarcus.id,
      currentSprint: "Sprint 14",
      totalAllocation: 110,
      activeTickets: 6, wipLimit: 3, wipStatus: "over_limit",
      prsOpen: 4, prsWaitingReview: 3, avgPrReviewTime: 52,
      blockersOwned: 2, longestBlockedHours: 48,
      contextSwitchIndex: 4.1, activeProjectsCount: 3,
      throughputThisSprint: 8, throughput3SprintAvg: 18,
      prsOpenedThisSprint: 7, prsMerged: 2, avgTimeToMerge: 38, reviewsDone: 2,
      cycleTimeHistory: [
        { sprint: "Sprint 11", devTime: 2.6, teamAvg: 2.4 },
        { sprint: "Sprint 12", devTime: 3.0, teamAvg: 2.2 },
        { sprint: "Sprint 13", devTime: 3.4, teamAvg: 2.5 },
        { sprint: "Sprint 14", devTime: 4.2, teamAvg: 2.6 },
      ],
      ticketAging: [
        { range: "0-2 days", count: 1, color: "#34d399" },
        { range: "3-5 days", count: 2, color: "#f59e0b" },
        { range: "6+ days", count: 3, color: "#ef4444" },
      ],
      riskSignals: [
        "Total allocation at 110% -- overcommitted across 3 pods.",
        "3 tickets aging beyond 6 days -- significant delivery risk.",
        "PR review latency 52h is critically above 24h threshold.",
        "Context switch index 4.1 is dangerously high across 3 projects.",
        "WIP count (6) doubles the limit (3).",
        "Ticket VEL-084 blocked 5 days with no PR linked.",
      ],
    },
  })

  // Allocations
  console.log("  → Allocations")

  await prisma.allocation.createMany({
    data: [
      { developerId: devAlex.id, podId: podMomentum.id, percentage: 50 },
      { developerId: devAlex.id, podId: podAtlas.id, percentage: 30 },
      { developerId: devAlex.id, podId: podForge.id, percentage: 15 },
      { developerId: devSarah.id, podId: podMomentum.id, percentage: 60 },
      { developerId: devSarah.id, podId: podVelocity.id, percentage: 20 },
      { developerId: devMarcus.id, podId: podVelocity.id, percentage: 40 },
      { developerId: devMarcus.id, podId: podHorizon.id, percentage: 40 },
      { developerId: devMarcus.id, podId: podApex.id, percentage: 30 },
    ],
  })

  // PRs
  console.log("  → Pull Requests")

  await prisma.pR.createMany({
    data: [
      { id: "PR-412", title: "feat: add payment webhook handler", status: "waiting_review", createdAtLabel: "2d ago", hoursSinceUpdate: 42, developerId: devAlex.id },
      { id: "PR-408", title: "fix: resolve race condition in queue", status: "waiting_review", createdAtLabel: "3d ago", hoursSinceUpdate: 56, developerId: devAlex.id },
      { id: "PR-401", title: "chore: database migration v14", status: "merged", createdAtLabel: "4d ago", hoursSinceUpdate: 0, developerId: devAlex.id },
      { id: "PR-415", title: "feat: API rate limiter middleware", status: "open", createdAtLabel: "1d ago", hoursSinceUpdate: 18, developerId: devAlex.id },
      { id: "PR-410", title: "feat: user settings redesign", status: "waiting_review", createdAtLabel: "1d ago", hoursSinceUpdate: 22, developerId: devSarah.id },
      { id: "PR-406", title: "fix: auth token refresh logic", status: "merged", createdAtLabel: "3d ago", hoursSinceUpdate: 0, developerId: devSarah.id },
      { id: "PR-420", title: "feat: dashboard redesign v2", status: "waiting_review", createdAtLabel: "2d ago", hoursSinceUpdate: 48, developerId: devMarcus.id },
      { id: "PR-418", title: "feat: notification system UI", status: "waiting_review", createdAtLabel: "3d ago", hoursSinceUpdate: 62, developerId: devMarcus.id },
      { id: "PR-416", title: "fix: responsive grid layout", status: "waiting_review", createdAtLabel: "1d ago", hoursSinceUpdate: 24, developerId: devMarcus.id },
      { id: "PR-414", title: "chore: component library update", status: "open", createdAtLabel: "1d ago", hoursSinceUpdate: 12, developerId: devMarcus.id },
    ],
  })

  // ─────────────────────────────────────────────────────────
  // SF-13: Support Tickets + Replies + Audit Events
  // ─────────────────────────────────────────────────────────
  console.log("  → Support Tickets")

  const tkt001 = await prisma.supportTicket.create({
    data: {
      id: "TKT-001", subject: "Cannot connect Jira integration",
      description: "When clicking 'Connect' on the Jira integration card, the OAuth flow starts but returns a 403 error after callback. We have tried revoking and re-authorizing the Jira app but the issue persists.",
      submittedBy: "admin@acme.com", submittedByName: "James Mitchell", submittedByAvatar: "JM",
      category: "integration", status: "open", priority: "high",
      createdLabel: "Mar 4, 2025", lastUpdateLabel: "Mar 5, 2025", orgId: acme.id,
    },
  })
  await prisma.ticketReply.createMany({ data: [
    { id: "r1", ticketId: tkt001.id, author: "Support Team", authorAvatar: "SA", role: "super_admin", body: "Thanks for reaching out, James. We have reproduced the issue on our end — it appears to be related to a permissions scope change in the Jira Cloud API. We are working on a fix and will push an update within 24 hours.", timestamp: "Mar 5, 2025 10:30" },
    { id: "r2", ticketId: tkt001.id, author: "James Mitchell", authorAvatar: "JM", role: "org_admin", body: "Appreciate the quick response. Let me know if you need any additional details from our end such as workspace URL or error logs.", timestamp: "Mar 5, 2025 11:15" },
  ]})

  const tkt002 = await prisma.supportTicket.create({
    data: {
      id: "TKT-002", subject: "Sprint velocity chart not loading",
      description: "The velocity chart on the pod overview page shows a blank canvas. Affects all pods. Started after the last platform update on Feb 27.",
      submittedBy: "sarah@acme.com", submittedByName: "Sarah Chen", submittedByAvatar: "SC",
      category: "bug", status: "in_progress", priority: "medium",
      createdLabel: "Feb 28, 2025", lastUpdateLabel: "Mar 3, 2025", orgId: acme.id,
    },
  })
  await prisma.ticketReply.createMany({ data: [
    { id: "r3", ticketId: tkt002.id, author: "Support Team", authorAvatar: "SA", role: "super_admin", body: "Hi Sarah, we have identified a regression in the chart rendering introduced in v2.4.1. Our engineering team has a fix in review — expected release is March 4. We will notify you once it is deployed.", timestamp: "Mar 1, 2025 09:00" },
    { id: "r4", ticketId: tkt002.id, author: "Sarah Chen", authorAvatar: "SC", role: "org_admin", body: "Thanks for the update. Is there a workaround in the meantime?", timestamp: "Mar 1, 2025 09:45" },
    { id: "r5", ticketId: tkt002.id, author: "Support Team", authorAvatar: "SA", role: "super_admin", body: "Unfortunately there is no workaround at this time. The fix is our top priority this sprint.", timestamp: "Mar 1, 2025 10:00" },
  ]})

  const tkt003 = await prisma.supportTicket.create({
    data: {
      id: "TKT-003", subject: "Billing invoice shows incorrect amount",
      description: "February invoice shows $5,800 instead of our contracted rate of $4,800. Please review and issue a corrected invoice.",
      submittedBy: "admin@acme.com", submittedByName: "James Mitchell", submittedByAvatar: "JM",
      category: "billing", status: "resolved", priority: "critical",
      createdLabel: "Feb 15, 2025", lastUpdateLabel: "Feb 20, 2025", orgId: acme.id,
    },
  })
  await prisma.ticketReply.createMany({ data: [
    { id: "r6", ticketId: tkt003.id, author: "Support Team", authorAvatar: "SA", role: "super_admin", body: "Thank you for flagging this, James. We have reviewed your account and confirmed the billing error. A corrected invoice for $4,800 has been issued and the overpayment of $1,000 will be applied as credit to your next cycle.", timestamp: "Feb 17, 2025 14:00" },
    { id: "r7", ticketId: tkt003.id, author: "James Mitchell", authorAvatar: "JM", role: "org_admin", body: "Confirmed, I can see the corrected invoice. Thank you for resolving this quickly.", timestamp: "Feb 20, 2025 09:30" },
  ]})

  await prisma.supportTicket.create({
    data: {
      id: "TKT-004", subject: "User invite email not received",
      description: "Invited david@acme.com three days ago. The user has not received any email. Checked spam folder.",
      submittedBy: "james@acme.com", submittedByName: "James Mitchell", submittedByAvatar: "JM",
      category: "access", status: "closed", priority: "low",
      createdLabel: "Jan 30, 2025", lastUpdateLabel: "Feb 1, 2025", orgId: acme.id,
      replies: { create: [
        { id: "r8", author: "Support Team", authorAvatar: "SA", role: "super_admin", body: "We found the invite was filtered by a strict email policy on the recipient domain. We have resent the invite from a whitelisted sender address. The user should receive it within a few minutes.", timestamp: "Jan 31, 2025 10:00" },
        { id: "r9", author: "James Mitchell", authorAvatar: "JM", role: "org_admin", body: "David confirmed he received the new invite. Thanks for the help.", timestamp: "Feb 1, 2025 08:45" },
      ]},
    },
  })

  await prisma.supportTicket.create({
    data: {
      id: "TKT-005", subject: "Request: bulk import developers from CSV",
      description: "It would be helpful to import a list of developers via CSV file rather than adding them one by one. We have 40+ developers to onboard.",
      submittedBy: "admin@acme.com", submittedByName: "James Mitchell", submittedByAvatar: "JM",
      category: "feature_request", status: "open", priority: "low",
      createdLabel: "Mar 1, 2025", lastUpdateLabel: "Mar 1, 2025", orgId: acme.id,
    },
  })

  const tkt006 = await prisma.supportTicket.create({
    data: {
      id: "TKT-006", subject: "GitHub OAuth token expired",
      description: "The GitHub integration shows 'token expired'. Disconnecting and reconnecting does not resolve the issue. Error: 'bad_verification_code'.",
      submittedBy: "nina@nexuslabs.io", submittedByName: "Nina Patel", submittedByAvatar: "NP",
      category: "integration", status: "open", priority: "high",
      createdLabel: "Mar 3, 2025", lastUpdateLabel: "Mar 4, 2025", orgId: nexus.id,
    },
  })
  await prisma.ticketReply.create({ data: { id: "r10", ticketId: tkt006.id, author: "Support Team", authorAvatar: "SA", role: "super_admin", body: "Hi Nina, we have revoked the existing token on our backend. Please try reconnecting GitHub now — you should be prompted for a fresh authorization.", timestamp: "Mar 4, 2025 09:00" } })

  const tkt007 = await prisma.supportTicket.create({
    data: {
      id: "TKT-007", subject: "Pod health score stuck at 0",
      description: "Forge Pod has shown a health score of 0 for the past week even though all sprints are on track and tickets are being completed normally.",
      submittedBy: "chris@nexuslabs.io", submittedByName: "Chris Wong", submittedByAvatar: "CW",
      category: "bug", status: "in_progress", priority: "high",
      createdLabel: "Feb 25, 2025", lastUpdateLabel: "Mar 2, 2025", orgId: nexus.id,
    },
  })
  await prisma.ticketReply.createMany({ data: [
    { id: "r11", ticketId: tkt007.id, author: "Support Team", authorAvatar: "SA", role: "super_admin", body: "Thanks for the report, Chris. We can see the issue in your account — the health calculation job is failing silently for Forge Pod due to a misconfigured sprint end date. We are resetting it now.", timestamp: "Feb 26, 2025 15:00" },
    { id: "r12", ticketId: tkt007.id, author: "Chris Wong", authorAvatar: "CW", role: "org_admin", body: "Still showing 0 this morning. Has the fix been applied yet?", timestamp: "Mar 2, 2025 08:30" },
    { id: "r13", ticketId: tkt007.id, author: "Support Team", authorAvatar: "SA", role: "super_admin", body: "Apologies for the delay. The fix requires a data migration on your pod record. We are running it now and it should reflect correctly within the hour.", timestamp: "Mar 2, 2025 09:10" },
  ]})

  const tkt008 = await prisma.supportTicket.create({
    data: {
      id: "TKT-008", subject: "Trial expiry date incorrect",
      description: "Our trial shows expiry of Feb 20 but we signed up on Jan 20, which should give us 30 days through Feb 19. We would like the accurate date reflected.",
      submittedBy: "liam@orbital.dev", submittedByName: "Liam Foster", submittedByAvatar: "LF",
      category: "billing", status: "resolved", priority: "medium",
      createdLabel: "Feb 10, 2025", lastUpdateLabel: "Feb 12, 2025", orgId: orbital.id,
    },
  })
  await prisma.ticketReply.createMany({ data: [
    { id: "r14", ticketId: tkt008.id, author: "Support Team", authorAvatar: "SA", role: "super_admin", body: "Hi Liam, we have reviewed the account creation timestamp. The discrepancy was caused by a timezone offset issue in our trial provisioning logic. Your trial has been corrected to expire Feb 19, 2025.", timestamp: "Feb 11, 2025 11:00" },
    { id: "r15", ticketId: tkt008.id, author: "Liam Foster", authorAvatar: "LF", role: "org_admin", body: "Perfect, the date now shows correctly. Thank you.", timestamp: "Feb 12, 2025 09:00" },
  ]})

  await prisma.supportTicket.create({
    data: {
      id: "TKT-009", subject: "Unable to access account after suspension",
      description: "Our account was suspended on Feb 15. We have since settled all outstanding invoices (reference #INV-2024-089 and #INV-2024-094). Please reactivate our account.",
      submittedBy: "tom@pinecrest.com", submittedByName: "Tom Hayes", submittedByAvatar: "TH",
      category: "access", status: "open", priority: "critical",
      createdLabel: "Mar 5, 2025", lastUpdateLabel: "Mar 5, 2025", orgId: pinecrest.id,
    },
  })

  // Audit Events
  console.log("  → Audit Events")

  await prisma.auditEvent.createMany({
    data: [
      { id: "ev-001", actor: "admin@acme.com", actorAvatar: "JM", action: "login", target: "Dashboard", ip: "192.168.1.10", timestamp: "Mar 5, 2025 09:14", orgId: acme.id },
      { id: "ev-002", actor: "admin@acme.com", actorAvatar: "JM", action: "invited", target: "david@acme.com", ip: "192.168.1.10", timestamp: "Mar 4, 2025 15:32", orgId: acme.id },
      { id: "ev-003", actor: "admin@acme.com", actorAvatar: "JM", action: "role changed", target: "Sarah Chen → Scrum Master", ip: "192.168.1.10", timestamp: "Mar 3, 2025 11:08", orgId: acme.id },
      { id: "ev-004", actor: "admin@acme.com", actorAvatar: "JM", action: "settings changed", target: "Organization Profile", ip: "192.168.1.10", timestamp: "Feb 28, 2025 14:20", orgId: acme.id },
      { id: "ev-005", actor: "superadmin@assembled.dev", actorAvatar: "SA", action: "updated", target: "Plan: Business → Enterprise", ip: "10.10.0.1", timestamp: "Feb 20, 2025 10:00", orgId: acme.id },
      { id: "ev-006", actor: "sarah@acme.com", actorAvatar: "SC", action: "created", target: "Sprint Board: Q1-2025", ip: "10.0.0.5", timestamp: "Jan 15, 2025 10:00", orgId: acme.id },
      { id: "ev-007", actor: "alex@acme.com", actorAvatar: "AR", action: "deleted", target: "Ticket MOM-42", ip: "10.0.0.7", timestamp: "Jan 10, 2025 16:45", orgId: acme.id },
      { id: "ev-008", actor: "admin@acme.com", actorAvatar: "JM", action: "integration connected", target: "GitHub", ip: "192.168.1.10", timestamp: "Jan 5, 2025 09:30", orgId: acme.id },
      { id: "ev-009", actor: "nina@nexuslabs.io", actorAvatar: "NP", action: "login", target: "Dashboard", ip: "10.0.1.5", timestamp: "Mar 5, 2025 08:45", orgId: nexus.id },
      { id: "ev-010", actor: "nina@nexuslabs.io", actorAvatar: "NP", action: "integration disconnected", target: "GitHub", ip: "10.0.1.5", timestamp: "Mar 3, 2025 14:10", orgId: nexus.id },
      { id: "ev-011", actor: "superadmin@assembled.dev", actorAvatar: "SA", action: "updated", target: "Seats: 8 → 10", ip: "10.10.0.1", timestamp: "Feb 15, 2025 11:00", orgId: nexus.id },
      { id: "ev-012", actor: "rachel@nexuslabs.io", actorAvatar: "RM", action: "created", target: "Team: Alpha Squad", ip: "10.0.1.6", timestamp: "Feb 1, 2025 13:00", orgId: nexus.id },
      { id: "ev-013", actor: "liam@orbital.dev", actorAvatar: "LF", action: "login", target: "Dashboard", ip: "172.16.0.2", timestamp: "Mar 5, 2025 10:00", orgId: orbital.id },
      { id: "ev-014", actor: "liam@orbital.dev", actorAvatar: "LF", action: "invited", target: "priya@orbital.dev", ip: "172.16.0.2", timestamp: "Feb 18, 2025 15:00", orgId: orbital.id },
      { id: "ev-015", actor: "superadmin@assembled.dev", actorAvatar: "SA", action: "created", target: "Organization: Orbital Systems", ip: "10.10.0.1", timestamp: "Jan 20, 2025 09:00", orgId: orbital.id },
      { id: "ev-016", actor: "superadmin@assembled.dev", actorAvatar: "SA", action: "suspended", target: "Pinecrest Digital", ip: "10.10.0.1", timestamp: "Feb 15, 2025 08:55", orgId: pinecrest.id },
      { id: "ev-017", actor: "tom@pinecrest.com", actorAvatar: "TH", action: "login", target: "Dashboard", ip: "203.0.113.5", timestamp: "Feb 14, 2025 17:30", orgId: pinecrest.id },
      { id: "ev-018", actor: "tom@pinecrest.com", actorAvatar: "TH", action: "settings changed", target: "Billing Details", ip: "203.0.113.5", timestamp: "Feb 10, 2025 11:20", orgId: pinecrest.id },
    ],
  })

  // ─────────────────────────────────────────────────────────
  // SF-14: Pulse Reports
  // ─────────────────────────────────────────────────────────
  console.log("  → Pulse Reports")

  await prisma.pulseReport.createMany({
    data: [
      {
        id: "pulse-3",
        sprintId: sprintMomentum.id,
        week: "Week of Feb 10",
        date: "Feb 14, 2025",
        author: "Sarah Chen",
        role: "Scrum Master",
        summary: "Strong sprint momentum this week. The API refactoring work is progressing well with the rate limiting setup scheduled for completion by end of week. The onboarding wizard v2 is unblocked following design sign-off and Jake Lee has picked it up. The webhook integration layer is the main focus for Sarah and is tracking to schedule. Overall sprint health is positive with 54% completion at mid-sprint.",
        highlights: [
          "Validation checks feature passed internal QA — staged for deployment",
          "Dashboard analytics API merged and ready for client review",
          "Performance benchmarks show 23% improvement on core data queries",
          "New blockers this week: none",
        ],
        board: {
          todo: [
            { id: "MOM-111", title: "API rate limiting setup", assignee: "Alex Kim" },
            { id: "MOM-112", title: "Onboarding wizard v2", assignee: "Jake Lee" },
            { id: "MOM-113", title: "Webhook retry logic", assignee: "Sarah Chen" },
            { id: "MOM-108", title: "Search indexing optimization", assignee: "Alex Kim" },
          ],
          inProgress: [
            { id: "MOM-109", title: "Webhook integration layer", assignee: "Sarah Chen" },
            { id: "MOM-110", title: "Billing page UI refresh", assignee: "Jake Lee" },
          ],
          done: [
            { id: "MOM-101", title: "User auth flow redesign", assignee: "Sarah Chen" },
            { id: "MOM-102", title: "Dashboard analytics API", assignee: "Alex Kim" },
            { id: "MOM-103", title: "Notification service setup", assignee: "Sarah Chen" },
            { id: "MOM-104", title: "Profile settings page", assignee: "Jake Lee" },
            { id: "MOM-105", title: "Data export CSV feature", assignee: "Alex Kim" },
          ],
        },
      },
      {
        id: "pulse-2",
        sprintId: sprintMomentum.id,
        week: "Week of Feb 3",
        date: "Feb 7, 2025",
        author: "Marcus Reid",
        role: "Org Admin",
        summary: "Sprint 13 delivered the core authentication re-architecture and SSO integration on schedule. The team completed migration of 12,000 user accounts with zero downtime — a significant milestone. Dashboard load times improved by 35% following query optimisation work. One carryover item (bulk export) has been moved to Sprint 14 with a revised scope.",
        highlights: [
          "Zero-downtime migration of 12k user accounts completed",
          "SSO integration live — tested with 3 enterprise clients",
          "Dashboard load time reduced from 4.2s to 2.7s",
          "Bulk export carried over to Sprint 14 with revised scope",
        ],
        board: {
          todo: [
            { id: "MOM-095", title: "SSO callback handler", assignee: "Alex Kim" },
            { id: "MOM-096", title: "Session persistence layer", assignee: "Jake Lee" },
          ],
          inProgress: [{ id: "MOM-093", title: "Bulk export CSV", assignee: "Sarah Chen" }],
          done: [
            { id: "MOM-088", title: "Auth re-architecture", assignee: "Alex Kim" },
            { id: "MOM-089", title: "SSO integration", assignee: "Sarah Chen" },
            { id: "MOM-090", title: "User migration script", assignee: "Jake Lee" },
            { id: "MOM-091", title: "Query optimization pass", assignee: "Alex Kim" },
            { id: "MOM-092", title: "Dashboard load perf", assignee: "Sarah Chen" },
            { id: "MOM-094", title: "Token refresh flow", assignee: "Jake Lee" },
          ],
        },
      },
      {
        id: "pulse-1",
        sprintId: sprintMomentum.id,
        week: "Week of Jan 27",
        date: "Jan 31, 2025",
        author: "Sarah Chen",
        role: "Scrum Master",
        summary: "Completed the data pipeline overhaul and new reporting engine on schedule. Two critical bugs in the notification service were resolved ahead of the sprint close. The team welcomed a new developer who has been ramping on the analytics module and is now fully onboarded.",
        highlights: [
          "Data pipeline overhaul completed — ETL jobs now running 40% faster",
          "Two critical notification service bugs resolved",
          "New developer fully onboarded to analytics module",
          "Reporting engine v2 ready for client UAT",
        ],
        board: {
          todo: [{ id: "MOM-082", title: "Analytics module kickoff", assignee: "Jake Lee" }],
          inProgress: [
            { id: "MOM-080", title: "Reporting engine v2", assignee: "Alex Kim" },
            { id: "MOM-081", title: "Notification bug fix", assignee: "Sarah Chen" },
          ],
          done: [
            { id: "MOM-075", title: "Data pipeline overhaul", assignee: "Alex Kim" },
            { id: "MOM-076", title: "ETL job scheduler", assignee: "Sarah Chen" },
            { id: "MOM-077", title: "Pipeline monitoring", assignee: "Jake Lee" },
            { id: "MOM-078", title: "Notification bug #1", assignee: "Sarah Chen" },
            { id: "MOM-079", title: "New dev onboarding docs", assignee: "Alex Kim" },
          ],
        },
      },
    ],
  })

  // ─────────────────────────────────────────────────────────
  // SF-14: Teams
  // ─────────────────────────────────────────────────────────
  console.log("  → Teams")

  const teamAlpha = await prisma.team.create({
    data: { id: "team-alpha", slug: "alpha-team", name: "Alpha Team", description: "Handles platform, e-commerce, and mapping projects.", orgId: acme.id },
  })

  const teamBeta = await prisma.team.create({
    data: { id: "team-beta", slug: "beta-team", name: "Beta Team", description: "Owns streaming, ML inference, and infrastructure projects.", orgId: nexus.id },
  })

  await prisma.teamDeveloper.createMany({
    data: [
      { teamId: teamAlpha.id, developerId: devAlex.id },
      { teamId: teamAlpha.id, developerId: devSarah.id },
      { teamId: teamAlpha.id, developerId: devMarcus.id },
      { teamId: teamBeta.id, developerId: devMarcus.id },
    ],
  })

  await prisma.teamPod.createMany({
    data: [
      { teamId: teamAlpha.id, podId: podMomentum.id },
      { teamId: teamAlpha.id, podId: podVelocity.id },
      { teamId: teamAlpha.id, podId: podAtlas.id },
      { teamId: teamBeta.id, podId: podHorizon.id },
      { teamId: teamBeta.id, podId: podApex.id },
      { teamId: teamBeta.id, podId: podForge.id },
    ],
  })

  console.log("✅ Seed complete!")
  console.log("")
  console.log("  Test accounts (password: password123):")
  console.log("  - superadmin@assembled.dev  (super_admin)")
  console.log("  - james@acme.com            (org_admin — Acme Corp)")
  console.log("  - nina@nexuslabs.io         (org_admin — Nexus Labs)")
  console.log("  - sarah@acme.com            (developer — Acme Corp)")
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
