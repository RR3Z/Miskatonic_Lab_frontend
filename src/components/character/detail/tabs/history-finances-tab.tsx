import { CharacterSheetTooltipProvider } from "@/components/character/detail/character-sheet-tooltip"
import { FinancesSection } from "@/components/character/detail/tabs/finances-section"
import { HistorySection } from "@/components/character/detail/tabs/history-section"
import type {
  CharacterBackstory,
  CharacterFinances,
  CharacterSkill,
} from "@/types/character"

export function HistoryFinancesTab({
  backstory,
  characterId,
  finances,
  skills,
}: {
  backstory: CharacterBackstory
  characterId: string
  finances: CharacterFinances
  skills: CharacterSkill[] | null
}) {
  return (
    <CharacterSheetTooltipProvider>
      <div
        className="space-y-5"
        data-testid="character-history-finances-content"
      >
        <HistorySection backstory={backstory} characterId={characterId} />
        <FinancesSection
          characterId={characterId}
          finances={finances}
          skills={skills}
        />
      </div>
    </CharacterSheetTooltipProvider>
  )
}
