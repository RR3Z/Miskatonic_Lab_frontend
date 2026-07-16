import type { CSSProperties } from "react"
import type { D100RollDetails } from "@/lib/api/character-dice-rolls"
import {
  type CharacteristicCheckOutcome,
  getCharacteristicCheckOutcomeLabel,
} from "@/lib/dice/characteristic-check"

type DiceToastStyle = {
  accent: string
  borderColor: string
  closeButton: string
  muted: string
  ring: string
  toast: string
}

const outcomeStyles: Record<CharacteristicCheckOutcome, DiceToastStyle> = {
  critical_success: {
    accent: "text-[#ead99b]",
    borderColor: "#b6a367",
    closeButton: "bg-[#29251d]! text-[#ead99b]! hover:bg-[#383120]!",
    muted: "text-[#b7aa81]",
    ring: "border-[#b6a367]",
    toast:
      "border-[#b6a367]! bg-[linear-gradient(135deg,#3a3221,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
  },
  extreme_success: {
    accent: "text-[#d7cfae]",
    borderColor: "#9e9a75",
    closeButton: "bg-[#28261f]! text-[#d7cfae]! hover:bg-[#363329]!",
    muted: "text-[#aaa38c]",
    ring: "border-[#9e9a75]",
    toast:
      "border-[#9e9a75]! bg-[linear-gradient(135deg,#332f24,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
  },
  failure: {
    accent: "text-[#e2bfaa]",
    borderColor: "#9a6449",
    closeButton: "bg-[#2c211b]! text-[#e2bfaa]! hover:bg-[#3a2920]!",
    muted: "text-[#b49786]",
    ring: "border-[#9a6449]",
    toast:
      "border-[#9a6449]! bg-[linear-gradient(135deg,#35251e,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
  },
  fumble: {
    accent: "text-[#e7c0bc]",
    borderColor: "#8b211f",
    closeButton: "bg-[#301b1b]! text-[#e7c0bc]! hover:bg-[#422321]!",
    muted: "text-[#bc9490]",
    ring: "border-[#8b211f]",
    toast:
      "border-[#8b211f]! bg-[linear-gradient(135deg,#372020,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.74)]!",
  },
  hard_success: {
    accent: "text-[#c9d9c5]",
    borderColor: "#71846c",
    closeButton: "bg-[#202820]! text-[#c9d9c5]! hover:bg-[#2b352a]!",
    muted: "text-[#9da99a]",
    ring: "border-[#71846c]",
    toast:
      "border-[#71846c]! bg-[linear-gradient(135deg,#283027,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
  },
  regular_success: {
    accent: "text-[#c2d8c0]",
    borderColor: "#537653",
    closeButton: "bg-[#1d281e]! text-[#c2d8c0]! hover:bg-[#29352a]!",
    muted: "text-[#95a894]",
    ring: "border-[#537653]",
    toast:
      "border-[#537653]! bg-[linear-gradient(135deg,#263026,#211d18)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
  },
}

export function getDiceRollToastClassName(outcome: CharacteristicCheckOutcome) {
  return outcomeStyles[outcome].toast
}

export function getDiceRollToastCloseButtonClassName(
  outcome: CharacteristicCheckOutcome,
) {
  return outcomeStyles[outcome].closeButton
}

export function getDiceRollToastStyle(
  outcome: CharacteristicCheckOutcome,
): CSSProperties {
  return {
    "--dice-roll-border-color": outcomeStyles[outcome].borderColor,
  } as CSSProperties
}

export function DiceRollResultToast({
  details,
  outcome,
  result,
  title,
}: {
  details?: D100RollDetails | null
  outcome: CharacteristicCheckOutcome
  result: number
  title: string
}) {
  const outcomeLabel = getCharacteristicCheckOutcomeLabel(outcome)
  const styles = outcomeStyles[outcome]

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
            D100
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

function D100RollDetailsComparison({ details }: { details: D100RollDetails }) {
  const isBonus = details.mode === "bonus"
  const selectedIndex = details.candidates.indexOf(details.selected)
  const mode = isBonus ? "Преимущество" : "Помеха"
  const rule = isBonus ? "взят меньший результат" : "взят больший результат"
  const accent = isBonus
    ? "text-[var(--ml-accent-success)]"
    : "text-[var(--ml-accent-danger)]"
  const selectedCard = isBonus
    ? "border-[var(--ml-accent-success)] bg-[color-mix(in_srgb,var(--ml-accent-success)_18%,transparent)]"
    : "border-[var(--ml-accent-danger)] bg-[color-mix(in_srgb,var(--ml-accent-danger)_18%,transparent)]"

  return (
    <div className="mt-2 min-w-0" data-testid="d100-roll-details">
      <p
        className={`font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase ${accent}`}
      >
        {mode}
        {" — "}
        {rule}
      </p>
      <p className="mt-0.5 font-mono text-[0.62rem] text-[var(--ml-ink-muted)]">
        Общая единица: {details.units}
      </p>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {details.candidates.map((candidate, index) => {
          const isSelected = index === selectedIndex

          return (
            <div
              className={`min-w-0 rounded-sm border px-2 py-1.5 ${
                isSelected
                  ? selectedCard
                  : "border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/35"
              }`}
              data-testid={`d100-roll-candidate-${index}`}
              key={`${details.tens[index]}-${candidate}-${index}`}
            >
              <span
                className={`block font-mono text-[0.58rem] font-bold tracking-[0.1em] uppercase ${
                  isSelected ? accent : "text-[var(--ml-ink-muted)]"
                }`}
              >
                {isSelected ? "Взят" : "Не взят"}
              </span>
              <div className="mt-0.5 flex items-end justify-between gap-2">
                <strong
                  className={`font-mono text-xl leading-none font-bold tabular-nums ${
                    isSelected ? accent : "text-[var(--ml-ink-primary)]"
                  }`}
                >
                  {candidate}
                </strong>
                <span className="font-mono text-[0.58rem] text-[var(--ml-ink-muted)]">
                  Десяток {details.tens[index]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function FormulaDiceRollResultToast({
  formula,
  result,
  title,
}: {
  formula: string
  result: number
  title: string
}) {
  return (
    <div
      className="flex h-full w-full min-w-0 items-center gap-3"
      data-testid="formula-dice-roll-result"
    >
      <span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-[#b6a367] bg-transparent font-mono text-2xl font-bold tabular-nums text-[#ead99b]">
        {result}
      </span>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <strong className="whitespace-nowrap font-heading text-xl leading-none text-[#f4ead0]">
          {title}
        </strong>
        <span className="mt-1 whitespace-nowrap font-mono text-xs font-bold tracking-[0.16em] text-[#b7aa81]">
          {formula}
        </span>
      </div>
    </div>
  )
}
