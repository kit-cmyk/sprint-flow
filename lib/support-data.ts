/* ─────────────────────────────────────────────────────────────
   lib/support-data.ts
   Shared mock data for support tickets and audit log events.
   Used by both the org-admin settings and the super-admin
   org detail view.
───────────────────────────────────────────────────────────── */

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "critical"
export type TicketCategory = "billing" | "integration" | "bug" | "feature-request" | "access" | "other"

export interface TicketReply {
  id: string
  author: string
  authorAvatar: string
  role: "org-admin" | "super-admin"
  body: string
  timestamp: string
}

export interface SupportTicket {
  id: string
  subject: string
  description: string
  submittedBy: string
  submittedByName: string
  submittedByAvatar: string
  category: TicketCategory
  status: TicketStatus
  priority: TicketPriority
  created: string
  lastUpdate: string
  orgSlug: string
  replies: TicketReply[]
}

export interface AuditEvent {
  id: string
  actor: string
  actorAvatar: string
  action: string
  target: string
  ip: string
  timestamp: string
  orgSlug: string
}

/* ── colour maps ─────────────────────────────────────────── */
export const ticketStatusColors: Record<TicketStatus, string> = {
  open: "bg-amber-500/10 text-amber-400",
  "in-progress": "bg-primary/10 text-primary",
  resolved: "bg-emerald-500/10 text-emerald-400",
  closed: "bg-muted text-muted-foreground",
}

export const ticketPriorityColors: Record<TicketPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-amber-500/10 text-amber-400",
  high: "bg-orange-500/10 text-orange-400",
  critical: "bg-red-500/10 text-red-400",
}

export const ticketCategoryLabels: Record<TicketCategory, string> = {
  billing: "Billing",
  integration: "Integration",
  bug: "Bug",
  "feature-request": "Feature Request",
  access: "Access",
  other: "Other",
}

export const auditActionColors: Record<string, string> = {
  created: "text-emerald-400",
  deleted: "text-red-400",
  updated: "text-primary",
  invited: "text-amber-400",
  suspended: "text-red-400",
  reactivated: "text-emerald-400",
  login: "text-muted-foreground",
  "role changed": "text-violet-400",
  "settings changed": "text-primary",
  "integration connected": "text-emerald-400",
  "integration disconnected": "text-red-400",
  "password reset": "text-amber-400",
}

