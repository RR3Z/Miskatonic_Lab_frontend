import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn.util"

import { characterSheetStatCardClassName } from "./styles/character-sheet-stat.styles"

type CharacterSheetStatButtonProps = ComponentProps<typeof Button>

export function CharacterSheetStatButton({
  className,
  ...props
}: CharacterSheetStatButtonProps) {
  return (
    <Button
      className={cn(
        characterSheetStatCardClassName,
        "cursor-pointer transition-colors hover:border-[var(--ml-border-aged)] hover:bg-[var(--ml-surface-panel-raised)]/45 focus-visible:border-[var(--ml-focus-ring)] focus-visible:outline-none disabled:cursor-wait disabled:opacity-70",
        className,
      )}
      data-slot="character-sheet-stat-card"
      size="content"
      variant="unstyled"
      {...props}
    />
  )
}
