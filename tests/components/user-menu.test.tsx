import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <button aria-label="User menu" type="button" />,
}))

import { UserMenu } from "@/components/auth/user-menu"

describe("UserMenu", () => {
  it("renders UserButton", () => {
    render(<UserMenu />)

    expect(screen.getByRole("button", { name: /user menu/i })).toBeVisible()
  })
})
