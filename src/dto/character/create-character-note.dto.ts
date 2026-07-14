import { z } from "zod"

export const MAX_CHARACTER_NOTE_TITLE_LENGTH = 120

export const characterNoteTitleSchema = z
  .string()
  .trim()
  .min(1, "Укажите заголовок заметки")
  .max(
    MAX_CHARACTER_NOTE_TITLE_LENGTH,
    `Заголовок не должен превышать ${MAX_CHARACTER_NOTE_TITLE_LENGTH} символов`,
  )

export const characterNoteBodySchema = z
  .string()
  .trim()
  .min(1, "Добавьте текст заметки")

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
