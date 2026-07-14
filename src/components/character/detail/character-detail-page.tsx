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
    <div className="flex h-[100svh] w-full min-w-[1180px] flex-col px-4 py-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <CharacterSheetHeader character={data} />
        <CharacterSheetWorkspace character={data} />
      </div>
    </div>
  )
}
