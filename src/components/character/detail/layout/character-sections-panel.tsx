import { CharacterSheetTabs } from "@/components/character/detail/tabs/character-sheet-tabs"
import type { CharacterDetail } from "@/types/character"

export function CharacterSectionsPanel({
  character,
}: {
  character: CharacterDetail
}) {
  return (
    <div
      className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
      data-testid="character-sections-panel"
    >
      <CharacterSheetTabs
        backstory={character.backstory}
        characterId={character.id}
        finances={character.finances}
        notes={character.notes}
      />
    </div>
  )
}
