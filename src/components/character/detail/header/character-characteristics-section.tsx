"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { buildCharacteristicsInput } from "@/components/character/detail/header/build-characteristics-input"
import { getCharacterCharacteristics } from "@/components/character/detail/header/character-characteristic-definitions"
import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { CompactStat } from "@/components/character/detail/header/compact-stat"
import type { UpdateCharacterCharacteristicsDto } from "@/dto/character/character-sheet-values.dto"
import {
  useDeleteCharacterCharacteristics,
  useUpdateCharacterCharacteristics,
} from "@/lib/api/use-character-statistics"
import type { CharacterDetail } from "@/types/character"

export function CharacterCharacteristicsSection({
  character,
}: {
  character: CharacterDetail
}) {
  const updateMutation = useUpdateCharacterCharacteristics(character.id)
  const deleteMutation = useDeleteCharacterCharacteristics(character.id)

  return (
    <section className="flex h-full min-w-0 self-stretch flex-col py-1">
      <CharacterSheetSectionTitle
        action={
          character.characteristics.id ? (
            <DeleteResourceButton
              ariaLabel="Удалить характеристики"
              description="Все характеристики персонажа будут удалены."
              errorMessage="Не удалось удалить характеристики"
              onDelete={() => deleteMutation.mutateAsync()}
              title="Удалить характеристики?"
            />
          ) : undefined
        }
      >
        Характеристики
      </CharacterSheetSectionTitle>
      <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-4 gap-1.5">
        {getCharacterCharacteristics(character).map((stat) => (
          <CompactStat
            ariaLabel={`Редактировать характеристику ${stat.title}`}
            key={stat.key}
            label={stat.label}
            onSave={(value) =>
              updateMutation.mutateAsync(
                buildCharacteristicsInput(character.characteristics, {
                  [stat.key as keyof UpdateCharacterCharacteristicsDto]:
                    value === "" ? null : Number(value),
                }),
              )
            }
            schema={stat.schema}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>
    </section>
  )
}
