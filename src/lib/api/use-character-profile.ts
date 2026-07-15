"use client"

import { useMutation } from "@tanstack/react-query"

import type { CharacterProfilePatch } from "@/dto/character/character-profile.dto"
import { updateCharacterProfile } from "@/lib/api/character-profile"
import { uploadCharacterPortrait } from "@/lib/api/characters"
import { useCharacterMutationContext } from "@/lib/api/use-character-mutation-context"

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

export function useUpdateCharacterPortrait(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (portrait: File) => {
      context.requireSession()
      return uploadCharacterPortrait(context.api, characterId, portrait)
    },
    onSuccess: (profile) => {
      context.updateDetail((character) =>
        character
          ? { ...character, portrait_url: profile.portrait_url }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
