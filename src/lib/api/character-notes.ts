import type { KyInstance } from "ky"

import type { CreateCharacterNoteDto } from "@/dto/character/create-character-note.dto"
import type { CharacterNote } from "@/types/character"

export async function createCharacterNote(
  api: KyInstance,
  characterId: string,
  input: CreateCharacterNoteDto,
): Promise<CharacterNote> {
  return api
    .post(`api/characters/${characterId}/notes/`, { json: input })
    .json<CharacterNote>()
}

export async function updateCharacterNote(
  api: KyInstance,
  characterId: string,
  noteId: string,
  input: CreateCharacterNoteDto,
): Promise<CharacterNote> {
  return api
    .put(`api/characters/${characterId}/notes/${noteId}/`, { json: input })
    .json<CharacterNote>()
}

export async function deleteCharacterNote(
  api: KyInstance,
  characterId: string,
  noteId: string,
): Promise<void> {
  await api.delete(`api/characters/${characterId}/notes/${noteId}/`)
}
