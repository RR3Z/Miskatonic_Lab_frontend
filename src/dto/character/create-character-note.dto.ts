import { z } from "zod"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"

export const MAX_CHARACTER_NOTE_TITLE_LENGTH = 120

export const characterNoteTitleSchema = z
  .string()
  .trim()
  .min(
    1,
    localizedContent.copy.dtoCharacterCreateCharacterNoteDto
      .ukazhiteZagolovokZametki,
  )
  .max(
    MAX_CHARACTER_NOTE_TITLE_LENGTH,
    formatLocalizedTemplate(
      localizedContent.copy.dtoCharacterCreateCharacterNoteDto
        .zagolovokNeDolzhenPrevyshatValue0Simvolov,
      { value0: MAX_CHARACTER_NOTE_TITLE_LENGTH },
    ),
  )

export const characterNoteBodySchema = z
  .string()
  .trim()
  .min(
    1,
    localizedContent.copy.dtoCharacterCreateCharacterNoteDto
      .dobavteTekstZametki,
  )

export const createCharacterNoteSchema = z.object({
  title: characterNoteTitleSchema,
  body: characterNoteBodySchema,
})

export type CreateCharacterNoteInput = z.input<typeof createCharacterNoteSchema>

export type CreateCharacterNoteDto = z.output<typeof createCharacterNoteSchema>

export const createCharacterNoteDefaultValues: CreateCharacterNoteInput = {
  title: "",
  body: "",
}
