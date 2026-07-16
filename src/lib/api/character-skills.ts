import type { KyInstance } from "ky"

import type { CharacterSkill } from "@/types/character"

export type CharacterSkillInput = Pick<
  CharacterSkill,
  "base_value" | "checked" | "name" | "value"
>

export async function createCharacterSkill(
  api: KyInstance,
  characterId: string,
  input: CharacterSkillInput,
): Promise<CharacterSkill> {
  return api
    .post(`api/characters/${characterId}/skills/`, { json: input })
    .json<CharacterSkill>()
}

export async function updateCharacterSkill(
  api: KyInstance,
  characterId: string,
  skillId: string,
  input: CharacterSkillInput,
): Promise<CharacterSkill> {
  return api
    .put(`api/characters/${characterId}/skills/${skillId}/`, { json: input })
    .json<CharacterSkill>()
}

export async function deleteCharacterSkill(
  api: KyInstance,
  characterId: string,
  skillId: string,
): Promise<void> {
  await api.delete(`api/characters/${characterId}/skills/${skillId}/`)
}
