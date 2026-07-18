import { render, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const clerkState = vi.hoisted(() => ({
  isLoaded: true,
  isSignedIn: false,
  openSignIn: vi.fn(),
  replace: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({
  useClerk: () => ({ openSignIn: clerkState.openSignIn }),
  useUser: () => ({
    isLoaded: clerkState.isLoaded,
    isSignedIn: clerkState.isSignedIn,
  }),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: clerkState.replace }),
}))

import { SignInIntent } from "@/components/auth/sign-in-intent"

describe("SignInIntent", () => {
  beforeEach(() => {
    clerkState.isLoaded = true
    clerkState.isSignedIn = false
    clerkState.openSignIn.mockClear()
    clerkState.replace.mockClear()
    window.history.replaceState({}, "", "/?sign-in=characters&source=guard")
  })

  it("consumes the intent and opens Clerk with a forced return URL", async () => {
    render(<SignInIntent returnTo="/characters" />)

    await waitFor(() =>
      expect(clerkState.openSignIn).toHaveBeenCalledWith({
        forceRedirectUrl: "/characters",
      }),
    )
    expect(window.location.pathname).toBe("/")
    expect(window.location.search).toBe("?source=guard")
    expect(clerkState.replace).not.toHaveBeenCalled()
  })

  it("sends an already signed-in user directly to the target", async () => {
    clerkState.isSignedIn = true

    render(<SignInIntent returnTo="/characters" />)

    await waitFor(() =>
      expect(clerkState.replace).toHaveBeenCalledWith("/characters"),
    )
    expect(clerkState.openSignIn).not.toHaveBeenCalled()
  })

  it("waits until Clerk finishes loading", () => {
    clerkState.isLoaded = false

    render(<SignInIntent returnTo="/characters" />)

    expect(clerkState.openSignIn).not.toHaveBeenCalled()
    expect(clerkState.replace).not.toHaveBeenCalled()
    expect(window.location.search).toContain("sign-in=characters")
  })
})
