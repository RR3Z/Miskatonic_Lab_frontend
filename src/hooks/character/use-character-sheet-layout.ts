"use client"

import { useCallback, useEffect, useRef } from "react"
import type {
  GroupImperativeHandle,
  Layout,
  LayoutChangedMeta,
} from "react-resizable-panels"

import { parseCharacterSheetLayout } from "@/lib/character/utils/parse-character-sheet-layout.util"
import { characterSheetLayoutStorageKey } from "@/lib/utils/character-sheet-layout.util"

export function useCharacterSheetLayout(characterId: string) {
  const groupRef = useRef<GroupImperativeHandle>(null)
  const storageKey = characterSheetLayoutStorageKey(characterId)

  useEffect(() => {
    const storedLayout = parseCharacterSheetLayout(
      window.localStorage.getItem(storageKey),
    )
    if (storedLayout) groupRef.current?.setLayout(storedLayout)
  }, [storageKey])

  const saveLayout = useCallback(
    (layout: Layout, meta: LayoutChangedMeta) => {
      if (!meta.isUserInteraction) return
      window.localStorage.setItem(storageKey, JSON.stringify(layout))
    },
    [storageKey],
  )

  return { groupRef, saveLayout }
}
