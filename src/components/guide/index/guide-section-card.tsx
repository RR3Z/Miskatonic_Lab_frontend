import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { GuideSymbol } from "@/components/guide/symbol/guide-symbol"
import { guideContent } from "@/data/guide/guide-content.data"
import type { GuideSection } from "@/data/guide/types/guide-content.types"
import { appRoutes } from "@/lib/routes/app-routes"

type GuideSectionCardProps = {
  section: GuideSection
}

export function GuideSectionCard({ section }: GuideSectionCardProps) {
  return (
    <Link
      className="group relative min-h-52 overflow-hidden border border-(--ml-border-subtle) bg-(--ml-surface-panel) p-5 transition-colors hover:border-(--ml-accent-brass-strong) hover:bg-(--ml-surface-panel-raised) sm:p-6"
      href={appRoutes.guideSection(section.slug)}
    >
      <GuideSymbol
        alt=""
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover opacity-48 transition-opacity group-hover:opacity-62"
        symbol={section.symbol}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(30,26,23,0.96)_0%,rgba(30,26,23,0.84)_38%,rgba(30,26,23,0.36)_72%,rgba(30,26,23,0.16)_100%)]" />
      <div className="relative z-10 max-w-[58%]">
        <h2 className="font-(family-name:--font-display) text-2xl font-semibold text-(--ml-surface-paper)">
          {section.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-(--ml-ink-muted)">
          {section.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-(--ml-accent-brass-strong)">
          {guideContent.ui.index.openLabel}{" "}
          <ArrowRight aria-hidden="true" size={16} />
        </span>
      </div>
    </Link>
  )
}
