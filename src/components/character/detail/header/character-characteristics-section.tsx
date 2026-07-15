"use client"

import { PencilLine } from "lucide-react"
import { useState } from "react"

import { buildCharacteristicsInput } from "@/components/character/detail/header/build-characteristics-input"
import { getCharacterCharacteristics } from "@/components/character/detail/header/character-characteristic-definitions"
import { CharacterCharacteristicsEditorDialog } from "@/components/character/detail/header/character-characteristics-editor-dialog"
import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { CharacteristicDiceCard } from "@/components/character/detail/header/characteristic-dice-card"
import { CompactStat } from "@/components/character/detail/header/compact-stat"
import { useDesktopCharacterSheet } from "@/components/character/detail/layout/use-desktop-character-sheet"
import { Button } from "@/components/ui/button"
import { useUpdateCharacterCharacteristics } from "@/lib/api/use-character-statistics"
import type { CharacterDetail } from "@/types/character"

export function CharacterCharacteristicsSection({
  character,
}: {
  character: CharacterDetail
}) {
  const [editorOpen, setEditorOpen] = useState(false)
  const isDesktop = useDesktopCharacterSheet()
  const updateMutation = useUpdateCharacterCharacteristics(character.id)
  const characteristics = getCharacterCharacteristics(character)

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
                title={stat.title ?? stat.label}
                value={stat.value as number | null}
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
