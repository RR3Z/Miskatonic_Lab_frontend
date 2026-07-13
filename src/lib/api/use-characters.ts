"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import type { CreateCharacterFormDto } from "@/dto/character/create-character.dto"
import { characterQueryKeys } from "@/lib/api/character-query-keys"
import {
  createCharacter,
  deleteCharacter,
  fetchCharacters,
  uploadCharacterPortrait,
} from "@/lib/api/characters"
import { createApiClient } from "@/lib/api/client"
import type { CreatedCharacter } from "@/types/character"

export class CharacterPortraitUploadError extends Error {
  readonly character: CreatedCharacter

  constructor(character: CreatedCharacter, options: ErrorOptions) {
    super("character created, but portrait upload failed", options)
    this.name = "CharacterPortraitUploadError"
    this.character = character
  }
}

export class CharacterSessionRequiredError extends Error {
  constructor() {
    super("an authenticated user is required for character mutations")
    this.name = "CharacterSessionRequiredError"
  }
}

export function useCharacters() {
  const { getToken, isLoaded, userId } = useAuth()
  const api = useMemo(() => createApiClient(getToken), [getToken])

  return useQuery({
    queryKey: userId ? characterQueryKeys.list(userId) : characterQueryKeys.all,
    queryFn: () => fetchCharacters(api),
    enabled: isLoaded && Boolean(userId),
  })
}

export function useDeleteCharacter() {
  const { getToken, userId } = useAuth()
  const api = useMemo(() => createApiClient(getToken), [getToken])
  const queryClient = useQueryClient()
  const queryKey = userId ? characterQueryKeys.list(userId) : null

  return useMutation({
    mutationFn: (characterId: string) => {
      if (!userId) throw new CharacterSessionRequiredError()
      return deleteCharacter(api, characterId)
    },
    onSuccess: () => {
      if (queryKey) void queryClient.invalidateQueries({ queryKey })
    },
  })
}

export function useCreateCharacter() {
  const { getToken, userId } = useAuth()
  const api = useMemo(() => createApiClient(getToken), [getToken])
  const queryClient = useQueryClient()
  const queryKey = userId ? characterQueryKeys.list(userId) : null

  return useMutation({
    mutationFn: async (input: CreateCharacterFormDto) => {
      if (!userId) throw new CharacterSessionRequiredError()

      const character = await createCharacter(api, input)
      if (!input.portrait) return character

      try {
        return await uploadCharacterPortrait(api, character.id, input.portrait)
      } catch (error) {
        throw new CharacterPortraitUploadError(character, { cause: error })
      }
    },
    onSettled: () => {
      if (queryKey) void queryClient.invalidateQueries({ queryKey })
    },
  })
}
