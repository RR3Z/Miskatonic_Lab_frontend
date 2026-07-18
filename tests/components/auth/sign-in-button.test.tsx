import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  signInProps: vi.fn(),
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
    mocks.signInProps(props)
    return <span>{children}</span>
  },
}))

import { CustomSignInButton } from "@/components/auth/sign-in-button"

describe("CustomSignInButton", () => {
  beforeEach(() => {
    mocks.signInProps.mockClear()
  })

  it("renders Button with children", () => {
    render(<CustomSignInButton>Войти</CustomSignInButton>)

    expect(screen.getByRole("button", { name: /войти/i })).toBeVisible()
  })

  it("passes variant and size to Button", () => {
    const { container } = render(
      <CustomSignInButton size="sm" variant="ghost">
        Войти
      </CustomSignInButton>,
    )

    const button = container.querySelector('[data-slot="button"]')
    expect(button).toHaveAttribute("data-variant", "ghost")
    expect(button).toHaveAttribute("data-size", "sm")
  })

  it("passes className to Button", () => {
    const { container } = render(
      <CustomSignInButton className="custom-class">Войти</CustomSignInButton>,
    )

    const button = container.querySelector('[data-slot="button"]')
    expect(button).toHaveClass("custom-class")
  })

  it("passes click handler to Button", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<CustomSignInButton onClick={onClick}>Войти</CustomSignInButton>)

    await user.click(screen.getByRole("button", { name: /войти/i }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it("passes the forced return URL to Clerk", () => {
    render(
      <CustomSignInButton forceRedirectUrl="/characters">
        Войти
      </CustomSignInButton>,
    )

    expect(mocks.signInProps).toHaveBeenCalledWith({
      forceRedirectUrl: "/characters",
      mode: "modal",
    })
  })
})
