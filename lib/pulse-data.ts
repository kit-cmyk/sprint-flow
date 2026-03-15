/* ── types ──────────────────────────────────────────────── */
export interface PulseTask {
  id: string
  title: string
  assignee: string
}

export interface PulseBoard {
  todo: PulseTask[]
  inProgress: PulseTask[]
  done: PulseTask[]
}

export interface PulseReport {
  id: string
  sprint: string
  week: string
  date: string
  author: string
  role: string
  summary: string
  highlights: string[]
  board: PulseBoard
}

/* ── data ───────────────────────────────────────────────── */
export const pulseReports: PulseReport[] = [
  {
    id: "pulse-3",
    sprint: "Sprint 14",
    week: "Week of Feb 10",
    date: "Feb 14, 2025",
    author: "Sarah Chen",
    role: "Scrum Master",
    summary:
      "Strong sprint momentum this week. The API refactoring work is progressing well with the rate limiting setup scheduled for completion by end of week. The onboarding wizard v2 is unblocked following design sign-off and Jake Lee has picked it up. The webhook integration layer is the main focus for Sarah and is tracking to schedule. Overall sprint health is positive with 54% completion at mid-sprint.",
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
    sprint: "Sprint 13",
    week: "Week of Feb 3",
    date: "Feb 7, 2025",
    author: "Marcus Reid",
    role: "Org Admin",
    summary:
      "Sprint 13 delivered the core authentication re-architecture and SSO integration on schedule. The team completed migration of 12,000 user accounts with zero downtime — a significant milestone. Dashboard load times improved by 35% following query optimisation work. One carryover item (bulk export) has been moved to Sprint 14 with a revised scope.",
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
      inProgress: [
        { id: "MOM-093", title: "Bulk export CSV", assignee: "Sarah Chen" },
      ],
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
    sprint: "Sprint 12",
    week: "Week of Jan 27",
    date: "Jan 31, 2025",
    author: "Sarah Chen",
    role: "Scrum Master",
    summary:
      "Completed the data pipeline overhaul and new reporting engine on schedule. Two critical bugs in the notification service were resolved ahead of the sprint close. The team welcomed a new developer who has been ramping on the analytics module and is now fully onboarded.",
    highlights: [
      "Data pipeline overhaul completed — ETL jobs now running 40% faster",
      "Two critical notification service bugs resolved",
      "New developer fully onboarded to analytics module",
      "Reporting engine v2 ready for client UAT",
    ],
    board: {
      todo: [
        { id: "MOM-082", title: "Analytics module kickoff", assignee: "Jake Lee" },
      ],
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
]
