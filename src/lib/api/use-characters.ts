"use client"

import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { fetchCharacters } from "@/lib/api/characters"
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
