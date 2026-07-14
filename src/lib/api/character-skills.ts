import type { KyInstance } from "ky"

export async function deleteCharacterSkill(
  api: KyInstance,
  characterId: string,
  skillId: string,
): Promise<void> {
  await api.delete(`api/characters/${characterId}/skills/${skillId}/`)
}
