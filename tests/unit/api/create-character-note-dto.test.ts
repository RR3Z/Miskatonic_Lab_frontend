import { describe, expect, it } from "vitest"

import {
  createCharacterNoteSchema,
  MAX_CHARACTER_NOTE_TITLE_LENGTH,
} from "@/dto/character/create-character-note.dto"

describe("createCharacterNoteSchema", () => {
  it("trims title and body", () => {
    expect(
      createCharacterNoteSchema.parse({
        body: "  Проверить архив.  ",
        title: "  Зацепка  ",
      }),
    ).toEqual({ body: "Проверить архив.", title: "Зацепка" })
  })

  it("rejects empty fields and a title over the backend limit", () => {
    expect(
      createCharacterNoteSchema.safeParse({ body: " ", title: " " }).success,
    ).toBe(false)
    expect(
      createCharacterNoteSchema.safeParse({
        body: "Текст",
        title: "a".repeat(MAX_CHARACTER_NOTE_TITLE_LENGTH + 1),
      }).success,
    ).toBe(false)
  })
})
