import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { MadnessText } from "@/components/effects/madness-text/madness-text"

describe("MadnessText", () => {
  it("renders children text in sr-only span", () => {
    render(<MadnessText>США, Нью-Йорк, 15.01.1925</MadnessText>)

    const srOnly = screen.getAllByText("США, Нью-Йорк, 15.01.1925")
    expect(srOnly.length).toBe(2)
  })

  it("renders sr-only span with original text", () => {
    render(<MadnessText>США, Нью-Йорк, 15.01.1925</MadnessText>)

    const srOnly = screen.getAllByText("США, Нью-Йорк, 15.01.1925")
    expect(srOnly.length).toBe(2)
  })

  it("applies className to button", () => {
    const { container } = render(
      <MadnessText className="custom-class">Test</MadnessText>,
    )

    const button = container.querySelector("button")
    expect(button).toHaveClass("custom-class")
  })

  it("renders as button with type button", () => {
    render(<MadnessText>Test</MadnessText>)

    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("type", "button")
  })
})
