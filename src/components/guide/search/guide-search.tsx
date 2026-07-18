"use client"

import { GuideSearchInput } from "@/components/guide/search/guide-search-input"
import { GuideSearchResults } from "@/components/guide/search/guide-search-results"
import { guideContent } from "@/data/guide/guide-content.data"
import { useGuideSearch } from "@/hooks/guide/use-guide-search"

export function GuideSearch() {
  const { inputRef, isResultsOpen, query, results, setIsFocused, setQuery } =
    useGuideSearch()

  return (
    <form
      aria-label={guideContent.ui.search.ariaLabel}
      className="relative w-full max-w-xl"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false)
        }
      }}
      onSubmit={(event) => event.preventDefault()}
    >
      <GuideSearchInput
        inputRef={inputRef}
        isExpanded={isResultsOpen}
        onChange={setQuery}
        onFocus={() => setIsFocused(true)}
        value={query}
      />
      <GuideSearchResults
        isOpen={isResultsOpen}
        onNavigate={() => setIsFocused(false)}
        query={query}
        results={results}
      />
    </form>
  )
}
