"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { getCharacterDerivedStats } from "@/components/character/detail/header/character-derived-stat-definitions"
import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { CompactStat } from "@/components/character/detail/header/compact-stat"
import type { UpdateCharacterDerivedStatsDto } from "@/dto/character/character-sheet-values.dto"
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
        {getCharacterDerivedStats(character).map((stat) => (
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
        ))}
      </div>
    </section>
  )
}
