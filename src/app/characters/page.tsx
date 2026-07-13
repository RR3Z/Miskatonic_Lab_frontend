import { CharacterListPage } from "@/components/character/character-list-page"
import { LandingBackground } from "@/components/landing/landing-background"

export default function CharactersPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <div className="fixed inset-0">
        <LandingBackground />
      </div>
      <main className="relative z-10 flex-1">
        <CharacterListPage />
      </main>
    </div>
  )
}
