import { describe, expect, it } from "vitest"

import {
  characterNameSchema,
  characterOptionalAgeTextSchema,
} from "@/dto/character/character-profile.dto"
import {
  characterIntegerTextSchema,
  characterNullableIntegerTextSchema,
} from "@/dto/character/character-sheet-values.dto"

describe("character sheet value schemas", () => {
  it("normalizes profile text and validates optional age", () => {
    expect(characterNameSchema.parse("  Armitage  ")).toBe("Armitage")
    expect(characterOptionalAgeTextSchema.parse("")).toBe("")
    expect(characterOptionalAgeTextSchema.safeParse("-1").success).toBe(false)
  })

  it("accepts nullable characteristics but requires resource values", () => {
    expect(characterNullableIntegerTextSchema.parse("")).toBe("")
    expect(characterNullableIntegerTextSchema.parse("100")).toBe("100")
    expect(characterNullableIntegerTextSchema.safeParse("101").success).toBe(
      false,
    )
    expect(
      characterNullableIntegerTextSchema.safeParse("not-a-number").success,
    ).toBe(false)
    expect(characterIntegerTextSchema.safeParse("").success).toBe(false)
    expect(characterIntegerTextSchema.parse("42")).toBe("42")
  })
})
