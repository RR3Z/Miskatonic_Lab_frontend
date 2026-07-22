"use client"

import { AnimatePresence, useReducedMotion } from "motion/react"
import { CharacterCard } from "@/components/character/character-card"
import { CreateCharacterCard } from "@/components/character/create/create-character-card"
import { CharacterListError } from "@/components/character/list/character-list-error"
import { CharacterListLoading } from "@/components/character/list/character-list-loading"
import { CharacterListMotionItem } from "@/components/character/list/character-list-motion-item"
import { CreateCharacterMotionItem } from "@/components/character/list/create-character-motion-item"
import localizedContent from "@/data/locales/ru/character/list.ru.json"
import type { CharacterListItem } from "@/types/character.types"

type CharacterListContentProps = {
  atLimit: boolean
  characters: CharacterListItem[]
  hasLoadError: boolean
  isFetching: boolean
  isLoading: boolean
  onCreate: () => void
  onDelete: (characterId: string) => Promise<void>
  onRetry: () => void
}

export function CharacterListContent({
  atLimit,
  characters,
  hasLoadError,
  isFetching,
  isLoading,
  onCreate,
  onDelete,
  onRetry,
}: CharacterListContentProps) {
  const shouldReduceMotion = Boolean(useReducedMotion())

  return (
    <section
      aria-busy={isLoading || isFetching}
      aria-label={
        localizedContent.copy.componentsCharacterListCharacterListContent
          .spisokPersonazhei
      }
      className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {isLoading ? (
        <CharacterListLoading />
      ) : hasLoadError ? (
        <CharacterListError isFetching={isFetching} onRetry={onRetry} />
      ) : (
        <AnimatePresence initial={!shouldReduceMotion} mode="popLayout">
          {characters.map((character, index) => (
            <CharacterListMotionItem
              index={index}
              key={character.id}
              reducedMotion={shouldReduceMotion}
            >
              <CharacterCard character={character} onDelete={onDelete} />
            </CharacterListMotionItem>
          ))}
          {!atLimit ? (
            <CreateCharacterMotionItem
              index={characters.length}
              key="create-character"
              reducedMotion={shouldReduceMotion}
            >
              <CreateCharacterCard onCreate={onCreate} />
            </CreateCharacterMotionItem>
          ) : null}
        </AnimatePresence>
      )}
    </section>
  )
}
