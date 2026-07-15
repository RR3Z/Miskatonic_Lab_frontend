import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DiceRollResultToast } from "@/components/character/detail/header/dice-roll-result-toast"

describe("DiceRollResultToast", () => {
  it("separates the characteristic, d100 result, outcome, and thresholds", () => {
    render(
      <DiceRollResultToast
        outcome="regular_success"
        result={42}
        title="Сила"
      />,
    )

    expect(
      screen.queryByText("ПРОВЕРКА ХАРАКТЕРИСТИКИ"),
    ).not.toBeInTheDocument()
    expect(screen.getByText("Сила")).toBeVisible()
    expect(screen.getByText("D100")).toBeVisible()
    expect(screen.getByTestId("dice-roll-result")).toHaveClass(
      "h-full",
      "w-full",
    )
    expect(screen.getByTestId("dice-roll-value")).toHaveClass(
      "rounded-full",
      "bg-transparent",
    )
    expect(screen.getByTestId("dice-roll-value")).toHaveTextContent("42")
    expect(screen.getByText("обычный успех")).toBeVisible()
    expect(screen.getByText("обычный успех")).toHaveClass("uppercase")
    expect(screen.queryByText("База")).not.toBeInTheDocument()
  })
})
