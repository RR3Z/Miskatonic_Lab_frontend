import type * as React from "react"

import { cn } from "@/lib/utils/cn.util"

const statCardClassName =
  "min-h-0 min-w-0 overflow-hidden rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/25 text-center"

function CharacterSheetStatCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="character-sheet-stat-card"
      className={cn(statCardClassName, className)}
      {...props}
    />
  )
}

function CharacterSheetStatButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="character-sheet-stat-card"
      className={cn(
        statCardClassName,
        "cursor-pointer transition-colors hover:border-[var(--ml-border-aged)] hover:bg-[var(--ml-surface-panel-raised)]/45 focus-visible:border-[var(--ml-focus-ring)] focus-visible:outline-none disabled:cursor-wait disabled:opacity-70",
        className,
      )}
      {...props}
    />
  )
}

export { CharacterSheetStatButton, CharacterSheetStatCard }
