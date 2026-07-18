import { BookOpenCheck } from "lucide-react"

import { GuideExampleCallout } from "@/components/guide/article/guide-example-callout"
import { GuideFormulaCard } from "@/components/guide/article/guide-formula-card"
import { GuideSearchHighlight } from "@/components/guide/article/guide-search-highlight"
import { GuideFlowDiagram } from "@/components/guide/flow-diagram/guide-flow-diagram"
import type { GuideBlock } from "@/data/guide/types/guide-content.types"
import { cn } from "@/lib/utils/cn.util"

type GuideArticleBlockProps = {
  block: GuideBlock
  isMatched: boolean
}

export function GuideArticleBlock({
  block,
  isMatched,
}: GuideArticleBlockProps) {
  return (
    <section
      className="relative scroll-mt-20 overflow-hidden border border-(--ml-border-subtle) bg-(--ml-surface-panel) p-5 transition-colors sm:p-7"
      id={block.id}
    >
      <GuideSearchHighlight active={isMatched} />
      <div className="relative z-10 flex items-center gap-3">
        <BookOpenCheck
          aria-hidden="true"
          className="shrink-0 text-(--ml-surface-paper)"
          size={20}
        />
        <h2 className="min-w-0 font-(family-name:--font-display) text-2xl leading-tight font-semibold text-(--ml-surface-paper) sm:text-3xl">
          {block.title}
        </h2>
      </div>
      <p className="relative z-10 mt-4 max-w-4xl text-base leading-7 text-(--ml-ink-primary)">
        {block.body}
      </p>
      {block.details?.map((detail) => (
        <p
          className="relative z-10 mt-4 max-w-4xl text-base leading-7 text-(--ml-ink-primary)"
          key={detail}
        >
          {detail}
        </p>
      ))}
      {block.bullets ? (
        <ul className="relative z-10 mt-4 grid max-w-4xl gap-2 border-l-2 border-(--ml-border-aged) pl-4 text-(--ml-ink-muted)">
          {block.bullets.map((bullet) => (
            <li className="leading-6" key={bullet}>
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
      {block.example ? <GuideExampleCallout example={block.example} /> : null}
      {block.formulas ? (
        <div
          className={cn(
            "relative z-10 mt-5 grid w-full gap-3",
            block.formulas.length === 1 ? "grid-cols-1" : "lg:grid-cols-2",
          )}
        >
          {block.formulas.map((formula) => (
            <GuideFormulaCard
              formula={formula}
              key={`${formula.title}-${formula.expression}`}
            />
          ))}
        </div>
      ) : null}
      {block.diagram ? (
        <div className="relative z-10 mt-6">
          <GuideFlowDiagram diagram={block.diagram} />
        </div>
      ) : null}
    </section>
  )
}
