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
})
