import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import type { D100RollDetails } from "@/lib/api/character-dice-rolls"
import {
  type CharacteristicCheckOutcome,
  getCharacteristicCheckOutcomeLabel,
} from "@/lib/dice/characteristic-check"

import { D100RollDetailsComparison } from "./d100-roll-details-comparison"
import { diceToastStyles } from "./styles/dice-result-toast.styles"

type DiceRollResultToastProps = {
  details?: D100RollDetails | null
  outcome: CharacteristicCheckOutcome
  result: number
  title: string
}

export function DiceRollResultToast({
  details,
  outcome,
  result,
  title,
}: DiceRollResultToastProps) {
  const outcomeLabel = getCharacteristicCheckOutcomeLabel(outcome)
  const styles = diceToastStyles[outcome]

  return (
    <div
      className="flex h-full w-full min-w-0 items-center gap-3"
      data-testid="dice-roll-result"
    >
      <span
        className={`grid size-14 shrink-0 place-items-center rounded-full border-2 bg-transparent font-mono text-2xl font-bold tabular-nums ${styles.accent} ${styles.ring}`}
        data-testid="dice-roll-value"
      >
        {result}
      </span>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <strong className="whitespace-nowrap font-heading text-xl leading-none text-[#f4ead0]">
          {title}
        </strong>
        <div className="mt-1 flex items-baseline gap-2 whitespace-nowrap">
          <span
            className={`shrink-0 font-mono text-xs font-bold tracking-[0.16em] ${styles.muted}`}
          >
            {localizedContent.copy.characterDetailCommon.d100}
          </span>
          <strong
            className={`whitespace-nowrap font-heading text-lg leading-none font-bold tracking-[0.07em] uppercase ${styles.accent}`}
          >
            {outcomeLabel}
          </strong>
        </div>
        {details && details.mode !== "normal" ? (
          <D100RollDetailsComparison details={details} />
        ) : null}
      </div>
    </div>
  )
}
