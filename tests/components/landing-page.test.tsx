import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { LandingPage } from "@/components/landing/landing-page"

const clerkState = vi.hoisted(() => ({
  signedIn: false,
}))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => <button aria-label="User menu" type="button" />,
  useUser: () => ({ isSignedIn: clerkState.signedIn }),
}))

describe("LandingPage", () => {
  beforeEach(() => {
    clerkState.signedIn = false
  })

  it("renders signed-out case-file actions", () => {
    render(<LandingPage />)

    expect(
      screen.getByRole("heading", { name: /miskatonic lab/i }),
    ).toBeVisible()
    expect(screen.getByRole("button", { name: /войти/i })).toBeVisible()
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
  })

  it("links case-file actions after sign in", () => {
    clerkState.signedIn = true

    render(<LandingPage />)

    expect(screen.getByRole("button", { name: /user menu/i })).toBeVisible()
    const archiveLinks = screen.getAllByRole("link", {
      name: /открыть архив/i,
    })
    expect(archiveLinks.length).toBeGreaterThanOrEqual(1)
    expect(archiveLinks[0]).toHaveAttribute("href", "/characters")
    const createLinks = screen.getAllByRole("link", {
      name: /создать сыщика/i,
    })
    expect(createLinks.length).toBeGreaterThanOrEqual(1)
    expect(createLinks[0]).toHaveAttribute("href", "/characters/new")
  })

  it("renders footer contacts", () => {
    render(<LandingPage />)

    expect(
      screen.getByRole("link", { name: /telegram @roger3z/i }),
    ).toHaveAttribute("href", "https://t.me/RogeR3Z")
    expect(screen.getByRole("link", { name: /github rr3z/i })).toHaveAttribute(
      "href",
      "https://github.com/RR3Z",
    )
  })

  it("renders radial background", () => {
    render(<LandingPage />)

    expect(screen.getByTestId("landing-radial-background")).toBeVisible()
    expect(screen.getByTestId("landing-radial-background")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  })

  it("renders investigator names", () => {
    render(<LandingPage />)

    expect(screen.getByText("Артур Нейтан Кэллахан")).toBeVisible()
    expect(screen.getByText("Эдриан Джоэл Дювен")).toBeVisible()
    expect(screen.getByText("Дороти Дотти Эйнсворт")).toBeVisible()
    expect(screen.getByText("Рэймонд Рэй Андервуд")).toBeVisible()
  })

  it("renders case meta data", () => {
    render(<LandingPage />)

    expect(screen.getByText("Маски Ньярлатхотепа")).toBeVisible()
    expect(screen.getByText("Наивысший")).toBeVisible()
    expect(screen.getByText("Материалы сверяются...")).toBeVisible()
  })

  it("renders close stamp", () => {
    render(<LandingPage />)

    expect(screen.getByTitle("Закрыто")).toBeInTheDocument()
  })
})
