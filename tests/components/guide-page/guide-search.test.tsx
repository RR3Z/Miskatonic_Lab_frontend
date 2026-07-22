import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { GuideSearch } from "@/components/guide/search/guide-search"
import { getGuideSearchResults } from "@/lib/guide/utils/guide-search.util"

describe("GuideSearch", () => {
  it("shows results in a styled scroll area and links to the matched block", async () => {
    const user = userEvent.setup()
    const { container } = render(<GuideSearch />)

    await user.type(
      screen.getByRole("textbox", { name: "Поиск по справочнику" }),
      "погоня",
    )

    expect(screen.getByText("Погоня — это карта выбора")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /Погоня — это карта выбора/i }),
    ).toHaveAttribute(
      "href",
      "/guide/chases?match=chase-basics&q=%D0%BF%D0%BE%D0%B3%D0%BE%D0%BD%D1%8F#chase-basics",
    )
    expect(container.querySelector('[data-slot="scroll-area"]')).toHaveClass(
      "max-h-[min(30rem,calc(100svh-5rem))]",
      "[&_[data-slot=scroll-area-thumb]]:bg-(--ml-border-aged)",
    )
    expect(
      container.querySelector('[data-slot="scroll-area-scrollbar"]'),
    ).toBeInTheDocument()
  })

  it("focuses the field with Ctrl or Cmd K and renders an empty state", async () => {
    const user = userEvent.setup()
    render(<GuideSearch />)

    await user.keyboard("{Control>}k{/Control}")

    const input = screen.getByRole("textbox", {
      name: "Поиск по справочнику",
    })
    expect(input).toHaveFocus()

    await user.type(input, "несуществующий термин")
    expect(
      screen.getByText("Ничего не найдено. Попробуйте другой термин."),
    ).toBeVisible()
  })

  it("keeps every matching block in the scrollable result list and closes after selection", async () => {
    const user = userEvent.setup()
    const { container } = render(<GuideSearch />)
    const query = "проверка"
    const expectedResults = getGuideSearchResults(query)

    await user.type(
      screen.getByRole("textbox", { name: "Поиск по справочнику" }),
      query,
    )

    expect(expectedResults.length).toBeGreaterThan(8)
    expect(container.querySelectorAll("#guide-search-results li")).toHaveLength(
      expectedResults.length,
    )

    const firstResult = expectedResults[0]
    if (!firstResult) {
      throw new Error("Expected guide search result")
    }

    await user.click(
      screen.getByRole("link", {
        name: new RegExp(firstResult.title, "i"),
      }),
    )

    await waitFor(() => {
      expect(
        container.querySelector("#guide-search-results"),
      ).not.toBeInTheDocument()
    })
  })
})
