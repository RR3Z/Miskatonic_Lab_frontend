"use client"

import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { characterQueryKeys } from "@/lib/api/character-query-keys"
import { fetchCharacters } from "@/lib/api/characters"
import { createApiClient } from "@/lib/api/client"

export function useCharacters() {
  const { getToken, isLoaded, userId } = useAuth()
  const api = useMemo(() => createApiClient(getToken), [getToken])

  return useQuery({
    queryKey: userId ? characterQueryKeys.list(userId) : characterQueryKeys.all,
    queryFn: () => fetchCharacters(api),
    enabled: isLoaded && Boolean(userId),
  })
}
