import { z } from "zod"
import localizedContent from "@/data/locales/ru/character/create.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"

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
    localizedContent.copy.dtoCharacterCreateCharacterDto
      .vozrastDolzhenBytTselymChislomOt,
  )
  .transform((value) => (value === "" ? null : Number(value)))

const optionalSexSchema = z
  .union([z.literal(""), z.enum(["male", "female"])])
  .transform((value) => value || null)

export const characterPortraitSchema = z
  .file(
    localizedContent.copy.dtoCharacterCreateCharacterDto.vyberiteFailPortreta,
  )
  .max(
    MAX_PORTRAIT_BYTES,
    localizedContent.copy.dtoCharacterCreateCharacterDto
      .razmerPortretaNeDolzhenPrevyshat5,
  )
  .mime(
    [...PORTRAIT_MIME_TYPES],
    localizedContent.copy.dtoCharacterCreateCharacterDto
      .podderzhivayutsyaTolkoJpegPngIWebp,
  )
  .nullable()

export const createCharacterFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      1,
      localizedContent.copy.dtoCharacterCreateCharacterDto
        .ukazhiteImyaPersonazha,
    )
    .max(
      MAX_CHARACTER_NAME_LENGTH,
      formatLocalizedTemplate(
        localizedContent.copy.dtoCharacterCreateCharacterDto
          .imyaNeDolzhnoPrevyshatValue0Simvolov,
        { value0: MAX_CHARACTER_NAME_LENGTH },
      ),
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
