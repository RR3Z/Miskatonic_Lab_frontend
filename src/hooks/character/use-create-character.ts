"use client"

import { useAuth } from "@clerk/nextjs"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useMemo } from "react"

import type { CreateCharacterFormDto } from "@/dto/character/create-character.dto"

import { characterQueryKeys } from "@/lib/api/character-query-keys"

import { CharacterSessionRequiredError } from "@/lib/api/character-session-required-error"

import { createCharacterWithPortrait } from "@/lib/api/characters"

import { createApiClient } from "@/lib/api/client"

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
