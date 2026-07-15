import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const authState = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  userId: "user-a" as string | null,
}))

const apiMocks = vi.hoisted(() => ({
  makeCharacterDiceRoll: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => authState,
}))

vi.mock("@/lib/api/character-dice-rolls", () => ({
  makeCharacterDiceRoll: apiMocks.makeCharacterDiceRoll,
}))

import { useMakeCharacterDiceRoll } from "@/lib/api/use-character-dice-rolls"

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  })
}

function wrapper(queryClient: QueryClient) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe("useMakeCharacterDiceRoll", () => {
  beforeEach(() => {
    authState.userId = "user-a"
    apiMocks.makeCharacterDiceRoll.mockReset()
  })

  it("makes a d100 roll for the selected character", async () => {
    const queryClient = createQueryClient()
    apiMocks.makeCharacterDiceRoll.mockResolvedValue({ result: 42 })
    const { result } = renderHook(
      () => useMakeCharacterDiceRoll("character-1"),
      { wrapper: wrapper(queryClient) },
    )

    await act(() => result.current.mutateAsync())

    expect(apiMocks.makeCharacterDiceRoll).toHaveBeenCalledWith(
      expect.anything(),
      "character-1",
    )
  })
})
