"use client"

import { PencilLine } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { CharacterCharacteristicsEditorDialog } from "@/components/character/detail/header/character-characteristics-editor-dialog"
import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { CharacteristicDiceCard } from "@/components/character/detail/header/characteristic-dice-card"
import { CompactStat } from "@/components/character/detail/header/compact-stat"
import { DiceRollResultToast } from "@/components/character/detail/header/dice-result-toast/dice-roll-result-toast"
import {
  getDiceRollToastClassName,
  getDiceRollToastCloseButtonClassName,
  getDiceRollToastStyle,
} from "@/components/character/detail/header/dice-result-toast/utils/dice-roll-toast-style.util"
import { buildCharacteristicsInput } from "@/components/character/detail/header/utils/build-characteristics-input.util"
import {
  type CharacteristicDefinition,
  getCharacterCharacteristics,
} from "@/components/character/detail/header/utils/character-characteristics.util"
import { Button } from "@/components/ui/button"
import {
  DICE_RESULT_TOAST_DURATION_MS,
  DICE_RESULT_TOASTER_ID,
} from "@/components/ui/sonner/constants/sonner.constants"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import { useMakeCharacterDiceRoll } from "@/hooks/character/use-character-dice-rolls"
import { useDesktopCharacterSheet } from "@/hooks/character/use-desktop-character-sheet"
import { useUpdateCharacterCharacteristics } from "@/hooks/character/use-update-character-characteristics"
import {
  type D100Mode,
  parseD100RollDetails,
} from "@/lib/api/character-dice-rolls"
import { classifyCharacteristicCheck } from "@/lib/dice/characteristic-check"
import type { CharacterDetail } from "@/types/character.types"

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

  async function rollCharacteristic(
    stat: CharacteristicDefinition,
    mode: D100Mode,
  ) {
    if (stat.value === null) return

    setRollingKeys((keys) => new Set(keys).add(stat.key))

    try {
      const roll = await rollMutation.mutateAsync({
        expression: "1d100",
        d100Mode: mode,
      })
      const check = classifyCharacteristicCheck(stat.value, roll.result)

      toast(
        <DiceRollResultToast
          details={parseD100RollDetails(roll.details)}
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
      toast.error(
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicsSection
          .neUdalosBrositD100,
      )
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
            {
              localizedContent.copy
                .characterDetailHeaderCharacterCharacteristicsSection
                .harakteristiki
            }
          </CharacterSheetSectionTitle>
          <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-4 gap-1.5">
            {characteristics.map((stat) => (
              <CompactStat
                ariaLabel={formatLocalizedTemplate(
                  localizedContent.copy
                    .characterDetailHeaderCharacterCharacteristicsSection
                    .redaktirovatHarakteristikuValue0,
                  { value0: stat.title ?? stat.label },
                )}
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
                  aria-label={
                    localizedContent.copy
                      .characterDetailHeaderCharacterCharacteristicsSection
                      .redaktirovatHarakteristiki
                  }
                  className="border-[var(--ml-accent-brass-strong)]/70 bg-[color-mix(in_srgb,var(--ml-accent-brass-strong)_10%,transparent)] text-[var(--ml-accent-brass-strong)] hover:border-[var(--ml-accent-brass-strong)] hover:bg-[color-mix(in_srgb,var(--ml-accent-brass-strong)_20%,transparent)] hover:text-[var(--ml-ink-primary)]"
                  onClick={() => setEditorOpen(true)}
                  size="icon-xs"
                  title={
                    localizedContent.copy
                      .characterDetailHeaderCharacterCharacteristicsSection
                      .izmenit
                  }
                  type="button"
                  variant="secondary"
                >
                  <PencilLine aria-hidden="true" />
                </Button>
              </div>
            }
          >
            {
              localizedContent.copy
                .characterDetailHeaderCharacterCharacteristicsSection
                .harakteristiki
            }
          </CharacterSheetSectionTitle>
          <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-4 gap-1.5">
            {characteristics.map((stat) => (
              <CharacteristicDiceCard
                key={stat.key}
                label={stat.label}
                onRoll={(mode) => void rollCharacteristic(stat, mode)}
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
