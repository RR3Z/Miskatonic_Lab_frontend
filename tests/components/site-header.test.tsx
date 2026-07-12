import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { SiteHeader } from "@/components/layout/site-header"

const clerkState = vi.hoisted(() => ({ signedIn: false }))

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  SignOutButton: ({ children }: { children: React.ReactNode }) => children,
  UserAvatar: () => <span data-testid="user-avatar" />,
  UserButton: () => <button aria-label="User menu" type="button" />,
  useClerk: () => ({ openUserProfile: vi.fn() }),
  useUser: () => ({
    isLoaded: true,
    isSignedIn: clerkState.signedIn,
    user: clerkState.signedIn
      ? {
          fullName: "Артур Кэллахан",
          primaryEmailAddress: { emailAddress: "arthur@example.com" },
          username: "arthur",
        }
      : null,
  }),
}))

describe("SiteHeader", () => {
  beforeEach(() => {
    clerkState.signedIn = false
  })

  it("keeps the desktop three-column composition", () => {
    const { container } = render(<SiteHeader />)

    expect(container.querySelector("header")).toHaveClass(
      "sm:grid",
      "sm:grid-cols-[1fr_auto_1fr]",
    )
    expect(
      screen.getByRole("link", { name: /Miskatonic Lab home/i }),
    ).toHaveClass("sm:justify-self-start")
    expect(
      screen.getByRole("navigation", { name: "Основная навигация" }),
    ).toHaveClass("sm:justify-self-center")
  })

  it("keeps desktop Clerk user controls when signed in", () => {
    clerkState.signedIn = true
    render(<SiteHeader />)

    expect(screen.getByRole("button", { name: /user menu/i })).toBeVisible()
  })

  it("opens and closes the composed mobile drawer", async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)

    const trigger = screen.getByRole("button", { name: "Открыть меню" })
    expect(trigger).toHaveClass("sm:hidden")

    await user.click(trigger)

    expect(screen.getByRole("dialog")).toBeVisible()
    expect(screen.getByRole("heading", { name: "Меню" })).toBeVisible()
    expect(
      screen.getByRole("navigation", { name: "Мобильная навигация" }),
    ).toBeVisible()
    expect(screen.getByText("© 2026 Miskatonic Lab")).toBeVisible()

    await user.click(screen.getByRole("button", { name: "Закрыть меню" }))

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
