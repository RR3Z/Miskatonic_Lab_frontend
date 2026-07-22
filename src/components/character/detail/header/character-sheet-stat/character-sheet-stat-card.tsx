import type { ComponentProps } from "react"

import { cn } from "@/lib/utils/cn.util"

import { characterSheetStatCardClassName } from "./styles/character-sheet-stat.styles"

type CharacterSheetStatCardProps = ComponentProps<"div">

export function CharacterSheetStatCard({
  className,
  ...props
}: CharacterSheetStatCardProps) {
  return (
    <div
      className={cn(characterSheetStatCardClassName, className)}
      data-slot="character-sheet-stat-card"
      {...props}
    />
  )
}
