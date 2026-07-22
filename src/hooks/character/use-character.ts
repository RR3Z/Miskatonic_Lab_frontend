"use client"

import { useAuth } from "@clerk/nextjs"

import { useQuery } from "@tanstack/react-query"

import { useMemo } from "react"

import { characterQueryKeys } from "@/lib/api/character-query-keys"

import { fetchCharacter } from "@/lib/api/characters"

import { createApiClient } from "@/lib/api/client"

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
