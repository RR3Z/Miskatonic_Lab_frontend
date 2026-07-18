import { act, renderHook, waitFor } from "@testing-library/react"
import { characterDetailFixture } from "@tests/fixtures/character-detail"
import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@tests/helpers/react-query"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { characterQueryKeys } from "@/lib/api/character-query-keys"
import type { CharacterDetail, CharacterHealth } from "@/types/character"

const authState = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  userId: "user-a" as string | null,
}))

const apiMocks = vi.hoisted(() => ({
  fetchCharacter: vi.fn(),
  updateCharacterCharacteristics: vi.fn(),
  updateCharacterProfile: vi.fn(),
  updateCharacterResource: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => authState,
}))

vi.mock("@/lib/api/character-profile", () => ({
  updateCharacterProfile: apiMocks.updateCharacterProfile,
}))

vi.mock("@/lib/api/character-statistics", () => ({
  deleteCharacterCharacteristics: vi.fn(),
  updateCharacterCharacteristics: apiMocks.updateCharacterCharacteristics,
}))

vi.mock("@/lib/api/characters", () => ({
  fetchCharacter: apiMocks.fetchCharacter,
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
import { useUpdateCharacterCharacteristics } from "@/lib/api/use-character-statistics"

describe("character detail mutation cache", () => {
  beforeEach(() => {
    authState.userId = "user-a"
    apiMocks.fetchCharacter.mockReset()
    apiMocks.updateCharacterCharacteristics.mockReset()
    apiMocks.updateCharacterProfile.mockReset()
    apiMocks.updateCharacterResource.mockReset()
  })

  it("merges only the submitted patch into the active user's profile cache", async () => {
    const queryClient = createTestQueryClient()
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
      { wrapper: createQueryClientWrapper(queryClient) },
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
    const queryClient = createTestQueryClient()
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
      { wrapper: createQueryClientWrapper(queryClient) },
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
    const queryClient = createTestQueryClient()
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
      { wrapper: createQueryClientWrapper(queryClient) },
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

  it("refreshes derived stats from the backend after characteristics change", async () => {
    const queryClient = createTestQueryClient()
    const queryKey = characterQueryKeys.detail("user-a", "character-1")
    const original = characterDetailFixture()
    const characteristics = {
      ...original.characteristics,
      dexterity: 80,
      size: 40,
      strength: 70,
    }
    const derivedStats = {
      ...original.derived_stats,
      damage_bonus: "+1d4",
      dodge_value: 40,
      physique: 1,
      speed: 9,
    }
    queryClient.setQueryData(queryKey, original)
    apiMocks.updateCharacterCharacteristics.mockResolvedValue(characteristics)
    apiMocks.fetchCharacter.mockResolvedValue({
      ...original,
      characteristics,
      derived_stats: derivedStats,
    })

    const { result } = renderHook(
      () => useUpdateCharacterCharacteristics("character-1"),
      { wrapper: createQueryClientWrapper(queryClient) },
    )

    await act(() =>
      result.current.mutateAsync({
        appearance: characteristics.appearance,
        constitution: characteristics.constitution,
        dexterity: characteristics.dexterity,
        education: characteristics.education,
        intelligence: characteristics.intelligence,
        power: characteristics.power,
        size: characteristics.size,
        strength: characteristics.strength,
      }),
    )

    expect(apiMocks.fetchCharacter).toHaveBeenCalledWith(
      expect.anything(),
      "character-1",
    )
    expect(queryClient.getQueryData<CharacterDetail>(queryKey)).toMatchObject({
      characteristics,
      derived_stats: derivedStats,
    })
  })
})
