import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { LandingBackground } from "@/components/landing/landing-background"

describe("LandingBackground", () => {
  it("renders with data-testid", () => {
    render(<LandingBackground />)

    expect(screen.getByTestId("landing-radial-background")).toBeVisible()
  })

  it("is aria-hidden", () => {
    render(<LandingBackground />)

    expect(screen.getByTestId("landing-radial-background")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  })

  it("has pointer-events-none class", () => {
    const { container } = render(<LandingBackground />)

    expect(container.firstChild).toHaveClass("pointer-events-none")
  })
})
