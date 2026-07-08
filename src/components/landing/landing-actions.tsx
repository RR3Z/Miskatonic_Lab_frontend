import { ArrowRight, PencilLine } from "lucide-react";

import { AuthGateAction } from "@/components/auth/auth-gate-action";
import { landingContent } from "@/lib/content/landing.content";

export function LandingActions() {
  const { openArchive, createInvestigator } = landingContent.caseFile.actions;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <AuthGateAction
        className="h-8 gap-1.5 rounded-[3px] border-[var(--ml-ink-on-paper)] bg-[var(--ml-ink-on-paper)] px-3 font-body text-[0.78rem] text-[var(--ml-surface-paper)] hover:bg-[#2b2519] sm:h-9 sm:gap-2 sm:px-4"
        href={openArchive.href}
        size="sm"
      >
        {openArchive.label}
        <ArrowRight aria-hidden="true" className="size-3.5 sm:size-4" />
      </AuthGateAction>
      <AuthGateAction
        className="h-8 gap-1.5 rounded-[3px] border-[var(--ml-ink-on-paper)] bg-transparent px-3 font-body text-[0.78rem] text-[var(--ml-ink-on-paper)] hover:border-[var(--ml-accent-brass-strong)] hover:bg-[var(--ml-accent-brass-strong)] hover:text-[var(--ml-ink-on-paper)] sm:h-9 sm:gap-2 sm:px-4"
        href={createInvestigator.href}
        size="sm"
        variant="outline"
      >
        <PencilLine aria-hidden="true" className="size-3.5 sm:size-4" />
        {createInvestigator.label}
      </AuthGateAction>
    </div>
  );
}
