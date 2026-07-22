import { act, renderHook, waitFor } from "@testing-library/react"
import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@tests/helpers/react-query"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { CreateCharacterFormDto } from "@/dto/character/create-character.dto"
import { characterQueryKeys } from "@/lib/api/character-query-keys"
import { characterSheetLayoutStorageKey } from "@/lib/utils/character-sheet-layout.util"
import type {
  CharacterDetail,
  CharacterListItem,
  CreatedCharacter,
} from "@/types/character.types"

const authState = vi.hoisted(() => ({
  getToken: vi.fn(async () => "test-token"),
  isLoaded: true,
  userId: "user-a" as string | null,
}))

const apiMocks = vi.hoisted(() => ({
  createCharacterNote: vi.fn(),
  createCharacterWithPortrait: vi.fn(),
  deleteCharacter: vi.fn(),
  fetchCharacter: vi.fn(),
  fetchCharacters: vi.fn(),
}))

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => authState,
}))

vi.mock("@/lib/api/characters", () => apiMocks)
vi.mock("@/lib/api/character-notes", () => ({
  createCharacterNote: apiMocks.createCharacterNote,
}))

import { useCharacter } from "@/hooks/character/use-character"
import { useCharacters } from "@/hooks/character/use-characters"
import { useCreateCharacter } from "@/hooks/character/use-create-character"
import { useCreateCharacterNote } from "@/hooks/character/use-create-character-note"
import { useDeleteCharacter } from "@/hooks/character/use-delete-character"
import { CharacterSessionRequiredError } from "@/lib/api/character-session-required-error"

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

function characterDetail(id: string): CharacterDetail {
  return {
    age: null,
    backstory: {
      character_id: id,
      created_at: null,
      id: null,
      items: [],
      personal_description: null,
      updated_at: null,
    },
    birthplace: null,
    characteristics: {
      appearance: null,
      character_id: id,
      constitution: null,
      created_at: null,
      dexterity: null,
      education: null,
      id: null,
      intelligence: null,
      power: null,
      size: null,
      strength: null,
      updated_at: null,
    },
    created_at: "2026-01-01T00:00:00Z",
    derived_stats: {
      character_id: id,
      created_at: null,
      damage_bonus: null,
      dodge_value: null,
      id: null,
      physique: null,
      speed: null,
      updated_at: null,
    },
    finances: {
      assets: null,
      cash: null,
      created_at: null,
      id: null,
      spending_limit: null,
      updated_at: null,
    },
    hp: {
      character_id: id,
      created_at: null,
      current_hp: 1,
      dead: false,
      dying: false,
      id: null,
      major_wound: false,
      max_hp: 1,
      unconscious: false,
      updated_at: null,
    },
    id,
    inventory: null,
    luck: {
      character_id: id,
      created_at: null,
      current_luck: 1,
      id: null,
      starting_luck: 1,
      updated_at: null,
    },
    mp: {
      character_id: id,
      created_at: null,
      current_mp: 1,
      id: null,
      max_mp: 1,
      updated_at: null,
    },
    name: id,
    notes: [],
    occupation: null,
    portrait_url: null,
    residence: null,
    sanity: {
      character_id: id,
      created_at: null,
      current_sanity: 1,
      id: null,
      indef_insanity: false,
      max_sanity: 1,
      temp_insanity: false,
      updated_at: null,
    },
    sex: null,
    skills: [],
    updated_at: "2026-01-01T00:00:00Z",
    user_id: "user-a",
  }
}

