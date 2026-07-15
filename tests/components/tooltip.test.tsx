import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

describe("Tooltip", () => {
  it("uses the increased text size globally", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Подсказка</TooltipTrigger>
          <TooltipContent>Общий tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    expect(screen.getByRole("tooltip")).toBeVisible()
    expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveClass(
      "text-sm",
    )
  })

  it("wraps content in ScrollArea only when scrollable", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Scroll tooltip</TooltipTrigger>
          <TooltipContent scrollable>Long tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    expect(screen.getByRole("tooltip")).toBeVisible()
    expect(document.querySelector('[data-slot="scroll-area"]')).toBeVisible()
    expect(
      document.querySelector('[data-slot="scroll-area-viewport"]'),
    ).toHaveTextContent("Long tooltip")
  })
})
