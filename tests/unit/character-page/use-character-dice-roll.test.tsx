import { act, renderHook } from "@testing-library/react"
import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@tests/helpers/react-query"
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

import { useMakeCharacterDiceRoll } from "@/hooks/character/use-character-dice-rolls"

describe("useMakeCharacterDiceRoll", () => {
  beforeEach(() => {
    authState.userId = "user-a"
    apiMocks.makeCharacterDiceRoll.mockReset()
  })

  it("makes the requested roll for the selected character", async () => {
    const queryClient = createTestQueryClient()
    apiMocks.makeCharacterDiceRoll.mockResolvedValue({ result: 42 })
    const { result } = renderHook(
      () => useMakeCharacterDiceRoll("character-1"),
      { wrapper: createQueryClientWrapper(queryClient) },
    )

    await act(() => result.current.mutateAsync("+1d4"))

    expect(apiMocks.makeCharacterDiceRoll).toHaveBeenCalledWith(
      expect.anything(),
      "character-1",
      "+1d4",
    )
  })

  it("passes selected d100 mode to the API", async () => {
    const queryClient = createTestQueryClient()
    apiMocks.makeCharacterDiceRoll.mockResolvedValue({ result: 42 })
    const { result } = renderHook(
      () => useMakeCharacterDiceRoll("character-1"),
      { wrapper: createQueryClientWrapper(queryClient) },
    )

    await act(() =>
      result.current.mutateAsync({
        expression: "1d100",
        d100Mode: "penalty",
      }),
    )

    expect(apiMocks.makeCharacterDiceRoll).toHaveBeenCalledWith(
      expect.anything(),
      "character-1",
      { expression: "1d100", d100Mode: "penalty" },
    )
  })
})
