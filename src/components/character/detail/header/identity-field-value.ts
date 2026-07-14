import type { CharacterIdentityTextKey } from "@/components/character/detail/header/identity-field-definitions"
import type { CharacterDetail } from "@/types/character"

export function identityFieldValue(
  character: CharacterDetail,
  key: CharacterIdentityTextKey,
): string | null {
  const value = character[key]
  return value === null ? null : String(value)
}
