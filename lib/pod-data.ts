export type HealthStatus = "healthy" | "watch" | "at-risk"

export interface VelocityEntry {
  sprint: string
  sp: number
}

export type TicketStatus = "done" | "in-progress" | "remaining"

export interface SprintTicket {
  id: string
  title: string
  assignee: string
  sp: number
  status: TicketStatus
}

export interface PodData {
  slug: string
  name: string
  client: string
  healthScore: number
  healthStatus: HealthStatus
  sprint: string
  sprintStartDate: string
  sprintEndDate: string
  sprintDay: number
  totalDays: number
  completion: number
  expectedCompletion: number
  blockers: number
  carryoverRisk: number
  velocityHistory: VelocityEntry[]
  velocityDirection: "up" | "down" | "stable"
  committedSP: number
  committedTasks: number
  inProgressSP: number
  inProgressTasks: number
  remainingSP: number
  remainingTasks: number
  doneSP: number
  doneTasks: number
  remainingCapacitySP: number
  storiesRemaining: number
  qaQueueCount: number
  sprintTickets: SprintTicket[]
  carryoverHistory: { sprint: string; pct: number }[]
}

/** Derive a flat number[] from velocityHistory for sparklines */
export function getVelocityTrend(pod: PodData): number[] {
  return pod.velocityHistory.map((v) => v.sp)
}

/** Compute rolling average velocity across all sprints */
export function getAverageVelocity(pod: PodData): number {
  const entries = pod.velocityHistory
  if (entries.length === 0) return 0
  return Math.round(entries.reduce((sum, v) => sum + v.sp, 0) / entries.length)
}

/** Current sprint velocity (last entry) */
export function getCurrentVelocity(pod: PodData): number {
  return pod.velocityHistory[pod.velocityHistory.length - 1]?.sp ?? 0
}

/** Rolling average carryover % across all historical sprints */
export function getRollingAvgCarryover(pod: PodData): number {
  const hist = pod.carryoverHistory
  if (hist.length === 0) return 0
  return Math.round(hist.reduce((sum, h) => sum + h.pct, 0) / hist.length)
}

/** Carryover history enriched with a running rolling average column */
export function getCarryoverWithRolling(pod: PodData): { sprint: string; pct: number; avg: number }[] {
  return pod.carryoverHistory.map((entry, i) => {
    const slice = pod.carryoverHistory.slice(0, i + 1)
    const avg = Math.round(slice.reduce((s, h) => s + h.pct, 0) / slice.length)
    return { ...entry, avg }
  })
}

