import type { CharacterResourceKey } from "@/dto/character/character-sheet-values.dto"

export const CHARACTER_RESOURCE_ENDPOINTS: Record<
  CharacterResourceKey,
  string
> = {
  hp: "health",
  luck: "luck",
  mp: "magic",
  sanity: "sanity",
}
