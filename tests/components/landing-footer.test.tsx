import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { LandingFooter } from "@/components/landing/landing-footer"

describe("LandingFooter", () => {
  it("renders copyright text", () => {
    render(<LandingFooter />)

    expect(screen.getByText(/© 2026 Miskatonic Lab/)).toBeVisible()
  })

  it("renders legal notice", () => {
    render(<LandingFooter />)

    expect(screen.getByText(/Все права защищены/)).toBeVisible()
  })

  it("renders Telegram and GitHub links", () => {
    render(<LandingFooter />)

    expect(
      screen.getByRole("link", { name: /telegram @roger3z/i }),
    ).toHaveAttribute("href", "https://t.me/RogeR3Z")
    expect(screen.getByRole("link", { name: /github rr3z/i })).toHaveAttribute(
      "href",
      "https://github.com/RR3Z",
    )
  })
})
