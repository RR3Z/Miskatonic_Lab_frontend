"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import type { CreateCharacterFormDto } from "@/dto/character/create-character.dto"
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

export function useCharacters() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const api = useMemo(() => createApiClient(getToken), [getToken])

  return useQuery({
    queryKey: ["characters"],
    queryFn: () => fetchCharacters(api),
    enabled: isLoaded && isSignedIn,
  })
}

export function useDeleteCharacter() {
  const { getToken } = useAuth()
  const api = useMemo(() => createApiClient(getToken), [getToken])
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (characterId: string) => deleteCharacter(api, characterId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["characters"] }),
  })
}

export function useCreateCharacter() {
  const { getToken } = useAuth()
  const api = useMemo(() => createApiClient(getToken), [getToken])
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateCharacterFormDto) => {
      const character = await createCharacter(api, input)
      if (!input.portrait) return character

      try {
        return await uploadCharacterPortrait(api, character.id, input.portrait)
      } catch (error) {
        throw new CharacterPortraitUploadError(character, { cause: error })
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["characters"] }),
  })
}
