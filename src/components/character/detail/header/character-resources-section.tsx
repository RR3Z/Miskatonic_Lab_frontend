import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { getCharacterResources } from "@/components/character/detail/header/character-stat-definitions"
import { ResourceStat } from "@/components/character/detail/header/resource-stat"
import type { CharacterDetail } from "@/types/character"

export function CharacterResourcesSection({
  character,
}: {
  character: CharacterDetail
}) {
  return (
    <section className="flex h-full min-w-0 self-stretch flex-col py-1">
      <CharacterSheetSectionTitle>Ресурсы</CharacterSheetSectionTitle>
      <div
        className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-1.5"
        data-testid="character-resource-grid"
      >
        {getCharacterResources(character).map((resource) => (
          <ResourceStat key={resource.visualKey} {...resource} />
        ))}
      </div>
    </section>
  )
}
