const CHARACTER_NOTE_EDITOR_HEIGHT_PREFIX =
  "miskatonic-character-note-editor-height"

export function characterNoteEditorHeightStorageKey(
  characterId: string,
  noteId: string,
) {
  return `${CHARACTER_NOTE_EDITOR_HEIGHT_PREFIX}:${characterId}:${noteId}`
}

export function removeCharacterNoteEditorHeight(
  characterId: string,
  noteId: string,
) {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(
    characterNoteEditorHeightStorageKey(characterId, noteId),
  )
}
