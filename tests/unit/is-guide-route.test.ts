import { describe, expect, it } from "vitest"

import { isGuideRoute } from "@/components/layout/utils/is-guide-route.util"

describe("isGuideRoute", () => {
  it.each([
    ["/guide", true],
    ["/guide/combat", true],
    ["/guide/occult#ritual-checklist", true],
    ["/", false],
    ["/characters", false],
    ["/guides", false],
    [null, false],
  ])("returns %s for %s", (pathname, expected) => {
    expect(isGuideRoute(pathname)).toBe(expected)
  })
})
