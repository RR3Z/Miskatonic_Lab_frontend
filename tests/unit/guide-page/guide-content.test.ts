import { describe, expect, it } from "vitest"
import {
  getGuideBlockHref,
  getGuideSearchResultHref,
} from "@/components/guide/utils/guide-route.util"
import { guideContent } from "@/lib/guide/guide-content"
import {
  getGuideSearchResults,
  getGuideSection,
} from "@/lib/guide/utils/guide-search.util"

describe("guide content", () => {
  it("keeps the eight player-facing guide sections", () => {
    expect(guideContent.sections.map((section) => section.slug)).toEqual([
      "checks",
      "creation",
      "investigation",
      "combat",
      "chases",
      "sanity",
      "occult",
      "development",
    ])

    expect(
      new Set(guideContent.sections.map((section) => section.slug)).size,
    ).toBe(guideContent.sections.length)
    expect(
      new Set(
        guideContent.sections.flatMap((section) =>
          section.blocks.map((block) => block.id),
        ),
      ).size,
    ).toBe(
      guideContent.sections.reduce(
        (count, section) => count + section.blocks.length,
        0,
      ),
    )
  })

  it("indexes explanatory text and formula cards for deep links", () => {
    expect(getGuideSearchResults("экстремальный успех")).toContainEqual(
      expect.objectContaining({
        blockId: "success-levels",
        sectionSlug: "checks",
      }),
    )

    expect(getGuideSearchResults("максимальный SAN")).toContainEqual(
      expect.objectContaining({
        blockId: "sanity-check",
        sectionSlug: "sanity",
      }),
    )

    expect(getGuideSearchResults("кредитный рейтинг")).toContainEqual(
      expect.objectContaining({
        blockId: "finances-and-contacts",
        sectionSlug: "creation",
      }),
    )
  })

  it("does not produce a result for an empty query", () => {
    expect(getGuideSearchResults("   ")).toEqual([])
    expect(getGuideSection("unknown-section")).toBeUndefined()
  })

  it("indexes headings, formulas, diagrams, and every matching block", () => {
    expect(getGuideSearchResults("удача и форсирование")).toContainEqual(
      expect.objectContaining({
        blockId: "luck-and-push",
        sectionSlug: "checks",
      }),
    )
    expect(getGuideSearchResults("максимум ПМ")).toContainEqual(
      expect.objectContaining({
        blockId: "magic-cost",
        sectionSlug: "occult",
      }),
    )
    expect(getGuideSearchResults("условие прерывания")).toContainEqual(
      expect.objectContaining({
        blockId: "ritual-checklist",
        sectionSlug: "occult",
      }),
    )
    expect(getGuideSearchResults("проверка").length).toBeGreaterThan(8)
  })

  it("exposes every block as a nested catalogue link", () => {
    for (const section of guideContent.sections) {
      for (const block of section.blocks) {
        expect(getGuideBlockHref(section.slug, block.id)).toBe(
          `/guide/${section.slug}#${block.id}`,
        )
      }
    }
  })

  it("builds a result route with query, match, and block anchor", () => {
    const result = getGuideSearchResults("кредитный рейтинг")[0]

    if (!result) {
      throw new Error("Expected a searchable credit rating result")
    }

    expect(getGuideSearchResultHref(result, "кредитный рейтинг")).toBe(
      "/guide/creation?match=finances-and-contacts&q=%D0%BA%D1%80%D0%B5%D0%B4%D0%B8%D1%82%D0%BD%D1%8B%D0%B9+%D1%80%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3#finances-and-contacts",
    )
  })

  it("keeps the localized guide copy free from mojibake markers", () => {
    expect(JSON.stringify(guideContent)).not.toMatch(/Рџ|РЎ|Рљ|СЂ|вЂ/)
  })

  it("returns sections through the shared search utility", () => {
    expect(getGuideSection("combat")?.title).toBe("Бой")
  })
})
