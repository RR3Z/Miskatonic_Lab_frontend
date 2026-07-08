import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { LandingHeader } from "@/components/landing/landing-header"

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => <button aria-label="User menu" type="button" />,
  useUser: () => ({ isSignedIn: false }),
}))

describe("LandingHeader", () => {
  it("renders brand mark with home link", () => {
    render(<LandingHeader />)

    const homeLink = screen.getByRole("link", { name: /Miskatonic Lab home/i })
    expect(homeLink).toHaveAttribute("href", "/")
    expect(screen.getByAltText("Miskatonic Lab")).toBeInTheDocument()
  })

  it("renders sign-in button when signed out", () => {
    render(<LandingHeader />)

    expect(screen.getByRole("button", { name: /войти/i })).toBeVisible()
  })
})
