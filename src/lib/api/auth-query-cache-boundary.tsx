"use client"

import { useAuth } from "@clerk/nextjs"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

import { characterQueryKeys } from "@/lib/api/character-query-keys"

type AuthQueryCacheBoundaryProps = {
  children: React.ReactNode
}

export function AuthQueryCacheBoundary({
  children,
}: AuthQueryCacheBoundaryProps) {
  const { isLoaded, userId } = useAuth()
  const queryClient = useQueryClient()
  const previousUserId = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    if (!isLoaded) return

    const previous = previousUserId.current

    if (previous && previous !== userId) {
      queryClient.removeQueries({
        exact: true,
        queryKey: characterQueryKeys.list(previous),
      })
    }

    previousUserId.current = userId ?? null
  }, [isLoaded, queryClient, userId])

  return children
}
