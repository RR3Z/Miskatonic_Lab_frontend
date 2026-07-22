import type { CharacteristicFormInput } from "@/components/character/detail/header/characteristics-editor/types/characteristics-editor.types"
import { getCharacterCharacteristics } from "@/components/character/detail/header/utils/character-characteristics.util"
import type { CharacterDetail } from "@/types/character.types"

export function getCharacteristicFormValues(
  character: CharacterDetail,
): CharacteristicFormInput {
  return Object.fromEntries(
    getCharacterCharacteristics(character).map((field) => [
      field.key,
      field.value === null ? "" : String(field.value),
    ]),
  ) as CharacteristicFormInput
}
