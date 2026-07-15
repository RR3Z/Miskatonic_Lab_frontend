import type * as React from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils/cn.util"

export function CharacterSheetTooltipProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
}

export function CharacterSheetTooltip({
  children,
  contentClassName,
  scrollAreaClassName,
  scrollable = false,
  side = "bottom",
  sideOffset = 6,
  trigger,
}: {
  children: React.ReactNode
  contentClassName?: string
  scrollAreaClassName?: string
  scrollable?: boolean
  side?: React.ComponentProps<typeof TooltipContent>["side"]
  sideOffset?: number
  trigger: React.ReactElement
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent
        className={cn(
          "flex max-w-90 flex-col items-start gap-2 border border-[#5d5231] bg-[#171411] p-3 text-left text-[#d9d2c5] shadow-[0_14px_40px_rgba(0,0,0,0.55)] [&>span>svg]:bg-[#171411] [&>span>svg]:fill-[#171411]",
          contentClassName,
        )}
        scrollAreaClassName={scrollAreaClassName}
        scrollable={scrollable}
        side={side}
        sideOffset={sideOffset}
      >
        {children}
      </TooltipContent>
    </Tooltip>
  )
}
