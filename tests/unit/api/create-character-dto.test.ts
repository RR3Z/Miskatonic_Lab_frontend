import { describe, expect, it } from "vitest"

import {
  createCharacterFormSchema,
  MAX_PORTRAIT_BYTES,
} from "@/dto/character/create-character.dto"

describe("createCharacterFormSchema", () => {
  it("normalizes optional fields and trims the required name", () => {
    expect(
      createCharacterFormSchema.parse({
        name: "  Армитедж  ",
        sex: "",
        age: "",
        portrait: null,
      }),
    ).toEqual({
      name: "Армитедж",
      sex: null,
      age: null,
      portrait: null,
    })
  })

  it("produces an API-ready number and sex value", () => {
    expect(
      createCharacterFormSchema.parse({
        name: "Лавиния",
        sex: "female",
        age: "42",
        portrait: null,
      }),
    ).toMatchObject({ name: "Лавиния", sex: "female", age: 42 })
  })

  it("rejects an empty name and invalid age", () => {
    const result = createCharacterFormSchema.safeParse({
      name: "   ",
      sex: "",
      age: "-1",
      portrait: null,
    })

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error.flatten().fieldErrors).toMatchObject({
      name: ["Укажите имя персонажа"],
      age: ["Возраст должен быть целым числом от 0"],
    })
  })

  it("rejects unsupported and oversized portrait files", () => {
    const unsupported = createCharacterFormSchema.safeParse({
      name: "Армитедж",
      sex: "",
      age: "",
      portrait: new File(["portrait"], "portrait.gif", {
        type: "image/gif",
      }),
    })
    const oversized = createCharacterFormSchema.safeParse({
      name: "Армитедж",
      sex: "",
      age: "",
      portrait: new File(
        [new Uint8Array(MAX_PORTRAIT_BYTES + 1)],
        "large.png",
        {
          type: "image/png",
        },
      ),
    })

    expect(unsupported.success).toBe(false)
    expect(oversized.success).toBe(false)
  })
})
