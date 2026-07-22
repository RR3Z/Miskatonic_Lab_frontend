"use client"

import { useMutation } from "@tanstack/react-query"

import type { CharacterInventoryItemDto } from "@/dto/character/character-inventory-item.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { createCharacterInventoryItem } from "@/lib/api/character-inventory"

export function useCreateCharacterInventoryItem(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterInventoryItemDto) => {
      context.requireSession()
      return createCharacterInventoryItem(context.api, characterId, input)
    },
    onSuccess: (item) => {
      context.updateDetail((character) =>
        character
          ? { ...character, inventory: [item, ...(character.inventory ?? [])] }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
