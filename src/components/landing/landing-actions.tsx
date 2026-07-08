import { ArrowRight, PencilLine } from "lucide-react"

import { AuthGateAction } from "@/components/auth/auth-gate-action"
import { landingContent } from "@/lib/content/landing.content"
import { cn } from "@/lib/utils/cn.util"

type LandingActionsProps = {
  actionClassName?: string
  className?: string
}

export function LandingActions({
  actionClassName,
  className,
}: LandingActionsProps) {
  const { openArchive, createInvestigator } = landingContent.caseFile.actions

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <AuthGateAction
        className={cn("sm:h-9 sm:gap-2 sm:px-4", actionClassName)}
        href={openArchive.href}
      >
        {openArchive.label}
        <ArrowRight aria-hidden="true" className="size-3.5 sm:size-4" />
      </AuthGateAction>
      <AuthGateAction
        className={cn("sm:h-9 sm:gap-2 sm:px-4", actionClassName)}
        href={createInvestigator.href}
        variant="outline"
      >
        <PencilLine aria-hidden="true" className="size-3.5 sm:size-4" />
        {createInvestigator.label}
      </AuthGateAction>
    </div>
  )
}
