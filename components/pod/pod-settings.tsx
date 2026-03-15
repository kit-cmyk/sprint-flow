"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { PodData } from "@/lib/pod-data"
import { Switch } from "@/components/ui/switch"
import {
  Save,
  ExternalLink,
  Github,
  Search,
  CheckCircle2,
  Loader2,
  CreditCard,
  Building2,
  Mail,
  MapPin,
  Pencil,
  Trash2,
  AlertTriangle,
  UserCog,
  Shield,
  X,
  Plus,
  GitBranch,
  Server,
} from "lucide-react"

/* ── mock team members for role assignment ─────────────── */
interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
}

const teamMembers: TeamMember[] = [
  { id: "tm-001", name: "Sarah Chen", email: "sarah@assembled.systems", role: "Product Owner", avatar: "SC" },
  { id: "tm-002", name: "Alex Kim", email: "alex@assembled.systems", role: "Scrum Master", avatar: "AK" },
  { id: "tm-003", name: "Jake Lee", email: "jake@assembled.systems", role: "Developer", avatar: "JL" },
  { id: "tm-004", name: "Priya Patel", email: "priya@assembled.systems", role: "Developer", avatar: "PP" },
  { id: "tm-005", name: "Tom Garcia", email: "tom@assembled.systems", role: "Developer", avatar: "TG" },
  { id: "tm-006", name: "Nina Shah", email: "nina@assembled.systems", role: "QA Engineer", avatar: "NS" },
  { id: "tm-007", name: "Marcus Rivera", email: "marcus@assembled.systems", role: "Product Owner", avatar: "MR" },
  { id: "tm-008", name: "Lisa Thompson", email: "lisa@assembled.systems", role: "Scrum Master", avatar: "LT" },
]

/* ── mock Stripe customers for lookup ────────────────────── */
const stripeCustomers = [
  {
    id: "cus_Px1a2b3c4d",
    name: "Client A",
    email: "billing@clienta.com",
    plan: "Growth",
    interval: "monthly",
    address: "123 Tech Blvd, San Francisco, CA",
    last4: "4242",
    brand: "Visa",
  },
  {
    id: "cus_Qy5e6f7g8h",
    name: "Acme Corp",
    email: "finance@acmecorp.com",
    plan: "Enterprise",
    interval: "yearly",
    address: "456 Innovation Dr, Austin, TX",
    last4: "1234",
    brand: "Mastercard",
  },
  {
    id: "cus_Rz9i0j1k2l",
    name: "Horizon Labs",
    email: "accounts@horizonlabs.io",
    plan: "Starter",
    interval: "monthly",
    address: "789 Market St, New York, NY",
    last4: "5678",
    brand: "Amex",
  },
  {
    id: "cus_Sa3m4n5o6p",
    name: "Nova Digital",
    email: "billing@novadigital.co",
    plan: "Growth",
    interval: "yearly",
    address: "321 Cloud Ave, Seattle, WA",
    last4: "9012",
    brand: "Visa",
  },
]

type StripeCustomer = (typeof stripeCustomers)[number]

/* ── Deploy environments ───────────────────────────────── */
interface DeployEnv {
  id: string
  name: string
  branch: string
  active: boolean
}

const defaultEnvs: DeployEnv[] = [
  { id: "env-prod",    name: "Production", branch: "main",    active: true  },
  { id: "env-staging", name: "Staging",    branch: "staging", active: true  },
  { id: "env-dev",     name: "Dev",        branch: "develop", active: true  },
]

interface GithubRepo {
  id: string
  url: string
  label: string
  envs: DeployEnv[]
}

const momentumRepos: GithubRepo[] = [
  {
    id: "repo-1",
    url: "https://github.com/acme-org/momentum-app",
    label: "momentum-app",
    envs: [
      { id: "r1-prod",    name: "Production", branch: "main",    active: true  },
      { id: "r1-staging", name: "Staging",    branch: "staging", active: true  },
      { id: "r1-dev",     name: "Dev",        branch: "develop", active: false },
    ],
  },
  {
    id: "repo-2",
    url: "https://github.com/acme-org/momentum-api",
    label: "momentum-api",
    envs: [
      { id: "r2-prod",    name: "Production", branch: "main",    active: true },
      { id: "r2-staging", name: "Staging",    branch: "release", active: true },
    ],
  },
]

