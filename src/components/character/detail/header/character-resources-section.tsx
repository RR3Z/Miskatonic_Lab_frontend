"use client"

import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { ResourceStat } from "@/components/character/detail/header/resource-stat"
import { getCharacterResources } from "@/components/character/detail/header/utils/character-resources.util"
import { createCharacterResourceUpdate } from "@/components/character/detail/header/utils/create-character-resource-update.util"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { useMakeCharacterDiceRoll } from "@/hooks/character/use-character-dice-rolls"
import { useUpdateCharacterResource } from "@/hooks/character/use-update-character-resource"
import type { CharacterDetail } from "@/types/character.types"

export function CharacterResourcesSection({
  character,
}: {
  character: CharacterDetail
}) {
  const diceMutation = useMakeCharacterDiceRoll(character.id)
  const updateMutation = useUpdateCharacterResource(character.id)

  return (
    <section className="flex h-full min-w-0 self-stretch flex-col py-1">
      <CharacterSheetSectionTitle>
        {
          localizedContent.copy.characterDetailHeaderCharacterResourcesSection
            .resursy
        }
      </CharacterSheetSectionTitle>
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
