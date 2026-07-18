import type { KyInstance } from "ky"

import type { UpdateCharacterFinancesDto } from "@/dto/character/character-finances.dto"

export type CharacterFinancesWriteResponse = {
  assets: string | null
  cash: string | null
  character_id: string
  created_at: string
  id: string
  spending_limit: string | null
  updated_at: string
}

export async function updateCharacterFinances(
  api: KyInstance,
  characterId: string,
  input: UpdateCharacterFinancesDto,
): Promise<CharacterFinancesWriteResponse> {
  return api
    .put(`api/characters/${characterId}/finances/`, { json: input })
    .json<CharacterFinancesWriteResponse>()
}

export async function deleteCharacterFinances(
  api: KyInstance,
  characterId: string,
): Promise<void> {
  await api.delete(`api/characters/${characterId}/finances/`)
}
