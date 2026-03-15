"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Plug,
  Github,
  ExternalLink,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Unlink,
  Link2,
  Plus,
  Trash2,
  FolderGit2,
  Building2,
  Users,
  Bell,
  Shield,
  HeadphonesIcon,
} from "lucide-react"
import { SettingsGeneral } from "@/components/admin/settings-general"
import { SettingsMembers } from "@/components/admin/settings-members"
import { SettingsNotifications } from "@/components/admin/settings-notifications"
import { SettingsBilling } from "@/components/admin/settings-billing"
import { SettingsSupport } from "@/components/admin/settings-support"


/* ── types ──────────────────────────────────────────────────── */
type ConnectionStatus = "connected" | "disconnected" | "connecting"

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: ConnectionStatus
  detail?: string
  fields: { key: string; label: string; placeholder: string; value: string }[]
}

interface GitHubOrganization {
  id: string
  name: string
  url: string
  repositories: GitHubRepository[]
}

interface GitHubRepository {
  id: string
  name: string
  url: string
}

/* ── GitHub organizations and repositories ──────────────────── */
const initialGitHubOrgs: GitHubOrganization[] = [
  {
    id: "org-1",
    name: "acme-corp",
    url: "https://github.com/acme-corp",
    repositories: [
      { id: "repo-1", name: "frontend-app", url: "https://github.com/acme-corp/frontend-app" },
      { id: "repo-2", name: "backend-api", url: "https://github.com/acme-corp/backend-api" },
      { id: "repo-3", name: "mobile-app", url: "https://github.com/acme-corp/mobile-app" },
    ],
  },
  {
    id: "org-2",
    name: "acme-labs",
    url: "https://github.com/acme-labs",
    repositories: [
      { id: "repo-4", name: "research-project", url: "https://github.com/acme-labs/research-project" },
      { id: "repo-5", name: "experimental-tools", url: "https://github.com/acme-labs/experimental-tools" },
    ],
  },
]

/* ── initial integration data ──────────────────────────────── */
const initialIntegrations: Integration[] = [
  {
    id: "jira",
    name: "Jira",
    description: "Link your Jira workspace to sync project boards and issues.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M11.53 2c0 5.18 3.74 9.38 8.35 9.38V14c-4.61 0-8.35 4.2-8.35 9.38h-2.6c0-5.18-3.74-9.38-8.36-9.38v-2.62C3.18 11.38 6.93 7.18 6.93 2h4.6z" fill="currentColor"/>
      </svg>
    ),
    status: "connected",
    detail: "acme-corp.atlassian.net",
    fields: [
      { key: "domain", label: "Jira Domain", placeholder: "https://org.atlassian.net", value: "https://acme-corp.atlassian.net" },
      { key: "api_token", label: "API Token", placeholder: "Enter Jira API token", value: "****-****-****-a1b2" },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Connect GitHub to track repositories and pull requests across multiple organizations.",
    icon: <Github className="h-5 w-5" />,
    status: "connected",
    detail: "2 organizations • 5 repositories",
    fields: [
      { key: "pat", label: "Personal Access Token", placeholder: "ghp_...", value: "****-****-****-x9y8" },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send notifications and alerts to your team Slack channels.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z" fill="currentColor"/>
      </svg>
    ),
    status: "disconnected",
    fields: [
      { key: "webhook", label: "Webhook URL", placeholder: "https://hooks.slack.com/services/...", value: "" },
      { key: "channel", label: "Default Channel", placeholder: "#engineering", value: "" },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Connect Stripe to manage billing and subscriptions.",
    icon: <CreditCard className="h-5 w-5" />,
    status: "connected",
    detail: "acct_1A2B3C4D5E",
    fields: [
      { key: "api_key", label: "Secret Key", placeholder: "sk_live_...", value: "****-****-****-z7w6" },
      { key: "webhook_secret", label: "Webhook Secret", placeholder: "whsec_...", value: "****-****-****-m3n4" },
    ],
  },
]

/* ── status badge ───────────────────────────────────────────── */
function StatusBadge({ status }: { status: ConnectionStatus }) {
  if (status === "connected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
        <CheckCircle2 className="h-3 w-3" />
        Connected
      </span>
    )
  }
  if (status === "connecting") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        Connecting
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
      <AlertCircle className="h-3 w-3" />
      Not connected
    </span>
  )
}

