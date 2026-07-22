import type { ComponentProps, ReactElement, ReactNode } from "react"

import { Tooltip } from "@/components/ui/tooltip/tooltip"
import { TooltipContent } from "@/components/ui/tooltip/tooltip-content"
import { TooltipTrigger } from "@/components/ui/tooltip/tooltip-trigger"
import { cn } from "@/lib/utils/cn.util"

type CharacterSheetTooltipProps = {
  children: ReactNode
  contentClassName?: string
  scrollAreaClassName?: string
  scrollable?: boolean
  side?: ComponentProps<typeof TooltipContent>["side"]
  sideOffset?: number
  trigger: ReactElement
}

export function CharacterSheetTooltip({
  children,
  contentClassName,
  scrollAreaClassName,
  scrollable = false,
  side = "bottom",
  sideOffset = 6,
  trigger,
}: CharacterSheetTooltipProps) {
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
