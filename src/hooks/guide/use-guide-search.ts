"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { getGuideSearchResults } from "@/lib/guide/utils/guide-search.util"

export function useGuideSearch() {
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const results = useMemo(() => getGuideSearchResults(query), [query])
  const hasQuery = query.trim().length > 0

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "k" ||
        (!event.ctrlKey && !event.metaKey)
      ) {
        return
      }

      event.preventDefault()
      inputRef.current?.focus()
      setIsFocused(true)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return {
    hasQuery,
    inputRef,
    isFocused,
    isResultsOpen: hasQuery && isFocused,
    query,
    results,
    setIsFocused,
    setQuery,
  }
}
