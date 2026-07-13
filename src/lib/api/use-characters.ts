"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { deleteCharacter, fetchCharacters } from "@/lib/api/characters"
import { createApiClient } from "@/lib/api/client"

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
