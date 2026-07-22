import type { CharacterIdentityTextKey } from "@/components/character/detail/header/constants/identity-fields.constants"
import type { CharacterDetail } from "@/types/character.types"

export function identityFieldValue(
  character: CharacterDetail,
  key: CharacterIdentityTextKey,
): string | null {
  const value = character[key]
  return value === null ? null : String(value)
}
