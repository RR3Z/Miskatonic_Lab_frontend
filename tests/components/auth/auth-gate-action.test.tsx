import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { AuthGateAction } from "@/components/auth/auth-gate-action"

const clerkState = vi.hoisted(() => ({
  signedIn: false,
}))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => <button aria-label="User menu" type="button" />,
  useUser: () => ({ isSignedIn: clerkState.signedIn }),
}))

describe("AuthGateAction", () => {
  it("renders link when signed in", () => {
    clerkState.signedIn = true

    render(<AuthGateAction href="/characters">Открыть архив</AuthGateAction>)

    const link = screen.getByRole("link", { name: /открыть архив/i })
    expect(link).toHaveAttribute("href", "/characters")
  })

  it("renders sign-in button when signed out", () => {
    clerkState.signedIn = false

    render(<AuthGateAction href="/characters">Открыть архив</AuthGateAction>)

    const button = screen.getByRole("button", { name: /открыть архив/i })
    expect(button).toBeInTheDocument()
    expect(button).not.toHaveAttribute("href")
  })

  it("passes variant and size props", () => {
    clerkState.signedIn = false

    const { container } = render(
      <AuthGateAction href="/test" size="sm" variant="outline">
        Test
      </AuthGateAction>,
    )

    const button = container.querySelector('[data-slot="button"]')
    expect(button).toHaveAttribute("data-variant", "outline")
    expect(button).toHaveAttribute("data-size", "sm")
  })
})
