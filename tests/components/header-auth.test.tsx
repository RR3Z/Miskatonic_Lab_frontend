import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { HeaderAuth } from "@/components/auth/header-auth"

const clerkState = vi.hoisted(() => ({
  signedIn: false,
}))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => <button aria-label="User menu" type="button" />,
  useUser: () => ({ isSignedIn: clerkState.signedIn }),
}))

describe("HeaderAuth", () => {
  it("renders sign-in button when signed out", () => {
    clerkState.signedIn = false

    render(<HeaderAuth>Войти</HeaderAuth>)

    expect(screen.getByRole("button", { name: /войти/i })).toBeVisible()
  })

  it("renders user menu when signed in", () => {
    clerkState.signedIn = true

    render(<HeaderAuth>Войти</HeaderAuth>)

    expect(screen.getByRole("button", { name: /user menu/i })).toBeVisible()
  })

  it("passes className to sign-in button when signed out", () => {
    clerkState.signedIn = false

    const { container } = render(
      <HeaderAuth className="custom-class">Войти</HeaderAuth>,
    )

    const button = container.querySelector('[data-slot="button"]')
    expect(button).toBeInTheDocument()
  })
})
