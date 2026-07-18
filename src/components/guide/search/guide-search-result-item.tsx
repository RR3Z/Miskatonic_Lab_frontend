"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { guideSearchStyles } from "@/components/guide/search/styles/guide-search.styles"
import { getGuideSearchResultHref } from "@/components/guide/utils/guide-route.util"
import type { GuideSearchResult } from "@/data/guide/types/guide-content.types"

type GuideSearchResultItemProps = {
  index: number
  onNavigate: () => void
  query: string
  result: GuideSearchResult
}

export function GuideSearchResultItem({
  index,
  onNavigate,
  query,
  result,
}: GuideSearchResultItemProps) {
  return (
    <motion.li
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -6 }}
      transition={{ delay: index * 0.025, duration: 0.14 }}
    >
      <Link
        className={guideSearchStyles.result}
        href={getGuideSearchResultHref(result, query)}
        onClick={onNavigate}
      >
        <span className="text-xs font-semibold tracking-[0.12em] text-(--ml-accent-brass-strong) uppercase">
          {result.sectionTitle}
        </span>
        <span className="mt-1 block font-(family-name:--font-display) text-base font-semibold text-(--ml-surface-paper) transition-colors group-hover:text-(--ml-accent-brass-strong)">
          {result.title}
        </span>
        <span className="mt-1 line-clamp-2 block text-sm leading-5 text-(--ml-ink-muted)">
          {result.excerpt}
        </span>
      </Link>
    </motion.li>
  )
}
