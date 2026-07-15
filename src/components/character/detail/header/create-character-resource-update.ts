import type {
  CharacterResourceKey,
  CharacterResourceUpdate,
} from "@/dto/character/character-sheet-values.dto"

export function createCharacterResourceUpdate(
  resource: CharacterResourceKey,
  fieldOrValues: string | Record<string, boolean | number>,
  value?: boolean | number,
): CharacterResourceUpdate {
  const values =
    typeof fieldOrValues === "string"
      ? { [fieldOrValues]: value }
      : fieldOrValues

  return { resource, values } as CharacterResourceUpdate
}
