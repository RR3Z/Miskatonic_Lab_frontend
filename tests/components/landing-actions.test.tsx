import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { LandingActions } from "@/components/landing/landing-actions"

const clerkState = vi.hoisted(() => ({
  signInProps: vi.fn(),
  signedIn: false,
}))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    forceRedirectUrl?: string
    mode: "modal"
  }) => {
    clerkState.signInProps(props)
    return children
  },
  UserButton: () => <button aria-label="User menu" type="button" />,
  useUser: () => ({ isSignedIn: clerkState.signedIn }),
}))

describe("LandingActions", () => {
  beforeEach(() => {
    clerkState.signInProps.mockClear()
  })

  it("renders both action buttons", () => {
    clerkState.signedIn = false

    render(<LandingActions />)

    expect(screen.getByRole("button", { name: /открыть архив/i })).toBeVisible()
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
    ).toHaveAttribute("href", "/characters?create=1")
  })

  it("returns signed-out users to the selected action", () => {
    clerkState.signedIn = false

    render(<LandingActions />)

    expect(clerkState.signInProps).toHaveBeenCalledWith({
      forceRedirectUrl: "/characters",
      mode: "modal",
    })
    expect(clerkState.signInProps).toHaveBeenCalledWith({
      forceRedirectUrl: "/characters?create=1",
      mode: "modal",
    })
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
