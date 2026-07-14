import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { getCharacterCharacteristics } from "@/components/character/detail/header/character-stat-definitions"
import { CompactStat } from "@/components/character/detail/header/compact-stat"
import type { CharacterDetail } from "@/types/character"

export function CharacterCharacteristicsSection({
  character,
}: {
  character: CharacterDetail
}) {
  return (
    <section className="flex h-full min-w-0 self-stretch flex-col py-1">
      <CharacterSheetSectionTitle>Характеристики</CharacterSheetSectionTitle>
      <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-4 gap-1.5">
        {getCharacterCharacteristics(character).map(([label, title, value]) => (
          <CompactStat key={label} label={label} title={title} value={value} />
        ))}
      </div>
    </section>
  )
}