/* ── main component ─────────────────────────────────────────── */
export function SettingsContent() {
  const [integrations, setIntegrations] = useState(initialIntegrations)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editFields, setEditFields] = useState<Record<string, Record<string, string>>>({})
  const [githubOrgs, setGithubOrgs] = useState<GitHubOrganization[]>(initialGitHubOrgs)
  const [showGitHubManager, setShowGitHubManager] = useState(false)

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
      const integration = integrations.find((i) => i.id === id)
      if (integration) {
        const fieldValues: Record<string, string> = {}
        integration.fields.forEach((f) => {
          fieldValues[f.key] = f.value
        })
        setEditFields((prev) => ({ ...prev, [id]: fieldValues }))
      }
    }
  }

  const updateField = (integrationId: string, fieldKey: string, value: string) => {
    setEditFields((prev) => ({
      ...prev,
      [integrationId]: { ...prev[integrationId], [fieldKey]: value },
    }))
  }

  const handleConnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "connecting" as const } : i))
    )
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: "connected" as const,
                detail: editFields[id]?.[i.fields[0]?.key] || i.detail,
                fields: i.fields.map((f) => ({
                  ...f,
                  value: editFields[id]?.[f.key] ?? f.value,
                })),
              }
            : i
        )
      )
      setExpandedId(null)
    }, 1500)
  }

  const handleDisconnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: "disconnected" as const, detail: undefined, fields: i.fields.map((f) => ({ ...f, value: "" })) }
          : i
      )
    )
    setExpandedId(null)
  }

  const addGitHubOrg = () => {
    const newOrg: GitHubOrganization = {
      id: `org-${Date.now()}`,
      name: "",
      url: "",
      repositories: [],
    }
    setGithubOrgs((prev) => [...prev, newOrg])
  }

  const updateGitHubOrg = (orgId: string, field: "name" | "url", value: string) => {
    setGithubOrgs((prev) =>
      prev.map((org) =>
        org.id === orgId ? { ...org, [field]: value } : org
      )
    )
  }

  const removeGitHubOrg = (orgId: string) => {
    setGithubOrgs((prev) => prev.filter((org) => org.id !== orgId))
  }

  const addRepository = (orgId: string) => {
    const newRepo: GitHubRepository = {
      id: `repo-${Date.now()}`,
      name: "",
      url: "",
    }
    setGithubOrgs((prev) =>
      prev.map((org) =>
        org.id === orgId
          ? { ...org, repositories: [...org.repositories, newRepo] }
          : org
      )
    )
  }

  const updateRepository = (orgId: string, repoId: string, field: "name" | "url", value: string) => {
    setGithubOrgs((prev) =>
      prev.map((org) =>
        org.id === orgId
          ? {
              ...org,
              repositories: org.repositories.map((repo) =>
                repo.id === repoId ? { ...repo, [field]: value } : repo
              ),
            }
          : org
      )
    )
  }

  const removeRepository = (orgId: string, repoId: string) => {
    setGithubOrgs((prev) =>
      prev.map((org) =>
        org.id === orgId
          ? { ...org, repositories: org.repositories.filter((repo) => repo.id !== repoId) }
          : org
      )
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2.5 text-balance text-lg font-semibold text-foreground md:text-xl">
          <Settings className="h-5 w-5 text-muted-foreground" />
          Organization Settings
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your organization profile, integrations, members, and permissions.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <div className="sticky top-12 z-20 -mx-4 mb-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:-mx-6 lg:-mx-8">
          <div className="overflow-x-auto px-4 md:px-6 lg:px-8">
            <TabsList className="h-auto w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0 sm:w-full">
              {[
                { value: "general", label: "General", icon: Building2 },
                { value: "integrations", label: "Integrations", icon: Plug },
                { value: "members", label: "Members", icon: Users },
                { value: "billing", label: "Billing", icon: CreditCard },
                { value: "notifications", label: "Notifications", icon: Bell },
                { value: "support", label: "Support", icon: HeadphonesIcon },

              ].map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="relative shrink-0 gap-2 rounded-none border-b-2 border-transparent px-3 py-3 text-xs font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none sm:px-4 sm:text-sm"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* General Tab */}
        <TabsContent value="general" className="mt-0">
          <SettingsGeneral />
        </TabsContent>

        <TabsContent value="integrations" className="mt-0 space-y-4">
          <p className="mb-2 text-sm text-muted-foreground">
            Connect your tools to sync data across the platform. Configurations here apply to all pods.
          </p>

          {integrations.map((integration) => {
            const isExpanded = expandedId === integration.id
            const fields = editFields[integration.id] || {}

            return (
              <Card
                key={integration.id}
                className={`border-border bg-card transition-colors ${
                  isExpanded ? "ring-1 ring-primary/30" : ""
                }`}
              >
                <CardContent className="p-0">
                  {/* Summary row */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(integration.id)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/30"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        integration.status === "connected"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {integration.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <p className="text-sm font-semibold text-foreground">
                          {integration.name}
                        </p>
                        <StatusBadge status={integration.status} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {integration.detail || integration.description}
                      </p>
                    </div>
                    <ExternalLink
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isExpanded ? "rotate-90 text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-border px-5 py-5">
                      <p className="mb-4 text-xs text-muted-foreground">
                        {integration.description}
                      </p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {integration.fields.map((field) => (
                          <div key={field.key} className="space-y-1.5">
                            <Label
                              htmlFor={`${integration.id}-${field.key}`}
                              className="text-xs font-medium text-muted-foreground"
                            >
                              {field.label}
                            </Label>
                            <Input
                              id={`${integration.id}-${field.key}`}
                              placeholder={field.placeholder}
                              value={fields[field.key] ?? field.value}
                              onChange={(e) => updateField(integration.id, field.key, e.target.value)}
                              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                              type={field.key.includes("token") || field.key.includes("key") || field.key.includes("secret") || field.key.includes("pat") ? "password" : "text"}
                            />
                          </div>
                        ))}
                      </div>

                      {/* GitHub Organizations and Repositories Manager */}
                      {integration.id === "github" && integration.status === "connected" && (
                        <div className="mt-6 border-t border-border pt-6">
                          <div className="mb-4 flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-semibold text-foreground">Organizations & Repositories</h4>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Manage GitHub organizations and repositories across all pods
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs"
                              onClick={addGitHubOrg}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Add Organization
                            </Button>
                          </div>

                          <div className="space-y-4">
                            {githubOrgs.map((org) => (
                              <Card key={org.id} className="border-border bg-muted/30">
                                <CardContent className="p-4">
                                  {/* Organization Header */}
                                  <div className="mb-3 flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                      <Github className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                      <Input
                                        placeholder="Organization name (e.g., acme-corp)"
                                        value={org.name}
                                        onChange={(e) => updateGitHubOrg(org.id, "name", e.target.value)}
                                        className="h-8 border-border bg-background text-sm"
                                      />
                                      <Input
                                        placeholder="https://github.com/org-name"
                                        value={org.url}
                                        onChange={(e) => updateGitHubOrg(org.id, "url", e.target.value)}
                                        className="h-8 border-border bg-background text-sm"
                                      />
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                                      onClick={() => removeGitHubOrg(org.id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>

                                  {/* Repositories */}
                                  <div className="ml-11 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        <FolderGit2 className="h-3 w-3" />
                                        Repositories
                                      </Label>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 gap-1 text-xs"
                                        onClick={() => addRepository(org.id)}
                                      >
                                        <Plus className="h-3 w-3" />
                                        Add Repo
                                      </Button>
                                    </div>

                                    {org.repositories.length === 0 ? (
                                      <p className="py-2 text-xs text-muted-foreground">No repositories added</p>
                                    ) : (
                                      <div className="space-y-2">
                                        {org.repositories.map((repo) => (
                                          <div key={repo.id} className="flex items-center gap-2">
                                            <Input
                                              placeholder="Repository name"
                                              value={repo.name}
                                              onChange={(e) => updateRepository(org.id, repo.id, "name", e.target.value)}
                                              className="h-7 flex-1 border-border bg-background text-xs"
                                            />
                                            <Input
                                              placeholder="Repository URL"
                                              value={repo.url}
                                              onChange={(e) => updateRepository(org.id, repo.id, "url", e.target.value)}
                                              className="h-7 flex-1 border-border bg-background text-xs"
                                            />
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                                              onClick={() => removeRepository(org.id, repo.id)}
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                        {integration.status === "connected" ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-400"
                              onClick={() => handleDisconnect(integration.id)}
                            >
                              <Unlink className="h-3.5 w-3.5" />
                              Disconnect
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                              onClick={() => handleConnect(integration.id)}
                            >
                              Save Changes
                            </Button>
                          </>
                        ) : (
                          <>
                            <span />
                            <Button
                              size="sm"
                              className="gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                              onClick={() => handleConnect(integration.id)}
                              disabled={integration.status === "connecting"}
                            >
                              {integration.status === "connecting" ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Link2 className="h-3.5 w-3.5" />
                              )}
                              {integration.status === "connecting" ? "Connecting..." : "Connect"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-0">
          <SettingsMembers />
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="mt-0">
          <SettingsBilling />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-0">
          <SettingsNotifications />
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="mt-0">
          <SettingsSupport />
        </TabsContent>

      </Tabs>
    </div>
  )
}