/* ── mock tickets (keyed by orgSlug) ─────────────────────── */
export const allTickets: SupportTicket[] = [
  // acme-corp
  {
    id: "TKT-001",
    subject: "Cannot connect Jira integration",
    description: "When clicking 'Connect' on the Jira integration card, the OAuth flow starts but returns a 403 error after callback. We have tried revoking and re-authorizing the Jira app but the issue persists.",
    submittedBy: "admin@acme.com",
    submittedByName: "James Mitchell",
    submittedByAvatar: "JM",
    category: "integration",
    status: "open",
    priority: "high",
    created: "Mar 4, 2025",
    lastUpdate: "Mar 5, 2025",
    orgSlug: "acme-corp",
    replies: [
      { id: "r1", author: "Support Team", authorAvatar: "SA", role: "super-admin", body: "Thanks for reaching out, James. We have reproduced the issue on our end — it appears to be related to a permissions scope change in the Jira Cloud API. We are working on a fix and will push an update within 24 hours.", timestamp: "Mar 5, 2025 10:30" },
      { id: "r2", author: "James Mitchell", authorAvatar: "JM", role: "org-admin", body: "Appreciate the quick response. Let me know if you need any additional details from our end such as workspace URL or error logs.", timestamp: "Mar 5, 2025 11:15" },
    ],
  },
  {
    id: "TKT-002",
    subject: "Sprint velocity chart not loading",
    description: "The velocity chart on the pod overview page shows a blank canvas. Affects all pods. Started after the last platform update on Feb 27.",
    submittedBy: "sarah@acme.com",
    submittedByName: "Sarah Chen",
    submittedByAvatar: "SC",
    category: "bug",
    status: "in-progress",
    priority: "medium",
    created: "Feb 28, 2025",
    lastUpdate: "Mar 3, 2025",
    orgSlug: "acme-corp",
    replies: [
      { id: "r3", author: "Support Team", authorAvatar: "SA", role: "super-admin", body: "Hi Sarah, we have identified a regression in the chart rendering introduced in v2.4.1. Our engineering team has a fix in review — expected release is March 4. We will notify you once it is deployed.", timestamp: "Mar 1, 2025 09:00" },
      { id: "r4", author: "Sarah Chen", authorAvatar: "SC", role: "org-admin", body: "Thanks for the update. Is there a workaround in the meantime?", timestamp: "Mar 1, 2025 09:45" },
      { id: "r5", author: "Support Team", authorAvatar: "SA", role: "super-admin", body: "Unfortunately there is no workaround at this time. The fix is our top priority this sprint.", timestamp: "Mar 1, 2025 10:00" },
    ],
  },
  {
    id: "TKT-003",
    subject: "Billing invoice shows incorrect amount",
    description: "February invoice shows $5,800 instead of our contracted rate of $4,800. Please review and issue a corrected invoice.",
    submittedBy: "admin@acme.com",
    submittedByName: "James Mitchell",
    submittedByAvatar: "JM",
    category: "billing",
    status: "resolved",
    priority: "critical",
    created: "Feb 15, 2025",
    lastUpdate: "Feb 20, 2025",
    orgSlug: "acme-corp",
    replies: [
      { id: "r6", author: "Support Team", authorAvatar: "SA", role: "super-admin", body: "Thank you for flagging this, James. We have reviewed your account and confirmed the billing error. A corrected invoice for $4,800 has been issued and the overpayment of $1,000 will be applied as credit to your next cycle.", timestamp: "Feb 17, 2025 14:00" },
      { id: "r7", author: "James Mitchell", authorAvatar: "JM", role: "org-admin", body: "Confirmed, I can see the corrected invoice. Thank you for resolving this quickly.", timestamp: "Feb 20, 2025 09:30" },
    ],
  },
  {
    id: "TKT-004",
    subject: "User invite email not received",
    description: "Invited david@acme.com three days ago. The user has not received any email. Checked spam folder.",
    submittedBy: "james@acme.com",
    submittedByName: "James Mitchell",
    submittedByAvatar: "JM",
    category: "access",
    status: "closed",
    priority: "low",
    created: "Jan 30, 2025",
    lastUpdate: "Feb 1, 2025",
    orgSlug: "acme-corp",
    replies: [
      { id: "r8", author: "Support Team", authorAvatar: "SA", role: "super-admin", body: "We found the invite was filtered by a strict email policy on the recipient domain. We have resent the invite from a whitelisted sender address. The user should receive it within a few minutes.", timestamp: "Jan 31, 2025 10:00" },
      { id: "r9", author: "James Mitchell", authorAvatar: "JM", role: "org-admin", body: "David confirmed he received the new invite. Thanks for the help.", timestamp: "Feb 1, 2025 08:45" },
    ],
  },
  {
    id: "TKT-005",
    subject: "Request: bulk import developers from CSV",
    description: "It would be helpful to import a list of developers via CSV file rather than adding them one by one. We have 40+ developers to onboard.",
    submittedBy: "admin@acme.com",
    submittedByName: "James Mitchell",
    submittedByAvatar: "JM",
    category: "feature-request",
    status: "open",
    priority: "low",
    created: "Mar 1, 2025",
    lastUpdate: "Mar 1, 2025",
    orgSlug: "acme-corp",
    replies: [],
  },
  // nexus-labs
  {
    id: "TKT-006",
    subject: "GitHub OAuth token expired",
    description: "The GitHub integration shows 'token expired'. Disconnecting and reconnecting does not resolve the issue. Error: 'bad_verification_code'.",
    submittedBy: "nina@nexuslabs.io",
    submittedByName: "Nina Patel",
    submittedByAvatar: "NP",
    category: "integration",
    status: "open",
    priority: "high",
    created: "Mar 3, 2025",
    lastUpdate: "Mar 4, 2025",
    orgSlug: "nexus-labs",
    replies: [
      { id: "r10", author: "Support Team", authorAvatar: "SA", role: "super-admin", body: "Hi Nina, we have revoked the existing token on our backend. Please try reconnecting GitHub now — you should be prompted for a fresh authorization.", timestamp: "Mar 4, 2025 09:00" },
    ],
  },
  {
    id: "TKT-007",
    subject: "Pod health score stuck at 0",
    description: "Forge Pod has shown a health score of 0 for the past week even though all sprints are on track and tickets are being completed normally.",
    submittedBy: "chris@nexuslabs.io",
    submittedByName: "Chris Wong",
    submittedByAvatar: "CW",
    category: "bug",
    status: "in-progress",
    priority: "high",
    created: "Feb 25, 2025",
    lastUpdate: "Mar 2, 2025",
    orgSlug: "nexus-labs",
    replies: [
      { id: "r11", author: "Support Team", authorAvatar: "SA", role: "super-admin", body: "Thanks for the report, Chris. We can see the issue in your account — the health calculation job is failing silently for Forge Pod due to a misconfigured sprint end date. We are resetting it now.", timestamp: "Feb 26, 2025 15:00" },
      { id: "r12", author: "Chris Wong", authorAvatar: "CW", role: "org-admin", body: "Still showing 0 this morning. Has the fix been applied yet?", timestamp: "Mar 2, 2025 08:30" },
      { id: "r13", author: "Support Team", authorAvatar: "SA", role: "super-admin", body: "Apologies for the delay. The fix requires a data migration on your pod record. We are running it now and it should reflect correctly within the hour.", timestamp: "Mar 2, 2025 09:10" },
    ],
  },
  // orbital-systems
  {
    id: "TKT-008",
    subject: "Trial expiry date incorrect",
    description: "Our trial shows expiry of Feb 20 but we signed up on Jan 20, which should give us 30 days through Feb 19. We would like the accurate date reflected.",
    submittedBy: "liam@orbital.dev",
    submittedByName: "Liam Foster",
    submittedByAvatar: "LF",
    category: "billing",
    status: "resolved",
    priority: "medium",
    created: "Feb 10, 2025",
    lastUpdate: "Feb 12, 2025",
    orgSlug: "orbital-systems",
    replies: [
      { id: "r14", author: "Support Team", authorAvatar: "SA", role: "super-admin", body: "Hi Liam, we have reviewed the account creation timestamp. The discrepancy was caused by a timezone offset issue in our trial provisioning logic. Your trial has been corrected to expire Feb 19, 2025.", timestamp: "Feb 11, 2025 11:00" },
      { id: "r15", author: "Liam Foster", authorAvatar: "LF", role: "org-admin", body: "Perfect, the date now shows correctly. Thank you.", timestamp: "Feb 12, 2025 09:00" },
    ],
  },
  // pinecrest-digital
  {
    id: "TKT-009",
    subject: "Unable to access account after suspension",
    description: "Our account was suspended on Feb 15. We have since settled all outstanding invoices (reference #INV-2024-089 and #INV-2024-094). Please reactivate our account.",
    submittedBy: "tom@pinecrest.com",
    submittedByName: "Tom Hayes",
    submittedByAvatar: "TH",
    category: "access",
    status: "open",
    priority: "critical",
    created: "Mar 5, 2025",
    lastUpdate: "Mar 5, 2025",
    orgSlug: "pinecrest-digital",
    replies: [],
  },
]

