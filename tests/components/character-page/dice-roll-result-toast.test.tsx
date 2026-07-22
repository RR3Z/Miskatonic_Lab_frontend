import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { DiceRollResultToast } from "@/components/character/detail/header/dice-result-toast/dice-roll-result-toast"

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

  it("keeps long characteristic outcomes on the structured two-line layout", () => {
    render(
      <DiceRollResultToast
        outcome="critical_success"
        result={1}
        title="Очень длинное название характеристики"
      />,
    )

    expect(
      screen.getByText("Очень длинное название характеристики"),
    ).toHaveClass("whitespace-nowrap")
    expect(screen.getByText("критический успех")).toHaveClass(
      "whitespace-nowrap",
    )
  })

  it("compares d100 candidates and marks the selected penalty result", () => {
    render(
      <DiceRollResultToast
        details={{
          mode: "penalty",
          units: 3,
          tens: [8, 5],
          candidates: [83, 53],
          selected: 83,
        }}
        outcome="regular_success"
        result={83}
        title="Сила"
      />,
    )

    expect(screen.getByTestId("d100-roll-details")).toHaveTextContent(
      "Помеха — взят больший результат",
    )
    expect(screen.getByTestId("d100-roll-details")).toHaveTextContent(
      "Общая единица: 3",
    )
    expect(screen.getByTestId("d100-roll-candidate-0")).toHaveTextContent(
      "Взят83Десяток 8",
    )
    expect(screen.getByTestId("d100-roll-candidate-0")).toHaveClass(
      "border-[var(--ml-accent-danger)]",
    )
    expect(screen.getByTestId("d100-roll-candidate-1")).toHaveTextContent(
      "Не взят53Десяток 5",
    )
  })

  it("marks the lower candidate with the success accent for advantage", () => {
    render(
      <DiceRollResultToast
        details={{
          mode: "bonus",
          units: 5,
          tens: [7, 2],
          candidates: [75, 25],
          selected: 25,
        }}
        outcome="regular_success"
        result={25}
        title="Сила"
      />,
    )

    expect(screen.getByTestId("d100-roll-details")).toHaveTextContent(
      "Преимущество — взят меньший результат",
    )
    expect(screen.getByTestId("d100-roll-candidate-0")).toHaveTextContent(
      "Не взят75Десяток 7",
    )
    expect(screen.getByTestId("d100-roll-candidate-1")).toHaveTextContent(
      "Взят25Десяток 2",
    )
    expect(screen.getByTestId("d100-roll-candidate-1")).toHaveClass(
      "border-[var(--ml-accent-success)]",
    )
  })

  it("renders identical d100 candidates without duplicate React keys", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    try {
      render(
        <DiceRollResultToast
          details={{
            mode: "bonus",
            units: 5,
            tens: [0, 0],
            candidates: [5, 5],
            selected: 5,
          }}
          outcome="regular_success"
          result={5}
          title="Сила"
        />,
      )

      expect(screen.getByTestId("d100-roll-candidate-0")).toBeVisible()
      expect(screen.getByTestId("d100-roll-candidate-1")).toBeVisible()
      expect(consoleError).not.toHaveBeenCalled()
    } finally {
      consoleError.mockRestore()
    }
  })

  it("does not show comparison details for a normal d100 roll", () => {
    render(
      <DiceRollResultToast
        details={{
          mode: "normal",
          units: 3,
          tens: [8],
          candidates: [83],
          selected: 83,
        }}
        outcome="regular_success"
        result={83}
        title="Сила"
      />,
    )

    expect(screen.queryByTestId("d100-roll-details")).not.toBeInTheDocument()
  })
})
