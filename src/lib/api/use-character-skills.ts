"use client"

import { useMutation } from "@tanstack/react-query"

import {
  type CharacterSkillInput,
  createCharacterSkill,
  deleteCharacterSkill,
  updateCharacterSkill,
} from "@/lib/api/character-skills"
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

export function useCreateCharacterSkill(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterSkillInput) => {
      context.requireSession()
      return createCharacterSkill(context.api, characterId, input)
    },
    onSuccess: (createdSkill) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              skills: [...(character.skills ?? []), createdSkill],
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}

export function useUpdateCharacterSkill(characterId: string, skillId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterSkillInput) => {
      context.requireSession()
      return updateCharacterSkill(context.api, characterId, skillId, input)
    },
    onSuccess: (updatedSkill) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              skills: (character.skills ?? []).map((skill) =>
                skill.id === skillId ? updatedSkill : skill,
              ),
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
