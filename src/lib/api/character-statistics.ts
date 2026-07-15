import type { KyInstance } from "ky"

import type { UpdateCharacterCharacteristicsDto } from "@/dto/character/character-sheet-values.dto"
import type { CharacterCharacteristics } from "@/types/character"

export async function updateCharacterCharacteristics(
  api: KyInstance,
  characterId: string,
  input: UpdateCharacterCharacteristicsDto,
): Promise<CharacterCharacteristics> {
  return api
    .put(`api/characters/${characterId}/characteristics/`, { json: input })
    .json<CharacterCharacteristics>()
}

export async function deleteCharacterCharacteristics(
  api: KyInstance,
  characterId: string,
): Promise<void> {
  await api.delete(`api/characters/${characterId}/characteristics/`)
}
