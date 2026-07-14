import type { KyInstance } from "ky"

import type {
  UpdateCharacterCharacteristicsDto,
  UpdateCharacterDerivedStatsDto,
} from "@/dto/character/character-sheet-values.dto"
import type {
  CharacterCharacteristics,
  CharacterDerivedStats,
} from "@/types/character"

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

export async function updateCharacterDerivedStats(
  api: KyInstance,
  characterId: string,
  input: UpdateCharacterDerivedStatsDto,
): Promise<CharacterDerivedStats> {
  return api
    .put(`api/characters/${characterId}/derived-stats/`, { json: input })
    .json<CharacterDerivedStats>()
}

export async function deleteCharacterDerivedStats(
  api: KyInstance,
  characterId: string,
): Promise<void> {
  await api.delete(`api/characters/${characterId}/derived-stats/`)
}