/* ── mock audit events (keyed by orgSlug) ────────────────── */
export const allAuditEvents: AuditEvent[] = [
  // acme-corp
  { id: "ev-001", actor: "admin@acme.com", actorAvatar: "JM", action: "login", target: "Dashboard", ip: "192.168.1.10", timestamp: "Mar 5, 2025 09:14", orgSlug: "acme-corp" },
  { id: "ev-002", actor: "admin@acme.com", actorAvatar: "JM", action: "invited", target: "david@acme.com", ip: "192.168.1.10", timestamp: "Mar 4, 2025 15:32", orgSlug: "acme-corp" },
  { id: "ev-003", actor: "admin@acme.com", actorAvatar: "JM", action: "role changed", target: "Sarah Chen → Scrum Master", ip: "192.168.1.10", timestamp: "Mar 3, 2025 11:08", orgSlug: "acme-corp" },
  { id: "ev-004", actor: "admin@acme.com", actorAvatar: "JM", action: "settings changed", target: "Organization Profile", ip: "192.168.1.10", timestamp: "Feb 28, 2025 14:20", orgSlug: "acme-corp" },
  { id: "ev-005", actor: "superadmin@assembled.dev", actorAvatar: "SA", action: "updated", target: "Plan: Business → Enterprise", ip: "10.10.0.1", timestamp: "Feb 20, 2025 10:00", orgSlug: "acme-corp" },
  { id: "ev-006", actor: "sarah@acme.com", actorAvatar: "SC", action: "created", target: "Sprint Board: Q1-2025", ip: "10.0.0.5", timestamp: "Jan 15, 2025 10:00", orgSlug: "acme-corp" },
  { id: "ev-007", actor: "alex@acme.com", actorAvatar: "AR", action: "deleted", target: "Ticket MOM-42", ip: "10.0.0.7", timestamp: "Jan 10, 2025 16:45", orgSlug: "acme-corp" },
  { id: "ev-008", actor: "admin@acme.com", actorAvatar: "JM", action: "integration connected", target: "GitHub", ip: "192.168.1.10", timestamp: "Jan 5, 2025 09:30", orgSlug: "acme-corp" },
  // nexus-labs
  { id: "ev-009", actor: "nina@nexuslabs.io", actorAvatar: "NP", action: "login", target: "Dashboard", ip: "10.0.1.5", timestamp: "Mar 5, 2025 08:45", orgSlug: "nexus-labs" },
  { id: "ev-010", actor: "nina@nexuslabs.io", actorAvatar: "NP", action: "integration disconnected", target: "GitHub", ip: "10.0.1.5", timestamp: "Mar 3, 2025 14:10", orgSlug: "nexus-labs" },
  { id: "ev-011", actor: "superadmin@assembled.dev", actorAvatar: "SA", action: "updated", target: "Seats: 8 → 10", ip: "10.10.0.1", timestamp: "Feb 15, 2025 11:00", orgSlug: "nexus-labs" },
  { id: "ev-012", actor: "rachel@nexuslabs.io", actorAvatar: "RM", action: "created", target: "Team: Alpha Squad", ip: "10.0.1.6", timestamp: "Feb 1, 2025 13:00", orgSlug: "nexus-labs" },
  // orbital-systems
  { id: "ev-013", actor: "liam@orbital.dev", actorAvatar: "LF", action: "login", target: "Dashboard", ip: "172.16.0.2", timestamp: "Mar 5, 2025 10:00", orgSlug: "orbital-systems" },
  { id: "ev-014", actor: "liam@orbital.dev", actorAvatar: "LF", action: "invited", target: "priya@orbital.dev", ip: "172.16.0.2", timestamp: "Feb 18, 2025 15:00", orgSlug: "orbital-systems" },
  { id: "ev-015", actor: "superadmin@assembled.dev", actorAvatar: "SA", action: "created", target: "Organization: Orbital Systems", ip: "10.10.0.1", timestamp: "Jan 20, 2025 09:00", orgSlug: "orbital-systems" },
  // pinecrest-digital
  { id: "ev-016", actor: "superadmin@assembled.dev", actorAvatar: "SA", action: "suspended", target: "Pinecrest Digital", ip: "10.10.0.1", timestamp: "Feb 15, 2025 08:55", orgSlug: "pinecrest-digital" },
  { id: "ev-017", actor: "tom@pinecrest.com", actorAvatar: "TH", action: "login", target: "Dashboard", ip: "203.0.113.5", timestamp: "Feb 14, 2025 17:30", orgSlug: "pinecrest-digital" },
  { id: "ev-018", actor: "tom@pinecrest.com", actorAvatar: "TH", action: "settings changed", target: "Billing Details", ip: "203.0.113.5", timestamp: "Feb 10, 2025 11:20", orgSlug: "pinecrest-digital" },
]

/* ── helpers ─────────────────────────────────────────────── */
export function getTicketsByOrg(orgSlug: string): SupportTicket[] {
  return allTickets.filter((t) => t.orgSlug === orgSlug)
}

export function getAuditEventsByOrg(orgSlug: string): AuditEvent[] {
  return allAuditEvents.filter((e) => e.orgSlug === orgSlug)
}
