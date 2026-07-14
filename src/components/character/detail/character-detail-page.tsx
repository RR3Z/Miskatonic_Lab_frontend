"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { CharacterDetailError } from "@/components/character/detail/character-detail-error"
import { CharacterDetailLoading } from "@/components/character/detail/character-detail-loading"
import { CharacterSheetHeader } from "@/components/character/detail/character-sheet-header"
import { CharacterSheetWorkspace } from "@/components/character/detail/character-sheet-workspace"
import { Button } from "@/components/ui/button"
import { useCharacter } from "@/lib/api/use-characters"
import { appRoutes } from "@/lib/routes/app-routes"

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
    <div className="mx-auto w-full min-w-[1180px] max-w-[1720px] px-8 py-6">
      <Button asChild size="sm" variant="ghost">
        <Link href={appRoutes.characters}>
          <ArrowLeft aria-hidden="true" />К списку персонажей
        </Link>
      </Button>
      <div className="mt-3 space-y-4">
        <CharacterSheetHeader character={data} />
        <CharacterSheetWorkspace characterId={characterId} />
      </div>
    </div>
  )
}
