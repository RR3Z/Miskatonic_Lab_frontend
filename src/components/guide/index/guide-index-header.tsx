import { FileSearch } from "lucide-react"

import { GuideSymbol } from "@/components/guide/symbol/guide-symbol"
import { guideContent } from "@/lib/guide/guide-content"

export function GuideIndexHeader() {
  const { index } = guideContent.ui

  return (
    <header className="relative isolate min-h-72 overflow-hidden border border-(--ml-border-aged) bg-(--ml-surface-panel) px-5 py-9 shadow-[0_18px_60px_rgba(0,0,0,0.24)] sm:min-h-80 sm:px-8 sm:py-12">
      <GuideSymbol
        alt=""
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover opacity-55"
        priority
        symbol="occult"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--ml-surface-panel)_0%,rgba(30,26,23,0.92)_35%,rgba(30,26,23,0.4)_68%,rgba(30,26,23,0.22)_100%)]" />
      <div className="relative z-10 max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-(--ml-accent-brass-strong) uppercase">
          {index.eyebrow}
        </p>
        <h1 className="mt-3 font-(family-name:--font-display) text-4xl leading-none font-semibold text-(--ml-surface-paper) sm:text-6xl">
          {index.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-(--ml-ink-muted) sm:text-lg">
          {index.description}
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm text-(--ml-accent-brass-strong)">
          <FileSearch aria-hidden="true" size={18} />
          {index.searchHint}
        </div>
      </div>
    </header>
  )
}
