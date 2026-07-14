import { CharacterSkills } from "@/components/character/detail/skills/character-skills"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CharacterDetail } from "@/types/character"

export function CharacterSkillsPanel({
  character,
}: {
  character: CharacterDetail
}) {
  return (
    <ScrollArea className="h-full" data-testid="character-skills-panel">
      <div className="p-4">
        <CharacterSkills characterId={character.id} skills={character.skills} />
      </div>
    </ScrollArea>
  )
}
