import { fireEvent, render, screen } from "@testing-library/react"
import type * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { LandingPage } from "@/components/landing/landing-page"
import { SiteShell } from "@/components/layout/site-shell"
import { TooltipProvider } from "@/components/ui/tooltip"

const clerkState = vi.hoisted(() => ({
  signedIn: false,
}))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  SignOutButton: ({ children }: { children: React.ReactNode }) => children,
  UserAvatar: () => <span data-testid="user-avatar" />,
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

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

function renderLandingPage() {
  return render(
    <TooltipProvider>
      <SiteShell>
        <LandingPage />
      </SiteShell>
    </TooltipProvider>,
  )
}

function openSidebar() {
  const trigger = document.querySelector<HTMLButtonElement>(
    '[data-sidebar="trigger"]',
  )

  if (!trigger) {
    throw new Error("Sidebar trigger was not rendered")
  }

  fireEvent.click(trigger)
}

describe("LandingPage", () => {
  beforeEach(() => {
    clerkState.signedIn = false
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1280,
    })
  })

  it("renders signed-out case-file actions", () => {
    renderLandingPage()

    expect(
      screen.getByRole("heading", { name: /miskatonic lab/i }),
    ).toBeVisible()
    const archiveButtons = screen.getAllByRole("button", {
      name: /открыть архив/i,
    })
    expect(archiveButtons.length).toBeGreaterThanOrEqual(1)
    const createButtons = screen.getAllByRole("button", {
      name: /создать сыщика/i,
    })
    expect(createButtons.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("Маски Ньярлатхотепа")).toBeVisible()
    expect(screen.getByLabelText("Возможности Miskatonic Lab")).toBeVisible()
    expect(screen.getByTestId("infinite-marquee-track")).toBeVisible()

    openSidebar()
    expect(screen.getByRole("button", { name: /войти/i })).toBeVisible()
  })

  it("links case-file actions after sign in", () => {
    clerkState.signedIn = true

    renderLandingPage()

    const archiveLinks = screen.getAllByRole("link", {
      name: /открыть архив/i,
    })
    expect(archiveLinks.length).toBeGreaterThanOrEqual(1)
    expect(archiveLinks[0]).toHaveAttribute("href", "/characters")
    const createLinks = screen.getAllByRole("link", {
      name: /создать сыщика/i,
    })
    expect(createLinks.length).toBeGreaterThanOrEqual(1)
    expect(createLinks[0]).toHaveAttribute("href", "/characters?create=1")

    openSidebar()
    expect(screen.getByRole("button", { name: "Артур Кэллахан" })).toBeVisible()
  })

  it("renders footer contacts", () => {
    renderLandingPage()
    openSidebar()

    expect(screen.getAllByRole("link", { name: /telegram @roger3z/i })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "https://t.me/RogeR3Z" }),
      ]),
    )
    expect(screen.getAllByRole("link", { name: /github rr3z/i })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "https://github.com/RR3Z" }),
      ]),
    )
  })

  it("renders radial background", () => {
    renderLandingPage()

    expect(screen.getByTestId("landing-radial-background")).toBeVisible()
    expect(screen.getByTestId("landing-radial-background")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  })

  it("renders investigator names", () => {
    renderLandingPage()

    expect(screen.getByText("Артур Нейтан Кэллахан")).toBeVisible()
    expect(screen.getByText("Эдриан Джоэл Дювен")).toBeVisible()
    expect(screen.getByText("Дороти Дотти Эйнсворт")).toBeVisible()
    expect(screen.getByText("Рэймонд Рэй Андервуд")).toBeVisible()
  })

  it("renders case meta data", () => {
    renderLandingPage()

    expect(screen.getByText("Маски Ньярлатхотепа")).toBeVisible()
    expect(screen.getByText("Наивысший")).toBeVisible()
    expect(screen.getByText("Материалы сверяются...")).toBeVisible()
  })

  it("renders close stamp", () => {
    renderLandingPage()

    expect(screen.getByTitle("Закрыто")).toBeInTheDocument()
  })
})
