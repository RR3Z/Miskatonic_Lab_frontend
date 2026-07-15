import type { KyInstance } from "ky"

export type CharacterDiceRoll = {
  result: number
}

export async function makeCharacterDiceRoll(
  api: KyInstance,
  characterId: string,
): Promise<CharacterDiceRoll> {
  return api
    .post(`api/dice-roll/${characterId}/`, { json: { expression: "1d100" } })
    .json<CharacterDiceRoll>()
}
