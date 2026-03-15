"use client"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FolderKanban,
  Search,
  CheckCircle2,
  Loader2,
  CreditCard,
  Building2,
  Mail,
  MapPin,
  Github,
  ExternalLink,
  AlertCircle,
  LogIn,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

/* ── main component ──────────────────────────────────────── */
export function AddPodModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [podName, setPodName] = useState("")
  const [jiraLink, setJiraLink] = useState("")
  const [githubLink, setGithubLink] = useState("")
  const [stripeQuery, setStripeQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<StripeCustomer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<StripeCustomer | null>(null)
  const [created, setCreated] = useState(false)
  
  // Authentication states
  const [jiraAuthenticated, setJiraAuthenticated] = useState(false)
  const [githubAuthenticated, setGithubAuthenticated] = useState(false)
  const [jiraAuthenticating, setJiraAuthenticating] = useState(false)
  const [githubAuthenticating, setGithubAuthenticating] = useState(false)

  const resetState = useCallback(() => {
    setPodName("")
    setJiraLink("")
    setGithubLink("")
    setStripeQuery("")
    setSearching(false)
    setSearchResults([])
    setShowResults(false)
    setSelectedCustomer(null)
    setCreated(false)
    setJiraAuthenticated(false)
    setGithubAuthenticated(false)
    setJiraAuthenticating(false)
    setGithubAuthenticating(false)
  }, [])

  function handleOpenChange(next: boolean) {
    if (!next) resetState()
    onOpenChange(next)
  }

  /* Simulate Stripe customer search */
  function handleStripeSearch() {
    if (!stripeQuery.trim()) return
    setSearching(true)
    setShowResults(false)
    setSelectedCustomer(null)
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
    setStripeQuery(customer.name)
  }

  /* Simulate Jira OAuth login */
  function handleJiraLogin() {
    setJiraAuthenticating(true)
    // Simulate OAuth redirect and callback
    setTimeout(() => {
      setJiraAuthenticated(true)
      setJiraAuthenticating(false)
    }, 1500)
  }

  /* Simulate GitHub OAuth login */
  function handleGithubLogin() {
    setGithubAuthenticating(true)
    // Simulate OAuth redirect and callback
    setTimeout(() => {
      setGithubAuthenticated(true)
      setGithubAuthenticating(false)
    }, 1500)
  }

  function handleCreate() {
    setCreated(true)
    setTimeout(() => {
      handleOpenChange(false)
    }, 1500)
  }

  const displayName = podName.trim()
    ? `${podName.trim()} Pod`
    : ""

  const canCreate = podName.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg border-border bg-card sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <FolderKanban className="h-4 w-4 text-primary" />
            </div>
            Create New Pod
          </DialogTitle>
          <DialogDescription>
            Set up a new project pod. Only the name is required &mdash; you can configure integrations later in Pod Settings.
          </DialogDescription>
        </DialogHeader>

        {created ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {displayName} created successfully
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedCustomer
                ? <>Linked to {selectedCustomer.name} &middot; {selectedCustomer.plan} plan</>
                : "You can configure integrations in Pod Settings"
              }
            </p>
          </div>
        ) : (
          <>
            {/* Pod Name */}
            <div className="space-y-2">
              <Label htmlFor="pod-name" className="text-xs font-medium text-foreground">
                Pod Name
              </Label>
              <div className="relative">
                <Input
                  id="pod-name"
                  placeholder='e.g. "Momentum"'
                  value={podName}
                  onChange={(e) => setPodName(e.target.value)}
                  className="border-border bg-background pr-16 text-foreground placeholder:text-muted-foreground"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  Pod
                </span>
              </div>
              {displayName && (
                <p className="text-xs text-muted-foreground">
                  Will be created as: <span className="font-medium text-foreground">{displayName}</span>
                </p>
              )}
            </div>

            {/* Jira + GitHub links with authentication */}
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">
                Integrations
                <span className="ml-1 text-[10px] text-muted-foreground/60">(optional)</span>
              </Label>
              
              {/* Jira Integration */}
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Jira</span>
                  </div>
                  {jiraAuthenticated ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span className="text-[10px] font-medium text-emerald-500">Connected</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1.5 border-border px-2 text-xs"
                      onClick={handleJiraLogin}
                      disabled={jiraAuthenticating}
                    >
                      {jiraAuthenticating ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <LogIn className="h-3 w-3" />
                      )}
                      {jiraAuthenticating ? "Connecting..." : "Login to Jira"}
                    </Button>
                  )}
                </div>
                
                {!jiraAuthenticated ? (
                  <Alert className="border-amber-500/20 bg-amber-500/5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    <AlertDescription className="text-xs text-muted-foreground">
                      Login to Jira to link a project and sync issues automatically
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Input
                    id="jira-link"
                    placeholder="https://org.atlassian.net/projects/PROJ"
                    value={jiraLink}
                    onChange={(e) => setJiraLink(e.target.value)}
                    className="h-8 border-border bg-background text-sm text-foreground placeholder:text-muted-foreground"
                  />
                )}
              </div>

              {/* GitHub Integration */}
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">GitHub</span>
                  </div>
                  {githubAuthenticated ? (
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span className="text-[10px] font-medium text-emerald-500">Connected</span>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1.5 border-border px-2 text-xs"
                      onClick={handleGithubLogin}
                      disabled={githubAuthenticating}
                    >
                      {githubAuthenticating ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <LogIn className="h-3 w-3" />
                      )}
                      {githubAuthenticating ? "Connecting..." : "Login to GitHub"}
                    </Button>
                  )}
                </div>
                
                {!githubAuthenticated ? (
                  <Alert className="border-amber-500/20 bg-amber-500/5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    <AlertDescription className="text-xs text-muted-foreground">
                      Login to GitHub to link a repository and sync pull requests
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Input
                    id="github-link"
                    placeholder="https://github.com/org/repo"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="h-8 border-border bg-background text-sm text-foreground placeholder:text-muted-foreground"
                  />
                )}
              </div>
            </div>

            {/* Stripe Customer Search */}
            <div className="space-y-2">
              <Label htmlFor="stripe-search" className="text-xs font-medium text-muted-foreground">
                Link Stripe Customer
                <span className="ml-1 text-[10px] text-muted-foreground/60">(optional)</span>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="stripe-search"
                    placeholder="Search by name, email, or customer ID..."
                    value={stripeQuery}
                    onChange={(e) => {
                      setStripeQuery(e.target.value)
                      if (selectedCustomer) setSelectedCustomer(null)
                    }}
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
              </div>

              {/* Search results dropdown */}
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

              {/* Selected customer autofill card */}
              {selectedCustomer && (
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
                  <div className="grid grid-cols-2 gap-3">
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
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                className="border-border"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!canCreate}
                onClick={handleCreate}
              >
                <FolderKanban className="h-3.5 w-3.5" />
                Create Pod
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
