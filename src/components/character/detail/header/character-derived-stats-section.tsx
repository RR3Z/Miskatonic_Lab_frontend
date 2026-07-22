"use client"

import type { CSSProperties } from "react"
import { toast } from "sonner"
import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { CharacteristicDiceCard } from "@/components/character/detail/header/characteristic-dice-card"
import { DamageBonusRoll } from "@/components/character/detail/header/damage-bonus-roll"
import { DerivedStatCard } from "@/components/character/detail/header/derived-stat-card"
import { DiceRollResultToast } from "@/components/character/detail/header/dice-result-toast/dice-roll-result-toast"
import { FormulaDiceRollResultToast } from "@/components/character/detail/header/dice-result-toast/formula-dice-roll-result-toast"
import {
  getDiceRollToastClassName,
  getDiceRollToastCloseButtonClassName,
  getDiceRollToastStyle,
} from "@/components/character/detail/header/dice-result-toast/utils/dice-roll-toast-style.util"
import { getCharacterDerivedStats } from "@/components/character/detail/header/utils/character-derived-stats.util"
import {
  DICE_RESULT_TOAST_DURATION_MS,
  DICE_RESULT_TOASTER_ID,
} from "@/components/ui/sonner/constants/sonner.constants"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { useMakeCharacterDiceRoll } from "@/hooks/character/use-character-dice-rolls"
import {
  type D100Mode,
  parseD100RollDetails,
} from "@/lib/api/character-dice-rolls"
import { classifyCharacteristicCheck } from "@/lib/dice/characteristic-check"
import type { CharacterDetail } from "@/types/character.types"

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
          title={
            localizedContent.copy
              .characterDetailHeaderCharacterDerivedStatsSection.bonusUrona
          }
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
      toast.error(
        localizedContent.copy.characterDetailHeaderCharacterDerivedStatsSection
          .neUdalosBrositBonusUrona,
      )
    }
  }

  async function rollDodge(mode: D100Mode) {
    if (typeof dodge.value !== "number") return

    try {
      const roll = await dodgeRollMutation.mutateAsync({
        expression: "1d100",
        d100Mode: mode,
      })
      const check = classifyCharacteristicCheck(dodge.value, roll.result)

      toast(
        <DiceRollResultToast
          details={parseD100RollDetails(roll.details)}
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
      toast.error(
        localizedContent.copy.characterDetailHeaderCharacterDerivedStatsSection
          .neUdalosBrositD100,
      )
    }
  }

  return (
    <section className="flex h-full min-w-0 self-stretch flex-col py-1">
      <CharacterSheetSectionTitle>
        {
          localizedContent.copy
            .characterDetailHeaderCharacterDerivedStatsSection.proizvodnye
        }
      </CharacterSheetSectionTitle>
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
          onRoll={(mode) => void rollDodge(mode)}
          rolling={dodgeRollMutation.isPending}
          title={dodge.label}
          value={typeof dodge.value === "number" ? dodge.value : null}
        />
      </div>
    </section>
  )
}
