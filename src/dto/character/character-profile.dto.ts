import { z } from "zod"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

import { MAX_CHARACTER_NAME_LENGTH } from "@/dto/character/create-character.dto"

export const characterNameSchema = z
  .string()
  .trim()
  .min(
    1,
    localizedContent.copy.dtoCharacterCharacterProfileDto
      .ukazhiteImyaPersonazha,
  )
  .max(
    MAX_CHARACTER_NAME_LENGTH,
    localizedContent.copy.dtoCharacterCharacterProfileDto.imyaSlishkomDlinnoe,
  )

export const characterOptionalTextSchema = z
  .string()
  .trim()
  .max(
    255,
    localizedContent.copy.dtoCharacterCharacterProfileDto
      .znachenieSlishkomDlinnoe,
  )

export const characterOptionalAgeTextSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d+$/.test(value),
    localizedContent.copy.dtoCharacterCharacterProfileDto
      .vozrastDolzhenBytTselymNeotritsatelnymChislom,
  )
  .refine(
    (value) => value === "" || Number(value) <= 32_767,
    localizedContent.copy.dtoCharacterCharacterProfileDto
      .vozrastSlishkomBolshoi,
  )

export type CharacterProfilePatch = {
  age?: number | null
  birthplace?: string | null
  name?: string
  occupation?: string | null
  residence?: string | null
  sex?: "female" | "male" | null
}
