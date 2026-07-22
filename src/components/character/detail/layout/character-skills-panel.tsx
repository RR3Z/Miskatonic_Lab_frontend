import { CharacterSkills } from "@/components/character/detail/skills/character-skills"
import type { CharacterDetail } from "@/types/character.types"

export function CharacterSkillsPanel({
  character,
}: {
  character: CharacterDetail
}) {
  return (
    <div
      className="h-full min-h-0 overflow-hidden p-4"
      data-testid="character-skills-panel"
    >
      <CharacterSkills
        characterId={character.id}
        characteristics={character.characteristics}
        skills={character.skills}
      />
    </div>
  )
}
