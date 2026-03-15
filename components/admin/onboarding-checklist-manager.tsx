"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Phone,
  Search,
  FolderOpen,
  Network,
  ClipboardList,
  Rocket,
  GripVertical,
  Trash2,
  Plus,
  Pencil,
  Save,
  X,
} from "lucide-react"

const iconOptions = [
  { value: "Phone", label: "Phone", Icon: Phone },
  { value: "Search", label: "Search", Icon: Search },
  { value: "FolderOpen", label: "Folder", Icon: FolderOpen },
  { value: "Network", label: "Network", Icon: Network },
  { value: "ClipboardList", label: "Clipboard", Icon: ClipboardList },
  { value: "Rocket", label: "Rocket", Icon: Rocket },
]

interface ChecklistStep {
  id: string
  label: string
  description: string
  iconValue: string
}

const initialSteps: ChecklistStep[] = [
  {
    id: "1",
    label: "Kickoff Call",
    description: "Set goals and communication channel with the team.",
    iconValue: "Phone",
  },
  {
    id: "2",
    label: "Product Discovery",
    description: "Deep dive into your product vision and requirements.",
    iconValue: "Search",
  },
  {
    id: "3",
    label: "Access",
    description: "Access and review existing technical assets.",
    iconValue: "FolderOpen",
  },
  {
    id: "4",
    label: "Architecture Review",
    description: "Architectural planning and technical feasibility review.",
    iconValue: "Network",
  },
  {
    id: "5",
    label: "Backlog Creation",
    description: "Build and prioritize the product backlog.",
    iconValue: "ClipboardList",
  },
  {
    id: "6",
    label: "Start Sprint",
    description: "Development begins with your first sprint cycle.",
    iconValue: "Rocket",
  },
]

export function OnboardingChecklistManager() {
  const [steps, setSteps] = useState<ChecklistStep[]>(initialSteps)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingStep, setEditingStep] = useState<ChecklistStep | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleAddStep = () => {
    const newStep: ChecklistStep = {
      id: Date.now().toString(),
      label: "New Step",
      description: "Add a description for this step",
      iconValue: "ClipboardList",
    }
    setSteps([...steps, newStep])
    setEditingId(newStep.id)
    setEditingStep(newStep)
  }

  const handleEditStep = (step: ChecklistStep) => {
    setEditingId(step.id)
    setEditingStep({ ...step })
  }

  const handleSaveStep = () => {
    if (!editingStep) return
    setSteps(steps.map((s) => (s.id === editingStep.id ? editingStep : s)))
    setEditingId(null)
    setEditingStep(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingStep(null)
  }

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setEditingStep(null)
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newSteps = [...steps]
    const draggedStep = newSteps[draggedIndex]
    newSteps.splice(draggedIndex, 1)
    newSteps.splice(index, 0, draggedStep)
    
    setSteps(newSteps)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const getIconComponent = (iconValue: string) => {
    const iconOption = iconOptions.find((opt) => opt.value === iconValue)
    return iconOption ? iconOption.Icon : ClipboardList
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Customize the onboarding checklist shown to new clients in their portal.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Drag steps to reorder, edit content, or add new steps.
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleAddStep}
          className="gap-1.5 bg-primary text-xs hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Step
        </Button>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => {
          const isEditing = editingId === step.id
          const IconComponent = getIconComponent(step.iconValue)

          return (
            <Card
              key={step.id}
              draggable={!isEditing}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`border-border bg-card transition-colors ${
                isEditing ? "ring-1 ring-primary/30" : "cursor-move hover:bg-muted/30"
              } ${draggedIndex === index ? "opacity-50" : ""}`}
            >
              <CardContent className="p-4">
                {isEditing && editingStep ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="step-label" className="text-xs font-medium text-muted-foreground">
                        Step Label
                      </Label>
                      <Input
                        id="step-label"
                        value={editingStep.label}
                        onChange={(e) =>
                          setEditingStep({ ...editingStep, label: e.target.value })
                        }
                        className="border-border bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="step-description" className="text-xs font-medium text-muted-foreground">
                        Description
                      </Label>
                      <Input
                        id="step-description"
                        value={editingStep.description}
                        onChange={(e) =>
                          setEditingStep({ ...editingStep, description: e.target.value })
                        }
                        className="border-border bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="step-icon" className="text-xs font-medium text-muted-foreground">
                        Icon
                      </Label>
                      <select
                        id="step-icon"
                        value={editingStep.iconValue}
                        onChange={(e) =>
                          setEditingStep({ ...editingStep, iconValue: e.target.value })
                        }
                        className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {iconOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="gap-1.5 text-xs"
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveStep}
                        className="gap-1.5 bg-primary text-xs hover:bg-primary/90"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{step.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStep(step)}
                        className="h-7 w-7 p-0 hover:bg-primary/10"
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStep(step.id)}
                        className="h-7 w-7 p-0 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {steps.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">No Steps Added</h3>
            <p className="mb-4 max-w-md text-sm text-muted-foreground">
              Start building your client onboarding checklist by adding steps.
            </p>
            <Button
              size="sm"
              onClick={handleAddStep}
              className="gap-1.5 bg-primary text-xs hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add First Step
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
