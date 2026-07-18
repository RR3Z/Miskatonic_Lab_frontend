import { AnimatePresence, motion } from "motion/react"

import { GuideSearchEmptyState } from "@/components/guide/search/guide-search-empty-state"
import { GuideSearchResultItem } from "@/components/guide/search/guide-search-result-item"
import { guideSearchStyles } from "@/components/guide/search/styles/guide-search.styles"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GuideSearchResult } from "@/data/guide/types/guide-content.types"

type GuideSearchResultsProps = {
  isOpen: boolean
  onNavigate: () => void
  query: string
  results: GuideSearchResult[]
}

export function GuideSearchResults({
  isOpen,
  onNavigate,
  query,
  results,
}: GuideSearchResultsProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={guideSearchStyles.dropdown}
          exit={{ opacity: 0, y: -6 }}
          id="guide-search-results"
          initial={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          {results.length > 0 ? (
            <ScrollArea
              className={guideSearchStyles.scrollArea}
              scrollbarKeepMounted
            >
              <ul className="grid gap-1 p-2">
                {results.map((result, index) => (
                  <GuideSearchResultItem
                    index={index}
                    key={`${result.sectionSlug}-${result.blockId}`}
                    onNavigate={onNavigate}
                    query={query}
                    result={result}
                  />
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <GuideSearchEmptyState />
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
