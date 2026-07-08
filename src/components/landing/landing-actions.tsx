import { ArrowRight, PencilLine } from "lucide-react"

import { AuthGateAction } from "@/components/auth/auth-gate-action"
import { landingContent } from "@/lib/content/landing.content"

export function LandingActions() {
  const { openArchive, createInvestigator } = landingContent.caseFile.actions

  return (
    <div className="flex items-center gap-3">
      <AuthGateAction
        className="sm:h-9 sm:gap-2 sm:px-4"
        href={openArchive.href}
      >
        {openArchive.label}
        <ArrowRight aria-hidden="true" className="size-3.5 sm:size-4" />
      </AuthGateAction>
      <AuthGateAction
        className="sm:h-9 sm:gap-2 sm:px-4"
        href={createInvestigator.href}
        variant="outline"
      >
        <PencilLine aria-hidden="true" className="size-3.5 sm:size-4" />
        {createInvestigator.label}
      </AuthGateAction>
    </div>
  )
}
