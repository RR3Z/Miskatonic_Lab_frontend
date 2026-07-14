import { act, renderHook } from "@testing-library/react"
import type {
  GroupImperativeHandle,
  Layout,
  LayoutChangedMeta,
} from "react-resizable-panels"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  SECTIONS_PANEL_ID,
  SKILLS_PANEL_ID,
} from "@/components/character/detail/layout/character-sheet-layout-definitions"
import { parseCharacterSheetLayout } from "@/components/character/detail/layout/parse-character-sheet-layout"
import { useCharacterSheetLayout } from "@/components/character/detail/layout/use-character-sheet-layout"
import { characterSheetLayoutStorageKey } from "@/lib/utils/character-sheet-layout.util"

const storedLayout: Layout = {
  [SKILLS_PANEL_ID]: 60,
  [SECTIONS_PANEL_ID]: 40,
}

describe("character sheet layout persistence", () => {
  beforeEach(() => window.localStorage.clear())

  it("parses only complete layouts inside the panel constraints", () => {
    expect(parseCharacterSheetLayout(JSON.stringify(storedLayout))).toEqual(
      storedLayout,
    )
    expect(parseCharacterSheetLayout("not-json")).toBeNull()
    expect(
      parseCharacterSheetLayout(
        JSON.stringify({
          [SKILLS_PANEL_ID]: 75,
          [SECTIONS_PANEL_ID]: 25,
        }),
      ),
    ).toBeNull()
  })

  it("restores a per-character layout and saves only user interaction", () => {
    const setLayout = vi.fn()
    const { result, rerender } = renderHook(
      ({ characterId }) => useCharacterSheetLayout(characterId),
      { initialProps: { characterId: "character-1" } },
    )
    result.current.groupRef.current = {
      setLayout,
    } as unknown as GroupImperativeHandle
    window.localStorage.setItem(
      characterSheetLayoutStorageKey("character-2"),
      JSON.stringify(storedLayout),
    )

    rerender({ characterId: "character-2" })

    expect(setLayout).toHaveBeenCalledWith(storedLayout)

    act(() =>
      result.current.saveLayout(
        {
          [SKILLS_PANEL_ID]: 61,
          [SECTIONS_PANEL_ID]: 39,
        },
        { isUserInteraction: false } as LayoutChangedMeta,
      ),
    )
    expect(
      window.localStorage.getItem(
        characterSheetLayoutStorageKey("character-2"),
      ),
    ).toBe(JSON.stringify(storedLayout))

    const changedLayout: Layout = {
      [SKILLS_PANEL_ID]: 62,
      [SECTIONS_PANEL_ID]: 38,
    }
    act(() =>
      result.current.saveLayout(changedLayout, {
        isUserInteraction: true,
      } as LayoutChangedMeta),
    )
    expect(
      window.localStorage.getItem(
        characterSheetLayoutStorageKey("character-2"),
      ),
    ).toBe(JSON.stringify(changedLayout))
  })
})