describe("character query hooks", () => {
  beforeEach(() => {
    window.localStorage.clear()
    authState.getToken.mockClear()
    authState.isLoaded = true
    authState.userId = "user-a"
    apiMocks.createCharacterNote.mockReset()
    apiMocks.createCharacterWithPortrait.mockReset()
    apiMocks.deleteCharacter.mockReset()
    apiMocks.fetchCharacter.mockReset()
    apiMocks.fetchCharacters.mockReset()
  })

  it("fetches a separate list after the active user changes", async () => {
    apiMocks.fetchCharacters.mockImplementation(async () => [
      character(authState.userId ?? "anonymous"),
    ])
    const queryClient = createTestQueryClient({ staleTime: 30_000 })
    const { result, rerender } = renderHook(() => useCharacters(), {
      wrapper: createQueryClientWrapper(queryClient),
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

  it("stores detail data under the active user and character id", async () => {
    apiMocks.fetchCharacter.mockImplementation(
      async (_api: unknown, id: string) => characterDetail(id),
    )
    const queryClient = createTestQueryClient({ staleTime: 30_000 })
    const { result } = renderHook(() => useCharacter("character-1"), {
      wrapper: createQueryClientWrapper(queryClient),
    })

    await waitFor(() => expect(result.current.data?.id).toBe("character-1"))
    expect(
      queryClient.getQueryData(
        characterQueryKeys.detail("user-a", "character-1"),
      ),
    ).toEqual(characterDetail("character-1"))
  })

  it("removes the deleted character from the current user cache and invalidates it", async () => {
    apiMocks.deleteCharacter.mockResolvedValue(undefined)
    const layoutKey = characterSheetLayoutStorageKey("character-1")
    window.localStorage.setItem(layoutKey, '{"character-core":42}')
    const queryClient = createTestQueryClient({ staleTime: 30_000 })
    queryClient.setQueryData(characterQueryKeys.list("user-a"), [
      character("character-1"),
      character("character-2"),
    ])
    queryClient.setQueryData(characterQueryKeys.list("user-b"), [
      character("character-1"),
    ])
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries")
    const { result } = renderHook(() => useDeleteCharacter(), {
      wrapper: createQueryClientWrapper(queryClient),
    })

    await act(() => result.current.mutateAsync("character-1"))

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: characterQueryKeys.list("user-a"),
    })
    expect(queryClient.getQueryData(characterQueryKeys.list("user-a"))).toEqual(
      [character("character-2")],
    )
    expect(queryClient.getQueryData(characterQueryKeys.list("user-b"))).toEqual(
      [character("character-1")],
    )
    expect(window.localStorage.getItem(layoutKey)).toBeNull()
  })

  it("keeps the cached list unchanged when delete fails", async () => {
    apiMocks.deleteCharacter.mockRejectedValue(new Error("failed"))
    const layoutKey = characterSheetLayoutStorageKey("character-1")
    window.localStorage.setItem(layoutKey, '{"character-core":42}')
    const queryClient = createTestQueryClient({ staleTime: 30_000 })
    const cachedCharacters = [
      character("character-1"),
      character("character-2"),
    ]
    queryClient.setQueryData(
      characterQueryKeys.list("user-a"),
      cachedCharacters,
    )
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries")
    const { result } = renderHook(() => useDeleteCharacter(), {
      wrapper: createQueryClientWrapper(queryClient),
    })

    await expect(
      act(() => result.current.mutateAsync("character-1")),
    ).rejects.toThrow("failed")

    expect(queryClient.getQueryData(characterQueryKeys.list("user-a"))).toEqual(
      cachedCharacters,
    )
    expect(invalidateQueries).not.toHaveBeenCalled()
    expect(window.localStorage.getItem(layoutKey)).not.toBeNull()
  })

  it("invalidates only the current user after create settles", async () => {
    apiMocks.createCharacterWithPortrait.mockResolvedValue({
      character: createdCharacter("character-1"),
      portraitStatus: "not_requested",
    })
    const queryClient = createTestQueryClient({ staleTime: 30_000 })
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries")
    const { result } = renderHook(() => useCreateCharacter(), {
      wrapper: createQueryClientWrapper(queryClient),
    })

    await act(() => result.current.mutateAsync(createInput))

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: characterQueryKeys.list("user-a"),
    })
  })

  it("appends a created note to the active character detail cache", async () => {
    const note = {
      body: "Проверить архив.",
      character_id: "character-1",
      created_at: "2026-01-01T00:00:00Z",
      id: "note-1",
      title: "Зацепка",
      updated_at: "2026-01-01T00:00:00Z",
    }
    apiMocks.createCharacterNote.mockResolvedValue(note)
    const queryClient = createTestQueryClient({ staleTime: 30_000 })
    const queryKey = characterQueryKeys.detail("user-a", "character-1")
    queryClient.setQueryData(queryKey, characterDetail("character-1"))
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries")
    const { result } = renderHook(() => useCreateCharacterNote("character-1"), {
      wrapper: createQueryClientWrapper(queryClient),
    })

    await act(() =>
      result.current.mutateAsync({
        body: note.body,
        title: note.title,
      }),
    )

    expect(apiMocks.createCharacterNote).toHaveBeenCalledWith(
      expect.anything(),
      "character-1",
      { body: note.body, title: note.title },
    )
    expect(queryClient.getQueryData<CharacterDetail>(queryKey)?.notes).toEqual([
      note,
    ])
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey })
  })

  it("blocks character mutations after the session disappears", async () => {
    authState.userId = null
    const queryClient = createTestQueryClient({ staleTime: 30_000 })
    const deleteHook = renderHook(() => useDeleteCharacter(), {
      wrapper: createQueryClientWrapper(queryClient),
    })
    const createHook = renderHook(() => useCreateCharacter(), {
      wrapper: createQueryClientWrapper(queryClient),
    })
    const createNoteHook = renderHook(
      () => useCreateCharacterNote("character-1"),
      { wrapper: createQueryClientWrapper(queryClient) },
    )

    await expect(
      act(() => deleteHook.result.current.mutateAsync("character-1")),
    ).rejects.toBeInstanceOf(CharacterSessionRequiredError)
    await expect(
      act(() => createHook.result.current.mutateAsync(createInput)),
    ).rejects.toBeInstanceOf(CharacterSessionRequiredError)
    await expect(
      act(() =>
        createNoteHook.result.current.mutateAsync({
          body: "Текст",
          title: "Заметка",
        }),
      ),
    ).rejects.toBeInstanceOf(CharacterSessionRequiredError)
    expect(apiMocks.deleteCharacter).not.toHaveBeenCalled()
    expect(apiMocks.createCharacterWithPortrait).not.toHaveBeenCalled()
    expect(apiMocks.createCharacterNote).not.toHaveBeenCalled()
  })
})
