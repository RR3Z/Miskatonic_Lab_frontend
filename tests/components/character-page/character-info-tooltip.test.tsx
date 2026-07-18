import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { CharacterInfoTooltip } from "@/components/character/detail/character-info-tooltip"
import { CharacterSheetTooltipProvider } from "@/components/character/detail/character-sheet-tooltip"

describe("CharacterInfoTooltip", () => {
  it("opens shared tooltip from accessible info button", async () => {
    const user = userEvent.setup()
    render(
      <CharacterSheetTooltipProvider>
        <CharacterInfoTooltip
          ariaLabel="Информация о тестовом правиле"
          side="top"
          testId="test-info"
          triggerClassName="size-5 text-current"
        >
          <p>Текст тестового правила</p>
        </CharacterInfoTooltip>
      </CharacterSheetTooltipProvider>,
    )

    const trigger = screen.getByRole("button", {
      name: "Информация о тестовом правиле",
    })
    expect(trigger).toHaveAttribute("data-testid", "test-info")
    expect(trigger).toHaveClass("size-5", "text-current")

    await user.hover(trigger)

    await waitFor(() => {
      const tooltip = document.querySelector<HTMLElement>(
        '[data-slot="tooltip-content"]:not([data-state="closed"])',
      )
      expect(tooltip).toBeVisible()
      expect(tooltip).toHaveTextContent("Текст тестового правила")
    })
  })
})
