import { describe, expect, it } from "vitest"

import {
  characterBackstoryItemSchema,
  characterBackstorySectionSchema,
} from "@/dto/character/character-backstory.dto"
import {
  characterFinanceAssetsSchema,
  characterFinanceMoneySchema,
} from "@/dto/character/character-finances.dto"
import {
  characterOptionalAgeTextSchema,
  characterOptionalTextSchema,
} from "@/dto/character/character-profile.dto"
import { characterDamageBonusSchema } from "@/dto/character/character-sheet-values.dto"

describe("character detail DTO schemas", () => {
  it("normalizes optional profile values and enforces backend limits", () => {
    expect(characterOptionalTextSchema.parse("  Аркхэм  ")).toBe("Аркхэм")
    expect(characterOptionalTextSchema.safeParse("a".repeat(256)).success).toBe(
      false,
    )
    expect(characterOptionalAgeTextSchema.safeParse("32768").success).toBe(
      false,
    )
  })

  it("normalizes a fixed backstory item and rejects unknown sections", () => {
    expect(
      characterBackstoryItemSchema.parse({
        section: "traits",
        text: "  Наблюдательный  ",
        title: "  Черты  ",
      }),
    ).toEqual({
      section: "traits",
      text: "Наблюдательный",
      title: "Черты",
    })
    expect(characterBackstorySectionSchema.safeParse("unknown").success).toBe(
      false,
    )
  })

  it("normalizes finance fields and rejects empty values", () => {
    expect(characterFinanceMoneySchema.parse("  $20  ")).toBe("$20")
    expect(characterFinanceAssetsSchema.parse("  Дом и библиотека  ")).toBe(
      "Дом и библиотека",
    )
    expect(characterFinanceMoneySchema.safeParse(" ").success).toBe(false)
    expect(characterFinanceAssetsSchema.safeParse(" ").success).toBe(false)
  })

  it("rejects unsupported damage bonus syntax", () => {
    expect(characterDamageBonusSchema.safeParse("1d4").success).toBe(false)
    expect(characterDamageBonusSchema.safeParse("+1d4").success).toBe(true)
  })
})
