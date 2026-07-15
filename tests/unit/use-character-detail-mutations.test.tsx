import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { characterQueryKeys } from "@/lib/api/character-query-keys"
import type { CharacterDetail, CharacterHealth } from "@/types/character"
import { characterDetailFixture } from "../fixtures/character-detail"

const authState = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  userId: "user-a" as string | null,
}))

const apiMocks = vi.hoisted(() => ({
  updateCharacterProfile: vi.fn(),
  updateCharacterResource: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => authState,
}))

vi.mock("@/lib/api/character-profile", () => ({
  updateCharacterProfile: apiMocks.updateCharacterProfile,
}))

vi.mock("@/lib/api/character-resources", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/lib/api/character-resources")>()
  return {
    ...original,
    updateCharacterResource: apiMocks.updateCharacterResource,
  }
})

import { useUpdateCharacterProfile } from "@/lib/api/use-character-profile"
import { useUpdateCharacterResource } from "@/lib/api/use-character-resources"

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

describe("character detail mutation cache", () => {
  beforeEach(() => {
    authState.userId = "user-a"
    apiMocks.updateCharacterProfile.mockReset()
    apiMocks.updateCharacterResource.mockReset()
  })

  it("merges only the submitted patch into the active user's profile cache", async () => {
    const queryClient = createQueryClient()
    const activeKey = characterQueryKeys.detail("user-a", "character-1")
    const foreignKey = characterQueryKeys.detail("user-b", "character-1")
    const original = characterDetailFixture()
    queryClient.setQueryData(activeKey, original)
    queryClient.setQueryData(foreignKey, original)
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries")
    apiMocks.updateCharacterProfile.mockResolvedValue({
      ...original,
      age: 99,
      name: "Генри Армитедж",
    })
    const { result } = renderHook(
      () => useUpdateCharacterProfile("character-1"),
      { wrapper: wrapper(queryClient) },
    )

    await act(() =>
      result.current.mutateAsync({
        name: "Генри Армитедж",
      }),
    )

    expect(queryClient.getQueryData<CharacterDetail>(activeKey)?.name).toBe(
      "Генри Армитедж",
    )
    expect(queryClient.getQueryData<CharacterDetail>(foreignKey)?.name).toBe(
      original.name,
    )
    expect(queryClient.getQueryData<CharacterDetail>(activeKey)?.age).toBe(
      original.age,
    )
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: activeKey })
  })

  it("serializes rapid profile patches for the same character", async () => {
    const queryClient = createQueryClient()
    const queryKey = characterQueryKeys.detail("user-a", "character-1")
    const original = characterDetailFixture()
    queryClient.setQueryData(queryKey, original)
    let resolveFirst: (value: CharacterDetail) => void = () => undefined
    let resolveSecond: (value: CharacterDetail) => void = () => undefined
    apiMocks.updateCharacterProfile
      .mockImplementationOnce(
        () =>
          new Promise<CharacterDetail>((resolve) => {
            resolveFirst = resolve
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<CharacterDetail>((resolve) => {
            resolveSecond = resolve
          }),
      )
    const { result } = renderHook(
      () => useUpdateCharacterProfile("character-1"),
      { wrapper: wrapper(queryClient) },
    )
    let firstSave: Promise<unknown>
    let secondSave: Promise<unknown>

    act(() => {
      firstSave = result.current.mutateAsync({ occupation: "Антиквар" })
      secondSave = result.current.mutateAsync({ age: 42 })
    })

    await waitFor(() =>
      expect(apiMocks.updateCharacterProfile).toHaveBeenCalledTimes(1),
    )
    await act(async () => {
      resolveFirst({ ...original, occupation: "Антиквар" })
      await firstSave
    })
    await waitFor(() =>
      expect(apiMocks.updateCharacterProfile).toHaveBeenCalledTimes(2),
    )
    await act(async () => {
      resolveSecond({ ...original, age: 42 })
      await secondSave
    })

    expect(apiMocks.updateCharacterProfile).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      "character-1",
      { occupation: "Антиквар" },
    )
    expect(apiMocks.updateCharacterProfile).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      "character-1",
      { age: 42 },
    )
    expect(queryClient.getQueryData<CharacterDetail>(queryKey)).toMatchObject({
      age: 42,
      occupation: "Антиквар",
    })
  })

  it("patches the matching resource and leaves cache unchanged on failure", async () => {
    const queryClient = createQueryClient()
    const queryKey = characterQueryKeys.detail("user-a", "character-1")
    const original = characterDetailFixture()
    queryClient.setQueryData(queryKey, original)
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries")
    const updatedHealth: CharacterHealth = {
      ...original.hp,
      current_hp: 7,
    }
    apiMocks.updateCharacterResource.mockResolvedValueOnce({
      resource: "hp",
      value: updatedHealth,
    })
    const { result } = renderHook(
      () => useUpdateCharacterResource("character-1"),
      { wrapper: wrapper(queryClient) },
    )

    await act(() =>
      result.current.mutateAsync({
        resource: "hp",
        values: { current_hp: 7 },
      }),
    )

    expect(queryClient.getQueryData<CharacterDetail>(queryKey)?.hp).toEqual(
      updatedHealth,
    )
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey })

    invalidateQueries.mockClear()
    const cachedAfterSuccess = queryClient.getQueryData(queryKey)
    apiMocks.updateCharacterResource.mockRejectedValueOnce(
      new Error("network failed"),
    )

    await expect(
      act(() =>
        result.current.mutateAsync({
          resource: "hp",
          values: { current_hp: 3 },
        }),
      ),
    ).rejects.toThrow("network failed")

    expect(queryClient.getQueryData(queryKey)).toEqual(cachedAfterSuccess)
    expect(invalidateQueries).not.toHaveBeenCalled()
  })
})
