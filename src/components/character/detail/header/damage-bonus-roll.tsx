"use client"

import { DiceRollProgressOverlay } from "@/components/character/detail/dice-roll-progress-overlay"
import { CharacterSheetStatButton } from "@/components/character/detail/header/character-sheet-stat/character-sheet-stat-button"
import { CharacterSheetStatCard } from "@/components/character/detail/header/character-sheet-stat/character-sheet-stat-card"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"

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
        {localizedContent.copy.characterDetailHeaderDamageBonusRoll.bonusUrona}
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
      aria-label={formatLocalizedTemplate(
        localizedContent.copy.characterDetailHeaderDamageBonusRoll
          .brositBonusUronaValue0,
        { value0: formula },
      )}
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
