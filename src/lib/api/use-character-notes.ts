"use client"

import { useMutation } from "@tanstack/react-query"

import type { CreateCharacterNoteDto } from "@/dto/character/create-character-note.dto"
import {
  createCharacterNote,
  deleteCharacterNote,
  updateCharacterNote,
} from "@/lib/api/character-notes"
import { useCharacterMutationContext } from "@/lib/api/use-character-mutation-context"

export function useCreateCharacterNote(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CreateCharacterNoteDto) => {
      context.requireSession()
      return createCharacterNote(context.api, characterId, input)
    },
    onSuccess: (note) => {
      context.updateDetail((character) =>
        character
          ? { ...character, notes: [...(character.notes ?? []), note] }
          : character,
      )
      context.invalidateDetail()
    },
  })
}

export function useUpdateCharacterNote(characterId: string, noteId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CreateCharacterNoteDto) => {
      context.requireSession()
      return updateCharacterNote(context.api, characterId, noteId, input)
    },
    onSuccess: (updatedNote) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              notes: (character.notes ?? []).map((note) =>
                note.id === noteId ? updatedNote : note,
              ),
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}

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
