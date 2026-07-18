import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { MadnessText } from "@/components/effects/madness-text/madness-text"

const motionState = vi.hoisted(() => ({ reduced: false }))

vi.mock("motion/react", () => ({
  useReducedMotion: () => motionState.reduced,
}))

describe("MadnessText", () => {
  beforeEach(() => {
    motionState.reduced = false
  })

  afterEach(() => {
    vi.useRealTimers()
  })

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
    expect(button).toHaveAttribute("data-slot", "button")
    expect(button).toHaveAttribute("data-variant", "link")
    expect(button).toHaveAttribute("data-state", "idle")
  })

  it("keeps automatic and hover glitches disabled for reduced motion", () => {
    motionState.reduced = true
    vi.useFakeTimers()
    render(
      <MadnessText maxAutoDelayMs={1} minAutoDelayMs={1}>
        Test
      </MadnessText>,
    )

    const button = screen.getByRole("button")
    act(() => vi.advanceTimersByTime(10_000))
    fireEvent.mouseEnter(button)

    expect(button).toHaveAttribute("data-state", "idle")
  })
})
