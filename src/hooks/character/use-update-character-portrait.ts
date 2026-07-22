"use client"

import { useMutation } from "@tanstack/react-query"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { uploadCharacterPortrait } from "@/lib/api/characters"

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
