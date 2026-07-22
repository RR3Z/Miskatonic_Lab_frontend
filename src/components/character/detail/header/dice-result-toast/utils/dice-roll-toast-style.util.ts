import type { CSSProperties } from "react"

import type { CharacteristicCheckOutcome } from "@/lib/dice/characteristic-check"

import { diceToastStyles } from "../styles/dice-result-toast.styles"

export function getDiceRollToastClassName(outcome: CharacteristicCheckOutcome) {
  return diceToastStyles[outcome].toast
}

export function getDiceRollToastCloseButtonClassName(
  outcome: CharacteristicCheckOutcome,
) {
  return diceToastStyles[outcome].closeButton
}

export function getDiceRollToastStyle(
  outcome: CharacteristicCheckOutcome,
): CSSProperties {
  return {
    "--dice-roll-border-color": diceToastStyles[outcome].borderColor,
  } as CSSProperties
}
