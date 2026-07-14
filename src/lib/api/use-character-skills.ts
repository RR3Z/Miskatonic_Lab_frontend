"use client"

import { useMutation } from "@tanstack/react-query"

import { deleteCharacterSkill } from "@/lib/api/character-skills"
import { useCharacterMutationContext } from "@/lib/api/use-character-mutation-context"

export function useDeleteCharacterSkill(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (skillId: string) => {
      context.requireSession()
      return deleteCharacterSkill(context.api, characterId, skillId)
    },
    onSuccess: (_, skillId) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              skills: (character.skills ?? []).filter(
                (skill) => skill.id !== skillId,
              ),
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
