import { CharacterDetailPage } from "@/components/character/detail/character-detail-page"
import { LandingBackground } from "@/components/landing/landing-background"

type CharacterPageProps = {
  params: Promise<{ characterId: string }>
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { characterId } = await params

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <div className="fixed inset-0">
        <LandingBackground />
      </div>
      <main className="relative z-10 flex-1">
        <CharacterDetailPage characterId={characterId} />
      </main>
    </div>
  )
}
