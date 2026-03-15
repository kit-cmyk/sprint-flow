export type OrgPlan = "Starter" | "Business" | "Enterprise"
export type OrgStatus = "active" | "suspended" | "trial"

export interface OrgMember {
  id: string
  name: string
  email: string
  role: "admin" | "scrum-master" | "developer" | "client-viewer"
  status: "active" | "invited" | "disabled"
  lastActive: string
  avatar: string
}

export interface Organization {
  id: string
  slug: string
  name: string
  logoInitials: string
  plan: OrgPlan
  status: OrgStatus
  seats: number
  seatsUsed: number
  mrr: number
  createdAt: string
  adminEmail: string
  podSlugs: string[]
  developerSlugs: string[]
  teamSlugs: string[]
  members: OrgMember[]
}

export const organizations: Organization[] = [
  {
    id: "org-1",
    slug: "acme-corp",
    name: "Acme Corp",
    logoInitials: "AC",
    plan: "Enterprise",
    status: "active",
    seats: 20,
    seatsUsed: 18,
    mrr: 4800,
    createdAt: "2024-01-15",
    adminEmail: "admin@acme.com",
    podSlugs: ["momentum-pod", "velocity-pod", "apex-pod"],
    developerSlugs: ["alex-rivera", "sarah-chen", "marcus-johnson"],
    teamSlugs: ["alpha-team"],
    members: [
      { id: "m1", name: "James Mitchell", email: "james@acme.com", role: "admin", status: "active", lastActive: "2 min ago", avatar: "JM" },
      { id: "m2", name: "Sarah Chen", email: "sarah@acme.com", role: "scrum-master", status: "active", lastActive: "1 hr ago", avatar: "SC" },
      { id: "m3", name: "Alex Rivera", email: "alex@acme.com", role: "developer", status: "active", lastActive: "3 hrs ago", avatar: "AR" },
      { id: "m4", name: "Emily Torres", email: "emily@acme.com", role: "client-viewer", status: "active", lastActive: "1 day ago", avatar: "ET" },
      { id: "m5", name: "David Kim", email: "david@acme.com", role: "developer", status: "invited", lastActive: "Pending", avatar: "DK" },
    ],
  },
  {
    id: "org-2",
    slug: "nexus-labs",
    name: "Nexus Labs",
    logoInitials: "NX",
    plan: "Business",
    status: "active",
    seats: 10,
    seatsUsed: 7,
    mrr: 1800,
    createdAt: "2024-03-08",
    adminEmail: "ops@nexuslabs.io",
    podSlugs: ["atlas-pod", "forge-pod"],
    developerSlugs: ["sarah-chen", "alex-rivera"],
    teamSlugs: ["beta-team"],
    members: [
      { id: "m6", name: "Nina Patel", email: "nina@nexuslabs.io", role: "admin", status: "active", lastActive: "5 min ago", avatar: "NP" },
      { id: "m7", name: "Chris Wong", email: "chris@nexuslabs.io", role: "developer", status: "active", lastActive: "2 hrs ago", avatar: "CW" },
      { id: "m8", name: "Rachel Moore", email: "rachel@nexuslabs.io", role: "scrum-master", status: "active", lastActive: "30 min ago", avatar: "RM" },
    ],
  },
  {
    id: "org-3",
    slug: "orbital-systems",
    name: "Orbital Systems",
    logoInitials: "OS",
    plan: "Starter",
    status: "trial",
    seats: 5,
    seatsUsed: 3,
    mrr: 0,
    createdAt: "2025-01-20",
    adminEmail: "hello@orbital.dev",
    podSlugs: ["horizon-pod"],
    developerSlugs: ["marcus-johnson"],
    teamSlugs: [],
    members: [
      { id: "m9", name: "Liam Foster", email: "liam@orbital.dev", role: "admin", status: "active", lastActive: "10 min ago", avatar: "LF" },
      { id: "m10", name: "Priya Sharma", email: "priya@orbital.dev", role: "developer", status: "invited", lastActive: "Pending", avatar: "PS" },
    ],
  },
  {
    id: "org-4",
    slug: "pinecrest-digital",
    name: "Pinecrest Digital",
    logoInitials: "PD",
    plan: "Business",
    status: "suspended",
    seats: 8,
    seatsUsed: 6,
    mrr: 1200,
    createdAt: "2023-11-02",
    adminEmail: "dev@pinecrest.com",
    podSlugs: ["forge-pod"],
    developerSlugs: ["alex-rivera"],
    teamSlugs: [],
    members: [
      { id: "m11", name: "Tom Hayes", email: "tom@pinecrest.com", role: "admin", status: "disabled", lastActive: "15 days ago", avatar: "TH" },
      { id: "m12", name: "Linda Cruz", email: "linda@pinecrest.com", role: "developer", status: "disabled", lastActive: "15 days ago", avatar: "LC" },
    ],
  },
]

export function getOrgBySlug(slug: string): Organization | undefined {
  return organizations.find((o) => o.slug === slug)
}

export function getTotalMRR(): number {
  return organizations.filter((o) => o.status !== "suspended").reduce((sum, o) => sum + o.mrr, 0)
}

export function getTotalActiveDevelopers(): number {
  const allSlugs = new Set(organizations.flatMap((o) => o.developerSlugs))
  return allSlugs.size
}
