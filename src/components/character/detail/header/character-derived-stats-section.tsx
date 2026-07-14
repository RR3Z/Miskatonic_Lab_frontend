import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { getCharacterDerivedStats } from "@/components/character/detail/header/character-stat-definitions"
import { CompactStat } from "@/components/character/detail/header/compact-stat"
import type { CharacterDetail } from "@/types/character"

export function CharacterDerivedStatsSection({
  character,
}: {
  character: CharacterDetail
}) {
  return (
    <section className="flex h-full min-w-0 self-stretch flex-col py-1">
      <CharacterSheetSectionTitle>Производные</CharacterSheetSectionTitle>
      <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-1.5">
        {getCharacterDerivedStats(character).map(([label, title, value]) => (
          <CompactStat key={label} label={label} title={title} value={value} />
        ))}
      </div>
    </section>
  )
}
