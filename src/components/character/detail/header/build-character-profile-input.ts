import type { UpdateCharacterProfileDto } from "@/dto/character/character-profile.dto"
import type { CharacterDetail } from "@/types/character"

export function buildCharacterProfileInput(
  character: CharacterDetail,
  patch: Partial<UpdateCharacterProfileDto>,
): UpdateCharacterProfileDto {
  return {
    age: character.age,
    birthplace: character.birthplace,
    name: character.name,
    occupation: character.occupation,
    player_name: character.player_name,
    residence: character.residence,
    sex:
      character.sex === "female" || character.sex === "male"
        ? character.sex
        : null,
    ...patch,
  }
}
