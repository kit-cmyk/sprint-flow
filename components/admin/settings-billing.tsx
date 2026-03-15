"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Download,
  Pencil,
  X,
  Check,
} from "lucide-react"

/* ── Mock data ───────────────────────────────────────────────── */
const currentPlan = {
  name: "Business",
  price: "$299",
  cycle: "per month",
  seats: 25,
  seatsUsed: 18,
  renewalDate: "April 6, 2026",
  status: "active" as const,
}

const invoices = [
  { id: "INV-2026-03", date: "Mar 1, 2026", amount: "$299.00", status: "paid" },
  { id: "INV-2026-02", date: "Feb 1, 2026", amount: "$299.00", status: "paid" },
  { id: "INV-2026-01", date: "Jan 1, 2026", amount: "$299.00", status: "paid" },
  { id: "INV-2025-12", date: "Dec 1, 2025", amount: "$299.00", status: "paid" },
  { id: "INV-2025-11", date: "Nov 1, 2025", amount: "$299.00", status: "paid" },
]

const paymentMethod = {
  brand: "Visa",
  last4: "4242",
  expiry: "08 / 27",
  name: "Alex Rivera",
}

export function SettingsBilling() {
  const [editingCard, setEditingCard] = useState(false)
  const [saved, setSaved] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)

  /* draft state for payment method */
  const [draft, setDraft] = useState({
    name: paymentMethod.name,
    number: "",
    expiry: "",
    cvc: "",
  })

  const handleSave = () => {
    setEditingCard(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleCancel = () => {
    setEditingCard(false)
    setDraft({ name: paymentMethod.name, number: "", expiry: "", cvc: "" })
  }

  const seatsPercent = Math.round((currentPlan.seatsUsed / currentPlan.seats) * 100)

  return (
    <div className="flex flex-col gap-6">

      {/* ── Current Plan ─────────────────────────────────────────── */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-foreground">Current Plan</h3>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
              Upgrade Plan
            </Button>
          </div>

          <div className="flex flex-wrap items-start gap-6">
            {/* Plan name + price */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xl font-bold text-foreground">{currentPlan.name}</span>
              <span className="text-xs text-muted-foreground">
                {currentPlan.price}{" "}
                <span className="text-muted-foreground/60">{currentPlan.cycle}</span>
              </span>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Status</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Active
              </span>
            </div>

            {/* Renewal */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Renews</span>
              <span className="text-xs text-foreground">{currentPlan.renewalDate}</span>
            </div>
          </div>

          {/* Seat usage */}
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Seats used</span>
              <span className="font-medium text-foreground">
                {currentPlan.seatsUsed} / {currentPlan.seats}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${
                  seatsPercent >= 90 ? "bg-red-500" : seatsPercent >= 70 ? "bg-amber-500" : "bg-primary"
                }`}
                style={{ width: `${seatsPercent}%` }}
              />
            </div>
          </div>

          {/* Cancel plan */}
          <div className="mt-5 border-t border-border pt-4">
            <button
              onClick={() => setCancelOpen(true)}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
            >
              Cancel subscription
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ── Payment Method ───────────────────────────────────────── */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-foreground">Payment Method</h3>
            {!editingCard ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setEditingCard(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {saved && (
                  <span className="flex items-center gap-1 text-xs text-emerald-500">
                    <Check className="h-3.5 w-3.5" /> Saved
                  </span>
                )}
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={handleCancel}>
                  <X className="h-3.5 w-3.5" /> Cancel
                </Button>
                <Button size="sm" className="h-7 gap-1 text-xs" onClick={handleSave}>
                  <Check className="h-3.5 w-3.5" /> Save
                </Button>
              </div>
            )}
          </div>

          {!editingCard ? (
            /* Read-only card display */
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
              <CreditCard className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-foreground">
                  {paymentMethod.brand} ending in {paymentMethod.last4}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Expires {paymentMethod.expiry} · {paymentMethod.name}
                </span>
              </div>
            </div>
          ) : (
            /* Edit form */
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="card-name" className="text-xs text-muted-foreground">Name on Card</Label>
                <Input
                  id="card-name"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  className="border-border bg-background text-foreground"
                  placeholder="Alex Rivera"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="card-number" className="text-xs text-muted-foreground">Card Number</Label>
                <Input
                  id="card-number"
                  value={draft.number}
                  onChange={(e) => setDraft((d) => ({ ...d, number: e.target.value }))}
                  className="border-border bg-background text-foreground"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="card-expiry" className="text-xs text-muted-foreground">Expiry</Label>
                <Input
                  id="card-expiry"
                  value={draft.expiry}
                  onChange={(e) => setDraft((d) => ({ ...d, expiry: e.target.value }))}
                  className="border-border bg-background text-foreground"
                  placeholder="MM / YY"
                  maxLength={7}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="card-cvc" className="text-xs text-muted-foreground">CVC</Label>
                <Input
                  id="card-cvc"
                  value={draft.cvc}
                  onChange={(e) => setDraft((d) => ({ ...d, cvc: e.target.value }))}
                  className="border-border bg-background text-foreground"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Billing History ──────────────────────────────────────── */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Billing History</h3>
          <div className="flex flex-col divide-y divide-border/50">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-foreground">{inv.id}</span>
                  <span className="text-[11px] text-muted-foreground">{inv.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-foreground">{inv.amount}</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-500">
                    <CheckCircle2 className="h-3 w-3" />
                    Paid
                  </span>
                  <button className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Cancel Subscription
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Cancelling will end your{" "}
            <strong className="text-foreground">Business</strong> plan on{" "}
            <strong className="text-foreground">{currentPlan.renewalDate}</strong>. Your team
            will lose access to all features at that date. This cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setCancelOpen(false)}>
              Keep Plan
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setCancelOpen(false)}>
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
