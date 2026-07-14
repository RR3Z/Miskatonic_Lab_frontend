import type { KyInstance } from "ky"

import type { UpdateCharacterProfileDto } from "@/dto/character/character-profile.dto"
import type { CreatedCharacter } from "@/types/character"

export async function updateCharacterProfile(
  api: KyInstance,
  characterId: string,
  input: UpdateCharacterProfileDto,
): Promise<
  CreatedCharacter &
    Omit<UpdateCharacterProfileDto, "sex"> & {
      sex: string | null
    }
> {
  return api
    .put(`api/characters/${characterId}/`, { json: input })
    .json<
      CreatedCharacter &
        Omit<UpdateCharacterProfileDto, "sex"> & { sex: string | null }
    >()
}
