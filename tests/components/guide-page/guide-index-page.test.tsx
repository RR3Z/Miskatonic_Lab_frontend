import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { GuideIndexPage } from "@/components/guide/index/guide-index-page"
import { guideContent } from "@/lib/guide/guide-content"

vi.mock("@/components/guide/symbol/guide-symbol", () => ({
  GuideSymbol: () => <div aria-hidden="true" data-testid="guide-symbol" />,
}))

describe("GuideIndexPage", () => {
  it("renders the guide introduction and every section card", () => {
    render(<GuideIndexPage />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: guideContent.ui.index.title,
      }),
    ).toBeVisible()
    expect(screen.getByText(guideContent.ui.index.searchHint)).toBeVisible()

    for (const section of guideContent.sections) {
      expect(
        screen.getByRole("link", { name: new RegExp(section.title, "i") }),
      ).toHaveAttribute("href", `/guide/${section.slug}`)
    }
  })
})