export const pods: PodData[] = [
  {
    slug: "momentum-pod",
    name: "Momentum Pod",
    client: "Client A",
    healthScore: 92,
    healthStatus: "healthy",
    sprint: "Sprint 14",
    sprintStartDate: "2025-02-10",
    sprintEndDate: "2025-02-21",
    sprintDay: 6,
    totalDays: 10,
    completion: 72,
    expectedCompletion: 60,
    blockers: 0,
    carryoverRisk: 8,
    velocityHistory: [
      { sprint: "Sprint 9", sp: 28 },
      { sprint: "Sprint 10", sp: 32 },
      { sprint: "Sprint 11", sp: 30 },
      { sprint: "Sprint 12", sp: 35 },
      { sprint: "Sprint 13", sp: 33 },
      { sprint: "Sprint 14", sp: 38 },
    ],
    velocityDirection: "up",
    committedSP: 38,
    committedTasks: 12,
    inProgressSP: 11,
    inProgressTasks: 3,
    remainingSP: 6,
    remainingTasks: 2,
    doneSP: 21,
    doneTasks: 7,
    remainingCapacitySP: 18,
    storiesRemaining: 5,
    qaQueueCount: 2,
    sprintTickets: [
      { id: "MOM-101", title: "User auth flow redesign", assignee: "Sarah Chen", sp: 5, status: "done" },
      { id: "MOM-102", title: "Dashboard analytics API", assignee: "Alex Kim", sp: 3, status: "done" },
      { id: "MOM-103", title: "Notification service setup", assignee: "Sarah Chen", sp: 3, status: "done" },
      { id: "MOM-104", title: "Profile settings page", assignee: "Jake Lee", sp: 2, status: "done" },
      { id: "MOM-105", title: "Data export CSV feature", assignee: "Alex Kim", sp: 3, status: "done" },
      { id: "MOM-106", title: "Role-based access control", assignee: "Sarah Chen", sp: 3, status: "done" },
      { id: "MOM-107", title: "Email template builder", assignee: "Jake Lee", sp: 2, status: "done" },
      { id: "MOM-108", title: "Search indexing optimization", assignee: "Alex Kim", sp: 5, status: "in-progress" },
      { id: "MOM-109", title: "Webhook integration layer", assignee: "Sarah Chen", sp: 3, status: "in-progress" },
      { id: "MOM-110", title: "Billing page UI refresh", assignee: "Jake Lee", sp: 3, status: "in-progress" },
      { id: "MOM-111", title: "API rate limiting setup", assignee: "Alex Kim", sp: 3, status: "remaining" },
      { id: "MOM-112", title: "Onboarding wizard v2", assignee: "Jake Lee", sp: 3, status: "remaining" },
    ],
    carryoverHistory: [
      { sprint: "S9",  pct: 18 },
      { sprint: "S10", pct: 14 },
      { sprint: "S11", pct: 10 },
      { sprint: "S12", pct: 12 },
      { sprint: "S13", pct: 9 },
      { sprint: "S14", pct: 8 },
    ],
  },
  {
    slug: "velocity-pod",
    name: "Velocity Pod",
    client: "Client B",
    healthScore: 74,
    healthStatus: "watch",
    sprint: "Sprint 14",
    sprintStartDate: "2025-02-10",
    sprintEndDate: "2025-02-21",
    sprintDay: 6,
    totalDays: 10,
    completion: 55,
    expectedCompletion: 60,
    blockers: 2,
    carryoverRisk: 22,
    velocityHistory: [
      { sprint: "Sprint 9", sp: 35 },
      { sprint: "Sprint 10", sp: 32 },
      { sprint: "Sprint 11", sp: 28 },
      { sprint: "Sprint 12", sp: 25 },
      { sprint: "Sprint 13", sp: 27 },
      { sprint: "Sprint 14", sp: 24 },
    ],
    velocityDirection: "down",
    committedSP: 34,
    committedTasks: 14,
    inProgressSP: 8,
    inProgressTasks: 3,
    remainingSP: 10,
    remainingTasks: 5,
    doneSP: 16,
    doneTasks: 6,
    remainingCapacitySP: 13,
    storiesRemaining: 9,
    qaQueueCount: 5,
    sprintTickets: [
      { id: "VEL-201", title: "Checkout flow migration", assignee: "Priya Patel", sp: 3, status: "done" },
      { id: "VEL-202", title: "Inventory sync engine", assignee: "Tom Garcia", sp: 3, status: "done" },
      { id: "VEL-203", title: "Product catalog cache", assignee: "Priya Patel", sp: 2, status: "done" },
      { id: "VEL-204", title: "Order tracking page", assignee: "Nina Shah", sp: 3, status: "done" },
      { id: "VEL-205", title: "Payment retry logic", assignee: "Tom Garcia", sp: 2, status: "done" },
      { id: "VEL-206", title: "Shipping label generator", assignee: "Nina Shah", sp: 3, status: "done" },
      { id: "VEL-207", title: "Cart persistence layer", assignee: "Priya Patel", sp: 3, status: "in-progress" },
      { id: "VEL-208", title: "Discount engine rules", assignee: "Tom Garcia", sp: 3, status: "in-progress" },
      { id: "VEL-209", title: "Returns portal UI", assignee: "Nina Shah", sp: 2, status: "in-progress" },
      { id: "VEL-210", title: "Supplier API integration", assignee: "Priya Patel", sp: 2, status: "remaining" },
      { id: "VEL-211", title: "Warehouse routing logic", assignee: "Tom Garcia", sp: 3, status: "remaining" },
      { id: "VEL-212", title: "Review moderation system", assignee: "Nina Shah", sp: 2, status: "remaining" },
      { id: "VEL-213", title: "Bulk order upload tool", assignee: "Priya Patel", sp: 1, status: "remaining" },
      { id: "VEL-214", title: "Tax calculation service", assignee: "Tom Garcia", sp: 2, status: "remaining" },
    ],
    carryoverHistory: [
      { sprint: "S9",  pct: 12 },
      { sprint: "S10", pct: 18 },
      { sprint: "S11", pct: 24 },
      { sprint: "S12", pct: 20 },
      { sprint: "S13", pct: 22 },
      { sprint: "S14", pct: 22 },
    ],
  },
  {
    slug: "atlas-pod",
    name: "Atlas Pod",
    client: "Client C",
    healthScore: 88,
    healthStatus: "healthy",
    sprint: "Sprint 14",
    sprintStartDate: "2025-02-10",
    sprintEndDate: "2025-02-21",
    sprintDay: 6,
    totalDays: 10,
    completion: 68,
    expectedCompletion: 60,
    blockers: 1,
    carryoverRisk: 12,
    velocityHistory: [
      { sprint: "Sprint 9", sp: 20 },
      { sprint: "Sprint 10", sp: 24 },
      { sprint: "Sprint 11", sp: 22 },
      { sprint: "Sprint 12", sp: 26 },
      { sprint: "Sprint 13", sp: 28 },
      { sprint: "Sprint 14", sp: 30 },
    ],
    velocityDirection: "up",
    committedSP: 30,
    committedTasks: 10,
    inProgressSP: 7,
    inProgressTasks: 2,
    remainingSP: 5,
    remainingTasks: 2,
    doneSP: 18,
    doneTasks: 6,
    remainingCapacitySP: 16,
    storiesRemaining: 6,
    qaQueueCount: 3,
    sprintTickets: [
      { id: "ATL-301", title: "Map rendering engine v2", assignee: "Liam Brooks", sp: 5, status: "done" },
      { id: "ATL-302", title: "Geolocation search API", assignee: "Eva Martinez", sp: 3, status: "done" },
      { id: "ATL-303", title: "Route optimization algo", assignee: "Liam Brooks", sp: 3, status: "done" },
      { id: "ATL-304", title: "Location bookmarks sync", assignee: "Ryan Torres", sp: 2, status: "done" },
      { id: "ATL-305", title: "Offline map caching", assignee: "Eva Martinez", sp: 3, status: "done" },
      { id: "ATL-306", title: "POI data enrichment", assignee: "Ryan Torres", sp: 2, status: "done" },
      { id: "ATL-307", title: "Traffic layer overlay", assignee: "Liam Brooks", sp: 5, status: "in-progress" },
      { id: "ATL-308", title: "ETA prediction model", assignee: "Eva Martinez", sp: 2, status: "in-progress" },
      { id: "ATL-309", title: "Address autocomplete v3", assignee: "Ryan Torres", sp: 3, status: "remaining" },
      { id: "ATL-310", title: "Map annotation tools", assignee: "Liam Brooks", sp: 2, status: "remaining" },
    ],
    carryoverHistory: [
      { sprint: "S9",  pct: 20 },
      { sprint: "S10", pct: 16 },
      { sprint: "S11", pct: 18 },
      { sprint: "S12", pct: 14 },
      { sprint: "S13", pct: 11 },
      { sprint: "S14", pct: 12 },
    ],
  },
  {
    slug: "horizon-pod",
    name: "Horizon Pod",
    client: "Client D",
    healthScore: 61,
    healthStatus: "at-risk",
    sprint: "Sprint 14",
    sprintStartDate: "2025-02-10",
    sprintEndDate: "2025-02-21",
    sprintDay: 6,
    totalDays: 10,
    completion: 38,
    expectedCompletion: 60,
    blockers: 3,
    carryoverRisk: 35,
    velocityHistory: [
      { sprint: "Sprint 9", sp: 30 },
      { sprint: "Sprint 10", sp: 28 },
      { sprint: "Sprint 11", sp: 22 },
      { sprint: "Sprint 12", sp: 18 },
      { sprint: "Sprint 13", sp: 20 },
      { sprint: "Sprint 14", sp: 16 },
    ],
    velocityDirection: "down",
    committedSP: 28,
    committedTasks: 15,
    inProgressSP: 6,
    inProgressTasks: 3,
    remainingSP: 14,
    remainingTasks: 8,
    doneSP: 8,
    doneTasks: 4,
    remainingCapacitySP: 8,
    storiesRemaining: 12,
    qaQueueCount: 7,
    sprintTickets: [
      { id: "HOR-401", title: "Event streaming setup", assignee: "Maya Johnson", sp: 2, status: "done" },
      { id: "HOR-402", title: "Message queue consumer", assignee: "Derek Wong", sp: 3, status: "done" },
      { id: "HOR-403", title: "Schema registry config", assignee: "Lia Fernandez", sp: 1, status: "done" },
      { id: "HOR-404", title: "Dead letter queue handler", assignee: "Maya Johnson", sp: 2, status: "done" },
      { id: "HOR-405", title: "Stream partitioning logic", assignee: "Derek Wong", sp: 2, status: "in-progress" },
      { id: "HOR-406", title: "Consumer group rebalance", assignee: "Lia Fernandez", sp: 2, status: "in-progress" },
      { id: "HOR-407", title: "Replay mechanism v2", assignee: "Maya Johnson", sp: 2, status: "in-progress" },
      { id: "HOR-408", title: "Batch processing pipeline", assignee: "Derek Wong", sp: 3, status: "remaining" },
      { id: "HOR-409", title: "Monitoring dashboard", assignee: "Lia Fernandez", sp: 2, status: "remaining" },
      { id: "HOR-410", title: "Alert routing rules", assignee: "Maya Johnson", sp: 1, status: "remaining" },
      { id: "HOR-411", title: "Throughput benchmarks", assignee: "Derek Wong", sp: 2, status: "remaining" },
      { id: "HOR-412", title: "Data retention policies", assignee: "Lia Fernandez", sp: 2, status: "remaining" },
      { id: "HOR-413", title: "Cross-region replication", assignee: "Maya Johnson", sp: 2, status: "remaining" },
      { id: "HOR-414", title: "Backpressure handling", assignee: "Derek Wong", sp: 1, status: "remaining" },
      { id: "HOR-415", title: "Idempotency key service", assignee: "Lia Fernandez", sp: 2, status: "remaining" },
    ],
    carryoverHistory: [
      { sprint: "S9",  pct: 15 },
      { sprint: "S10", pct: 22 },
      { sprint: "S11", pct: 30 },
      { sprint: "S12", pct: 38 },
      { sprint: "S13", pct: 32 },
      { sprint: "S14", pct: 35 },
    ],
  },
  {
    slug: "apex-pod",
    name: "Apex Pod",
    client: "Client E",
    healthScore: 95,
    healthStatus: "healthy",
    sprint: "Sprint 14",
    sprintStartDate: "2025-02-10",
    sprintEndDate: "2025-02-21",
    sprintDay: 6,
    totalDays: 10,
    completion: 80,
    expectedCompletion: 60,
    blockers: 0,
    carryoverRisk: 5,
    velocityHistory: [
      { sprint: "Sprint 9", sp: 25 },
      { sprint: "Sprint 10", sp: 28 },
      { sprint: "Sprint 11", sp: 32 },
      { sprint: "Sprint 12", sp: 30 },
      { sprint: "Sprint 13", sp: 34 },
      { sprint: "Sprint 14", sp: 36 },
    ],
    velocityDirection: "up",
    committedSP: 36,
    committedTasks: 11,
    inProgressSP: 5,
    inProgressTasks: 2,
    remainingSP: 3,
    remainingTasks: 1,
    doneSP: 28,
    doneTasks: 8,
    remainingCapacitySP: 21,
    storiesRemaining: 3,
    qaQueueCount: 1,
    sprintTickets: [
      { id: "APX-501", title: "ML model serving layer", assignee: "Chris Nakamura", sp: 5, status: "done" },
      { id: "APX-502", title: "Feature store pipeline", assignee: "Anna Kowalski", sp: 3, status: "done" },
      { id: "APX-503", title: "Training data ETL", assignee: "Chris Nakamura", sp: 3, status: "done" },
      { id: "APX-504", title: "A/B experiment framework", assignee: "Raj Mehta", sp: 5, status: "done" },
      { id: "APX-505", title: "Model versioning system", assignee: "Anna Kowalski", sp: 3, status: "done" },
      { id: "APX-506", title: "Inference caching layer", assignee: "Chris Nakamura", sp: 3, status: "done" },
      { id: "APX-507", title: "Metrics collection SDK", assignee: "Raj Mehta", sp: 3, status: "done" },
      { id: "APX-508", title: "Real-time predictions API", assignee: "Anna Kowalski", sp: 3, status: "done" },
      { id: "APX-509", title: "Drift detection alerts", assignee: "Chris Nakamura", sp: 3, status: "in-progress" },
      { id: "APX-510", title: "Model rollback mechanism", assignee: "Raj Mehta", sp: 2, status: "in-progress" },
      { id: "APX-511", title: "Shadow mode testing", assignee: "Anna Kowalski", sp: 3, status: "remaining" },
    ],
    carryoverHistory: [
      { sprint: "S9",  pct: 10 },
      { sprint: "S10", pct: 8 },
      { sprint: "S11", pct: 6 },
      { sprint: "S12", pct: 7 },
      { sprint: "S13", pct: 5 },
      { sprint: "S14", pct: 5 },
    ],
  },
  {
    slug: "forge-pod",
    name: "Forge Pod",
    client: "Client F",
    healthScore: 78,
    healthStatus: "watch",
    sprint: "Sprint 14",
    sprintStartDate: "2025-02-10",
    sprintEndDate: "2025-02-21",
    sprintDay: 6,
    totalDays: 10,
    completion: 58,
    expectedCompletion: 60,
    blockers: 1,
    carryoverRisk: 20,
    velocityHistory: [
      { sprint: "Sprint 9", sp: 30 },
      { sprint: "Sprint 10", sp: 30 },
      { sprint: "Sprint 11", sp: 28 },
      { sprint: "Sprint 12", sp: 32 },
      { sprint: "Sprint 13", sp: 29 },
      { sprint: "Sprint 14", sp: 30 },
    ],
    velocityDirection: "stable",
    committedSP: 30,
    committedTasks: 13,
    inProgressSP: 9,
    inProgressTasks: 4,
    remainingSP: 7,
    remainingTasks: 3,
    doneSP: 14,
    doneTasks: 6,
    remainingCapacitySP: 12,
    storiesRemaining: 8,
    qaQueueCount: 4,
    sprintTickets: [
      { id: "FRG-601", title: "CI/CD pipeline refactor", assignee: "Omar Hussein", sp: 3, status: "done" },
      { id: "FRG-602", title: "Container orchestration", assignee: "Sam Rivera", sp: 2, status: "done" },
      { id: "FRG-603", title: "Secrets management vault", assignee: "Tina Park", sp: 3, status: "done" },
      { id: "FRG-604", title: "Log aggregation service", assignee: "Omar Hussein", sp: 2, status: "done" },
      { id: "FRG-605", title: "Auto-scaling policies", assignee: "Sam Rivera", sp: 2, status: "done" },
      { id: "FRG-606", title: "Blue-green deploy setup", assignee: "Tina Park", sp: 2, status: "done" },
      { id: "FRG-607", title: "Infra cost monitoring", assignee: "Omar Hussein", sp: 3, status: "in-progress" },
      { id: "FRG-608", title: "Service mesh config", assignee: "Sam Rivera", sp: 2, status: "in-progress" },
      { id: "FRG-609", title: "Canary release tooling", assignee: "Tina Park", sp: 2, status: "in-progress" },
      { id: "FRG-610", title: "Dependency vulnerability scan", assignee: "Omar Hussein", sp: 2, status: "in-progress" },
      { id: "FRG-611", title: "Chaos testing framework", assignee: "Sam Rivera", sp: 3, status: "remaining" },
      { id: "FRG-612", title: "Backup rotation policy", assignee: "Tina Park", sp: 2, status: "remaining" },
      { id: "FRG-613", title: "Network policy hardening", assignee: "Omar Hussein", sp: 2, status: "remaining" },
    ],
    carryoverHistory: [
      { sprint: "S9",  pct: 22 },
      { sprint: "S10", pct: 18 },
      { sprint: "S11", pct: 24 },
      { sprint: "S12", pct: 16 },
      { sprint: "S13", pct: 21 },
      { sprint: "S14", pct: 20 },
    ],
  },
]

export function getPodBySlug(slug: string): PodData | undefined {
  return pods.find((p) => p.slug === slug)
}


