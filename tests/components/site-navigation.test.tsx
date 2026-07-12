import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { SiteNavigation } from "@/components/layout/site-navigation"

const clerkState = vi.hoisted(() => ({ signedIn: false }))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  useUser: () => ({ isSignedIn: clerkState.signedIn }),
}))

describe("SiteNavigation", () => {
  beforeEach(() => {
    clerkState.signedIn = false
  })

  it("renders desktop items without the mobile-only home link", () => {
    render(<SiteNavigation pathname="/" variant="desktop" />)

    expect(
      screen.queryByRole("link", { name: "Главная" }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Справочник/i })).toBeDisabled()
    expect(screen.getByText("WIP")).toBeVisible()
    expect(
      screen.getByRole("button", { name: /Список персонажей/i }),
    ).toBeVisible()
  })

  it("marks route prefixes active for signed-in navigation", () => {
    clerkState.signedIn = true
    render(<SiteNavigation pathname="/characters/new" variant="desktop" />)

    expect(
      screen.getByRole("link", { name: /Список персонажей/i }),
    ).toHaveAttribute("aria-current", "page")
  })

  it("renders mobile home and reports navigation", async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()
    render(
      <SiteNavigation onNavigate={onNavigate} pathname="/" variant="mobile" />,
    )

    const home = screen.getByRole("link", { name: "Главная" })
    expect(home).toHaveAttribute("href", "/")
    expect(home).toHaveAttribute("aria-current", "page")

    await user.click(home)

    expect(onNavigate).toHaveBeenCalledOnce()
  })
})
