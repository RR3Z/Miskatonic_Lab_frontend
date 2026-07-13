import type * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  hasConfiguredClerkKeys: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`redirect:${url}`)
  }),
}))

vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }))
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }))
vi.mock("@/lib/clerk/server-config", () => ({
  hasConfiguredClerkKeys: mocks.hasConfiguredClerkKeys,
}))

import CharactersLayout from "@/app/characters/layout"

describe("CharactersLayout", () => {
  beforeEach(() => {
    mocks.auth.mockReset()
    mocks.hasConfiguredClerkKeys.mockReset()
    mocks.redirect.mockClear()
  })

  it("fails closed when Clerk keys are not configured", async () => {
    mocks.hasConfiguredClerkKeys.mockReturnValue(false)

    await expect(
      CharactersLayout({ children: "content" as React.ReactNode }),
    ).rejects.toThrow("redirect:/")
    expect(mocks.auth).not.toHaveBeenCalled()
  })

  it("redirects a signed-out user through the modal intent", async () => {
    mocks.hasConfiguredClerkKeys.mockReturnValue(true)
    mocks.auth.mockResolvedValue({ userId: null })

    await expect(
      CharactersLayout({ children: "content" as React.ReactNode }),
    ).rejects.toThrow("redirect:/?sign-in=characters")
  })

  it("renders the protected route for a signed-in user", async () => {
    mocks.hasConfiguredClerkKeys.mockReturnValue(true)
    mocks.auth.mockResolvedValue({ userId: "user-1" })

    await expect(
      CharactersLayout({ children: "content" as React.ReactNode }),
    ).resolves.toBe("content")
    expect(mocks.redirect).not.toHaveBeenCalled()
  })
})
