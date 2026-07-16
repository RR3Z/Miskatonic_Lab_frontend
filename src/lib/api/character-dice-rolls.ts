import type { KyInstance } from "ky"

export type D100Mode = "normal" | "bonus" | "penalty"

export type CharacterDiceRollRequest = {
  expression: string
  d100Mode?: D100Mode
}

export type D100RollDetails = {
  mode: D100Mode
  units: number
  tens: number[]
  candidates: number[]
  selected: number
}

export type CharacterDiceRoll = {
  expression: string
  result: number
  details?: unknown
}

export function parseD100RollDetails(details: unknown): D100RollDetails | null {
  if (!isRecord(details)) {
    return null
  }

  const { candidates, mode, selected: selectedValue, tens, units } = details
  if (!isD100Mode(mode) || !isDigit(units)) {
    return null
  }
  if (!Array.isArray(tens) || !Array.isArray(candidates)) {
    return null
  }
  if (!tens.every(isDigit) || !candidates.every(isD100Result)) {
    return null
  }

  const expectedCount = mode === "normal" ? 1 : 2
  if (
    tens.length !== expectedCount ||
    candidates.length !== expectedCount ||
    !isD100Result(selectedValue)
  ) {
    return null
  }

  const expectedCandidates = tens.map((tensValue) => {
    const candidate = tensValue * 10 + units
    return candidate === 0 ? 100 : candidate
  })
  if (
    expectedCandidates.some(
      (candidate, index) => candidate !== candidates[index],
    )
  ) {
    return null
  }

  const expectedSelected =
    mode === "bonus"
      ? Math.min(...candidates)
      : mode === "penalty"
        ? Math.max(...candidates)
        : candidates[0]
  if (selectedValue !== expectedSelected) {
    return null
  }

  return {
    mode,
    units,
    tens,
    candidates,
    selected: selectedValue,
  }
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isD100Mode(value: unknown): value is D100Mode {
  return value === "normal" || value === "bonus" || value === "penalty"
}

function isDigit(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 9
  )
}

function isD100Result(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 100
  )
}
