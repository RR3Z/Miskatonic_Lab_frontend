export type CharacteristicCheckOutcome =
  | "critical_success"
  | "extreme_success"
  | "hard_success"
  | "regular_success"
  | "failure"
  | "fumble"

export type CharacteristicCheckThresholds = {
  base: number
  half: number
  fifth: number
}

export type CharacteristicCheckResult = {
  outcome: CharacteristicCheckOutcome
  thresholds: CharacteristicCheckThresholds
}

export function getCharacteristicCheckThresholds(
  base: number,
): CharacteristicCheckThresholds {
  return {
    base,
    fifth: Math.floor(base / 5),
    half: Math.floor(base / 2),
  }
}

export function classifyCharacteristicCheck(
  base: number,
  roll: number,
): CharacteristicCheckResult {
  const thresholds = getCharacteristicCheckThresholds(base)

  if (roll === 1) {
    return { outcome: "critical_success", thresholds }
  }

  if ((base < 50 && roll >= 96) || (base >= 50 && roll === 100)) {
    return { outcome: "fumble", thresholds }
  }

  if (roll <= thresholds.fifth) {
    return { outcome: "extreme_success", thresholds }
  }

  if (roll <= thresholds.half) {
    return { outcome: "hard_success", thresholds }
  }

  if (roll <= thresholds.base) {
    return { outcome: "regular_success", thresholds }
  }

  return { outcome: "failure", thresholds }
}
