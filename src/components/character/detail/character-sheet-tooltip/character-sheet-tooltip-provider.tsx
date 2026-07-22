import type { ReactNode } from "react"

import { TooltipProvider } from "@/components/ui/tooltip/tooltip-provider"

type CharacterSheetTooltipProviderProps = { children: ReactNode }

export function CharacterSheetTooltipProvider({
  children,
}: CharacterSheetTooltipProviderProps) {
  return <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
}
