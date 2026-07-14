import { z } from "zod"

export const MAX_CHARACTER_NOTE_TITLE_LENGTH = 120

export const createCharacterNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Укажите заголовок заметки")
    .max(
      MAX_CHARACTER_NOTE_TITLE_LENGTH,
      `Заголовок не должен превышать ${MAX_CHARACTER_NOTE_TITLE_LENGTH} символов`,
    ),
  body: z.string().trim().min(1, "Добавьте текст заметки"),
})

export type CreateCharacterNoteInput = z.input<typeof createCharacterNoteSchema>

export type CreateCharacterNoteDto = z.output<typeof createCharacterNoteSchema>

export const createCharacterNoteDefaultValues: CreateCharacterNoteInput = {
  title: "",
  body: "",
}
