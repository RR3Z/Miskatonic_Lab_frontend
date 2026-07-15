"use client"

import { toast } from "sonner"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { getCharacterDerivedStats } from "@/components/character/detail/header/character-derived-stat-definitions"
import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { CompactStat } from "@/components/character/detail/header/compact-stat"
import { DamageBonusRoll } from "@/components/character/detail/header/damage-bonus-roll"
import { FormulaDiceRollResultToast } from "@/components/character/detail/header/dice-roll-result-toast"
import {
  DICE_RESULT_TOASTER_ID,
  TOAST_DURATION_MS,
} from "@/components/ui/sonner"
import type { UpdateCharacterDerivedStatsDto } from "@/dto/character/character-sheet-values.dto"
import { useMakeCharacterDiceRoll } from "@/lib/api/use-character-dice-rolls"
import {
  useDeleteCharacterDerivedStats,
  useUpdateCharacterDerivedStats,
} from "@/lib/api/use-character-statistics"
import type { CharacterDetail } from "@/types/character"

export function CharacterDerivedStatsSection({
  character,
}: {
  character: CharacterDetail
}) {
  const updateMutation = useUpdateCharacterDerivedStats(character.id)
  const deleteMutation = useDeleteCharacterDerivedStats(character.id)
  const rollMutation = useMakeCharacterDiceRoll(character.id)

  async function rollDamageBonus(formula: string) {
    try {
      const roll = await rollMutation.mutateAsync(formula)

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
          duration: TOAST_DURATION_MS,
          style: { "--dice-roll-border-color": "#b6a367" },
          toasterId: DICE_RESULT_TOASTER_ID,
        },
      )
    } catch {
      toast.error("Не удалось бросить бонус урона")
    }
  }

  return (
    <section className="flex h-full min-w-0 self-stretch flex-col py-1">
      <CharacterSheetSectionTitle
        action={
          character.derived_stats.id ? (
            <DeleteResourceButton
              ariaLabel="Удалить производные показатели"
              description="Все производные показатели персонажа будут удалены."
              errorMessage="Не удалось удалить производные показатели"
              onDelete={() => deleteMutation.mutateAsync()}
              title="Удалить производные показатели?"
            />
          ) : undefined
        }
      >
        Производные
      </CharacterSheetSectionTitle>
      <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-1.5">
        {getCharacterDerivedStats(character).map((stat) =>
          stat.key === "damage_bonus" ? (
            <DamageBonusRoll
              key={stat.key}
              onRoll={(formula) => void rollDamageBonus(formula)}
              rolling={rollMutation.isPending}
              value={stat.value}
            />
          ) : (
            <CompactStat
              ariaLabel={`Редактировать показатель ${stat.label}`}
              key={stat.key}
              label={stat.label}
              onSave={(value) =>
                updateMutation.mutateAsync({
                  [stat.key as keyof UpdateCharacterDerivedStatsDto]:
                    stat.key === "damage_bonus" ? value : Number(value),
                })
              }
              schema={stat.schema}
              title={stat.title}
              value={stat.value}
            />
          ),
        )}
      </div>
    </section>
  )
}
