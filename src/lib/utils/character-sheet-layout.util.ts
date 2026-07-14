const CHARACTER_SHEET_LAYOUT_PREFIX = "miskatonic-character-sheet-layout"

export function characterSheetLayoutStorageKey(characterId: string) {
  return `${CHARACTER_SHEET_LAYOUT_PREFIX}:${characterId}`
}

export function removeCharacterSheetLayout(characterId: string) {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(characterSheetLayoutStorageKey(characterId))
}
