import { describe, expect, it } from "vitest"

import { parseD100RollDetails } from "@/lib/api/character-dice-rolls"

describe("parseD100RollDetails", () => {
  it("accepts a valid bonus d100 roll", () => {
    expect(
      parseD100RollDetails({
        mode: "bonus",
        units: 4,
        tens: [2, 4],
        candidates: [24, 44],
        selected: 24,
      }),
    ).toEqual({
      mode: "bonus",
      units: 4,
      tens: [2, 4],
      candidates: [24, 44],
      selected: 24,
    })
  })

  it("rejects generic details and inconsistent candidates", () => {
    expect(parseD100RollDetails({ rolls: [] })).toBeNull()
    expect(
      parseD100RollDetails({
        mode: "penalty",
        units: 4,
        tens: [2, 4],
        candidates: [24, 54],
        selected: 54,
      }),
    ).toBeNull()
  })
})
