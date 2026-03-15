export interface DeveloperAllocation {
  podName: string
  client: string
  percentage: number
}

export interface ActiveTicket {
  ticketId: string
  project: string
  storyType: "feature" | "bug" | "chore" | "spike"
  status: "in-progress" | "in-review" | "qa" | "blocked"
  daysInProgress: number
  blocked: boolean
  prLinked: boolean
  riskLevel: "low" | "medium" | "high"
}

export interface PRActivity {
  prId: string
  title: string
  status: "open" | "merged" | "waiting-review"
  createdAt: string
  hoursSinceUpdate: number
}

export interface CycleTimeSprint {
  sprint: string
  devTime: number
  teamAvg: number
}

export interface DeveloperData {
  slug: string
  name: string
  role: string
  avatar: string
  currentSprint: string
  totalAllocation: number
  allocations: DeveloperAllocation[]
  activeTickets: number
  wipLimit: number
  wipStatus: "healthy" | "over-limit"
  prsOpen: number
  prsWaitingReview: number
  avgPrReviewTime: number
  blockersOwned: number
  longestBlockedDuration: string
  longestBlockedHours: number
  contextSwitchIndex: number
  activeProjectsCount: number
  cycleTimeHistory: CycleTimeSprint[]
  throughputThisSprint: number
  throughput3SprintAvg: number
  ticketAging: { range: string; count: number; color: string }[]
  tickets: ActiveTicket[]
  prs: PRActivity[]
  prsOpenedThisSprint: number
  prsMerged: number
  avgTimeToMerge: number
  reviewsDone: number
  riskSignals: string[]
}

