"use client"

import { useSyncExternalStore } from "react"

const DESKTOP_CHARACTER_SHEET_QUERY = "(min-width: 1280px)"

function subscribe(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia)
    return () => undefined

  const mediaQuery = window.matchMedia(DESKTOP_CHARACTER_SHEET_QUERY)
  mediaQuery.addEventListener("change", onChange)
  return () => mediaQuery.removeEventListener("change", onChange)
}

function getSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return true
  return window.matchMedia(DESKTOP_CHARACTER_SHEET_QUERY).matches
}

export function useDesktopCharacterSheet() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true)
}
