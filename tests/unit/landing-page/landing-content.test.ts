import { describe, expect, it } from "vitest"

import { landingContent } from "@/data/locales/utils/landing-content.util"
import { appRoutes } from "@/lib/routes/app-routes"

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value]
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectStrings)
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings)
  }

  return []
}

describe("landing content", () => {
  it("keeps supported route targets in one place", () => {
    expect(landingContent.caseFile.actions.openArchive.href).toBe(
      appRoutes.characters,
    )
    expect(landingContent.caseFile.actions.createInvestigator.href).toBe(
      appRoutes.newCharacter,
    )
  })

  it("contains readable UTF-8 Russian copy", () => {
    const allCopy = collectStrings(landingContent).join(" ")

    expect(allCopy).toContain("Открыть архив")
    expect(allCopy).toContain("Создать сыщика")
    expect(allCopy).toContain("Лист персонажа")
    expect(allCopy).not.toMatch(/Р[ђ-џ]|С[Њ-Џ]|вЂ|СЃ|С‹|Р°/)
  })

  it("keeps footer contacts current", () => {
    expect(landingContent.footer.links.telegram.href).toBe(
      "https://t.me/RogeR3Z",
    )
    expect(landingContent.footer.links.github.href).toBe(
      "https://github.com/RR3Z",
    )
  })
})
