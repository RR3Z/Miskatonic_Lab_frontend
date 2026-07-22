import type { GuideFormula } from "@/types/guide-content.types"

type GuideFormulaCardProps = {
  formula: GuideFormula
}

export function GuideFormulaCard({ formula }: GuideFormulaCardProps) {
  return (
    <div className="w-full border border-(--ml-border-aged) bg-(--ml-bg-page)/70 p-4">
      <h3 className="text-sm font-semibold tracking-[0.08em] text-(--ml-accent-brass-strong) uppercase">
        {formula.title}
      </h3>
      <code className="mt-2 block font-(family-name:--font-code) text-base text-(--ml-surface-paper)">
        {formula.expression}
      </code>
      <p className="mt-2 text-sm leading-6 text-(--ml-ink-muted)">
        {formula.description}
      </p>
    </div>
  )
}
