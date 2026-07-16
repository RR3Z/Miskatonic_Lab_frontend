import { Info } from "lucide-react"
import type * as React from "react"

import { CharacterSheetTooltip } from "@/components/character/detail/character-sheet-tooltip"
import { cn } from "@/lib/utils/cn.util"

const DEFAULT_TRIGGER_CLASS_NAME =
  "grid shrink-0 place-items-center rounded-sm opacity-75 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-[var(--ml-focus-ring)]"

export function CharacterInfoTooltip({
  ariaLabel,
  children,
  contentClassName,
  iconClassName,
  scrollAreaClassName,
  scrollable,
  side,
  sideOffset,
  testId,
  triggerClassName,
}: {
  ariaLabel: string
  children: React.ReactNode
  contentClassName?: string
  iconClassName?: string
  scrollAreaClassName?: string
  scrollable?: boolean
  side?: React.ComponentProps<typeof CharacterSheetTooltip>["side"]
  sideOffset?: number
  testId?: string
  triggerClassName?: string
}) {
  return (
    <CharacterSheetTooltip
      contentClassName={contentClassName}
      scrollAreaClassName={scrollAreaClassName}
      scrollable={scrollable}
      side={side}
      sideOffset={sideOffset}
      trigger={
        <button
          aria-label={ariaLabel}
          className={cn(DEFAULT_TRIGGER_CLASS_NAME, triggerClassName)}
          data-testid={testId}
          type="button"
        >
          <Info aria-hidden="true" className={iconClassName} />
        </button>
      }
    >
      {children}
    </CharacterSheetTooltip>
  )
}
