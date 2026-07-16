"use client"

import type { CSSProperties } from "react"
import { toast } from "sonner"

import { getCharacterDerivedStats } from "@/components/character/detail/header/character-derived-stat-definitions"
import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { CharacterSheetStatCard } from "@/components/character/detail/header/character-sheet-stat-card"
import { CharacteristicDiceCard } from "@/components/character/detail/header/characteristic-dice-card"
import { DamageBonusRoll } from "@/components/character/detail/header/damage-bonus-roll"
import {
  DiceRollResultToast,
  FormulaDiceRollResultToast,
  getDiceRollToastClassName,
  getDiceRollToastCloseButtonClassName,
  getDiceRollToastStyle,
} from "@/components/character/detail/header/dice-roll-result-toast"
import {
  DICE_RESULT_TOAST_DURATION_MS,
  DICE_RESULT_TOASTER_ID,
} from "@/components/ui/sonner/constants"
import { useMakeCharacterDiceRoll } from "@/lib/api/use-character-dice-rolls"
import { classifyCharacteristicCheck } from "@/lib/dice/characteristic-check"
import type { CharacterDetail } from "@/types/character"

export function CharacterDerivedStatsSection({
  character,
}: {
  character: CharacterDetail
}) {
  const damageBonusRollMutation = useMakeCharacterDiceRoll(character.id)
  const dodgeRollMutation = useMakeCharacterDiceRoll(character.id)
  const [speed, physique, damageBonus, dodge] =
    getCharacterDerivedStats(character)

  async function rollDamageBonus(formula: string) {
    try {
      const roll = await damageBonusRollMutation.mutateAsync(formula)

      toast(
        <FormulaDiceRollResultToast
          formula={roll.expression || formula}
          result={roll.result}
          title="Бонус урона"
        />,
        {
          classNames: {
            closeButton: "bg-[#29251d]! text-[#ead99b]! hover:bg-[#383120]!",
            content: "h-full! w-full! gap-0!",
            title: "h-full! w-full!",
            toast:
              "dice-roll-toast min-h-24! items-stretch! border-2! border-[#b6a367]! bg-[linear-gradient(135deg,#3a3221,#211d18)]! p-3! text-[var(--ml-ink-primary)]! shadow-[0_20px_48px_rgba(0,0,0,0.72)]!",
          },
          duration: DICE_RESULT_TOAST_DURATION_MS,
          style: { "--dice-roll-border-color": "#b6a367" } as CSSProperties,
          toasterId: DICE_RESULT_TOASTER_ID,
        },
      )
    } catch {
      toast.error("Не удалось бросить бонус урона")
    }
  }

  async function rollDodge() {
    if (typeof dodge.value !== "number") return

    try {
      const roll = await dodgeRollMutation.mutateAsync("1d100")
      const check = classifyCharacteristicCheck(dodge.value, roll.result)

      toast(
        <DiceRollResultToast
          outcome={check.outcome}
          result={roll.result}
          title={dodge.label}
        />,
        {
          classNames: {
            closeButton: getDiceRollToastCloseButtonClassName(check.outcome),
            content: "h-full! w-full! gap-0!",
            title: "h-full! w-full!",
            toast: `dice-roll-toast min-h-24! items-stretch! border-2! p-3! text-[var(--ml-ink-primary)]! ${getDiceRollToastClassName(check.outcome)}`,
          },
          duration: DICE_RESULT_TOAST_DURATION_MS,
          style: getDiceRollToastStyle(check.outcome),
          toasterId: DICE_RESULT_TOASTER_ID,
        },
      )
    } catch {
      toast.error("Не удалось бросить d100")
    }
  }

  return (
    <section className="flex h-full min-w-0 self-stretch flex-col py-1">
      <CharacterSheetSectionTitle>Производные</CharacterSheetSectionTitle>
      <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-1.5">
        <DerivedStatCard label={speed.label} value={speed.value} />
        <DerivedStatCard label={physique.label} value={physique.value} />
        <DamageBonusRoll
          onRoll={(formula) => void rollDamageBonus(formula)}
          rolling={damageBonusRollMutation.isPending}
          value={
            typeof damageBonus.value === "string" ? damageBonus.value : null
          }
        />
        <CharacteristicDiceCard
          label={dodge.label}
          onRoll={() => void rollDodge()}
          rolling={dodgeRollMutation.isPending}
          title={dodge.label}
          value={typeof dodge.value === "number" ? dodge.value : null}
        />
      </div>
    </section>
  )
}

function DerivedStatCard({
  label,
  value,
}: {
  label: string
  value: number | string | null
}) {
  return (
    <CharacterSheetStatCard
      className="flex flex-col items-center justify-center px-2 py-1"
      data-testid={`derived-stat-${label}`}
    >
      <span className="block w-full min-w-0 truncate font-body text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
        {label}
      </span>
      <span className="font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]">
        {value ?? "—"}
      </span>
    </CharacterSheetStatCard>
  )
}
