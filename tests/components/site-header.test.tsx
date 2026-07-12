import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { SiteHeader } from "@/components/layout/site-header"

const clerkState = vi.hoisted(() => ({ signedIn: false }))

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => <button aria-label="User menu" type="button" />,
  useUser: () => ({ isSignedIn: clerkState.signedIn }),
}))

describe("SiteHeader", () => {
  it("uses three desktop columns with navigation in the center column", () => {
    const { container } = render(<SiteHeader />)

    const header = container.querySelector("header")
    const navigation = screen.getByRole("navigation")
    const home = screen.getByRole("link", { name: /Miskatonic Lab home/i })

    expect(header).toHaveClass("sm:grid", "sm:grid-cols-[1fr_auto_1fr]")
    expect(home).toHaveClass("sm:justify-self-start")
    expect(navigation).toHaveClass("sm:justify-self-center")
    expect(navigation.nextElementSibling).toHaveClass("sm:justify-self-end")
  })

  it("keeps the same centered layout when signed in", () => {
    clerkState.signedIn = true
    const { container } = render(<SiteHeader />)

    expect(screen.getByRole("button", { name: /user menu/i })).toBeVisible()
    expect(container.querySelector("header")).toHaveClass(
      "sm:grid-cols-[1fr_auto_1fr]",
    )
    expect(screen.getByRole("navigation")).toHaveClass("sm:justify-self-center")
  })
})
