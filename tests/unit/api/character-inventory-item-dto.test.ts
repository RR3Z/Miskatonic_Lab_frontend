import { describe, expect, it } from "vitest"

import {
  characterInventoryItemSchema,
  MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH,
  MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH,
} from "@/dto/character/character-inventory-item.dto"

describe("characterInventoryItemSchema", () => {
  it("trims values and turns blank optional fields into undefined", () => {
    expect(
      characterInventoryItemSchema.parse({
        category: "  Снаряжение  ",
        description: "  Светит в темноте.  ",
        name: "  Карманный фонарь  ",
        quantity: " 2 ",
      }),
    ).toEqual({
      category: "Снаряжение",
      description: "Светит в темноте.",
      name: "Карманный фонарь",
      quantity: 2,
    })
    expect(
      characterInventoryItemSchema.parse({
        category: " ",
        description: " ",
        name: "Ключ",
        quantity: "",
      }),
    ).toEqual({
      category: undefined,
      description: undefined,
      name: "Ключ",
      quantity: undefined,
    })
  })

  it("rejects invalid name, quantity, and category", () => {
    expect(
      characterInventoryItemSchema.safeParse({
        category: "",
        description: "",
        name: " ",
        quantity: "0",
      }).success,
    ).toBe(false)
    expect(
      characterInventoryItemSchema.safeParse({
        category: "a".repeat(MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH + 1),
        description: "",
        name: "a".repeat(MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH + 1),
        quantity: "1.5",
      }).success,
    ).toBe(false)
  })
})
