import { z } from "zod"

import { MAX_CHARACTER_NAME_LENGTH } from "@/dto/character/create-character.dto"

export const characterNameSchema = z
  .string()
  .trim()
  .min(1, "Укажите имя персонажа")
  .max(MAX_CHARACTER_NAME_LENGTH, "Имя слишком длинное")

export const characterOptionalTextSchema = z
  .string()
  .trim()
  .max(255, "Значение слишком длинное")

export const characterOptionalAgeTextSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d+$/.test(value),
    "Возраст должен быть целым неотрицательным числом",
  )
  .refine(
    (value) => value === "" || Number(value) <= 32_767,
    "Возраст слишком большой",
  )

export type CharacterProfilePatch = {
  age?: number | null
  birthplace?: string | null
  name?: string
  occupation?: string | null
  player_name?: string | null
  residence?: string | null
  sex?: "female" | "male" | null
}
