"use client"

import { useAuth } from "@clerk/nextjs"
import {
  type QueryKey,
  type Updater,
  useQueryClient,
} from "@tanstack/react-query"
import { useMemo } from "react"

import { characterQueryKeys } from "@/lib/api/character-query-keys"
import { CharacterSessionRequiredError } from "@/lib/api/character-session-required-error"
import { createApiClient } from "@/lib/api/client"
import type { CharacterDetail } from "@/types/character.types"

export function useCharacterMutationContext(characterId: string) {
  const { getToken, userId } = useAuth()
  const api = useMemo(() => createApiClient(getToken), [getToken])
  const queryClient = useQueryClient()
  const queryKey = userId
    ? characterQueryKeys.detail(userId, characterId)
    : null

  function requireSession() {
    if (!userId) throw new CharacterSessionRequiredError()
  }

  function updateDetail(
    updater: Updater<CharacterDetail | undefined, CharacterDetail | undefined>,
  ) {
    if (!queryKey) return
    queryClient.setQueryData<CharacterDetail>(queryKey, updater)
  }

  function invalidateDetail() {
    if (queryKey) void queryClient.invalidateQueries({ queryKey })
  }

  return {
    api,
    invalidateDetail,
    queryKey: queryKey as QueryKey | null,
    requireSession,
    updateDetail,
  }
}