export const developers: DeveloperData[] = [
  {
    slug: "alex-rivera",
    name: "Alex Rivera",
    role: "Backend Developer",
    avatar: "AR",
    currentSprint: "Sprint 14",
    totalAllocation: 95,
    allocations: [
      { podName: "Momentum Pod", client: "Client A", percentage: 50 },
      { podName: "Atlas Pod", client: "Client C", percentage: 30 },
      { podName: "Forge Pod", client: "Client F", percentage: 15 },
    ],
    activeTickets: 5,
    wipLimit: 3,
    wipStatus: "over-limit",
    prsOpen: 3,
    prsWaitingReview: 2,
    avgPrReviewTime: 42,
    blockersOwned: 2,
    longestBlockedDuration: "36h",
    longestBlockedHours: 36,
    contextSwitchIndex: 3.2,
    activeProjectsCount: 3,
    cycleTimeHistory: [
      { sprint: "Sprint 11", devTime: 2.1, teamAvg: 2.4 },
      { sprint: "Sprint 12", devTime: 2.3, teamAvg: 2.2 },
      { sprint: "Sprint 13", devTime: 2.8, teamAvg: 2.5 },
      { sprint: "Sprint 14", devTime: 3.6, teamAvg: 2.6 },
    ],
    throughputThisSprint: 11,
    throughput3SprintAvg: 21,
    ticketAging: [
      { range: "0-2 days", count: 2, color: "#34d399" },
      { range: "3-5 days", count: 1, color: "#f59e0b" },
      { range: "6+ days", count: 2, color: "#ef4444" },
    ],
    tickets: [
      { ticketId: "MOM-142", project: "Momentum Pod", storyType: "feature", status: "in-progress", daysInProgress: 7, blocked: false, prLinked: true, riskLevel: "high" },
      { ticketId: "MOM-156", project: "Momentum Pod", storyType: "bug", status: "blocked", daysInProgress: 4, blocked: true, prLinked: false, riskLevel: "high" },
      { ticketId: "ATL-089", project: "Atlas Pod", storyType: "feature", status: "in-review", daysInProgress: 3, blocked: false, prLinked: true, riskLevel: "medium" },
      { ticketId: "ATL-092", project: "Atlas Pod", storyType: "chore", status: "in-progress", daysInProgress: 1, blocked: false, prLinked: false, riskLevel: "low" },
      { ticketId: "FRG-034", project: "Forge Pod", storyType: "spike", status: "in-progress", daysInProgress: 6, blocked: true, prLinked: false, riskLevel: "high" },
    ],
    prs: [
      { prId: "PR-412", title: "feat: add payment webhook handler", status: "waiting-review", createdAt: "2d ago", hoursSinceUpdate: 42 },
      { prId: "PR-408", title: "fix: resolve race condition in queue", status: "waiting-review", createdAt: "3d ago", hoursSinceUpdate: 56 },
      { prId: "PR-401", title: "chore: database migration v14", status: "merged", createdAt: "4d ago", hoursSinceUpdate: 0 },
      { prId: "PR-415", title: "feat: API rate limiter middleware", status: "open", createdAt: "1d ago", hoursSinceUpdate: 18 },
    ],
    prsOpenedThisSprint: 6,
    prsMerged: 3,
    avgTimeToMerge: 28,
    reviewsDone: 4,
    riskSignals: [
      "2 tickets aging beyond 6 days -- possible scope underestimation.",
      "PR review latency 42h exceeds 24h threshold.",
      "High context switching across 3 projects (index: 3.2).",
      "WIP count (5) exceeds limit (3) -- delivery predictability at risk.",
      "Blocked ticket FRG-034 has no linked PR after 6 days in progress.",
    ],
  },
  {
    slug: "sarah-chen",
    name: "Sarah Chen",
    role: "Full Stack Developer",
    avatar: "SC",
    currentSprint: "Sprint 14",
    totalAllocation: 80,
    allocations: [
      { podName: "Momentum Pod", client: "Client A", percentage: 60 },
      { podName: "Velocity Pod", client: "Client B", percentage: 20 },
    ],
    activeTickets: 3,
    wipLimit: 3,
    wipStatus: "healthy",
    prsOpen: 2,
    prsWaitingReview: 1,
    avgPrReviewTime: 18,
    blockersOwned: 1,
    longestBlockedDuration: "12h",
    longestBlockedHours: 12,
    contextSwitchIndex: 1.8,
    activeProjectsCount: 2,
    cycleTimeHistory: [
      { sprint: "Sprint 11", devTime: 1.8, teamAvg: 2.4 },
      { sprint: "Sprint 12", devTime: 1.6, teamAvg: 2.2 },
      { sprint: "Sprint 13", devTime: 2.0, teamAvg: 2.5 },
      { sprint: "Sprint 14", devTime: 2.1, teamAvg: 2.6 },
    ],
    throughputThisSprint: 18,
    throughput3SprintAvg: 18,
    ticketAging: [
      { range: "0-2 days", count: 2, color: "#34d399" },
      { range: "3-5 days", count: 1, color: "#f59e0b" },
      { range: "6+ days", count: 0, color: "#ef4444" },
    ],
    tickets: [
      { ticketId: "MOM-148", project: "Momentum Pod", storyType: "feature", status: "in-progress", daysInProgress: 2, blocked: false, prLinked: true, riskLevel: "low" },
      { ticketId: "MOM-151", project: "Momentum Pod", storyType: "bug", status: "in-review", daysInProgress: 1, blocked: false, prLinked: true, riskLevel: "low" },
      { ticketId: "VEL-078", project: "Velocity Pod", storyType: "feature", status: "blocked", daysInProgress: 4, blocked: true, prLinked: false, riskLevel: "medium" },
    ],
    prs: [
      { prId: "PR-410", title: "feat: user settings redesign", status: "waiting-review", createdAt: "1d ago", hoursSinceUpdate: 22 },
      { prId: "PR-406", title: "fix: auth token refresh logic", status: "merged", createdAt: "3d ago", hoursSinceUpdate: 0 },
    ],
    prsOpenedThisSprint: 5,
    prsMerged: 4,
    avgTimeToMerge: 14,
    reviewsDone: 7,
    riskSignals: [
      "1 blocked ticket on Velocity Pod pending client response.",
    ],
  },
  {
    slug: "marcus-johnson",
    name: "Marcus Johnson",
    role: "Frontend Developer",
    avatar: "MJ",
    currentSprint: "Sprint 14",
    totalAllocation: 110,
    allocations: [
      { podName: "Velocity Pod", client: "Client B", percentage: 40 },
      { podName: "Horizon Pod", client: "Client D", percentage: 40 },
      { podName: "Apex Pod", client: "Client E", percentage: 30 },
    ],
    activeTickets: 6,
    wipLimit: 3,
    wipStatus: "over-limit",
    prsOpen: 4,
    prsWaitingReview: 3,
    avgPrReviewTime: 52,
    blockersOwned: 2,
    longestBlockedDuration: "48h",
    longestBlockedHours: 48,
    contextSwitchIndex: 4.1,
    activeProjectsCount: 3,
    cycleTimeHistory: [
      { sprint: "Sprint 11", devTime: 2.6, teamAvg: 2.4 },
      { sprint: "Sprint 12", devTime: 3.0, teamAvg: 2.2 },
      { sprint: "Sprint 13", devTime: 3.4, teamAvg: 2.5 },
      { sprint: "Sprint 14", devTime: 4.2, teamAvg: 2.6 },
    ],
    throughputThisSprint: 8,
    throughput3SprintAvg: 18,
    ticketAging: [
      { range: "0-2 days", count: 1, color: "#34d399" },
      { range: "3-5 days", count: 2, color: "#f59e0b" },
      { range: "6+ days", count: 3, color: "#ef4444" },
    ],
    tickets: [
      { ticketId: "VEL-081", project: "Velocity Pod", storyType: "feature", status: "in-progress", daysInProgress: 8, blocked: false, prLinked: true, riskLevel: "high" },
      { ticketId: "VEL-084", project: "Velocity Pod", storyType: "bug", status: "blocked", daysInProgress: 5, blocked: true, prLinked: false, riskLevel: "high" },
      { ticketId: "HOR-022", project: "Horizon Pod", storyType: "feature", status: "in-progress", daysInProgress: 6, blocked: false, prLinked: true, riskLevel: "high" },
      { ticketId: "HOR-025", project: "Horizon Pod", storyType: "chore", status: "in-review", daysInProgress: 3, blocked: false, prLinked: true, riskLevel: "medium" },
      { ticketId: "APX-015", project: "Apex Pod", storyType: "feature", status: "blocked", daysInProgress: 4, blocked: true, prLinked: false, riskLevel: "high" },
      { ticketId: "APX-018", project: "Apex Pod", storyType: "spike", status: "in-progress", daysInProgress: 2, blocked: false, prLinked: false, riskLevel: "medium" },
    ],
    prs: [
      { prId: "PR-420", title: "feat: dashboard redesign v2", status: "waiting-review", createdAt: "2d ago", hoursSinceUpdate: 48 },
      { prId: "PR-418", title: "feat: notification system UI", status: "waiting-review", createdAt: "3d ago", hoursSinceUpdate: 62 },
      { prId: "PR-416", title: "fix: responsive grid layout", status: "waiting-review", createdAt: "1d ago", hoursSinceUpdate: 24 },
      { prId: "PR-414", title: "chore: component library update", status: "open", createdAt: "1d ago", hoursSinceUpdate: 12 },
    ],
    prsOpenedThisSprint: 7,
    prsMerged: 2,
    avgTimeToMerge: 38,
    reviewsDone: 2,
    riskSignals: [
      "Total allocation at 110% -- overcommitted across 3 pods.",
      "3 tickets aging beyond 6 days -- significant delivery risk.",
      "PR review latency 52h is critically above 24h threshold.",
      "Context switch index 4.1 is dangerously high across 3 projects.",
      "WIP count (6) doubles the limit (3).",
      "Ticket VEL-084 blocked 5 days with no PR linked.",
    ],
  },
]

export function getDeveloperBySlug(slug: string): DeveloperData | undefined {
  return developers.find((d) => d.slug === slug)
}

export function getDevelopersByPod(podSlug: string): DeveloperData[] {
  const podNameMap: Record<string, string> = {
    "momentum-pod": "Momentum Pod",
    "velocity-pod": "Velocity Pod",
    "atlas-pod": "Atlas Pod",
    "horizon-pod": "Horizon Pod",
    "apex-pod": "Apex Pod",
    "forge-pod": "Forge Pod",
  }
  const podName = podNameMap[podSlug]
  if (!podName) return []
  return developers.filter((d) =>
    d.allocations.some((a) => a.podName === podName)
  )
}
