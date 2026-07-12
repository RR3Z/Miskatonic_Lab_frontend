import { describe, expect, it } from "vitest"

import { getPortraitKind, getPortraitUrl } from "@/lib/utils/portrait.util"

describe("portrait utilities", () => {
  it("uses explicit portrait URL first", () => {
    expect(getPortraitUrl("https://example.test/portrait.webp", "female")).toBe(
      "https://example.test/portrait.webp",
    )
  })

  it("uses female placeholder for supported female values", () => {
    expect(getPortraitKind("female")).toBe("female")
    expect(getPortraitKind("Женщина")).toBe("female")
  })

  it("uses male placeholder when sex is empty or unknown", () => {
    expect(getPortraitKind(null)).toBe("male")
    expect(getPortraitKind("")).toBe("male")
    expect(getPortraitKind("unknown")).toBe("male")
    expect(getPortraitUrl(null, null)).toContain("male-placeholder")
  })
})
