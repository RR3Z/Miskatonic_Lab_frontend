import { z } from "zod"

export const MAX_CHARACTERISTIC_VALUE = 100

export const characterNullableIntegerTextSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d+$/.test(value),
    "Введите целое неотрицательное число",
  )
  .refine(
    (value) => value === "" || Number(value) <= MAX_CHARACTERISTIC_VALUE,
    `Введите значение от 0 до ${MAX_CHARACTERISTIC_VALUE}`,
  )

export const characterIntegerTextSchema =
  characterNullableIntegerTextSchema.refine(
    (value) => value !== "",
    "Введите значение",
  )

export type UpdateCharacterCharacteristicsDto = {
  appearance: number | null
  constitution: number | null
  dexterity: number | null
  education: number | null
  intelligence: number | null
  power: number | null
  size: number | null
  strength: number | null
}

export type CharacterResourceUpdate =
  | {
      resource: "hp"
      values: Partial<{
        current_hp: number
        dead: boolean
        dying: boolean
        major_wound: boolean
        max_hp: number
        unconscious: boolean
      }>
    }
  | {
      resource: "mp"
      values: Partial<{ current_mp: number; max_mp: number }>
    }
  | {
      resource: "sanity"
      values: Partial<{
        current_sanity: number
        indef_insanity: boolean
        max_sanity: number
        temp_insanity: boolean
      }>
    }
  | {
      resource: "luck"
      values: Partial<{ current_luck: number; starting_luck: number }>
    }

export type CharacterResourceKey = CharacterResourceUpdate["resource"]
