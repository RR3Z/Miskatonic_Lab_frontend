import type { KyInstance } from "ky"

import type { CharacterProfilePatch } from "@/dto/character/character-profile.dto"
import type { CreatedCharacter } from "@/types/character.types"

type CharacterProfileResponse = CreatedCharacter & {
  birthplace: string | null
  occupation: string | null
  residence: string | null
}

export async function updateCharacterProfile(
  api: KyInstance,
  characterId: string,
  input: CharacterProfilePatch,
): Promise<CharacterProfileResponse> {
  return api
    .patch(`api/characters/${characterId}/`, { json: input })
    .json<CharacterProfileResponse>()
}
