import {
  characterOptionalAgeTextSchema,
  characterOptionalTextSchema,
} from "@/dto/character/character-profile.dto"

export type CharacterIdentityTextKey =
  | "age"
  | "birthplace"
  | "occupation"
  | "residence"

export const CHARACTER_IDENTITY_TEXT_FIELDS = [
  {
    key: "occupation",
    label: "Профессия",
    schema: characterOptionalTextSchema,
    testId: "character-occupation",
  },
  {
    key: "age",
    label: "Возраст",
    schema: characterOptionalAgeTextSchema,
    testId: "character-age",
  },
  {
    key: "residence",
    label: "Место жительства",
    schema: characterOptionalTextSchema,
  },
  {
    key: "birthplace",
    label: "Место рождения",
    schema: characterOptionalTextSchema,
  },
] as const
