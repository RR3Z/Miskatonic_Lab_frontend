import type {
  CharacterResourceKey,
  CharacterResourceUpdate,
} from "@/dto/character/character-sheet-values.dto"

export function createCharacterResourceUpdate(
  resource: CharacterResourceKey,
  field: string,
  value: boolean | number,
): CharacterResourceUpdate {
  return { resource, values: { [field]: value } } as CharacterResourceUpdate
}
