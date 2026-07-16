import { CharacterDetailPage } from "@/components/character/detail/character-detail-page"
import { LandingBackground } from "@/components/landing/landing-background"

type CharacterPageProps = {
  params: Promise<{ characterId: string }>
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { characterId } = await params

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden bg-(--ml-bg-page) text-(--ml-ink-primary) xl:h-svh xl:max-h-svh xl:min-h-0 xl:overflow-hidden">
      <div className="fixed inset-0">
        <LandingBackground />
      </div>
      <main className="relative z-10 flex min-h-0 flex-1 flex-col xl:overflow-hidden">
        <CharacterDetailPage characterId={characterId} />
      </main>
    </div>
  )
}
