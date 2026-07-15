import type { KyInstance } from "ky"

export type CharacterDiceRoll = {
  expression: string
  result: number
}

export async function makeCharacterDiceRoll(
  api: KyInstance,
  characterId: string,
  expression: string,
): Promise<CharacterDiceRoll> {
  return api
    .post(`api/dice-roll/${characterId}/`, { json: { expression } })
    .json<CharacterDiceRoll>()
}
