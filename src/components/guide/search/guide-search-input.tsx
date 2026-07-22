import { Search } from "lucide-react"
import type { RefObject } from "react"

import { Input } from "@/components/ui/input"
import { guideContent } from "@/lib/guide/guide-content"

type GuideSearchInputProps = {
  inputRef: RefObject<HTMLInputElement | null>
  isExpanded: boolean
  onChange: (value: string) => void
  onFocus: () => void
  value: string
}

export function GuideSearchInput({
  inputRef,
  isExpanded,
  onChange,
  onFocus,
  value,
}: GuideSearchInputProps) {
  const { search } = guideContent.ui

  return (
    <>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-(--ml-ink-muted)"
        size={16}
      />
      <Input
        aria-controls="guide-search-results"
        aria-expanded={isExpanded}
        aria-label={search.ariaLabel}
        className="pl-10 pr-16"
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        placeholder={search.placeholder}
        ref={inputRef}
        size="lg"
        value={value}
        variant="accent"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-sm border border-(--ml-border-subtle) bg-(--ml-bg-page)/45 px-1.5 py-0.5 font-(family-name:--font-code) text-[11px] text-(--ml-ink-muted)">
        {search.shortcutLabel}
      </kbd>
    </>
  )
}
