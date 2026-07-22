import { ArrowDown, ArrowRight } from "lucide-react"

import { GuideFlowStepCard } from "@/components/guide/flow-diagram/guide-flow-step-card"
import type { GuideFlowDiagram as GuideFlowDiagramData } from "@/types/guide-content.types"

type GuideFlowDiagramProps = {
  diagram: GuideFlowDiagramData
}

export function GuideFlowDiagram({ diagram }: GuideFlowDiagramProps) {
  const stepCount = diagram.steps.length

  return (
    <figure
      aria-label={diagram.ariaLabel}
      className="relative overflow-hidden border border-(--ml-border-aged) bg-[linear-gradient(135deg,rgba(182,163,103,0.09),transparent_45%),var(--ml-surface-panel)] p-4 sm:p-5"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(182,163,103,0.24)_1px,transparent_0)] [background-size:16px_16px]"
      />
      <figcaption className="relative font-(family-name:--font-display) text-xl font-semibold text-(--ml-surface-paper)">
        {diagram.title}
      </figcaption>

      <ol className="relative mt-4 flex flex-col lg:hidden">
        {diagram.steps.map((step, index) => (
          <li className="flex flex-col items-stretch" key={step.label}>
            <GuideFlowStepCard {...step} />
            {index < stepCount - 1 ? (
              <div className="flex h-8 items-center justify-center text-(--ml-accent-brass-strong)">
                <ArrowDown aria-hidden="true" size={20} />
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      <ol
        className="relative mt-4 hidden items-stretch gap-0 lg:grid"
        style={{
          gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))`,
        }}
      >
        {diagram.steps.map((step) => (
          <li className="min-w-0" key={step.label}>
            <GuideFlowStepCard {...step} />
          </li>
        ))}
        {diagram.steps.slice(0, -1).map((step, index) => (
          <ArrowRight
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-(--ml-surface-panel) px-1 text-(--ml-accent-brass-strong)"
            key={`${step.label}-arrow`}
            size={22}
            style={{ left: `${((index + 1) / stepCount) * 100}%` }}
          />
        ))}
      </ol>
    </figure>
  )
}
