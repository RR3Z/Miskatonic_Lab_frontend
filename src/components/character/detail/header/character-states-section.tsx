import { CharacterSheetSectionTitle } from "@/components/character/detail/header/character-sheet-section-title"
import { CharacterStatesGrid } from "@/components/character/detail/header/character-states-grid"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import type { CharacterDetail } from "@/types/character.types"

export function CharacterStatesSection({
  character,
}: {
  character: CharacterDetail
}) {
  return (
    <section className="flex h-full min-w-0 self-stretch flex-col py-1">
      <CharacterSheetSectionTitle>
        {
          localizedContent.copy.characterDetailHeaderCharacterStatesSection
            .sostoyaniya
        }
      </CharacterSheetSectionTitle>
      <CharacterStatesGrid
        characterId={character.id}
        initialValues={{
          dead: character.hp.dead,
          dying: character.hp.dying,
          indefiniteInsanity: character.sanity.indef_insanity,
          majorWound: character.hp.major_wound,
          temporaryInsanity: character.sanity.temp_insanity,
          unconscious: character.hp.unconscious,
        }}
        key={character.id}
      />
    </section>
  )
}