export function PodSettings({ pod }: { pod: PodData }) {
  /* ── General ────────────────────────────────── */
  const [podName, setPodName] = useState(pod.name.replace(" Pod", ""))
  const [saved, setSaved] = useState(false)

  /* ── Team Roles ─────────────────────────────── */
  const [productOwner, setProductOwner] = useState<TeamMember | null>(
    pod.slug === "momentum-pod" ? teamMembers[0] : null
  )
  const [scrumMaster, setScrumMaster] = useState<TeamMember | null>(
    pod.slug === "momentum-pod" ? teamMembers[1] : null
  )
  const [showPOPicker, setShowPOPicker] = useState(false)
  const [showSMPicker, setShowSMPicker] = useState(false)

  /* ── Integrations ───────────────────────────── */
  const [jiraLink, setJiraLink] = useState(
    pod.slug === "momentum-pod" ? "https://momentum.atlassian.net/jira/software/projects/MOM/board" : ""
  )
  /* ── GitHub repos ───────────────────────────── */
  const [repos, setRepos] = useState<GithubRepo[]>(
    pod.slug === "momentum-pod" ? momentumRepos : []
  )
  const [addingRepo, setAddingRepo] = useState(false)
  const [newRepoUrl, setNewRepoUrl] = useState("")
  // Per-repo env editing state: repoId -> { editingEnvId, addingEnv, newName, newBranch }
  const [repoEnvState, setRepoEnvState] = useState<
    Record<string, { editingEnvId: string | null; addingEnv: boolean; newName: string; newBranch: string }>
  >({})

  function getRepoEnvState(repoId: string) {
    return repoEnvState[repoId] ?? { editingEnvId: null, addingEnv: false, newName: "", newBranch: "" }
  }

  function patchRepoEnvState(repoId: string, patch: Partial<typeof repoEnvState[string]>) {
    setRepoEnvState((prev) => ({ ...prev, [repoId]: { ...getRepoEnvState(repoId), ...patch } }))
  }

  function addRepo() {
    if (!newRepoUrl.trim()) return
    const urlParts = newRepoUrl.trim().replace(/\/$/, "").split("/")
    const label = urlParts[urlParts.length - 1] || "repo"
    const id = `repo-${Date.now()}`
    setRepos((prev) => [...prev, { id, url: newRepoUrl.trim(), label, envs: [defaultEnvs[0]] }])
    setNewRepoUrl("")
    setAddingRepo(false)
  }

  function removeRepo(id: string) {
    setRepos((prev) => prev.filter((r) => r.id !== id))
  }

  function updateRepoUrl(id: string, url: string) {
    setRepos((prev) => prev.map((r) => r.id === id ? { ...r, url, label: url.trim().replace(/\/$/, "").split("/").pop() || r.label } : r))
  }

  function addEnvToRepo(repoId: string) {
    const s = getRepoEnvState(repoId)
    if (!s.newName.trim()) return
    const envId = `env-${Date.now()}`
    setRepos((prev) => prev.map((r) =>
      r.id === repoId
        ? { ...r, envs: [...r.envs, { id: envId, name: s.newName.trim(), branch: s.newBranch.trim() || s.newName.toLowerCase().trim(), active: true }] }
        : r
    ))
    patchRepoEnvState(repoId, { addingEnv: false, newName: "", newBranch: "" })
  }

  function removeEnvFromRepo(repoId: string, envId: string) {
    setRepos((prev) => prev.map((r) => r.id === repoId ? { ...r, envs: r.envs.filter((e) => e.id !== envId) } : r))
  }

  function updateEnvInRepo(repoId: string, envId: string, patch: Partial<DeployEnv>) {
    setRepos((prev) => prev.map((r) =>
      r.id === repoId ? { ...r, envs: r.envs.map((e) => e.id === envId ? { ...e, ...patch } : e) } : r
    ))
  }

  /* ── Stripe ─────────────────────────────────── */
  const linkedCustomer: StripeCustomer | null =
    pod.slug === "momentum" ? stripeCustomers[0] : null
  const [selectedCustomer, setSelectedCustomer] = useState<StripeCustomer | null>(linkedCustomer)
  const [stripeQuery, setStripeQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<StripeCustomer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [editingStripe, setEditingStripe] = useState(false)

  /* ── Danger zone ────────────────────────────── */
  const [confirmArchive, setConfirmArchive] = useState(false)

  function handleStripeSearch() {
    if (!stripeQuery.trim()) return
    setSearching(true)
    setShowResults(false)
    setTimeout(() => {
      const q = stripeQuery.toLowerCase()
      const results = stripeCustomers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      )
      setSearchResults(results)
      setShowResults(true)
      setSearching(false)
    }, 800)
  }

  function handleSelectCustomer(customer: StripeCustomer) {
    setSelectedCustomer(customer)
    setShowResults(false)
    setStripeQuery("")
    setEditingStripe(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const displayName = podName.trim() ? `${podName.trim()} Pod` : pod.name

  return (
    <section className="flex flex-col gap-6">
      {/* Section header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Pod Settings</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Configure {pod.name} integrations and details
        </p>
      </div>

      {/* ── General Settings ──────────────────── */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">General</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="settings-pod-name" className="text-xs font-medium text-muted-foreground">
                Pod Name
              </Label>
              <div className="relative max-w-md">
                <Input
                  id="settings-pod-name"
                  value={podName}
                  onChange={(e) => setPodName(e.target.value)}
                  className="border-border bg-background pr-14 text-foreground"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Pod
                </span>
              </div>
              {podName.trim() && (
                <p className="text-xs text-muted-foreground">
                  Display name: <span className="font-medium text-foreground">{displayName}</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Team Roles ────────────────────────── */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Team Roles</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Assign key roles for this pod. These users will have special permissions and responsibilities.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Product Owner */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Shield className="h-3 w-3" />
                Product Owner
              </Label>
              {productOwner && !showPOPicker ? (
                <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    {productOwner.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{productOwner.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{productOwner.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setShowPOPicker(true)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-border text-xs"
                    onClick={() => setShowPOPicker(!showPOPicker)}
                  >
                    <UserCog className="mr-2 h-3 w-3" />
                    {showPOPicker ? "Cancel" : "Assign Product Owner"}
                  </Button>
                  {showPOPicker && (
                    <div className="rounded-lg border border-border bg-background">
                      <ul className="divide-y divide-border max-h-48 overflow-y-auto">
                        {teamMembers
                          .filter((m) => m.role === "Product Owner" || m.role === "Scrum Master")
                          .map((member) => (
                            <li key={member.id}>
                              <button
                                type="button"
                                className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted/50"
                                onClick={() => {
                                  setProductOwner(member)
                                  setShowPOPicker(false)
                                }}
                              >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                  {member.avatar}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                                </div>
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Scrum Master */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <UserCog className="h-3 w-3" />
                Scrum Master
              </Label>
              {scrumMaster && !showSMPicker ? (
                <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                    {scrumMaster.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{scrumMaster.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{scrumMaster.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setShowSMPicker(true)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-border text-xs"
                    onClick={() => setShowSMPicker(!showSMPicker)}
                  >
                    <UserCog className="mr-2 h-3 w-3" />
                    {showSMPicker ? "Cancel" : "Assign Scrum Master"}
                  </Button>
                  {showSMPicker && (
                    <div className="rounded-lg border border-border bg-background">
                      <ul className="divide-y divide-border max-h-48 overflow-y-auto">
                        {teamMembers
                          .filter((m) => m.role === "Scrum Master" || m.role === "Product Owner")
                          .map((member) => (
                            <li key={member.id}>
                              <button
                                type="button"
                                className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted/50"
                                onClick={() => {
                                  setScrumMaster(member)
                                  setShowSMPicker(false)
                                }}
                              >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                                  {member.avatar}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                                </div>
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Integrations ──────────────────────── */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Integrations</h3>
          <div className="space-y-1.5 max-w-md">
            <Label htmlFor="settings-jira" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ExternalLink className="h-3 w-3" />
              Jira Project Link
            </Label>
            <Input
              id="settings-jira"
              placeholder="https://org.atlassian.net/..."
              value={jiraLink}
              onChange={(e) => setJiraLink(e.target.value)}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
            {jiraLink && (
              <a
                href={jiraLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
              >
                Open in Jira
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── GitHub & Environments ─────────────── */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-foreground" />
              <h3 className="text-sm font-semibold text-foreground">GitHub</h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1.5 text-xs border-border"
              onClick={() => setAddingRepo(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Repository
            </Button>
          </div>
          <p className="mb-5 text-[11px] text-muted-foreground">
            Link one or more repositories and configure deployment environments for each.
          </p>

          <div className="flex flex-col gap-4">
            {/* Existing repos */}
            {repos.map((repo) => {
              const rs = getRepoEnvState(repo.id)
              return (
                <div key={repo.id} className="rounded-lg border border-border bg-background">
                  {/* Repo header */}
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <Github className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <Input
                      value={repo.url}
                      onChange={(e) => updateRepoUrl(repo.id, e.target.value)}
                      className="h-7 flex-1 border-0 bg-transparent p-0 text-xs font-medium text-foreground shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
                      placeholder="https://github.com/org/repo"
                    />
                    {repo.url && (
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-muted-foreground hover:text-primary"
                        title="Open in GitHub"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeRepo(repo.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Environments sub-section */}
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Deployment Environments
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                        onClick={() => patchRepoEnvState(repo.id, { addingEnv: true, editingEnvId: null })}
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </Button>
                    </div>

                    <div className="overflow-hidden rounded-md border border-border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/40">
                            <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Environment</th>
                            <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Branch</th>
                            <th className="px-3 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Active</th>
                            <th className="px-3 py-1.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {repo.envs.map((env) => (
                            <tr key={env.id} className="bg-background hover:bg-muted/20 transition-colors">
                              {rs.editingEnvId === env.id ? (
                                <>
                                  <td className="px-3 py-1.5">
                                    <Input value={env.name} onChange={(e) => updateEnvInRepo(repo.id, env.id, { name: e.target.value })} className="h-6 border-border bg-background text-xs" />
                                  </td>
                                  <td className="px-3 py-1.5">
                                    <Input value={env.branch} onChange={(e) => updateEnvInRepo(repo.id, env.id, { branch: e.target.value })} className="h-6 border-border bg-background font-mono text-xs" />
                                  </td>
                                  <td className="px-3 py-1.5 text-center">
                                    <Switch checked={env.active} onCheckedChange={(v) => updateEnvInRepo(repo.id, env.id, { active: v })} />
                                  </td>
                                  <td className="px-3 py-1.5 text-right">
                                    <Button size="sm" className="h-6 gap-1 text-xs" onClick={() => patchRepoEnvState(repo.id, { editingEnvId: null })}>
                                      <CheckCircle2 className="h-3 w-3" /> Done
                                    </Button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="px-3 py-1.5">
                                    <div className="flex items-center gap-1.5">
                                      <Server className="h-3 w-3 shrink-0 text-muted-foreground" />
                                      <span className="text-xs font-medium text-foreground">{env.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-1.5">
                                    <div className="flex items-center gap-1">
                                      <GitBranch className="h-3 w-3 shrink-0 text-muted-foreground" />
                                      <code className="text-xs text-foreground">{env.branch}</code>
                                    </div>
                                  </td>
                                  <td className="px-3 py-1.5 text-center">
                                    <Switch checked={env.active} onCheckedChange={(v) => updateEnvInRepo(repo.id, env.id, { active: v })} />
                                  </td>
                                  <td className="px-3 py-1.5 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" onClick={() => patchRepoEnvState(repo.id, { editingEnvId: env.id })}>
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeEnvFromRepo(repo.id, env.id)}>
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}

                          {/* Inline add env row */}
                          {rs.addingEnv && (
                            <tr className="bg-muted/20">
                              <td className="px-3 py-1.5">
                                <Input
                                  autoFocus
                                  value={rs.newName}
                                  onChange={(e) => patchRepoEnvState(repo.id, { newName: e.target.value })}
                                  placeholder="e.g. QA"
                                  className="h-6 border-border bg-background text-xs"
                                  onKeyDown={(e) => { if (e.key === "Enter") addEnvToRepo(repo.id); if (e.key === "Escape") patchRepoEnvState(repo.id, { addingEnv: false }) }}
                                />
                              </td>
                              <td className="px-3 py-1.5">
                                <Input
                                  value={rs.newBranch}
                                  onChange={(e) => patchRepoEnvState(repo.id, { newBranch: e.target.value })}
                                  placeholder="e.g. qa"
                                  className="h-6 border-border bg-background font-mono text-xs"
                                  onKeyDown={(e) => { if (e.key === "Enter") addEnvToRepo(repo.id); if (e.key === "Escape") patchRepoEnvState(repo.id, { addingEnv: false }) }}
                                />
                              </td>
                              <td className="px-3 py-1.5 text-center">
                                <Switch checked disabled />
                              </td>
                              <td className="px-3 py-1.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button size="sm" className="h-6 gap-1 text-xs" onClick={() => addEnvToRepo(repo.id)}>
                                    <Plus className="h-3 w-3" /> Add
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground" onClick={() => patchRepoEnvState(repo.id, { addingEnv: false })}>
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )}

                          {repo.envs.length === 0 && !rs.addingEnv && (
                            <tr>
                              <td colSpan={4} className="px-3 py-4 text-center text-xs text-muted-foreground">
                                No environments. Add one to track deployments.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Add new repo inline */}
            {addingRepo && (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3">
                <Github className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <Input
                  autoFocus
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  placeholder="https://github.com/org/repo"
                  className="h-7 flex-1 border-border bg-background text-xs"
                  onKeyDown={(e) => { if (e.key === "Enter") addRepo(); if (e.key === "Escape") setAddingRepo(false) }}
                />
                <Button size="sm" className="h-7 gap-1 text-xs shrink-0" onClick={addRepo}>
                  <Plus className="h-3 w-3" /> Add
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0 text-muted-foreground" onClick={() => setAddingRepo(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {repos.length === 0 && !addingRepo && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
                <Github className="h-6 w-6 text-muted-foreground" />
                <p className="text-xs font-medium text-foreground">No repositories linked</p>
                <p className="text-[11px] text-muted-foreground">Add a GitHub repository to configure deployment tracking.</p>
                <Button size="sm" variant="outline" className="mt-1 h-7 gap-1.5 text-xs border-border" onClick={() => setAddingRepo(true)}>
                  <Plus className="h-3.5 w-3.5" /> Add Repository
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Stripe Billing ────────────────────── */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Stripe Billing</h3>
            {selectedCustomer && !editingStripe && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setEditingStripe(true)}
              >
                <Pencil className="h-3 w-3" />
                Change
              </Button>
            )}
          </div>

          {/* Linked customer display */}
          {selectedCustomer && !editingStripe ? (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">Customer Linked</span>
                </div>
                <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {selectedCustomer.id}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Customer</p>
                    <p className="text-xs text-foreground">{selectedCustomer.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Email</p>
                    <p className="truncate text-xs text-foreground">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CreditCard className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Billing</p>
                    <p className="text-xs text-foreground">
                      {selectedCustomer.brand} ****{selectedCustomer.last4} &middot; {selectedCustomer.plan} ({selectedCustomer.interval})
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Address</p>
                    <p className="text-xs text-foreground">{selectedCustomer.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Search for customer */
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Link a Stripe customer to enable billing for this pod.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or customer ID..."
                    value={stripeQuery}
                    onChange={(e) => setStripeQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStripeSearch()}
                    className="border-border bg-background pl-9 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5 border-border px-3"
                  onClick={handleStripeSearch}
                  disabled={!stripeQuery.trim() || searching}
                >
                  {searching ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Search className="h-3.5 w-3.5" />
                  )}
                  Search
                </Button>
                {editingStripe && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 text-xs text-muted-foreground"
                    onClick={() => { setEditingStripe(false); setShowResults(false); setStripeQuery(""); }}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {/* Search results */}
              {showResults && (
                <div className="rounded-lg border border-border bg-background">
                  {searchResults.length === 0 ? (
                    <p className="px-4 py-3 text-center text-xs text-muted-foreground">
                      No customers found matching &ldquo;{stripeQuery}&rdquo;
                    </p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {searchResults.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                            onClick={() => handleSelectCustomer(c)}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground">{c.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{c.email} &middot; {c.id}</p>
                            </div>
                            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              {c.plan}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Save bar ──────────────────────────── */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-3">
        <p className="text-xs text-muted-foreground">
          Changes are saved per pod and apply immediately.
        </p>
        <Button
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
          onClick={handleSave}
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* ── Danger Zone ───────────────────────── */}
      <Card className="border-red-500/20 bg-card">
        <CardContent className="p-5">
          <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-red-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Danger Zone
          </h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Irreversible actions for this pod.
          </p>
          <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Archive Pod</p>
              <p className="text-xs text-muted-foreground">
                This will disable the pod and hide it from all views.
              </p>
            </div>
            {confirmArchive ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-muted-foreground"
                  onClick={() => setConfirmArchive(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 bg-red-600 text-white hover:bg-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Confirm Archive
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                onClick={() => setConfirmArchive(true)}
              >
                Archive
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
