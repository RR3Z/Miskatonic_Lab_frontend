"use client"

import { DiceRollProgressOverlay } from "@/components/character/detail/dice-roll-progress-overlay"
import {
  CharacterSheetStatButton,
  CharacterSheetStatCard,
} from "@/components/character/detail/header/character-sheet-stat-card"

export function DamageBonusRoll({
  onRoll,
  rolling,
  value,
}: {
  onRoll: (formula: string) => void
  rolling: boolean
  value: string | null
}) {
  const formula = value?.includes("d") ? value : null
  const content = (
    <>
      <span className="block w-full min-w-0 truncate font-body text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
        Бонус урона
      </span>
      <span className="font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]">
        {value ?? "—"}
      </span>
    </>
  )

  if (formula === null) {
    return (
      <CharacterSheetStatCard
        className="flex flex-col items-center justify-center px-2 py-1"
        data-testid="damage-bonus-stat"
      >
        {content}
      </CharacterSheetStatCard>
    )
  }

  return (
    <CharacterSheetStatButton
      aria-label={`Бросить бонус урона ${formula}`}
      className="relative flex flex-col items-center justify-center px-2 py-1"
      data-testid="damage-bonus-stat"
      disabled={rolling}
      onClick={() => onRoll(formula)}
      type="button"
    >
      {content}
      {rolling ? <DiceRollProgressOverlay /> : null}
    </CharacterSheetStatButton>
  )
}
