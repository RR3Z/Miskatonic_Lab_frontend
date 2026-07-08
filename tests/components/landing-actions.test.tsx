import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { LandingActions } from "@/components/landing/landing-actions"

const clerkState = vi.hoisted(() => ({
  signedIn: false,
}))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => <button aria-label="User menu" type="button" />,
  useUser: () => ({ isSignedIn: clerkState.signedIn }),
}))

describe("LandingActions", () => {
  it("renders both action buttons", () => {
    clerkState.signedIn = false

    render(<LandingActions />)

    expect(
      screen.getByRole("button", { name: /открыть архив/i }),
    ).toBeVisible()
    expect(
      screen.getByRole("button", { name: /создать сыщика/i }),
    ).toBeVisible()
  })

  it("renders links when signed in", () => {
    clerkState.signedIn = true

    render(<LandingActions />)

    expect(
      screen.getByRole("link", { name: /открыть архив/i }),
    ).toHaveAttribute("href", "/characters")
    expect(
      screen.getByRole("link", { name: /создать сыщика/i }),
    ).toHaveAttribute("href", "/characters/new")
  })

  it("accepts className and actionClassName props", () => {
    clerkState.signedIn = false

    const { container } = render(
      <LandingActions
        actionClassName="action-custom"
        className="wrapper-custom"
      />,
    )

    expect(container.firstChild).toHaveClass("wrapper-custom")
  })
})
