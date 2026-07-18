import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { AuthQueryCacheBoundary } from "@/lib/api/auth-query-cache-boundary"
import { characterQueryKeys } from "@/lib/api/character-query-keys"

const authState = vi.hoisted(() => ({
  isLoaded: true,
  userId: "user-a" as string | null,
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => authState,
}))

describe("AuthQueryCacheBoundary", () => {
  beforeEach(() => {
    authState.isLoaded = true
    authState.userId = "user-a"
  })

  it("removes only the previous user's character cache", async () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(characterQueryKeys.list("user-a"), ["a"])
    queryClient.setQueryData(characterQueryKeys.list("user-b"), ["b"])
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <AuthQueryCacheBoundary>
          <span>content</span>
        </AuthQueryCacheBoundary>
      </QueryClientProvider>,
    )

    authState.userId = "user-b"
    rerender(
      <QueryClientProvider client={queryClient}>
        <AuthQueryCacheBoundary>
          <span>content</span>
        </AuthQueryCacheBoundary>
      </QueryClientProvider>,
    )

    await waitFor(() =>
      expect(
        queryClient.getQueryData(characterQueryKeys.list("user-a")),
      ).toBeUndefined(),
    )
    expect(queryClient.getQueryData(characterQueryKeys.list("user-b"))).toEqual(
      ["b"],
    )

    authState.userId = null
    rerender(
      <QueryClientProvider client={queryClient}>
        <AuthQueryCacheBoundary>
          <span>content</span>
        </AuthQueryCacheBoundary>
      </QueryClientProvider>,
    )

    await waitFor(() =>
      expect(
        queryClient.getQueryData(characterQueryKeys.list("user-b")),
      ).toBeUndefined(),
    )
  })
})
