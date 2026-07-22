"use client"

import { useMutation } from "@tanstack/react-query"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { deleteCharacterNote } from "@/lib/api/character-notes"

export function useDeleteCharacterNote(characterId: string, noteId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: () => {
      context.requireSession()
      return deleteCharacterNote(context.api, characterId, noteId)
    },
    onSuccess: () => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              notes: (character.notes ?? []).filter(
                (note) => note.id !== noteId,
              ),
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
