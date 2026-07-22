import type { GuideFlowStep } from "@/types/guide-content.types"

type GuideFlowStepCardProps = GuideFlowStep

export function GuideFlowStepCard({ detail, label }: GuideFlowStepCardProps) {
  return (
    <div className="h-full min-w-0 border border-(--ml-border-aged) bg-(--ml-bg-page)/80 px-3 py-3 shadow-[inset_0_0_0_1px_rgba(222,209,163,0.04)]">
      <span className="font-(family-name:--font-display) text-lg font-semibold text-(--ml-accent-brass-strong)">
        {label}
      </span>
      {detail ? (
        <span className="mt-1 block text-sm leading-snug text-(--ml-ink-muted)">
          {detail}
        </span>
      ) : null}
    </div>
  )
}
