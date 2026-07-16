"use client"

import { PencilLine } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { buildCharacteristicsInput } from "@/components/character/detail/header/build-characteristics-input"
import {
  type CharacteristicDefinition,
  getCharacterCharacteristics,
} from "@/components/character/detail/header/character-characteristic-definitions"
import { CharacterCharacteristicsEditorDialog } from "@/components/character/detail/header/character-characteristics-editor-dialog"
import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { CharacteristicDiceCard } from "@/components/character/detail/header/characteristic-dice-card"
import { CompactStat } from "@/components/character/detail/header/compact-stat"
import {
  DiceRollResultToast,
  getDiceRollToastClassName,
  getDiceRollToastCloseButtonClassName,
  getDiceRollToastStyle,
} from "@/components/character/detail/header/dice-roll-result-toast"
import { useDesktopCharacterSheet } from "@/components/character/detail/layout/use-desktop-character-sheet"
import { Button } from "@/components/ui/button"
import {
  DICE_RESULT_TOAST_DURATION_MS,
  DICE_RESULT_TOASTER_ID,
} from "@/components/ui/sonner/constants"
import { useMakeCharacterDiceRoll } from "@/lib/api/use-character-dice-rolls"
import { useUpdateCharacterCharacteristics } from "@/lib/api/use-character-statistics"
import { classifyCharacteristicCheck } from "@/lib/dice/characteristic-check"
import type { CharacterDetail } from "@/types/character"

export function CharacterCharacteristicsSection({
  character,
}: {
  character: CharacterDetail
}) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [rollingKeys, setRollingKeys] = useState<Set<string>>(() => new Set())
  const isDesktop = useDesktopCharacterSheet()
  const rollMutation = useMakeCharacterDiceRoll(character.id)
  const updateMutation = useUpdateCharacterCharacteristics(character.id)
  const characteristics = getCharacterCharacteristics(character)

  async function rollCharacteristic(stat: CharacteristicDefinition) {
    if (stat.value === null) return

    setRollingKeys((keys) => new Set(keys).add(stat.key))

    try {
      const roll = await rollMutation.mutateAsync("1d100")
      const check = classifyCharacteristicCheck(stat.value, roll.result)

      toast(
        <DiceRollResultToast
          outcome={check.outcome}
          result={roll.result}
          title={stat.title ?? stat.label}
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
    } finally {
      setRollingKeys((keys) => {
        const nextKeys = new Set(keys)
        nextKeys.delete(stat.key)
        return nextKeys
      })
    }
  }

  return (
    <section className="flex h-full min-w-0 self-stretch flex-col py-1">
      {!isDesktop ? (
        <div>
          <CharacterSheetSectionTitle>
            Характеристики
          </CharacterSheetSectionTitle>
          <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-4 gap-1.5">
            {characteristics.map((stat) => (
              <CompactStat
                ariaLabel={`Редактировать характеристику ${stat.title}`}
                key={stat.key}
                label={stat.label}
                onSave={(value) =>
                  updateMutation.mutateAsync(
                    buildCharacteristicsInput(character.characteristics, {
                      [stat.key]: value === "" ? null : Number(value),
                    }),
                  )
                }
                schema={stat.schema}
                title={stat.title}
                value={stat.value}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-1 flex-col">
          <CharacterSheetSectionTitle
            action={
              <div className="flex items-center gap-1">
                <Button
                  aria-label="Редактировать характеристики"
                  onClick={() => setEditorOpen(true)}
                  size="icon-xs"
                  title="Изменить"
                  type="button"
                  variant="ghost"
                >
                  <PencilLine aria-hidden="true" />
                </Button>
              </div>
            }
          >
            Характеристики
          </CharacterSheetSectionTitle>
          <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-4 gap-1.5">
            {characteristics.map((stat) => (
              <CharacteristicDiceCard
                key={stat.key}
                label={stat.label}
                onRoll={() => void rollCharacteristic(stat)}
                rolling={rollingKeys.has(stat.key)}
                title={stat.title ?? stat.label}
                value={stat.value}
              />
            ))}
          </div>
        </div>
      )}

      {isDesktop ? (
        <CharacterCharacteristicsEditorDialog
          character={character}
          onOpenChange={setEditorOpen}
          open={editorOpen}
        />
      ) : null}
    </section>
  )
}
