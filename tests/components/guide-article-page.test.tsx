import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { GuideArticlePage } from "@/components/guide/article/guide-article-page"
import { guideContent } from "@/data/guide/guide-content.data"

vi.mock("@/components/guide/symbol/guide-symbol", () => ({
  GuideSymbol: () => <div aria-hidden="true" data-testid="guide-symbol" />,
}))

const checksSection = guideContent.sections.find(
  (section) => section.slug === "checks",
)

if (!checksSection) {
  throw new Error("Checks guide section is required for article tests")
}

describe("GuideArticlePage", () => {
  it("renders the article header and every block owned by the section", () => {
    render(<GuideArticlePage section={checksSection} />)

    expect(
      screen.getByRole("heading", { level: 1, name: checksSection.title }),
    ).toBeVisible()

    for (const block of checksSection.blocks) {
      expect(
        screen.getByRole("heading", { level: 2, name: block.title }),
      ).toBeVisible()
      expect(document.getElementById(block.id)).toBeInTheDocument()
    }
  })

  it("renders details, examples, formulas, lists, diagrams, and a match highlight", () => {
    const matchedBlock = checksSection.blocks.find(
      (block) => block.id === "success-levels",
    )

    if (
      !matchedBlock?.example ||
      !matchedBlock.formulas ||
      !matchedBlock.bullets
    ) {
      throw new Error(
        "Expected the success-levels fixture to include rich content",
      )
    }

    const { container } = render(
      <GuideArticlePage
        matchedBlockId={matchedBlock.id}
        section={checksSection}
      />,
    )

    expect(screen.getByText(matchedBlock.details?.[0] ?? "")).toBeVisible()
    expect(screen.getByText(matchedBlock.example.outcome)).toBeVisible()
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: new RegExp(matchedBlock.example.title, "i"),
      }),
    ).toBeVisible()
    expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(
      matchedBlock.bullets.length,
    )

    for (const formula of matchedBlock.formulas) {
      expect(screen.getByText(formula.expression)).toBeVisible()
    }

    expect(
      screen.getByRole("figure", {
        name: /схема проверки навыка от намерения до последствий/i,
      }),
    ).toBeVisible()
    expect(
      document
        .getElementById(matchedBlock.id)
        ?.querySelector('[aria-hidden="true"].pointer-events-none'),
    ).toBeInTheDocument()
    expect(container.querySelector("aside")).toBeInTheDocument()
  })
})
