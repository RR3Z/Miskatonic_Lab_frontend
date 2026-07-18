import { render } from "@testing-library/react"
import type { ReactNode } from "react"

import { SiteShell } from "@/components/layout/site-shell"
import { TooltipProvider } from "@/components/ui/tooltip"

export function renderWithSiteShell(ui: ReactNode) {
  return render(
    <TooltipProvider>
      <SiteShell>{ui}</SiteShell>
    </TooltipProvider>,
  )
}

export function getSidebarTrigger(container: ParentNode = document) {
  const trigger = container.querySelector<HTMLButtonElement>(
    '[data-sidebar="trigger"]',
  )

  if (!trigger) {
    throw new Error("Sidebar trigger was not rendered")
  }

  return trigger
}
