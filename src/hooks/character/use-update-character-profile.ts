"use client"

import { useMutation } from "@tanstack/react-query"

import type { CharacterProfilePatch } from "@/dto/character/character-profile.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { updateCharacterProfile } from "@/lib/api/character-profile"

export function useUpdateCharacterProfile(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    scope: { id: `character-profile:${characterId}` },
    mutationFn: (input: CharacterProfilePatch) => {
      context.requireSession()
      return updateCharacterProfile(context.api, characterId, input)
    },
    onSuccess: (_profile, patch) => {
      context.updateDetail((character) =>
        character ? { ...character, ...patch } : character,
      )
      context.invalidateDetail()
    },
  })
}
