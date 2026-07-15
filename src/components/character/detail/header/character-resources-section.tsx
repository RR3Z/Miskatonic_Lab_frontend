"use client"

import { getCharacterResources } from "@/components/character/detail/header/character-resource-definitions"
import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { createCharacterResourceUpdate } from "@/components/character/detail/header/create-character-resource-update"
import { ResourceStat } from "@/components/character/detail/header/resource-stat"
import { useMakeCharacterDiceRoll } from "@/lib/api/use-character-dice-rolls"
import { useUpdateCharacterResource } from "@/lib/api/use-character-resources"
import type { CharacterDetail } from "@/types/character"

export function CharacterResourcesSection({
  character,
}: {
  character: CharacterDetail
}) {
  const diceMutation = useMakeCharacterDiceRoll(character.id)
  const updateMutation = useUpdateCharacterResource(character.id)

  return (
    <section className="flex h-full min-w-0 self-stretch flex-col py-1">
      <CharacterSheetSectionTitle>Ресурсы</CharacterSheetSectionTitle>
      <div
        className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-1.5"
        data-testid="character-resource-grid"
      >
        {getCharacterResources(character).map((resource) => (
          <ResourceStat
            key={resource.visualKey}
            {...resource}
            character={character}
            isRolling={diceMutation.isPending}
            onRoll={(expression) => diceMutation.mutateAsync(expression)}
            onSave={(current, max) =>
              updateMutation.mutateAsync(
                createCharacterResourceUpdate(resource.resource, {
                  [resource.currentField]: current,
                  [resource.maxField]: max,
                }),
              )
            }
          />
        ))}
      </div>
    </section>
  )
}
