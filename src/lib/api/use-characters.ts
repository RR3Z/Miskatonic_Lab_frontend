"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import type { CreateCharacterFormDto } from "@/dto/character/create-character.dto"
import { characterQueryKeys } from "@/lib/api/character-query-keys"
import { CharacterSessionRequiredError } from "@/lib/api/character-session-required-error"
import {
  createCharacterWithPortrait,
  deleteCharacter,
  fetchCharacter,
  fetchCharacters,
} from "@/lib/api/characters"
import { createApiClient } from "@/lib/api/client"
import { removeCharacterSheetLayout } from "@/lib/utils/character-sheet-layout.util"
import type { CharacterListItem } from "@/types/character"

export function useCharacters() {
  const { getToken, isLoaded, userId } = useAuth()
  const api = useMemo(() => createApiClient(getToken), [getToken])

  return useQuery({
    queryKey: userId ? characterQueryKeys.list(userId) : characterQueryKeys.all,
    queryFn: () => fetchCharacters(api),
    enabled: isLoaded && Boolean(userId),
  })
}

export function useCharacter(characterId: string) {
  const { getToken, isLoaded, userId } = useAuth()
  const api = useMemo(() => createApiClient(getToken), [getToken])

  return useQuery({
    queryKey:
      userId && characterId
        ? characterQueryKeys.detail(userId, characterId)
        : characterQueryKeys.all,
    queryFn: () => fetchCharacter(api, characterId),
    enabled: isLoaded && Boolean(userId) && Boolean(characterId),
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
    onSuccess: (_, characterId) => {
      removeCharacterSheetLayout(characterId)
      if (queryKey) {
        queryClient.setQueryData<CharacterListItem[]>(queryKey, (characters) =>
          characters?.filter((character) => character.id !== characterId),
        )
        void queryClient.invalidateQueries({ queryKey })
      }
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
      return createCharacterWithPortrait(api, input)
    },
    onSettled: () => {
      if (queryKey) void queryClient.invalidateQueries({ queryKey })
    },
  })
}
