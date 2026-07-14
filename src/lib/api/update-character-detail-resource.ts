import type { UpdatedCharacterResource } from "@/lib/api/character-resources"
import type { CharacterDetail } from "@/types/character"

export function updateCharacterDetailResource(
  character: CharacterDetail,
  update: UpdatedCharacterResource,
): CharacterDetail {
  switch (update.resource) {
    case "hp":
      return { ...character, hp: update.value }
    case "mp":
      return { ...character, mp: update.value }
    case "sanity":
      return { ...character, sanity: update.value }
    case "luck":
      return { ...character, luck: update.value }
  }
}
