"use client"

import { useAuth } from "@clerk/nextjs"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useMemo } from "react"

import { characterQueryKeys } from "@/lib/api/character-query-keys"

import { CharacterSessionRequiredError } from "@/lib/api/character-session-required-error"

import { deleteCharacter } from "@/lib/api/characters"

import { createApiClient } from "@/lib/api/client"

import { removeCharacterSheetLayout } from "@/lib/utils/character-sheet-layout.util"

import type { CharacterListItem } from "@/types/character.types"

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
