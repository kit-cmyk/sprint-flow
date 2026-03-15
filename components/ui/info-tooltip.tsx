"use client"

import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function InfoTooltip({ text }: { text: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="ml-1.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="More information"
          >
            <Info className="h-2.5 w-2.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[260px] text-xs leading-relaxed"
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
