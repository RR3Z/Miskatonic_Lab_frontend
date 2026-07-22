import localizedContent from "@/data/locales/ru/character/detail.ru.json"
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
    label:
      localizedContent.copy.characterDetailHeaderIdentityFieldDefinitions
        .professiya,
    schema: characterOptionalTextSchema,
    testId: "character-occupation",
  },
  {
    key: "age",
    label:
      localizedContent.copy.characterDetailHeaderIdentityFieldDefinitions
        .vozrast,
    schema: characterOptionalAgeTextSchema,
    testId: "character-age",
  },
  {
    key: "residence",
    label:
      localizedContent.copy.characterDetailHeaderIdentityFieldDefinitions
        .mestoZhitelstva,
    schema: characterOptionalTextSchema,
  },
  {
    key: "birthplace",
    label:
      localizedContent.copy.characterDetailHeaderIdentityFieldDefinitions
        .mestoRozhdeniya,
    schema: characterOptionalTextSchema,
  },
] as const
