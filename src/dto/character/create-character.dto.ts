import { z } from "zod"

export const MAX_CHARACTER_NAME_LENGTH = 255
export const MAX_PORTRAIT_BYTES = 5 * 1024 * 1024
export const PORTRAIT_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

const optionalAgeSchema = z
  .string()
  .refine(
    (value) => value === "" || /^\d+$/.test(value),
    "Возраст должен быть целым числом от 0",
  )
  .transform((value) => (value === "" ? null : Number(value)))

const optionalSexSchema = z
  .union([z.literal(""), z.enum(["male", "female"])])
  .transform((value) => value || null)

export const characterPortraitSchema = z
  .file("Выберите файл портрета")
  .max(MAX_PORTRAIT_BYTES, "Размер портрета не должен превышать 5 МБ")
  .mime([...PORTRAIT_MIME_TYPES], "Поддерживаются только JPEG, PNG и WebP")
  .nullable()

export const createCharacterFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Укажите имя персонажа")
    .max(
      MAX_CHARACTER_NAME_LENGTH,
      `Имя не должно превышать ${MAX_CHARACTER_NAME_LENGTH} символов`,
    ),
  sex: optionalSexSchema,
  age: optionalAgeSchema,
  portrait: characterPortraitSchema,
})

export type CreateCharacterFormInput = z.input<typeof createCharacterFormSchema>

export type CreateCharacterFormDto = z.output<typeof createCharacterFormSchema>

export type CreateCharacterPayload = Pick<
  CreateCharacterFormDto,
  "name" | "sex" | "age"
>

export const createCharacterFormDefaultValues: CreateCharacterFormInput = {
  name: "",
  sex: "",
  age: "",
  portrait: null,
}
