"use client"

import { getCharacterResources } from "@/components/character/detail/header/character-resource-definitions"
import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { createCharacterResourceUpdate } from "@/components/character/detail/header/create-character-resource-update"
import { ResourceStat } from "@/components/character/detail/header/resource-stat"
import {
  useDeleteCharacterResource,
  useUpdateCharacterResource,
} from "@/lib/api/use-character-resources"
import type { CharacterDetail } from "@/types/character"

export function CharacterResourcesSection({
  character,
}: {
  character: CharacterDetail
}) {
  const updateMutation = useUpdateCharacterResource(character.id)
  const deleteMutation = useDeleteCharacterResource(character.id)

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
            onDelete={() => deleteMutation.mutateAsync(resource.resource)}
            onSave={(field, value) =>
              updateMutation.mutateAsync(
                createCharacterResourceUpdate(resource.resource, field, value),
              )
            }
            showDelete={Boolean(character[resource.resource].id)}
          />
        ))}
      </div>
    </section>
  )
}
