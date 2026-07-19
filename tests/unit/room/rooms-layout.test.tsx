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

import RoomsLayout from "@/app/rooms/layout"

describe("RoomsLayout", () => {
  beforeEach(() => {
    mocks.auth.mockReset()
    mocks.hasConfiguredClerkKeys.mockReset()
    mocks.redirect.mockClear()
  })

  it("redirects a signed-out user to Rooms sign-in intent", async () => {
    mocks.hasConfiguredClerkKeys.mockReturnValue(true)
    mocks.auth.mockResolvedValue({ userId: null })

    await expect(
      RoomsLayout({ children: "content" as React.ReactNode }),
    ).rejects.toThrow("redirect:/?sign-in=rooms")
  })

  it("renders Rooms for a signed-in user", async () => {
    mocks.hasConfiguredClerkKeys.mockReturnValue(true)
    mocks.auth.mockResolvedValue({ userId: "user-1" })

    await expect(
      RoomsLayout({ children: "content" as React.ReactNode }),
    ).resolves.toBe("content")
  })
})
