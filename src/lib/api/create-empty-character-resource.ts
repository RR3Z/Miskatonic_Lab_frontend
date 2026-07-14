import type { CharacterResourceKey } from "@/dto/character/character-sheet-values.dto"
import type { CharacterDetail } from "@/types/character"

export function createEmptyCharacterResource(
  characterId: string,
  resource: CharacterResourceKey,
): CharacterDetail[CharacterResourceKey] {
  const meta = {
    character_id: characterId,
    created_at: null,
    id: null,
    updated_at: null,
  }

  switch (resource) {
    case "hp":
      return {
        ...meta,
        current_hp: 0,
        dead: false,
        dying: false,
        major_wound: false,
        max_hp: 0,
        unconscious: false,
      }
    case "mp":
      return { ...meta, current_mp: 0, max_mp: 0 }
    case "sanity":
      return {
        ...meta,
        current_sanity: 0,
        indef_insanity: false,
        max_sanity: 0,
        temp_insanity: false,
      }
    case "luck":
      return { ...meta, current_luck: 0, starting_luck: 0 }
  }
}
