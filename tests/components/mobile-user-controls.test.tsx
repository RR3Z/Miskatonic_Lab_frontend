import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { MobileUserControls } from "@/components/auth/mobile-user-controls"
import { getMobileUserDisplayName } from "@/components/auth/mobile-user-controls.utils"

const clerkState = vi.hoisted(() => ({
  loaded: true,
  openUserProfile: vi.fn(),
  signedIn: false,
  user: {
    fullName: "Артур Кэллахан",
    primaryEmailAddress: { emailAddress: "arthur@example.com" },
    username: "arthur",
  },
}))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  SignOutButton: ({
    children,
    redirectUrl,
  }: {
    children: React.ReactNode
    redirectUrl: string
  }) => <span data-redirect-url={redirectUrl}>{children}</span>,
  UserAvatar: () => <span data-testid="user-avatar" />,
  useClerk: () => ({ openUserProfile: clerkState.openUserProfile }),
  useUser: () => ({
    isLoaded: clerkState.loaded,
    isSignedIn: clerkState.signedIn,
    user: clerkState.signedIn ? clerkState.user : null,
  }),
}))

describe("MobileUserControls", () => {
  beforeEach(() => {
    clerkState.loaded = true
    clerkState.openUserProfile.mockClear()
    clerkState.signedIn = false
  })

  it("renders a loading placeholder while Clerk initializes", () => {
    clerkState.loaded = false
    const { container } = render(
      <MobileUserControls onNavigate={vi.fn()} signInLabel="Войти" />,
    )

    expect(container.firstElementChild).toHaveClass("h-10")
  })

  it("closes the menu from the guest sign-in trigger", async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()
    render(<MobileUserControls onNavigate={onNavigate} signInLabel="Войти" />)

    await user.click(screen.getByRole("button", { name: "Войти" }))

    expect(onNavigate).toHaveBeenCalledOnce()
  })

  it("shows identity and icon-only sign out on one row", () => {
    clerkState.signedIn = true
    render(<MobileUserControls onNavigate={vi.fn()} signInLabel="Войти" />)

    const profile = screen.getByRole("button", { name: "Артур Кэллахан" })
    const signOut = screen.getByRole("button", { name: "Выйти" })

    expect(profile.parentElement).toContainElement(signOut)
    expect(screen.getByTestId("user-avatar")).toBeVisible()
    expect(signOut).not.toHaveTextContent("Выйти")
    expect(signOut.parentElement).toHaveAttribute("data-redirect-url", "/")
  })

  it("closes navigation before opening the profile modal", async () => {
    clerkState.signedIn = true
    vi.useFakeTimers()
    const onNavigate = vi.fn()
    render(<MobileUserControls onNavigate={onNavigate} signInLabel="Войти" />)

    screen.getByRole("button", { name: "Артур Кэллахан" }).click()

    expect(onNavigate).toHaveBeenCalledOnce()
    expect(clerkState.openUserProfile).not.toHaveBeenCalled()

    await vi.runAllTimersAsync()

    expect(clerkState.openUserProfile).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })
})

describe("getMobileUserDisplayName", () => {
  it.each([
    [{ fullName: " Артур ", username: "arthur" }, "Артур"],
    [{ fullName: "", username: " arthur " }, "arthur"],
    [
      {
        fullName: null,
        primaryEmailAddress: { emailAddress: "arthur@example.com" },
        username: null,
      },
      "arthur@example.com",
    ],
    [{ fullName: null, username: null }, "Профиль"],
  ])("uses identity fallback order", (identity, expected) => {
    expect(getMobileUserDisplayName(identity)).toBe(expected)
  })
})
