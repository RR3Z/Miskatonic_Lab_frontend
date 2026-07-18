import { GuideSymbol } from "@/components/guide/symbol/guide-symbol"
import { guideContent } from "@/data/guide/guide-content.data"
import type { GuideSection } from "@/data/guide/types/guide-content.types"

type GuideArticleHeaderProps = {
  section: GuideSection
}

export function GuideArticleHeader({ section }: GuideArticleHeaderProps) {
  return (
    <header className="relative isolate min-h-64 overflow-hidden border border-(--ml-border-aged) bg-(--ml-surface-panel) px-5 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.24)] sm:min-h-72 sm:px-8 sm:py-10">
      <GuideSymbol
        alt=""
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover opacity-60"
        priority
        symbol={section.symbol}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--ml-surface-panel)_0%,rgba(30,26,23,0.93)_38%,rgba(30,26,23,0.48)_70%,rgba(30,26,23,0.22)_100%)]" />
      <div className="relative z-10 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-(--ml-accent-brass-strong) uppercase">
          {guideContent.ui.article.eyebrow}
        </p>
        <h1 className="mt-3 font-(family-name:--font-display) text-4xl leading-none font-semibold text-(--ml-surface-paper) sm:text-5xl">
          {section.title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-(--ml-ink-muted) sm:text-lg">
          {section.description}
        </p>
      </div>
    </header>
  )
}
