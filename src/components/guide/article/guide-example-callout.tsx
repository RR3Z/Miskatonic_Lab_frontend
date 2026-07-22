import { guideContent } from "@/lib/guide/guide-content"
import type { GuideExample } from "@/types/guide-content.types"

type GuideExampleCalloutProps = {
  example: GuideExample
}

export function GuideExampleCallout({ example }: GuideExampleCalloutProps) {
  return (
    <aside className="relative z-10 mt-5 max-w-4xl border-l-2 border-(--ml-accent-brass-strong) bg-(--ml-bg-page)/60 px-4 py-3">
      <h3 className="font-(family-name:--font-display) text-lg font-semibold text-(--ml-accent-brass-strong)">
        {guideContent.ui.article.examplePrefix} {example.title}
      </h3>
      <p className="mt-1 leading-6 text-(--ml-ink-muted)">{example.outcome}</p>
    </aside>
  )
}
