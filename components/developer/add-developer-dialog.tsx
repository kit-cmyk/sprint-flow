"use client"

import { useState } from "react"
import { Plus, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type AllocationUnit = "percentage" | "story_points" | "hours"

interface PodAllocation {
  id: string
  podName: string
  value: string
}

const ROLES = [
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "QA Engineer",
  "Product Designer",
  "Scrum Master",
]

const PODS = [
  "Momentum Pod",
  "Atlas Pod",
  "Forge Pod",
  "Horizon Pod",
  "Vertex Pod",
]

const UNIT_OPTIONS: { value: AllocationUnit; label: string; short: string; placeholder: string }[] = [
  { value: "percentage",    label: "Percentage (%)",  short: "%",  placeholder: "e.g. 50"  },
  { value: "story_points",  label: "Story Points",    short: "SP", placeholder: "e.g. 20"  },
  { value: "hours",         label: "Hours",           short: "hrs",placeholder: "e.g. 16"  },
]

const EMPTY_ALLOC = (): PodAllocation => ({ id: String(Date.now()), podName: "", value: "" })

export function AddDeveloperDialog() {
  const [open, setOpen]                 = useState(false)
  const [name, setName]                 = useState("")
  const [email, setEmail]               = useState("")
  const [role, setRole]                 = useState("")
  const [wipLimit, setWipLimit]         = useState("3")
  const [unit, setUnit]                 = useState<AllocationUnit>("percentage")
  const [allocations, setAllocations]   = useState<PodAllocation[]>([EMPTY_ALLOC()])

  const selectedUnit = UNIT_OPTIONS.find((u) => u.value === unit)!

  const addRow = () => setAllocations((p) => [...p, EMPTY_ALLOC()])

  const removeRow = (id: string) =>
    setAllocations((p) => p.filter((a) => a.id !== id))

  const updateRow = (id: string, field: keyof PodAllocation, val: string) =>
    setAllocations((p) => p.map((a) => (a.id === id ? { ...a, [field]: val } : a)))

  const isValid =
    name.trim() !== "" &&
    role !== "" &&
    allocations.length > 0 &&
    allocations.every((a) => a.podName !== "" && a.value !== "")

  const handleSubmit = () => {
    // In a real app this would persist to the backend
    setOpen(false)
    setName("")
    setEmail("")
    setRole("")
    setWipLimit("3")
    setUnit("percentage")
    setAllocations([EMPTY_ALLOC()])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Developer
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Developer to Team Pod</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="dev-name">Full Name</Label>
            <Input
              id="dev-name"
              placeholder="e.g. Jordan Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="dev-email">Email</Label>
            <Input
              id="dev-email"
              type="email"
              placeholder="e.g. jordan@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* WIP Limit */}
          <div className="space-y-1.5">
            <Label htmlFor="dev-wip">WIP Limit</Label>
            <Input
              id="dev-wip"
              type="number"
              min={1}
              max={20}
              value={wipLimit}
              onChange={(e) => setWipLimit(e.target.value)}
              className="w-28"
            />
          </div>

          {/* Allocation unit */}
          <div className="space-y-1.5">
            <Label>Allocation Unit</Label>
            <div className="flex gap-2">
              {UNIT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setUnit(opt.value)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    unit === opt.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pod allocations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Pod Allocations</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={addRow}
              >
                <Plus className="h-3 w-3" />
                Add Pod
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {allocations.map((alloc) => (
                <div key={alloc.id} className="flex items-center gap-2">
                  <Select
                    value={alloc.podName}
                    onValueChange={(v) => updateRow(alloc.id, "podName", v)}
                  >
                    <SelectTrigger className="flex-1 text-sm">
                      <SelectValue placeholder="Select pod" />
                    </SelectTrigger>
                    <SelectContent>
                      {PODS.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="relative w-28 shrink-0">
                    <Input
                      type="number"
                      min={0}
                      placeholder={selectedUnit.placeholder}
                      value={alloc.value}
                      onChange={(e) => updateRow(alloc.id, "value", e.target.value)}
                      className="pr-9 text-sm"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground">
                      {selectedUnit.short}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeRow(alloc.id)}
                    disabled={allocations.length === 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Add Developer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
