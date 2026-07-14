"use client"

import { CharacterDetailError } from "@/components/character/detail/character-detail-error"
import { CharacterDetailLoading } from "@/components/character/detail/character-detail-loading"
import { CharacterSheetHeader } from "@/components/character/detail/character-sheet-header"
import { CharacterSheetWorkspace } from "@/components/character/detail/character-sheet-workspace"
import { useCharacter } from "@/lib/api/use-characters"

type CharacterDetailPageProps = {
  characterId: string
}

function isNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    error.response instanceof Response &&
    error.response.status === 404
  )
}

export function CharacterDetailPage({ characterId }: CharacterDetailPageProps) {
  const { data, error, isFetching, isPending, refetch } =
    useCharacter(characterId)

  if (isPending) return <CharacterDetailLoading />

  if (error || !data) {
    return (
      <CharacterDetailError
        isFetching={isFetching}
        notFound={isNotFoundError(error)}
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
