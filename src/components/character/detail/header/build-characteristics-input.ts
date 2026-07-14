import type { UpdateCharacterCharacteristicsDto } from "@/dto/character/character-sheet-values.dto"
import type { CharacterCharacteristics } from "@/types/character"

export function buildCharacteristicsInput(
  characteristics: CharacterCharacteristics,
  patch: Partial<UpdateCharacterCharacteristicsDto>,
): UpdateCharacterCharacteristicsDto {
  return {
    appearance: characteristics.appearance,
    constitution: characteristics.constitution,
    dexterity: characteristics.dexterity,
    education: characteristics.education,
    intelligence: characteristics.intelligence,
    power: characteristics.power,
    size: characteristics.size,
    strength: characteristics.strength,
    ...patch,
  }
}
