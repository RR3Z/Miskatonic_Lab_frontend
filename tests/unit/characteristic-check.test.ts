import { describe, expect, it } from "vitest"

import {
  classifyCharacteristicCheck,
  getCharacteristicCheckThresholds,
} from "@/lib/dice/characteristic-check"

describe("characteristic checks", () => {
  it("calculates half and fifth by rounding down", () => {
    expect(getCharacteristicCheckThresholds(53)).toEqual({
      base: 53,
      fifth: 10,
      half: 26,
    })
  })

  it("classifies critical, success levels, and failure", () => {
    expect(classifyCharacteristicCheck(53, 1).outcome).toBe("critical_success")
    expect(classifyCharacteristicCheck(53, 10).outcome).toBe("extreme_success")
    expect(classifyCharacteristicCheck(53, 26).outcome).toBe("hard_success")
    expect(classifyCharacteristicCheck(53, 53).outcome).toBe("regular_success")
    expect(classifyCharacteristicCheck(53, 54).outcome).toBe("failure")
  })

  it("uses the base value to determine a fumble range", () => {
    expect(classifyCharacteristicCheck(49, 96).outcome).toBe("fumble")
    expect(classifyCharacteristicCheck(49, 100).outcome).toBe("fumble")
    expect(classifyCharacteristicCheck(50, 96).outcome).toBe("failure")
    expect(classifyCharacteristicCheck(50, 99).outcome).toBe("failure")
    expect(classifyCharacteristicCheck(50, 100).outcome).toBe("fumble")
  })
})
