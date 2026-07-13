import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { CreateCharacterFormDto } from "@/dto/character/create-character.dto"
import { characterQueryKeys } from "@/lib/api/character-query-keys"
import type { CharacterListItem, CreatedCharacter } from "@/types/character"

const authState = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  isLoaded: true,
  userId: "user-a" as string | null,
}))

const apiMocks = vi.hoisted(() => ({
  createCharacterWithPortrait: vi.fn(),
  deleteCharacter: vi.fn(),
  fetchCharacters: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => authState,
}))

vi.mock("@/lib/api/characters", () => apiMocks)

import {
  CharacterSessionRequiredError,
  useCharacters,
  useCreateCharacter,
  useDeleteCharacter,
} from "@/lib/api/use-characters"

const createInput: CreateCharacterFormDto = {
  age: null,
  name: "Армитедж",
  portrait: null,
  sex: null,
}

function character(id: string): CharacterListItem {
  return {
    age: null,
    birthplace: null,
    created_at: "2026-01-01T00:00:00Z",
    hp: { current: 1, max: 1 },
    id,
    luck: { current: 1, starting: 1 },
    mp: { current: 1, max: 1 },
    name: id,
    occupation: null,
    portrait_url: null,
    residence: null,
    sanity: { current: 1, max: 1 },
    sex: null,
    updated_at: "2026-01-01T00:00:00Z",
  }
}

function createdCharacter(id: string): CreatedCharacter {
  return {
    age: null,
    id,
    name: id,
    portrait_url: null,
    sex: null,
  }
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 30_000 },
    },
  })
}

function wrapper(queryClient: QueryClient) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe("character query hooks", () => {
  beforeEach(() => {
    authState.getToken.mockClear()
    authState.isLoaded = true
    authState.userId = "user-a"
    apiMocks.createCharacterWithPortrait.mockReset()
    apiMocks.deleteCharacter.mockReset()
    apiMocks.fetchCharacters.mockReset()
  })

  it("fetches a separate list after the active user changes", async () => {
    apiMocks.fetchCharacters.mockImplementation(async () => [
      character(authState.userId ?? "anonymous"),
    ])
    const queryClient = createQueryClient()
    const { result, rerender } = renderHook(() => useCharacters(), {
      wrapper: wrapper(queryClient),
    })

    await waitFor(() => expect(result.current.data?.[0]?.id).toBe("user-a"))
    expect(queryClient.getQueryData(characterQueryKeys.list("user-a"))).toEqual(
      [character("user-a")],
    )

    authState.userId = "user-b"
    rerender()

    expect(result.current.data).toBeUndefined()
    await waitFor(() => expect(result.current.data?.[0]?.id).toBe("user-b"))
    expect(apiMocks.fetchCharacters).toHaveBeenCalledTimes(2)
  })

  it("invalidates only the current user after delete", async () => {
    apiMocks.deleteCharacter.mockResolvedValue(undefined)
    const queryClient = createQueryClient()
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries")
    const { result } = renderHook(() => useDeleteCharacter(), {
      wrapper: wrapper(queryClient),
    })

    await act(() => result.current.mutateAsync("character-1"))

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: characterQueryKeys.list("user-a"),
    })
  })

  it("invalidates only the current user after create settles", async () => {
    apiMocks.createCharacterWithPortrait.mockResolvedValue({
      character: createdCharacter("character-1"),
      portraitStatus: "not_requested",
    })
    const queryClient = createQueryClient()
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries")
    const { result } = renderHook(() => useCreateCharacter(), {
      wrapper: wrapper(queryClient),
    })

    await act(() => result.current.mutateAsync(createInput))

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: characterQueryKeys.list("user-a"),
    })
  })

  it("blocks character mutations after the session disappears", async () => {
    authState.userId = null
    const queryClient = createQueryClient()
    const deleteHook = renderHook(() => useDeleteCharacter(), {
      wrapper: wrapper(queryClient),
    })
    const createHook = renderHook(() => useCreateCharacter(), {
      wrapper: wrapper(queryClient),
    })

    await expect(
      act(() => deleteHook.result.current.mutateAsync("character-1")),
    ).rejects.toBeInstanceOf(CharacterSessionRequiredError)
    await expect(
      act(() => createHook.result.current.mutateAsync(createInput)),
    ).rejects.toBeInstanceOf(CharacterSessionRequiredError)
    expect(apiMocks.deleteCharacter).not.toHaveBeenCalled()
    expect(apiMocks.createCharacterWithPortrait).not.toHaveBeenCalled()
  })
})
