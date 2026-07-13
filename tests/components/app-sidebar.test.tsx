import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { getMobileUserDisplayName } from "@/components/auth/mobile-user-controls.utils"
import { SiteShell } from "@/components/layout/site-shell"
import { TooltipProvider } from "@/components/ui/tooltip"

const clerkState = vi.hoisted(() => ({
  loaded: true,
  openUserProfile: vi.fn(),
  pathname: "/",
  signedIn: false,
  user: {
    fullName: "Артур Кэллахан",
    primaryEmailAddress: { emailAddress: "arthur@example.com" },
    username: "arthur",
  },
}))

vi.mock("next/navigation", () => ({
  usePathname: () => clerkState.pathname,
}))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  SignOutButton: ({ children }: { children: React.ReactNode }) => children,
  UserAvatar: () => <span data-testid="user-avatar" />,
  useClerk: () => ({ openUserProfile: clerkState.openUserProfile }),
  useUser: () => ({
    isLoaded: clerkState.loaded,
    isSignedIn: clerkState.signedIn,
    user: clerkState.signedIn ? clerkState.user : null,
  }),
}))

function renderAppShell() {
  return render(
    <TooltipProvider>
      <SiteShell>
        <div data-testid="page-content" />
      </SiteShell>
    </TooltipProvider>,
  )
}

function getSidebarTrigger(container: HTMLElement) {
  const trigger = container.querySelector<HTMLButtonElement>(
    '[data-sidebar="trigger"]',
  )

  if (!trigger) {
    throw new Error("Sidebar trigger was not rendered")
  }

  return trigger
}

describe("AppSidebar", () => {
  beforeEach(() => {
    clerkState.loaded = true
    clerkState.openUserProfile.mockClear()
    clerkState.pathname = "/"
    clerkState.signedIn = false
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1280,
    })
  })

  it("renders a persistent desktop rail and expands over the content", async () => {
    const { container } = renderAppShell()
    const user = userEvent.setup()
    const sidebar = container.querySelector('[data-slot="sidebar"][data-state]')
    const sidebarGap = container.querySelector('[data-slot="sidebar-gap"]')
    const trigger = getSidebarTrigger(container)

    expect(sidebar).toHaveAttribute("data-overlay", "true")
    expect(sidebar).toHaveAttribute("data-state", "collapsed")
    expect(sidebarGap).toHaveClass("w-(--sidebar-width-icon)")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    await user.click(trigger)
    expect(sidebar).toHaveAttribute("data-state", "expanded")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(sidebarGap).toHaveClass("w-(--sidebar-width-icon)")

    expect(screen.getByRole("link", { name: "Главная" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(screen.getByRole("button", { name: /Справочник/i })).toBeDisabled()
    expect(screen.getByText("WIP")).toBeVisible()
    expect(
      screen.getByRole("button", { name: "Список персонажей" }),
    ).toBeVisible()
    expect(screen.getByRole("button", { name: "Войти" })).toHaveClass(
      "cursor-pointer",
    )
    expect(
      screen
        .getByRole("link", { name: "Miskatonic Lab home" })
        .querySelector('[data-slot="sidebar-favicon"]'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Miskatonic Lab home" }),
    ).toHaveClass("justify-center")
    expect(
      container.querySelector('[data-slot="site-shell-content"]'),
    ).not.toHaveClass("pt-14")
    expect(trigger).toHaveClass(
      "rounded-l-none",
      "border-l-0",
      "left-0",
      "md:left-[var(--sidebar-width-icon)]",
      "md:group-data-[state=expanded]/sidebar-wrapper:left-[var(--sidebar-width)]",
    )
  })

  it("marks an authenticated route active", async () => {
    clerkState.pathname = "/characters/new"
    clerkState.signedIn = true
    const { container } = renderAppShell()
    const user = userEvent.setup()

    await user.click(getSidebarTrigger(container))

    expect(
      screen.getByRole("link", { name: "Список персонажей" }),
    ).toHaveAttribute("aria-current", "page")
  })

  it("opens navigation as a Sheet on mobile and closes after navigation", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 375,
    })
    const user = userEvent.setup()
    const { container } = renderAppShell()

    await user.click(getSidebarTrigger(container))

    expect(screen.getByRole("dialog")).toBeVisible()
    expect(screen.getByRole("dialog")).toHaveClass(
      "w-(--sidebar-width)!",
      "max-w-[86vw]",
    )
    expect(
      screen.getByRole("heading", { name: "Навигация" }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole("link", { name: "Главная" }))

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    )
  })

  it.each([768, 1280])(
    "keeps the icon rail visible at %ipx and expands without a dialog",
    async (width) => {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: width,
      })
      const user = userEvent.setup()
      const { container } = renderAppShell()
      const sidebar = container.querySelector(
        '[data-slot="sidebar"][data-state]',
      )

      expect(sidebar).toHaveAttribute("data-state", "collapsed")
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

      await user.click(getSidebarTrigger(container))

      expect(sidebar).toHaveAttribute("data-state", "expanded")
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

      await user.click(screen.getByRole("link", { name: "Главная" }))
      expect(sidebar).toHaveAttribute("data-state", "collapsed")
    },
  )

  it("opens Clerk profile from signed-in controls", async () => {
    clerkState.signedIn = true
    const { container } = renderAppShell()
    const user = userEvent.setup()

    await user.click(getSidebarTrigger(container))
    vi.useFakeTimers()

    const profileButton = screen.getByRole("button", {
      name: "Артур Кэллахан",
    })
    expect(profileButton).toHaveClass("cursor-pointer", "text-[1.05rem]")
    expect(screen.getByTestId("user-avatar")).toBeVisible()
    const signOutButton = screen.getByRole("button", { name: "Выйти" })
    expect(signOutButton).toBeVisible()
    expect(signOutButton.textContent).toBe("")
    expect(signOutButton).toHaveClass(
      "w-9!",
      "justify-center",
      "gap-0",
      "group-data-[collapsible=icon]:hidden",
    )
    expect(
      document.querySelector('[data-slot="sidebar-user-row"]'),
    ).toHaveClass("flex", "items-center")

    profileButton.click()
    expect(clerkState.openUserProfile).not.toHaveBeenCalled()

    await vi.runAllTimersAsync()

    expect(clerkState.openUserProfile).toHaveBeenCalledOnce()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
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
