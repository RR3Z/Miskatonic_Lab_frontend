import type { KyInstance } from "ky"

export type D100Mode = "normal" | "bonus" | "penalty"

export type CharacterDiceRollRequest = {
  expression: string
  d100Mode?: D100Mode
}

export type CharacterDiceRoll = {
  expression: string
  result: number
}

export async function makeCharacterDiceRoll(
  api: KyInstance,
  characterId: string,
  input: string | CharacterDiceRollRequest,
): Promise<CharacterDiceRoll> {
  const request = typeof input === "string" ? { expression: input } : input

  return api
    .post(`api/dice-roll/${characterId}/`, {
      json: {
        expression: request.expression,
        ...(request.d100Mode ? { d100_mode: request.d100Mode } : {}),
      },
    })
    .json<CharacterDiceRoll>()
}
