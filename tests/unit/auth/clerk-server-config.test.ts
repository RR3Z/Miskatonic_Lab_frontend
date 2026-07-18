import { afterEach, describe, expect, it, vi } from "vitest"

import { hasConfiguredClerkKeys } from "@/lib/clerk/server-config"

describe("hasConfiguredClerkKeys", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("accepts a configured Clerk key pair", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_configured")
    vi.stubEnv("CLERK_SECRET_KEY", "sk_test_configured")

    expect(hasConfiguredClerkKeys()).toBe(true)
  })

  it.each([
    ["", "sk_test_configured"],
    ["pk_test_configured", ""],
    ["pk_test_replace_me", "sk_test_configured"],
    ["pk_test_configured", "sk_test_replace_me"],
  ])("rejects missing or placeholder keys", (publishableKey, secretKey) => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", publishableKey)
    vi.stubEnv("CLERK_SECRET_KEY", secretKey)

    expect(hasConfiguredClerkKeys()).toBe(false)
  })
})
