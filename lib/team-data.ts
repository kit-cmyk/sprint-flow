import { pods, getPodBySlug, type PodData } from "@/lib/pod-data"
import { developers, getDeveloperBySlug, type DeveloperData } from "@/lib/developer-data"

export interface Team {
  id: string
  slug: string
  name: string
  description?: string
  /** Slugs referencing DeveloperData.slug */
  developerSlugs: string[]
  /** Slugs referencing PodData.slug — each pod is a project this team owns */
  podSlugs: string[]
}

export const teams: Team[] = [
  {
    id: "team-alpha",
    slug: "alpha-team",
    name: "Alpha Team",
    description: "Handles platform, e-commerce, and mapping projects.",
    developerSlugs: ["alex-rivera", "sarah-chen", "marcus-johnson"],
    podSlugs: ["momentum-pod", "velocity-pod", "atlas-pod"],
  },
  {
    id: "team-beta",
    slug: "beta-team",
    name: "Beta Team",
    description: "Owns streaming, ML inference, and infrastructure projects.",
    developerSlugs: ["marcus-johnson"],
    podSlugs: ["horizon-pod", "apex-pod", "forge-pod"],
  },
]

export function getTeamBySlug(slug: string): Team | undefined {
  return teams.find((t) => t.slug === slug)
}

/** Resolve the full DeveloperData objects for a team */
export function getTeamDevelopers(team: Team): DeveloperData[] {
  return team.developerSlugs
    .map((s) => getDeveloperBySlug(s))
    .filter((d): d is DeveloperData => d !== undefined)
}

/** Resolve the full PodData objects for a team */
export function getTeamPods(team: Team): PodData[] {
  return team.podSlugs
    .map((s) => getPodBySlug(s))
    .filter((p): p is PodData => p !== undefined)
}

/**
 * Build an allocation matrix: for each developer in the team, return their
 * allocation % for each pod (project) the team manages.
 *
 * Matrix structure:
 *   rows: developers
 *   columns: pods
 *   value: allocation % (0 if developer has no allocation to that pod)
 */
export interface AllocationCell {
  devSlug: string
  podSlug: string
  percentage: number
}

export function buildAllocationMatrix(team: Team): {
  developers: DeveloperData[]
  pods: PodData[]
  cells: AllocationCell[]
} {
  const devs = getTeamDevelopers(team)
  const podList = getTeamPods(team)

  const podNameToSlug: Record<string, string> = {
    "Momentum Pod": "momentum-pod",
    "Velocity Pod": "velocity-pod",
    "Atlas Pod": "atlas-pod",
    "Horizon Pod": "horizon-pod",
    "Apex Pod": "apex-pod",
    "Forge Pod": "forge-pod",
  }

  const cells: AllocationCell[] = devs.flatMap((dev) =>
    podList.map((pod) => {
      const allocation = dev.allocations.find(
        (a) => podNameToSlug[a.podName] === pod.slug
      )
      return {
        devSlug: dev.slug,
        podSlug: pod.slug,
        percentage: allocation?.percentage ?? 0,
      }
    })
  )

  return { developers: devs, pods: podList, cells }
}
