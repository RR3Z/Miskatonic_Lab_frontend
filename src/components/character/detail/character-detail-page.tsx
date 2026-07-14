"use client"

import { CharacterDetailError } from "@/components/character/detail/character-detail-error"
import { CharacterDetailLoading } from "@/components/character/detail/character-detail-loading"
import { CharacterSheetHeader } from "@/components/character/detail/header/character-sheet-header"
import { isCharacterNotFoundError } from "@/components/character/detail/is-character-not-found-error"
import { CharacterSheetWorkspace } from "@/components/character/detail/layout/character-sheet-workspace"
import { useCharacter } from "@/lib/api/use-characters"

type CharacterDetailPageProps = {
  characterId: string
}

export function CharacterDetailPage({ characterId }: CharacterDetailPageProps) {
  const { data, error, isFetching, isPending, refetch } =
    useCharacter(characterId)

  if (isPending) return <CharacterDetailLoading />

  if (error || !data) {
    return (
      <CharacterDetailError
        isFetching={isFetching}
        notFound={isCharacterNotFoundError(error)}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <div className="flex min-h-[100svh] w-full min-w-0 flex-col px-3 py-3 sm:px-4 sm:py-4 xl:h-[100svh]">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <CharacterSheetHeader character={data} />
        <CharacterSheetWorkspace character={data} />
      </div>
    </div>
  )
}
